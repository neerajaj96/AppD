import type { SearchIndexEntry } from '../content/v2/search-index';
import { mergeRankedSets, rankEntries, selectShardTexts, type RankedEntry } from './rank';

/**
 * Tiered search engine shared by the Web Worker and the main-thread
 * fallback, so both paths fetch, cache and rank identically.
 *
 * Per query: rank the tiny discovery index → name candidate texts from
 * its hits → fetch only missing shards (bounded, failures tolerated) →
 * rank the union. Shard JSON stays cached for the session, so repeated
 * and neighbouring queries cost no further downloads.
 */

export interface TieredFetcher {
  fetchJson<T>(url: string): Promise<T>;
}

export interface TieredSearchUrls {
  discovery: string;
  discoveryMl: string;
  shard: (textId: string) => string;
}

/** Malayalam-script detection: these queries need the ml discovery file. */
export function needsMalayalamDiscovery(query: string, lang: 'en' | 'ml'): boolean {
  if (lang === 'ml') return true;
  return /[ഀ-ൗ]/.test(query);
}

/**
 * Merge the companion ml discovery file into the base entries by stable
 * key: ml blobs and folds join the base entry, everything else stays.
 * Pure and deterministic; missing ml rows degrade to base-only.
 */
export function mergeDiscovery(
  base: SearchIndexEntry[],
  ml: SearchIndexEntry[] | undefined,
): SearchIndexEntry[] {
  if (!ml || ml.length === 0) return base;
  const mlByKey = new Map(ml.map((e) => [e.key, e]));
  return base.map((entry) => {
    const other = mlByKey.get(entry.key);
    if (!other || !other.ml) return entry;
    return {
      ...entry,
      ml: other.ml,
      normalised: `${entry.normalised} \n ${other.normalised}`,
    };
  });
}

export class TieredSearch {
  private discovery: SearchIndexEntry[] | undefined;
  private discoveryPromise: Promise<SearchIndexEntry[]> | undefined;
  private mergedMl = false;
  private shards = new Map<string, SearchIndexEntry[]>();

  constructor(
    private urls: TieredSearchUrls,
    private fetcher: TieredFetcher,
  ) {}

  /** Texts whose shards are resident (test seam + diagnostics). */
  loadedTexts(): string[] {
    return Array.from(this.shards.keys());
  }

  hasDiscovery(): boolean {
    return this.discovery !== undefined;
  }

  private async loadFile(url: string): Promise<SearchIndexEntry[]> {
    const index = await this.fetcher.fetchJson<{ entries: SearchIndexEntry[] }>(url);
    return index.entries;
  }

  async ensureDiscovery(lang: 'en' | 'ml' = 'en', query = ''): Promise<SearchIndexEntry[]> {
    if (this.discovery && (!needsMalayalamDiscovery(query, lang) || this.mergedMl)) {
      return this.discovery;
    }
    if (!this.discoveryPromise) {
      this.discoveryPromise = this.loadFile(this.urls.discovery)
        .then((entries) => {
          this.discovery = entries;
          return entries;
        })
        .catch((error: Error) => {
          this.discoveryPromise = undefined;
          throw error;
        });
    }
    const base = await this.discoveryPromise;
    if (!needsMalayalamDiscovery(query, lang)) return base;
    // Malayalam companion merges in by key; a failed ml fetch degrades
    // to base-only rather than failing the whole query.
    try {
      const ml = await this.loadFile(this.urls.discoveryMl);
      this.mergedMl = true;
      this.discovery = mergeDiscovery(base, ml);
      return this.discovery;
    } catch {
      return base;
    }
  }

  /** Fetch one text shard; missing/failed shards resolve false, never throw. */
  private async ensureShard(textId: string): Promise<boolean> {
    if (this.shards.has(textId)) return true;
    try {
      const shard = await this.fetcher.fetchJson<{ entries: SearchIndexEntry[] }>(this.urls.shard(textId));
      this.shards.set(textId, shard.entries);
      return true;
    } catch {
      return false;
    }
  }

  async query(rawQuery: string, limit = 200, lang: 'en' | 'ml' = 'en'): Promise<RankedEntry[]> {
    const query = rawQuery.trim();
    if (!query) return [];
    const discovery = await this.ensureDiscovery(lang, query);
    const discoveryHits = rankEntries(discovery, query, limit);
    const wanted = selectShardTexts(discoveryHits, new Set(this.shards.keys()));
    await Promise.all(wanted.map((textId) => this.ensureShard(textId)));
    return mergeRankedSets(discovery, this.shards, query, limit);
  }
}
