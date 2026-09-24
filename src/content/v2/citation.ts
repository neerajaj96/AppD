/**
 * Deterministic canonical-unit citations (Prompt: source/citation layer).
 *
 * Every field is optional except the text title, unit number and
 * canonical URL — absent metadata is omitted, never invented. Formatting
 * is a pure function of available data, so the same unit always yields
 * the same citation string. Sanskrit/IAST titles pass through untouched
 * (they are data, not decoration).
 */

export interface CitationInput {
  textTitle: string;
  unitNumber: string;
  author?: string;
  edition?: string;
  publisher?: string;
  year?: string | number;
  locator?: string;
  page?: string;
  url: string;
}

function clean(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

/** Canonical unit URL: stable HashRouter deep link for this deployment. */
export function unitCanonicalUrl(origin: string, systemId: string, textId: string, unitId: string): string {
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  return `${base}/#/system/${systemId}/text/${textId}/verse/${unitId}`;
}

/** Format a citation from available metadata only. Never throws. */
export function formatCitation(input: CitationInput): string {
  const head = `${clean(input.textTitle) || 'Untitled text'}, ${clean(input.unitNumber) || '?'}.`;
  const parts = [head];
  const author = clean(input.author);
  if (author) parts.push(`${author}.`);
  const edition = [clean(input.edition), clean(input.publisher), clean(input.year)]
    .filter(Boolean)
    .join(', ');
  if (edition) parts.push(`${edition}.`);
  const locator = [clean(input.locator), clean(input.page)].filter(Boolean).join(', ');
  if (locator) parts.push(`${locator}.`);
  parts.push(`Darśana canonical unit: ${clean(input.url) || '?'}.`);
  return parts.join(' ');
}

/** Copy text to the clipboard. Returns false where unavailable. Never throws. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
