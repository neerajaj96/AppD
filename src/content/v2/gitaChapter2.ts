import { gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import {
  CHAPTER2_APPARATUS,
  CHAPTER2_CLOSING_MATTER,
  CHAPTER2_COMMENTARY_INVENTORY,
  CHAPTER2_OPENING_MATTER,
  chapter2ApparatusCounts,
  chapter2RepoUnit,
} from './gitaChapter2Inventory';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 2 Rāmakaṇṭha scholarly evidence map (Phase 11).
 *
 * One authoritative row per Chapter 2 repository unit (vulgate 2.1–2.72;
 * KSTS runs 1–74 with extras at 11 and 50). Each row derives from the
 * existing backbone tables — page map, passage spans, commentary texts,
 * scholarly threads, quotation edges — plus concept occurrences supplied
 * by the caller. Nothing is duplicated: folios, segments and passages
 * are referenced, never recopied.
 *
 * Verification honesty: `locator-only` stays locator-only; `mulaStatus`
 * is `locator-only` for every verse (mūla present in print, never
 * transcribed). Transcribed Chapter-2 passages use the explicit
 * `text-layer-reviewed` status. No row claims `page-image-collated` —
 * page images were unavailable.
 */

export const CHAPTER2_UNITS: string[] = Array.from({ length: 72 }, (_, i) => `2.${i + 1}`);

export type Chapter2Verification =
  | 'text-layer-reviewed'
  | 'page-image-collated'
  | 'partially-collated'
  | 'locator-only';

export type Chapter2EvidenceStatus =
  | 'source-text'
  | 'segment-grounded'
  | 'locator-only';

export interface Chapter2EvidenceRow {
  unitId: string;
  ksts: string[];
  pdf?: number;
  folio?: number;
  mappingStatus: string;
  /** Mūla state: always locator-only in Phase 11 (present in print, never transcribed). */
  mulaStatus: 'locator-only';
  commentaryAvailable: boolean;
  segmentIds: string[];
  passageIds: string[];
  verification: Chapter2Verification;
  evidenceStatus: Chapter2EvidenceStatus;
  conceptIds: string[];
  threadStepIds: string[];
  xrefIds: string[];
}

export interface Chapter2ConceptLike {
  id: string;
  occurrences?: Array<{ unitId: string; spanId?: string }>;
}

/** Build the authoritative Chapter 2 evidence map (deterministic). */
export function buildChapter2EvidenceMap(
  concepts: Chapter2ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter2EvidenceRow[] {
  return CHAPTER2_UNITS.map((unitId) => {
    const row = gitaMapForUnit(unitId);
    const ksts = row?.ksts || [];
    const segments = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(unitId));
    const passages = GITA_COMMENTARY_TEXTS.filter((p) => (p.unitIds || []).includes(unitId));
    const segmentIds = segments.map((s) => s.id);
    const passageIds = passages.map((p) => p.id);
    const hasText = passageIds.length > 0;
    const hasSegment = segmentIds.length > 0;
    const evidenceStatus: Chapter2EvidenceStatus = hasText
      ? 'source-text'
      : hasSegment
        ? 'segment-grounded'
        : 'locator-only';
    let verification: Chapter2Verification = 'locator-only';
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
export function chapter2ExtraVerses(): string[] {
  return CHAPTER2_COMMENTARY_INVENTORY.filter((r) => r.repoUnit === null).map((r) => r.ksts);
}

/** Coverage statistics for Chapter 2 (counts only, no scores). */
export interface Chapter2Coverage {
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

export function auditChapter2(
  map: Chapter2EvidenceRow[] = buildChapter2EvidenceMap(),
  concepts: Chapter2ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter2Coverage {
  const withLocator = map.filter((r) => r.folio !== undefined).length;
  const withSegment = map.filter((r) => r.segmentIds.length > 0).length;
  const withSourceText = map.filter((r) => r.passageIds.length > 0).length;
  const ch2Passages = GITA_COMMENTARY_TEXTS.filter((p) =>
    (p.unitIds || []).some((u) => u.startsWith('2.')),
  );
  const verifiedSource = ch2Passages.filter((p) => p.status === 'verified-source').length;
  const textLayerReviewed = ch2Passages.filter((p) => p.status === 'text-layer-reviewed').length;
  const pageImageCollated = ch2Passages.filter((p) => p.status === 'page-image-collated').length;
  const locatorOnlyUnits = map.filter((r) => r.evidenceStatus === 'locator-only').length;
  const unresolvedPassages = ch2Passages.filter((p) => p.text.includes('[?]')).length;

  const inventoryRows = CHAPTER2_COMMENTARY_INVENTORY;
  const inventoryTranscribed = inventoryRows.filter((r) => r.passageIds.length > 0).length;
  const gaps = inventoryRows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);

  const ch2Concepts = concepts.filter((c) =>
    (c.occurrences || []).some((o) => o.unitId.startsWith('2.')),
  );
  const bySpan = new Map<string, number>();
  for (const p of GITA_COMMENTARY_TEXTS) {
    if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
  }
  let exactTextGrounded = 0;
  let locatorOnlyConcepts = 0;
  for (const c of ch2Concepts) {
    const occs = (c.occurrences || []).filter((o) => o.unitId.startsWith('2.'));
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
      const units = (step.unitIds || []).filter((u) => u.startsWith('2.'));
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
      (e.fromUnitId !== null && e.fromUnitId.startsWith('2.')) ||
      (e.toUnitId !== null && e.toUnitId.startsWith('2.')),
  );
  const quotation = hosted.filter((e) => e.kind === 'commentary-quotes-unit').length;
  const xrefUnresolved = [
    ...CHAPTER2_COMMENTARY_INVENTORY.flatMap((r) => r.unresolved),
    ...CHAPTER2_OPENING_MATTER.flatMap((f) => f.unresolved),
    ...CHAPTER2_CLOSING_MATTER.flatMap((f) => f.unresolved),
  ].filter((u) => u.startsWith('xref:')).length;
  const sourceBackedArgs = CHAPTER2_ARGUMENTS.filter((a) => a.status === 'source').length;
  const unresolvedArgs = CHAPTER2_ARGUMENTS.filter((a) => a.status === 'unresolved').length;
  const apparatus = chapter2ApparatusCounts(CHAPTER2_APPARATUS);
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
      sourceGrounded: ch2Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: hosted.length, quotation, unresolved: xrefUnresolved },
    arguments: { total: CHAPTER2_ARGUMENTS.length, sourceBacked: sourceBackedArgs, unresolved: unresolvedArgs },
    apparatus,
  };
}

/** Human-readable rendering of the Chapter 2 audit (counts only). */
export function formatChapter2Audit(coverage: Chapter2Coverage): string {
  return [
    'Chapter 2 Scholarly Audit',
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
 * Chapter 2 argument edges: each argument points to exact commentary
 * evidence (segment + passage). Roles use the print-supported vocabulary
 * only. Hypotheses without evidence stay out — the list below is exactly
 * the evidenced set, no more. No concept graph is built from these
 * (Phase 11 stops at the evidence-grounded backbone).
 */
export interface Chapter2Argument {
  id: string;
  unitIds: string[];
  ksts: string[];
  role: 'definition' | 'objection' | 'response' | 'distinction' | 'inference' | 'consequence' | 'conclusion' | 'commentary' | 'unresolved';
  claimEn: string;
  segmentId?: string;
  passageId?: string;
  status: 'source' | 'editorial' | 'unresolved';
}

export const CHAPTER2_ARGUMENTS: Chapter2Argument[] = [
  {
    id: 'gita-arg-2-avat-prakrama',
    unitIds: ['2.1'],
    ksts: [],
    role: 'commentary',
    claimEn: 'After stating the half-verse/short-verse rule for the history portions, the teaching introduces Sanjaya’s report of the Lord’s instruction to the deluded Arjuna.',
    segmentId: 'gita-ps-2-avat',
    passageId: 'gita-tx-2-avat',
    status: 'source',
  },
  {
    id: 'gita-arg-2.2-sambodhana',
    unitIds: ['2.2'],
    ksts: ['2.2'],
    role: 'commentary',
    claimEn: 'The vocatives recall Arjuna’s excellence and address the self as free of delusion-stain, making the stain’s onset inexplicable.',
    segmentId: 'gita-seg-2.2-gloss',
    passageId: 'gita-tx-2.2-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-2.4-abhipraya',
    unitIds: ['2.4'],
    ksts: ['2.4'],
    role: 'commentary',
    claimEn: 'Arjuna’s “how” question implies that the proposed flight from battle is itself the kaśmala, being against dharma.',
    segmentId: 'gita-seg-2.4-gloss',
    passageId: 'gita-tx-2.4-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-2.7-sisya',
    unitIds: ['2.7'],
    ksts: ['2.7'],
    role: 'commentary',
    claimEn: 'Arjuna, doubting amid the duties, seeks instruction as a pupil and asks to be taught what is certainly good.',
    segmentId: 'gita-seg-2.7-gloss',
    passageId: 'gita-tx-2.7-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-2.9-10-nirvacana',
    unitIds: ['2.9', '2.10'],
    ksts: ['2.9', '2.10'],
    role: 'definition',
    claimEn: 'Hrishikesha is the regulator, lord of the senses; Gudakesha marks Arjuna as unovercomable.',
    segmentId: 'gita-seg-2.9-10-joint',
    passageId: 'gita-tx-2.9-10-joint',
    status: 'source',
  },
  {
    id: 'gita-arg-2.39-samuccaya',
    unitIds: ['2.38'],
    ksts: ['2.39'],
    role: 'conclusion',
    claimEn: 'The teachable content is ascertained as just the knowledge-action conjunction (jñāna-kriyā-samuccaya).',
    segmentId: 'gita-seg-2.39-tail',
    passageId: 'gita-tx-2.39-tail',
    status: 'source',
  },
  {
    id: 'gita-arg-2.74-brahmi',
    unitIds: ['2.72'],
    ksts: ['2.74'],
    role: 'definition',
    claimEn: 'The brāhmī-sthiti is steadiness in the supreme Brahman expounded through “vihāya kāmān” to the end, reached by resting even at the final hour.',
    segmentId: 'gita-seg-2.74-gloss',
    passageId: 'gita-tx-2.74-gloss',
    status: 'source',
  },
  {
    id: 'gita-arg-2-upasamhara-prayojana',
    unitIds: ['2.72'],
    ksts: [],
    role: 'conclusion',
    claimEn: 'Chapter 2 closes the teaching whose life is the supreme-secret instruction, set forth through seventeen-chapter matter, for the seeker intent on release.',
    segmentId: 'gita-ps-2-upasamhara',
    passageId: 'gita-tx-2-upasamhara',
    status: 'source',
  },
];

/** KSTS↔repo offset check for one repository unit (tests + gates). */
export function chapter2KstsForRepo(repoUnit: string): string | null {
  const row = CHAPTER2_COMMENTARY_INVENTORY.find((r) => r.repoUnit === repoUnit);
  return row ? row.ksts : null;
}

export { chapter2RepoUnit };
