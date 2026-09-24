import * as fs from 'node:fs';
import * as path from 'node:path';
import { splitSearchIndex, toDiscoveryEntry, type SearchIndex, type SearchIndexEntry } from '../content/v2/search-index';
import {
  mergeRankedSets,
  rankEntries,
  selectShardTexts,
} from './rank';
import { mergeDiscovery, needsMalayalamDiscovery, TieredSearch } from './tiered';

/**
 * Tiered search tests (Prompt 8): discovery/shard generation, planning,
 * merge consistency with monolithic ranking, failure handling, cache
 * reuse, alias preservation and artifact size guards.
 */

function entry(overrides: Partial<SearchIndexEntry> & { key: string }): SearchIndexEntry {
  return {
    traditionId: 'yoga',
    textId: 'yoga-sutras',
    kind: 'unit',
    en: '',
    ml: '',
    devanagari: '',
    iast: '',
    normalised: '',
    ...overrides,
  };
}

function sampleIndex(): SearchIndex {
  return {
    version: 2,
    generatedAt: '2026-01-01T00:00:00.000Z',
    entries: [
      { ...entry({ key: 'tradition:yoga', textId: '', kind: 'tradition', title: 'Yoga' }), traditionId: 'yoga' },
      entry({ key: 'text:yoga/yoga-sutras', textId: 'yoga-sutras', kind: 'text', title: 'Yoga Sutras' }),
      entry({
        key: 'unit:yoga/yoga-sutras/I.2',
        unitId: 'I.2',
        number: 'I.2',
        title: 'I.2',
        section: 'Samadhi',
        en: 'I.2 stilling of the turnings commentary on nirodha at length',
        ml: 'I.2 ചിത്തവൃത്തി നിരോധം',
        devanagari: 'योगश्चित्तवृत्तिनिरोधः',
        iast: 'yogaś-citta-vṛtti-nirodhaḥ',
        normalised: 'i.2 stilling yogash-citta-vritti-nirodhah',
      }),
      entry({
        key: 'concept:yoga/yoga-sutras/citta',
        textId: 'yoga-sutras',
        kind: 'concept',
        conceptId: 'citta',
        title: 'Citta',
        en: 'Citta \n awareness-stuff defined here',
        ml: 'ചിത്തം \n ബോധം',
        normalised: 'citta awareness-stuff',
      }),
      entry({
        key: 'unit:nyaya/nyaya-sutras/1.1',
        traditionId: 'nyaya',
        textId: 'nyaya-sutras',
        unitId: '1.1',
        number: '1.1',
        title: '1.1',
        en: '1.1 pramana discussion entirely different',
        normalised: '1.1 pramana',
      }),
    ],
  };
}

describe('splitSearchIndex', () => {
  it('keeps traditions/texts whole and shards the rest by text', () => {
    const split = splitSearchIndex(sampleIndex());
    expect(split.discovery.entries).toHaveLength(5);
    expect(Array.from(split.shards.keys()).sort()).toEqual(['nyaya-sutras', 'yoga-sutras']);
    expect(split.shards.get('yoga-sutras')).toHaveLength(2);
  });

  it('trims unit blobs but keeps numbers, Sanskrit and sections of identity', () => {
    const split = splitSearchIndex(sampleIndex());
    const unit = split.discovery.entries.find((e) => e.key === 'unit:yoga/yoga-sutras/I.2');
    expect(unit?.number).toBe('I.2');
    expect(unit?.devanagari).toContain('योग');
    expect(unit?.iast).toContain('yogaś');
    expect((unit?.en || '').length).toBeLessThanOrEqual(120);
    expect(unit?.normalised).toContain('i.2');
  });

  it('is deterministic across runs', () => {
    const a = JSON.stringify(splitSearchIndex(sampleIndex()));
    const b = JSON.stringify(splitSearchIndex(sampleIndex()));
    expect(a).toBe(b);
  });
});

describe('selectShardTexts', () => {
  it('names owning texts of top hits, bounded and excluding loaded', () => {
    const split = splitSearchIndex(sampleIndex());
    const hits = rankEntries(split.discovery.entries, 'pramana', 200);
    expect(selectShardTexts(hits, new Set())).toEqual(['nyaya-sutras']);
    expect(selectShardTexts(hits, new Set(['nyaya-sutras']))).toEqual([]);
    const many = rankEntries(split.discovery.entries, 'a', 200);
    expect(selectShardTexts(many, new Set(), 1)).toHaveLength(1);
  });
});

describe('mergeRankedSets', () => {
  it('converges exactly to monolithic ranking when all shards load', () => {
    const index = sampleIndex();
    const split = splitSearchIndex(index);
    const shards = new Map(split.shards);
    for (const query of ['citta', 'I.2', 'pramana', 'yoga', 'nirodhaḥ', 'சித்த']) {
      expect(mergeRankedSets(split.discovery.entries, shards, query).map((r) => r.entry.key)).toEqual(
        rankEntries(index.entries, query).map((r) => r.entry.key),
      );
    }
  });

  it('prefers shard depth over discovery stubs without duplicates', () => {
    const split = splitSearchIndex(sampleIndex());
    const shards = new Map([['yoga-sutras', split.shards.get('yoga-sutras') || []]]);
    const merged = mergeRankedSets(split.discovery.entries, shards, 'stilling');
    const keys = merged.map((r) => r.entry.key);
    expect(new Set(keys).size).toBe(keys.length);
    const unit = merged.find((r) => r.entry.key === 'unit:yoga/yoga-sutras/I.2');
    // Shard version carries the full commentary the stub trimmed away.
    expect((unit?.entry.en || '').length).toBeGreaterThan(50);
  });
});

describe('mergeDiscovery', () => {
  it('joins ml blobs by stable key, tolerating a missing companion', () => {
    const split = splitSearchIndex(sampleIndex());
    const mlOnly = split.discovery.entries.map((e) => ({ ...e, en: '', normalised: '' }));
    const merged = mergeDiscovery(split.discovery.entries, mlOnly);
    expect(merged).toHaveLength(split.discovery.entries.length);
    expect(mergeDiscovery(split.discovery.entries, undefined)).toBe(split.discovery.entries);
  });

  it('detects Malayalam-script queries regardless of UI language', () => {
    expect(needsMalayalamDiscovery('சித்த', 'en')).toBe(false);
    expect(needsMalayalamDiscovery('ചിത്ത', 'en')).toBe(true);
    expect(needsMalayalamDiscovery('citta', 'ml')).toBe(true);
    expect(needsMalayalamDiscovery('citta', 'en')).toBe(false);
  });
});

describe('TieredSearch engine', () => {
  function harness(files: Record<string, unknown>, calls: string[], failUrls: string[] = []) {
    return new TieredSearch(
      {
        discovery: '/search/discovery.json',
        discoveryMl: '/search/discovery-ml.json',
        shard: (textId: string) => `/search/texts/${textId}.json`,
      },
      {
        fetchJson: async <T>(url: string): Promise<T> => {
          calls.push(url);
          if (failUrls.some((suffix) => url.endsWith(suffix))) throw new Error(`failed: ${url}`);
          for (const [suffix, value] of Object.entries(files)) {
            if (url.endsWith(suffix)) return value as T;
          }
          const error = new Error('Not found') as Error & { status?: number };
          throw error;
        },
      },
    );
  }

  function files() {
    const split = splitSearchIndex(sampleIndex());
    return {
      'search/discovery.json': { version: 2, generatedAt: '', entries: split.discovery.entries },
      'search/discovery-ml.json': { version: 2, generatedAt: '', entries: [] },
      'search/texts/yoga-sutras.json': { version: 2, generatedAt: '', entries: split.shards.get('yoga-sutras') },
      'search/texts/nyaya-sutras.json': { version: 2, generatedAt: '', entries: split.shards.get('nyaya-sutras') },
    };
  }

  it('answers exact unit-number queries after loading one shard', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls);
    const results = await engine.query('I.2');
    expect(results[0]?.entry.key).toBe('unit:yoga/yoga-sutras/I.2');
    expect(engine.loadedTexts()).toEqual(['yoga-sutras']);
    expect(calls.filter((c) => c.endsWith('discovery.json'))).toHaveLength(1);
  });

  it('reuses cached shards across repeated and neighbouring queries', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls);
    await engine.query('citta');
    await engine.query('citta');
    await engine.query('nirodha');
    const shardCalls = calls.filter((c) => c.includes('/texts/'));
    expect(shardCalls.filter((c) => c.endsWith('yoga-sutras.json'))).toHaveLength(1);
  });

  it('degrades gracefully on missing and failed shards', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls, ['nyaya-sutras.json']);
    // 'pramana' names nyaya-sutras; with its shard failed, discovery-only
    // rows still return rather than the whole query failing.
    const results = await engine.query('pramana');
    expect(results.length).toBeGreaterThan(0);
    expect(engine.loadedTexts()).not.toContain('nyaya-sutras');
  });

  it('returns empty (never throws) when discovery is offline', async () => {
    const calls: string[] = [];
    const engine = harness({}, calls, ['discovery.json']);
    await expect(engine.query('citta')).rejects.toThrow();
  });

  it('finds Malayalam content through the companion file', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls);
    const results = await engine.query('ചിത്ത', 200, 'en');
    expect(results.some((r) => r.entry.key === 'unit:yoga/yoga-sutras/I.2')).toBe(true);
    expect(calls.some((c) => c.endsWith('discovery-ml.json'))).toBe(true);
  });

  it('matches Devanagari substrings from discovery alone', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls);
    const results = await engine.query('योगश्चित्त');
    expect(results[0]?.entry.key).toBe('unit:yoga/yoga-sutras/I.2');
  });

  it('matches exact unit numbers first', async () => {
    const calls: string[] = [];
    const engine = harness(files(), calls);
    const results = await engine.query('1.1');
    expect(results[0]?.entry.key).toBe('unit:nyaya/nyaya-sutras/1.1');
  });
});

describe('toDiscoveryEntry field contract', () => {
  it('keeps every field rankEntries reads', () => {
    const split = splitSearchIndex(sampleIndex());
    for (const e of split.discovery.entries) {
      for (const field of ['key', 'kind', 'traditionId', 'textId', 'en', 'ml', 'devanagari', 'iast', 'normalised'] as const) {
        expect(typeof e[field]).toBe('string');
      }
    }
  });
});

describe('client worker fallback (node has no Worker)', () => {
  it('answers through the main-thread engine when workers are unavailable', async () => {
    expect(typeof Worker).toBe('undefined');
    const split = splitSearchIndex(sampleIndex());
    const files: Record<string, unknown> = {
      '/search/discovery.json': { version: 2, generatedAt: '', entries: split.discovery.entries },
      '/search/discovery-ml.json': { version: 2, generatedAt: '', entries: [] },
      '/search/texts/yoga-sutras.json': {
        version: 2,
        generatedAt: '',
        entries: split.shards.get('yoga-sutras'),
      },
    };
    vi.stubGlobal(
      'fetch',
      async (url: string) => {
        for (const [suffix, value] of Object.entries(files)) {
          if (String(url).endsWith(suffix)) {
            return new Response(JSON.stringify(value), { status: 200 });
          }
        }
        return new Response('nope', { status: 404 });
      },
    );
    try {
      const { getSearchClient, setSearchClient } = await import('./client');
      setSearchClient(undefined);
      try {
        const results = await getSearchClient().search('citta', 200, 'en');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]?.entry.key).toContain('yoga-sutras');
      } finally {
        setSearchClient(undefined);
      }
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('search artifact size guard', () => {
  const root = path.join(__dirname, '..', '..', 'public', 'content', 'search');
  it('keeps discovery small and shards bounded', async () => {
    const discovery = path.join(root, 'discovery.json');
    const discoveryMl = path.join(root, 'discovery-ml.json');
    if (!fs.existsSync(discovery)) {
      console.warn('search artifacts missing (run content:chunks); skipping');
      return;
    }
    const { gzipSync } = await import('node:zlib');
    // Network payload is what matters: gzipped discovery must stay a
    // fraction of the old 17 MB monolith. Limits informed by the real
    // corpus (names/numbers/Sanskrit plus short signals).
    expect(gzipSync(fs.readFileSync(discovery)).length).toBeLessThan(800 * 1024);
    expect(gzipSync(fs.readFileSync(discoveryMl)).length).toBeLessThan(800 * 1024);
    const shardDir = path.join(root, 'texts');
    const shards = fs.readdirSync(shardDir).filter((f) => f.endsWith('.json'));
    expect(shards.length).toBeGreaterThan(10);
    let largest = 0;
    let total = 0;
    for (const file of shards) {
      const size = fs.statSync(path.join(shardDir, file)).size;
      total += size;
      largest = Math.max(largest, size);
    }
    expect(largest).toBeLessThan(3 * 1024 * 1024);
    expect(total).toBeLessThan(25 * 1024 * 1024);
  });
});
