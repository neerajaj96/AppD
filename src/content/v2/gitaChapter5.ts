import { gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import {
  CHAPTER5_APPARATUS,
  CHAPTER5_CLOSING_MATTER,
  CHAPTER5_COMMENTARY_INVENTORY,
  CHAPTER5_OPENING_MATTER,
  chapter5ApparatusCounts,
  chapter5RepoUnit,
} from './gitaChapter5Inventory';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 5 Rāmakaṇṭha scholarly evidence map (Phase 14).
 *
 * One authoritative row per Chapter 5 repository unit (vulgate
 * 5.1–5.29; vulgate 5.19 has no KSTS counterpart inside this chapter —
 * its text stands as KSTS 6.10). Each row derives from the existing
 * backbone tables — page map, passage spans, commentary texts,
 * scholarly threads, quotation edges — plus concept occurrences
 * supplied by the caller. Nothing is duplicated: folios, segments and
 * passages are referenced, never recopied.
 *
 * Verification honesty: `locator-only` stays locator-only; `mulaStatus`
 * is `locator-only` for every verse (mūla present in print, never
 * transcribed). Transcribed Chapter-5 passages use the explicit
 * `text-layer-reviewed` status. No row claims `page-image-collated` —
 * page images were unavailable.
 */

export const CHAPTER5_UNITS: string[] = Array.from({ length: 29 }, (_, i) => `5.${i + 1}`);

export type Chapter5Verification =
  | 'text-layer-reviewed'
  | 'page-image-collated'
  | 'partially-collated'
  | 'locator-only';

export type Chapter5EvidenceStatus =
  | 'source-text'
  | 'segment-grounded'
  | 'locator-only';

export interface Chapter5EvidenceRow {
  unitId: string;
  ksts: string[];
  pdf?: number;
  folio?: number;
  mappingStatus: string;
  /** Mūla state: always locator-only in Phase 14 (present in print, never transcribed). */
  mulaStatus: 'locator-only';
  commentaryAvailable: boolean;
  segmentIds: string[];
  passageIds: string[];
  verification: Chapter5Verification;
  evidenceStatus: Chapter5EvidenceStatus;
  conceptIds: string[];
  threadStepIds: string[];
  xrefIds: string[];
}

export interface Chapter5ConceptLike {
  id: string;
  occurrences?: Array<{ unitId: string; spanId?: string }>;
}

/** Build the authoritative Chapter 5 evidence map (deterministic). */
export function buildChapter5EvidenceMap(
  concepts: Chapter5ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter5EvidenceRow[] {
  return CHAPTER5_UNITS.map((unitId) => {
    const row = gitaMapForUnit(unitId);
    const ksts = row?.ksts || [];
    const segments = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(unitId));
    const passages = GITA_COMMENTARY_TEXTS.filter((p) => (p.unitIds || []).includes(unitId));
    const segmentIds = segments.map((s) => s.id);
    const passageIds = passages.map((p) => p.id);
    const hasText = passageIds.length > 0;
    const hasSegment = segmentIds.length > 0;
    const evidenceStatus: Chapter5EvidenceStatus = hasText
      ? 'source-text'
      : hasSegment
        ? 'segment-grounded'
        : 'locator-only';
    let verification: Chapter5Verification = 'locator-only';
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
      mulaStatus: 'locator-only',
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

/** Coverage statistics for Chapter 5 (counts only, no scores). */
export interface Chapter5Coverage {
  units: { total: number; withLocator: number; withSegment: number; withSourceText: number };
  ksts: { total: number; transcribed: number; untranscribed: number; extras: number };
  mula: { verses: number; transcribed: number; locatorOnly: number };
  commentary: {
    verifiedSource: number;
    textLayerReviewed: number;
    pageImageCollated: number;
    locatorOnlyUnits: number;
    unresolvedPassages: number;
  };
  inventory: { verses: number; transcribed: number; untranscribed: number };
  /** KSTS verses without transcribed source text (continuous gaps). */
  gaps: string[];
  concepts: { sourceGrounded: number; exactTextGrounded: number; locatorOnly: number };
  threads: {
    steps: number;
    sourceTextGrounded: number;
    segmentGrounded: number;
    locatorOnly: number;
  };
  xrefs: { explicit: number; quotation: number; unresolved: number };
  arguments: { total: number; sourceBacked: number; unresolved: number };
  apparatus: { observed: number; mapped: number; unresolved: number };
}

export function auditChapter5(
  map: Chapter5EvidenceRow[] = buildChapter5EvidenceMap(),
  concepts: Chapter5ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter5Coverage {
  const withLocator = map.filter((r) => r.folio !== undefined).length;
  const withSegment = map.filter((r) => r.segmentIds.length > 0).length;
  const withSourceText = map.filter((r) => r.passageIds.length > 0).length;
  const ch5Passages = GITA_COMMENTARY_TEXTS.filter((p) =>
    (p.unitIds || []).some((u) => u.startsWith('5.')),
  );
  const verifiedSource = ch5Passages.filter((p) => p.status === 'verified-source').length;
  const textLayerReviewed = ch5Passages.filter((p) => p.status === 'text-layer-reviewed').length;
  const pageImageCollated = ch5Passages.filter((p) => p.status === 'page-image-collated').length;
  const locatorOnlyUnits = map.filter((r) => r.evidenceStatus === 'locator-only').length;
  const unresolvedPassages = ch5Passages.filter((p) => p.text.includes('[?]')).length;

  const inventoryRows = CHAPTER5_COMMENTARY_INVENTORY;
  const inventoryTranscribed = inventoryRows.filter((r) => r.passageIds.length > 0).length;
  const gaps = inventoryRows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);

  const ch5Concepts = concepts.filter((c) =>
    (c.occurrences || []).some((o) => o.unitId.startsWith('5.')),
  );
  const bySpan = new Map<string, number>();
  for (const p of GITA_COMMENTARY_TEXTS) {
    if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
  }
  let exactTextGrounded = 0;
  let locatorOnlyConcepts = 0;
  for (const c of ch5Concepts) {
    const occs = (c.occurrences || []).filter((o) => o.unitId.startsWith('5.'));
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
      const units = (step.unitIds || []).filter((u) => u.startsWith('5.'));
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

  const hosted = GITA_QUOTATION_EDGES.filter(
    (e) =>
      (e.fromUnitId !== null && e.fromUnitId.startsWith('5.')) ||
      (e.toUnitId !== null && e.toUnitId.startsWith('5.')),
  );
  const quotation = hosted.filter((e) => e.kind === 'commentary-quotes-unit').length;
  const xrefUnresolved = [
    ...CHAPTER5_COMMENTARY_INVENTORY.flatMap((r) => r.unresolved),
    ...CHAPTER5_OPENING_MATTER.flatMap((f) => f.unresolved),
    ...CHAPTER5_CLOSING_MATTER.flatMap((f) => f.unresolved),
  ].filter((u) => u.startsWith('xref:')).length;
  const sourceBackedArgs = CHAPTER5_ARGUMENTS.filter((a) => a.status === 'source').length;
  const unresolvedArgs = CHAPTER5_ARGUMENTS.filter((a) => a.status === 'unresolved').length;
  const apparatus = chapter5ApparatusCounts(CHAPTER5_APPARATUS);
  return {
    units: { total: map.length, withLocator, withSegment, withSourceText },
    ksts: {
      total: inventoryRows.length,
      transcribed: inventoryTranscribed,
      untranscribed: inventoryRows.length - inventoryTranscribed,
      extras: inventoryRows.filter((r) => r.repoUnit === null).length,
    },
    mula: { verses: map.length, transcribed: 0, locatorOnly: map.length },
    commentary: { verifiedSource, textLayerReviewed, pageImageCollated, locatorOnlyUnits, unresolvedPassages },
    inventory: {
      verses: inventoryRows.length,
      transcribed: inventoryTranscribed,
      untranscribed: inventoryRows.length - inventoryTranscribed,
    },
    gaps,
    concepts: {
      sourceGrounded: ch5Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: hosted.length, quotation, unresolved: xrefUnresolved },
    arguments: { total: CHAPTER5_ARGUMENTS.length, sourceBacked: sourceBackedArgs, unresolved: unresolvedArgs },
    apparatus,
  };
}

/** Human-readable rendering of the Chapter 5 audit (counts only). */
export function formatChapter5Audit(coverage: Chapter5Coverage): string {
  return [
    'Chapter 5 Scholarly Audit',
    'Units:',
    `  total: ${coverage.units.total}`,
    `  with source locator: ${coverage.units.withLocator}`,
    `  with commentary segment: ${coverage.units.withSegment}`,
    `  with source text: ${coverage.units.withSourceText}`,
    'KSTS:',
    `  total: ${coverage.ksts.total}`,
    `  transcribed: ${coverage.ksts.transcribed}`,
    `  untranscribed: ${coverage.ksts.untranscribed}`,
    `  extras: ${coverage.ksts.extras}`,
    'Mula:',
    `  verses: ${coverage.mula.verses}`,
    `  transcribed: ${coverage.mula.transcribed}`,
    `  locator-only: ${coverage.mula.locatorOnly}`,
    'Commentary:',
    `  verified source text: ${coverage.commentary.verifiedSource}`,
    `  text-layer reviewed: ${coverage.commentary.textLayerReviewed}`,
    `  page-image collated: ${coverage.commentary.pageImageCollated}`,
    `  locator-only: ${coverage.commentary.locatorOnlyUnits}`,
    `  unresolved passages: ${coverage.commentary.unresolvedPassages}`,
    'Inventory:',
    `  verses: ${coverage.inventory.verses}`,
    `  transcribed: ${coverage.inventory.transcribed}`,
    `  untranscribed: ${coverage.inventory.untranscribed}`,
    `  coverage gaps: ${coverage.gaps.length === 0 ? 'none' : `${coverage.gaps.length} KSTS verses`}`,
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
    `  unresolved: ${coverage.xrefs.unresolved}`,
    'Arguments:',
    `  total: ${coverage.arguments.total}`,
    `  source-backed: ${coverage.arguments.sourceBacked}`,
    `  unresolved: ${coverage.arguments.unresolved}`,
    'Apparatus:',
    `  observed: ${coverage.apparatus.observed}`,
    `  mapped: ${coverage.apparatus.mapped}`,
    `  unresolved: ${coverage.apparatus.unresolved}`,
  ].join('\n');
}

/**
 * Chapter 5 argument edges: each argument points to exact commentary
 * evidence (segment + passage). Roles use the print-supported vocabulary
 * only. Hypotheses without evidence stay out — the list below is exactly
 * the evidenced set, no more. No concept graph is built from these
 * (Phase 14 stops at the evidence-grounded backbone).
 */
export interface Chapter5Argument {
  id: string;
  unitIds: string[];
  ksts: string[];
  role: 'definition' | 'objection' | 'response' | 'distinction' | 'inference' | 'consequence' | 'conclusion' | 'commentary' | 'unresolved';
  claimEn: string;
  segmentId?: string;
  passageId?: string;
  status: 'source' | 'editorial' | 'unresolved';
}

export const CHAPTER5_ARGUMENTS: Chapter5Argument[] = [
  {
    id: 'gita-arg-5-avat-samsaya',
    unitIds: ['5.1'],
    ksts: [],
    role: 'commentary',
    claimEn: 'Hearing separate praises of insight and discipline, Arjuna again doubts whether renunciation or discipline is the better means.',
    segmentId: 'gita-ps-5-avat',
    passageId: 'gita-tx-5-avat',
    status: 'source',
  },
  {
    id: 'gita-arg-5.1-ekam',
    unitIds: ['5.1'],
    ksts: ['5.1'],
    role: 'commentary',
    claimEn: 'Renunciation and discipline cannot be practised together; Arjuna asks which one of the two is certainly better.',
    segmentId: 'gita-seg-5.1-gloss',
    passageId: 'gita-tx-5.1-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-5.2-visesa',
    unitIds: ['5.2'],
    ksts: ['5.2'],
    role: 'conclusion',
    claimEn: 'Both renunciation and discipline bear fruit, but discipline excels renunciation.',
    segmentId: 'gita-seg-5.2-gloss',
    passageId: 'gita-tx-5.2-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-5.28-santi',
    unitIds: ['5.29'],
    ksts: ['5.28'],
    role: 'conclusion',
    claimEn: 'Knowing Me as enjoyer of sacrifices, great lord of worlds and friend of beings, the discipline-yogin attains peace.',
    segmentId: 'gita-seg-5.28-gloss',
    passageId: 'gita-tx-5.28-gloss',
    status: 'source',
  },
];

/** KSTS↔repo offset check for one repository unit (tests + gates). */
export function chapter5KstsForRepo(repoUnit: string): string | null {
  const row = CHAPTER5_COMMENTARY_INVENTORY.find((r) => r.repoUnit === repoUnit);
  return row ? row.ksts : null;
}

export { chapter5RepoUnit };
