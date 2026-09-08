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
  enTranslationLower: string;
  normEnTranslation: string;
  enCommentaryLower: string;
  mlTranslation: string;
  mlCommentary: string;
}

export interface SearchResult {
  item: IndexedVerseItem;
  score: number;
}

let corpusIndex: IndexedVerseItem[] | null = null;

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
          enTranslationLower: enTranslation.toLowerCase(),
          normEnTranslation: normalizeSanskrit(enTranslation),
          enCommentaryLower: enCommentary.toLowerCase(),
          mlTranslation: mlTranslation.toLowerCase(),
          mlCommentary: mlCommentary.toLowerCase(),
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

    // 3. Devanagari script match
    if (item.devanagari && item.devanagari.includes(rawQuery)) {
      score += 50;
    }

    // 4. English Translation match
    if (item.enTranslationLower.includes(rawQuery)) {
      score += 30;
    } else if (item.normEnTranslation.includes(normQuery)) {
      score += 25;
    }

    // 5. Malayalam Translation match
    if (item.mlTranslation && item.mlTranslation.includes(rawQuery)) {
      score += 35;
    }

    // 6. Commentary match
    if (item.enCommentaryLower.includes(rawQuery) || item.mlCommentary.includes(rawQuery)) {
      score += 15;
    }

    if (score > 0) {
      results.push({ item, score });
    }
  }

  // Sort descending by score, cap so callers (TextIndex live search)
  // never render an unbounded list.
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 200);
}
