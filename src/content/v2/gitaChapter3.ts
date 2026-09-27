import { gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import {
  CHAPTER3_APPARATUS,
  CHAPTER3_CLOSING_MATTER,
  CHAPTER3_COMMENTARY_INVENTORY,
  CHAPTER3_OPENING_MATTER,
  chapter3ApparatusCounts,
  chapter3RepoUnit,
} from './gitaChapter3Inventory';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 3 Rāmakaṇṭha scholarly evidence map (Phase 12).
 *
 * One authoritative row per Chapter 3 repository unit (vulgate 3.1–3.43;
 * KSTS runs 1–48 with extras at 38–42). Each row derives from the
 * existing backbone tables — page map, passage spans, commentary texts,
 * scholarly threads, quotation edges — plus concept occurrences supplied
 * by the caller. Nothing is duplicated: folios, segments and passages
 * are referenced, never recopied.
 *
 * Verification honesty: `locator-only` stays locator-only; `mulaStatus`
 * is `locator-only` for every verse (mūla present in print, never
 * transcribed). Transcribed Chapter-3 passages use the explicit
 * `text-layer-reviewed` status. No row claims `page-image-collated` —
 * page images were unavailable.
 */

export const CHAPTER3_UNITS: string[] = Array.from({ length: 43 }, (_, i) => `3.${i + 1}`);

export type Chapter3Verification =
  | 'text-layer-reviewed'
  | 'page-image-collated'
  | 'partially-collated'
  | 'locator-only';

export type Chapter3EvidenceStatus =
  | 'source-text'
  | 'segment-grounded'
  | 'locator-only';

export interface Chapter3EvidenceRow {
  unitId: string;
  ksts: string[];
  pdf?: number;
  folio?: number;
  mappingStatus: string;
  /** Mūla state: always locator-only in Phase 12 (present in print, never transcribed). */
  mulaStatus: 'locator-only';
  commentaryAvailable: boolean;
  segmentIds: string[];
  passageIds: string[];
  verification: Chapter3Verification;
  evidenceStatus: Chapter3EvidenceStatus;
  conceptIds: string[];
  threadStepIds: string[];
  xrefIds: string[];
}

export interface Chapter3ConceptLike {
  id: string;
  occurrences?: Array<{ unitId: string; spanId?: string }>;
}

/** Build the authoritative Chapter 3 evidence map (deterministic). */
export function buildChapter3EvidenceMap(
  concepts: Chapter3ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter3EvidenceRow[] {
  return CHAPTER3_UNITS.map((unitId) => {
    const row = gitaMapForUnit(unitId);
    const ksts = row?.ksts || [];
    const segments = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(unitId));
    const passages = GITA_COMMENTARY_TEXTS.filter((p) => (p.unitIds || []).includes(unitId));
    const segmentIds = segments.map((s) => s.id);
    const passageIds = passages.map((p) => p.id);
    const hasText = passageIds.length > 0;
    const hasSegment = segmentIds.length > 0;
    const evidenceStatus: Chapter3EvidenceStatus = hasText
      ? 'source-text'
      : hasSegment
        ? 'segment-grounded'
        : 'locator-only';
    let verification: Chapter3Verification = 'locator-only';
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

/** KSTS extras with no repository unit (inventoried, never mapped). */
export function chapter3ExtraVerses(): string[] {
  return CHAPTER3_COMMENTARY_INVENTORY.filter((r) => r.repoUnit === null).map((r) => r.ksts);
}

/** Coverage statistics for Chapter 3 (counts only, no scores). */
export interface Chapter3Coverage {
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

export function auditChapter3(
  map: Chapter3EvidenceRow[] = buildChapter3EvidenceMap(),
  concepts: Chapter3ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter3Coverage {
  const withLocator = map.filter((r) => r.folio !== undefined).length;
  const withSegment = map.filter((r) => r.segmentIds.length > 0).length;
  const withSourceText = map.filter((r) => r.passageIds.length > 0).length;
  const ch3Passages = GITA_COMMENTARY_TEXTS.filter((p) =>
    (p.unitIds || []).some((u) => u.startsWith('3.')),
  );
  const verifiedSource = ch3Passages.filter((p) => p.status === 'verified-source').length;
  const textLayerReviewed = ch3Passages.filter((p) => p.status === 'text-layer-reviewed').length;
  const pageImageCollated = ch3Passages.filter((p) => p.status === 'page-image-collated').length;
  const locatorOnlyUnits = map.filter((r) => r.evidenceStatus === 'locator-only').length;
  const unresolvedPassages = ch3Passages.filter((p) => p.text.includes('[?]')).length;

  const inventoryRows = CHAPTER3_COMMENTARY_INVENTORY;
  const inventoryTranscribed = inventoryRows.filter((r) => r.passageIds.length > 0).length;
  const gaps = inventoryRows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);

  const ch3Concepts = concepts.filter((c) =>
    (c.occurrences || []).some((o) => o.unitId.startsWith('3.')),
  );
  const bySpan = new Map<string, number>();
  for (const p of GITA_COMMENTARY_TEXTS) {
    if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
  }
  let exactTextGrounded = 0;
  let locatorOnlyConcepts = 0;
  for (const c of ch3Concepts) {
    const occs = (c.occurrences || []).filter((o) => o.unitId.startsWith('3.'));
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
      const units = (step.unitIds || []).filter((u) => u.startsWith('3.'));
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
      (e.fromUnitId !== null && e.fromUnitId.startsWith('3.')) ||
      (e.toUnitId !== null && e.toUnitId.startsWith('3.')),
  );
  const quotation = hosted.filter((e) => e.kind === 'commentary-quotes-unit').length;
  const xrefUnresolved = [
    ...CHAPTER3_COMMENTARY_INVENTORY.flatMap((r) => r.unresolved),
    ...CHAPTER3_OPENING_MATTER.flatMap((f) => f.unresolved),
    ...CHAPTER3_CLOSING_MATTER.flatMap((f) => f.unresolved),
  ].filter((u) => u.startsWith('xref:')).length;
  const sourceBackedArgs = CHAPTER3_ARGUMENTS.filter((a) => a.status === 'source').length;
  const unresolvedArgs = CHAPTER3_ARGUMENTS.filter((a) => a.status === 'unresolved').length;
  const apparatus = chapter3ApparatusCounts(CHAPTER3_APPARATUS);
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
      sourceGrounded: ch3Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: hosted.length, quotation, unresolved: xrefUnresolved },
    arguments: { total: CHAPTER3_ARGUMENTS.length, sourceBacked: sourceBackedArgs, unresolved: unresolvedArgs },
    apparatus,
  };
}

/** Human-readable rendering of the Chapter 3 audit (counts only). */
export function formatChapter3Audit(coverage: Chapter3Coverage): string {
  return [
    'Chapter 3 Scholarly Audit',
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
 * Chapter 3 argument edges: each argument points to exact commentary
 * evidence (segment + passage). Roles use the print-supported vocabulary
 * only. Hypotheses without evidence stay out — the list below is exactly
 * the evidenced set, no more. No concept graph is built from these
 * (Phase 12 stops at the evidence-grounded backbone).
 */
export interface Chapter3Argument {
  id: string;
  unitIds: string[];
  ksts: string[];
  role: 'definition' | 'objection' | 'response' | 'distinction' | 'inference' | 'consequence' | 'conclusion' | 'commentary' | 'unresolved';
  claimEn: string;
  segmentId?: string;
  passageId?: string;
  status: 'source' | 'editorial' | 'unresolved';
}

export const CHAPTER3_ARGUMENTS: Chapter3Argument[] = [
  {
    id: 'gita-arg-3-avat-samsaya',
    unitIds: ['3.1'],
    ksts: [],
    role: 'commentary',
    claimEn: 'Hearing knowledge and action praised apart without grasping their conjunction, Arjuna doubts which of the two is the worthier means.',
    segmentId: 'gita-ps-3-avat',
    passageId: 'gita-tx-3-avat',
    status: 'source',
  },
  {
    id: 'gita-arg-3.1-2-ekam',
    unitIds: ['3.1', '3.2'],
    ksts: ['3.1', '3.2'],
    role: 'commentary',
    claimEn: 'Arjuna asks the Lord to ascertain one path — knowledge or action — by which he may attain the good.',
    segmentId: 'gita-seg-3.1-2-joint',
    passageId: 'gita-tx-3.1-2-joint',
    status: 'source',
  },
  {
    id: 'gita-arg-3.3-nistha',
    unitIds: ['3.3'],
    ksts: ['3.3'],
    role: 'conclusion',
    claimEn: 'One twofold steadfastness was taught before: steadiness through knowledge-yoga for the Sankhyas and through action-yoga for the Yogins.',
    segmentId: 'gita-seg-3.3-gloss',
    passageId: 'gita-tx-3.3-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-3.22-ekanusthatr',
    unitIds: ['3.22'],
    ksts: ['3.22'],
    role: 'conclusion',
    claimEn: 'The earlier “self-delighting” teaching concerns solely the single practitioner established in knowledge.',
    segmentId: 'gita-seg-3.22-gloss',
    passageId: 'gita-tx-3.22-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-3.48-kamavadha',
    unitIds: ['3.43'],
    ksts: ['3.48'],
    role: 'consequence',
    claimEn: 'Steadying the self by the self, Arjuna should slay the desire-foe, hard to approach yet slain through its desire-nature.',
    segmentId: 'gita-seg-3.48-gloss',
    passageId: 'gita-tx-3.48-gloss',
    status: 'source',
  },
];

/** KSTS↔repo offset check for one repository unit (tests + gates). */
export function chapter3KstsForRepo(repoUnit: string): string | null {
  const row = CHAPTER3_COMMENTARY_INVENTORY.find((r) => r.repoUnit === repoUnit);
  return row ? row.ksts : null;
}

export { chapter3RepoUnit };
