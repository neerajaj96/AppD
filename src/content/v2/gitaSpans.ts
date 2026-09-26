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

/**
 * Sub-unit passage spans (Phase 4). Where print gives an explicit
 * boundary — a `nanu` between verse markers, an avataraṇikā before the
 * first verse, a gloss on an unnumbered half — the region is named so
 * thread steps and concept occurrences can cite exact passages without
 * inventing sentence boundaries. No span is drawn inside undifferentiated
 * commentary prose.
 */
export const PASSAGE_SPAN_ROLES = [
  'gloss',
  'objection',
  'response',
  'question',
  'quotation',
  'cross-reference',
  'inference',
  'conclusion',
] as const;

export type PassageSpanRole = (typeof PASSAGE_SPAN_ROLES)[number];

export type PassageSpanAnchor = 'avataraṇikā' | 'commentary-tail' | 'commentary' | 'closing';

export interface GitaPassageSpan {
  id: string;
  /** Canonical units the passage belongs to (often one). */
  unitIds: string[];
  /** KSTS refs, fully qualified. */
  ksts: string[];
  pdf?: number;
  folio?: number;
  anchor: PassageSpanAnchor;
  role?: PassageSpanRole;
  note?: string;
}

export const GITA_PASSAGE_SPANS: GitaPassageSpan[] = [
  {
    id: 'gita-ps-13.2-nanu',
    unitIds: ['13.2', '13.3'],
    ksts: ['13.1', '13.2'],
    pdf: 287,
    folio: 277,
    anchor: 'commentary-tail',
    role: 'objection',
    note: 'ननु passage between KSTS 13.1 close and 13.2: one pramātṛ vs many knowers (printed pp.287–288).',
  },
  {
    id: 'gita-ps-3-avat',
    unitIds: ['3.1'],
    ksts: [],
    pdf: 71,
    folio: 61,
    anchor: 'avataraṇikā',
    note: 'Chapter-3 gateway: Arjuna asks from non-ascertainment of the samuccaya object.',
  },
  {
    id: 'gita-ps-4-avat',
    unitIds: ['4.1'],
    ksts: [],
    pdf: 102,
    folio: 92,
    anchor: 'avataraṇikā',
    note: 'Chapter-4 gateway: samuccaya as abhidheya, paramātma-samāpatti as prayojana.',
  },
  {
    id: 'gita-ps-7-avat',
    unitIds: ['7.1'],
    ksts: [],
    pdf: 168,
    folio: 158,
    anchor: 'avataraṇikā',
    note: 'Chapter-7 gateway: the unsurpassed yoga of samuccaya form.',
  },
  {
    id: 'gita-ps-18.61-maya',
    unitIds: ['18.61'],
    ksts: ['18.61'],
    pdf: 406,
    folio: 396,
    anchor: 'commentary',
    role: 'gloss',
    note: 'Gloss on the unnumbered भ्रामयन् half: all stirrings done through māyā-śakti-avabhāsa.',
  },
];

export function passageSpanById(id: string): GitaPassageSpan | undefined {
  return GITA_PASSAGE_SPANS.find((s) => s.id === id);
}
