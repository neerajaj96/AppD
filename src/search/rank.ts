import type { SearchIndexEntry } from '../content/v2/search-index';

/**
 * Pure search ranking over build-time V2 index entries.
 *
 * Shared by the Web Worker and the main-thread fallback so both paths
 * rank identically. Covers English, Malayalam, Devanagari, IAST,
 * ASCII-normalised Sanskrit, unit numbers, concepts, texts, traditions
 * and thread steps. No corpus import — entries arrive as JSON.
 */

export interface RankedEntry {
  entry: SearchIndexEntry;
  score: number;
}

/**
 * One-line summary for a concept result, preferring the requested
 * language. Index `en`/`ml` fold title + summary, so the title prefix is
 * stripped to avoid repeating the row heading.
 */
export function conceptSummary(entry: SearchIndexEntry, lang: 'en' | 'ml'): string {
  const blob = (lang === 'ml' && entry.ml ? entry.ml : entry.en) || '';
  const title = entry.title || '';
  let rest = blob;
  if (title && rest.startsWith(title)) rest = rest.slice(title.length);
  const firstLine = rest.split('\n').map((s) => s.trim()).filter(Boolean)[0] || '';
  return firstLine.slice(0, 120);
}

export function normaliseLatin(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Joiner-free, single-spaced form for Indic-script matching. */
export function canonIndic(text: string): string {
  if (!text) return '';
  return text
    .replace(/[‌‍﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function rankEntries(entries: SearchIndexEntry[], rawQuery: string, limit = 200): RankedEntry[] {
  const query = rawQuery.trim();
  if (!query) return [];
  const lower = query.toLowerCase();
  const norm = normaliseLatin(query);
  const canon = canonIndic(query);
  const out: RankedEntry[] = [];

  for (const entry of entries) {
    let score = 0;

    if (entry.kind === 'unit' && entry.number) {
      const numLower = entry.number.toLowerCase();
      if (numLower === lower) score += 120;
      else if (numLower.includes(lower)) score += 60;
    }

    const iastLower = (entry.iast || '').toLowerCase();
    if (iastLower && iastLower.includes(lower)) score += 45;
    else if (norm && entry.normalised.includes(norm)) score += 40;

    if (canon && entry.devanagari && canonIndic(entry.devanagari).includes(canon)) score += 50;

    const enLower = (entry.en || '').toLowerCase();
    if (enLower.includes(lower)) score += 30;
    else if (norm && normaliseLatin(entry.en || '').includes(norm)) score += 25;

    if (canon && entry.ml && canonIndic(entry.ml).includes(canon)) score += 35;

    if (entry.title) {
      const titleLower = entry.title.toLowerCase();
      if (titleLower.includes(lower)) score += 28;
      else if (norm && normaliseLatin(entry.title).includes(norm)) score += 22;
    }

    if (score > 0) out.push({ entry, score });
  }

  out.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.key < b.entry.key ? -1 : 1;
  });
  return out.slice(0, limit);
}
