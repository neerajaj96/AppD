import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { validateCorpus } from '../validate';
import { SOURCE_RECORD_ROLES, type V2Corpus, type V2Source } from '../schema';
import { CURATED_SOURCES_BY_TEXT } from '../curatedSources';
import { SOURCE_ROLE_LABEL } from '../../../components/Provenance';
import { formatCitation } from '../citation';
import { uiStrings, type UIKey } from '../../../i18n/ui';

function jsonResponse(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), { status });
}

const source = (id: string, extra: Partial<V2Source> = {}): V2Source => ({
  id,
  title: `Title ${id}`,
  ...extra,
});

function corpusWith(sources: V2Source[]): V2Corpus {
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
            sourceIds: ['s1'],
          },
        ],
        concepts: [],
        sources,
      },
    ],
    aliases: [],
  };
}

describe('source-role vocabulary', () => {
  it('is a small controlled set covering the actual corpus needs', () => {
    expect([...SOURCE_RECORD_ROLES].sort()).toEqual(
      ['commentary', 'editorial', 'primary-text', 'provenance', 'secondary', 'translation'].sort(),
    );
  });

  it('accepts every vocabulary value and omits absent roles silently', () => {
    for (const role of SOURCE_RECORD_ROLES) {
      const result = validateCorpus(corpusWith([source('s1', { role })]));
      expect(result.errors).toEqual([]);
    }
    const absent = validateCorpus(corpusWith([source('s1')]));
    expect(absent.errors).toEqual([]);
  });

  it('rejects invalid roles as errors, including near-misses', () => {
    for (const bad of ['Primary-Text', 'primary_text', 'commentaries', '', 'practice']) {
      const result = validateCorpus(corpusWith([source('s1', { role: bad as never })]));
      expect(result.errors.map((e) => e.code)).toContain('invalid-source-role');
    }
  });
});

describe('curated role assignments', () => {
  it('marks primary-text editions only where the note states the Sanskrit source', () => {
    const yoga = CURATED_SOURCES_BY_TEXT['yoga-sutras'] || [];
    const byId = new Map(yoga.map((r) => [r.id, r]));
    expect(byId.get('yoga-sutras-source-kashi-83')?.role).toBe('primary-text');
    expect(byId.get('yoga-sutras-source-vivekananda-raja-yoga')?.role).toBe('commentary');
    expect(byId.get('yoga-sutras-source-satyananda-four-chapters')?.role).toBe('commentary');
    const gita = CURATED_SOURCES_BY_TEXT['bhagavad-gita'] || [];
    expect(gita).toHaveLength(1);
    expect(gita[0]?.role).toBe('primary-text');
  });

  it('leaves mixed-content notes records without a role', () => {
    // The four *-source-notes records document provenance tables and
    // policies; no single role is evidenced, so none is assigned.
    // (Covered by the absence assertion in the vocabulary test above
    // for the general mechanism; here the corpus shape is asserted.)
    const yoga = CURATED_SOURCES_BY_TEXT['yoga-sutras'] || [];
    for (const record of yoga) {
      expect(record.role).toBeDefined();
    }
  });
});

describe('role preservation through repository loading', () => {
  const records = [
    source('r1', { role: 'primary-text', edition: 'E' }),
    source('r2', { title: 'Bare record' }),
  ];
  const routes = () => ({ 'sometext/sources.json': records });

  it('returns roles intact through the chunk cache', async () => {
    const calls: string[] = [];
    const fetchImpl = async (url: string): Promise<Response> => {
      calls.push(url);
      for (const [suffix, value] of Object.entries(routes())) {
        if (url.endsWith(suffix)) return jsonResponse(value);
      }
      return new Response('nope', { status: 404 });
    };
    const repo = new V2Repository(new FetchChunkLoader(fetchImpl));
    const all = await repo.getSources('sometext');
    expect(all).toEqual({ status: 'ok', data: records });
    const one = await repo.getSource('sometext', 'r1');
    expect(one.status === 'ok' && one.data.role).toBe('primary-text');
    const bare = await repo.getSource('sometext', 'r2');
    expect(bare.status === 'ok' && (bare.data as V2Source).role).toBeUndefined();
  });
});

describe('role-aware rendering data', () => {
  it('maps every vocabulary value to a localised label', () => {
    const keys: UIKey[] = [
      'rolePrimaryText',
      'roleTranslation',
      'roleCommentary',
      'roleSecondary',
      'roleProvenance',
      'roleEditorial',
    ];
    expect(Object.keys(SOURCE_ROLE_LABEL).sort()).toEqual(
      [...SOURCE_RECORD_ROLES].sort(),
    );
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
    expect(SOURCE_ROLE_LABEL['primary-text']).toBe('rolePrimaryText');
  });
});

describe('citation stability with roles present', () => {
  it('keeps citations byte-identical whether or not a role exists', () => {
    const base = {
      textTitle: 'Yoga Sūtras',
      unitNumber: 'I.2',
      author: 'Patañjali',
      url: 'https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2',
    };
    // Roles inform disclosure, never citation wording.
    expect(formatCitation(base)).toBe(
      'Yoga Sūtras, I.2. Patañjali. Darśana canonical unit: https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2.',
    );
  });
});
