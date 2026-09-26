import { GITA_UNIT_MAP, gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 13 Rāmakaṇṭha scholarly evidence map (Phase 7).
 *
 * One authoritative row per Chapter 13 unit currently represented in
 * Darśana (vulgate 13.1–13.35). Each row derives from the existing
 * backbone tables — page map, passage spans, commentary texts, scholarly
 * threads, quotation edges — plus concept occurrences supplied by the
 * caller (the adapted corpus). Nothing is duplicated: KSTS numbers,
 * folios, segments and passages are referenced, never recopied.
 *
 * Verification honesty (the critical invariant): `locator-only` stays
 * locator-only no matter how the UI renders it; `verified-source`
 * (Phase 6) means text-layer-reviewed, never page-image-collated;
 * Phase-7 records use the explicit `text-layer-reviewed` status. No row
 * claims `page-image-collated` — page images were unavailable.
 */

export const CHAPTER13_UNITS: string[] = Array.from({ length: 35 }, (_, i) => `13.${i + 1}`);

export type Chapter13Verification =
  | 'text-layer-reviewed'
  | 'page-image-collated'
  | 'partially-collated'
  | 'locator-only';

export type Chapter13EvidenceStatus =
  | 'source-text'
  | 'segment-grounded'
  | 'locator-only';

export interface Chapter13EvidenceRow {
  unitId: string;
  ksts: string[];
  pdf?: number;
  folio?: number;
  mappingStatus: string;
  commentaryAvailable: boolean;
  segmentIds: string[];
  passageIds: string[];
  verification: Chapter13Verification;
  evidenceStatus: Chapter13EvidenceStatus;
  conceptIds: string[];
  threadStepIds: string[];
  xrefIds: string[];
}

export interface Chapter13ConceptLike {
  id: string;
  occurrences?: Array<{ unitId: string; spanId?: string }>;
}

/** Build the authoritative Chapter 13 evidence map (deterministic). */
export function buildChapter13EvidenceMap(
  concepts: Chapter13ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter13EvidenceRow[] {
  return CHAPTER13_UNITS.map((unitId) => {
    const row = gitaMapForUnit(unitId);
    const ksts = row?.ksts || [];
    const segments = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(unitId));
    const passages = GITA_COMMENTARY_TEXTS.filter((p) => (p.unitIds || []).includes(unitId));
    const segmentIds = segments.map((s) => s.id);
    const passageIds = passages.map((p) => p.id);
    const hasText = passageIds.length > 0;
    const hasSegment = segmentIds.length > 0;
    const evidenceStatus: Chapter13EvidenceStatus = hasText
      ? 'source-text'
      : hasSegment
        ? 'segment-grounded'
        : 'locator-only';
    let verification: Chapter13Verification = 'locator-only';
    if (hasText) {
      const statuses = new Set(passages.map((p) => p.status));
      if (statuses.has('page-image-collated')) verification = 'page-image-collated';
      else if (statuses.has('partially-collated')) verification = 'partially-collated';
      else verification = 'text-layer-reviewed';
    }
    const conceptIds = concepts
      .filter((c) => (c.occurrences || []).some((o) => o.unitId === unitId))
      .map((c) => c.id);
    const threadStepIds: string[] = [];
    for (const thread of threads) {
      for (const step of thread.steps) {
        if ((step.unitIds || []).includes(unitId)) threadStepIds.push(`${thread.id}/${step.id}`);
      }
    }
    const xrefIds = GITA_QUOTATION_EDGES.filter(
      (e) => e.fromUnitId === unitId || e.toUnitId === unitId,
    ).map((e) => e.id);
    return {
      unitId,
      ksts,
      pdf: row?.pdf,
      folio: row?.folio,
      mappingStatus: row?.status || 'missing',
      commentaryAvailable: hasSegment || hasText || (row?.ksts.length || 0) > 0,
      segmentIds,
      passageIds,
      verification,
      evidenceStatus,
      conceptIds,
      threadStepIds,
      xrefIds,
    };
  });
}

/** Coverage statistics for Chapter 13 (counts only, no scores). */
export interface Chapter13Coverage {
  units: { total: number; withLocator: number; withSegment: number; withSourceText: number };
  commentary: {
    verifiedSource: number;
    textLayerReviewed: number;
    pageImageCollated: number;
    locatorOnlyUnits: number;
  };
  concepts: { sourceGrounded: number; exactTextGrounded: number; locatorOnly: number };
  threads: {
    steps: number;
    sourceTextGrounded: number;
    segmentGrounded: number;
    locatorOnly: number;
  };
  xrefs: { explicit: number; quotation: number; editorial: number; unresolved: number };
}

export function auditChapter13(
  map: Chapter13EvidenceRow[] = buildChapter13EvidenceMap(),
  concepts: Chapter13ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter13Coverage {
  const withLocator = map.filter((r) => r.folio !== undefined).length;
  const withSegment = map.filter((r) => r.segmentIds.length > 0).length;
  const withSourceText = map.filter((r) => r.passageIds.length > 0).length;
  const ch13Passages = GITA_COMMENTARY_TEXTS.filter((p) =>
    (p.unitIds || []).some((u) => u.startsWith('13.')),
  );
  const verifiedSource = ch13Passages.filter((p) => p.status === 'verified-source').length;
  const textLayerReviewed = ch13Passages.filter((p) => p.status === 'text-layer-reviewed').length;
  const pageImageCollated = ch13Passages.filter((p) => p.status === 'page-image-collated').length;
  const locatorOnlyUnits = map.filter((r) => r.evidenceStatus === 'locator-only').length;

  const ch13Concepts = concepts.filter((c) =>
    (c.occurrences || []).some((o) => o.unitId.startsWith('13.')),
  );
  const bySpan = new Map<string, number>();
  for (const p of GITA_COMMENTARY_TEXTS) {
    if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
  }
  let exactTextGrounded = 0;
  let locatorOnlyConcepts = 0;
  for (const c of ch13Concepts) {
    const occs = (c.occurrences || []).filter((o) => o.unitId.startsWith('13.'));
    const hit = occs.some(
      (o) =>
        (o.spanId !== undefined && bySpan.has(o.spanId)) ||
        GITA_COMMENTARY_TEXTS.some(
          (p) => p.spanId === undefined && (p.unitIds || []).includes(o.unitId),
        ),
    );
    if (hit) exactTextGrounded += 1;
    else locatorOnlyConcepts += 1;
  }

  let steps = 0;
  let sourceTextGrounded = 0;
  let segmentGrounded = 0;
  let locatorOnlySteps = 0;
  for (const thread of threads) {
    for (const step of thread.steps) {
      const units = (step.unitIds || []).filter((u) => u.startsWith('13.'));
      if (units.length === 0) continue;
      steps += 1;
      const spanCovered = (step.spanIds || []).some((sid) => bySpan.has(sid));
      const unitCovered = GITA_COMMENTARY_TEXTS.some(
        (p) => p.spanId === undefined && (p.unitIds || []).some((u) => units.includes(u)),
      );
      if (spanCovered || unitCovered) sourceTextGrounded += 1;
      else if ((step.spanIds || []).length > 0) segmentGrounded += 1;
      else locatorOnlySteps += 1;
    }
  }

  const ch13Xrefs = GITA_QUOTATION_EDGES.filter(
    (e) =>
      (e.fromUnitId !== null && e.fromUnitId.startsWith('13.')) ||
      (e.toUnitId !== null && e.toUnitId.startsWith('13.')) ||
      e.fromUnitId === null,
  );
  const quotation = ch13Xrefs.filter((e) => e.kind === 'commentary-quotes-unit').length;
  return {
    units: { total: map.length, withLocator, withSegment, withSourceText },
    commentary: { verifiedSource, textLayerReviewed, pageImageCollated, locatorOnlyUnits },
    concepts: {
      sourceGrounded: ch13Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: ch13Xrefs.length, quotation, editorial: 0, unresolved: 0 },
  };
}

/** Human-readable rendering of the Chapter 13 audit (counts only). */
export function formatChapter13Audit(coverage: Chapter13Coverage): string {
  return [
    'Chapter 13 Scholarly Audit',
    'Units:',
    `  total: ${coverage.units.total}`,
    `  with source locator: ${coverage.units.withLocator}`,
    `  with commentary segment: ${coverage.units.withSegment}`,
    `  with source text: ${coverage.units.withSourceText}`,
    'Commentary:',
    `  verified source text: ${coverage.commentary.verifiedSource}`,
    `  text-layer reviewed: ${coverage.commentary.textLayerReviewed}`,
    `  page-image collated: ${coverage.commentary.pageImageCollated}`,
    `  locator-only: ${coverage.commentary.locatorOnlyUnits}`,
    'Concepts:',
    `  source-grounded: ${coverage.concepts.sourceGrounded}`,
    `  exact-text grounded: ${coverage.concepts.exactTextGrounded}`,
    `  locator-only: ${coverage.concepts.locatorOnly}`,
    'Threads:',
    `  steps: ${coverage.threads.steps}`,
    `  source-text grounded: ${coverage.threads.sourceTextGrounded}`,
    `  segment grounded: ${coverage.threads.segmentGrounded}`,
    `  locator-only: ${coverage.threads.locatorOnly}`,
    'Cross-references:',
    `  explicit: ${coverage.xrefs.explicit}`,
    `  quotation: ${coverage.xrefs.quotation}`,
    `  editorial: ${coverage.xrefs.editorial}`,
    `  unresolved: ${coverage.xrefs.unresolved}`,
  ].join('\n');
}

/**
 * Chapter 13 argument edges (Phase 7): each argument points to exact
 * commentary evidence (segment + optional passage). Roles use the
 * print-supported vocabulary only; otherwise `commentary` (generic).
 * Hypotheses without evidence stay out — the list below is exactly the
 * evidenced set, no more.
 */
export interface Chapter13Argument {
  id: string;
  unitIds: string[];
  ksts: string[];
  role: 'definition' | 'objection' | 'response' | 'distinction' | 'inference' | 'consequence' | 'conclusion' | 'commentary' | 'unresolved';
  claimEn: string;
  segmentId?: string;
  passageId?: string;
  status: 'source' | 'editorial' | 'unresolved';
}

export const CHAPTER13_ARGUMENTS: Chapter13Argument[] = [
  {
    id: 'gita-arg-13.2-field-def',
    unitIds: ['13.2'],
    ksts: ['13.1'],
    role: 'definition',
    claimEn: 'The body (śarīra) is the field (kṣetra) as the locus of karmic fruition.',
    segmentId: 'gita-seg-13.1-glosa',
    passageId: 'gita-tx-13.1-glosa',
    status: 'source',
  },
  {
    id: 'gita-arg-13.3-knower-obj',
    unitIds: ['13.2', '13.3'],
    ksts: ['13.1', '13.2'],
    role: 'objection',
    claimEn: 'If the self is one percipient, per-field plurality of knowers looks contradictory.',
    segmentId: 'gita-ps-13.2-nanu',
    passageId: 'gita-tx-13.2-nanu',
    status: 'source',
  },
  {
    id: 'gita-arg-13.3-vedaka-dist',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    role: 'distinction',
    claimEn: 'Unfailing knowership alone marks ātman; plurality belongs to known bodies.',
    segmentId: 'gita-seg-13.2-resolution',
    passageId: 'gita-tx-13.2-resolution',
    status: 'source',
  },
  {
    id: 'gita-arg-13.3-maya-concl',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    role: 'conclusion',
    claimEn: 'Per-body difference is acintyeśvara-māyāśakti play, taught for setting aside.',
    segmentId: 'gita-seg-13.2-resolution',
    passageId: 'gita-tx-13.2-resolution',
    status: 'source',
  },
  {
    id: 'gita-arg-13.4-vikari-def',
    unitIds: ['13.4'],
    ksts: ['13.3'],
    role: 'definition',
    claimEn: 'The vikāri in the field is what has distinctive cause-effect character.',
    segmentId: 'gita-seg-13.3-gloss',
    passageId: 'gita-tx-13.3-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-13.6-ksetra-def',
    unitIds: ['13.6'],
    ksts: ['13.5'],
    role: 'definition',
    claimEn: 'The mahābhūtādi aggregate, with its modifications and material base, is the field in brief.',
    segmentId: 'gita-seg-13.5-gloss',
    passageId: 'gita-tx-13.5-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-13.7-iccha-def',
    unitIds: ['13.7'],
    ksts: ['13.6'],
    role: 'definition',
    claimEn: 'Desire, hatred and their cohort, though taken as self-properties elsewhere, are field by knowability.',
    segmentId: 'gita-seg-13.6-iccha',
    passageId: 'gita-tx-13.6-iccha',
    status: 'source',
  },
  {
    id: 'gita-arg-13.12-ajnana-concl',
    unitIds: ['13.12'],
    ksts: ['13.11'],
    role: 'conclusion',
    claimEn: 'Whatever stands contrary to the virtue aggregate (mānitva etc.) is ajñāna, opposite of knowledge.',
    segmentId: 'gita-seg-13.11-ajnana',
    passageId: 'gita-tx-13.11-ajnana',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-jneya-resp',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'response',
    claimEn: 'The supreme object has no ultimate knowability; jneya language is upacāra for the ārurukṣā stage.',
    segmentId: 'gita-seg-13.12-jneya-resp',
    passageId: 'gita-tx-13.12-jneya-resp',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-anadi-def',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'definition',
    claimEn: 'Unlike the caused, beginning-ended known, the supreme Brahman is beginningless being.',
    segmentId: 'gita-seg-13.12-anadi',
    passageId: 'gita-tx-13.12-anadi',
    status: 'source',
  },
  {
    id: 'gita-arg-13.20-anadi-infer',
    unitIds: ['13.20'],
    ksts: ['13.19'],
    role: 'inference',
    claimEn: 'Prakṛti and puruṣa, expounded as object/body and subject/embodied, are beginningless in mutual relation.',
    segmentId: 'gita-seg-13.19-prakrti',
    passageId: 'gita-tx-13.19-prakrti',
    status: 'source',
  },
  {
    id: 'gita-arg-13.21-karya-def',
    unitIds: ['13.21'],
    ksts: ['13.20'],
    role: 'definition',
    claimEn: 'Effect and instruments (elements + senses) as a body-group are called kārya-kāraṇa.',
    segmentId: 'gita-seg-13.20-karya',
    passageId: 'gita-tx-13.20-karya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.23-mahesvara-conseq',
    unitIds: ['13.23'],
    ksts: ['13.22'],
    role: 'consequence',
    claimEn: 'As upadraṣṭā etc. through self-māyā-contrived puruṣa reference, the same is called paramātman on discrimination.',
    segmentId: 'gita-seg-13.22-mahesvara',
    passageId: 'gita-tx-13.22-mahesvara',
    status: 'source',
  },
  {
    id: 'gita-arg-13.35-antara-concl',
    unitIds: ['13.35'],
    ksts: ['13.34'],
    role: 'conclusion',
    claimEn: 'Knowing the distinction of lower (bodily) and higher (jīva) nature is the chapter synthesis.',
    segmentId: 'gita-seg-13.34-synthesis',
    passageId: 'gita-tx-13.34-synthesis',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-jneya-obj',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'unresolved',
    claimEn: 'How an exclusive self-luminous knower is designated knowable like an external object (nanu stated, full wording untranscribed).',
    status: 'unresolved',
  },
];

/** Chapter-13-only view of the unit map (for the evidence-map table). */
export function chapter13UnitMap(): Record<string, (typeof GITA_UNIT_MAP)[string]> {
  const out: Record<string, (typeof GITA_UNIT_MAP)[string]> = {};
  for (const unitId of CHAPTER13_UNITS) {
    const row = GITA_UNIT_MAP[unitId];
    if (row) out[unitId] = row;
  }
  return out;
}
