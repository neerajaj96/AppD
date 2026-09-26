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
}

export function auditCommentary(input: {
  spans: CommentaryAuditSpan[];
  threads: V2Thread[];
  concepts: CommentaryAuditConcept[];
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
  const unitOnly = input.spans.filter(
    (s) => s.folio === undefined && (s.unitIds || []).length > 0,
  ).length;
  const precisionUnresolved = input.spans.filter(
    (s) => s.folio === undefined && (s.unitIds || []).length === 0,
  ).length;
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
  );
  return lines.join('\n');
}
