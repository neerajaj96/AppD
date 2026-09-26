/**
 * Thread navigation helper (Phase 4).
 *
 * Pure URL resolution shared by ThreadView and tests: `?thread=<id>`
 * addresses a thread directly, while a bare legacy `?step=<n>` walks
 * the concatenated threads so every existing deep link keeps working.
 * Framework-free so node tests can import it without React.
 */
export interface ThreadNavList {
  id: string;
  steps: unknown[];
}

export function resolveThreadPosition(
  threads: ThreadNavList[],
  threadParam: string | null,
  stepParam: string | null,
): { threadIndex: number; stepIndex: number } {
  if (threads.length === 0) return { threadIndex: 0, stepIndex: 0 };
  if (threadParam) {
    const ti = threads.findIndex((t) => t.id === threadParam);
    if (ti >= 0) {
      const n = threads[ti].steps.length;
      const raw = Number(stepParam ?? 1);
      const si = Number.isFinite(raw)
        ? Math.min(Math.max(Math.floor(raw) - 1, 0), Math.max(n - 1, 0))
        : 0;
      return { threadIndex: ti, stepIndex: si };
    }
  }
  if (stepParam !== null) {
    const raw = Number(stepParam);
    if (Number.isFinite(raw)) {
      let rest = Math.max(Math.floor(raw) - 1, 0);
      for (let ti = 0; ti < threads.length; ti += 1) {
        if (rest < threads[ti].steps.length) return { threadIndex: ti, stepIndex: rest };
        rest -= threads[ti].steps.length;
      }
      const last = threads.length - 1;
      return { threadIndex: last, stepIndex: threads[last].steps.length - 1 };
    }
  }
  return { threadIndex: 0, stepIndex: 0 };
}
