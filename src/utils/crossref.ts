import { hasVerse } from '../content';
import { findConcept } from './references';

/**
 * Wikipedia-style reference linkifier.
 *
 * Recognizes three families of inline references in commentary / narrative /
 * summary prose and resolves each against the compiled content registry, so a
 * stale or out-of-range reference never renders as a dead link:
 *
 * 1. Traditional scholarly shorthands (auto-detected):
 *    - Yoga: "I.2", "II.29" (bare or as "YS I.2")
 *    - Sāṃkhya: "Kārikā 67" (arabic) and "Kārikā LXVII" (roman, converted)
 *    - Cross-system: "NS 1.1.1", "VS 2.1.1", "BS 1.1.1", "PMS 3.4.5", "YS I.2"
 * 2. Explicit wiki links (author-controlled, always preferred):
 *    - [[YS I.2]] / [[Kārikā 12]] — verse shorthands in brackets
 *    - [[satkaryavada]] — bare concept id, resolved globally
 *    - [[concept:satkaryavada]] or [[concept:yoga/yoga-sutras/satkaryavada]]
 *    - [[verse:yoga/yoga-sutras/I.2]]
 *    - [[thread:samkhya]] / [[text:vedanta/brahma-sutras]]
 *    - Custom label: [[YS I.2|the famous definition]]
 */

export type RefLink =
  | { kind: 'verse'; systemId: string; textId: string; verseId: string }
  | { kind: 'concept'; systemId: string; textId: string; conceptId: string }
  | { kind: 'thread'; systemId: string; stepIndex?: number }
  | { kind: 'text'; systemId: string; textId: string };

export type TextSegment = { text: string; link?: RefLink; label?: string };

export interface LinkifyContext {
  systemId?: string;
  textId?: string;
}

const YOGA_REF = /\b([IVXLC]+\.\d+)\b/g;
const SAMKHYA_REF = /\bK[aā]rik[aā](?:s)?\s+([MDCLXVI]+|\d+(?:-\d+)?)\b/gi;
const GENERIC_SUTRA_REF = /\b(NS|VS|BS|PMS|YS)\s+(\d+(?:\.\d+)*|[IVXLC]+\.\d+)\b/gi;
const WIKI_REF = /\[\[([^\]|[\]]+)(?:\|([^\]]+))?\]\]/g;

const prefixMap: Record<string, { systemId: string; textId: string }> = {
  NS: { systemId: 'nyaya', textId: 'nyaya-sutras' },
  VS: { systemId: 'vaisesika', textId: 'vaisesika-sutras' },
  BS: { systemId: 'vedanta', textId: 'brahma-sutras' },
  PMS: { systemId: 'mimamsa', textId: 'purva-mimamsa-sutras' },
  YS: { systemId: 'yoga', textId: 'yoga-sutras' },
};

const ROMAN_VALUES: Record<string, number> = {
  M: 1000,
  D: 500,
  C: 100,
  L: 50,
  X: 10,
  V: 5,
  I: 1,
};

/** Convert a Roman numeral (e.g. "LXVII") to arabic (67). Returns NaN when invalid. */
export function romanToInt(roman: string): number {
  const s = roman.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(s)) return NaN;
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const value = ROMAN_VALUES[s[i]];
    if (value < prev) total -= value;
    else {
      total += value;
      prev = value;
    }
  }
  return total;
}

function verseExists(systemId: string, textId: string, verseId: string): boolean {
  return hasVerse(systemId, textId, verseId);
}

type PendingMatch = {
  start: number;
  end: number;
  link?: RefLink;
  /** Display text override (wiki custom label). Defaults to the matched slice. */
  label?: string;
  /** Unresolvable wiki link: render the label as plain text (no brackets). */
  plain?: string;
};

function parseVerseShorthand(
  inner: string,
): { systemId: string; textId: string; verseId: string } | undefined {
  // "YS I.2" / "NS 1.1.1" style
  const generic = /^(NS|VS|BS|PMS|YS)\s+(\d+(?:\.\d+)*|[IVXLC]+\.\d+)$/i.exec(inner.trim());
  if (generic) {
    const config = prefixMap[generic[1].toUpperCase()];
    if (config && verseExists(config.systemId, config.textId, generic[2])) {
      return { systemId: config.systemId, textId: config.textId, verseId: generic[2] };
    }
    return undefined;
  }
  // "Kārikā 12" / "Kārikā LXVII"
  const karika = /^K[aā]rik[aā](?:s)?\s+([MDCLXVI]+|\d+)$/i.exec(inner.trim());
  if (karika) {
    const raw = karika[1];
    const verseId = /^\d+$/.test(raw) ? raw : String(romanToInt(raw));
    if (verseExists('samkhya', 'samkhya-karika', verseId)) {
      return { systemId: 'samkhya', textId: 'samkhya-karika', verseId };
    }
    return undefined;
  }
  // Bare "I.2" — Yoga Sūtra by convention.
  const bare = /^([IVXLC]+\.\d+)$/.exec(inner.trim());
  if (bare && verseExists('yoga', 'yoga-sutras', bare[1])) {
    return { systemId: 'yoga', textId: 'yoga-sutras', verseId: bare[1] };
  }
  return undefined;
}

function parseWikiInner(inner: string, label: string | undefined, ctx: LinkifyContext): PendingMatch {
  const target = inner.trim();
  const lowered = target.toLowerCase();

  const withLabel = (link: RefLink): PendingMatch => ({ start: -1, end: -1, link, label });

  // concept:… / verse:… / thread:… / text:…
  const schemeMatch = /^([a-z]+):(.+)$/.exec(lowered);
  if (schemeMatch) {
    const scheme = schemeMatch[1];
    const rest = target.slice(scheme.length + 1).trim();
    if (scheme === 'concept') {
      const parts = rest.split('/').map((p) => p.trim()).filter(Boolean);
      let hit;
      if (parts.length === 3) {
        hit = findConcept(parts[2], { systemId: parts[0], textId: parts[1] });
      } else {
        hit = findConcept(parts[0], { systemId: ctx.systemId, textId: ctx.textId });
      }
      if (hit) {
        return withLabel({
          kind: 'concept',
          systemId: hit.systemId,
          textId: hit.textId,
          conceptId: hit.concept.id as string,
        });
      }
      return { start: -1, end: -1, plain: label || parts[parts.length - 1] || target };
    }
    if (scheme === 'verse' || scheme === 'sutra' || scheme === 'karika') {
      const parts = rest.split('/').map((p) => p.trim()).filter(Boolean);
      if (parts.length === 3 && verseExists(parts[0], parts[1], parts[2])) {
        return withLabel({ kind: 'verse', systemId: parts[0], textId: parts[1], verseId: parts[2] });
      }
      if (parts.length === 1 && ctx.systemId && ctx.textId && verseExists(ctx.systemId, ctx.textId, parts[0])) {
        return withLabel({ kind: 'verse', systemId: ctx.systemId, textId: ctx.textId, verseId: parts[0] });
      }
      return { start: -1, end: -1, plain: label || target };
    }
    if (scheme === 'thread') {
      return withLabel({ kind: 'thread', systemId: rest || ctx.systemId || '' });
    }
    if (scheme === 'text') {
      const parts = rest.split('/').map((p) => p.trim()).filter(Boolean);
      if (parts.length === 2) {
        return withLabel({ kind: 'text', systemId: parts[0], textId: parts[1] });
      }
      return { start: -1, end: -1, plain: label || target };
    }
    // Unknown scheme — fall through to shorthand / concept-id attempts.
  }

  // Verse shorthand inside brackets: [[YS I.2]], [[Kārikā LXV]], [[I.2]]
  const shorthand = parseVerseShorthand(target);
  if (shorthand) {
    return withLabel({ kind: 'verse', ...shorthand });
  }

  // Bare concept id: [[satkaryavada]]
  const hit = findConcept(target, { systemId: ctx.systemId, textId: ctx.textId });
  if (hit) {
    return withLabel({
      kind: 'concept',
      systemId: hit.systemId,
      textId: hit.textId,
      conceptId: hit.concept.id as string,
    });
  }

  // Unresolvable — render the readable label without brackets (never a dead link).
  return { start: -1, end: -1, plain: label || target };
}

/**
 * Splits prose into plain-text and linkable segments.
 * Wiki `[[…]]` links take precedence over auto-detected shorthands; every
 * candidate is validated against the content registry before it becomes a link.
 */
export function linkifyReferences(raw: string, ctx: LinkifyContext = {}): TextSegment[] {
  if (!raw) return [];
  type Match = { start: number; end: number; link?: RefLink; label?: string; plain?: string };
  const matches: Match[] = [];

  // 1. Explicit wiki links first (they own their bracket span).
  let m: RegExpExecArray | null;
  WIKI_REF.lastIndex = 0;
  const wikiSpans: { start: number; end: number }[] = [];
  while ((m = WIKI_REF.exec(raw))) {
    const parsed = parseWikiInner(m[1], m[2], ctx);
    wikiSpans.push({ start: m.index, end: m.index + m[0].length });
    if (parsed.link) {
      matches.push({ start: m.index, end: m.index + m[0].length, link: parsed.link, label: parsed.label });
    } else if (parsed.plain !== undefined) {
      matches.push({ start: m.index, end: m.index + m[0].length, plain: parsed.plain });
    }
  }
  const insideWiki = (index: number) => wikiSpans.some((s) => index >= s.start && index < s.end);

  // 2. Bare Yoga refs ("I.2"), skipping ones already covered by "YS I.2".
  YOGA_REF.lastIndex = 0;
  while ((m = YOGA_REF.exec(raw))) {
    if (insideWiki(m.index)) continue;
    if (raw.substring(Math.max(0, m.index - 3), m.index).includes('YS ')) continue;
    matches.push({
      start: m.index,
      end: m.index + m[0].length,
      link: { kind: 'verse', systemId: 'yoga', textId: 'yoga-sutras', verseId: m[1] },
    });
  }

  // 3. Sāṃkhya Kārikā refs, arabic ("Kārikā 67") and roman ("Kārikā LXVII").
  SAMKHYA_REF.lastIndex = 0;
  while ((m = SAMKHYA_REF.exec(raw))) {
    if (insideWiki(m.index)) continue;
    const rawNum = m[1];
    // Ranges ("9-11") have no single target verse — leave as plain text.
    if (rawNum.includes('-')) continue;
    const verseId = /^\d+$/.test(rawNum) ? rawNum : String(romanToInt(rawNum));
    if (!verseExists('samkhya', 'samkhya-karika', verseId)) continue;
    // Link only the numeric/roman portion, not the word "Kārikā" itself.
    const numStart = m.index + m[0].indexOf(m[1]);
    matches.push({
      start: numStart,
      end: numStart + m[1].length,
      link: { kind: 'verse', systemId: 'samkhya', textId: 'samkhya-karika', verseId },
    });
  }

  // 4. Generic cross-system shorthands ("NS 1.1.1", "BS 2.3.4", "YS I.2").
  GENERIC_SUTRA_REF.lastIndex = 0;
  while ((m = GENERIC_SUTRA_REF.exec(raw))) {
    if (insideWiki(m.index)) continue;
    const prefix = m[1].toUpperCase();
    const config = prefixMap[prefix];
    if (!config) continue;
    if (!verseExists(config.systemId, config.textId, m[2])) continue;
    const numStart = m.index + m[0].indexOf(m[2]);
    matches.push({
      start: numStart,
      end: numStart + m[2].length,
      link: { kind: 'verse', systemId: config.systemId, textId: config.textId, verseId: m[2] },
    });
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const mat of matches) {
    if (mat.start < cursor) continue; // overlapping match, skip
    // Validate verse links one final time (registry may differ per language build).
    if (mat.link?.kind === 'verse' && !verseExists(mat.link.systemId, mat.link.textId, mat.link.verseId)) {
      continue;
    }
    if (mat.start > cursor) segments.push({ text: raw.slice(cursor, mat.start) });
    if (mat.plain !== undefined) {
      segments.push({ text: mat.plain });
    } else if (mat.link) {
      segments.push({ text: raw.slice(mat.start, mat.end), link: mat.link, label: mat.label });
    }
    cursor = mat.end;
  }
  if (cursor < raw.length) segments.push({ text: raw.slice(cursor) });
  return segments;
}

/** All resolvable reference links found in a prose string (for "See also" sections). */
export function extractRefLinks(raw: string, ctx: LinkifyContext = {}): RefLink[] {
  return linkifyReferences(raw, ctx)
    .filter((s) => s.link !== undefined)
    .map((s) => s.link as RefLink);
}
