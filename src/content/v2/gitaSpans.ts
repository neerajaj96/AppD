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
  /** KSTS refs, fully qualified; empty for unnumbered opening matter. */
  ksts: string[];
  pdf?: number;
  folio?: number;
  anchor: PassageSpanAnchor;
  role?: PassageSpanRole;
  /**
   * Source vs editorial accounting. `source` = print-demarcated region
   * (nanu, avataraṇikā, verse-adjacent gloss bounded by markers);
   * `editorial` = Darśana grouping, explicitly marked; `unresolved` =
   * insufficient evidence for a stronger claim. Required on every span.
   */
  status: 'source' | 'editorial' | 'unresolved';
  /**
   * Reserved for future verified transcription. ABSENT throughout Phase
   * 5 by design: no Sanskrit has been imported, and tests enforce the
   * absence so commentary text can never be fabricated here.
   */
  transcription?: string;
  note?: string;
}

export const GITA_PASSAGE_SPANS: GitaPassageSpan[] = [
  {
    id: 'gita-ps-13-avat',
    unitIds: ['13.2'],
    ksts: [],
    pdf: 286,
    folio: 276,
    anchor: 'avataraṇikā',
    status: 'source',
    note: 'Chapter-13 gateway: jñāna-nirṇaya purpose for the śarīra-śarīri exposition (printed p.276).',
  },
  {
    id: 'gita-ps-13.2-nanu',
    unitIds: ['13.2', '13.3'],
    ksts: ['13.1', '13.2'],
    pdf: 287,
    folio: 277,
    anchor: 'commentary-tail',
    role: 'objection',
    status: 'source',
    note: 'ननु passage between KSTS 13.1 close and 13.2: one pramātṛ vs many knowers (printed pp.287–288).',
  },
  {
    id: 'gita-ps-3-avat',
    unitIds: ['3.1'],
    ksts: [],
    pdf: 71,
    folio: 61,
    anchor: 'avataraṇikā',
    status: 'source',
    note: 'Chapter-3 gateway: Arjuna asks from non-ascertainment of the samuccaya object.',
  },
  {
    id: 'gita-ps-4-avat',
    unitIds: ['4.1'],
    ksts: [],
    pdf: 102,
    folio: 92,
    anchor: 'avataraṇikā',
    status: 'source',
    note: 'Chapter-4 gateway: samuccaya as abhidheya, paramātma-samāpatti as prayojana.',
  },
  {
    id: 'gita-ps-7-avat',
    unitIds: ['7.1'],
    ksts: [],
    pdf: 168,
    folio: 158,
    anchor: 'avataraṇikā',
    status: 'source',
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
    status: 'source',
    note: 'Gloss on the unnumbered भ्रामयन् half: all stirrings done through māyā-śakti-avabhāsa.',
  },
  {
    id: 'gita-seg-13.1-glosa',
    unitIds: ['13.2'],
    ksts: ['13.1'],
    pdf: 287,
    folio: 277,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Śarīra pratīka gloss region of KSTS 13.1 (bounded by the verse marker and the nanu).',
  },
  {
    id: 'gita-seg-13.2-verse',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    pdf: 288,
    folio: 278,
    anchor: 'commentary',
    status: 'source',
    note: 'Verse introduction (parihartum + āha) with KSTS 13.2 itself.',
  },
  {
    id: 'gita-seg-13.2-resolution',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    pdf: 288,
    folio: 278,
    anchor: 'commentary',
    status: 'source',
    note: 'Vedakaika distinction and māyāśakti ground (shared by distinction and conclusion claims; retained whole — no inner boundary in print).',
  },
  {
    id: 'gita-seg-2.39-tail',
    unitIds: ['2.38'],
    ksts: ['2.39'],
    pdf: 48,
    folio: 38,
    anchor: 'commentary-tail',
    status: 'source',
    note: 'Closing sentence ascertaining jñāna-kriyā-samuccaya as the teachable.',
  },
  {
    id: 'gita-seg-7.14-q2',
    unitIds: ['7.14'],
    ksts: ['7.14'],
    pdf: 176,
    folio: 166,
    anchor: 'commentary',
    role: 'objection',
    status: 'source',
    note: 'Second nanu (vain-teaching objection) within the 7.14 gloss.',
  },
  {
    id: 'gita-seg-7.14-response',
    unitIds: ['7.14'],
    ksts: ['7.14'],
    pdf: 176,
    folio: 166,
    anchor: 'commentary',
    role: 'response',
    status: 'source',
    note: 'atrāha prapatti resolution following the second nanu.',
  },
  {
    id: 'gita-seg-13.3-gloss',
    unitIds: ['13.4'],
    ksts: ['13.3'],
    pdf: 289,
    folio: 279,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Vikāri gloss region of KSTS 13.3 (bounded by the verse markers; vikāra/vikāri distinction).',
  },
  {
    id: 'gita-seg-13.5-gloss',
    unitIds: ['13.6'],
    ksts: ['13.5'],
    pdf: 290,
    folio: 280,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Kṣetra-saṅgraha gloss of KSTS 13.5 (mahābhūtādi-samudaya as savikāra kṣetra; bounded by verse markers).',
  },
  {
    id: 'gita-seg-13.6-iccha',
    unitIds: ['13.7'],
    ksts: ['13.6'],
    pdf: 291,
    folio: 281,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Icchā-ādi gloss tail of KSTS 13.6 (icchā-dveṣa as vedyatvāt kṣetra; saṅghāta/cetanā/dhṛti definitions; runs to printed p.281).',
  },
  {
    id: 'gita-seg-13.11-ajnana',
    unitIds: ['13.12'],
    ksts: ['13.11'],
    pdf: 296,
    folio: 286,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Ajñāna close of the jñāna-virtue exposition (anyathā/mānitva as jñāna-viparīta; KSTS 13.11 tail on printed p.286).',
  },
  {
    id: 'gita-seg-13.12-jneya-resp',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    pdf: 297,
    folio: 287,
    anchor: 'commentary',
    role: 'response',
    status: 'source',
    note: 'Satyam response on jneya-upacāra (ārurukṣā stage division; vastava jneya denied; bounded by the nanu and the anādi verse).',
  },
  {
    id: 'gita-seg-13.12-anadi',
    unitIds: ['13.13'],
    ksts: ['13.12'],
    pdf: 298,
    folio: 288,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Anādimat gloss of KSTS 13.12 (kāraṇāntara-nirapekṣa being vs ādimat vedya; bounded by verse markers).',
  },
  {
    id: 'gita-seg-13.19-prakrti',
    unitIds: ['13.20'],
    ksts: ['13.19'],
    pdf: 301,
    folio: 291,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Prakṛti-puruṣa anāditva gloss of KSTS 13.19 (saptama vs śarīra-bhāva exposition recalled; bounded by verse markers).',
  },
  {
    id: 'gita-seg-13.20-karya',
    unitIds: ['13.21'],
    ksts: ['13.20'],
    pdf: 301,
    folio: 291,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Kārya-kāraṇa gloss of KSTS 13.20 (mahābhūtādi + bāhyābhyantara indriyas as śarīrādi-samūha; bounded by verse markers).',
  },
  {
    id: 'gita-seg-13.22-mahesvara',
    unitIds: ['13.23'],
    ksts: ['13.22'],
    pdf: 303,
    folio: 293,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Maheśvara gloss of KSTS 13.22 (upadraṣṭā/bhartā/anumantā/bhoktā as svamāyodbhāvita vyapadeśa; tail on printed p.293).',
  },
  {
    id: 'gita-seg-13.34-synthesis',
    unitIds: ['13.35'],
    ksts: ['13.34'],
    pdf: 311,
    folio: 301,
    anchor: 'commentary',
    role: 'gloss',
    status: 'source',
    note: 'Kṣetra-kṣetrajña antara gloss of KSTS 13.34 (aparā/parā prakṛti distinction as viduḥ object; bounded by the closing verse).',
  },
  {
    id: 'gita-seg-13.34-closing',
    unitIds: ['13.35'],
    ksts: ['13.34'],
    pdf: 312,
    folio: 302,
    anchor: 'closing',
    status: 'source',
    note: 'Chapter-13 closing apparatus: authorial praśasti verse + fixed colophon (printed p.302; transcription deferred — locator-only).',
  },
];

export function passageSpanById(id: string): GitaPassageSpan | undefined {
  return GITA_PASSAGE_SPANS.find((s) => s.id === id);
}
