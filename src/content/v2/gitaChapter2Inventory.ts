import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_CHAPTERS } from './gitaChapters';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 2 Rāmakaṇṭha commentary inventory (Phase 11).
 *
 * A deterministic, machine-readable record of the Chapter-2 source: the
 * chapter frame, one row per KSTS verse (2.1–2.74, including the extras
 * 2.11 and 2.50 with no vulgate counterpart), the observed apparatus,
 * and everything that stays unresolved and why. Print description is
 * fixed source record; transcription references the span and passage
 * tables, never recopies them. `validateChapter2Inventory` keeps the
 * layers reconciled; tests enforce it.
 *
 * Scope honesty: the transmitted commentary is dense word-by-word gloss
 * across PDF pp.27–70. Only the chapter-entry run (opening + KSTS
 * 2.1–2.10), the pre-existing 2.39 tail bridge and the chapter close
 * (upasaṃhāra + KSTS 2.74 gloss + praśasti) are transcribed. Every other
 * verse row is locator-complete (mūla + gloss region placed at printed
 * pages from inspection) with its gloss explicitly untranscribed: the
 * audit exposes these gaps rather than hiding them.
 *
 * Verification honesty: `locator-only` stays locator-only. All thirteen
 * Chapter-2 passages are `text-layer-reviewed`; none claims
 * `page-image-collated` — page images were unavailable. Mūla verses are
 * locator-only throughout (root-text import stays a separate phase).
 *
 * Numbering: KSTS verse markers run 1–74 (extras at 11 and 50); repo
 * 2.1–2.10 align, repo 2.11–2.48 map KSTS 12–49, repo 2.49–2.72 map
 * KSTS 51–74. Gloss-close markers mostly repeat the KSTS number, but
 * the KSTS-2.70 close prints ॥ ६८ ॥ and the KSTS-2.74 close prints
 * ॥ ७२ ॥ (both vulgate numbers): recorded verbatim as unresolved
 * mismatches, never normalised.
 */

export interface Chapter2InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter2InventoryRow {
  /** KSTS verse number within Chapter 2 (1–74). */
  ksts: string;
  /** Repository unit, or null for the KSTS extras (2.11, 2.50). */
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
  contains: Chapter2InventoryContains;
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
  partial: Partial<Chapter2InventoryContains>,
): Chapter2InventoryContains => ({
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

/** KSTS verse → repo unit (null for the extras 2.11 and 2.50). */
export function chapter2RepoUnit(kstsVerse: number): string | null {
  if (kstsVerse === 11 || kstsVerse === 50) return null;
  if (kstsVerse < 11) return `2.${kstsVerse}`;
  if (kstsVerse < 50) return `2.${kstsVerse - 1}`;
  return `2.${kstsVerse - 2}`;
}

interface VerseSpec {
  v: number;
  pdf: number;
  closePdf: number;
  start: string;
  end: string;
  contains: Partial<Chapter2InventoryContains>;
  spans: string[];
  passages: string[];
  remaining?: string;
  unresolved?: string[];
}

// Per-verse record surveyed from the text layer (PDF pp.27–70): region
// pages, boundary words, rhetorical markers, joint markers, quotations
// and footnote pages. Verse-number markers and running heads excluded
// throughout; boundary strings are commentary words, never mūla.
const SPECS: VerseSpec[] = [
  { v: 1, pdf: 27, closePdf: 27, start: 'कचित् षङ्भिः पादैः', end: 'स्पष्टार्थः श्रोकः', contains: { gloss: true }, spans: ['gita-ps-2-avat', 'gita-seg-2.1-sphuta'], passages: ['gita-tx-2-avat', 'gita-tx-2.1-sphuta'], remaining: 'Opening avataraṇikā and the one-line spaṣṭārtha gloss fully covered in two bounded excerpts.', unresolved: [] },
  { v: 2, pdf: 27, closePdf: 28, start: 'यदुवाच भगवांस्तदाह', end: 'उक्तम् (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.2-gloss'], passages: ['gita-tx-2.2-gloss'], remaining: 'Pratīka gloss with the arjuna/tvac-chabda tātparya fully covered in one bounded excerpt (runs to printed p.18).', unresolved: [] },
  { v: 3, pdf: 28, closePdf: 28, start: 'अनेनैव क्रमेण', end: 'योजनीयमिति (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.3-gloss'], passages: ['gita-tx-2.3-gloss'], remaining: 'Pratīka gloss with the garbhīkāra notes fully covered in one bounded excerpt.', unresolved: [] },
  { v: 4, pdf: 28, closePdf: 28, start: 'अथ संप्रति अनाविर्भूत', end: 'सूचितोऽर्जुनेन (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.4-gloss'], passages: ['gita-tx-2.4-gloss'], remaining: 'Arjuna-apology frame with vyākaraṇa notes and the abhiprāya close fully covered in one bounded excerpt.', unresolved: [] },
  { v: 5, pdf: 29, closePdf: 29, start: 'अत आह', end: 'समश्रीयाम् (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.5-gloss'], passages: ['gita-tx-2.5-gloss'], remaining: 'Ata-āha gloss fully covered in one bounded excerpt.', unresolved: [] },
  { v: 6, pdf: 29, closePdf: 29, start: 'किंच', end: 'भवेदिति (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.6-gloss'], passages: ['gita-tx-2.6-gloss'], remaining: 'Kiñca gloss fully covered in one bounded excerpt.', unresolved: ['Mūla marker prints ॥ ६१: excluded with the verse, uncollated (recorded here, not corrected).'] },
  { v: 7, pdf: 29, closePdf: 30, start: 'अथ समरकर्मानुष्ठानं', end: 'व्युत्पादयेति (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.7-gloss'], passages: ['gita-tx-2.7-gloss'], remaining: 'Śiṣya-apology frame fully covered in one bounded excerpt (runs to printed p.20).', unresolved: [] },
  { v: 8, pdf: 30, closePdf: 31, start: 'किंच', end: 'स्यादिति (marker excluded)', contains: { gloss: true }, spans: ['gita-seg-2.8-gloss'], passages: ['gita-tx-2.8-gloss'], remaining: 'Kiñca gloss with the apanodana-kriyā grammar close fully covered in one bounded excerpt (runs to printed p.21).', unresolved: [] },
  { v: 9, pdf: 31, closePdf: 31, start: 'अथ युद्धनिषेध', end: 'व्याख्येयमिति (marker excluded)', contains: { gloss: true, summary: true }, spans: ['gita-seg-2.9-10-joint'], passages: ['gita-tx-2.9-10-joint'], remaining: 'Joint ślokadvaya gloss (gatārtha + nirvacana) fully covered in one bounded excerpt.', unresolved: [] },
  { v: 10, pdf: 31, closePdf: 31, start: 'अथ युद्धनिषेध (shared)', end: 'व्याख्येयमिति (marker excluded)', contains: { gloss: true, summary: true }, spans: ['gita-seg-2.9-10-joint'], passages: ['gita-tx-2.9-10-joint'], remaining: 'Joint ślokadvaya gloss shared with KSTS 2.9 (see there).', unresolved: [] },
  { v: 11, pdf: 31, closePdf: 32, start: 'उपदेशाभावात् संप्रति', end: 'आसूत्रितम् ॥ ११ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart): gloss with bahuvrīhi/tatpuruṣa analysis untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 12, pdf: 32, closePdf: 32, start: 'यत एकान्तविनश्वर', end: 'न अनुशोचन्ति ॥ १२ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 13, pdf: 32, closePdf: 33, start: 'तथाच जीवावस्थायामेव', end: 'उपपद्यते इति ॥ १३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 14, pdf: 33, closePdf: 34, start: 'ननु देहनिष्ठस्य जीवस्य', end: 'व्यवस्थितः ॥ १४ ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 15, pdf: 34, closePdf: 36, start: 'तदनेन मायैकीकृतदेह', end: 'व्यपदेशः कृतः ॥ १५ ॥', contains: { gloss: true, quotation: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Āsaktisāmarthya quotation (आसक्तिसामर्थ्यवशात् … प्रसन्नः) with यदुक्तम् but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 16, pdf: 36, closePdf: 37, start: 'तदेवंस्त्रभावे सत्ये', end: 'भवतीत्यर्थः ॥ १६ ॥', contains: { gloss: true, quotation: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Yasmin-niye verse quotation (यस्मिन्निये तते तन्तौ … विश्वकर्मणि) with उपक्रम्य but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 17, pdf: 37, closePdf: 37, start: 'अथ उपपत्त्युपन्यासपूर्वम्', end: 'प्रतिपद्यन्ते ॥ १७ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 18, pdf: 37, closePdf: 38, start: 'ततश्च तत्त्वतः किं सत्', end: 'प्रभवतीति ॥ १८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 19, pdf: 38, closePdf: 38, start: 'सत्त्वरूपं प्रतिपाद्य', end: 'समाचरेति ॥ १९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 20, pdf: 38, closePdf: 39, start: 'अथ युद्धं नाम परहननरूपतया', end: 'कर्मत्वम् ॥ २० ॥', contains: { gloss: true, objection: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 21, pdf: 39, closePdf: 40, start: 'एते हि विकल्प', end: 'न उक्तः ॥ २१ ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 22, pdf: 40, closePdf: 41, start: 'एवं सकलभावविकाररहितं', end: 'व्यवस्थितः ॥ २२ ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 23, pdf: 41, closePdf: 41, start: 'ननु हननादिना देहविनाशे', end: 'इति ॥ २३ ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 24, pdf: 41, closePdf: 41, start: 'नित्य एव अयम्', end: 'शोषमुपनयति ॥ २४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 25, pdf: 41, closePdf: 42, start: 'छेदादिभिर्विक्रियमाणे शरीरे', end: 'वेदितव्यानि ॥ २५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 26, pdf: 42, closePdf: 42, start: 'तथाच अयम्', end: 'अनुशोचितुमर्हसि ॥ २६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 27, pdf: 42, closePdf: 43, start: 'एवं त्वं मानुष्येण (२।११)', end: 'शोचितुं न अर्हसि ॥ २७ ॥', contains: { gloss: true, quotation: true, crossReference: true, variant: true, summary: true }, spans: [], passages: [], remaining: MULA_REMAINING + ' Records अन्ये तु readings without adopting them.', unresolved: [] },
  { v: 28, pdf: 43, closePdf: 43, start: 'एतमेव जन्ममरणप्रवाहाविच्छेदं', end: 'अनुपपत्तिरेव ॥ २८ ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 29, pdf: 43, closePdf: 44, start: 'अन्यमपि प्रकारं शोकपरिहाराय', end: 'परिदेवनावसरः इति ॥ २९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 30, pdf: 44, closePdf: 45, start: 'इदानीं बहुप्रकार', end: 'भवता भाव्यम् ॥ ३० ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 31, pdf: 45, closePdf: 46, start: 'तदयमत्र निश्चय इत्याह', end: 'अवसर इत्यर्थः ॥ ३१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 32, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Seven-verse saptaloka jointly declared nigadavyākhyāta (no word gloss in print). ' + MULA_REMAINING, unresolved: [] },
  { v: 33, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 34, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 35, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 36, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 37, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 38, pdf: 46, closePdf: 47, start: 'अथ प्रतिपादितोपपत्त्या (shared)', end: 'निगदव्याख्यातम् ॥ ३२-३८ ॥', contains: { summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.32–38 nigada verdict (see 2.32).', unresolved: [] },
  { v: 39, pdf: 47, closePdf: 48, start: 'एवं स्वर्गाद्यनित्यफलहेतु', end: 'व्यवहरन्नाह', contains: { gloss: true, variant: true, summary: true }, spans: ['gita-seg-2.39-tail'], passages: ['gita-tx-2.39-tail'], remaining: 'Verse gloss untranscribed; only the closing samuccaya bridge is transcribed (pre-existing Phase-6 record).', unresolved: [] },
  { v: 40, pdf: 48, closePdf: 49, start: 'इदमात्मादि सत्', end: 'त्यक्ष्यसि ॥ ४० ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 41, pdf: 49, closePdf: 50, start: 'अत एव अस्य कर्मयोगस्य', end: 'अन्तर्भवत्येव ॥ ४१ ॥', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 42, pdf: 50, closePdf: 50, start: 'अस्मिश्च विशुद्धभक्ति', end: 'लभन्ते इति ॥ ४२ ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 43, pdf: 50, closePdf: 52, start: 'एवंविधानां पुरुषाणां', end: 'विधेयतामर्हति ॥ ४५ ॥', contains: { gloss: true, variant: true, summary: true }, spans: [], passages: [], remaining: 'Three-verse joint exposition (43–45) with tātparya, untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 44, pdf: 50, closePdf: 52, start: 'एवंविधानां पुरुषाणां (shared)', end: 'विधेयतामर्हति ॥ ४५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.43–45 joint exposition (see 2.43).', unresolved: [] },
  { v: 45, pdf: 50, closePdf: 52, start: 'एवंविधानां पुरुषाणां (shared)', end: 'विधेयतामर्हति ॥ ४५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.43–45 joint exposition (see 2.43).', unresolved: [] },
  { v: 46, pdf: 52, closePdf: 53, start: 'अतश्च स्वभावतः प्रस्तुत', end: 'आत्मवान् भव ॥ ४६ ॥', contains: { gloss: true, variant: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 47, pdf: 53, closePdf: 54, start: 'नच भोगेश्वर्यप्रसक्तत्वात्', end: 'वेदशास्त्रमिति ॥ ४७ ॥', contains: { gloss: true, objection: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 48, pdf: 54, closePdf: 56, start: 'अथ विजानता सर्वशास्त्रेभ्यो', end: 'उक्तमेव प्राक् ॥ ४८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 49, pdf: 56, closePdf: 57, start: 'यत एवम् अतः', end: 'निष्ठेत्यर्थः ॥ ४९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 50, pdf: 57, closePdf: 57, start: 'अत एव एतद्योगनिष्ठस्य', end: 'मन्यते ॥ ५० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: 'KSTS extra verse (no vulgate counterpart; content carried by adhika.8): gloss untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 51, pdf: 57, closePdf: 58, start: 'अत एवंविधोत्कृष्टबुद्धियुक्तं', end: 'दुराचाराः ॥ ५१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 52, pdf: 58, closePdf: 59, start: 'अत एव तद्विलक्षणस्य', end: 'समाधिरिह ॥ ५२ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 53, pdf: 59, closePdf: 59, start: 'एतमेव अर्थ हेतूपन्यासपूर्व', end: 'सम्बन्धः ॥ ५३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 54, pdf: 59, closePdf: 60, start: 'यदाच एतत् परमदुरवगाहं', end: 'प्रतिपत्स्यसे ॥ ५५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (54–55), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 55, pdf: 59, closePdf: 60, start: 'यदाच एतत् परमदुरवगाहं (shared)', end: 'प्रतिपत्स्यसे ॥ ५५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.54–55 joint exposition (see 2.54).', unresolved: [] },
  { v: 56, pdf: 60, closePdf: 60, start: 'अथ ते तदा मतिः', end: 'वेदितव्यम् ॥ ५६ ॥', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: 'Arjuna sthitaprajña question (praśnatraya analysis), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 57, pdf: 61, closePdf: 62, start: 'यस्य सर्वे समारम्भाः (५०)', end: 'प्रजह्यात् ॥ ५७ ॥', contains: { gloss: true, quotation: true, crossReference: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 58, pdf: 62, closePdf: 62, start: 'यदाच इत्थंभूतः सन्', end: 'उच्यते ॥ ५८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 59, pdf: 62, closePdf: 63, start: 'एवं प्राप्स्यमानसुखदुःख', end: 'उच्यते ॥ ५९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 60, pdf: 63, closePdf: 63, start: 'एवं प्रतिष्ठितप्रज्ञत्वं', end: 'उच्यते ॥ ६० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 61, pdf: 63, closePdf: 64, start: 'अथो विषयेभ्य इन्द्रियसंहारः', end: 'व्याख्येयम् ॥ ६१ ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 62, pdf: 64, closePdf: 65, start: 'एवं विषयपरिहारपरमसमाधेः', end: 'इति ॥ ६३ ॥', contains: { gloss: true, quotation: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (62–63) with gāruḍika-dṛṣṭānta, untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Vasana-viṣayamadhye quotation (वसन्विषयमध्येऽपि … विषयेष्वपि) with यथोक्तं but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 63, pdf: 64, closePdf: 65, start: 'एवं विषयपरिहारपरमसमाधेः (shared)', end: 'इति ॥ ६३ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.62–63 joint exposition (see 2.62).', unresolved: [] },
  { v: 64, pdf: 65, closePdf: 66, start: 'अथ कूर्मोऽङ्गानीव', end: 'उपगच्छतीति ॥ ६४-६५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (64–65; ślokapañcaka head), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 65, pdf: 65, closePdf: 66, start: 'अथ कूर्मोऽङ्गानीव (shared)', end: 'उपगच्छतीति ॥ ६४-६५ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.64–65 joint exposition (see 2.64).', unresolved: [] },
  { v: 66, pdf: 66, closePdf: 67, start: 'संसारिणं पुरुषमुद्दिश्य', end: 'लभते ॥ ६६-६९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Four-verse joint exposition (66–69), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 67, pdf: 66, closePdf: 67, start: 'संसारिणं पुरुषमुद्दिश्य (shared)', end: 'लभते ॥ ६६-६९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.66–69 joint exposition (see 2.66).', unresolved: [] },
  { v: 68, pdf: 66, closePdf: 67, start: 'संसारिणं पुरुषमुद्दिश्य (shared)', end: 'लभते ॥ ६६-६९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.66–69 joint exposition (see 2.66).', unresolved: [] },
  { v: 69, pdf: 66, closePdf: 67, start: 'संसारिणं पुरुषमुद्दिश्य (shared)', end: 'लभते ॥ ६६-६९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 2.66–69 joint exposition (see 2.66).', unresolved: [] },
  { v: 70, pdf: 67, closePdf: 68, start: 'यत एवं', end: 'मन्यते ॥ ६८ ॥ (mismatch)', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['Gloss close prints ॥ ६८ ॥ against the KSTS-७० verse (the vulgate number): recorded verbatim, never normalised; uncollated.'] },
  { v: 71, pdf: 68, closePdf: 68, start: 'अत एव समस्तसंसारि', end: 'निरवधानत्वात् ॥ ७१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 72, pdf: 68, closePdf: 69, start: 'एवं सततमनस्तमित', end: 'इति ॥ ७२ ॥', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Vikārahetau quotation (विकारहेतौ सति … त एव धीराः) with यथोक्तं; its locator extracts as Gujarati-script garbage: unrecoverable, no edge.'] },
  { v: 73, pdf: 69, closePdf: 69, start: 'इत्येवमभिप्रायं प्रकटयितुमाह', end: 'निष्कान्तः इति ॥ ७३ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 74, pdf: 70, closePdf: 70, start: 'एतदन्तेन ग्रन्थेन', end: 'कृतधियाम् ॥', contains: { gloss: true, summary: true, closing: true }, spans: ['gita-ps-2-upasamhara', 'gita-seg-2.74-gloss', 'gita-ps-2-prasasti'], passages: ['gita-tx-2-upasamhara', 'gita-tx-2.74-gloss', 'gita-tx-2-prasasti'], remaining: 'Upasaṃhāra sentence, eṣā-brāhmī gloss and praśasti verse fully covered in three bounded excerpts.', unresolved: ['Gloss close prints ॥ ७२ ॥ against the KSTS-७४ verse (the vulgate number): recorded verbatim in the passage note, never normalised; uncollated.'] },
];

export const CHAPTER2_COMMENTARY_INVENTORY: Chapter2InventoryRow[] = SPECS.map((s) => ({
  ksts: `2.${s.v}`,
  repoUnit: chapter2RepoUnit(s.v),
  pdf: s.pdf,
  folio: s.pdf - 10,
  closePdf: s.closePdf,
  commentaryStart: s.start,
  commentaryEnd: s.end,
  crossesPage: s.closePdf !== s.pdf,
  crossesVerseBoundary:
    s.v === 1 ||
    s.v === 74 ||
    s.v === 39 ||
    [32, 33, 34, 35, 36, 37, 38].includes(s.v) ||
    [44, 45].includes(s.v) ||
    s.v === 55 ||
    s.v === 63 ||
    s.v === 65 ||
    [67, 68, 69].includes(s.v),
  contains: C(s.contains),
  spanIds: s.spans,
  passageIds: s.passages,
  remaining: s.remaining ?? MULA_REMAINING,
  unresolved: s.unresolved ?? [],
}));

/** Row lookup by KSTS verse number (`2.1`–`2.74`). */
export function chapter2InventoryForKsts(ksts: string): Chapter2InventoryRow | undefined {
  return CHAPTER2_COMMENTARY_INVENTORY.find((r) => r.ksts === ksts);
}

/**
 * Chapter-2 source frame: non-verse matter. The edition prints no
 * philosophical chapter title (only अथ द्वितीयोऽध्यायः), so none is
 * recorded; the reader's English section titles remain project metadata.
 */
export interface Chapter2FrameItem {
  id: string;
  kind: 'opening' | 'closing-prose' | 'authorial-verse' | 'colophon';
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

export const CHAPTER2_OPENING_MATTER: Chapter2FrameItem[] = [
  {
    id: 'ch2-frame-open',
    kind: 'opening',
    pdfStart: 27,
    pdfEnd: 27,
    boundaries: 'अथ द्वितीयोऽध्यायः → संजय उवाच',
    spanIds: ['gita-ps-2-avat'],
    passageIds: ['gita-tx-2-avat'],
    status: 'text-layer-reviewed',
    remaining: 'Opening avataraṇikā fully covered in one bounded excerpt (verse 2.1 excluded).',
    unresolved: [],
  },
];

export const CHAPTER2_CLOSING_MATTER: Chapter2FrameItem[] = [
  {
    id: 'ch2-frame-upasamhara',
    kind: 'closing-prose',
    pdfStart: 70,
    pdfEnd: 70,
    boundaries: 'एतदन्तेन ग्रन्थेन → उपसंहरन्नाह',
    spanIds: ['gita-ps-2-upasamhara'],
    passageIds: ['gita-tx-2-upasamhara'],
    status: 'text-layer-reviewed',
    remaining: 'Upasaṃhāra sentence fully covered in one bounded excerpt.',
    unresolved: [
      'xref: Saptadaśa-adhyāya back-reference (सप्तदशाध्यायप्रदर्शित) without verse locator: retained in text as unresolved source evidence, no edge.',
    ],
  },
  {
    id: 'ch2-frame-prasasti',
    kind: 'authorial-verse',
    pdfStart: 70,
    pdfEnd: 70,
    boundaries: 'द्वितीयेऽध्यायेऽस्मिन् → कृतधियाम् ॥',
    spanIds: ['gita-ps-2-prasasti'],
    passageIds: ['gita-tx-2-prasasti'],
    status: 'text-layer-reviewed',
    remaining: 'Praśasti verse fully covered in one bounded excerpt; the fixed colophon after it stays locator-only by design.',
    unresolved: [],
  },
  {
    id: 'ch2-frame-colophon',
    kind: 'colophon',
    pdfStart: 70,
    pdfEnd: 70,
    boundaries: 'इति श्रीमद्राजानकरामकण्ठविरचिते → द्वितीयोऽध्यायः ॥ २ ॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Fixed colophon recorded as locator only (apparatus-grade metadata, as in Chapters 1 and 13).',
    unresolved: [],
  },
];

export type Chapter2ApparatusKind = 'variant' | 'note' | 'folio-mark';

export interface Chapter2ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim (sigla never expanded). */
  raw: string;
  /** Siglum as printed, or null for fragments, notes, marks and out-of-set sigla. */
  siglum: string | null;
  kind: Chapter2ApparatusKind;
  /** Row-to-verse attribution: always ambiguous (call-marks lost in extraction). */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-2 apparatus inventory: every observed footnote, explanatory
 * note and folio fragment across printed pp.17–60, recorded at page
 * level with verbatim strings. Nothing is attached to a verse:
 * attribution stays ambiguous until page-image collation. घ (p.36)
 * and भ (p.59) fall outside the edition witness set GITA_SIGLA and
 * are preserved via null siglum, never expanded or guessed.
 */
export const CHAPTER2_APPARATUS: Chapter2ApparatusItem[] = [
  { id: 'gita-app-2-27-1', pdf: 27, folio: 17, raw: '३ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-2-35-1', pdf: 35, folio: 25, raw: '१ ख० ग० पु० प्रपद्यते तन्नत्विति पाठः ।', siglum: 'ख. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Extraction renders visargas as ०; uncollated.' },
  { id: 'gita-app-2-35-2', pdf: 35, folio: 25, raw: 'इति पाठः ।', siglum: null, kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Truncated fragment; item number and reading head lost in extraction.' },
  { id: 'gita-app-2-35-3', pdf: 35, folio: 25, raw: '२ ख० ग० पु० इवाप्रसन्न', siglum: 'ख. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Truncated fragment (no इति पाठः close in extraction); uncollated.' },
  { id: 'gita-app-2-35-4', pdf: 35, folio: 25, raw: '४ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-2-36-1', pdf: 36, folio: 26, raw: '१ क ग० घ० पु० सुव्यवस्थितत्वं मुक्तलक्षमिति पाठः ।', siglum: null, kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'घ falls outside the witness set (GITA_SIGLA lists only क, ख, ग, पु.); preserved via null siglum, never expanded.' },
  { id: 'gita-app-2-40-1', pdf: 40, folio: 30, raw: '१ ख पु० विशेष्यस्य प्रतीति पाठः', siglum: 'ख. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'No closing danda in extraction; uncollated.' },
  { id: 'gita-app-2-43-1', pdf: 43, folio: 33, raw: '१. क० ग० पु० कैश्चिदनित्यत्वेन अवगम्यमानस्थापि आत्मन इति पाठः ।', siglum: 'क. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Extraction renders visargas as ०; uncollated.' },
  { id: 'gita-app-2-43-2', pdf: 43, folio: 33, raw: '५ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-2-48-1', pdf: 48, folio: 38, raw: '१. ख० ग० पु० युद्धधर्मोपलक्षितेति पाठः ।', siglum: 'ख. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Extraction renders visargas as ०; uncollated.' },
  { id: 'gita-app-2-48-2', pdf: 48, folio: 38, raw: '२ ख० पु० यथा किं कर्म किम कर्मति कर्मतत्त्वं मोक्षकारणतया विज्ञायत इति पाठः ।', siglum: 'ख. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'किम कर्मति retained verbatim; uncollated.' },
  { id: 'gita-app-2-50-1', pdf: 50, folio: 40, raw: '१ ख० पु० तत्तत्स्थानादीति पाठः ।', siglum: 'ख. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Extraction renders visargas as ०; uncollated.' },
  { id: 'gita-app-2-51-1', pdf: 51, folio: 41, raw: '६ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-2-52-1', pdf: 52, folio: 42, raw: '१. क० ग० पु० मार्गान्फलभूतान्प्रतीति पाठः ।', siglum: 'क. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Extraction renders visargas as ०; uncollated.' },
  { id: 'gita-app-2-52-2', pdf: 52, folio: 42, raw: '२ ख० पु० वचनवश्यमानचित्तता मिति पाठः ।', siglum: 'ख. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Head split across the page break in extraction; joined reading retained verbatim; uncollated.' },
  { id: 'gita-app-2-59-1', pdf: 59, folio: 49, raw: '१ ख० भ० पु० प्रतिबद्धाजन्मन इति पाठः ।', siglum: null, kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'भ falls outside the witness set (GITA_SIGLA lists only क, ख, ग, पु.); preserved via null siglum, never expanded.' },
  { id: 'gita-app-2-59-2', pdf: 59, folio: 49, raw: '७ भग', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-2-65-1', pdf: 65, folio: 55, raw: '१ तेभ्यो विषयेभ्यः, तमिन्द्रियाणां संहारम्, अन्यथा अन्येन प्रकारेण प्रतिपादयन्, रागद्वेषविमुक्तेन्द्रियाणां प्रवृत्तिरेव संहार इत्यन्यथात्वमित्यर्थः ।', siglum: null, kind: 'note', attribution: 'ambiguous', status: 'unresolved', note: 'Explanatory footnote on अन्यथा, not a variant reading; no siglum by nature.' },
  { id: 'gita-app-2-67-1', pdf: 67, folio: 57, raw: '८ भग', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function chapter2ApparatusCounts(items: Chapter2ApparatusItem[] = CHAPTER2_APPARATUS): {
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
export function chapter2CoverageGaps(
  rows: Chapter2InventoryRow[] = CHAPTER2_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter2Inventory(
  rows: Chapter2InventoryRow[] = CHAPTER2_COMMENTARY_INVENTORY,
  apparatus: Chapter2ApparatusItem[] = CHAPTER2_APPARATUS,
  opening: Chapter2FrameItem[] = CHAPTER2_OPENING_MATTER,
  closing: Chapter2FrameItem[] = CHAPTER2_CLOSING_MATTER,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  const chapter = GITA_CHAPTERS.find((c) => c.chapter === 2);
  if (!chapter) errors.push('chapter 2 missing from GITA_CHAPTERS');
  if (rows.length !== 74) errors.push(`inventory must cover 74 KSTS verses, found ${rows.length}`);
  const seenKsts = new Set<string>();
  for (const row of rows) {
    if (seenKsts.has(row.ksts)) errors.push(`duplicate inventory KSTS ${row.ksts}`);
    seenKsts.add(row.ksts);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    const verse = Number(row.ksts.split('.')[1]);
    const expectedRepo = chapter2RepoUnit(verse);
    if (row.repoUnit !== expectedRepo) {
      errors.push(`${row.ksts}: repoUnit ${row.repoUnit} breaks the KSTS↔vulgate offset`);
    }
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    if (row.closePdf !== undefined && row.closePdf < row.pdf) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} precedes pdf ${row.pdf}`);
    }
    if (chapter && (row.pdf < chapter.pdfStart || row.pdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: pdf ${row.pdf} outside Chapter-2 span ${chapter.pdfStart}–${chapter.pdfEnd}`);
    }
    if (chapter && (row.closePdf < chapter.pdfStart || row.closePdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} outside Chapter-2 span`);
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
  // No orphan Chapter-2 spans or passages: every record must be claimed
  // by a verse row or (for chapter-level matter) by the frame tables.
  const frameSpanIds = new Set([...opening, ...closing].flatMap((f) => f.spanIds));
  const framePassageIds = new Set([...opening, ...closing].flatMap((f) => f.passageIds));
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('2.'))) continue;
    // The pre-existing 2.39 tail region belongs to this chapter's
    // inventory too (claimed by the KSTS-2.39 row below).
    if (span.ksts.length === 0) {
      if (!frameSpanIds.has(span.id) && !claimedSpans.has(span.id)) {
        errors.push(`unframed Chapter-2 chapter-level span ${span.id}`);
      }
      continue;
    }
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-2 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('2.'))) continue;
    if ((passage.ksts || []).length === 0) {
      if (!framePassageIds.has(passage.id) && !claimedPassages.has(passage.id)) {
        errors.push(`unframed Chapter-2 chapter-level passage ${passage.id}`);
      }
      continue;
    }
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-2 passage ${passage.id}`);
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
    if (!['variant', 'note', 'folio-mark'].includes(item.kind)) {
      errors.push(`${item.id}: unknown apparatus kind`);
    }
    if (chapter && (item.pdf < chapter.pdfStart || item.pdf > chapter.pdfEnd)) {
      errors.push(`${item.id}: pdf ${item.pdf} outside Chapter-2 span`);
    }
    if (item.folio !== item.pdf - 10) {
      errors.push(`${item.id}: folio ${item.folio} is not pdf ${item.pdf} minus 10`);
    }
  }
  return errors;
}
