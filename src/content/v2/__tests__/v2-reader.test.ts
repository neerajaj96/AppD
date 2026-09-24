import { getAdjacentUnits, pickLocalisation } from '../select';
import { DEFAULT_DISPLAY_PREFS, loadDisplayPrefs, saveDisplayPrefs } from '../../../context/readingPrefs';
import { editorialRows, provenanceRows } from '../../../components/Provenance';
import { adaptText } from '../adapters';
import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import type { CanonicalUnit } from '../schema';
import type { ClassicalText } from '../../../types/content';

// Prompt 4 reader tests: language selection, prev/next boundaries,
// preference persistence, provenance omission, adapter carry-through and
// repository relationship navigation. All deterministic; no network.

function stubStorage(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k) as string : null),
      setItem: (k: string, v: string) => {
        store.set(k, String(v));
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    },
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('reader language selection', () => {
  const locs = {
    en: { translation: 'Stillness.' },
    ml: { translation: 'നിശ്ചലത.' },
  };
  it('prefers the requested language when present', () => {
    const { active, isFallback } = pickLocalisation(locs, 'ml');
    expect(active?.translation).toBe('നിശ്ചലത.');
    expect(isFallback).toBe(false);
  });
  it('falls back to English and reports it', () => {
    const { active, isFallback } = pickLocalisation({ en: locs.en }, 'ml');
    expect(active?.translation).toBe('Stillness.');
    expect(isFallback).toBe(true);
  });
  it('never reports fallback for English itself', () => {
    expect(pickLocalisation({ en: locs.en }, 'en').isFallback).toBe(false);
  });
  it('handles units with no localisation at all', () => {
    expect(pickLocalisation({}, 'ml').active).toBeUndefined();
  });
});

describe('reader prev/next boundaries', () => {
  const units = [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as CanonicalUnit[];
  it('walks the middle in both directions', () => {
    const { prev, next, index } = getAdjacentUnits(units, 'b');
    expect(prev?.id).toBe('a');
    expect(next?.id).toBe('c');
    expect(index).toBe(1);
  });
  it('returns null at each boundary', () => {
    expect(getAdjacentUnits(units, 'a').prev).toBeNull();
    expect(getAdjacentUnits(units, 'c').next).toBeNull();
  });
  it('reports unknown ids without throwing', () => {
    expect(getAdjacentUnits(units, 'zzz')).toEqual({ prev: null, next: null, index: -1 });
  });
  it('handles a single-unit text', () => {
    expect(getAdjacentUnits([{ id: 'only' } as CanonicalUnit], 'only')).toEqual({
      prev: null,
      next: null,
      index: 0,
    });
  });
});

describe('reading display preference persistence', () => {
  it('defaults to all layers visible', () => {
    expect(loadDisplayPrefs()).toEqual(DEFAULT_DISPLAY_PREFS);
  });
  it('round-trips toggled prefs through storage', () => {
    stubStorage();
    saveDisplayPrefs({ showSanskrit: false, showTranslation: true, showCommentary: false });
    expect(loadDisplayPrefs()).toEqual({
      showSanskrit: false,
      showTranslation: true,
      showCommentary: false,
    });
  });
  it('repairs malformed or partial payloads', () => {
    stubStorage({ darsana_reading_display: '{oops' });
    expect(loadDisplayPrefs()).toEqual(DEFAULT_DISPLAY_PREFS);
    stubStorage({ darsana_reading_display: JSON.stringify({ showSanskrit: 'yes' }) });
    expect(loadDisplayPrefs().showSanskrit).toBe(true);
  });
});

describe('provenance omission contract', () => {
  it('returns no rows when nothing is recorded', () => {
    expect(provenanceRows(undefined)).toEqual([]);
    expect(provenanceRows({})).toEqual([]);
    expect(editorialRows(undefined)).toEqual([]);
  });
  it('omits unknown rights but keeps known ones', () => {
    expect(provenanceRows({ sourceTitle: 'T', rights: 'unknown' }).map((r) => r.key)).toEqual(['source']);
    expect(provenanceRows({ sourceTitle: 'T', rights: 'public-domain' }).map((r) => r.key)).toEqual([
      'source',
      'rights',
    ]);
  });
  it('joins citation and locator fragments, skipping blanks', () => {
    const rows = provenanceRows({
      sourceTitle: 'Edition',
      author: 'Ed.',
      year: 1930,
      locator: 'I.2',
      page: 'p.5',
    });
    expect(rows).toHaveLength(2);
    expect(rows[0].value).toContain('Ed.');
    expect(rows[0].value).toContain('1930');
    expect(rows[1].value).toBe('I.2 · p.5');
  });
  it('keeps only editorial fields that carry a state', () => {
    expect(editorialRows({ iast: 'verified', concepts: 'draft' })).toEqual([
      { field: 'iast', state: 'verified' },
      { field: 'concepts', state: 'draft' },
    ]);
  });
});

describe('adapter textual carry-through', () => {
  it('preserves interpretive notes from legacy verses', () => {
    const text = {
      id: 't',
      title: 'T',
      transliteratedTitle: 'T',
      author: '',
      system: 's',
      verses: [
        {
          id: 'v1',
          number: '1',
          section: 'S',
          iast: 'x',
          interpretiveNotes: [{ note: 'variant reading' }],
          content: { en: { translation: 'T' } },
        },
      ],
      concepts: [],
    } as unknown as ClassicalText;
    const adapted = adaptText(text, 's');
    expect(adapted.units[0].interpretiveNotes).toEqual([{ note: 'variant reading' }]);
  });
});

describe('repository relationship navigation', () => {
  const units: CanonicalUnit[] = [
    {
      id: 'u1',
      number: '1',
      section: 'S',
      unitType: 'sutra',
      iast: '',
      localisations: { en: { translation: 'one' } },
      conceptIds: ['c1', 'c2'],
    },
    {
      id: 'u2',
      number: '2',
      section: 'S',
      unitType: 'sutra',
      iast: '',
      localisations: { en: { translation: 'two' } },
      conceptIds: ['c2'],
    },
    {
      id: 'u3',
      number: '3',
      section: 'S',
      unitType: 'sutra',
      iast: '',
      localisations: { en: { translation: 'three' } },
      conceptIds: [],
    },
  ];
  const concepts = [
    {
      id: 'c1',
      relatedUnitIds: ['u1'],
      relatedConceptIds: ['c2'],
      localisations: { en: { title: 'C1', summary: 's' } },
    },
    {
      id: 'c2',
      relatedUnitIds: ['u1', 'u2'],
      relatedConceptIds: [],
      localisations: { en: { title: 'C2', summary: 's' } },
    },
  ];
  const threads = [
    {
      id: 't-thread',
      traditionId: 'trad',
      textId: 'txt',
      steps: [
        { id: 's1', textId: 'txt', conceptId: 'c1', unitIds: ['u1'], localisations: { en: { title: 'Step' } } },
      ],
    },
  ];
  function mockFetch(url: string): Promise<Response> {
    const json = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
    if (url.endsWith('units/index.json')) {
      return Promise.resolve(
        json({ textId: 'txt', unitCount: 3, sections: [{ section: 'S', count: 3, chunk: 'chunk-0.json' }], chunks: ['chunk-0.json'] }),
      );
    }
    if (url.endsWith('units/chunk-0.json')) return Promise.resolve(json(units));
    if (url.endsWith('concepts/index.json')) {
      return Promise.resolve(json({ textId: 'txt', conceptCount: 2, chunks: ['chunk-0.json'] }));
    }
    if (url.endsWith('concepts/chunk-0.json')) return Promise.resolve(json(concepts));
    if (url.endsWith('threads/trad.json')) return Promise.resolve(json(threads));
    return Promise.resolve(new Response('nope', { status: 404 }));
  }

  it('ranks related units by shared concepts, excluding self', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getRelatedUnits('txt', 'u1');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.data.map((u) => u.id)).toEqual(['u2']);
    }
  });

  it('returns no related units for an unconceptualised unit', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getRelatedUnits('txt', 'u3');
    expect(result).toEqual({ status: 'ok', data: [] });
  });

  it('finds thread steps mentioning a unit', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getThreadStepsForUnit('trad', 'txt', 'u1');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].stepIndex).toBe(0);
    }
  });

  it('finds thread steps for a concept directly and via units', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getThreadStepsForConcept('trad', 'txt', 'c2');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      // c2 has no direct step, but its units (u1, u2) appear in step s1.
      expect(result.data).toHaveLength(1);
    }
  });
});
