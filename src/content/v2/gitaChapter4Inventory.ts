import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_CHAPTERS } from './gitaChapters';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 4 Rāmakaṇṭha commentary inventory (Phase 13).
 *
 * A deterministic, machine-readable record of the Chapter-4 source: the
 * chapter frame, one row per KSTS verse (4.1–4.42, fully aligned with
 * the vulgate — no extras, no offsets), the observed apparatus, and
 * everything that stays unresolved and why. Print description is fixed
 * source record; transcription references the span and passage tables,
 * never recopies them. `validateChapter4Inventory` keeps the layers
 * reconciled; tests enforce it.
 *
 * Scope honesty: the transmitted commentary is dense word-by-word gloss
 * across PDF pp.102–125. Only the chapter-entry joint gloss (KSTS
 * 4.1–3), the cāturvarṇya nanu/satyam gloss (KSTS 4.13) and the chapter
 * close (KSTS 4.42 gloss + praśasti) are transcribed. Every other verse
 * row is locator-complete with its gloss explicitly untranscribed: the
 * audit exposes these gaps rather than hiding them.
 *
 * Verification honesty: `locator-only` stays locator-only. All four
 * Chapter-4 passages are `text-layer-reviewed`; none claims
 * `page-image-collated` — page images were unavailable. Mūla verses are
 * locator-only throughout (root-text import stays a separate phase). No
 * variant footnotes were observed in this chapter (only folio
 * fragments); the apparatus says so openly.
 */

export interface Chapter4InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter4InventoryRow {
  /** KSTS verse number within Chapter 4 (1–42; aligned with the vulgate). */
  ksts: string;
  /** Repository unit (vulgate numbering; identical here). */
  repoUnit: string;
  /** PDF page where the commentary region starts. */
  pdf: number;
  /** Printed folio where the commentary region starts. */
  folio: number;
  /** PDF page where the commentary region closes. */
  closePdf: number;
  /** First words of the commentary region in print. */
  commentaryStart: string;
  /** Last words of the commentary region in print. */
  commentaryEnd: string;
  /** Whether the commentary region crosses a PDF page boundary. */
  crossesPage: boolean;
  /** Whether the region shares material across a verse boundary. */
  crossesVerseBoundary: boolean;
  contains: Chapter4InventoryContains;
  /** Span records evidencing this region (never transcription). */
  spanIds: string[];
  /** Transcribed passages evidencing this region (diplomatic text). */
  passageIds: string[];
  /** What stays untranscribed in this region, and why. */
  remaining: string;
  /** Unresolved extraction or attribution issues in this region. */
  unresolved: string[];
}

const C = (
  partial: Partial<Chapter4InventoryContains>,
): Chapter4InventoryContains => ({
  gloss: false,
  objection: false,
  response: false,
  quotation: false,
  crossReference: false,
  variant: false,
  summary: false,
  closing: false,
  ...partial,
});

const MULA_REMAINING =
  'Gloss untranscribed (no span, no passage); mūla present in print at the mapped page but untranscribed by root-text policy.';

interface VerseSpec {
  v: number;
  pdf: number;
  closePdf: number;
  start: string;
  end: string;
  contains: Partial<Chapter4InventoryContains>;
  spans: string[];
  passages: string[];
  remaining?: string;
  unresolved?: string[];
}

// Per-verse record surveyed from the text layer (PDF pp.102–125):
// region pages, boundary words, rhetorical markers, joint markers and
// quotations. Verse-number markers and running heads excluded
// throughout; boundary strings are commentary words, never mūla.
const SPECS: VerseSpec[] = [
  { v: 1, pdf: 102, closePdf: 103, start: '‘एवम्’ अनेन प्रकारेणैव', end: 'रहस्यम् ॥ ३ ॥', contains: { gloss: true, summary: true }, spans: ['gita-ps-4-avat', 'gita-seg-4.1-3-joint'], passages: ['gita-tx-4-avat', 'gita-tx-4.1-3-joint'], remaining: 'Joint paramparā gloss (1–3) fully covered in one bounded excerpt; the opening avataraṇikā is the pre-existing Phase-6 record, claimed here and in the frame table.', unresolved: [] },
  { v: 2, pdf: 102, closePdf: 103, start: '‘एवम्’ अनेन प्रकारेणैव (shared)', end: 'रहस्यम् ॥ ३ ॥', contains: { gloss: true, summary: true }, spans: ['gita-seg-4.1-3-joint'], passages: ['gita-tx-4.1-3-joint'], remaining: 'Shared with the KSTS 4.1–3 joint gloss (see 4.1).', unresolved: [] },
  { v: 3, pdf: 102, closePdf: 103, start: '‘एवम्’ अनेन प्रकारेणैव (shared)', end: 'रहस्यम् ॥ ३ ॥', contains: { gloss: true, summary: true }, spans: ['gita-seg-4.1-3-joint'], passages: ['gita-tx-4.1-3-joint'], remaining: 'Shared with the KSTS 4.1–3 joint gloss (see 4.1).', unresolved: [] },
  { v: 4, pdf: 103, closePdf: 103, start: 'एवमनेन अस्य शास्त्रस्य', end: 'प्रोक्तवानिति ॥ ४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 5, pdf: 104, closePdf: 104, start: 'अत्र भगवानुत्तरमुवाच', end: 'जानासि ॥ ५ ॥', contains: { gloss: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 6, pdf: 104, closePdf: 104, start: 'अतोऽहम्', end: 'जानामि ॥ ६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 7, pdf: 104, closePdf: 105, start: 'इत्थं स्वजन्मपरिग्रहस्य', end: 'अनुभवामि ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (7–8), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 8, pdf: 104, closePdf: 105, start: 'इत्थं स्वजन्मपरिग्रहस्य (shared)', end: 'अनुभवामि ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.7–8 joint exposition (see 4.7).', unresolved: [] },
  { v: 9, pdf: 105, closePdf: 105, start: 'अत एव', end: 'मत्स्वभावमापद्यते ॥ ९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 10, pdf: 105, closePdf: 106, start: 'यत एतेन', end: 'तथाविधाः ॥ १० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 11, pdf: 106, closePdf: 107, start: 'ननु प्रबन्धतो भगवता', end: 'मन्यन्ते ॥ ११ ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 12, pdf: 107, closePdf: 107, start: 'अत एव किं वाञ्छन्तः', end: 'सम्पद्यते ॥ १२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 13, pdf: 108, closePdf: 108, start: 'ननु त्वमेव', end: 'युज्ये (marker excluded)', contains: { gloss: true, objection: true, response: true }, spans: ['gita-seg-4.13-gloss'], passages: ['gita-tx-4.13-gloss'], remaining: 'Kartṛ/akartṛ nanu with the satyam response fully covered in one bounded excerpt.', unresolved: [] },
  { v: 14, pdf: 108, closePdf: 109, start: 'ततश्च', end: 'नियत्रितः क्रियते ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 15, pdf: 109, closePdf: 109, start: 'किंच', end: 'पूर्वतरम् ॥ १५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 16, pdf: 109, closePdf: 109, start: 'किन्तु', end: 'भविष्यसि ॥ १६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 17, pdf: 109, closePdf: 110, start: 'यतः', end: 'व्याप्तिः ॥ १७ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 18, pdf: 110, closePdf: 110, start: 'सा च यथा', end: 'व्याख्यातम् ॥ १८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 19, pdf: 110, closePdf: 111, start: 'अथ कर्मैव', end: 'संभवति ॥१९॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 20, pdf: 111, closePdf: 111, start: 'एवं कर्मण्येव', end: 'सामर्थ्यात् ॥ २० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 21, pdf: 111, closePdf: 112, start: 'यथोक्तस्य योगिनः', end: 'व्याख्यातमेव ॥ २२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (21–22; prāgeva-vyākhyātam), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 22, pdf: 111, closePdf: 112, start: 'यथोक्तस्य योगिनः (shared)', end: 'व्याख्यातमेव ॥ २२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.21–22 joint exposition (see 4.21).', unresolved: [] },
  { v: 23, pdf: 112, closePdf: 113, start: 'इदानीं कर्म सर्वथा', end: 'नश्यतीत्यर्थः ॥ २३ ॥', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['Quotation of 3.9 in this region is edged as gita-xref-022 from the 4.22 gloss; the marginal 4. before the quotation is unexplained extraction matter, uncollated.'] },
  { v: 24, pdf: 112, closePdf: 114, start: 'कथं क्रियमाणमेव', end: 'वेदितव्यम्', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 25, pdf: 114, closePdf: 115, start: 'इदानीं वर्णाश्रमविभक्त', end: 'ापादयन्तीत्यर्थः ॥ २७ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Three-verse joint exposition (25–27; ślokatraya), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 26, pdf: 114, closePdf: 115, start: 'इदानीं वर्णाश्रमविभक्त (shared)', end: 'ापादयन्तीत्यर्थः ॥ २७ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.25–27 joint exposition (see 4.25).', unresolved: [] },
  { v: 27, pdf: 114, closePdf: 115, start: 'इदानीं वर्णाश्रमविभक्त (shared)', end: 'ापादयन्तीत्यर्थः ॥ २७ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.25–27 joint exposition (see 4.25).', unresolved: [] },
  { v: 28, pdf: 115, closePdf: 118, start: 'एवं यज्ञानां', end: 'भवति ॥', contains: { gloss: true, quotation: true, crossReference: true, summary: true }, spans: [], passages: [], remaining: 'Three-verse joint exposition (28–30; āśrama yajña-bhedas with smṛti and Mahābhārata recalls), untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Mahābhārata Śānti-parvan quotations (Janaka-Parāśara saṃvāda etc.) with locator (म. भा. शा. प. ३०२३०): external quotations, retained unresolved per policy, no edge.'] },
  { v: 29, pdf: 116, closePdf: 119, start: 'एवं यज्ञानां (shared exposition)', end: 'वेदितव्यम् ॥ २९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.28–30 joint exposition (see 4.28).', unresolved: [] },
  { v: 30, pdf: 119, closePdf: 120, start: 'एवमनुष्ठा भेदेन (shared exposition)', end: 'भवति ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 4.28–30 joint exposition (see 4.28).', unresolved: [] },
  { v: 31, pdf: 120, closePdf: 120, start: 'यस्तु केवलेन', end: 'भवति ॥ ३१ ॥', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Satyadharma quotation (सत्यधर्मच्युतात्पुंसः … पुनरास्तिकः) with यदुक्तं but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 32, pdf: 120, closePdf: 121, start: 'अथ एतेषां', end: 'प्रयोगः ॥ ३२ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 33, pdf: 121, closePdf: 121, start: 'अथ एतस्य ज्ञानप्रशंसार्थमाह', end: 'भजते ॥ ३३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 34, pdf: 121, closePdf: 122, start: 'एवंविधं च', end: 'जानीहि ॥ ३४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 35, pdf: 122, closePdf: 122, start: 'कीदृशं तत् ज्ञानमिति', end: 'भावयिष्यत्येव ॥ ३५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 36, pdf: 122, closePdf: 122, start: 'युद्धलक्षणे स्वधर्मे', end: 'लंघयिष्यसि ३६', contains: { gloss: true }, spans: [], passages: [], remaining: 'Gloss close prints a bare ३६ (dandas lost in extraction): recorded verbatim. ' + MULA_REMAINING, unresolved: [] },
  { v: 37, pdf: 123, closePdf: 123, start: 'यतः', end: 'इत्यादिना ॥ ३७॥', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Svadharma recall (श्रेयान्स्वधर्मो विगुणः इत्यादिना) with यथोक्तं प्राक् but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 38, pdf: 123, closePdf: 123, start: 'किंच घोरस्य', end: 'रोति ॥ ३८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 39, pdf: 123, closePdf: 124, start: 'तस्य च एवंप्रभावस्य', end: 'प्राप्नोति ॥ ३९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 40, pdf: 124, closePdf: 124, start: 'एत गुणविहीनस्तु', end: 'भविष्यति ॥४०॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 41, pdf: 124, closePdf: 125, start: 'यः पुनरेतव्यतिरिक्तलक्षणस्तं', end: 'कुर्वन्ति ॥ ४१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'Gloss tail on printed p.115 untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 42, pdf: 125, closePdf: 125, start: '‘तस्मात्’ प्रबन्धप्रतिपादितात्', end: 'अर्हसीति ओम् ॥४२॥', contains: { gloss: true, summary: true, closing: true }, spans: ['gita-seg-4.42-gloss', 'gita-ps-4-prasasti'], passages: ['gita-tx-4.42-gloss', 'gita-tx-4-prasasti'], remaining: 'Saṃśaya-ccheda gloss and praśasti verse fully covered in two bounded excerpts.', unresolved: [] },
];

export const CHAPTER4_COMMENTARY_INVENTORY: Chapter4InventoryRow[] = SPECS.map((s) => ({
  ksts: `4.${s.v}`,
  repoUnit: `4.${s.v}`,
  pdf: s.pdf,
  folio: s.pdf - 10,
  closePdf: s.closePdf,
  commentaryStart: s.start,
  commentaryEnd: s.end,
  crossesPage: s.closePdf !== s.pdf,
  crossesVerseBoundary:
    [1, 2, 3].includes(s.v) ||
    s.v === 8 ||
    [22, 26, 27, 30].includes(s.v) ||
    s.v === 42,
  contains: C(s.contains),
  spanIds: s.spans,
  passageIds: s.passages,
  remaining: s.remaining ?? MULA_REMAINING,
  unresolved: s.unresolved ?? [],
}));

/** Row lookup by KSTS verse number (`4.1`–`4.42`). */
export function chapter4InventoryForKsts(ksts: string): Chapter4InventoryRow | undefined {
  return CHAPTER4_COMMENTARY_INVENTORY.find((r) => r.ksts === ksts);
}

/**
 * Chapter-4 source frame: non-verse matter. The edition prints no
 * philosophical chapter title (only अथ चतुर्थोऽध्यायः), so none is
 * recorded; the reader's English section titles remain project metadata.
 * Print carries no separate chapter-4 upasaṃhāra sentence (contrast
 * Chapters 1–2): the KSTS-4.42 gloss closes the chapter directly.
 */
export interface Chapter4FrameItem {
  id: string;
  kind: 'opening' | 'authorial-verse' | 'colophon';
  /** PDF pages spanned (inclusive). */
  pdfStart: number;
  pdfEnd: number;
  /** Boundary words in print (opening → close). */
  boundaries: string;
  /** Span records evidencing this item (empty when locator-only). */
  spanIds: string[];
  /** Transcribed passages evidencing this item (empty when locator-only). */
  passageIds: string[];
  /** Verification state of the item. */
  status: 'text-layer-reviewed' | 'locator-only';
  /** What stays untranscribed, and why. */
  remaining: string;
  unresolved: string[];
}

export const CHAPTER4_OPENING_MATTER: Chapter4FrameItem[] = [
  {
    id: 'ch4-frame-open',
    kind: 'opening',
    pdfStart: 102,
    pdfEnd: 102,
    boundaries: 'अथ चतुर्थोऽध्यायः → भगवानुवाच',
    spanIds: ['gita-ps-4-avat'],
    passageIds: ['gita-tx-4-avat'],
    status: 'text-layer-reviewed',
    remaining: 'Opening avataraṇikā (abhidheya/prayojana/sambandha) covered by the pre-existing Phase-6 record (claimed by the KSTS-4.1 row).',
    unresolved: [],
  },
];

export const CHAPTER4_CLOSING_MATTER: Chapter4FrameItem[] = [
  {
    id: 'ch4-frame-prasasti',
    kind: 'authorial-verse',
    pdfStart: 125,
    pdfEnd: 125,
    boundaries: 'कल्याणकनिकेतनस्य → चतुर्थः क्रमात्',
    spanIds: ['gita-ps-4-prasasti'],
    passageIds: ['gita-tx-4-prasasti'],
    status: 'text-layer-reviewed',
    remaining: 'Praśasti verse covered in one bounded excerpt (one word unrecovered, marked [?]); the fixed colophon after it stays locator-only by design.',
    unresolved: [],
  },
  {
    id: 'ch4-frame-colophon',
    kind: 'colophon',
    pdfStart: 125,
    pdfEnd: 125,
    boundaries: 'इति श्रीमद्राजानकरामकण्ठविरचिते → चतुर्थोऽध्यायः ॥४॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Fixed colophon recorded as locator only (apparatus-grade metadata, as in Chapters 1–3).',
    unresolved: [],
  },
];

export type Chapter4ApparatusKind = 'folio-mark';

export interface Chapter4ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim. */
  raw: string;
  /** Always null in this chapter (folio fragments carry no siglum). */
  siglum: null;
  kind: Chapter4ApparatusKind;
  /** Row-to-verse attribution: always ambiguous. */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-4 apparatus inventory: no variant footnotes were observed
 * across printed pp.92–115 — only running folio/signature fragments,
 * recorded at page level with verbatim strings. The absence of
 * variants is source description, not an extraction gap.
 */
export const CHAPTER4_APPARATUS: Chapter4ApparatusItem[] = [
  { id: 'gita-app-4-107-1', pdf: 107, folio: 97, raw: '१३ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-4-115-1', pdf: 115, folio: 105, raw: '१४ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-4-123-1', pdf: 123, folio: 113, raw: '१५ भग', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function chapter4ApparatusCounts(items: Chapter4ApparatusItem[] = CHAPTER4_APPARATUS): {
  observed: number;
  mapped: number;
  unresolved: number;
} {
  return {
    observed: items.length,
    mapped: items.filter((i) => i.status === 'mapped').length,
    unresolved: items.filter((i) => i.status === 'unresolved').length,
  };
}

/** Coverage gaps: KSTS verses without transcribed source text. */
export function chapter4CoverageGaps(
  rows: Chapter4InventoryRow[] = CHAPTER4_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter4Inventory(
  rows: Chapter4InventoryRow[] = CHAPTER4_COMMENTARY_INVENTORY,
  apparatus: Chapter4ApparatusItem[] = CHAPTER4_APPARATUS,
  opening: Chapter4FrameItem[] = CHAPTER4_OPENING_MATTER,
  closing: Chapter4FrameItem[] = CHAPTER4_CLOSING_MATTER,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  const chapter = GITA_CHAPTERS.find((c) => c.chapter === 4);
  if (!chapter) errors.push('chapter 4 missing from GITA_CHAPTERS');
  if (rows.length !== 42) errors.push(`inventory must cover 42 KSTS verses, found ${rows.length}`);
  const seenKsts = new Set<string>();
  for (const row of rows) {
    if (seenKsts.has(row.ksts)) errors.push(`duplicate inventory KSTS ${row.ksts}`);
    seenKsts.add(row.ksts);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    // Chapter 4 is fully aligned: KSTS, repo unit and vulgate agree.
    if (row.ksts !== row.repoUnit) {
      errors.push(`${row.ksts}: Chapter 4 is aligned — ksts and repoUnit must agree`);
    }
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    if (row.closePdf !== undefined && row.closePdf < row.pdf) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} precedes pdf ${row.pdf}`);
    }
    if (chapter && (row.pdf < chapter.pdfStart || row.pdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: pdf ${row.pdf} outside Chapter-4 span ${chapter.pdfStart}–${chapter.pdfEnd}`);
    }
    if (chapter && (row.closePdf < chapter.pdfStart || row.closePdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} outside Chapter-4 span`);
    }
    // Fabricated-looking source metadata: commentary regions must sit
    // where the verse sits (close textual neighbourhood, never drifting
    // chapters away from the mūla).
    if (row.closePdf - row.pdf > 5) {
      errors.push(`${row.ksts}: commentary span ${row.pdf}–${row.closePdf} implausibly wide`);
    }
    for (const sid of row.spanIds) {
      if (!knownSpans.has(sid)) errors.push(`${row.ksts}: dangling span ${sid}`);
    }
    for (const pid of row.passageIds) {
      const passage = knownPassages.get(pid);
      if (!passage) {
        errors.push(`${row.ksts}: dangling passage ${pid}`);
        continue;
      }
      if (passage.spanId !== undefined && !row.spanIds.includes(passage.spanId)) {
        errors.push(`${row.ksts}: passage ${pid} span ${passage.spanId} not in row spans`);
      }
      for (const ref of passage.ksts || []) {
        if (!parseGitaVerseRef(ref)) errors.push(`${row.ksts}: passage ${pid} invalid KSTS ref ${ref}`);
      }
    }
  }
  // No orphan Chapter-4 spans or passages: every record must be claimed
  // by a verse row or (for chapter-level matter) by the frame tables.
  // The pre-existing 4.1 avataraṇikā record belongs here too (claimed
  // by the KSTS-4.1 row and the opening frame).
  const frameSpanIds = new Set([...opening, ...closing].flatMap((f) => f.spanIds));
  const framePassageIds = new Set([...opening, ...closing].flatMap((f) => f.passageIds));
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('4.'))) continue;
    if (span.ksts.length === 0) {
      if (!frameSpanIds.has(span.id) && !claimedSpans.has(span.id)) {
        errors.push(`unframed Chapter-4 chapter-level span ${span.id}`);
      }
      continue;
    }
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-4 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('4.'))) continue;
    if ((passage.ksts || []).length === 0) {
      if (!framePassageIds.has(passage.id) && !claimedPassages.has(passage.id)) {
        errors.push(`unframed Chapter-4 chapter-level passage ${passage.id}`);
      }
      continue;
    }
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-4 passage ${passage.id}`);
  }
  const seenApp = new Set<string>();
  for (const item of apparatus) {
    if (seenApp.has(item.id)) errors.push(`duplicate apparatus id ${item.id}`);
    seenApp.add(item.id);
    // Attribution is typed `ambiguous`: an apparatus item can never
    // silently acquire determinate verse attribution (tested below).
    if (item.attribution !== 'ambiguous') {
      errors.push(`${item.id}: apparatus attribution must stay ambiguous without collation`);
    }
    if (item.status !== 'mapped' && item.status !== 'unresolved') {
      errors.push(`${item.id}: unknown apparatus status`);
    }
    if (item.kind !== 'folio-mark') {
      errors.push(`${item.id}: Chapter 4 carries folio marks only (no variants observed)`);
    }
    if (chapter && (item.pdf < chapter.pdfStart || item.pdf > chapter.pdfEnd)) {
      errors.push(`${item.id}: pdf ${item.pdf} outside Chapter-4 span`);
    }
    if (item.folio !== item.pdf - 10) {
      errors.push(`${item.id}: folio ${item.folio} is not pdf ${item.pdf} minus 10`);
    }
  }
  return errors;
}
