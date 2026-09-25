import type { CanonicalUnit, V2Corpus, V2Source } from './schema';

/**
 * Content report — a human- and machine-friendly overview of the V2 corpus.
 * Counts systems, texts, canonical units, concepts and threads, plus
 * language coverage, provenance completeness, editorial status and
 * reference health. Problem files and entity IDs are listed explicitly so
 * editors know where to look next.
 */

export interface ContentReport {
  systems: number;
  texts: number;
  units: number;
  concepts: number;
  threads: number;
  threadSteps: number;
  languageCoverage: {
    english: { units: number; concepts: number };
    malayalam: { units: number; concepts: number };
  };
  sourceCoverage: { provenanceComplete: number; provenancePartial: number; unknown: number };
  editorial: Record<string, number>;
  referenceHealth: { valid: number; broken: number; ambiguous: number };
  problems: Array<{ textId: string; entityId?: string; detail: string }>;
}

export function buildContentReport(corpus: V2Corpus): ContentReport {
  let units = 0;
  let concepts = 0;
  let threads = 0;
  let threadSteps = 0;
  let enUnits = 0;
  let mlUnits = 0;
  let enConcepts = 0;
  let mlConcepts = 0;
  let provenanceComplete = 0;
  let provenancePartial = 0;
  let unknown = 0;
  let valid = 0;
  let broken = 0;
  const problems: ContentReport['problems'] = [];
  const editorial: Record<string, number> = {};

  const bumpEditorial = (state?: string) => {
    const key = state || 'missing';
    editorial[key] = (editorial[key] || 0) + 1;
  };

  for (const text of corpus.texts) {
    const unitIds = new Set(text.units.map((u) => u.id));
    const conceptIds = new Set(text.concepts.map((c) => c.id));
    units += text.units.length;
    concepts += text.concepts.length;
    threads += (text.threads || []).length;
    for (const thread of text.threads || []) threadSteps += thread.steps.length;

    for (const unit of text.units) {
      if (unit.localisations.en?.translation || unit.localisations.en?.commentary) enUnits += 1;
      else problems.push({ textId: text.id, entityId: unit.id, detail: 'missing English localisation' });
      if (unit.localisations.ml?.translation || unit.localisations.ml?.commentary) mlUnits += 1;
      if (unit.provenance?.sourceTitle) provenanceComplete += 1;
      else if (unit.provenance) provenancePartial += 1;
      else unknown += 1;
      bumpEditorial(unit.editorial?.englishTranslation);
      for (const cid of unit.conceptIds || []) {
        if (conceptIds.has(cid)) valid += 1;
        else {
          broken += 1;
          problems.push({ textId: text.id, entityId: unit.id, detail: `dangling concept ${cid}` });
        }
      }
    }
    for (const concept of text.concepts) {
      if (concept.localisations.en?.title) enConcepts += 1;
      if (concept.localisations.ml?.title) mlConcepts += 1;
      for (const uid of concept.relatedUnitIds || []) {
        if (unitIds.has(uid)) valid += 1;
        else {
          broken += 1;
          problems.push({ textId: text.id, entityId: concept.id, detail: `dangling unit ${uid}` });
        }
      }
    }
  }

  return {
    systems: corpus.traditions.length,
    texts: corpus.texts.length,
    units,
    concepts,
    threads,
    threadSteps,
    languageCoverage: {
      english: { units: enUnits, concepts: enConcepts },
      malayalam: { units: mlUnits, concepts: mlConcepts },
    },
    sourceCoverage: { provenanceComplete, provenancePartial, unknown },
    editorial,
    referenceHealth: { valid, broken, ambiguous: 0 },
    problems,
  };
}

export function formatReportHuman(report: ContentReport): string {
  const lines = [
    'SYSTEMS                 ' + report.systems,
    'TEXTS                   ' + report.texts,
    'CANONICAL UNITS         ' + report.units,
    'CONCEPTS                ' + report.concepts,
    'THREADS                 ' + report.threads,
    'THREAD STEPS            ' + report.threadSteps,
    'LANGUAGE COVERAGE',
    `  ENGLISH units         ${report.languageCoverage.english.units}`,
    `  ENGLISH concepts      ${report.languageCoverage.english.concepts}`,
    `  MALAYALAM units       ${report.languageCoverage.malayalam.units}`,
    `  MALAYALAM concepts    ${report.languageCoverage.malayalam.concepts}`,
    'SOURCE COVERAGE',
    `  PROVENANCE COMPLETE   ${report.sourceCoverage.provenanceComplete}`,
    `  PROVENANCE PARTIAL    ${report.sourceCoverage.provenancePartial}`,
    `  UNKNOWN               ${report.sourceCoverage.unknown}`,
    'REFERENCE HEALTH',
    `  VALID                 ${report.referenceHealth.valid}`,
    `  BROKEN                ${report.referenceHealth.broken}`,
    `  AMBIGUOUS             ${report.referenceHealth.ambiguous}`,
  ];
  if (report.problems.length > 0) {
    lines.push(`PROBLEMS (${report.problems.length})`);
    for (const p of report.problems.slice(0, 50)) {
      lines.push(`  - ${p.textId}${p.entityId ? `/${p.entityId}` : ''}: ${p.detail}`);
    }
    if (report.problems.length > 50) lines.push(`  … and ${report.problems.length - 50} more`);
  }
  return lines.join('\n');
}

/**
 * Scholarly evidence audit — measurable, auditable provenance coverage
 * across the corpus. Built on the curated corpus (adapt + shared
 * curation), never on guesses: every count derives from present fields.
 *
 * Deliberate non-equations enforced by construction:
 * - a locator-only unit (Devi-Mahatmya page ranges) is NOT evidence-linked;
 * - a source-linked unit without links stays source-linked only;
 * - absent metadata is unresolved, never "verified" or "unverified".
 */

export type UnresolvedReason =
  | 'no-source-record'
  | 'no-unit-association'
  | 'notes-without-deterministic-mapping'
  | 'unclassified';

const UNRESOLVED_REASONS: UnresolvedReason[] = [
  'no-source-record',
  'no-unit-association',
  'notes-without-deterministic-mapping',
  'unclassified',
];

/**
 * Why one unit is unresolved, from observable state only:
 * - its text holds no source records at all;
 * - else its text holds records but the unit offered no notes to match;
 * - else it offered notes yet nothing matched deterministically.
 * Anything else is `unclassified` and needs manual review.
 */
export function classifyUnresolvedUnit(
  sourceRecordCount: number,
  unit: Pick<CanonicalUnit, 'sourceIds' | 'evidenceLinks' | 'provenance' | 'interpretiveNotes'>,
): UnresolvedReason | null {
  const linked =
    (unit.sourceIds?.length ?? 0) > 0 ||
    (unit.evidenceLinks?.length ?? 0) > 0 ||
    !!unit.provenance?.locator;
  if (linked) return null;
  if (sourceRecordCount === 0) return 'no-source-record';
  if ((unit.interpretiveNotes || []).length > 0) return 'notes-without-deterministic-mapping';
  if ((unit.sourceIds?.length ?? 0) === 0 && (unit.evidenceLinks?.length ?? 0) === 0 && !unit.provenance?.locator) {
    return 'no-unit-association';
  }
  return 'unclassified';
}

export type EvidenceClass = 'A' | 'B' | 'C' | 'D';

export interface TextEvidenceAudit {
  textId: string;
  traditionId: string;
  unitCount: number;
  sourceRecordCount: number;
  sourceLinkedUnits: number;
  evidenceLinkedUnits: number;
  locatorUnits: number;
  /** Locator-bearing units with no source association (Devi-Mahatmya pattern). */
  locatorOnlyUnits: number;
  fullyLinkedUnits: number;
  unresolvedUnits: number;
  unresolvedReasons: Record<UnresolvedReason, number>;
  sourceRoleCounts: Record<string, number>;
  evidenceRelationCounts: Record<string, number>;
  /** Derived curation class: A curated, B reserved (unused), C notes-only, D no evidence. */
  evidenceClass: EvidenceClass;
}

export interface EvidenceAudit {
  texts: number;
  units: number;
  textsWithSources: number;
  sourceRecords: number;
  sourcesWithRoles: number;
  sourceLinkedUnits: number;
  evidenceLinkedUnits: number;
  locatorUnits: number;
  locatorOnlyUnits: number;
  fullyLinkedUnits: number;
  unresolvedUnits: number;
  unresolvedReasons: Record<UnresolvedReason, number>;
  sourceRoleCounts: Record<string, number>;
  evidenceRelationCounts: Record<string, number>;
  /** Canonical corpus order, all texts present. */
  perText: TextEvidenceAudit[];
  /** Nonzero reason buckets, corpus order. */
  unresolved: Array<{ textId: string; units: number; reason: UnresolvedReason }>;
  curationQueue: { curated: string[]; notesOnly: string[]; noEvidence: string[] };
}

function emptyReasons(): Record<UnresolvedReason, number> {
  return {
    'no-source-record': 0,
    'no-unit-association': 0,
    'notes-without-deterministic-mapping': 0,
    unclassified: 0,
  };
}

/**
 * Per-text evidence audit — the single shared derivation. The corpus
 * audit (`buildEvidenceAudit`) and the text-level reader UI both consume
 * this function, so the two can never drift into competing calculations.
 * Pure and deterministic: same units and sources in, same counts out.
 */
export function auditText(textId: string, traditionId: string, units: CanonicalUnit[], sources: V2Source[]): TextEvidenceAudit {
  let sourceLinkedUnits = 0;
  let evidenceLinkedUnits = 0;
  let locatorUnits = 0;
  let locatorOnlyUnits = 0;
  let fullyLinkedUnits = 0;
  let unresolvedUnits = 0;
  const unresolvedReasons = emptyReasons();
  const evidenceRelationCounts: Record<string, number> = {};
  for (const unit of units) {
    const hasSource = (unit.sourceIds?.length ?? 0) > 0;
    const hasLinks = (unit.evidenceLinks?.length ?? 0) > 0;
    const hasLocator = !!unit.provenance?.locator;
    if (hasSource) sourceLinkedUnits += 1;
    if (hasLinks) evidenceLinkedUnits += 1;
    if (hasLocator) locatorUnits += 1;
    if (hasLocator && !hasSource && !hasLinks) locatorOnlyUnits += 1;
    if (hasSource && (hasLinks || hasLocator)) fullyLinkedUnits += 1;
    for (const link of unit.evidenceLinks || []) {
      evidenceRelationCounts[link.relation] = (evidenceRelationCounts[link.relation] || 0) + 1;
    }
    const reason = classifyUnresolvedUnit(sources.length, unit);
    if (reason !== null) {
      unresolvedUnits += 1;
      unresolvedReasons[reason] += 1;
    }
  }
  const sourceRoleCounts: Record<string, number> = {};
  for (const source of sources) {
    const role = source.role || 'unclassified';
    sourceRoleCounts[role] = (sourceRoleCounts[role] || 0) + 1;
  }
  const evidenceClass: EvidenceClass =
    sourceLinkedUnits + evidenceLinkedUnits + locatorUnits > 0
      ? 'A'
      : sources.length > 0
        ? 'C'
        : 'D';
  return {
    textId,
    traditionId,
    unitCount: units.length,
    sourceRecordCount: sources.length,
    sourceLinkedUnits,
    evidenceLinkedUnits,
    locatorUnits,
    locatorOnlyUnits,
    fullyLinkedUnits,
    unresolvedUnits,
    unresolvedReasons,
    sourceRoleCounts,
    evidenceRelationCounts,
    evidenceClass,
  };
}

export function buildEvidenceAudit(corpus: V2Corpus): EvidenceAudit {
  const perText = corpus.texts.map((text) =>
    auditText(text.id, text.traditionId, text.units, text.sources || []),
  );
  const sum = (pick: (t: TextEvidenceAudit) => number) => perText.reduce((n, t) => n + pick(t), 0);
  const mergeCounts = (pick: (t: TextEvidenceAudit) => Record<string, number>) => {
    const out: Record<string, number> = {};
    for (const text of perText) {
      for (const [key, count] of Object.entries(pick(text))) {
        out[key] = (out[key] || 0) + count;
      }
    }
    return out;
  };
  const unresolved: EvidenceAudit['unresolved'] = [];
  for (const text of perText) {
    for (const reason of UNRESOLVED_REASONS) {
      const units = text.unresolvedReasons[reason];
      if (units > 0) unresolved.push({ textId: text.textId, units, reason });
    }
  }
  return {
    texts: corpus.texts.length,
    units: sum((t) => t.unitCount),
    textsWithSources: perText.filter((t) => t.sourceRecordCount > 0).length,
    sourceRecords: sum((t) => t.sourceRecordCount),
    sourcesWithRoles: perText.reduce(
      (n, t) => n + Object.entries(t.sourceRoleCounts).filter(([role]) => role !== 'unclassified').reduce((m, [, c]) => m + c, 0),
      0,
    ),
    sourceLinkedUnits: sum((t) => t.sourceLinkedUnits),
    evidenceLinkedUnits: sum((t) => t.evidenceLinkedUnits),
    locatorUnits: sum((t) => t.locatorUnits),
    locatorOnlyUnits: sum((t) => t.locatorOnlyUnits),
    fullyLinkedUnits: sum((t) => t.fullyLinkedUnits),
    unresolvedUnits: sum((t) => t.unresolvedUnits),
    unresolvedReasons: mergeCounts((t) => t.unresolvedReasons),
    sourceRoleCounts: mergeCounts((t) => t.sourceRoleCounts),
    evidenceRelationCounts: mergeCounts((t) => t.evidenceRelationCounts),
    perText,
    unresolved,
    curationQueue: {
      curated: perText.filter((t) => t.evidenceClass === 'A').map((t) => t.textId),
      notesOnly: perText.filter((t) => t.evidenceClass === 'C').map((t) => t.textId),
      noEvidence: perText.filter((t) => t.evidenceClass === 'D').map((t) => t.textId),
    },
  };
}

function padEnd(value: string | number, width: number): string {
  const text = String(value);
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

export function formatEvidenceHuman(audit: EvidenceAudit): string {
  const lines = [
    'Darśana Scholarly Evidence Audit',
    'Corpus',
    `  Texts: ${audit.texts}`,
    `  Units: ${audit.units}`,
    'Sources',
    `  Texts with source records: ${audit.textsWithSources}`,
    `  Total source records: ${audit.sourceRecords}`,
    `  Sources with explicit roles: ${audit.sourcesWithRoles}`,
    'Unit evidence',
    `  sourceIds: ${audit.sourceLinkedUnits}`,
    `  precise evidenceLinks: ${audit.evidenceLinkedUnits}`,
    `  provenance locators: ${audit.locatorUnits}`,
    `  source + evidence: ${audit.fullyLinkedUnits}`,
    `  locator-only: ${audit.locatorOnlyUnits}`,
    `  unresolved: ${audit.unresolvedUnits}`,
    'Evidence relations',
  ];
  for (const relation of Object.keys(audit.evidenceRelationCounts).sort()) {
    lines.push(`  ${relation}: ${audit.evidenceRelationCounts[relation]}`);
  }
  lines.push('Source roles');
  const roleOrder = ['primary-text', 'translation', 'commentary', 'secondary', 'provenance', 'editorial', 'unclassified'];
  for (const role of roleOrder) {
    if (audit.sourceRoleCounts[role] !== undefined) {
      lines.push(`  ${role}: ${audit.sourceRoleCounts[role]}`);
    }
  }
  for (const role of Object.keys(audit.sourceRoleCounts).sort()) {
    if (!roleOrder.includes(role)) lines.push(`  ${role}: ${audit.sourceRoleCounts[role]}`);
  }
  lines.push(
    'Text  Units  Sources  Source-linked  Evidence-linked  Locator-linked  Unresolved',
    ...audit.perText.map((t) =>
      [
        padEnd(t.textId, 22),
        padEnd(t.unitCount, 7),
        padEnd(t.sourceRecordCount, 9),
        padEnd(t.sourceLinkedUnits, 14),
        padEnd(t.evidenceLinkedUnits, 16),
        padEnd(t.locatorUnits, 15),
        String(t.unresolvedUnits),
      ].join(''),
    ),
  );
  if (audit.unresolved.length > 0) {
    lines.push('Unresolved evidence');
    for (const row of audit.unresolved) {
      lines.push(`  ${row.textId}  ${row.units} units  reason: ${row.reason}`);
    }
  }
  lines.push(
    `Curation queue — curated (${audit.curationQueue.curated.length}): ${audit.curationQueue.curated.join(', ') || '—'}`,
    `Curation queue — notes-only (${audit.curationQueue.notesOnly.length}): ${audit.curationQueue.notesOnly.join(', ') || '—'}`,
    `Curation queue — no evidence (${audit.curationQueue.noEvidence.length}): ${audit.curationQueue.noEvidence.join(', ') || '—'}`,
  );
  return lines.join('\n');
}
