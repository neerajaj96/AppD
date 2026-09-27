import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_CHAPTERS } from './gitaChapters';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 5 Rāmakaṇṭha commentary inventory (Phase 14).
 *
 * A deterministic, machine-readable record of the Chapter-5 source: the
 * chapter frame, one row per KSTS verse (5.1–5.28), the observed
 * apparatus, and everything that stays unresolved and why. Print
 * description is fixed source record; transcription references the span
 * and passage tables, never recopies them. `validateChapter5Inventory`
 * keeps the layers reconciled; tests enforce it.
 *
 * Scope honesty: the transmitted commentary is dense word-by-word gloss
 * across PDF pp.126–144. Only the chapter-entry run (opening + KSTS
 * 5.1–2 glosses) and the chapter close (KSTS 5.28 gloss + praśasti) are
 * transcribed. Every other verse row is locator-complete with its gloss
 * explicitly untranscribed: the audit exposes these gaps rather than
 * hiding them.
 *
 * Verification honesty: `locator-only` stays locator-only. The five new
 * Chapter-5 passages are `text-layer-reviewed`; none claims
 * `page-image-collated` — page images were unavailable. Mūla verses are
 * locator-only throughout (root-text import stays a separate phase). No
 * variant footnotes were observed in this chapter (only folio
 * fragments); the apparatus says so openly.
 *
 * Numbering: KSTS verse markers run 1–28 with no extras; vulgate 5.19
 * has no KSTS counterpart inside this chapter (its text stands as KSTS
 * 6.10, a transposed unit handled by the Chapter-6 inventory). Hence
 * KSTS 1–18 map repo 5.1–5.18 and KSTS 19–28 map repo 5.20–5.29.
 */

export interface Chapter5InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter5InventoryRow {
  /** KSTS verse number within Chapter 5 (1–28). */
  ksts: string;
  /** Repository unit (vulgate numbering; KSTS 19–28 shift by one). */
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
  contains: Chapter5InventoryContains;
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
  partial: Partial<Chapter5InventoryContains>,
): Chapter5InventoryContains => ({
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

/** KSTS verse → repo unit (vulgate 5.19 lives outside this chapter as KSTS 6.10). */
export function chapter5RepoUnit(kstsVerse: number): string {
  if (kstsVerse <= 18) return `5.${kstsVerse}`;
  return `5.${kstsVerse + 1}`;
}

interface VerseSpec {
  v: number;
  pdf: number;
  closePdf: number;
  start: string;
  end: string;
  contains: Partial<Chapter5InventoryContains>;
  spans: string[];
  passages: string[];
  remaining?: string;
  unresolved?: string[];
}

// Per-verse record surveyed from the text layer (PDF pp.126–144):
// region pages, boundary words, rhetorical markers, joint markers and
// quotations. Verse-number markers and running heads excluded
// throughout; boundary strings are commentary words, never mūla.
const SPECS: VerseSpec[] = [
  { v: 1, pdf: 126, closePdf: 126, start: 'अथ द्वितीयाध्यायपरिसमाप्तौ', end: 'ब्रूहि ॥१॥', contains: { gloss: true, quotation: true }, spans: ['gita-ps-5-avat', 'gita-seg-5.1-gloss'], passages: ['gita-tx-5-avat', 'gita-tx-5.1-gloss'], remaining: 'Opening avataraṇikā and the tyāga/svīkāra dilemma gloss fully covered in two bounded excerpts.', unresolved: [] },
  { v: 2, pdf: 126, closePdf: 127, start: 'अथ शब्दविशेषमात्रजनितं', end: 'प्रकृष्यते ॥ २ ॥', contains: { gloss: true }, spans: ['gita-seg-5.2-gloss'], passages: ['gita-tx-5.2-gloss'], remaining: 'Satyam gloss with the phalaśruti comparison fully covered in one bounded excerpt (runs to printed p.117).', unresolved: [] },
  { v: 3, pdf: 127, closePdf: 127, start: 'यथा विशिष्यते, तथा आह', end: 'प्रतिपादयिष्यते च ॥ ३ ॥', contains: { gloss: true, summary: true }, spans: [], passages: ['gita-tx-5.3-sent'], remaining: 'Only the samuccayānuṣṭhātṛ sentence is transcribed (pre-existing Phase-6 record, spanless by design); the tātparya close stays untranscribed.', unresolved: [] },
  { v: 4, pdf: 127, closePdf: 128, start: 'इत्थं च समुच्चिते', end: 'न भवत्येवेति ॥४॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 5, pdf: 128, closePdf: 128, start: 'तदेव इह दृढयितुमाह', end: 'पश्यति ॥५॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 6, pdf: 129, closePdf: 129, start: 'तदाह', end: 'अनुपायत्वादिति ॥ ६ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 7, pdf: 129, closePdf: 131, start: 'कस्मात् योगयुक्तस्यैव', end: 'भजते ॥ ७ ॥', contains: { gloss: true, objection: true, response: true, summary: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 8, pdf: 131, closePdf: 133, start: 'तमेतं कर्मयोगिनः', end: 'उक्तम् ॥ ९ ॥', contains: { gloss: true, quotation: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (8–9) with vṛtti analysis and tātparya, untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Yasmin-sarvam recall (यस्मिन् सर्व इति व्याख्यातस्वरूपस्य …) without locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 9, pdf: 131, closePdf: 133, start: 'तमेतं कर्मयोगिनः (shared)', end: 'उक्तम् ॥ ९ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 5.8–9 joint exposition (see 5.8).', unresolved: [] },
  { v: 10, pdf: 133, closePdf: 133, start: 'इदानीमेतदेव', end: 'कमलदलमिव ॥ १० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 11, pdf: 133, closePdf: 133, start: 'यत एवमतः-', end: 'न कर्मत्यागः ॥ ११ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 12, pdf: 134, closePdf: 134, start: 'स च सङ्गत्यागः', end: 'नियम्यते ॥ १२ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 13, pdf: 134, closePdf: 135, start: 'अथ एवंविधयोः', end: 'कारयति ॥ १३ ॥', contains: { gloss: true, quotation: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: ['xref: Anugītā Vāṅmanasī dialogue (उभे वाड्नसी गत्वा … विषये तव) quoted as मुनिनैव अनुगीतासु भगवद्वचसा without locator: external quotation, retained unresolved per policy, no edge.'] },
  { v: 14, pdf: 136, closePdf: 136, start: 'अत एव परमात्मस्वरूपं', end: 'ाभासयति ॥ १४ ॥', contains: { gloss: true, objection: true, response: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 15, pdf: 136, closePdf: 137, start: 'एवमवभासमानमपि', end: 'उपमानार्थः ॥ १५, १६ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (15–16), untranscribed. ' + MULA_REMAINING, unresolved: [] },
  { v: 16, pdf: 136, closePdf: 137, start: 'एवमवभासमानमपि (shared)', end: 'उपमानार्थः ॥ १५, १६ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 5.15–16 joint exposition (see 5.15).', unresolved: [] },
  { v: 17, pdf: 137, closePdf: 138, start: 'तदेवंविधं यत्', end: 'मोक्षमानुप्नुवन्तीत्यर्थः ॥ १७ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 18, pdf: 138, closePdf: 139, start: 'अथ ईदृशानां', end: 'ाचरन्तीति ॥ १८ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 19, pdf: 139, closePdf: 139, start: 'तामेव समदर्शितां', end: 'उक्तम् ॥ १९ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 20, pdf: 139, closePdf: 140, start: 'ईदृशे च ब्रह्मणि', end: 'व्याप्नोति ॥ २० ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 21, pdf: 140, closePdf: 140, start: 'कथं बाह्यस्पर्शेषु', end: 'सुखमनुभवतीति ॥ २१ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 22, pdf: 140, closePdf: 141, start: 'बुधस्य एवंविधस्य', end: 'सुखीति उक्तम् ॥ २२ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 23, pdf: 141, closePdf: 141, start: 'अत एव तत्स्वरूपमाह', end: 'प्राप्नोति ॥ २३ ।।', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 24, pdf: 141, closePdf: 141, start: 'यस्मात्', end: 'निर्मुक्ता एव ॥ २४ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 25, pdf: 141, closePdf: 142, start: 'एतदेव विशिनष्टि-', end: 'वर्तते ॥ २५ ॥', contains: { gloss: true }, spans: [], passages: [], remaining: MULA_REMAINING, unresolved: [] },
  { v: 26, pdf: 142, closePdf: 143, start: 'ततो नैष्क', end: 'प्रतिपादितः ॥ २७ ॥', contains: { gloss: true, quotation: true, summary: true }, spans: [], passages: [], remaining: 'Two-verse joint exposition (26–27; naiṣka vs karmayogin), untranscribed. ' + MULA_REMAINING, unresolved: ['xref: Cittam-eva quotation (चित्तमेव हि संसारो … कथ्यते) with तदुक्तं but no locator: retained in text as unresolved source evidence, no edge.'] },
  { v: 27, pdf: 142, closePdf: 143, start: 'ततो नैष्क (shared)', end: 'प्रतिपादितः ॥ २७ ॥', contains: { gloss: true, summary: true }, spans: [], passages: [], remaining: 'Shared with the KSTS 5.26–27 joint exposition (see 5.26).', unresolved: [] },
  { v: 28, pdf: 143, closePdf: 144, start: 'सहि', end: 'प्रतिपादितमिति ॥ २८ ॥', contains: { gloss: true, summary: true, closing: true }, spans: ['gita-seg-5.28-gloss', 'gita-ps-5-prasasti'], passages: ['gita-tx-5.28-gloss', 'gita-tx-5-prasasti'], remaining: 'Bhoktṛ/maheśvara/suhṛt gloss and praśasti verse fully covered in two bounded excerpts.', unresolved: [] },
];

export const CHAPTER5_COMMENTARY_INVENTORY: Chapter5InventoryRow[] = SPECS.map((s) => ({
  ksts: `5.${s.v}`,
  repoUnit: chapter5RepoUnit(s.v),
  pdf: s.pdf,
  folio: s.pdf - 10,
  closePdf: s.closePdf,
  commentaryStart: s.start,
  commentaryEnd: s.end,
  crossesPage: s.closePdf !== s.pdf,
  crossesVerseBoundary:
    s.v === 1 ||
    s.v === 28 ||
    [9, 16, 27].includes(s.v),
  contains: C(s.contains),
  spanIds: s.spans,
  passageIds: s.passages,
  remaining: s.remaining ?? MULA_REMAINING,
  unresolved: s.unresolved ?? [],
}));

/** Row lookup by KSTS verse number (`5.1`–`5.28`). */
export function chapter5InventoryForKsts(ksts: string): Chapter5InventoryRow | undefined {
  return CHAPTER5_COMMENTARY_INVENTORY.find((r) => r.ksts === ksts);
}

/**
 * Chapter-5 source frame: non-verse matter. The edition prints no
 * philosophical chapter title (only अथ पञ्चमोऽध्यायः), so none is
 * recorded; the reader's English section titles remain project metadata.
 * Print carries no separate chapter-5 upasaṃhāra sentence (contrast
 * Chapters 1–2): the KSTS-5.28 gloss closes the chapter directly.
 */
export interface Chapter5FrameItem {
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

export const CHAPTER5_OPENING_MATTER: Chapter5FrameItem[] = [
  {
    id: 'ch5-frame-open',
    kind: 'opening',
    pdfStart: 126,
    pdfEnd: 126,
    boundaries: 'अथ पञ्चमोऽध्यायः → अर्जुन उवाच',
    spanIds: ['gita-ps-5-avat'],
    passageIds: ['gita-tx-5-avat'],
    status: 'text-layer-reviewed',
    remaining: 'Opening avataraṇikā with the 3.1/4.41 recalls fully covered in one bounded excerpt (verse 5.1 excluded).',
    unresolved: [],
  },
];

export const CHAPTER5_CLOSING_MATTER: Chapter5FrameItem[] = [
  {
    id: 'ch5-frame-prasasti',
    kind: 'authorial-verse',
    pdfStart: 144,
    pdfEnd: 144,
    boundaries: 'यत्रैकता यमुनया → पञ्चममात्मसिद्ध्यै',
    spanIds: ['gita-ps-5-prasasti'],
    passageIds: ['gita-tx-5-prasasti'],
    status: 'text-layer-reviewed',
    remaining: 'Praśasti verse fully covered in one bounded excerpt; the fixed colophon after it stays locator-only by design.',
    unresolved: [],
  },
  {
    id: 'ch5-frame-colophon',
    kind: 'colophon',
    pdfStart: 144,
    pdfEnd: 144,
    boundaries: 'इति श्रीराजानकरामकण्ठविरचिते → पञ्चमोऽध्यायः ॥ ५ ॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Fixed colophon recorded as locator only (apparatus-grade metadata, as in Chapters 1–4).',
    unresolved: [],
  },
];

export type Chapter5ApparatusKind = 'folio-mark';

export interface Chapter5ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim. */
  raw: string;
  /** Always null in this chapter (folio fragments carry no siglum). */
  siglum: null;
  kind: Chapter5ApparatusKind;
  /** Row-to-verse attribution: always ambiguous. */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-5 apparatus inventory: no variant footnotes were observed
 * across printed pp.116–134 — only running folio/signature fragments,
 * recorded at page level with verbatim strings. The absence of
 * variants is source description, not an extraction gap.
 */
export const CHAPTER5_APPARATUS: Chapter5ApparatusItem[] = [
  { id: 'gita-app-5-131-1', pdf: 131, folio: 121, raw: '१६ भग', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-5-139-1', pdf: 139, folio: 129, raw: '१७ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function chapter5ApparatusCounts(items: Chapter5ApparatusItem[] = CHAPTER5_APPARATUS): {
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
export function chapter5CoverageGaps(
  rows: Chapter5InventoryRow[] = CHAPTER5_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.ksts);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter5Inventory(
  rows: Chapter5InventoryRow[] = CHAPTER5_COMMENTARY_INVENTORY,
  apparatus: Chapter5ApparatusItem[] = CHAPTER5_APPARATUS,
  opening: Chapter5FrameItem[] = CHAPTER5_OPENING_MATTER,
  closing: Chapter5FrameItem[] = CHAPTER5_CLOSING_MATTER,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  const chapter = GITA_CHAPTERS.find((c) => c.chapter === 5);
  if (!chapter) errors.push('chapter 5 missing from GITA_CHAPTERS');
  if (rows.length !== 28) errors.push(`inventory must cover 28 KSTS verses, found ${rows.length}`);
  const seenKsts = new Set<string>();
  for (const row of rows) {
    if (seenKsts.has(row.ksts)) errors.push(`duplicate inventory KSTS ${row.ksts}`);
    seenKsts.add(row.ksts);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    const verse = Number(row.ksts.split('.')[1]);
    const expectedRepo = chapter5RepoUnit(verse);
    if (row.repoUnit !== expectedRepo) {
      errors.push(`${row.ksts}: repoUnit ${row.repoUnit} breaks the KSTS↔vulgate offset`);
    }
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    if (row.closePdf !== undefined && row.closePdf < row.pdf) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} precedes pdf ${row.pdf}`);
    }
    if (chapter && (row.pdf < chapter.pdfStart || row.pdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: pdf ${row.pdf} outside Chapter-5 span ${chapter.pdfStart}–${chapter.pdfEnd}`);
    }
    if (chapter && (row.closePdf < chapter.pdfStart || row.closePdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: closePdf ${row.closePdf} outside Chapter-5 span`);
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
  // No orphan Chapter-5 spans or passages: every record must be claimed
  // by a verse row or (for chapter-level matter) by the frame tables.
  // The pre-existing 5.3 sentence belongs here too (claimed by the
  // KSTS-5.3 row; spanless by design).
  const frameSpanIds = new Set([...opening, ...closing].flatMap((f) => f.spanIds));
  const framePassageIds = new Set([...opening, ...closing].flatMap((f) => f.passageIds));
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('5.'))) continue;
    if (span.ksts.length === 0) {
      if (!frameSpanIds.has(span.id) && !claimedSpans.has(span.id)) {
        errors.push(`unframed Chapter-5 chapter-level span ${span.id}`);
      }
      continue;
    }
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-5 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('5.'))) continue;
    if ((passage.ksts || []).length === 0) {
      if (!framePassageIds.has(passage.id) && !claimedPassages.has(passage.id)) {
        errors.push(`unframed Chapter-5 chapter-level passage ${passage.id}`);
      }
      continue;
    }
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-5 passage ${passage.id}`);
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
      errors.push(`${item.id}: Chapter 5 carries folio marks only (no variants observed)`);
    }
    if (chapter && (item.pdf < chapter.pdfStart || item.pdf > chapter.pdfEnd)) {
      errors.push(`${item.id}: pdf ${item.pdf} outside Chapter-5 span`);
    }
    if (item.folio !== item.pdf - 10) {
      errors.push(`${item.id}: folio ${item.folio} is not pdf ${item.pdf} minus 10`);
    }
  }
  return errors;
}
