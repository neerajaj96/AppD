/**
 * Bhagavad Gītā joint commentary spans (Phase 2).
 *
 * The edition sometimes expounds several verses under one commentary
 * span instead of glossing each separately. These spans keep every
 * canonical verse individually addressable while recording the shared
 * exposition. Only spans stated in print (`निगद`-style markers
 * such as `निगदव्याख्यातौ श्लोकौ`, or an explicit joint gloss) are
 * listed; suspected spans stay out until verified.
 */

export interface GitaCommentarySpan {
  id: string;
  /** Canonical units covered, in order. */
  unitIds: string[];
  /** How the span is evidenced in print. */
  basis: string;
}

export const GITA_COMMENTARY_SPANS: GitaCommentarySpan[] = [
  {
    id: 'gita-span-18.74-75',
    unitIds: ['18.74', '18.75'],
    basis: 'KSTS 18.74–75 glossed jointly (लोकः स्पष्टार्थः on the pair; printed p.403)',
  },
  {
    id: 'gita-span-18.76-77',
    unitIds: ['18.76', '18.77'],
    basis: 'निगदव्याख्यातौ श्लोकौ on KSTS 18.76–77 (printed p.404)',
  },
];

/** Span covering a unit, when the unit shares its exposition. */
export function commentarySpanForUnit(unitId: string): GitaCommentarySpan | undefined {
  return GITA_COMMENTARY_SPANS.find((s) => s.unitIds.includes(unitId));
}
