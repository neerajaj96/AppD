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
  /**
   * Finer-than-unit precision, appended to the locator clause only when
   * verified (e.g. a commentary-span note with folio). Never invented:
   * absent means cite at unit level.
   */
  segment?: string;
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

/** Guided-thread step URL: thread id plus local step number. */
export function threadStepUrl(origin: string, systemId: string, threadId: string, stepIndex: number): string {
  const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  return `${base}/#/system/${systemId}/thread?thread=${threadId}&step=${stepIndex + 1}`;
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
  const locator = [clean(input.locator), clean(input.page), clean(input.segment)].filter(Boolean).join(', ');
  if (locator) parts.push(`${locator}.`);
  // Segment citations address thread steps, not canonical units — the
  // trailing label says which. Unit-only citations render byte-identical
  // to before.
  const refLabel = clean(input.segment) ? 'Darśana scholarly reference' : 'Darśana canonical unit';
  parts.push(`${refLabel}: ${clean(input.url) || '?'}.`);
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

export interface CitationSourceInput {
  id: string;
  edition?: string;
  publisher?: string;
  year?: string | number;
  locator?: string;
  page?: string;
}

/**
 * Choose the source whose edition metadata feeds a citation: the linked
 * source carrying the `text` relation when one exists, otherwise the
 * first attached source. Pure and deterministic; citations that lack
 * precise links behave exactly as before.
 */
export function selectCitationSource<T extends CitationSourceInput>(
  sources: T[],
  evidenceLinks?: Array<{ sourceId: string; relation: string }>,
): T | undefined {
  if (sources.length === 0) return undefined;
  const textual = (evidenceLinks || []).find((link) => link.relation === 'text');
  if (textual) {
    const hit = sources.find((s) => s.id === textual.sourceId);
    if (hit) return hit;
  }
  return sources[0];
}
