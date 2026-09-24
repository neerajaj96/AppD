import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { adaptSystemsToV2 } from '../adapters';
import { EDITORIAL_ALIASES, verifiedAliases } from '../aliases';
import {
  buildAliasTable,
  canonicalConceptId,
  normaliseId,
  parseCanonicalConceptId,
  resolveAlias,
} from '../ids';
import { getSearchClient, setSearchClient } from '../../../search/client';
import { systems } from '../../index';
import type { V2Corpus } from '../schema';

// Prompt 7 identity tests: normalisation, explicit resolution, ambiguity
// preservation, namespaces, validator contract and search integration.
// Synthetic fixtures throughout, plus one real-corpus regression proving
// the editorial table is actually consumed.

function tinyCorpus(aliases: V2Corpus['aliases']): V2Corpus {
  const concept = (id: string) => ({
    id,
    localisations: { en: { title: `Title ${id}`, summary: 's' } },
  });
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
        units: [],
        concepts: [concept('c1'), concept('c2')],
      },
    ],
    aliases,
  };
}

describe('canonical identity', () => {
  it('normalises diacritics, case and separators identically', () => {
    expect(normaliseId('satkāryavāda')).toBe('satkaryavada');
    expect(normaliseId('sat karya vada')).toBe('sat-karya-vada');
    expect(normaliseId('concept_samkhya_purusha')).toBe('concept-samkhya-purusha');
  });

  it('keeps transliteration-scheme variants distinct (no silent merge)', () => {
    // ṛ folds to r, so IAST `puruṣa` and ASCII `purusa` coincide;
    // `purusha` (with h) is a different spelling needing an explicit row.
    expect(normaliseId('puruṣa')).toBe('purusa');
    expect(normaliseId('purusha')).toBe('purusha');
    expect(normaliseId('puruṣa')).not.toBe(normaliseId('purusha'));
  });

  it('round-trips namespaced triples and rejects malformed ones', () => {
    const triple = canonicalConceptId('samkhya', 'samkhya-karika', 'purusha-svarupa');
    expect(triple).toBe('samkhya/samkhya-karika/purusha-svarupa');
    expect(parseCanonicalConceptId(triple)).toEqual({
      traditionId: 'samkhya',
      textId: 'samkhya-karika',
      conceptId: 'purusha-svarupa',
    });
    expect(parseCanonicalConceptId('samkhya/purusha')).toBeUndefined();
    expect(parseCanonicalConceptId('a/b/c/d')).toBeUndefined();
    expect(parseCanonicalConceptId('')).toBeUndefined();
  });
});

describe('explicit alias resolution', () => {
  const table = buildAliasTable([
    { alias: 'duhkhatraya', canonicalId: 'samkhya/samkhya-karika/duhkha-traya' },
    { alias: 'ātman', canonicalId: 'nyaya/nyaya-sutras/atman' },
    { alias: 'ātman', canonicalId: 'vaisesika/vaisesika-sutras/atman' },
  ]);

  it('resolves a unique verified alias to its triple', () => {
    expect(resolveAlias('duhkhatraya', table)).toEqual({
      status: 'resolved',
      canonicalId: 'samkhya/samkhya-karika/duhkha-traya',
    });
  });

  it('preserves ambiguity instead of picking a result', () => {
    const resolved = resolveAlias('ātman', table);
    expect(resolved.status).toBe('ambiguous');
    if (resolved.status === 'ambiguous') {
      expect(resolved.candidates).toEqual([
        'nyaya/nyaya-sutras/atman',
        'vaisesika/vaisesika-sutras/atman',
      ]);
    }
  });

  it('reports unknown spellings as missing', () => {
    expect(resolveAlias('māyā', table)).toEqual({ status: 'missing', alias: 'māyā' });
  });

  it('keeps review rows out of the resolution table', () => {
    const rows = verifiedAliases([
      { alias: 'māyā', canonicalId: 'kashmir-shaivism/tantraloka/maya-tattva', status: 'review' },
      { alias: 'duhkhatraya', canonicalId: 'samkhya/samkhya-karika/duhkha-traya', status: 'verified' },
    ]);
    expect(rows).toHaveLength(1);
    expect(resolveAlias('māyā', buildAliasTable(rows)).status).toBe('missing');
  });
});

describe('repository identity resolution', () => {
  const aliasesFile = {
    schemaVersion: 2,
    generatedAt: '2026-01-01T00:00:00.000Z',
    aliases: [
      { alias: 'duhkhatraya', canonicalId: 'samkhya/samkhya-karika/duhkha-traya', status: 'verified' },
      { alias: 'ātman', canonicalId: 'nyaya/nyaya-sutras/atman', status: 'verified' },
      { alias: 'ātman', canonicalId: 'vaisesika/vaisesika-sutras/atman', status: 'verified' },
      { alias: 'māyā', canonicalId: 'kashmir-shaivism/tantraloka/maya-tattva', status: 'review' },
    ],
  };
  const conceptChunk = (id: string) => [
    { id, localisations: { en: { title: `Title ${id}`, summary: 's' } } },
  ];
  function mockFetch(url: string): Promise<Response> {
    const json = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
    if (url.endsWith('content/aliases.json')) return Promise.resolve(json(aliasesFile));
    if (url.endsWith('samkhya-karika/concepts/index.json')) {
      return Promise.resolve(json({ textId: 'samkhya-karika', conceptCount: 1, chunks: ['chunk-0.json'] }));
    }
    if (url.endsWith('samkhya-karika/concepts/chunk-0.json')) {
      return Promise.resolve(json(conceptChunk('duhkha-traya')));
    }
    return Promise.resolve(new Response('nope', { status: 404 }));
  }

  it('resolves an alias across texts without loading full chunks first', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const resolved = await repo.resolveAliasName('duhkhatraya');
    expect(resolved).toEqual({
      status: 'resolved',
      canonicalId: 'samkhya/samkhya-karika/duhkha-traya',
    });
  });

  it('returns ambiguity with distinct canonical triples intact', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const resolved = await repo.resolveAliasName('ātman');
    expect(resolved.status).toBe('ambiguous');
    if (resolved.status === 'ambiguous') {
      expect(resolved.candidates).toHaveLength(2);
      // Namespaces differ: no merge of Nyāya and Vaiśeṣika selves.
      expect(new Set(resolved.candidates.map((c) => c.split('/')[0]))).toEqual(
        new Set(['nyaya', 'vaisesika']),
      );
    }
  });

  it('treats review spellings and unreachable tables as missing', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    expect(await repo.resolveAliasName('māyā')).toEqual({ status: 'missing', alias: 'māyā' });
    const offline = new V2Repository(
      new FetchChunkLoader(async () => {
        throw new Error('offline');
      }),
    );
    expect(await offline.resolveAliasName('duhkhatraya')).toEqual({
      status: 'missing',
      alias: 'duhkhatraya',
    });
  });

  it('lists curated spellings for one canonical concept', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    expect(await repo.getConceptAliases('samkhya', 'samkhya-karika', 'duhkha-traya')).toEqual([
      'duhkhatraya',
    ]);
    expect(await repo.getConceptAliases('samkhya', 'samkhya-karika', 'other')).toEqual([]);
  });
});

describe('identity validation contract', () => {
  it('rejects missing and malformed targets, duplicates stay errors', () => {
    const result = validateCorpus(
      tinyCorpus([
        { alias: 'x', canonicalId: 't1/x/c1', status: 'verified' },
        { alias: 'x', canonicalId: 't1/x/c1', status: 'verified' },
        { alias: 'y', canonicalId: 't1/x/ghost', status: 'verified' },
        { alias: 'z', canonicalId: 'not-a-triple', status: 'verified' },
      ]),
    );
    const codes = result.errors.map((e) => e.code);
    expect(codes).toContain('alias-duplicate');
    expect(codes).toContain('alias-target-missing');
    expect(codes).toContain('alias-target-malformed');
  });

  it('keeps ambiguity and review candidacy as warnings, not errors', () => {
    const result = validateCorpus(
      tinyCorpus([
        { alias: 'a', canonicalId: 't1/x/c1', status: 'verified' },
        { alias: 'a', canonicalId: 't1/x/c2', status: 'verified' },
        { alias: 'b', canonicalId: 't1/x/c1', status: 'review' },
      ]),
    );
    expect(result.errors).toEqual([]);
    const codes = result.warnings.map((w) => w.code);
    expect(codes).toContain('alias-ambiguous');
    expect(codes).toContain('alias-review-pending');
  });

  it('passes a clean verified table without issues', () => {
    const result = validateCorpus(tinyCorpus([{ alias: 'see-one', canonicalId: 't1/x/c1', status: 'verified' }]));
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});

describe('search alias lookup', () => {
  const aliasesFile = {
    schemaVersion: 2,
    generatedAt: '2026-01-01T00:00:00.000Z',
    aliases: [
      { alias: 'duhkhatraya', canonicalId: 'samkhya/samkhya-karika/duhkha-traya', status: 'verified' },
      { alias: 'ātman', canonicalId: 'nyaya/nyaya-sutras/atman', status: 'verified' },
      { alias: 'ātman', canonicalId: 'vaisesika/vaisesika-sutras/atman', status: 'verified' },
    ],
  };
  beforeEach(() => {
    setSearchClient(undefined);
    vi.stubGlobal(
      'fetch',
      async (url: string) => {
        if (String(url).endsWith('content/aliases.json')) {
          return new Response(JSON.stringify(aliasesFile), { status: 200 });
        }
        return new Response('nope', { status: 404 });
      },
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    setSearchClient(undefined);
  });

  it('resolves a known spelling to its canonical triple', async () => {
    expect(await getSearchClient().resolveQueryAlias('duhkhatraya')).toEqual({
      status: 'resolved',
      canonicalId: 'samkhya/samkhya-karika/duhkha-traya',
    });
  });

  it('offers disambiguation rows instead of an arbitrary pick', async () => {
    const resolved = await getSearchClient().resolveQueryAlias('ātman');
    expect(resolved.status).toBe('ambiguous');
    if (resolved.status === 'ambiguous') expect(resolved.candidates).toHaveLength(2);
  });

  it('ignores unknown spellings and blank queries', async () => {
    expect((await getSearchClient().resolveQueryAlias('māyā')).status).toBe('missing');
    expect((await getSearchClient().resolveQueryAlias('   ')).status).toBe('missing');
  });
});

describe('real-corpus identity regression', () => {
  it('consumes the editorial table with zero hard errors', () => {
    const corpus = adaptSystemsToV2(systems);
    expect(corpus.aliases.length).toBe(EDITORIAL_ALIASES.length);
    expect(corpus.aliases.length).toBeGreaterThan(0);
    const adrshta = corpus.aliases.filter((a) => a.alias === 'adṛṣṭa');
    expect(adrshta).toHaveLength(2);
    const result = validateCorpus(corpus);
    expect(result.errors).toEqual([]);
    // Ambiguity is warning-level by design (atman, adṛṣṭa, sat-karya-vada).
    expect(result.warnings.filter((w) => w.code === 'alias-ambiguous').length).toBeGreaterThan(0);
    // Review candidates stay visible but inert.
    expect(result.warnings.filter((w) => w.code === 'alias-review-pending').length).toBeGreaterThan(0);
  });
});
