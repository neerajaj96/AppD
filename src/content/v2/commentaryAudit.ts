import type { V2Thread } from './schema';

/**
 * Commentary audit (Phase 5, §11 of the task).
 *
 * Coverage measurements over a span registry, thread steps and concept
 * occurrences — never quality scores, so no percentages. Counts say
 * what is located, what is segment-grounded and what stays unresolved.
 * Generic over plain shapes; the Gītā wiring lives in tests and docs.
 * Pure and deterministic.
 */

export interface CommentaryAuditSpan {
  id: string;
  status?: string;
  folio?: number;
  unitIds?: string[];
}

export interface CommentaryAuditOccurrence {
  unitId: string;
  spanId?: string;
}

export interface CommentaryAuditConcept {
  id: string;
  occurrences?: CommentaryAuditOccurrence[];
}

export interface CommentaryAuditPassage {
  id: string;
  status?: string;
  spanId?: string;
  unitIds?: string[];
}

export interface ThreadCoverage {
  threadId: string;
  steps: number;
  stepsWithSegments: number;
  stepsWithDanglingSegments: number;
}

export interface CommentaryAudit {
  segments: { total: number; source: number; editorial: number; unresolved: number };
  evidencePrecision: { exactFolio: number; unitOnly: number; unresolved: number };
  threads: ThreadCoverage[];
  conceptsWithSegments: number;
  conceptsTotal: number;
  danglingSpanRefs: number;
  texts: { total: number; verifiedSource: number; extractionUnreviewed: number; partiallyVerified: number };
  stepsWithText: number;
  conceptsWithText: number;
}

export function auditCommentary(input: {
  spans: CommentaryAuditSpan[];
  threads: V2Thread[];
  concepts: CommentaryAuditConcept[];
  passages?: CommentaryAuditPassage[];
}): CommentaryAudit {
  const known = new Set(input.spans.map((s) => s.id));
  let source = 0;
  let editorial = 0;
  let unresolved = 0;
  let exactFolio = 0;
  for (const span of input.spans) {
    if (span.status === 'source') source += 1;
    else if (span.status === 'editorial') editorial += 1;
    else unresolved += 1;
    if (span.folio !== undefined) exactFolio += 1;
  }
  let danglingSpanRefs = 0;
  const threads: ThreadCoverage[] = input.threads.map((thread) => {
    let withSegments = 0;
    let dangling = 0;
    for (const step of thread.steps) {
      const ids = step.spanIds || [];
      if (ids.length === 0) continue;
      withSegments += 1;
      for (const sid of ids) {
        if (!known.has(sid)) {
          dangling += 1;
          danglingSpanRefs += 1;
        }
      }
    }
    return {
      threadId: thread.id,
      steps: thread.steps.length,
      stepsWithSegments: withSegments,
      stepsWithDanglingSegments: dangling,
    };
  });
  let conceptsWithSegments = 0;
  for (const concept of input.concepts) {
    let hit = false;
    for (const occ of concept.occurrences || []) {
      if (occ.spanId === undefined) continue;
      hit = true;
      if (!known.has(occ.spanId)) danglingSpanRefs += 1;
    }
    if (hit) conceptsWithSegments += 1;
  }
  const passages = input.passages || [];
  const bySpan = new Map<string, number>();
  for (const passage of passages) {
    if (passage.spanId !== undefined) {
      bySpan.set(passage.spanId, (bySpan.get(passage.spanId) || 0) + 1);
    }
  }
  let stepsWithText = 0;
  for (const thread of input.threads) {
    for (const step of thread.steps) {
      const units = new Set(step.unitIds || []);
      const covered = (step.spanIds || []).some((sid) => bySpan.has(sid)) ||
        passages.some((p) => p.spanId === undefined && (p.unitIds || []).some((u) => units.has(u)));
      if (covered) stepsWithText += 1;
    }
  }
  const conceptsWithText = input.concepts.filter((concept) =>
    (concept.occurrences || []).some((occ) =>
      passages.some(
        (p) =>
          (occ.spanId !== undefined && p.spanId === occ.spanId) ||
          (occ.spanId === undefined &&
            (p.unitIds || []).includes(occ.unitId)),
      ),
    ),
  ).length;
  const unitOnly = input.spans.filter(
    (s) => s.folio === undefined && (s.unitIds || []).length > 0,
  ).length;
  const precisionUnresolved = input.spans.filter(
    (s) => s.folio === undefined && (s.unitIds || []).length === 0,
  ).length;
  let verifiedSource = 0;
  let extractionUnreviewed = 0;
  let partiallyVerified = 0;
  for (const passage of passages) {
    if (passage.status === 'verified-source') verifiedSource += 1;
    else if (passage.status === 'extraction-unreviewed') extractionUnreviewed += 1;
    else if (passage.status === 'partially-verified') partiallyVerified += 1;
  }
  return {
    segments: { total: input.spans.length, source, editorial, unresolved },
    evidencePrecision: {
      exactFolio,
      unitOnly,
      unresolved: precisionUnresolved,
    },
    threads,
    conceptsWithSegments,
    conceptsTotal: input.concepts.length,
    danglingSpanRefs,
    texts: {
      total: passages.length,
      verifiedSource,
      extractionUnreviewed,
      partiallyVerified,
    },
    stepsWithText,
    conceptsWithText,
  };
}

/** Human-readable rendering of an audit (counts only, no scores). */
export function formatCommentaryAudit(audit: CommentaryAudit): string {
  const lines = [
    'Rāmakaṇṭha Commentary Audit',
    'Segments:',
    `  total: ${audit.segments.total}`,
    `  source-faithful: ${audit.segments.source}`,
    `  editorial: ${audit.segments.editorial}`,
    `  unresolved: ${audit.segments.unresolved}`,
    'Evidence precision:',
    `  exact folio/page: ${audit.evidencePrecision.exactFolio}`,
    `  KSTS + unit only: ${audit.evidencePrecision.unitOnly}`,
    `  unresolved: ${audit.evidencePrecision.unresolved}`,
  ];
  if (audit.threads.length > 0) {
    lines.push('Pilot thread coverage:');
    for (const t of audit.threads) {
      lines.push(`  ${t.threadId}: ${t.stepsWithSegments}/${t.steps} steps segment-grounded`);
    }
  }
  lines.push(
    `Concepts with segment evidence: ${audit.conceptsWithSegments}/${audit.conceptsTotal}`,
    `Dangling span references: ${audit.danglingSpanRefs}`,
    'Source-text Audit',
    'Commentary:',
    `  total segments: ${audit.texts.total}`,
    `  source-transcribed: ${audit.texts.verifiedSource}`,
    `  OCR-unverified: ${audit.texts.extractionUnreviewed}`,
    `  partially verified: ${audit.texts.partiallyVerified}`,
    `Steps with exact source text: ${audit.stepsWithText}`,
    `Concepts with exact source text: ${audit.conceptsWithText}`,
  );
  return lines.join('\n');
}
