import * as fs from 'node:fs';
import * as path from 'node:path';
import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import {
  buildConceptOccurrenceIndex,
  findOccurrences,
  occurrenceTraditions,
} from '../occurrences';
import type { ConceptOccurrenceIndex } from '../occurrences';
import { buildConceptGraph, layoutGraph } from '../conceptGraph';
import { conceptSummary } from '../../../search/rank';
import type { CanonicalUnit, V2Concept } from '../schema';

// Prompt 5 knowledge-layer tests: cross-text occurrences, canonical
// identity, graph data, search summaries. Deterministic; no network.

const units: CanonicalUnit[] = [
  { id: 'u1', number: '1', section: 'S', unitType: 'sutra', iast: '', localisations: {} },
  { id: 'u2', number: '2', section: 'S', unitType: 'sutra', iast: '', localisations: {} },
];

function concept(id: string, relatedUnitIds: string[] = []): V2Concept {
  return {
    id,
    relatedUnitIds,
    localisations: { en: { title: `Title ${id}`, summary: 's' } },
  };
}

describe('occurrence index builder', () => {
  it('groups transliteration variants under one normalised key', () => {
    const index = buildConceptOccurrenceIndex([
      { traditionId: 'yoga', textId: 'yoga-sutras', concepts: [concept('satkāryavāda', ['u1'])], units },
      { traditionId: 'samkhya', textId: 'samkhya-karika', concepts: [concept('satkaryavada', ['u2'])], units },
    ]);
    expect(index.concepts).toHaveLength(1);
    expect(index.concepts[0].key).toBe('satkaryavada');
    // Deterministic (traditionId, textId) order: samkhya before yoga.
    expect(index.concepts[0].occurrences.map((o) => o.traditionId)).toEqual(['samkhya', 'yoga']);
  });

  it('keeps distinct canonical identities as separate occurrences', () => {
    const index = buildConceptOccurrenceIndex([
      {
        traditionId: 'vedanta',
        textId: 'brahma-sutras',
        concepts: [concept('maya', ['u1']), concept('maya-vada', ['u2'])],
        units,
      },
    ]);
    expect(index.concepts.map((c) => c.key).sort()).toEqual(['maya', 'maya-vada']);
  });

  it('maps units with number and section, skipping dangling links', () => {
    const index = buildConceptOccurrenceIndex([
      { traditionId: 't', textId: 'x', concepts: [concept('c', ['u1', 'ghost'])], units },
    ]);
    const occ = index.concepts[0].occurrences[0];
    expect(occ.unitCount).toBe(1);
    expect(occ.units).toEqual([{ unitId: 'u1', number: '1', section: 'S' }]);
  });

  it('finds occurrences by diacritic/case/separator variants', () => {
    const index = buildConceptOccurrenceIndex([
      { traditionId: 'yoga', textId: 'yoga-sutras', concepts: [concept('citta-vṛtti', ['u1'])], units },
    ]);
    expect(findOccurrences(index, 'citta-vrtti')).toHaveLength(1);
    expect(findOccurrences(index, 'Citta_Vrtti')).toHaveLength(1);
    expect(findOccurrences(index, 'nope')).toEqual([]);
    expect(occurrenceTraditions(findOccurrences(index, 'citta-vrtti'))).toEqual(['yoga']);
  });
});

describe('repository cross-text discovery', () => {
  const occurrenceIndex: ConceptOccurrenceIndex = {
    schemaVersion: 2,
    generatedAt: '2026-01-01T00:00:00.000Z',
    concepts: [
      {
        key: 'purusa',
        occurrences: [
          {
            traditionId: 'yoga',
            textId: 'yoga-sutras',
            conceptId: 'puruṣa',
            title: 'Puruṣa',
            unitCount: 2,
            units: [
              { unitId: 'u1', number: '1', section: 'S' },
              { unitId: 'u2', number: '2', section: 'S' },
            ],
          },
          {
            traditionId: 'samkhya',
            textId: 'samkhya-karika',
            conceptId: 'purusa',
            title: 'Puruṣa',
            unitCount: 1,
            units: [{ unitId: 'u9', number: '9', section: 'K' }],
          },
        ],
      },
    ],
  };
  const catalog = {
    schemaVersion: 2,
    generatedAt: '2026-01-01T00:00:00.000Z',
    traditions: [
      { id: 'samkhya', title: 'S', textIds: [], threadSteps: 0 },
      { id: 'yoga', title: 'Y', textIds: [], threadSteps: 0 },
    ],
    texts: [],
  };
  function mockFetch(url: string): Promise<Response> {
    const json = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
    if (url.endsWith('concepts/index.json')) return Promise.resolve(json(occurrenceIndex));
    if (url.endsWith('content/manifest.json')) return Promise.resolve(json(catalog));
    if (url.endsWith('threads/yoga.json')) {
      return Promise.resolve(
        json([
          {
            id: 'yoga-thread',
            traditionId: 'yoga',
            steps: [
              { id: 's1', textId: 'yoga-sutras', conceptId: 'Puruṣa', unitIds: [], localisations: {} },
              { id: 's2', textId: 'yoga-sutras', unitIds: ['u1'], localisations: {} },
            ],
          },
        ]),
      );
    }
    return Promise.resolve(new Response('nope', { status: 404 }));
  }

  it('returns occurrences ordered by catalog tradition order', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getConceptOccurrences('puruṣa');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      // Catalog lists samkhya first even though the index lists yoga first.
      expect(result.data.map((o) => o.traditionId)).toEqual(['samkhya', 'yoga']);
      // Distinct identities preserved, not merged.
      expect(result.data.map((o) => o.conceptId)).toEqual(['purusa', 'puruṣa']);
    }
  });

  it('reports unknown concepts as missing, not as throws', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    expect(await repo.getConceptOccurrences('nothing-here')).toEqual({
      status: 'missing',
      message: 'No such concept: nothing-here',
    });
    expect(await repo.getConceptOccurrences('')).toEqual({
      status: 'missing',
      message: 'No such concept: ',
    });
  });

  it('matches thread steps on normalised identity within one tradition file', async () => {
    const repo = new V2Repository(new FetchChunkLoader(mockFetch));
    const result = await repo.getTraditionConceptThreadSteps('yoga', 'puruṣa');
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      // Only the direct concept step; unit-only matching needs unit lists.
      expect(result.data.map((s) => s.stepIndex)).toEqual([0]);
    }
  });
});

describe('concept graph data', () => {
  const related = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      traditionId: 'yoga',
      textId: 'yoga-sutras',
      conceptId: `c${i}`,
      title: `Concept ${i}`,
    }));
  it('returns null when too sparse to map', () => {
    expect(
      buildConceptGraph({
        traditionId: 'yoga',
        textId: 'yoga-sutras',
        conceptId: 'c',
        title: 'C',
        related: related(1),
        occurrences: [],
      }),
    ).toBeNull();
  });
  it('centres the concept with capped, deterministic satellites', () => {
    const graph = buildConceptGraph({
      traditionId: 'yoga',
      textId: 'yoga-sutras',
      conceptId: 'c',
      title: 'C',
      related: related(10),
      occurrences: [
        { traditionId: 'yoga', textId: 'yoga-sutras', conceptId: 'c', title: 'C', unitCount: 1, units: [] },
        { traditionId: 'samkhya', textId: 'samkhya-karika', conceptId: 'c', title: 'C', unitCount: 1, units: [] },
        { traditionId: 'vedanta', textId: 'brahma-sutras', conceptId: 'c', title: 'C', unitCount: 1, units: [] },
      ],
    });
    expect(graph?.center.kind).toBe('self');
    const concepts = graph?.satellites.filter((s) => s.kind === 'concept') || [];
    const traditions = graph?.satellites.filter((s) => s.kind === 'tradition') || [];
    expect(concepts).toHaveLength(8);
    expect(concepts[0].href).toBe('/system/yoga/text/yoga-sutras/concept/c0');
    // Current tradition excluded from tradition nodes.
    expect(traditions.map((s) => s.id)).toEqual(['tradition:samkhya', 'tradition:vedanta']);
    expect(graph?.hiddenRelated).toBe(2);
    expect(graph?.hiddenTraditions).toBe(0);
  });

  it('labels traditions with caller-resolved display titles, never raw ids', () => {
    const graph = buildConceptGraph({
      traditionId: 'yoga',
      textId: 'yoga-sutras',
      conceptId: 'c',
      title: 'C',
      related: related(3),
      occurrences: [
        { traditionId: 'kashmir-shaivism', traditionLabel: 'Kashmir Shaivism', detail: '2 texts · 5 units' },
      ],
    });
    const node = graph?.satellites.find((s) => s.kind === 'tradition');
    expect(node?.label).toBe('Kashmir Shaivism');
    expect(node?.detail).toBe('2 texts · 5 units');
    expect(node?.href).toBe('/system/kashmir-shaivism');
  });

  it('counts overflow beyond the display caps deterministically', () => {
    const occurrences = Array.from({ length: 8 }, (_, i) => ({ traditionId: `t${i}` }));
    const graph = buildConceptGraph({
      traditionId: 'home',
      textId: 'x',
      conceptId: 'c',
      title: 'C',
      related: related(2),
      occurrences,
    });
    expect(graph?.satellites.filter((s) => s.kind === 'tradition')).toHaveLength(6);
    expect(graph?.hiddenTraditions).toBe(2);
  });

  it('lays out every node inside the canvas, deterministically', () => {
    const graph = buildConceptGraph({
      traditionId: 'yoga',
      textId: 'yoga-sutras',
      conceptId: 'c',
      title: 'C',
      related: related(8),
      occurrences: [{ traditionId: 'samkhya' }, { traditionId: 'vedanta' }],
    });
    if (!graph) throw new Error('expected a graph');
    const first = layoutGraph(graph);
    const second = layoutGraph(graph);
    expect(first).toEqual(second);
    expect(first.nodes).toHaveLength(10);
    for (const node of first.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(first.width);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(first.height);
      expect(typeof node.labelBelow).toBe('boolean');
    }
    // Narrow canvas (mobile report width) stays bounded too.
    const narrow = layoutGraph(graph, 320, 300);
    for (const node of narrow.nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(narrow.width);
    }
  });
});

describe('search concept summaries', () => {
  const entry = {
    key: 'concept:yoga/yoga-sutras/c',
    traditionId: 'yoga',
    textId: 'yoga-sutras',
    conceptId: 'c',
    kind: 'concept',
    title: 'Citta-vrtti',
    en: 'Citta-vrtti \n Turnings of awareness explained at length here.',
    ml: 'ചിത്തവൃത്തി \n ബോധത്തിന്റെ ചലനങ്ങൾ.',
    devanagari: '',
    iast: '',
    normalised: 'citta-vrtti',
  } as Parameters<typeof conceptSummary>[0];
  it('strips the title and prefers the requested language', () => {
    expect(conceptSummary(entry, 'en')).toBe('Turnings of awareness explained at length here.');
    // The Malayalam blob opens with its own script title, which is the
    // useful line to show (the Latin title already heads the row).
    expect(conceptSummary(entry, 'ml')).toBe('ചിത്തവൃത്തി');
  });
  it('falls back to English and handles empties', () => {
    expect(conceptSummary({ ...entry, ml: '' }, 'ml')).toBe('Turnings of awareness explained at length here.');
    expect(conceptSummary({ ...entry, en: '', ml: '' }, 'en')).toBe('');
  });
});

describe('occurrence index file shape', () => {
  it('is valid JSON with the documented top-level shape', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'concepts', 'index.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content/concepts/index.json missing (run content:chunks); skipping');
      return;
    }
    const index = JSON.parse(fs.readFileSync(file, 'utf8')) as ConceptOccurrenceIndex;
    expect(index.schemaVersion).toBe(2);
    expect(index.concepts.length).toBeGreaterThan(1000);
    for (const entry of index.concepts.slice(0, 50)) {
      expect(typeof entry.key).toBe('string');
      for (const occ of entry.occurrences) {
        expect(occ.traditionId && occ.textId && occ.conceptId).toBeTruthy();
      }
    }
  });
});
