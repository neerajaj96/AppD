import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { ingestUnit, ingestConcept } from '../ingest';
import { adaptSystemsToV2 } from '../adapters';
import { v2UnitToVerse, v2ConceptToConcept } from '../compat';
import { rankEntries } from '../../../search/rank';
import type { CanonicalUnit } from '../schema';
import { systems } from '../../index';

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status });
}

function mockFetch(routes: Record<string, unknown>, calls: string[], mode: 'ok' | 'offline' = 'ok') {
  return async (url: string): Promise<Response> => {
    calls.push(url);
    if (mode === 'offline') throw new Error('fetch failed: offline');
    for (const [suffix, value] of Object.entries(routes)) {
      if (url.endsWith(suffix)) {
        if (typeof value === 'string' && value === '__404__') return new Response('nope', { status: 404 });
        if (typeof value === 'string' && value === '__bad-json__') {
          return new Response('{not json', { status: 200 });
        }
        return jsonResponse(value);
      }
    }
    return new Response('nope', { status: 404 });
  };
}

const unit: CanonicalUnit = {
  id: 'I.2',
  number: 'I.2',
  section: 'Samadhi',
  unitType: 'sutra',
  devanagari: 'योगश्चित्तवृत्तिनिरोधः',
  iast: 'yogaś-citta-vṛtti-nirodhaḥ',
  localisations: {
    en: { translation: 'Yoga is the stilling of the turnings of awareness.' },
    ml: { translation: 'യോഗം ചിത്തവൃത്തികളുടെ നിരോധമാണ്.' },
  },
  conceptIds: ['citta-vritti'],
};

const concept = {
  id: 'citta-vritti',
  relatedUnitIds: ['I.2'],
  relatedConceptIds: [] as string[],
  localisations: { en: { title: 'Citta-vrtti', summary: 'Turnings of awareness.' } },
};

const manifest = {
  schemaVersion: 2,
  generatedAt: '2026-01-01T00:00:00.000Z',
  traditions: [{ id: 'yoga', title: 'Yoga', category: 'philosophical-school', textIds: ['yoga-sutras'], threadSteps: 1 }],
  texts: [
    {
      textId: 'yoga-sutras',
      traditionId: 'yoga',
      title: 'Yoga Sutras',
      transliteratedTitle: 'Yoga Sutras',
      sourceRole: 'primary',
      contentStatus: 'complete',
      unitCount: 1,
      conceptCount: 1,
      threadSteps: 1,
      sections: [{ section: 'Samadhi', count: 1 }],
    },
  ],
};

const textManifest = {
  schemaVersion: 2,
  textId: 'yoga-sutras',
  traditionId: 'yoga',
  units: { expected: 1, present: 1 },
  languages: { en: { units: 1, concepts: 1 }, ml: { units: 1, concepts: 0 } },
  status: 'complete',
  title: 'Yoga Sutras',
  transliteratedTitle: 'Yoga Sutras',
  verseTerm: 'Sūtra',
  sections: [{ section: 'Samadhi', count: 1 }],
  conceptCount: 1,
  threadSteps: 1,
};

function routes() {
  return {
    'content/manifest.json': manifest,
    'yoga-sutras/manifest.json': textManifest,
    'yoga-sutras/meta.json': textManifest,
    'yoga-sutras/threads.json': [],
    'threads/yoga.json': [],
    'yoga-sutras/units/index.json': {
      textId: 'yoga-sutras',
      unitCount: 1,
      sections: [{ section: 'Samadhi', count: 1, chunk: 'chunk-0.json' }],
      chunks: ['chunk-0.json'],
    },
    'yoga-sutras/units/chunk-0.json': [unit],
    'yoga-sutras/concepts/index.json': { textId: 'yoga-sutras', conceptCount: 1, chunks: ['chunk-0.json'] },
    'yoga-sutras/concepts/chunk-0.json': [concept],
  };
}

describe('runtime content pipeline', () => {
  it('loads the global manifest and caches it', async () => {
    const calls: string[] = [];
    const loader = new FetchChunkLoader(mockFetch(routes(), calls));
    const first = await loader.loadGlobalManifest();
    const second = await loader.loadGlobalManifest();
    expect(first.status).toBe('ok');
    expect(second.status).toBe('ok');
    expect(calls.filter((c) => c.endsWith('content/manifest.json'))).toHaveLength(1);
  });

  it('reports missing chunks as missing, not as throws', async () => {
    const calls: string[] = [];
    const loader = new FetchChunkLoader(mockFetch(routes(), calls));
    const missing = await loader.loadTextManifest('no-such-text');
    expect(missing.status).toBe('missing');
    const unitMissing = await loader.loadUnit('yoga-sutras', 'no-such-unit');
    expect(unitMissing.status).toBe('missing');
  });

  it('reports malformed chunk JSON as an error', async () => {
    const calls: string[] = [];
    const bad = { ...routes(), 'yoga-sutras/units/chunk-0.json': '__bad-json__' };
    const loader = new FetchChunkLoader(mockFetch(bad, calls));
    const result = await loader.loadUnits('yoga-sutras');
    expect(result.status).toBe('error');
  });

  it('reports offline fetch failures as offline', async () => {
    const calls: string[] = [];
    const loader = new FetchChunkLoader(mockFetch(routes(), calls, 'offline'));
    const result = await loader.loadGlobalManifest();
    expect(result.status).toBe('offline');
  });

  it('resolves units and concepts through the repository', async () => {
    const calls: string[] = [];
    const repo = new V2Repository(new FetchChunkLoader(mockFetch(routes(), calls)));
    const foundUnit = await repo.getUnit('yoga-sutras', 'I.2');
    expect(foundUnit.status).toBe('ok');
    const foundConcept = await repo.getConcept('yoga-sutras', 'citta-vritti');
    expect(foundConcept.status).toBe('ok');
    const linked = await repo.getUnitConcepts('yoga-sutras', 'I.2');
    expect(linked.status).toBe('ok');
    if (linked.status === 'ok') expect(linked.data.map((c) => c.id)).toEqual(['citta-vritti']);
    const back = await repo.getConceptUnits('yoga-sutras', 'citta-vritti');
    expect(back.status).toBe('ok');
    if (back.status === 'ok') expect(back.data.map((u) => u.id)).toEqual(['I.2']);
  });

  it('flags duplicate IDs and dangling references in synthetic input', () => {
    const dupUnit = { ...unit };
    const corpus = {
      schemaVersion: 2 as const,
      traditions: [{ id: 'yoga', title: 'Yoga', category: 'philosophical-school' as const, textIds: ['yoga-sutras'], threadSteps: 0 }],
      texts: [
        {
          id: 'yoga-sutras',
          title: 'Yoga Sutras',
          transliteratedTitle: 'Yoga Sutras',
          traditionId: 'yoga',
          sourceRole: 'primary' as const,
          contentStatus: 'complete' as const,
          languages: ['en' as const],
          units: [unit, dupUnit],
          concepts: [{ ...concept, relatedUnitIds: ['missing-unit'] }],
        },
      ],
      aliases: [],
    };
    const result = validateCorpus(corpus);
    expect(result.errors.some((e) => e.code === 'duplicate-unit-id')).toBe(true);
    expect(result.errors.some((e) => e.code === 'dangling-unit-ref')).toBe(true);
  });

  it('ingestion warns on malformed content instead of throwing', () => {
    expect(ingestUnit({ number: '1' }).warnings.length).toBeGreaterThan(0);
    expect(ingestConcept({}).warnings.length).toBeGreaterThan(0);
  });

  it('preserves legacy IDs through adapter and compat converters', () => {
    const corpus = adaptSystemsToV2(systems);
    const yoga = corpus.texts.find((t) => t.id === 'yoga-sutras');
    expect(yoga).toBeDefined();
    const first = yoga?.units.find((u) => u.id === 'I.2');
    expect(first?.number).toBe('I.2');
    if (first) {
      const verse = v2UnitToVerse(first);
      expect(verse.id).toBe('I.2');
      expect(verse.number).toBe('I.2');
    }
    const satkarya = corpus.texts
      .flatMap((t) => t.concepts)
      .find((c) => c.id === 'satkaryavada');
    if (satkarya) expect(v2ConceptToConcept(satkarya).id).toBe('satkaryavada');
  });

  it('ranks diacritic-insensitive, Malayalam and Devanagari matches', () => {
    const entries = [
      { key: 'unit:yoga/yoga-sutras/I.2', traditionId: 'yoga', textId: 'yoga-sutras', unitId: 'I.2', kind: 'unit', number: 'I.2', title: 'I.2', en: 'stilling of the turnings', ml: '', devanagari: 'योगश्चित्तवृत्तिनिरोधः', iast: 'yogaś-citta-vṛtti-nirodhaḥ', normalised: 'yogash-citta-vritti-nirodhah stilling of the turnings i.2' },
      { key: 'concept:yoga/yoga-sutras/citta-vritti', traditionId: 'yoga', textId: 'yoga-sutras', conceptId: 'citta-vritti', kind: 'concept', title: 'Citta-vrtti', en: 'Citta-vrtti turnings of awareness', ml: 'ചിത്തവൃത്തി', devanagari: '', iast: 'citta-vṛtti', normalised: 'citta-vrtti turnings of awareness' },
    ] as Parameters<typeof rankEntries>[0];
    // ASCII query finds IAST with diacritics.
    expect(rankEntries(entries, 'citta')[0]?.entry.key).toContain('citta-vritti');
    // Devanagari query matches the unit.
    expect(rankEntries(entries, 'योग')[0]?.entry.kind).toBe('unit');
    // Malayalam query matches the concept.
    expect(rankEntries(entries, 'ചിത്ത')[0]?.entry.kind).toBe('concept');
    // Blank query returns nothing.
    expect(rankEntries(entries, '   ')).toEqual([]);
  });
});
