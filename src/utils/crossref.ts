import { hasVerse } from '../content';

export type TextSegment = { text: string; link?: { systemId: string; textId: string; verseId: string } };

const YOGA_REF = /\b([IVXLC]+\.\d+)\b/g;
const SAMKHYA_REF = /\bK[aā]rik[aā](?:s)?\s+(\d+(?:-\d+)?)\b/ig;
const GENERIC_SUTRA_REF = /\b(NS|VS|BS|PMS|YS)\s+(\d+(?:\.\d+)*)\b/ig;

const prefixMap: Record<string, { systemId: string, textId: string }> = {
  'NS': { systemId: 'nyaya', textId: 'nyaya-sutras' },
  'VS': { systemId: 'vaisesika', textId: 'vaisesika-sutras' },
  'BS': { systemId: 'vedanta', textId: 'brahma-sutras' },
  'PMS': { systemId: 'mimamsa', textId: 'purva-mimamsa-sutras' },
  'YS': { systemId: 'yoga', textId: 'yoga-sutras' }
};

function verseExists(systemId: string, textId: string, verseId: string): boolean {
  return hasVerse(systemId, textId, verseId);
}

/**
 * Splits commentary/narrative prose into plain-text and linkable segments.
 * Recognizes "I.2" / "II.29" style (Yoga Sūtra) and "Kārikā LXVII" style
 * (Sāṃkhya Kārikā, including when prefixed "Sāṃkhya Kārikā ..." for
 * cross-system references) and resolves each against the actual content
 * registry so a stale or out-of-range reference never renders as a dead link.
 */
export function linkifyReferences(raw: string): TextSegment[] {
  type Match = { start: number; end: number; verseId: string; systemId: string; textId: string };
  const matches: Match[] = [];

  let m: RegExpExecArray | null;
  YOGA_REF.lastIndex = 0;
  while ((m = YOGA_REF.exec(raw))) {
    // avoid double matching if "YS I.2" was caught by generic matcher
    if (raw.substring(Math.max(0, m.index - 3), m.index).includes('YS ')) continue;
    matches.push({ start: m.index, end: m.index + m[0].length, verseId: m[1], systemId: 'yoga', textId: 'yoga-sutras' });
  }
  
  SAMKHYA_REF.lastIndex = 0;
  while ((m = SAMKHYA_REF.exec(raw))) {
    // link only the numeric portion (arabic digits, e.g. "Kārikā 67"),
    // not the word "Kārikā" itself
    const numStart = m.index + m[0].indexOf(m[1]);
    matches.push({
      start: numStart,
      end: numStart + m[1].length,
      verseId: m[1],
      systemId: 'samkhya',
      textId: 'samkhya-karika',
    });
  }

  GENERIC_SUTRA_REF.lastIndex = 0;
  while ((m = GENERIC_SUTRA_REF.exec(raw))) {
    const prefix = m[1].toUpperCase();
    const config = prefixMap[prefix];
    if (config) {
      const numStart = m.index + m[0].indexOf(m[2]);
      matches.push({
        start: numStart,
        end: numStart + m[2].length,
        verseId: m[2], // The numbers 1.1.1
        systemId: config.systemId,
        textId: config.textId
      });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const mat of matches) {
    if (mat.start < cursor) continue; // overlapping match, skip
    if (!verseExists(mat.systemId, mat.textId, mat.verseId)) continue;
    if (mat.start > cursor) segments.push({ text: raw.slice(cursor, mat.start) });
    segments.push({
      text: raw.slice(mat.start, mat.end),
      link: { systemId: mat.systemId, textId: mat.textId, verseId: mat.verseId },
    });
    cursor = mat.end;
  }
  if (cursor < raw.length) segments.push({ text: raw.slice(cursor) });
  return segments;
}
