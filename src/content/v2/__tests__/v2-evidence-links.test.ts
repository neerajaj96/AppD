import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { adaptSystemsToV2 } from '../adapters';
import { systems } from '../../../content/index';
import { formatCitation, selectCitationSource } from '../citation';
import { EVIDENCE_RELATIONS, isEvidenceRelation } from '../schema';
import { CURATED_SOURCES_BY_TEXT, SOURCE_NOTE_PREFIXES } from '../curatedSources';
import type { CanonicalUnit, V2Corpus, V2Source } from '../schema';

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status });
}

function mockFetch(routes: Record<string, unknown>) {
  return async (url: string): Promise<Response> => {
    for (const [suffix, value] of Object.entries(routes)) {
      if (url.endsWith(suffix)) return jsonResponse(value);
    }
    return new Response('nope', { status: 404 });
  };
}

const source = (id: string): V2Source => ({ id, title: `Title ${id}` });

function unit(id: string, extra: Partial<CanonicalUnit> = {}): CanonicalUnit {
  return {
    id,
    number: '1',
    section: 'S',
    unitType: 'sutra' as const,
    iast: '',
    localisations: { en: { translation: 'T' }, ml: { translation: 'T-ml' } },
    ...extra,
  };
}

function corpusWith(sources: V2Source[], units: CanonicalUnit[]): V2Corpus {
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
        units,
        concepts: [],
        sources,
      },
    ],
    aliases: [],
  };
}

describe('evidence-link schema', () => {
  it('accepts every vocabulary relation and omits absent links silently', () => {
    expect([...EVIDENCE_RELATIONS].sort()).toEqual(
      ['commentary', 'interpretation', 'provenance', 'text', 'translation'].sort(),
    );
    const sources = EVIDENCE_RELATIONS.map((_, i) => source(`s${i}`));
    const links = EVIDENCE_RELATIONS.map((relation, i) => ({ sourceId: `s${i}`, relation }));
    const result = validateCorpus(
      corpusWith(sources, [unit('u1', { sourceIds: sources.map((s) => s.id), evidenceLinks: links })]),
    );
    expect(result.errors).toEqual([]);
    const bare = validateCorpus(corpusWith([source('s1')], [unit('u1', { sourceIds: ['s1'] })]));
    expect(bare.errors).toEqual([]);
  });
});

describe('evidence-link validation', () => {
  it('rejects dangling link sources', () => {
    const result = validateCorpus(
      corpusWith([source('s1')], [unit('u1', { evidenceLinks: [{ sourceId: 'ghost', relation: 'text' }] })]),
    );
    expect(result.errors.map((e) => e.code)).toContain('dangling-evidence-source');
  });

  it('rejects duplicate and contradictory links for one pair', () => {
    const duped = validateCorpus(
      corpusWith(
        [source('s1')],
        [unit('u1', { evidenceLinks: [{ sourceId: 's1', relation: 'text' }, { sourceId: 's1', relation: 'text' }] })],
      ),
    );
    expect(duped.errors.map((e) => e.code)).toContain('duplicate-evidence-link');
    const contradicted = validateCorpus(
      corpusWith(
        [source('s1')],
        [unit('u1', { evidenceLinks: [{ sourceId: 's1', relation: 'text' }, { sourceId: 's1', relation: 'commentary' }] })],
      ),
    );
    expect(contradicted.errors.map((e) => e.code)).toContain('contradictory-evidence-link');
  });

  it('rejects malformed links without penalising absent ones', () => {
    const malformed = validateCorpus(
      corpusWith(
        [source('s1')],
        [
          unit('u1', { evidenceLinks: [{ sourceId: '', relation: 'text' }] }),
          unit('u2', { evidenceLinks: [{ sourceId: 's1', relation: 'oracle' } as never] }),
          unit('u3', { evidenceLinks: ['s1'] as never }),
        ],
      ),
    );
    expect(malformed.errors.filter((e) => e.code === 'malformed-evidence-link')).toHaveLength(3);
  });
});

describe('curated evidence links (real corpus)', () => {
  it('maps every note prefix to a registry record with a valid relation', () => {
    for (const candidate of SOURCE_NOTE_PREFIXES) {
      expect(isEvidenceRelation(candidate.relation)).toBe(true);
      const records = CURATED_SOURCES_BY_TEXT[candidate.textId] || [];
      expect(records.some((r) => r.id === candidate.sourceId)).toBe(true);
    }
  });

  it('derives yoga/gita links only from note-supported relations', () => {
    const byText = new Map<string, Array<{ relation: string }>>();
    for (const candidate of SOURCE_NOTE_PREFIXES) {
      const list = byText.get(candidate.textId) || [];
      list.push({ relation: candidate.relation });
      byText.set(candidate.textId, list);
    }
    // Yoga: one text-layer edition plus two commentary layers, nothing else.
    expect((byText.get('yoga-sutras') || []).map((c) => c.relation).sort()).toEqual([
      'commentary',
      'commentary',
      'text',
    ]);
    expect((byText.get('bhagavad-gita') || []).map((c) => c.relation)).toEqual(['text']);
  });

  it('keeps devi-mahatmya free of evidence links (locators are not associations)', () => {
    const corpus = adaptSystemsToV2(systems);
    const devi = corpus.texts.find((t) => t.id === 'devi-mahatmya');
    expect(devi).toBeDefined();
    expect(devi?.units.every((u) => !(u.evidenceLinks || []).length)).toBe(true);
  });
});

describe('repository evidence-link survival', () => {
  const linkedUnit = unit('u1', {
    sourceIds: ['s1'],
    evidenceLinks: [{ sourceId: 's1', relation: 'commentary' }],
  });
  const routes = () => ({
    'sometext/units/index.json': {
      textId: 'sometext',
      unitCount: 1,
      sections: [{ section: 'S', count: 1, chunk: 'chunk-0.json' }],
      chunks: ['chunk-0.json'],
    },
    'sometext/units/chunk-0.json': [linkedUnit],
  });

  it('returns links intact through getUnit and the chunk cache', async () => {
    const calls: string[] = [];
    const fetchImpl = async (url: string): Promise<Response> => {
      calls.push(url);
      return mockFetch(routes())(url);
    };
    const repo = new V2Repository(new FetchChunkLoader(fetchImpl));
    const first = await repo.getUnit('sometext', 'u1');
    expect(first.status === 'ok' && first.data.evidenceLinks).toEqual([
      { sourceId: 's1', relation: 'commentary' },
    ]);
    await repo.getUnit('sometext', 'u1');
    expect(calls.filter((c) => c.endsWith('chunk-0.json'))).toHaveLength(1);
  });

  it('surfaces links as missing-chunk failures, never throws', async () => {
    const repo = new V2Repository(
      new FetchChunkLoader(async () => {
        throw new Error('offline');
      }),
    );
    const result = await repo.getUnit('sometext', 'u1');
    expect(result.status).not.toBe('ok');
  });
});

describe('citation source selection', () => {
  const text = source('t1');
  const commentary = source('c1');

  it('prefers the text-relation source over registry order', () => {
    expect(selectCitationSource([commentary, text], [{ sourceId: 't1', relation: 'text' }])).toBe(text);
    expect(selectCitationSource([commentary, text], [{ sourceId: 'c1', relation: 'commentary' }])).toBe(commentary);
  });

  it('falls back to the first source without links, and undefined when empty', () => {
    expect(selectCitationSource([commentary, text])).toBe(commentary);
    expect(selectCitationSource([commentary, text], [])).toBe(commentary);
    expect(selectCitationSource([], [{ sourceId: 't1', relation: 'text' }])).toBeUndefined();
    // Dangling link target resolves to registry order, never throws.
    expect(selectCitationSource([commentary], [{ sourceId: 'ghost', relation: 'text' }])).toBe(commentary);
  });

  it('leaves existing citation output unchanged where links add nothing', () => {
    const input = {
      textTitle: 'Yoga Sūtras',
      unitNumber: 'I.2',
      author: 'Patañjali',
      url: 'https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2',
    };
    expect(formatCitation(input)).toBe(
      'Yoga Sūtras, I.2. Patañjali. Darśana canonical unit: https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2.',
    );
  });
});
