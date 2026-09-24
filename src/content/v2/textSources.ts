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

export interface LocatorStem {
  /** Prefix stem (trailing dash) or exact unit id. */
  stem: string;
  prefix: boolean;
  /** Source location, e.g. edition page range. */
  locator: string;
}

/**
 * Reduce a legacy per-section provenance table to matchable stems.
 * Rows whose patterns carry no unit-addressable stem (slash lists such
 * as `a/b/c`) yield no stem and can never match — they stay unresolved
 * rather than guessing.
 */
export function extractLocatorStems(rows: SourceTableRow[]): LocatorStem[] {
  const out: LocatorStem[] = [];
  for (const row of rows) {
    const appIds = (row.appIds || '').trim();
    const locator = (row.pdfPages || '').trim();
    if (!appIds || !locator) continue;
    if (appIds.includes('/')) continue;
    const base = appIds.replace(/\s*\(.*\)\s*$/, '').trim();
    if (!base) continue;
    if (base.endsWith('*')) {
      const stem = base.slice(0, -1);
      if (stem) out.push({ stem, prefix: true, locator });
    } else {
      out.push({ stem: base, prefix: false, locator });
    }
  }
  return out;
}

/**
 * Match a unit id to the longest applicable stem. Prefix stems match at
 * the dash boundary they carry (`dm-1-` never catches `dm-13-5`); exact
 * stems require equality. Returns the source locator or null when
 * nothing matches — unmatched units stay honestly unresolved.
 */
export function matchUnitLocator(unitId: string, stems: LocatorStem[]): string | null {
  let best: LocatorStem | null = null;
  for (const stem of stems) {
    let hit = false;
    if (stem.prefix) {
      // Dash-boundary matching: `dm-1-` must never catch `dm-13-5`,
      // even if a stem ever arrives without its trailing dash.
      hit =
        unitId.startsWith(stem.stem) &&
        (stem.stem.endsWith('-') || unitId.length === stem.stem.length || unitId[stem.stem.length] === '-');
    } else {
      hit = unitId === stem.stem;
    }
    if (hit && (!best || stem.stem.length > best.stem.length)) best = stem;
  }
  return best ? best.locator : null;
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
