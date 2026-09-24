/**
 * Canonical ID utilities for the V2 content contract.
 *
 * Stable identifiers use an optional `tradition::local-id` namespace where
 * cross-tradition ambiguity exists (for example `samkhya::satkaryavada`
 * beside `vedanta::maya`). Human aliases (diacritic variants, hyphenation
 * variants) never replace canonical IDs; they resolve through an explicit
 * table that reports ambiguity instead of guessing.
 */

/** Normalise an identifier for diacritic/case/separator-insensitive lookup. */
export function normaliseId(id: string): string {
  return (id || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** A canonical ID is a non-empty slug, optionally namespaced once with `::`. */
export function isCanonicalId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const parts = id.split('::');
  if (parts.length > 2) return false;
  const slug = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i;
  return parts.every((p) => p.length > 0 && slug.test(p));
}

/** Split `tradition::local` into its parts; unnamespaced IDs yield no namespace. */
export function splitNamespacedId(id: string): { namespace?: string; local: string } {
  const idx = id.indexOf('::');
  if (idx < 0) return { local: id };
  return { namespace: id.slice(0, idx), local: id.slice(idx + 2) };
}

export interface CanonicalConceptTriple {
  traditionId: string;
  textId: string;
  conceptId: string;
}

/**
 * Canonical concept identity in `tradition/text/concept` triple form.
 * Namespaces are explicit: `samkhya/samkhya-karika/purusha-svarupa` can
 * never collide with `vedanta/brahma-sutras/concept_samkhya_purusha`,
 * however alike their local names look.
 */
export function canonicalConceptId(traditionId: string, textId: string, conceptId: string): string {
  return `${traditionId}/${textId}/${conceptId}`;
}

/** Parse a triple back into parts; undefined when malformed. */
export function parseCanonicalConceptId(id: string): CanonicalConceptTriple | undefined {
  if (typeof id !== 'string') return undefined;
  const parts = id.split('/');
  if (parts.length !== 3 || parts.some((p) => !p || !p.trim())) return undefined;
  const [traditionId, textId, conceptId] = parts as [string, string, string];
  return { traditionId, textId, conceptId };
}

export type AliasResolution =
  | { status: 'resolved'; canonicalId: string }
  | { status: 'ambiguous'; candidates: string[] }
  | { status: 'missing'; alias: string };

/**
 * Resolve a human alias against an alias table.
 *
 * Matching is normalised (so `satkāryavāda`, `sat-karya-vada` and
 * `satkaryavada` coincide) but an alias that maps to more than one
 * canonical ID always returns `ambiguous` — callers must surface the
 * choice rather than silently picking the first match.
 */
export function resolveAlias(
  alias: string,
  table: ReadonlyMap<string, string[]> | Record<string, string[]>,
): AliasResolution {
  const key = normaliseId(alias);
  let lookup: string[] | undefined;
  if (table instanceof Map) {
    lookup = table.get(key);
  } else {
    lookup = (table as Record<string, string[]>)[key];
  }
  if (!lookup || lookup.length === 0) return { status: 'missing', alias };
  const unique = Array.from(new Set(lookup));
  if (unique.length > 1) return { status: 'ambiguous', candidates: unique };
  return { status: 'resolved', canonicalId: unique[0] as string };
}

/** Build a normalised alias table from `{ alias, canonicalId }` rows. */
export function buildAliasTable(
  rows: ReadonlyArray<{ alias: string; canonicalId: string }>,
): Map<string, string[]> {
  const table = new Map<string, string[]>();
  for (const row of rows) {
    const key = normaliseId(row.alias);
    if (!key) continue;
    const list = table.get(key);
    if (list) {
      if (!list.includes(row.canonicalId)) list.push(row.canonicalId);
    } else {
      table.set(key, [row.canonicalId]);
    }
  }
  return table;
}

/**
 * Validate a canonical locator of the form `tradition/text/unit`.
 * Returns an error string, or undefined when the locator is well formed.
 */
export function validateLocator(locator: string): string | undefined {
  if (!locator || typeof locator !== 'string') return 'locator must be a non-empty string';
  const parts = locator.split('/');
  if (parts.length !== 3) return 'locator must have the form tradition/text/unit';
  for (const part of parts) {
    if (!part) return 'locator parts must be non-empty';
  }
  return undefined;
}
