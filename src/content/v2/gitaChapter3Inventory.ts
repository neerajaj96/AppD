import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_CHAPTERS } from './gitaChapters';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 3 Rāmakaṇṭha commentary inventory (Phase 12).
 *
 * A deterministic, machine-readable record of the Chapter-3 source: the
 * chapter frame, one row per KSTS verse (3.1–3.48, including the extras
 * 3.38–42 with no vulgate counterpart), the observed apparatus, and
 * everything that stays unresolved and why. Print description is fixed
 * source record; transcription references the span and passage tables,
 * never recopies them. `validateChapter3Inventory` keeps the layers
 * reconciled; tests enforce it.
 *
 * Scope honesty: the transmitted commentary is dense word-by-word gloss
 * across PDF pp.71–101. Only the chapter-entry joint gloss (KSTS
 * 3.1–2), the samuccaya-nirvacana gloss (KSTS 3.3), the
 * upakramya-recall gloss (KSTS 3.22) and the chapter close (KSTS 3.48
 * gloss + praśasti) are transcribed. Every other verse row is
 * locator-complete (mūla + gloss region placed at printed pages from
 * inspection) with its gloss explicitly untranscribed: the audit exposes
 * these gaps rather than hiding them.
 *
 * Verification honesty: `locator-only` stays locator-only. All five
 * Chapter-3 passages are `text-layer-reviewed`; none claims
 * `page-image-collated` — page images were unavailable. Mūla verses are
 * locator-only throughout (root-text import stays a separate phase).
 * No variant footnotes were observed in this chapter (only folio
 * fragments); the apparatus says so openly.
 *
 * Numbering: KSTS verse markers run 1–48 (extras at 38–42, the
 * kāma-cluster answering Arjuna's four questions); repo 3.1–3.37 align,
 * repo 3.38–3.43 map KSTS 43–48.
 */

export interface Chapter3InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter3InventoryRow {
  /** KSTS verse number within Chapter 3 (1–48). */
  ksts: string;
  /** Repository unit, or null for the KSTS extras (3.38–42). */
  repoUnit: string | null;
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
  contains: Chapter3InventoryContains;
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
  partial: Partial<Chapter3InventoryContains>,
): Chapter3InventoryContains => ({
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

/** KSTS verse → repo unit (null for the extras 3.38–42). */
export function chapter3RepoUnit(kstsVerse: number): string | null {
  if (kstsVerse >= 38 && kstsVerse <= 42) return null;
  if (kstsVerse < 38) return `3.${kstsVerse}`;
  return `3.${kstsVerse - 5}`;
}

interface VerseSpec {
  v: number;
  pdf: number;
  closePdf: number;
  start: string;
  end: string;
  contains: Partial<Chapter3InventoryContains>;
  spans: string[];
  passages: string[];
  remaining?: string;
  unresolved?: string[];
}

// Per-verse record surveyed from the text layer (PDF pp.71–101): region
// pages, boundary words, rhetorical markers, joint markers and
// quotations. Verse-number markers and running heads excluded
// throughout; boundary strings are commentary words, never mūla.
const SPECS: VerseSpec[] = [
  { v: 1, pdf: 71, closePdf: 71, start: '“दूरेण ह्यवरं कर्म', end: 'लभेयेति ॥ १-२ ॥', contains: { gloss: true, quotation: true, crossReference: true, summary: true }, spans: ['gita-ps-3-avat', 'gita-seg-3.1-2-joint'], passages: ['gita-tx-3-avat', 'gita-tx-3.1-2-joint'], remaining: 'Joint dilemma gloss (1–2) fully covered in one bounded excerpt; the opening avataraṇikā is the pre-existing Phase-6 record, claimed here and in the frame table.', unresolved: [] },
  { v: 2, pdf: 71, closePdf: 71, start: '“दूरेण ह्यवरं कर्म (shared)', end: 'लभेयेति ॥ १-२ ॥', contains: { gloss: true, summary: true }, spans: ['gita-seg-3.1-2-joint'], passages: ['gita-tx-3.1-2-joint'], remaining: 'Shared with the KSTS 3.1–2 joint gloss (see 3.1).', unresolved: [] },
  { v: 3, pdf: 72, closePdf: 73, start: 'अथ अन्यथैव मयोक्तम्', end: 'उत्पन्नः (marker excluded)', contains: { gloss: true, quotation: true, crossReference: true, summary: true }, spans: ['gita-seg-3.3-gloss'], passages: ['gita-tx-3.3-gloss'], remaining: 'Upālambha turn with sāṅkhya/yoga nirvacana fully covered in one bounded excerpt (runs to printed p.63).', unresolved: ['xref: Printed (३।५३) disagrees with its quotation (2.53 text कर्मजं बुद्धियुक्ता हि …): retained unresolved, no edge.', 'xref: Printed (३।५१) disagrees with its quotation (2.51 text दूरेण ह्यावरं कर्म; possibly misprinted for (२।५१)): retained unresolved, never emended, no edge.'] },
  { v: 4, pdf: 73, closePdf: 74, start: 'अथ मन्यसे', end: 'समासादयति ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 5, pdf: 74, closePdf: 75, start: 'यदि इह ज्ञानरहितात्', end: 'उक्तम् ॥ ५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 6, pdf: 75, closePdf: 76, start: 'एवंच सर्वदेहिनां', end: 'गम्यते ॥ ६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 7, pdf: 76, closePdf: 77, start: 'यस्मिंस्तु समाधौ', end: 'प्रस्तौति ॥ ७ ॥', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 8, pdf: 77, closePdf: 77, start: 'रागद्वेषपरिहारः प्रकरण', end: 'शक्यम् ॥ ८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 9, pdf: 77, closePdf: 78, start: 'इत्थं च कर्मणः', end: 'प्रतिपादितः ॥ ९ ॥', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Yasmin-sarvam śloka (यस्मिन्सर्वं यतः सर्वं ……) expounded with इत्यादिश्लोकव्याख्यातस्वरूपः but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 10, pdf: 79, closePdf: 80, start: 'इदानीं कश्चित् प्रवृत्ति', end: 'भगवद्वाक्यम् ॥ १२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Three-verse joint exposition (10–12) with the prajāpati/bhagavat voice divide, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 11, pdf: 79, closePdf: 80, start: 'इदानीं कश्चित् प्रवृत्ति (shared)', end: 'भगवद्वाक्यम् ॥ १२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.10–12 joint exposition (see 3.10).', unresolved: [] },
  { v: 12, pdf: 79, closePdf: 80, start: 'इदानीं कश्चित् प्रवृत्ति (shared)', end: 'भगवद्वाक्यम् ॥ १२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.10–12 joint exposition (see 3.10).', unresolved: [] },
  { v: 13, pdf: 80, closePdf: 80, start: 'इत्थं प्रजापतिनियमम्', end: 'प्राप्नुवन्तीत्यर्थः ॥ १३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 14, pdf: 80, closePdf: 81, start: 'यस्मात् सर्वमेतदक्षरसंज्ञात्', end: 'स्थितिः ॥ १५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (14–15), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 15, pdf: 80, closePdf: 81, start: 'यस्मात् सर्वमेतदक्षरसंज्ञात् (shared)', end: 'स्थितिः ॥ १५ ॥', contains: { gloss: true, quotation: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.14–15 joint exposition (see 3.14).', unresolved: ['xref: Manu quotation (अग्नौ प्रास्ताहुतिः … ततः प्रजाः) with यथोक्तम् and locator (म. भा. शा. प. ३२५ अ.): external quotation, retained unresolved per policy, no edge.'] },
  { v: 16, pdf: 81, closePdf: 82, start: 'यत एवम् अतः', end: 'जीवितम् ॥ १६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 17, pdf: 82, closePdf: 83, start: 'एवं प्रवृत्तिलक्षणधर्मा', end: 'दुर्निवारत्वात् ॥ १९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Three-verse joint exposition (17–19) with tātparya, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 18, pdf: 82, closePdf: 83, start: 'एवं प्रवृत्तिलक्षणधर्मा (shared)', end: 'दुर्निवारत्वात् ॥ १९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.17–19 joint exposition (see 3.17).', unresolved: [] },
  { v: 19, pdf: 82, closePdf: 83, start: 'एवं प्रवृत्तिलक्षणधर्मा (shared)', end: 'दुर्निवारत्वात् ॥ १९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.17–19 joint exposition (see 3.17).', unresolved: [] },
  { v: 20, pdf: 83, closePdf: 84, start: 'अत्रैव उदाहरणमाह', end: 'अनुष्ठेयमिति ॥२१॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (20–21; 20ab gloss with Mokṣadharma quotes, cd with 21), untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Mokṣadharma/Sulabhā-Janaka quotations (एकस्मिन्नप्यधिष्ठाने …; अकैचन्ये न मोक्षोऽस्ति …) with locator (म. भा. शा. प. ३२५ अ.): external quotations, retained unresolved per policy, no edge.'] },
  { v: 21, pdf: 83, closePdf: 84, start: 'अत्रैव उदाहरणमाह (shared)', end: 'अनुष्ठेयमिति ॥२१॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.20–21 joint exposition (see 3.20).', unresolved: [] },
  { v: 22, pdf: 85, closePdf: 85, start: 'अत्र आत्मानमेव', end: 'प्रतिपादितवान् (marker excluded)', contains: { gloss: true, quotation: true, crossReference: true }, spans: ['gita-seg-3.22-gloss'], passages: ['gita-tx-3.22-gloss'], remaining: 'Ātma-udāharaṇa gloss with the 3.17/3.19 upakramya recall fully covered in one bounded excerpt.', unresolved: [] },
  { v: 23, pdf: 85, closePdf: 85, start: 'अथ तत्त्वज्ञोऽपि', end: 'अनुसरेयुः ॥ २३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 24, pdf: 86, closePdf: 86, start: 'किंच अत इत्याह', end: 'भवेत् ॥ २४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 25, pdf: 86, closePdf: 87, start: 'अतः', end: 'व्यपैति ॥ २५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 26, pdf: 87, closePdf: 87, start: 'अयोग्यस्य तत्त्वज्ञानोपदेशो', end: 'प्रख्यापनेन ॥ २६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 27, pdf: 88, closePdf: 90, start: 'इत्थं परमेश्वरेच्छानियमित', end: 'व्याख्यातम् ॥ २८ ॥', contains: { gloss: true, quotation: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (27–28) with guṇa/karma-vibhāga, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 28, pdf: 88, closePdf: 90, start: 'इत्थं परमेश्वरेच्छानियमित (shared)', end: 'व्याख्यातम् ॥ २८ ॥', contains: { gloss: true, quotation: true, crossReference: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.27–28 joint exposition (see 3.27).', unresolved: ['xref: Muktasaṅgo quotation (मुक्तसंगोऽनहंवादी …) with a Gujarati-garbled locator: unrecoverable, no edge.'] },
  { v: 29, pdf: 90, closePdf: 91, start: 'एवं प्रबुद्धाप्रबुद्धयोः', end: 'अनुतिष्ठेदिति ॥ २९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 30, pdf: 91, closePdf: 91, start: 'लोकसंग्रहापेक्षया', end: 'अनुतिष्ठेति ॥ ३० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 31, pdf: 92, closePdf: 92, start: 'एतावता ग्रन्थेन प्रायः', end: 'नास्त्येव ॥ ३२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (31–32; bodha/abodha-phala), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 32, pdf: 92, closePdf: 92, start: 'एतावता ग्रन्थेन प्रायः (shared)', end: 'नास्त्येव ॥ ३२ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 3.31–32 joint exposition (see 3.31).', unresolved: [] },
  { v: 33, pdf: 92, closePdf: 93, start: 'इदानीमुक्तमेव अर्थ', end: 'भविष्यति ॥ ३३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 34, pdf: 93, closePdf: 94, start: 'इत्थमपरिहार्य कर्मणि', end: 'प्रभवत्येव ॥ ३४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 35, pdf: 94, closePdf: 94, start: 'तदेवंगुणोपपत्तिवशात्', end: 'हेतुत्वात् ॥ ३५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 36, pdf: 95, closePdf: 95, start: 'एवमात्मज्ञाननिष्ठतया', end: 'अनुतिष्ठति ॥ ३६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'Arjuna kāma-praśna, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 37, pdf: 95, closePdf: 96, start: 'अत्र उत्तरं भगवानुवाच', end: 'पापमाचरति ॥ ३७ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 38, pdf: 96, closePdf: 96, start: 'अथ तस्य वैतत्येन', end: 'ब्रूहि ॥३८॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (Arjuna four-question verse; no vulgate counterpart): gloss untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 39, pdf: 96, closePdf: 97, start: 'अत्र प्रश्नचतुष्ये क्रमेण', end: 'व्याख्यातम्', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart): praśna-answers gloss untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Indriyāṇi-parāṇi quotation (इन्द्रियाणि पराण्याहुः ।) with a Gujarati-garbled locator (३।४७): unrecoverable, no edge.'] },
  { v: 40, pdf: 96, closePdf: 97, start: 'कामक्रोधमयः (shared)', end: 'उक्तं भवति', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart): answer shared with the 39–41 gloss, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 41, pdf: 96, closePdf: 98, start: 'कामक्रोधमयः (shared)', end: 'पापमाचरति ॥ ४१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart): answer shared with the 39–41 gloss, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 42, pdf: 98, closePdf: 98, start: 'अर्जुनप्रश्नं विनिर्णीय', end: 'स्पष्टार्थम् ॥४२॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart): gloss untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 43, pdf: 98, closePdf: 99, start: 'तेन अस्य क्षेत्रज्ञस्य', end: 'प्रतिपादितम् ॥ ४३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 44, pdf: 99, closePdf: 99, start: 'यद्यपि सर्वशक्तिनिरोधकोऽयम्', end: 'आवृता इति तात्पर्यम् ॥ ४४ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 45, pdf: 99, closePdf: 100, start: 'अथ किमधिष्ठाय', end: 'युनक्ति ॥ ४५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 46, pdf: 100, closePdf: 100, start: 'तदयमेवंविधः शत्रुः', end: 'तिरस्कुरु ॥ ४६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 47, pdf: 100, closePdf: 101, start: 'एष च परमसूक्ष्मत्वात्', end: 'शक्यते ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'Gloss tail on printed p.91 untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 48, pdf: 101, closePdf: 101, start: '‘एवं’ यथोक्तप्रकारेण', end: 'अर्हसीति ओम् ॥४८॥', contains: { gloss: true, summary: true, closing: true }, spans: ['gita-seg-3.48-gloss', 'gita-ps-3-prasasti'], passages: ['gita-tx-3.48-gloss', 'gita-tx-3-prasasti'], remaining: 'Kāma-vadha gloss and praśasti verse fully covered in two bounded excerpts.', unresolved: [] },
];

export const CHAPTER3_COMMENTARY_INVENTORY: Chapter3InventoryRow[] = SPECS.map((s) => ({
  ksts: `3.${s.v}`,
  repoUnit: chapter3RepoUnit(s.v),
  pdf: s.pdf,
  folio: s.pdf - 10,
  closePdf: s.closePdf,
  commentaryStart: s.start,
  commentaryEnd: s.end,
  crossesPage: s.closePdf !== s.pdf,
  crossesVerseBoundary:
    s.v === 1 ||
    s.v === 2 ||
    s.v === 48 ||
    [11, 12].includes(s.v) ||
    [18, 19].includes(s.v) ||
    s.v === 21 ||
    s.v === 32,
  contains: C(s.contains),
  spanIds: s.spans,
  passageIds: s.passages,
  remaining: s.remaining ?? MULA_REMAINING,
  unresolved: s.unresolved ?? [],
}));

/** Row lookup by KSTS verse number (`3.1`–`3.48`). */
export function chapter3InventoryForKsts(ksts: string): Chapter3InventoryRow | undefined {
  return CHAPTER3_COMMENTARY_INVENTORY.find((r) => r.ksts === ksts);
}

/**
 * Chapter-3 source frame: non-verse matter. The edition prints no
 * philosophical chapter title (only अथ तृतीयोऽध्यायः), so none is
 * recorded; the reader's English section titles remain project metadata.
 * Print carries no separate chapter-3 upasaṃhāra sentence (contrast
 * Chapters 1–2): the KSTS-3.48 gloss closes the chapter directly.
 */
export interface Chapter3FrameItem {
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

export const CHAPTER3_OPENING_MATTER: Chapter3FrameItem[] = [
  {
    id: 'ch3-frame-open',
    kind: 'opening',
    pdfStart: 71,
    pdfEnd: 71,
    boundaries: 'अथ तृतीयोऽध्यायः → भगवन्तमर्जुन उवाच',
    spanIds: ['gita-ps-3-avat'],
    passageIds: ['gita-tx-3-avat'],
    status: 'text-layer-reviewed',
    remaining: 'Opening avataraṇikā covered by the pre-existing Phase-6 record (claimed by the KSTS-3.1 row).',
    unresolved: [],
  },
];

export const CHAPTER3_CLOSING_MATTER: Chapter3FrameItem[] = [
  {
    id: 'ch3-frame-prasasti',
    kind: 'authorial-verse',
    pdfStart: 101,
    pdfEnd: 101,
    boundaries: 'विज्ञानतस्वतपनी → विधिवत्तृतीयः',
    spanIds: ['gita-ps-3-prasasti'],
    passageIds: ['gita-tx-3-prasasti'],
    status: 'text-layer-reviewed',
    remaining: 'Praśasti verse covered in one bounded excerpt (opening word unrecovered, marked [?]); the fixed colophon after it stays locator-only by design.',
    unresolved: [],
  },
  {
    id: 'ch3-frame-colophon',
    kind: 'colophon',
    pdfStart: 101,
    pdfEnd: 101,
    boundaries: 'इति श्रीमद्राजानकरामकण्ठविरचिते → तृतीयोऽध्यायः ॥ ३ ॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Fixed colophon recorded as locator only (apparatus-grade metadata, as in Chapters 1–2).',
    unresolved: [],
  },
];

export type Chapter3ApparatusKind = 'folio-mark';

export interface Chapter3ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim. */
  raw: string;
  /** Always null in this chapter (folio fragments carry no siglum). */
  siglum: null;
  kind: Chapter3ApparatusKind;
  /** Row-to-verse attribution: always ambiguous. */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-3 apparatus inventory: no variant footnotes were observed
 * across printed pp.61–91 — only running folio/signature fragments,
 * recorded at page level with verbatim strings. The absence of
 * variants is source description, not an extraction gap (the variant
 * sigla क/ख/ग/पु appear nowhere in this span).
 */
export const CHAPTER3_APPARATUS: Chapter3ApparatusItem[] = [
  { id: 'gita-app-3-75-1', pdf: 75, folio: 65, raw: '९ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-3-83-1', pdf: 83, folio: 73, raw: '१० भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-3-91-1', pdf: 91, folio: 81, raw: '११ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-3-99-1', pdf: 99, folio: 89, raw: '१२ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function chapter3ApparatusCounts(items: Chapter3ApparatusItem[] = CHAPTER3_APPARATUS): {
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
export function chapter3CoverageGaps(
  rows: Chapter3InventoryRow[] = CHAPTER3_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter3Inventory(
  rows: Chapter3InventoryRow[] = CHAPTER3_COMMENTARY_INVENTORY,
  apparatus: Chapter3ApparatusItem[] = CHAPTER3_APPARATUS,
  opening: Chapter3FrameItem[] = CHAPTER3_OPENING_MATTER,
  closing: Chapter3FrameItem[] = CHAPTER3_CLOSING_MATTER,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  const chapter = GITA_CHAPTERS.find((c) => c.chapter === 3);
  if (!chapter) errors.push('chapter 3 missing from GITA_CHAPTERS');
  if (rows.length !== 48) errors.push(`inventory must cover 48 KSTS verses, found ${rows.length}`);
  const seenKsts = new Set<string>();
  for (const row of rows) {
    if (seenKsts.has(row.ksts)) errors.push(`duplicate inventory KSTS ${row.ksts}`);
    seenKsts.add(row.ksts);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    const verse = Number(row.ksts.split('.')[1]);
    const expectedRepo = chapter3RepoUnit(verse);
    if (row.repoUnit !== expectedRepo) {
      errors.push(`${row.ksts}: repoUnit ${row.repoUnit} breaks the KSTS↔vulgate offset`);
    }
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    if (row.closePdf !== undefined && row.closePdf < row.pdf) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} precedes pdf ${row.pdf}`);
    }
    if (chapter && (row.pdf < chapter.pdfStart || row.pdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: pdf ${row.pdf} outside Chapter-3 span ${chapter.pdfStart}–${chapter.pdfEnd}`);
    }
    if (chapter && (row.closePdf < chapter.pdfStart || row.closePdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} outside Chapter-3 span`);
    }
    // Fabricated-looking source metadata: commentary regions must sit
    // where the verse sits (close textual neighbourhood, never drifting
    // chapters away from the mūla).
    if (row.closePdf - row.pdf > 3) {
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
  // No orphan Chapter-3 spans or passages: every record must be claimed
  // by a verse row or (for chapter-level matter) by the frame tables.
  // The pre-existing 3.1 avataraṇikā record belongs here too (claimed
  // by the KSTS-3.1 row and the opening frame).
  const frameSpanIds = new Set([...opening, ...closing].flatMap((f) => f.spanIds));
  const framePassageIds = new Set([...opening, ...closing].flatMap((f) => f.passageIds));
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('3.'))) continue;
    if (span.ksts.length === 0) {
      if (!frameSpanIds.has(span.id) && !claimedSpans.has(span.id)) {
        errors.push(`unframed Chapter-3 chapter-level span ${span.id}`);
      }
      continue;
    }
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-3 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('3.'))) continue;
    if ((passage.ksts || []).length === 0) {
      if (!framePassageIds.has(passage.id) && !claimedPassages.has(passage.id)) {
        errors.push(`unframed Chapter-3 chapter-level passage ${passage.id}`);
      }
      continue;
    }
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-3 passage ${passage.id}`);
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
      errors.push(`${item.id}: Chapter 3 carries folio marks only (no variants observed)`);
    }
    if (chapter && (item.pdf < chapter.pdfStart || item.pdf > chapter.pdfEnd)) {
      errors.push(`${item.id}: pdf ${item.pdf} outside Chapter-3 span`);
    }
    if (item.folio !== item.pdf - 10) {
      errors.push(`${item.id}: folio ${item.folio} is not pdf ${item.pdf} minus 10`);
    }
  }
  return errors;
}
