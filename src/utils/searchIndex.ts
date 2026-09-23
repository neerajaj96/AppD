/**
 * DEPRECATED for runtime use: this module scans the monolithic corpus
 * (`src/content`) on every search. Runtime search runs against the
 * generated V2 index via `src/search/client.ts` (Web Worker first,
 * main-thread fallback). Retained for the search unit tests until they
 * migrate to `src/search/rank.ts`.
 */
import { systems } from '../content';
import { Verse, System, ClassicalText } from '../types/content';
import { normalizeSanskrit } from './sanskrit';

export interface IndexedVerseItem {
  systemId: string;
  systemTitle: string;
  textId: string;
  textTitle: string;
  verse: Verse;
  numberLower: string;
  iastLower: string;
  normIast: string;
  devanagari: string;
  devanagariCanon: string;
  enTranslationLower: string;
  normEnTranslation: string;
  enCommentaryLower: string;
  mlTranslation: string;
  mlTranslationCanon: string;
  mlCommentary: string;
  mlCommentaryCanon: string;
}

export interface SearchResult {
  item: IndexedVerseItem;
  score: number;
}

let corpusIndex: IndexedVerseItem[] | null = null;

/**
 * Canonical form for Indic-script matching. Devanagari and Malayalam source
 * strings carry hard line breaks (verses are stored multi-line) and Malayalam
 * often carries invisible joiners (ZWJ/ZWNJ) that keyboards may or may not
 * emit. Collapsing both sides to joiner-free, single-spaced text lets a typed
 * query match across a line break it cannot see. Lowercasing is a no-op for
 * these scripts but keeps the contract uniform with the other index fields.
 */
export function canonIndic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[‌‍﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function getOrBuildSearchIndex(): IndexedVerseItem[] {
  if (corpusIndex) return corpusIndex;

  const items: IndexedVerseItem[] = [];

  for (let s = 0; s < systems.length; s++) {
    const sys = systems[s];
    for (let t = 0; t < sys.texts.length; t++) {
      const text = sys.texts[t];
      for (let v = 0; v < text.verses.length; v++) {
        const verse = text.verses[v];
        const en = verse.content.en;
        const ml = verse.content.ml;

        const iast = verse.iast || '';
        const enTranslation = en?.translation || '';
        const enCommentary = en?.commentary || '';
        const mlTranslation = ml?.translation || '';
        const mlCommentary = ml?.commentary || '';
        const numberStr = verse.number ?? verse.id ?? '';

        items.push({
          systemId: sys.id,
          systemTitle: sys.title,
          textId: text.id,
          textTitle: text.transliteratedTitle,
          verse,
          numberLower: numberStr.toLowerCase(),
          iastLower: iast.toLowerCase(),
          normIast: normalizeSanskrit(iast),
          devanagari: verse.devanagari || '',
          devanagariCanon: canonIndic(verse.devanagari || ''),
          enTranslationLower: enTranslation.toLowerCase(),
          normEnTranslation: normalizeSanskrit(enTranslation),
          enCommentaryLower: enCommentary.toLowerCase(),
          mlTranslation: mlTranslation.toLowerCase(),
          mlTranslationCanon: canonIndic(mlTranslation),
          mlCommentary: mlCommentary.toLowerCase(),
          mlCommentaryCanon: canonIndic(mlCommentary),
        });
      }
    }
  }

  corpusIndex = items;
  return corpusIndex;
}

/**
 * Executes a high-performance ranked search across the pre-indexed corpus.
 * Returns results sorted by relevance.
 */
export function searchVerses(
  query: string,
  filter?: { systemId?: string; textId?: string }
): SearchResult[] {
  if (!query || !query.trim()) return [];

  const rawQuery = query.trim().toLowerCase();
  const normQuery = normalizeSanskrit(query.trim());
  // Joiner-free, single-spaced form for the Indic-script paths. Empty when
  // the query held nothing but whitespace or joiners — callers must skip the
  // canon paths then, since every string includes ''.
  const canonQuery = canonIndic(query);
  const index = getOrBuildSearchIndex();

  const results: SearchResult[] = [];

  for (let i = 0; i < index.length; i++) {
    const item = index[i];

    if (filter?.systemId && item.systemId !== filter.systemId) continue;
    if (filter?.textId && item.textId !== filter.textId) continue;

    let score = 0;

    // 1. Exact verse number match (highest priority)
    if (item.numberLower === rawQuery) {
      score += 120;
    } else if (item.numberLower.includes(rawQuery)) {
      score += 60;
    }

    // 2. Transliteration / Sanskrit matches
    if (item.iastLower.includes(rawQuery)) {
      score += 45;
    } else if (item.normIast.includes(normQuery)) {
      score += 40;
    }

    // 3. Devanagari script match (canonical form bridges source line
    // breaks and stray joiners the query cannot reproduce).
    if (canonQuery && item.devanagariCanon && item.devanagariCanon.includes(canonQuery)) {
      score += 50;
    }

    // 4. English Translation match
    if (item.enTranslationLower.includes(rawQuery)) {
      score += 30;
    } else if (item.normEnTranslation.includes(normQuery)) {
      score += 25;
    }

    // 5. Malayalam Translation match
    if (canonQuery && item.mlTranslationCanon && item.mlTranslationCanon.includes(canonQuery)) {
      score += 35;
    }

    // 6. Commentary match
    if (
      item.enCommentaryLower.includes(rawQuery) ||
      (canonQuery && item.mlCommentaryCanon && item.mlCommentaryCanon.includes(canonQuery))
    ) {
      score += 15;
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort descending by score, cap so callers (TextIndex live search)
  // never render an unbounded list. Ties break on stable id order so
  // head queries with flat scores (e.g. karma/yoga/dharma) realise a
  // deterministic ranking instead of corpus insertion order.
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ak = `${a.item.systemId}/${a.item.textId}/${a.item.verse.id}`;
    const bk = `${b.item.systemId}/${b.item.textId}/${b.item.verse.id}`;
    return ak < bk ? -1 : ak > bk ? 1 : 0;
  });
  return results.slice(0, 200);
}
