import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { GITA_CHAPTERS } from './gitaChapters';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 1 Rāmakaṇṭha commentary inventory (Phase 10).
 *
 * A deterministic, machine-readable record of the Chapter-1 source: the
 * chapter frame (title line, mangala verses, upodghāta prose, closing
 * tātparya, colophon), one row per KSTS verse (1.1–1.47, aligned with the
 * vulgate), the observed apparatus, and everything that stays unresolved
 * and why. The print side is fixed source description; the transcription
 * side references the span and passage tables, never recopies them.
 * `validateChapter1Inventory` keeps the layers reconciled; tests enforce it.
 *
 * Source shape (PDF pp.11–26, printed pp.1–16): Rāmakaṇṭha expounds
 * Chapter 1 by purport, not word by word (tātparyataḥ … na tu
 * gauravabhayāt prātipadyena, printed p.16). There is no prātipadika
 * gloss for any verse: six verse-group purports plus the upodghāta frame
 * and the upasaṃhāra/praśasti close ARE the complete commentary. The
 * inventory records this openly instead of inventing verse-level glosses.
 *
 * Verification honesty: `locator-only` stays locator-only. All eleven
 * Chapter-1 passages are `text-layer-reviewed` (human-reviewed token by
 * token against the text layer in this session); none claims
 * `page-image-collated` — page images were unavailable. Mūla verses are
 * locator-only throughout: present in print at the mapped pages, never
 * transcribed (root-text import stays a separate phase by policy; the
 * extraction is too noisy to enshrine — खजन/स्वजन, पांड/पाण्ड,
 * चम्म्/चमूम् and the like are preserved nowhere as readings).
 */

export interface Chapter1InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter1InventoryRow {
  /** KSTS verse number within Chapter 1 (1–47; aligned with the vulgate). */
  ksts: string;
  /** Repository unit (vulgate numbering; identical here). */
  repoUnit: string;
  /** Vulgate verse number (same as the repository unit number). */
  vulgate: string;
  /** PDF page where the commentary region sits. */
  pdf: number;
  /** Printed folio where the commentary region sits. */
  folio: number;
  /** First words of the commentary region in print. */
  commentaryStart: string;
  /** Last words of the commentary region in print. */
  commentaryEnd: string;
  /** Whether the commentary region crosses a PDF page boundary. */
  crossesPage: boolean;
  /** Whether the region shares material across a verse boundary. */
  crossesVerseBoundary: boolean;
  contains: Chapter1InventoryContains;
  /** Span records evidencing this region (never transcription). */
  spanIds: string[];
  /** Transcribed passages evidencing this region (diplomatic text). */
  passageIds: string[];
  /** Prose between the bounded excerpts that stays untranscribed, and why. */
  remaining: string;
  /** Unresolved extraction or attribution issues in this region. */
  unresolved: string[];
}

const C = (
  partial: Partial<Chapter1InventoryContains>,
): Chapter1InventoryContains => ({
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
  'Tātparya group fully covered in the bounded excerpt; no prātipadika gloss exists in print (ruling gita-tx-1.47-gatartha); mūla present in print at the mapped page but untranscribed (locator-only by root-text policy).';

interface GroupSpec {
  span: string;
  passage: string;
  start: string;
  end: string;
}

const GROUPS: Record<string, GroupSpec> = {
  prasna: {
    span: 'gita-seg-1.1-prasna',
    passage: 'gita-tx-1.1-prasna',
    start: '‘धर्मक्षेत्रे’',
    end: 'संजयवाक्यानि',
  },
  sainya: {
    span: 'gita-seg-1.2-19-sainya',
    passage: 'gita-tx-1.2-19-sainya',
    start: '‘दृष्टा तु पांडवानीकम्’',
    end: 'निगदव्याख्यातानि',
  },
  nirupana: {
    span: 'gita-seg-1.20-23-nirupana',
    passage: 'gita-tx-1.20-23-nirupana',
    start: '‘अथ व्यवस्थितान्दृष्ठा’',
    end: 'सुबोधानि',
  },
  sphuta: {
    span: 'gita-seg-1.24-25-sphuta',
    passage: 'gita-tx-1.24-25-sphuta',
    start: 'संजयोक्तान्येव हृषीकेशवाक्यानि',
    end: 'स्फुटार्थीन्येव',
  },
  darsana: {
    span: 'gita-seg-1.26-28-darsana',
    passage: 'gita-tx-1.26-28-darsana',
    start: '‘तत्रापश्यत्स्थितान्पार्थः’',
    end: 'व्यक्तार्थम्',
  },
  mithyajnana: {
    span: 'gita-seg-1.29-46-mithyajnana',
    passage: 'gita-tx-1.29-46-mithyajnana',
    start: '‘दृष्ट्रेमान्स्वजनान्’',
    end: 'निगव्याख्यातान्येव[?]',
  },
  gatartha: {
    span: 'gita-seg-1.47-gatartha',
    passage: 'gita-tx-1.47-gatartha',
    start: '‘एवमुक्त्वा हृषीकेशम्’',
    end: 'प्रातिपद्येन',
  },
};

function groupForVerse(verse: number): GroupSpec {
  if (verse === 1) return GROUPS.prasna;
  if (verse <= 19) return GROUPS.sainya;
  if (verse <= 23) return GROUPS.nirupana;
  if (verse <= 25) return GROUPS.sphuta;
  if (verse <= 28) return GROUPS.darsana;
  if (verse <= 46) return GROUPS.mithyajnana;
  return GROUPS.gatartha;
}

function buildVerseRows(): Chapter1InventoryRow[] {
  return Array.from({ length: 47 }, (_, i) => {
    const verse = i + 1;
    const group = groupForVerse(verse);
    // Commentary sits on printed p.16 (PDF p.26) for every group; the
    // 1.1 row additionally carries the chapter-entry matter opening on
    // printed p.15 (PDF p.25), hence it is recorded at the opening page.
    const pdf = verse === 1 ? 25 : 26;
    const spanIds =
      verse === 1
        ? ['gita-ps-1-upodghata-open', 'gita-ps-1-upodghata-close', 'gita-ps-1-upakrama', group.span]
        : verse === 47
          ? [group.span, 'gita-ps-1-upasamhara', 'gita-ps-1-prasasti']
          : [group.span];
    const passageIds =
      verse === 1
        ? ['gita-tx-1-upodghata-open', 'gita-tx-1-upodghata-close', 'gita-tx-1-upakrama', group.passage]
        : verse === 47
          ? [group.passage, 'gita-tx-1-upasamhara', 'gita-tx-1-prasasti']
          : [group.passage];
    return {
      ksts: `1.${verse}`,
      repoUnit: `1.${verse}`,
      vulgate: `1.${verse}`,
      pdf,
      folio: pdf - 10,
      commentaryStart: group.start,
      commentaryEnd: group.end,
      crossesPage: verse === 1,
      crossesVerseBoundary: true,
      contains: C({ summary: true, closing: verse === 47 }),
      spanIds,
      passageIds,
      remaining: MULA_REMAINING,
      unresolved: [],
    };
  });
}

export const CHAPTER1_COMMENTARY_INVENTORY: Chapter1InventoryRow[] = buildVerseRows();

/** Row lookup by KSTS verse number (`1.1`–`1.47`). */
export function chapter1InventoryForVerse(repoUnit: string): Chapter1InventoryRow | undefined {
  return CHAPTER1_COMMENTARY_INVENTORY.find((r) => r.repoUnit === repoUnit);
}

/**
 * Chapter-1 source frame: everything belonging to the chapter that is
 * not itself a numbered Gītā verse. The edition supplies no philosophical
 * chapter title (only प्रथमोऽध्यायः with the fixed title line), so none
 * is recorded; the reader's English section titles remain project metadata.
 */
export interface Chapter1FrameItem {
  id: string;
  kind: 'title-line' | 'mangala-verse' | 'introductory-prose' | 'closing-prose' | 'authorial-verse' | 'colophon';
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

export const CHAPTER1_OPENING_MATTER: Chapter1FrameItem[] = [
  {
    id: 'ch1-frame-title',
    kind: 'title-line',
    pdfStart: 11,
    pdfEnd: 11,
    boundaries: 'अथ श्रीमद्भगवद्गीता → प्रथमोऽध्यायः',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Title line recorded as locator only; no transcription needed.',
    unresolved: [],
  },
  {
    id: 'ch1-frame-mangala',
    kind: 'mangala-verse',
    pdfStart: 11,
    pdfEnd: 12,
    boundaries: 'सज्योतिस्तिमिरानन्त[?] → कोऽप्यत्र बोध्यो जनः ॥७॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Seven granthakāra mangala verses (numbered ॥१॥–॥७॥) untranscribed: extraction too noisy for text-layer review (खज्योति तितानन्त, तद्रयैव, अवतितीएँ, विधास्से and the like); transcription deferred until page-image collation, never reconstructed.',
    unresolved: [
      'Mangala-verse readings unrecoverable from the text layer alone; no passage, no edge, no conjecture.',
    ],
  },
  {
    id: 'ch1-frame-upodghata',
    kind: 'introductory-prose',
    pdfStart: 12,
    pdfEnd: 21,
    boundaries: 'इह खलु निखिलवेदवेदान्त → तस्य तावत् स्वरूपमुपक्षिप्यते',
    spanIds: ['gita-ps-1-upodghata-open', 'gita-ps-1-upodghata-close'],
    passageIds: ['gita-tx-1-upodghata-open', 'gita-tx-1-upodghata-close'],
    status: 'text-layer-reviewed',
    remaining: 'Only the opening establishment sentence and the mūla-bridge sentence are transcribed; the sarvātman/sarga-bheda body (printed pp.2–11, some thirty quotations and nanu turns) stays untranscribed.',
    unresolved: [
      'xref: Printed (३।२१) disagrees with its quotation (3.22 text न मे पार्थास्ति कर्तव्यं … वर्त एव च कर्मणि): retained unresolved, no edge.',
      'xref: Printed (९।२२) disagrees with its quotation (9.20–21 text त्रैविद्या मां सोमपाः … गतागतं कामकामा लभन्ते): retained unresolved, no edge.',
      'xref: Printed (१३।२०) disagrees with its quotation (12.20 text श्रद्दधाना मत्परमा भक्ताः): retained unresolved, no edge.',
      'xref: Printed (२१४५) fuses its digits across the 2.41–45 cluster quotation: verse attribution stays guesswork, no edge.',
      'xref: Printed (१६।३) is a single locator over the three-verse 16.1–3 quotation (अभयं सत्त्वसंशुद्धिं … भारत): retained unresolved, no edge.',
      'xref: Full 7.4–5 prakṛti quotation (भूमिरापोऽनलो … ययेदं धार्यते जगत्) without a print locator: retained in prose as unresolved source evidence, no edge.',
      'xref: Yasmin-sarvam śloka (यस्मिन्सर्वं यतः सर्वं … तस्मै सर्वात्मने नमः) expounded without work or locator: retained in prose as unresolved source evidence, no edge.',
      'xref: 16.19 pādas (तानहं द्विषतः क्रूरान् … आसुरीष्वेव योनिषु) quoted without their own locator inside the (१६।२०) sentence: retained in prose as unresolved source evidence, no edge.',
    ],
  },
];

export const CHAPTER1_CLOSING_MATTER: Chapter1FrameItem[] = [
  {
    id: 'ch1-frame-upasamhara',
    kind: 'closing-prose',
    pdfStart: 26,
    pdfEnd: 26,
    boundaries: 'एवमयं प्रथमोऽध्यायो → समाप्तः ॥ १ ॥',
    spanIds: ['gita-ps-1-upasamhara'],
    passageIds: ['gita-tx-1-upasamhara'],
    status: 'text-layer-reviewed',
    remaining: 'Upasaṃhāra fully covered in one bounded excerpt.',
    unresolved: [],
  },
  {
    id: 'ch1-frame-prasasti',
    kind: 'authorial-verse',
    pdfStart: 26,
    pdfEnd: 26,
    boundaries: 'योग्यानुग्रहनीतिनाटक → बद्धा दरम्[?] ॥',
    spanIds: ['gita-ps-1-prasasti'],
    passageIds: ['gita-tx-1-prasasti'],
    status: 'text-layer-reviewed',
    remaining: 'Praśasti verse transcribed with its closing pāda marked [?] (see passage note); the fixed colophon after it stays locator-only by design.',
    unresolved: [
      'Praśasti closing pāda (निविड वनातु बद्धा दरम्) unrecovered in extraction; तनोतु बद्धादरम् conjectured but explicitly NOT adopted, uncollated.',
    ],
  },
  {
    id: 'ch1-frame-colophon',
    kind: 'colophon',
    pdfStart: 26,
    pdfEnd: 26,
    boundaries: 'इति श्रीराजानकरामकण्ठविरचिते → प्रथमोऽध्यायः ॥ १ ॥',
    spanIds: [],
    passageIds: [],
    status: 'locator-only',
    remaining: 'Fixed colophon recorded as locator only; no transcription needed (apparatus-grade metadata, as in Chapter 13).',
    unresolved: [],
  },
];

export type Chapter1ApparatusKind = 'variant' | 'table-row' | 'folio-mark';

export interface Chapter1ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim (sigla never expanded). */
  raw: string;
  /** Siglum as printed, or null for fragments/marks. */
  siglum: string | null;
  kind: Chapter1ApparatusKind;
  /** Row-to-verse attribution: always ambiguous (call-marks lost in extraction). */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-1 apparatus inventory: every observed footnote and folio
 * fragment across printed pp.1–16, recorded at page level with verbatim
 * strings. Nothing is attached to a verse: attribution stays ambiguous
 * until page-image collation. No variant-table row for Chapter 1 has
 * been identified (the back-matter table, PDF pp.411–420, is unmapped
 * for this chapter — recorded as a gap, not guessed).
 */
export const CHAPTER1_APPARATUS: Chapter1ApparatusItem[] = [
  { id: 'gita-app-1-11-1', pdf: 11, folio: 1, raw: '१. क. ग. पु. स्वरूपं सर्वेशमिति पाठः ।', siglum: 'क. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-1-13-1', pdf: 13, folio: 3, raw: '१. क. ग. पु. सर्वज्ञमेकमिति पाठः', siglum: 'क. ग. पु.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-1-19-1', pdf: 19, folio: 9, raw: '१. क० ग० ५० ‘प्रवणः’ इति पाठः ।', siglum: null, kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Sigla extract as क० ग० ५० (anusvāras for visargas; ५० unexplained, possibly पु. misread); uncollated, never expanded.' },
  { id: 'gita-app-1-19-2', pdf: 19, folio: 9, raw: '२ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-1-21-1', pdf: 21, folio: 11, raw: '११', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Running-head fragment inside the (४।३९) quotation extraction; excluded from quotation edge gita-xref-066.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function chapter1ApparatusCounts(items: Chapter1ApparatusItem[] = CHAPTER1_APPARATUS): {
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

/** Coverage gaps: repository units without transcribed source text. */
export function chapter1CoverageGaps(
  rows: Chapter1InventoryRow[] = CHAPTER1_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.repoUnit);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter1Inventory(
  rows: Chapter1InventoryRow[] = CHAPTER1_COMMENTARY_INVENTORY,
  apparatus: Chapter1ApparatusItem[] = CHAPTER1_APPARATUS,
  opening: Chapter1FrameItem[] = CHAPTER1_OPENING_MATTER,
  closing: Chapter1FrameItem[] = CHAPTER1_CLOSING_MATTER,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  const chapter = GITA_CHAPTERS.find((c) => c.chapter === 1);
  if (!chapter) errors.push('chapter 1 missing from GITA_CHAPTERS');
  if (rows.length !== 47) errors.push(`inventory must cover 47 KSTS verses, found ${rows.length}`);
  const seenUnits = new Set<string>();
  for (const row of rows) {
    if (seenUnits.has(row.repoUnit)) errors.push(`duplicate inventory unit ${row.repoUnit}`);
    seenUnits.add(row.repoUnit);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    if (row.ksts !== row.repoUnit || row.repoUnit !== row.vulgate) {
      errors.push(`${row.repoUnit}: Chapter 1 is aligned — ksts, repoUnit and vulgate must agree`);
    }
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    if (chapter && (row.pdf < chapter.pdfStart || row.pdf > chapter.pdfEnd)) {
      errors.push(`${row.ksts}: pdf ${row.pdf} outside Chapter-1 span ${chapter.pdfStart}–${chapter.pdfEnd}`);
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
  // No orphan Chapter-1 spans or passages: every record must be claimed.
  // Chapter-level matter carries no KSTS number by nature (ksts []) and is
  // claimed either by its chapter-entry verse row or by the frame tables.
  const frameSpanIds = new Set([...opening, ...closing].flatMap((f) => f.spanIds));
  const framePassageIds = new Set([...opening, ...closing].flatMap((f) => f.passageIds));
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('1.'))) continue;
    if (span.id.startsWith('gita-ps-13') || span.id.startsWith('gita-seg-13')) continue;
    if (span.ksts.length === 0) {
      if (!frameSpanIds.has(span.id) && !claimedSpans.has(span.id)) {
        errors.push(`unframed Chapter-1 chapter-level span ${span.id}`);
      }
      continue;
    }
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-1 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('1.'))) continue;
    if ((passage.ksts || []).length === 0) {
      if (!framePassageIds.has(passage.id) && !claimedPassages.has(passage.id)) {
        errors.push(`unframed Chapter-1 chapter-level passage ${passage.id}`);
      }
      continue;
    }
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-1 passage ${passage.id}`);
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
    if (chapter && (item.pdf < chapter.pdfStart || item.pdf > chapter.pdfEnd)) {
      errors.push(`${item.id}: pdf ${item.pdf} outside Chapter-1 span`);
    }
    if (item.folio !== item.pdf - 10) {
      errors.push(`${item.id}: folio ${item.folio} is not pdf ${item.pdf} minus 10`);
    }
  }
  return errors;
}
