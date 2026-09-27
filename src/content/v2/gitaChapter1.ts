import { GITA_UNIT_MAP, gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import { CHAPTER1_APPARATUS, CHAPTER1_CLOSING_MATTER, CHAPTER1_COMMENTARY_INVENTORY, CHAPTER1_OPENING_MATTER, chapter1ApparatusCounts } from './gitaChapter1Inventory';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 1 Rāmakaṇṭha scholarly evidence map (Phase 10).
 *
 * One authoritative row per Chapter 1 unit (vulgate 1.1–1.47, aligned
 * with KSTS). Each row derives from the existing backbone tables — page
 * map, passage spans, commentary texts, scholarly threads, quotation
 * edges — plus concept occurrences supplied by the caller. Nothing is
 * duplicated: folios, segments and passages are referenced, never recopied.
 *
 * Verification honesty: `locator-only` stays locator-only; `mulaStatus`
 * is `locator-only` for every verse (mūla present in print, never
 * transcribed — root-text import stays a separate phase). All eleven
 * Chapter-1 passages use the explicit `text-layer-reviewed` status. No
 * row claims `page-image-collated` — page images were unavailable.
 */

export const CHAPTER1_UNITS: string[] = Array.from({ length: 47 }, (_, i) => `1.${i + 1}`);

export type Chapter1Verification =
  | 'text-layer-reviewed'
  | 'page-image-collated'
  | 'partially-collated'
  | 'locator-only';

export type Chapter1EvidenceStatus =
  | 'source-text'
  | 'segment-grounded'
  | 'locator-only';

export interface Chapter1EvidenceRow {
  unitId: string;
  ksts: string[];
  pdf?: number;
  folio?: number;
  mappingStatus: string;
  /** Mūla state: always locator-only in Phase 10 (present in print, never transcribed). */
  mulaStatus: 'locator-only';
  commentaryAvailable: boolean;
  segmentIds: string[];
  passageIds: string[];
  verification: Chapter1Verification;
  evidenceStatus: Chapter1EvidenceStatus;
  conceptIds: string[];
  threadStepIds: string[];
  xrefIds: string[];
}

export interface Chapter1ConceptLike {
  id: string;
  occurrences?: Array<{ unitId: string; spanId?: string }>;
}

/**
 * Phase-2 null-host quotation edges whose quotations sit in the
 * Chapter-1 upodghāta (printed pp.3–10; verified in Phase 10 against the
 * text layer). Hosts stay indeterminate by design — upodghāta matter
 * precedes every verse marker — so these edges are counted as legacy
 * upodghāta evidence, never attached to a verse row.
 */
export const LEGACY_UPODGHATA_EDGE_IDS: string[] = [
  'gita-xref-001',
  'gita-xref-002',
  'gita-xref-003',
  'gita-xref-004',
  'gita-xref-005',
  'gita-xref-006',
  'gita-xref-007',
  'gita-xref-008',
  'gita-xref-009',
  'gita-xref-010',
  'gita-xref-011',
  'gita-xref-012',
  'gita-xref-013',
  'gita-xref-014',
  'gita-xref-015',
];

/** Null-host edges first transcribed with Chapter-1 hosts in Phase 10. */
export function chapter1UpodghataEdges(): string[] {
  return GITA_QUOTATION_EDGES.filter(
    (e) => e.fromUnitId === null && (e.note || '').includes('Chapter-1 upodghāta'),
  ).map((e) => e.id);
}

/** Build the authoritative Chapter 1 evidence map (deterministic). */
export function buildChapter1EvidenceMap(
  concepts: Chapter1ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter1EvidenceRow[] {
  return CHAPTER1_UNITS.map((unitId) => {
    const row = gitaMapForUnit(unitId);
    const ksts = row?.ksts || [];
    const segments = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(unitId));
    const passages = GITA_COMMENTARY_TEXTS.filter((p) => (p.unitIds || []).includes(unitId));
    const segmentIds = segments.map((s) => s.id);
    const passageIds = passages.map((p) => p.id);
    const hasText = passageIds.length > 0;
    const hasSegment = segmentIds.length > 0;
    const evidenceStatus: Chapter1EvidenceStatus = hasText
      ? 'source-text'
      : hasSegment
        ? 'segment-grounded'
        : 'locator-only';
    let verification: Chapter1Verification = 'locator-only';
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

/** Coverage statistics for Chapter 1 (counts only, no scores). */
export interface Chapter1Coverage {
  units: { total: number; withLocator: number; withSegment: number; withSourceText: number };
  mula: { verses: number; transcribed: number; locatorOnly: number };
  commentary: {
    verifiedSource: number;
    textLayerReviewed: number;
    pageImageCollated: number;
    locatorOnlyUnits: number;
    unresolvedPassages: number;
  };
  inventory: { verses: number; transcribed: number; untranscribed: number };
  /** Repository units without transcribed source text (continuous gaps). */
  gaps: string[];
  concepts: { sourceGrounded: number; exactTextGrounded: number; locatorOnly: number };
  threads: {
    steps: number;
    sourceTextGrounded: number;
    segmentGrounded: number;
    locatorOnly: number;
  };
  xrefs: { explicit: number; quotation: number; legacyUpodghata: number; unresolved: number };
  arguments: { total: number; sourceBacked: number; unresolved: number };
  apparatus: { observed: number; mapped: number; unresolved: number };
}

export function auditChapter1(
  map: Chapter1EvidenceRow[] = buildChapter1EvidenceMap(),
  concepts: Chapter1ConceptLike[] = [],
  threads: V2Thread[] = GITA_SCHOLARLY_THREADS,
): Chapter1Coverage {
  const withLocator = map.filter((r) => r.folio !== undefined).length;
  const withSegment = map.filter((r) => r.segmentIds.length > 0).length;
  const withSourceText = map.filter((r) => r.passageIds.length > 0).length;
  const ch1Passages = GITA_COMMENTARY_TEXTS.filter((p) =>
    (p.unitIds || []).some((u) => u.startsWith('1.')),
  );
  const verifiedSource = ch1Passages.filter((p) => p.status === 'verified-source').length;
  const textLayerReviewed = ch1Passages.filter((p) => p.status === 'text-layer-reviewed').length;
  const pageImageCollated = ch1Passages.filter((p) => p.status === 'page-image-collated').length;
  const locatorOnlyUnits = map.filter((r) => r.evidenceStatus === 'locator-only').length;
  const unresolvedPassages = ch1Passages.filter((p) => p.text.includes('[?]')).length;

  const inventoryVerses = CHAPTER1_COMMENTARY_INVENTORY.length;
  const inventoryTranscribed = CHAPTER1_COMMENTARY_INVENTORY.filter(
    (r) => r.passageIds.length > 0,
  ).length;
  const gaps = CHAPTER1_COMMENTARY_INVENTORY.filter((r) => r.passageIds.length === 0).map(
    (r) => r.repoUnit,
  );
  for (const row of map) {
    if (row.passageIds.length === 0 && !gaps.includes(row.unitId)) gaps.push(row.unitId);
  }
  gaps.sort();

  const ch1Concepts = concepts.filter((c) =>
    (c.occurrences || []).some((o) => o.unitId.startsWith('1.')),
  );
  const bySpan = new Map<string, number>();
  for (const p of GITA_COMMENTARY_TEXTS) {
    if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
  }
  let exactTextGrounded = 0;
  let locatorOnlyConcepts = 0;
  for (const c of ch1Concepts) {
    const occs = (c.occurrences || []).filter((o) => o.unitId.startsWith('1.'));
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
      const units = (step.unitIds || []).filter((u) => u.startsWith('1.'));
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
      (e.fromUnitId !== null && e.fromUnitId.startsWith('1.')) ||
      (e.toUnitId !== null && e.toUnitId.startsWith('1.')),
  );
  const upodghata = chapter1UpodghataEdges();
  const quotation = [...hosted, ...GITA_QUOTATION_EDGES.filter((e) => upodghata.includes(e.id))].filter(
    (e) => e.kind === 'commentary-quotes-unit',
  ).length;
  const xrefUnresolved = [
    ...CHAPTER1_COMMENTARY_INVENTORY.flatMap((r) => r.unresolved),
    ...CHAPTER1_OPENING_MATTER.flatMap((f) => f.unresolved),
    ...CHAPTER1_CLOSING_MATTER.flatMap((f) => f.unresolved),
  ].filter((u) => u.startsWith('xref:')).length;
  const sourceBackedArgs = CHAPTER1_ARGUMENTS.filter((a) => a.status === 'source').length;
  const unresolvedArgs = CHAPTER1_ARGUMENTS.filter((a) => a.status === 'unresolved').length;
  const apparatus = chapter1ApparatusCounts(CHAPTER1_APPARATUS);
  return {
    units: { total: map.length, withLocator, withSegment, withSourceText },
    mula: { verses: map.length, transcribed: 0, locatorOnly: map.length },
    commentary: { verifiedSource, textLayerReviewed, pageImageCollated, locatorOnlyUnits, unresolvedPassages },
    inventory: {
      verses: inventoryVerses,
      transcribed: inventoryTranscribed,
      untranscribed: inventoryVerses - inventoryTranscribed,
    },
    gaps,
    concepts: {
      sourceGrounded: ch1Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: hosted.length + upodghata.length, quotation, legacyUpodghata: LEGACY_UPODGHATA_EDGE_IDS.length, unresolved: xrefUnresolved },
    arguments: { total: CHAPTER1_ARGUMENTS.length, sourceBacked: sourceBackedArgs, unresolved: unresolvedArgs },
    apparatus,
  };
}

/** Human-readable rendering of the Chapter 1 audit (counts only). */
export function formatChapter1Audit(coverage: Chapter1Coverage): string {
  return [
    'Chapter 1 Scholarly Audit',
    'Units:',
    `  total: ${coverage.units.total}`,
    `  with source locator: ${coverage.units.withLocator}`,
    `  with commentary segment: ${coverage.units.withSegment}`,
    `  with source text: ${coverage.units.withSourceText}`,
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
    `  coverage gaps: ${coverage.gaps.length === 0 ? 'none' : coverage.gaps.join(', ')}`,
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
    `  legacy upodghata: ${coverage.xrefs.legacyUpodghata}`,
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
 * Chapter 1 argument edges: each argument points to exact commentary
 * evidence (segment + passage). Roles use the print-supported vocabulary
 * only; group purports without a marked rhetorical move use `commentary`
 * (generic). Hypotheses without evidence stay out — the list below is
 * exactly the evidenced set, no more. No concept graph is built from
 * these (Phase 10 stops at the evidence-grounded backbone).
 */
export interface Chapter1Argument {
  id: string;
  unitIds: string[];
  ksts: string[];
  role: 'definition' | 'objection' | 'response' | 'distinction' | 'inference' | 'consequence' | 'conclusion' | 'commentary' | 'unresolved';
  claimEn: string;
  segmentId?: string;
  passageId?: string;
  status: 'source' | 'editorial' | 'unresolved';
}

const range = (from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `1.${from + i}`);

export const CHAPTER1_ARGUMENTS: Chapter1Argument[] = [
  {
    id: 'gita-arg-1-upakrama-karma',
    unitIds: ['1.1'],
    ksts: [],
    role: 'commentary',
    claimEn: 'Shastra-enjoined acts, sterilised of binding force by the knowledge to be taught and performed as able and as prescribed, are the means to release; total abandonment of acts is untenable.',
    segmentId: 'gita-ps-1-upakrama',
    passageId: 'gita-tx-1-upakrama',
    status: 'source',
  },
  {
    id: 'gita-arg-1.1-prasna',
    unitIds: ['1.1'],
    ksts: ['1.1'],
    role: 'commentary',
    claimEn: 'Verse 1.1 is Dhritarashtra’s question prompting Sanjaya’s battlefield report.',
    segmentId: 'gita-seg-1.1-prasna',
    passageId: 'gita-tx-1.1-prasna',
    status: 'source',
  },
  {
    id: 'gita-arg-1.2-19-ghoratva',
    unitIds: range(2, 19),
    ksts: range(2, 19),
    role: 'conclusion',
    claimEn: 'The muster and conch passages signify the fierceness (ghoratva) of the impending kindred battle on both mustered hosts.',
    segmentId: 'gita-seg-1.2-19-sainya',
    passageId: 'gita-tx-1.2-19-sainya',
    status: 'source',
  },
  {
    id: 'gita-arg-1.20-23-nirupana',
    unitIds: range(20, 23),
    ksts: range(20, 23),
    role: 'commentary',
    claimEn: 'Arjuna’s army-survey speeches need no gloss (subodha).',
    segmentId: 'gita-seg-1.20-23-nirupana',
    passageId: 'gita-tx-1.20-23-nirupana',
    status: 'source',
  },
  {
    id: 'gita-arg-1.24-25-sphuta',
    unitIds: range(24, 25),
    ksts: range(24, 25),
    role: 'commentary',
    claimEn: 'Hrishikesha’s positioning replies, as reported by Sanjaya, are self-evident (sphutartha).',
    segmentId: 'gita-seg-1.24-25-sphuta',
    passageId: 'gita-tx-1.24-25-sphuta',
    status: 'source',
  },
  {
    id: 'gita-arg-1.26-28-darsana',
    unitIds: range(26, 28),
    ksts: range(26, 28),
    role: 'commentary',
    claimEn: 'The kinsmen-sight report ending in despondent speech is evident in meaning (vyaktartha).',
    segmentId: 'gita-seg-1.26-28-darsana',
    passageId: 'gita-tx-1.26-28-darsana',
    status: 'source',
  },
  {
    id: 'gita-arg-1.29-46-mithyajnana',
    unitIds: range(29, 46),
    ksts: range(29, 46),
    role: 'conclusion',
    claimEn: 'Arjuna’s speeches state the easily-arising false knowledge (mithyajnana) of a compassion-overwhelmed man who calls adharma dharma.',
    segmentId: 'gita-seg-1.29-46-mithyajnana',
    passageId: 'gita-tx-1.29-46-mithyajnana',
    status: 'source',
  },
  {
    id: 'gita-arg-1.47-tatparya-ruling',
    unitIds: ['1.47'],
    ksts: ['1.47'],
    role: 'conclusion',
    claimEn: 'Chapter 1 stands expounded by purport (tatparyatah), not word by word, for fear of prolixity.',
    segmentId: 'gita-seg-1.47-gatartha',
    passageId: 'gita-tx-1.47-gatartha',
    status: 'source',
  },
  {
    id: 'gita-arg-1-upasamhara-prayojana',
    unitIds: ['1.47'],
    ksts: [],
    role: 'conclusion',
    claimEn: 'Chapter 1’s office is presenting Arjuna’s despondency as the ground on which the Lord’s teaching activity proceeds.',
    segmentId: 'gita-ps-1-upasamhara',
    passageId: 'gita-tx-1-upasamhara',
    status: 'source',
  },
];

/** Chapter-1-only view of the unit map (for the evidence-map table). */
export function chapter1UnitMap(): Record<string, (typeof GITA_UNIT_MAP)[string]> {
  const out: Record<string, (typeof GITA_UNIT_MAP)[string]> = {};
  for (const unitId of CHAPTER1_UNITS) {
    const row = GITA_UNIT_MAP[unitId];
    if (row) out[unitId] = row;
  }
  return out;
}
