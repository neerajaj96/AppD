import { GITA_UNIT_MAP, gitaMapForUnit } from './gitaPageMap';
import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from './gitaThreads';
import { GITA_QUOTATION_EDGES } from './gitaXrefs';
import { CHAPTER13_APPARATUS, CHAPTER13_COMMENTARY_INVENTORY, apparatusCounts } from './gitaChapter13Inventory';
import type { V2Thread } from './schema';

/**
 * Bhagavad Gītā Chapter 13 Rāmakaṇṭha scholarly evidence map (Phase 7;
 * Phase 8 completes the commentary corpus chapter-wide).
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
  xrefs: { explicit: number; quotation: number; editorial: number; unresolved: number };
  arguments: { total: number; sourceBacked: number; unresolved: number };
  apparatus: { observed: number; mapped: number; unresolved: number };
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
  const unresolvedPassages = ch13Passages.filter((p) => p.text.includes('[?]')).length;

  const inventoryVerses = CHAPTER13_COMMENTARY_INVENTORY.length;
  const inventoryTranscribed = CHAPTER13_COMMENTARY_INVENTORY.filter(
    (r) => r.passageIds.length > 0,
  ).length;
  const gaps = CHAPTER13_COMMENTARY_INVENTORY.filter((r) => r.passageIds.length === 0).map(
    (r) => r.repoUnit,
  );
  // Units without source text beyond the inventory (e.g. vulgate-only 13.1).
  for (const row of map) {
    if (row.passageIds.length === 0 && !gaps.includes(row.unitId)) gaps.push(row.unitId);
  }
  gaps.sort();

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
  // Unresolved cross-references are the inventory `xref:`-tagged items:
  // printed quotations/locators retained as source evidence without an edge.
  const xrefUnresolved = CHAPTER13_COMMENTARY_INVENTORY.flatMap((r) => r.unresolved).filter(
    (u) => u.startsWith('xref:'),
  ).length;
  const sourceBackedArgs = CHAPTER13_ARGUMENTS.filter((a) => a.status === 'source').length;
  const unresolvedArgs = CHAPTER13_ARGUMENTS.filter((a) => a.status === 'unresolved').length;
  const apparatus = apparatusCounts(CHAPTER13_APPARATUS);
  return {
    units: { total: map.length, withLocator, withSegment, withSourceText },
    commentary: { verifiedSource, textLayerReviewed, pageImageCollated, locatorOnlyUnits, unresolvedPassages },
    inventory: {
      verses: inventoryVerses,
      transcribed: inventoryTranscribed,
      untranscribed: inventoryVerses - inventoryTranscribed,
    },
    gaps,
    concepts: {
      sourceGrounded: ch13Concepts.length,
      exactTextGrounded,
      locatorOnly: locatorOnlyConcepts,
    },
    threads: { steps, sourceTextGrounded, segmentGrounded, locatorOnly: locatorOnlySteps },
    xrefs: { explicit: ch13Xrefs.length, quotation, editorial: 0, unresolved: xrefUnresolved },
    arguments: { total: CHAPTER13_ARGUMENTS.length, sourceBacked: sourceBackedArgs, unresolved: unresolvedArgs },
    apparatus,
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
    `  editorial: ${coverage.xrefs.editorial}`,
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
 * Chapter 13 argument edges (Phase 7; Phase 8 adds one sourced argument
 * per newly transcribed rhetorical move): each argument points to exact
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
  // Phase-8 Chapter-13 arguments: each new rhetorical move grounded in
  // an exact Phase-8 segment and passage (print-supported roles only).
  {
    id: 'gita-arg-13.2-etat-def',
    unitIds: ['13.2'],
    ksts: ['13.1'],
    role: 'definition',
    claimEn: 'The known-by-exhibits body and the exhibitor-knower exhaust the field/knower exhibits (aham/mama).',
    segmentId: 'gita-seg-13.1-etat',
    passageId: 'gita-tx-13.1-etat',
    status: 'source',
  },
  {
    id: 'gita-arg-13.2-tatparya-concl',
    unitIds: ['13.2'],
    ksts: ['13.1'],
    role: 'conclusion',
    claimEn: 'Abiding in just this much causes body-self discrimination; the teaching addresses the graced alone.',
    segmentId: 'gita-seg-13.1-tatparya',
    passageId: 'gita-tx-13.1-tatparya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.3-sarvaksetra-conseq',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    role: 'consequence',
    claimEn: 'As one knower of many limbs in one field, so one supreme knower of all bodies; this is the jñāna.',
    segmentId: 'gita-seg-13.2-sarvaksetra',
    passageId: 'gita-tx-13.2-sarvaksetra',
    status: 'source',
  },
  {
    id: 'gita-arg-13.4-sankhya-intro',
    unitIds: ['13.4'],
    ksts: ['13.3'],
    role: 'commentary',
    claimEn: 'The field exposition follows the honoured sāṅkhya procedure, by the knowability mark alone.',
    segmentId: 'gita-seg-13.3-intro',
    passageId: 'gita-tx-13.3-intro',
    status: 'source',
  },
  {
    id: 'gita-arg-13.4-tat-def',
    unitIds: ['13.4'],
    ksts: ['13.3'],
    role: 'definition',
    claimEn: 'The field is what is named, of such kind, with its modification, modification-source, knower and knower-nature.',
    segmentId: 'gita-seg-13.3-tat',
    passageId: 'gita-tx-13.3-tat',
    status: 'source',
  },
  {
    id: 'gita-arg-13.5-smrti-comm',
    unitIds: ['13.5'],
    ksts: ['13.4'],
    role: 'commentary',
    claimEn: 'Seers, metres and reasoned Brahma-sūtra passages jointly ascertain the field teaching.',
    segmentId: 'gita-seg-13.4-rsibhi',
    passageId: 'gita-tx-13.4-rsibhi',
    status: 'source',
  },
  {
    id: 'gita-arg-13.6-tattva-def',
    unitIds: ['13.6'],
    ksts: ['13.5'],
    role: 'definition',
    claimEn: 'Four causal principles (mātras, ahaṅkāra, buddhi, avyakta) carry the vikāri exposition.',
    segmentId: 'gita-seg-13.5-tattva',
    passageId: 'gita-tx-13.5-tattva',
    status: 'source',
  },
  {
    id: 'gita-arg-13.6-karana-infer',
    unitIds: ['13.6'],
    ksts: ['13.5'],
    role: 'inference',
    claimEn: 'Threefold ahaṅkāra causes mind, senses and mātras; the yad-vikāri exposition is thereby settled.',
    segmentId: 'gita-seg-13.5-karana',
    passageId: 'gita-tx-13.5-karana',
    status: 'source',
  },
  {
    id: 'gita-arg-13.6-karya-def',
    unitIds: ['13.6'],
    ksts: ['13.5'],
    role: 'definition',
    claimEn: 'Senses, mind and sense-fields form the sixteenfold mere-effect class: twenty-four principles as body.',
    segmentId: 'gita-seg-13.5-karya',
    passageId: 'gita-tx-13.5-karya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.7-darsanantara-dist',
    unitIds: ['13.7'],
    ksts: ['13.6'],
    role: 'distinction',
    claimEn: 'Whatever other schools enumerate falls to the field by never exceeding knowability.',
    segmentId: 'gita-seg-13.6-darsanantara',
    passageId: 'gita-tx-13.6-darsanantara',
    status: 'source',
  },
  {
    id: 'gita-arg-13.7-siddhanta-concl',
    unitIds: ['13.7'],
    ksts: ['13.6'],
    role: 'conclusion',
    claimEn: 'The field-definition stands settled for the graced hearer; out-of-season cleverness is not the method.',
    segmentId: 'gita-seg-13.6-siddhanta',
    passageId: 'gita-tx-13.6-siddhanta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.8-mana-def',
    unitIds: ['13.8'],
    ksts: ['13.7'],
    role: 'definition',
    claimEn: 'Conceit defined and removed as amānitva; the virtue aggregate manifests knowledge.',
    segmentId: 'gita-seg-13.7-mana',
    passageId: 'gita-tx-13.7-mana',
    status: 'source',
  },
  {
    id: 'gita-arg-13.8-himsa-resp',
    unitIds: ['13.8'],
    ksts: ['13.7'],
    role: 'response',
    claimEn: 'Enjoined violence abiding as duty is not violence; forbearance likewise stands as knowledge.',
    segmentId: 'gita-seg-13.7-adambha',
    passageId: 'gita-tx-13.7-adambha',
    status: 'source',
  },
  {
    id: 'gita-arg-13.8-arjava-conseq',
    unitIds: ['13.8'],
    ksts: ['13.7'],
    role: 'consequence',
    claimEn: 'Uprightness is knowledge; five graced virtues root the knowledge-tree against the unfit.',
    segmentId: 'gita-seg-13.7-arjava',
    passageId: 'gita-tx-13.7-arjava',
    status: 'source',
  },
  {
    id: 'gita-arg-13.8-acarya-conseq',
    unitIds: ['13.8'],
    ksts: ['13.7'],
    role: 'consequence',
    claimEn: 'Teacher-service grows the knowledge-tree trunk, with branch, leaf and flower virtues after it.',
    segmentId: 'gita-seg-13.7-acarya',
    passageId: 'gita-tx-13.7-acarya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.9-sthairya-def',
    unitIds: ['13.9'],
    ksts: ['13.8'],
    role: 'definition',
    claimEn: 'Steadiness, restraint, dispassion, egolessness and birth-suffering insight form the virtue chain.',
    segmentId: 'gita-seg-13.8-sthairya',
    passageId: 'gita-tx-13.8-sthairya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.11-bhakti-conseq',
    unitIds: ['13.11'],
    ksts: ['13.10'],
    role: 'consequence',
    claimEn: 'The virtue aggregate fruits as unwavering devotion through exclusive union: the fourth knower-state.',
    segmentId: 'gita-seg-13.9-asakti',
    passageId: 'gita-tx-13.9-asakti',
    status: 'source',
  },
  {
    id: 'gita-arg-13.12-vivikta-concl',
    unitIds: ['13.12'],
    ksts: ['13.11'],
    role: 'conclusion',
    claimEn: 'From resort to the vision of the knowledge-object, the aggregate is knowledge and its contrary ajñāna.',
    segmentId: 'gita-seg-13.10-vivikta',
    passageId: 'gita-tx-13.10-vivikta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-pratijna-comm',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'commentary',
    claimEn: 'The knowable, culminating in the supreme object, will now be taught in full as the fruit of knowledge.',
    segmentId: 'gita-seg-13.12-pratijna',
    passageId: 'gita-tx-13.12-pratijna',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-pratyavamarsa-infer',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'inference',
    claimEn: 'Self-recognition alone is knowledge of it; apart from the self no separate experiencing holds.',
    segmentId: 'gita-seg-13.12-pratyavamarsa',
    passageId: 'gita-tx-13.12-pratyavamarsa',
    status: 'source',
  },
  {
    id: 'gita-arg-13.13-samjna-dist',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    role: 'distinction',
    claimEn: 'Against the caused, beginning-ended known, supreme Brahman is beginningless being by self-designation.',
    segmentId: 'gita-seg-13.12-samjna',
    passageId: 'gita-tx-13.12-samjna',
    status: 'source',
  },
  {
    id: 'gita-arg-13.14-nasat-dist',
    unitIds: ['13.13', '13.14'],
    ksts: ['13.12', '13.13'],
    role: 'distinction',
    claimEn: 'Brahman is no sense-object yet no non-being, since it causes all seeming-being; hence the all-limbed form.',
    segmentId: 'gita-seg-13.12-nasat',
    passageId: 'gita-tx-13.12-nasat',
    status: 'source',
  },
  {
    id: 'gita-arg-13.14-sarvendriya-dist',
    unitIds: ['13.14'],
    ksts: ['13.13'],
    role: 'distinction',
    claimEn: 'It illumines all sense-functions yet is free of all senses, unmixed with the witnessed order.',
    segmentId: 'gita-seg-13.13-sarvendriya',
    passageId: 'gita-tx-13.13-sarvendriya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.15-asakta-dist',
    unitIds: ['13.15'],
    ksts: ['13.14'],
    role: 'distinction',
    claimEn: 'Unattached yet all-supporting, beyond the guṇas yet their enjoyer by witnessing, not by mixture.',
    segmentId: 'gita-seg-13.14-asakta',
    passageId: 'gita-tx-13.14-asakta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.16-bahiranta-concl',
    unitIds: ['13.15', '13.16'],
    ksts: ['13.14', '13.15'],
    role: 'conclusion',
    claimEn: 'Outside as known, inside as knower, yet one common consciousness; far by unknowability, near as all cognition’s ground.',
    segmentId: 'gita-seg-13.15-bahiranta',
    passageId: 'gita-tx-13.15-bahiranta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.16-avibhakta-concl',
    unitIds: ['13.16'],
    ksts: ['13.15'],
    role: 'conclusion',
    claimEn: 'Far without knowability yet near without which no cognition; undivided in divided beings, yet appearing divided.',
    segmentId: 'gita-seg-13.15-avibhakta',
    passageId: 'gita-tx-13.15-avibhakta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.17-bhutabhartr-def',
    unitIds: ['13.17'],
    ksts: ['13.16'],
    role: 'definition',
    claimEn: 'Sustainer, dissolver and producer of beings, light of lights beyond darkness, known through knowledge alone.',
    segmentId: 'gita-seg-13.16-bhutabhartr',
    passageId: 'gita-tx-13.16-bhutabhartr',
    status: 'source',
  },
  {
    id: 'gita-arg-13.18-jnanagamya-concl',
    unitIds: ['13.18'],
    ksts: ['13.17'],
    role: 'conclusion',
    claimEn: 'To be recognised as self through the stated means, reached by knowledge alone, present in every heart.',
    segmentId: 'gita-seg-13.17-jnanagamya',
    passageId: 'gita-tx-13.17-jnanagamya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.19-upasamhara-concl',
    unitIds: ['13.19'],
    ksts: ['13.18'],
    role: 'conclusion',
    claimEn: 'Field, knowledge and knowable summarised; the devotee knowing this triad attains being-toward-Me.',
    segmentId: 'gita-seg-13.18-upasamhara',
    passageId: 'gita-tx-13.18-upasamhara',
    status: 'source',
  },
  {
    id: 'gita-arg-13.20-anaditva-dist',
    unitIds: ['13.20'],
    ksts: ['13.19'],
    role: 'distinction',
    claimEn: 'Beginninglessness belongs to the mutual relation, not to equal eternity: flowing permanence for nature, steadfast for spirit.',
    segmentId: 'gita-seg-13.19-anaditva',
    passageId: 'gita-tx-13.19-anaditva',
    status: 'source',
  },
  {
    id: 'gita-arg-13.21-prakrtihetu-def',
    unitIds: ['13.21'],
    ksts: ['13.20'],
    role: 'definition',
    claimEn: 'Nature as the unmanifest grounds doership lodged in ego-notion; spirit grounds the enjoyer-conceit for the enjoyable.',
    segmentId: 'gita-seg-13.20-prakrtihetu',
    passageId: 'gita-tx-13.20-prakrtihetu',
    status: 'source',
  },
  {
    id: 'gita-arg-13.22-bhunkte-def',
    unitIds: ['13.22'],
    ksts: ['13.21'],
    role: 'definition',
    claimEn: 'Abiding in nature, spirit subjectifies the pleasure-formed guṇas through knowership.',
    segmentId: 'gita-seg-13.21-gunasanga-a',
    passageId: 'gita-tx-13.21-gunasanga-a',
    status: 'source',
  },
  {
    id: 'gita-arg-13.22-gunasanga-infer',
    unitIds: ['13.22'],
    ksts: ['13.21'],
    role: 'inference',
    claimEn: 'Ego-seized contact with the guṇas causes high and low births; bondage is non-discrimination alone.',
    segmentId: 'gita-seg-13.21-gunasanga-b',
    passageId: 'gita-tx-13.21-gunasanga-b',
    status: 'source',
  },
  {
    id: 'gita-arg-13.23-upadrastra-def',
    unitIds: ['13.23'],
    ksts: ['13.22'],
    role: 'definition',
    claimEn: 'As seer of the presented, bearer by ego-grasp, and after-knower of the known, the same is stated threefold.',
    segmentId: 'gita-seg-13.22-upadrastra',
    passageId: 'gita-tx-13.22-upadrastra',
    status: 'source',
  },
  {
    id: 'gita-arg-13.23-viveka-conseq',
    unitIds: ['13.23'],
    ksts: ['13.22'],
    role: 'consequence',
    claimEn: 'Witness, bearer, permitter and enjoyer by self-māyā reference; on discrimination the same is supreme Self.',
    segmentId: 'gita-seg-13.22-viveka',
    passageId: 'gita-tx-13.22-viveka',
    status: 'source',
  },
  {
    id: 'gita-arg-13.24-yogi-conseq',
    unitIds: ['13.24'],
    ksts: ['13.23'],
    role: 'consequence',
    claimEn: 'Knowing spirit with the guṇas, the yogin in every station is not reborn: karma-seeds burnt by knowledge-fire.',
    segmentId: 'gita-seg-13.23-yogi',
    passageId: 'gita-tx-13.23-yogi',
    status: 'source',
  },
  {
    id: 'gita-arg-13.25-dhyana-dist',
    unitIds: ['13.25'],
    ksts: ['13.24'],
    role: 'distinction',
    claimEn: 'The ripe see by meditation as non-different everywhere: the higher means, agent, object and locus all Brahman.',
    segmentId: 'gita-seg-13.24-dhyana',
    passageId: 'gita-tx-13.24-dhyana',
    status: 'source',
  },
  {
    id: 'gita-arg-13.25-upaya-dist',
    unitIds: ['13.25'],
    ksts: ['13.24'],
    role: 'distinction',
    claimEn: 'Analysis, Patañjali discipline and act-anchored settling form the lower twofold means beneath meditation.',
    segmentId: 'gita-seg-13.24-sankhya',
    passageId: 'gita-tx-13.24-sankhya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.26-samuccaya-dist',
    unitIds: ['13.26'],
    ksts: ['13.25'],
    role: 'distinction',
    claimEn: 'Act-anchored settling, though conjunction-formed, is the ascending stage where action predominates.',
    segmentId: 'gita-seg-13.25-samuccaya',
    passageId: 'gita-tx-13.25-samuccaya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.26-sruta-conseq',
    unitIds: ['13.26'],
    ksts: ['13.25'],
    role: 'consequence',
    claimEn: 'Even hearers-from-others who resort cross death, the true-disposed reaching the imperishable in order.',
    segmentId: 'gita-seg-13.25-sruta',
    passageId: 'gita-tx-13.25-sruta',
    status: 'source',
  },
  {
    id: 'gita-arg-13.27-samyoga-infer',
    unitIds: ['13.27'],
    ksts: ['13.26'],
    role: 'inference',
    claimEn: 'Every stationary-moving birth comes from the beginningless field-knower conjunction through non-discrimination.',
    segmentId: 'gita-seg-13.26-samyoga',
    passageId: 'gita-tx-13.26-samyoga',
    status: 'source',
  },
  {
    id: 'gita-arg-13.28-sama-def',
    unitIds: ['13.28'],
    ksts: ['13.27'],
    role: 'definition',
    claimEn: 'Seeing the changeless Lord abiding the same in perishing beings is truly seeing.',
    segmentId: 'gita-seg-13.27-sama',
    passageId: 'gita-tx-13.27-sama',
    status: 'source',
  },
  {
    id: 'gita-arg-13.28-caksus-conseq',
    unitIds: ['13.28'],
    ksts: ['13.27'],
    role: 'consequence',
    claimEn: 'With the kindled knowledge-eye the yogin sights the lone knower-essence apart from all witnessed portions.',
    segmentId: 'gita-seg-13.27-samapasya',
    passageId: 'gita-tx-13.27-samapasya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.29-atmahimsa-conseq',
    unitIds: ['13.29'],
    ksts: ['13.28'],
    role: 'consequence',
    claimEn: 'Seeing the evenly-abiding Lord, one does not kill the self by non-recognition: the thief’s fate otherwise.',
    segmentId: 'gita-seg-13.28-atmahimsa',
    passageId: 'gita-tx-13.28-atmahimsa',
    status: 'source',
  },
  {
    id: 'gita-arg-13.30-prakrti-def',
    unitIds: ['13.30'],
    ksts: ['13.29'],
    role: 'definition',
    claimEn: 'Twofold nature, conjoined beginninglessly as field and knower, figures the whole world-picture.',
    segmentId: 'gita-seg-13.29-prakrtya',
    passageId: 'gita-tx-13.29-prakrtya',
    status: 'source',
  },
  {
    id: 'gita-arg-13.30-akartra-dist',
    unitIds: ['13.30'],
    ksts: ['13.29'],
    role: 'distinction',
    claimEn: 'Nature alone performs all acts as the twofold field-knower figure; spirit as non-doer is truly seen.',
    segmentId: 'gita-seg-13.29-akartra',
    passageId: 'gita-tx-13.29-akartra',
    status: 'source',
  },
  {
    id: 'gita-arg-13.31-ekatva-concl',
    unitIds: ['13.31'],
    ksts: ['13.30'],
    role: 'conclusion',
    claimEn: 'When apartness-beings are sighted stationed in the one Self, the yogin attains Brahman.',
    segmentId: 'gita-seg-13.30-ekatva',
    passageId: 'gita-tx-13.30-ekatva',
    status: 'source',
  },
  {
    id: 'gita-arg-13.31-vistara-concl',
    unitIds: ['13.31'],
    ksts: ['13.30'],
    role: 'conclusion',
    claimEn: 'Seeing expansion from that One, the plurality-delusion dissolves: becoming Brahman is the same sight.',
    segmentId: 'gita-seg-13.30-vistara',
    passageId: 'gita-tx-13.30-vistara',
    status: 'source',
  },
  {
    id: 'gita-arg-13.32-avyaya-dist',
    unitIds: ['13.32'],
    ksts: ['13.31'],
    role: 'distinction',
    claimEn: 'Beginningless and guṇa-free, the imperishable abides in bodies doing nothing, untouched: unlike the bound knower.',
    segmentId: 'gita-seg-13.31-avyaya-b',
    passageId: 'gita-tx-13.31-avyaya-b',
    status: 'source',
  },
  {
    id: 'gita-arg-13.33-akasa-conseq',
    unitIds: ['13.33'],
    ksts: ['13.32'],
    role: 'consequence',
    claimEn: 'As all-pervading space from subtleness stays unsmeared, so the Self in all bodies stays untouched.',
    segmentId: 'gita-seg-13.32-akasa',
    passageId: 'gita-tx-13.32-akasa',
    status: 'source',
  },
  {
    id: 'gita-arg-13.34-ravi-dist',
    unitIds: ['13.34'],
    ksts: ['13.33'],
    role: 'distinction',
    claimEn: 'As one sun lights the whole world, one field-knower lights the field: likeness only in lighting.',
    segmentId: 'gita-seg-13.33-ravi',
    passageId: 'gita-tx-13.33-ravi',
    status: 'source',
  },
  {
    id: 'gita-arg-13.34-janaka-dist',
    unitIds: ['13.34'],
    ksts: ['13.33'],
    role: 'distinction',
    claimEn: 'Unlike the sun that only discloses, the field-knower generates the disclosed by making-them-lit.',
    segmentId: 'gita-seg-13.33-janaka',
    passageId: 'gita-tx-13.33-janaka',
    status: 'source',
  },
  {
    id: 'gita-arg-13.35-moksa-concl',
    unitIds: ['13.35'],
    ksts: ['13.34'],
    role: 'conclusion',
    claimEn: 'Beyond mere distinction-cognition, release from gross nature needs abiding in the distinct self-essence.',
    segmentId: 'gita-seg-13.34-moksa',
    passageId: 'gita-tx-13.34-moksa',
    status: 'source',
  },
  {
    id: 'gita-arg-13.35-para-conseq',
    unitIds: ['13.35'],
    ksts: ['13.34'],
    role: 'consequence',
    claimEn: 'Knowing the interval and the release, they reach the unsurpassed: identity-attainment with the supreme.',
    segmentId: 'gita-seg-13.34-para',
    passageId: 'gita-tx-13.34-para',
    status: 'source',
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
