/**
 * Bhagavad Gītā Sarvatobhadra source-document vocabulary and backbone
 * parsing layer (no content, no curation, no schema change).
 *
 * Darśana canonical units (one Gītā verse per reader unit) do not coincide
 * with the source document's own units. This module names the document
 * units observed in KSTS No. LXIV (1943) so later phases can map between
 * the two without forcing the edition into the CanonicalUnit model, plus
 * the deterministic parsing helpers the page-map phase needs: the
 * parenthesised verse-reference locator `(13.34)` used throughout
 * Rāmakaṇṭha's commentary, the PDF-page to printed-folio mapping of
 * this file, witness sigla, and the śuddhapatra erratum row shape. Pure
 * and corpus-free; every claim is evidenced in
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

/**
 * How a canonical unit maps to its KSTS source reference. `aligned`
 * means identical numbering; `offset` a verified positional shift;
 * `split` one canonical verse spanning several KSTS numbers; `partial`
 * unnumbered or absent halves; `transposed` text printed under another
 * chapter; `vulgate-only` no KSTS counterpart at all; `appendix` an
 * adhika unit (see `GitaMappingStatus` notes for the inline state).
 */
export const GITA_MAPPING_STATUSES = [
  'aligned',
  'offset',
  'split',
  'partial',
  'transposed',
  'vulgate-only',
  'appendix',
  'appendix-inline',
  'appendix-partial',
] as const;

export type GitaMappingStatus = (typeof GITA_MAPPING_STATUSES)[number];

export function isGitaMappingStatus(value: unknown): value is GitaMappingStatus {
  return typeof value === 'string' && (GITA_MAPPING_STATUSES as readonly string[]).includes(value);
}

/**
 * Witness sigla observed verbatim in the edition's variant footnotes.
 * `पु.` occurs but is unexplained (the preface lists only क, ख, ग) —
 * it is preserved, never expanded. Anything outside this set is
 * rejected rather than guessed.
 */
export const GITA_SIGLA = ['क', 'ख', 'ग', 'पु.'] as const;

export type GitaSiglum = (typeof GITA_SIGLA)[number];

export function isGitaSiglum(value: unknown): value is GitaSiglum {
  return typeof value === 'string' && (GITA_SIGLA as readonly string[]).includes(value);
}

/** One variant reading, exactly as printed: witnesses, text, origin. */
export interface GitaVariant {
  /** Canonical host unit, e.g. `2.6`. */
  hostUnitId: string;
  /** Witness sigla verbatim (`क.`, `ख.` …); `पु.` stays unresolved. */
  sigla: string[];
  /** Variant reading verbatim, diacritics and all. */
  reading: string;
  /** Where it was found: footnote or back-matter table. */
  origin: 'footnote' | 'variant-table';
}

/** One śuddhapatra (errata) row: the edition correcting itself. */
export interface GitaErratum {
  /** Printed page the correction applies to. */
  printedPage: number;
  /** Printed line number, when the table gives one. */
  line?: number;
  /** Text as printed (the error). */
  incorrect: string;
  /** The edition's own correction. */
  correct: string;
}

/**
 * Parse an unambiguous śuddhapatra row of the form
 * `page line incorrect correct` with single-token readings
 * (Devanagari or ASCII digits). Multi-word readings cannot be split
 * deterministically and return null — those rows stay human work,
 * never guessed rows. Never throws.
 */
export function parseErratumRow(text: string): GitaErratum | null {
  const tokens = text.trim().split(/\s+/);
  if (tokens.length !== 4) return null;
  const printedPage = parseDevanagariNumber(tokens[0]);
  const line = parseDevanagariNumber(tokens[1]);
  if (printedPage === null || printedPage < 1 || line === null || line < 1) return null;
  if (!tokens[2] || !tokens[3]) return null;
  return { printedPage, line, incorrect: tokens[2], correct: tokens[3] };
}

/**
 * Commentary-to-verse reference kind, matching Rāmakaṇṭha's observed
 * habits: quoted Gītā text with a locator, a bare locator, or a
 * quotation from outside the Gītā. Never inferred — `quotation`
 * requires quoted text *plus* a locator in print.
 */
export const GITA_REFERENCE_KINDS = [
  'commentary-quotes-unit',
  'commentary-refers-unit',
  'commentary-quotes-external',
] as const;

export type GitaReferenceKind = (typeof GITA_REFERENCE_KINDS)[number];

export function isGitaReferenceKind(value: unknown): value is GitaReferenceKind {
  return typeof value === 'string' && (GITA_REFERENCE_KINDS as readonly string[]).includes(value);
}

/** One verified commentary reference edge (quotation or locator). */
export interface GitaReference {
  id: string;
  /** KSTS host verse whose commentary carries the reference (null for introductory/avatāraṇikā matter). */
  fromKsts: GitaVerseRef | null;
  /** Canonical host unit, when the host verse has one. */
  fromUnitId: string | null;
  /** KSTS target verse. */
  toKsts: GitaVerseRef;
  /** Canonical target unit, when the target has one. */
  toUnitId: string | null;
  /** Quoted text verbatim (quotation kind only). */
  quotedText?: string;
  /** Printed locator exactly as found (separators may vary). */
  locator: string;
  kind: GitaReferenceKind;
  /** Verification note (fused ref digits, quote/mūla divergence, target sharing). */
  note?: string;
}
