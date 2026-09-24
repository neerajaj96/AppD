import type { V2Source } from './schema';

/**
 * Text-level source records carried from legacy provenance statements.
 *
 * Several legacy texts ship free-form source-provenance prose (or
 * per-section tables) describing where their content came from and what
 * was deliberately not copied. Parsing structured author/year/publisher
 * fields out of that prose would be fabrication — so this module carries
 * the statements verbatim as `notes` on a single per-text V2Source,
 * titled with the text's own transliterated title. Table rows are
 * reformatted as `appIds (pages) — note` lines (formatting, not
 * invention). Texts without legacy statements get no record at all.
 * No corpus imports here; the build script supplies the prose.
 */

export interface SourceTableRow {
  appIds: string;
  pdfPages: string;
  note: string;
}

/** Render a legacy per-section provenance table as plain note lines. */
export function formatSourceTable(rows: SourceTableRow[]): string {
  return rows
    .map((r) => {
      const head = [r.appIds?.trim(), r.pdfPages?.trim()].filter(Boolean).join(' ');
      const headPart = head ? `${head} — ` : '';
      return `${headPart}${(r.note || '').trim()}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

/** Join free-form provenance statements, dropping blanks. */
export function joinSourceNotes(statements: string[]): string {
  return statements
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Build the single source record for a text, or null when there is
 * nothing to carry. The record id is stable and canonical.
 */
export function buildTextSource(
  textId: string,
  transliteratedTitle: string,
  notes: string | string[],
): V2Source | null {
  const joined = Array.isArray(notes) ? joinSourceNotes(notes) : notes.trim();
  if (!joined) return null;
  return {
    id: `${textId}-source-notes`,
    title: transliteratedTitle,
    notes: joined,
  };
}
