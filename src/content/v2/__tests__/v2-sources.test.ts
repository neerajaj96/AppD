import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { buildTextSource, formatSourceTable, joinSourceNotes } from '../textSources';
import { formatCitation, unitCanonicalUrl } from '../citation';
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
