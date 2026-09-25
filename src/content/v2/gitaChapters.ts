/**
 * Bhagavad Gītā chapter-level source structure (KSTS No. LXIV, 1943).
 *
 * Hand-verified against the inspected file: every chapter opens
 * `अथ Xोऽध्यायः` with avatāraṇikā prose and closes with an authorial
 * verse plus the fixed colophon (chapter NUMBER only — the edition
 * supplies no philosophical chapter titles, so none are recorded here;
 * the reader's English section titles remain project metadata).
 * Printed folios equal PDF pages minus ten (`ksts64PrintedFolio`).
 */

export interface GitaChapter {
  /** 1–18. */
  chapter: number;
  /** PDF pages spanned (inclusive): opening line through colophon. */
  pdfStart: number;
  pdfEnd: number;
  /** Printed folios spanned (inclusive). */
  printedStart: number;
  printedEnd: number;
  /** KSTS verse numbers, inclusive (Kashmir numbering, not vulgate). */
  kstsFirst: number;
  kstsLast: number;
  /** Canonical repo range, e.g. `1.1–1.47` (vulgate numbering). */
  repoFirst: string;
  repoLast: string;
  /** Numbering relationship to the canonical (vulgate) sequence. */
  numberingNote?: string;
  /** KSTS-numbered verses with no canonical counterpart (extras). */
  extraVerses?: number[];
  /** Vulgate verses with no KSTS counterpart. */
  absentVerses?: string[];
}

export const GITA_CHAPTERS: GitaChapter[] = [
  { chapter: 1, pdfStart: 11, pdfEnd: 26, printedStart: 1, printedEnd: 16, kstsFirst: 1, kstsLast: 47, repoFirst: '1.1', repoLast: '1.47' },
  { chapter: 2, pdfStart: 27, pdfEnd: 70, printedStart: 17, printedEnd: 60, kstsFirst: 1, kstsLast: 74, repoFirst: '2.1', repoLast: '2.72', numberingNote: 'KSTS has two extra verses (11, 50); repo 2.11–2.48 map to KSTS 12–49, repo 2.49–2.72 to KSTS 51–74.', extraVerses: [11, 50] },
  { chapter: 3, pdfStart: 71, pdfEnd: 101, printedStart: 61, printedEnd: 91, kstsFirst: 1, kstsLast: 48, repoFirst: '3.1', repoLast: '3.43', numberingNote: 'Five extra verses (38–42, the kāma-cluster expansion, also in the appendix); repo 3.38–3.43 map to KSTS 43–48.', extraVerses: [38, 39, 40, 41, 42] },
  { chapter: 4, pdfStart: 102, pdfEnd: 125, printedStart: 92, printedEnd: 115, kstsFirst: 1, kstsLast: 42, repoFirst: '4.1', repoLast: '4.42' },
  { chapter: 5, pdfStart: 126, pdfEnd: 144, printedStart: 116, printedEnd: 134, kstsFirst: 1, kstsLast: 28, repoFirst: '5.1', repoLast: '5.29', numberingNote: 'Vulgate 5.19 (इहैव तैर्जितः) is absent in KSTS ch. 5; its text stands as KSTS 6.10. Repo 5.20–5.29 map to KSTS 19–28.', absentVerses: ['5.19'] },
  { chapter: 6, pdfStart: 145, pdfEnd: 167, printedStart: 135, printedEnd: 157, kstsFirst: 1, kstsLast: 49, repoFirst: '6.1', repoLast: '6.47', numberingNote: 'KSTS 6.10 carries the vulgate-5.19 text; KSTS 6.38–6.39 recombine vulgate 6.37 with extra pādas (appendix); repo 6.37 spans KSTS 38–39.', extraVerses: [39] },
  { chapter: 7, pdfStart: 168, pdfEnd: 184, printedStart: 158, printedEnd: 174, kstsFirst: 1, kstsLast: 30, repoFirst: '7.1', repoLast: '7.30', numberingNote: 'KSTS 7.24 is printed parenthesised with the footnote नायं व्याख्यातः क्षेपकत्वात् (marked interpolation, uncommented).' },
  { chapter: 8, pdfStart: 185, pdfEnd: 206, printedStart: 175, printedEnd: 196, kstsFirst: 1, kstsLast: 28, repoFirst: '8.1', repoLast: '8.28' },
  { chapter: 9, pdfStart: 207, pdfEnd: 228, printedStart: 197, printedEnd: 218, kstsFirst: 1, kstsLast: 35, repoFirst: '9.1', repoLast: '9.34', numberingNote: 'KSTS 9.7 (एवं हि सर्वभूतेषु, also appendix) is extra; repo 9.7–9.34 map to KSTS 8–35.', extraVerses: [7] },
  { chapter: 10, pdfStart: 229, pdfEnd: 250, printedStart: 219, printedEnd: 240, kstsFirst: 1, kstsLast: 42, repoFirst: '10.1', repoLast: '10.42' },
  { chapter: 11, pdfStart: 251, pdfEnd: 274, printedStart: 241, printedEnd: 264, kstsFirst: 1, kstsLast: 60, repoFirst: '11.1', repoLast: '11.55', numberingNote: 'Extras at 28, 47, 48, 49, 50; vulgate 11.46 absent; 11.39 spans KSTS 40–41 and 11.40 spans 41–42 (recombined with extra pādas); several second halves print unnumbered.', extraVerses: [28, 47, 48, 49, 50], absentVerses: ['11.46'] },
  { chapter: 12, pdfStart: 275, pdfEnd: 285, printedStart: 265, printedEnd: 275, kstsFirst: 1, kstsLast: 20, repoFirst: '12.1', repoLast: '12.20' },
  { chapter: 13, pdfStart: 286, pdfEnd: 312, printedStart: 276, printedEnd: 302, kstsFirst: 1, kstsLast: 34, repoFirst: '13.1', repoLast: '13.35', numberingNote: 'No Arjuna opening question in KSTS (34 verses from इदं शरीरम् as 13.1); repo 13.1 is vulgate-only, repo 13.2–13.35 map to KSTS 1–34.', absentVerses: ['13.1 (KSTS; = vulgate 13.1 question)'] },
  { chapter: 14, pdfStart: 313, pdfEnd: 327, printedStart: 303, printedEnd: 317, kstsFirst: 1, kstsLast: 27, repoFirst: '14.1', repoLast: '14.27' },
  { chapter: 15, pdfStart: 328, pdfEnd: 344, printedStart: 318, printedEnd: 334, kstsFirst: 1, kstsLast: 20, repoFirst: '15.1', repoLast: '15.20' },
  { chapter: 16, pdfStart: 345, pdfEnd: 357, printedStart: 335, printedEnd: 347, kstsFirst: 1, kstsLast: 24, repoFirst: '16.1', repoLast: '16.24' },
  { chapter: 17, pdfStart: 358, pdfEnd: 371, printedStart: 348, printedEnd: 361, kstsFirst: 1, kstsLast: 28, repoFirst: '17.1', repoLast: '17.28' },
  { chapter: 18, pdfStart: 372, pdfEnd: 415, printedStart: 362, printedEnd: 405, kstsFirst: 1, kstsLast: 79, repoFirst: '18.1', repoLast: '18.78', numberingNote: 'Vulgate 18.78 is split across KSTS 78 (ab) and 79 (cd); KSTS 18.61/62 number only their first halves (Kashmir readings हृद्येष, मत्प्रसादात्परां सिद्धिं), seconds print unnumbered.' },
];

/** Chapters in canonical order with contiguous, non-overlapping PDF spans. */
export function gitaChapterForPdfPage(pdfPage: number): GitaChapter | undefined {
  return GITA_CHAPTERS.find((c) => pdfPage >= c.pdfStart && pdfPage <= c.pdfEnd);
}
