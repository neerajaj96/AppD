import { adaptSystemsToV2, adaptSystemThread } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import { GITA_SCHOLARLY_THREADS } from '../gitaThreads';
import { GITA_PASSAGE_SPANS, PASSAGE_SPAN_ROLES, passageSpanById } from '../gitaSpans';
import { GITA_QUOTATION_EDGES } from '../gitaXrefs';
import { gitaMapForUnit } from '../gitaPageMap';
import { validateThreadStep } from '../validate';
import { auditThreads } from '../threadAudit';
import { resolveThreadPosition } from '../../../utils/threadNav';
import { THREAD_STEP_ROLES, THREAD_EVIDENCE_KINDS, THREAD_CLAIM_STATUSES } from '../schema';
import { uiStrings, type UIKey } from '../../../i18n/ui';
import type { ContentIssue } from '../validate';

// Phase-4 thread tests: pilot integrity, URL resolution, audit helper.
// Tradition threads (orientation + scholarly) come from the real adapted
// pipeline, so merge order and indices are asserted, not assumed.

function vedantaThreads() {
  const system = systems.find((s) => (s.id as string) === 'vedanta');
  if (!system) throw new Error('no vedanta system');
  return adaptSystemThread(system as never);
}

function curatedGita() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
  if (!text) throw new Error('no gita text');
  return { corpus, text };
}

describe('scholarly thread merge', () => {
  it('appends three scholarly threads after the orientation thread', () => {
    const threads = vedantaThreads();
    expect(threads.length).toBeGreaterThanOrEqual(4);
    expect(threads[0].kind).toBe('orientation');
    const scholarly = threads.filter((t) => t.kind === 'scholarly');
    expect(scholarly.map((t) => t.id)).toEqual([
      'gita-rk-kshetra',
      'gita-rk-samuccaya-marga',
      'gita-rk-maya-marga',
    ]);
    for (const t of scholarly) {
      expect(t.traditionId).toBe('vedanta');
      expect(t.textId).toBe('bhagavad-gita');
      expect(t.localisations?.en?.title?.trim().length).toBeGreaterThan(0);
      expect(t.localisations?.ml?.title?.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps orientation step indices stable for legacy links', () => {
    const threads = vedantaThreads();
    const orientationSteps = threads[0].steps.length;
    expect(orientationSteps).toBeGreaterThan(0);
    // Legacy global indices address orientation steps first, unchanged.
    const pos = resolveThreadPosition(
      threads.map((t) => ({ id: t.id, steps: t.steps })),
      null,
      '5',
    );
    expect(pos).toEqual({ threadIndex: 0, stepIndex: 4 });
  });
});

describe('thread URL resolution', () => {
  const fake = (n: number) => ({ id: `t${n}`, steps: new Array(n).fill(0) });

  it('addresses scholarly threads directly and clamps safely', () => {
    const threads = [fake(18), { id: 'gita-rk-kshetra', steps: new Array(5).fill(0) }];
    expect(resolveThreadPosition(threads, 'gita-rk-kshetra', '3')).toEqual({ threadIndex: 1, stepIndex: 2 });
    expect(resolveThreadPosition(threads, 'gita-rk-kshetra', '99')).toEqual({ threadIndex: 1, stepIndex: 4 });
    expect(resolveThreadPosition(threads, 'nope', '2')).toEqual({ threadIndex: 0, stepIndex: 1 });
    expect(resolveThreadPosition(threads, null, '20')).toEqual({ threadIndex: 1, stepIndex: 1 });
    expect(resolveThreadPosition(threads, null, null)).toEqual({ threadIndex: 0, stepIndex: 0 });
    expect(resolveThreadPosition([], 'x', '1')).toEqual({ threadIndex: 0, stepIndex: 0 });
  });
});

describe('pilot thread validation', () => {
  function issues() {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    const conceptIds = new Set(text.concepts.map((c) => c.id));
    const out: ContentIssue[] = [];
    for (const thread of GITA_SCHOLARLY_THREADS) {
      thread.steps.forEach((step, i) => {
        validateThreadStep(thread, step, { unitIds, conceptIds }, (issue) => out.push(issue), 'bhagavad-gita', i);
      });
    }
    return out;
  }

  it('raises no errors across all pilot steps', () => {
    expect(issues()).toEqual([]);
  });

  it('resolves every step unit through the concordance with KSTS numbers', () => {
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        expect((step.unitIds || []).length).toBeGreaterThan(0);
        for (const uid of step.unitIds || []) {
          const row = gitaMapForUnit(uid);
          expect(row).toBeDefined();
          expect(row?.ksts.length).toBeGreaterThan(0);
          expect(row?.folio).toBeDefined();
        }
      }
    }
  });

  it('uses the corrected chapter-13 mapping in every ch13 step', () => {
    const kshetra = GITA_SCHOLARLY_THREADS.find((t) => t.id === 'gita-rk-kshetra');
    const units = (kshetra?.steps || []).flatMap((s) => s.unitIds || []);
    expect(units).toContain('13.2');
    expect(units).toContain('13.3');
    expect(gitaMapForUnit('13.3')?.ksts).toEqual(['13.2']);
  });

  it('resolves span references to verified passage spans', () => {
    const known = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        for (const sid of step.spanIds || []) expect(known.has(sid)).toBe(true);
      }
    }
    expect(passageSpanById('gita-ps-13.2-nanu')?.role).toBe('objection');
    for (const role of GITA_PASSAGE_SPANS.map((s) => s.role).filter(Boolean)) {
      expect(PASSAGE_SPAN_ROLES).toContain(role);
    }
  });

  it('keeps every claim source-backed with a vocabulary role', () => {
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        if (step.role !== undefined) expect(THREAD_STEP_ROLES).toContain(step.role);
        if (step.evidenceKind !== undefined) expect(THREAD_EVIDENCE_KINDS).toContain(step.evidenceKind);
        if (step.claimStatus !== undefined) expect(THREAD_CLAIM_STATUSES).toContain(step.claimStatus);
        const claim = step.localisations.en?.claim || step.localisations.ml?.claim;
        if (claim) expect(step.claimStatus).toBe('source-backed');
      }
    }
  });

  it('introduces no cross-tradition steps', () => {
    for (const thread of GITA_SCHOLARLY_THREADS) {
      expect(thread.traditionId).toBe('vedanta');
      for (const step of thread.steps) {
        expect(step.textId || thread.textId).toBe('bhagavad-gita');
      }
    }
  });

  it('requires no Sanskrit beyond printed terms (no fabricated quotations)', () => {
    // Steps carry no devanāgarī/iast payloads at all in this phase.
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        expect((step as { devanagari?: unknown }).devanagari).toBeUndefined();
        expect((step as { iast?: unknown }).iast).toBeUndefined();
      }
    }
  });
});

describe('thread audit helper', () => {
  it('reports density per pilot thread', () => {
    const rows = auditThreads(GITA_SCHOLARLY_THREADS, GITA_QUOTATION_EDGES);
    expect(rows.map((r) => r.threadId)).toEqual([
      'gita-rk-kshetra',
      'gita-rk-samuccaya-marga',
      'gita-rk-maya-marga',
    ]);
    for (const row of rows) {
      expect(row.steps).toBe(5);
      expect(row.sourceBackedSteps).toBe(5);
      expect(row.editorialSteps).toBe(0);
      expect(row.transitions).toBe(4);
      expect(row.distinctUnits).toBeGreaterThan(0);
      expect(row.distinctConcepts).toBeGreaterThan(0);
    }
    const kshetra = rows.find((r) => r.threadId === 'gita-rk-kshetra');
    expect(kshetra?.distinctUnits).toBe(2);
    expect(kshetra?.distinctConcepts).toBe(4);
  });
});

describe('thread interface strings', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = [
      'threadOrientation',
      'threadScholarly',
      'threadTypeConcept',
      'threadTypeArgument',
      'threadTypeCrossVerse',
      'threadTypeChapter',
      'threadTypeDoctrinal',
      'threadTypeRecensional',
      'roleQuestion',
      'rolePremise',
      'roleObjection',
      'roleResponse',
      'roleDistinction',
      'roleDefinition',
      'roleExample',
      'roleInference',
      'roleConsequence',
      'roleConclusion',
      'roleContext',
      'roleUnresolved',
      'evDirect',
      'evCrossRef',
      'evStructural',
      'evSynthesis',
      'claimSourceBacked',
      'claimEditorial',
      'claimLabel',
      'transitionLabel',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps Malayalam UI strings in Malayalam/Latin/Devanagari scripts only', () => {
    const keys: UIKey[] = [
      'threadOrientation', 'threadScholarly', 'roleObjection', 'roleResponse',
      'transitionLabel', 'claimLabel', 'evSynthesis',
    ];
    for (const key of keys) {
      const s = uiStrings.ml[key];
      expect(s).not.toMatch(/[\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0980-\u09FF]/);
    }
  });
});

describe('thread Malayalam script hygiene', () => {
  it('carries no Tamil/Telugu/Kannada codepoints in thread localisations', () => {
    const bad = /[\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0980-\u09FF]/;
    const scan = (s: string | undefined) => {
      if (s) expect(s).not.toMatch(bad);
    };
    for (const thread of GITA_SCHOLARLY_THREADS) {
      scan(thread.localisations?.en?.title);
      scan(thread.localisations?.ml?.title);
      scan(thread.localisations?.en?.summary);
      scan(thread.localisations?.ml?.summary);
      for (const step of thread.steps) {
        scan(step.localisations.en?.title);
        scan(step.localisations.ml?.title);
        scan(step.localisations.en?.claim);
        scan(step.localisations.ml?.claim);
        scan(step.localisations.en?.transition);
        scan(step.localisations.ml?.transition);
      }
    }
  });
});
