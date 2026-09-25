import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { buildTextSource, extractLocatorStems, formatSourceTable, joinSourceNotes, matchUnitEvidence, matchUnitLocator, matchUnitSources } from '../textSources';
import { CURATED_SOURCES_BY_TEXT, SOURCE_NOTE_PREFIXES } from '../curatedSources';
import { adaptSystemsToV2 } from '../adapters';
import { systems } from '../../../content/index';
import { formatCitation, unitCanonicalUrl } from '../citation';
import { deviMahatmyaSourceProvenance } from '../../../content/devi-mahatmya/devi-mahatmya-source-provenance';
import { uiStrings, type UIKey } from '../../../i18n/ui';
import type { V2Corpus, V2Source } from '../schema';

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

const source = (id: string, extra: Partial<V2Source> = {}): V2Source => ({
  id,
  title: `Title ${id}`,
  ...extra,
});

function corpusWith(textSources: V2Source[], unitSourceIds?: string[]): V2Corpus {
  return {
    schemaVersion: 2,
    traditions: [{ id: 't1', title: 'T1', category: 'philosophical-school' as const, textIds: ['x'], threadSteps: 0 }],
    texts: [
      {
        id: 'x',
        title: 'X',
        transliteratedTitle: 'X',
        traditionId: 't1',
        sourceRole: 'primary' as const,
        contentStatus: 'complete' as const,
        languages: ['en' as const],
        units: [
          {
            id: 'u1',
            number: '1',
            section: 'S',
            unitType: 'sutra' as const,
            iast: '',
            localisations: { en: { translation: 'T' }, ml: { translation: 'T-ml' } },
            sourceIds: unitSourceIds,
          },
        ],
        concepts: [],
        sources: textSources,
      },
    ],
    aliases: [],
  };
}

describe('text source records', () => {
  it('carries prose verbatim as notes without inventing fields', () => {
    const record = buildTextSource('dm', 'Devī Māhātmya', ['First statement.  ', '  ', 'Second statement.']);
    expect(record).toEqual({
      id: 'dm-source-notes',
      title: 'Devī Māhātmya',
      notes: 'First statement.\n\nSecond statement.',
    });
    expect(record).not.toHaveProperty('author');
    expect(record).not.toHaveProperty('year');
  });

  it('returns null when there is nothing to carry', () => {
    expect(buildTextSource('x', 'X', [])).toBeNull();
    expect(buildTextSource('x', 'X', '   ')).toBeNull();
  });

  it('formats legacy tables as plain note lines', () => {
    expect(formatSourceTable([{ appIds: 'dm-kavacha-* (51)', pdfPages: 'pp.31-46', note: 'Glosses.' }])).toBe(
      'dm-kavacha-* (51) pp.31-46 — Glosses.',
    );
    expect(joinSourceNotes(['a', '', 'b'])).toBe('a\n\nb');
  });
});

describe('source identity validation', () => {
  it('accepts a clean registry and empty registries alike', () => {
    expect(validateCorpus(corpusWith([source('s1', { author: 'A' })], ['s1'])).errors).toEqual([]);
    expect(validateCorpus(corpusWith([])).errors).toEqual([]);
  });

  it('rejects duplicate source ids within a text', () => {
    const result = validateCorpus(corpusWith([source('s1'), source('s1')]));
    expect(result.errors.map((e) => e.code)).toContain('duplicate-source-id');
  });

  it('rejects dangling unit sourceIds', () => {
    const result = validateCorpus(corpusWith([source('s1')], ['ghost']));
    expect(result.errors.map((e) => e.code)).toContain('dangling-source-ref');
  });

  it('rejects records without id or title', () => {
    const bad = { id: '', title: '  ' } as V2Source;
    const result = validateCorpus(corpusWith([bad]));
    expect(result.errors.map((e) => e.code)).toContain('malformed-source');
  });

  it('warns on malformed URLs but stays silent on unknown rights and gaps', () => {
    const warned = validateCorpus(corpusWith([source('s1', { url: 'not-a-url' })]));
    expect(warned.errors).toEqual([]);
    expect(warned.warnings.map((w) => w.code)).toContain('malformed-source-url');
    const quiet = validateCorpus(corpusWith([source('s1', { rights: 'unknown' })]));
    expect(quiet.errors).toEqual([]);
    expect(quiet.warnings).toEqual([]);
  });
});

describe('repository source lookup', () => {
  const records = [source('a1', { author: 'Anon' })];
  const routes = () => ({ 'yoga-sutras/sources.json': records });

  it('resolves sources and single records through the chunk cache', async () => {
    const calls: string[] = [];
    const repo = new V2Repository(new FetchChunkLoader(mockFetch(routes(), calls)));
    const all = await repo.getSources('yoga-sutras');
    expect(all).toEqual({ status: 'ok', data: records });
    const one = await repo.getSource('yoga-sutras', 'a1');
    expect(one).toEqual({ status: 'ok', data: records[0] });
    // Second lookup reuses the cached artifact: one fetch total.
    await repo.getSource('yoga-sutras', 'a1');
    expect(calls.filter((c) => c.endsWith('sources.json'))).toHaveLength(1);
  });

  it('reports unknown records as missing', async () => {
    const calls: string[] = [];
    const repo = new V2Repository(new FetchChunkLoader(mockFetch(routes(), calls)));
    const result = await repo.getSource('yoga-sutras', 'nope');
    expect(result.status).toBe('missing');
  });

  it('propagates missing artifacts and offline failures', async () => {
    const calls: string[] = [];
    const missing = new V2Repository(new FetchChunkLoader(mockFetch({}, calls)));
    expect((await missing.getSources('yoga-sutras')).status).toBe('missing');
    const offline = new V2Repository(new FetchChunkLoader(mockFetch(routes(), calls, 'offline')));
    expect((await offline.getSources('yoga-sutras')).status).toBe('offline');
  });
});

describe('canonical citation formatting', () => {
  it('uses only available metadata, deterministically', () => {
    const input = {
      textTitle: 'Yoga Sūtras',
      unitNumber: 'I.2',
      author: 'Patañjali',
      edition: 'Kashi ed.',
      publisher: 'Chowkhamba',
      year: 1930,
      locator: 'Samādhi-pāda',
      url: 'https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2',
    };
    const first = formatCitation(input);
    expect(first).toBe(
      'Yoga Sūtras, I.2. Patañjali. Kashi ed., Chowkhamba, 1930. Samādhi-pāda. Darśana canonical unit: https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2.',
    );
    expect(formatCitation(input)).toBe(first);
  });

  it('never invents missing fields', () => {
    expect(
      formatCitation({ textTitle: 'T', unitNumber: '1', url: 'https://x.test/#/u' }),
    ).toBe('T, 1. Darśana canonical unit: https://x.test/#/u.');
    // Empty strings behave like absent fields.
    expect(
      formatCitation({ textTitle: '', unitNumber: '', author: '  ', url: '' }),
    ).toBe('Untitled text, ?. Darśana canonical unit: ?.');
  });

  it('builds stable canonical URLs regardless of trailing slashes', () => {
    const a = unitCanonicalUrl('https://x.test/', 'yoga', 'yoga-sutras', 'I.2');
    const b = unitCanonicalUrl('https://x.test', 'yoga', 'yoga-sutras', 'I.2');
    expect(a).toBe(b);
    expect(a).toBe('https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2');
  });
});

describe('source/citation interface strings', () => {
  it('exists in English and Malayalam without placeholders drifting', () => {
    const keys: UIKey[] = [
      'sourcesTitle',
      'sourcesAndCitation',
      'citeThisUnit',
      'citationLabel',
      'copyCitation',
      'citationCopied',
      'citationCopyFailed',
      'viewTextSources',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});

describe('pilot locator matching (devi-mahatmya table)', () => {
  const stems = extractLocatorStems(deviMahatmyaSourceProvenance);

  it('reduces the table to prefix and exact stems, skipping slash lists', () => {
    // 44 rows minus the slash-separated navarna/dhyana/mala/nyasa row.
    expect(stems).toHaveLength(43);
    expect(stems.every((s) => s.stem.length > 0 && s.locator.length > 0)).toBe(true);
  });

  it('matches adhyaya units to their page ranges', () => {
    expect(matchUnitLocator('dm-8-39', stems)).toBe('pp.472-523');
    expect(matchUnitLocator('dm-8-39b', stems)).toBe('pp.472-523');
    expect(matchUnitLocator('dm-kavacha-1', stems)).toBe('pp.31-46');
    expect(matchUnitLocator('dm-kshama-prarthana', stems)).toBe('pp.723-724');
  });

  it('respects dash boundaries and leaves near-misses unresolved', () => {
    // dm-1- must never catch dm-13-5; longest stem wins instead.
    expect(matchUnitLocator('dm-13-5', stems)).toBe('pp.665-684');
    // Group pattern without a matching unit id stays unresolved.
    expect(matchUnitLocator('dm-guru-kilaka', stems)).toBeNull();
    expect(matchUnitLocator('dm-manasa-atharva-note', stems)).toBeNull();
    expect(matchUnitLocator('no-such-unit', stems)).toBeNull();
  });

  it('accepts locator-only unit provenance without new validation codes', () => {
    const withLocator = corpusWith([]);
    const unit = withLocator.texts[0].units[0];
    unit.provenance = { locator: 'pp.472-523' };
    const result = validateCorpus(withLocator);
    expect(result.errors).toEqual([]);
  });

  it('flows locators into citations', () => {
    expect(
      formatCitation({ textTitle: 'Devī Māhātmya', unitNumber: '8.39', author: 'A', locator: 'pp.472-523', url: 'u' }),
    ).toBe('Devī Māhātmya, 8.39. A. pp.472-523. Darśana canonical unit: u.');
  });
});

describe('scaled curation (Class A texts)', () => {
  const curatedIds = new Set(
    Object.values(CURATED_SOURCES_BY_TEXT).flat().map((r) => r.id),
  );

  it('keeps curated records valid: stable ids, titles, traceable notes', () => {
    for (const [textId, records] of Object.entries(CURATED_SOURCES_BY_TEXT)) {
      expect(records.length).toBeGreaterThan(0);
      for (const record of records) {
        expect(record.id.startsWith(`${textId}-source-`)).toBe(true);
        expect(record.title.trim().length).toBeGreaterThan(0);
        expect((record.notes || '').trim().length).toBeGreaterThan(0);
        expect(record).not.toHaveProperty('publisher', undefined);
      }
    }
    // No invented publishers: only the Satyananda note names one.
    const withPublisher = Object.values(CURATED_SOURCES_BY_TEXT)
      .flat()
      .filter((r) => r.publisher);
    expect(withPublisher.map((r) => r.id)).toEqual([
      'yoga-sutras-source-satyananda-four-chapters',
    ]);
  });

  it('matches units to sources by note prefix, stably ordered', () => {
    const candidates = [
      { sourceId: 't-source-a', prefix: 'Kashi Sanskrit' },
      { sourceId: 't-source-b', prefix: 'Swami Vivekananda' },
    ];
    expect(matchUnitSources(['Swami Vivekananda, x', 'Kashi Sanskrit, y'], candidates)).toEqual([
      't-source-a',
      't-source-b',
    ]);
    expect(matchUnitSources([], candidates)).toEqual([]);
    expect(matchUnitSources(['unrelated note'], candidates)).toEqual([]);
  });

  it('curates yoga and gita from the real adapted corpus', () => {
    const corpus = adaptSystemsToV2(systems);
    for (const [textId, records] of Object.entries(CURATED_SOURCES_BY_TEXT)) {
      const text = corpus.texts.find((t) => t.id === textId);
      expect(text).toBeDefined();
      if (!text) continue;
      text.sources = [...(text.sources || []), ...records];
      const candidates = SOURCE_NOTE_PREFIXES.filter((c) => c.textId === textId);
      const counts: Record<string, number> = {};
      for (const unit of text.units) {
        const notes = (unit.interpretiveNotes || []).map((n) => n.note);
        const ids = matchUnitSources(notes, candidates).filter((id) =>
          records.some((r) => r.id === id),
        );
        if (ids.length > 0) {
          unit.sourceIds = ids;
          counts[ids.length] = (counts[ids.length] || 0) + 1;
          // Mirror curate.ts: precise links ride along with the match.
          unit.evidenceLinks = matchUnitEvidence(notes, candidates).filter((link) =>
            ids.includes(link.sourceId),
          );
        }
      }
      // Every attached id resolves in the text registry (validator re-checks).
      for (const unit of text.units) {
        for (const sid of unit.sourceIds || []) {
          expect(curatedIds.has(sid)).toBe(true);
        }
      }
      if (textId === 'yoga-sutras') {
        expect(counts).toEqual({ 3: 193, 2: 2 });
      }
      if (textId === 'bhagavad-gita') {
        expect(counts).toEqual({ 1: 714 });
        const bare = text.units.filter((u) => !(u.sourceIds || []).length);
        expect(bare).toHaveLength(0);
        // Adhika appendix units attach the same KSTS record through
        // their appendix prefix, with the text relation.
        for (const u of text.units.filter((u) => u.id.startsWith('adhika.'))) {
          expect(u.sourceIds).toEqual(['bhagavad-gita-source-ksts-64']);
          expect(u.evidenceLinks).toEqual([
            { sourceId: 'bhagavad-gita-source-ksts-64', relation: 'text' },
          ]);
        }
      }
    }
    expect(validateCorpus(corpus).errors).toEqual([]);
  });
});
