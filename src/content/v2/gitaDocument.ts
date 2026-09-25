/**
 * Bhagavad Gītā Sarvatobhadra source-document vocabulary (architecture
 * phase only — no content, no curation, no schema change).
 *
 * Darśana canonical units (one Gītā verse per reader unit) do not coincide
 * with the source document's own units. This module names the document
 * units observed in KSTS No. LXIV (1943) so later phases can map between
 * the two without forcing the edition into the CanonicalUnit model, plus
 * two deterministic parsing helpers the page-map phase will need: the
 * parenthesised verse-reference locator `(13.34)` used throughout
 * Rāmakaṇṭha's commentary, and the PDF-page to printed-folio mapping of
 * this file. Pure and corpus-free; every claim is evidenced in
 * `docs/scholarly/bhagavad-gita-sarvatobhadra-architecture.md`.
 */

/** Document units observed in the KSTS LXIV source, nothing more. */
export const GITA_DOCUMENT_UNIT_KINDS = [
  'title-page',
  'imprint',
  'preface',
  'introduction',
  'mangala-verse',
  'chapter-opening',
  'chapter-avataranika',
  'root-verse',
  'speaker-label',
  'commentary-block',
  'pratika-gloss',
  'commentary-quotation',
  'commentary-cross-reference',
  'objection-block',
  'response-block',
  'chapter-closing-verse',
  'chapter-colophon',
  'footnote-variant',
  'errata-entry',
  'variant-table-row',
  'appendix-item',
  'lineage-verse',
] as const;

export type GitaDocumentUnitKind = (typeof GITA_DOCUMENT_UNIT_KINDS)[number];

export function isGitaDocumentUnitKind(value: unknown): value is GitaDocumentUnitKind {
  return typeof value === 'string' && (GITA_DOCUMENT_UNIT_KINDS as readonly string[]).includes(value);
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

/** Convert Devanagari (or ASCII) digit runs to a number; null when absent. */
export function parseDevanagariNumber(text: string): number | null {
  const run = text.match(/[०-९0-9]+/);
  if (!run) return null;
  let value = 0;
  for (const ch of run[0]) {
    const dev = DEVANAGARI_DIGITS.indexOf(ch);
    value = value * 10 + (dev >= 0 ? dev : Number(ch));
  }
  return value;
}

export interface GitaVerseRef {
  chapter: number;
  verse: number;
}

/**
 * Parse a commentary verse locator such as `(१३।३४)`, `(13.34)` or
 * bare `१३।३४`. Returns null for anything else. Format-level only: it
 * never decides whether the target follows Kashmir or vulgate numbering
 * (chapter 13 differs by one — see the architecture document).
 */
export function parseGitaVerseRef(text: string): GitaVerseRef | null {
  const match = text.match(/\(?\s*([०-९0-9]+)\s*[।|.]\s*([०-९0-9]+)\s*\)?/);
  if (!match) return null;
  const chapter = parseDevanagariNumber(match[1]);
  const verse = parseDevanagariNumber(match[2]);
  if (chapter === null || verse === null) return null;
  if (chapter < 1 || chapter > 18 || verse < 1) return null;
  // The match must be the whole locator, not digits inside a longer run.
  const stripped = text.replace(match[0], '').trim();
  if (/[०-९0-9]/.test(stripped.replace(/^[()]*|[()]*$/g, ''))) return null;
  return { chapter, verse };
}

/**
 * PDF-page to printed-folio mapping for the inspected file
 * (`Gitasarvatobhadrarajanka.pdf`, 431 pages): printed folio equals PDF
 * page minus ten across PDF pp. 11–431 (main text printed pp. 1–405,
 * errata 406–410, variant table 411–420, appendix 421). Front matter
 * (PDF pp. 1–10) is unnumbered, and printed introduction pp. 2–9 are
 * absent from this file, so no mapping is offered there. Null outside
 * the verified range rather than a guessed folio.
 */
export function ksts64PrintedFolio(pdfPage: number): number | null {
  if (!Number.isInteger(pdfPage) || pdfPage < 11 || pdfPage > 431) return null;
  return pdfPage - 10;
}

/** Inverse of `ksts64PrintedFolio`: printed folio to PDF page. */
export function ksts64PdfPage(printedFolio: number): number | null {
  if (!Number.isInteger(printedFolio) || printedFolio < 1 || printedFolio > 421) return null;
  return printedFolio + 10;
}
