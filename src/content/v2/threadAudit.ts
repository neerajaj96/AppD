import type { V2Thread } from './schema';

/**
 * Scholarly thread audit (Phase 4, §18 of the task).
 *
 * Per-thread counts a reader can verify: steps, source-backed steps,
 * concept references, quotation edges hosted in the thread's units,
 * transitions, unresolved markers and unit coverage. A thread is never
 * called scholarly for containing citations — the report shows the
 * density, humans judge the scholarship. Pure and deterministic.
 */

export interface ThreadAuditRow {
  threadId: string;
  kind?: string;
  scholarlyType?: string;
  steps: number;
  sourceBackedSteps: number;
  editorialSteps: number;
  conceptRefs: number;
  distinctConcepts: number;
  xrefEdges: number;
  transitions: number;
  unresolvedSteps: number;
  unitRefs: number;
  distinctUnits: number;
}

export function auditThreads(
  threads: V2Thread[],
  xrefEdges: Array<{ fromUnitId: string | null }> = [],
): ThreadAuditRow[] {
  return threads.map((thread) => {
    const concepts = new Set<string>();
    const units = new Set<string>();
    let sourceBackedSteps = 0;
    let editorialSteps = 0;
    let conceptRefs = 0;
    let transitions = 0;
    let unresolvedSteps = 0;
    let unitRefs = 0;
    thread.steps.forEach((step, i) => {
      if (step.claimStatus === 'source-backed') sourceBackedSteps += 1;
      if (step.claimStatus === 'editorial') editorialSteps += 1;
      for (const cid of [step.conceptId, ...(step.conceptIds || [])]) {
        if (cid) {
          conceptRefs += 1;
          concepts.add(cid);
        }
      }
      if (i > 0) {
        const transition = step.localisations.en?.transition || step.localisations.ml?.transition;
        if (transition && transition.trim()) transitions += 1;
      }
      if (step.role === 'unresolved') unresolvedSteps += 1;
      for (const uid of step.unitIds || []) {
        unitRefs += 1;
        units.add(uid);
      }
    });
    const hostedEdges = xrefEdges.filter((e) => e.fromUnitId !== null && units.has(e.fromUnitId)).length;
    return {
      threadId: thread.id,
      kind: thread.kind,
      scholarlyType: thread.scholarlyType,
      steps: thread.steps.length,
      sourceBackedSteps,
      editorialSteps,
      conceptRefs,
      distinctConcepts: concepts.size,
      xrefEdges: hostedEdges,
      transitions,
      unresolvedSteps,
      unitRefs,
      distinctUnits: units.size,
    };
  });
}
