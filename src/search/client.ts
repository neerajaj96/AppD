import { searchIndexUrl, aliasesUrl } from '../content/v2/chunks';
import type { SearchIndex, SearchIndexEntry } from '../content/v2/search-index';
import { buildAliasTable, resolveAlias, type AliasResolution } from '../content/v2/ids';
import { verifiedAliases, type AliasFile } from '../content/v2/aliases';
import { rankEntries, type RankedEntry } from './rank';

/**
 * Search client — queries the generated V2 index without importing the
 * corpus. Prefers a Web Worker; falls back to main-thread ranking when
 * workers are unavailable or fail. The index JSON loads lazily on first
 * query and is then cached for the session.
 */

type Pending = {
  resolve: (value: RankedEntry[]) => void;
  reject: (reason: Error) => void;
};

class SearchClient {
  private worker: Worker | undefined;
  private workerFailed = false;
  private workerLoaded = false;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private mainEntries: SearchIndexEntry[] | undefined;
  private mainPromise: Promise<SearchIndexEntry[]> | undefined;
  private aliasTable: Map<string, string[]> | undefined;
  private aliasPromise: Promise<Map<string, string[]> | undefined> | undefined;

  private ensureWorker(): Worker | undefined {
    if (this.worker || this.workerFailed) return this.worker;
    try {
      if (typeof Worker === 'undefined') return undefined;
      const worker = new Worker(new URL('./search-worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent) => {
        const data = event.data as { id: number; type: string; results?: RankedEntry[]; message?: string };
        const entry = this.pending.get(data.id);
        if (!entry) return;
        this.pending.delete(data.id);
        if (data.type === 'results' && data.results) entry.resolve(data.results);
        else entry.reject(new Error(data.message || 'Search worker failed'));
      };
      worker.onerror = () => {
        this.workerFailed = true;
        for (const [, entry] of this.pending) entry.reject(new Error('Search worker failed'));
        this.pending.clear();
        try {
          worker.terminate();
        } catch {
          // Already gone; the fallback path takes over.
        }
        this.worker = undefined;
      };
      this.worker = worker;
      return worker;
    } catch {
      this.workerFailed = true;
      return undefined;
    }
  }

  private send<T>(message: object): Promise<T> {
    const worker = this.ensureWorker();
    if (!worker) return Promise.reject(new Error('No worker'));
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, {
        resolve: resolve as (value: RankedEntry[]) => void,
        reject,
      });
      worker.postMessage({ ...message, id });
    });
  }

  private async loadMainEntries(): Promise<SearchIndexEntry[]> {
    if (this.mainEntries) return this.mainEntries;
    if (!this.mainPromise) {
      this.mainPromise = fetch(searchIndexUrl())
        .then(async (response) => {
          if (!response.ok) throw new Error(`Search index request failed (${response.status})`);
          const index = (await response.json()) as SearchIndex;
          this.mainEntries = index.entries;
          return index.entries;
        })
        .catch((error: Error) => {
          this.mainPromise = undefined;
          throw error;
        });
    }
    return this.mainPromise;
  }

  /** Ranked results for a query; empty for blank input. Never throws. */
  async search(query: string, limit = 200): Promise<RankedEntry[]> {
    if (!query.trim()) return [];
    const worker = this.ensureWorker();
    if (worker && !this.workerFailed) {
      try {
        // The worker keeps the index for its lifetime; load once, then
        // query against the resident entries.
        if (!this.workerLoaded) {
          await this.send<{ entries: number }>({ type: 'load', url: searchIndexUrl() });
          this.workerLoaded = true;
        }
        return await this.send<RankedEntry[]>({ type: 'query', query, limit });
      } catch {
        // Fall through to main-thread ranking below.
      }
    }
    try {
      const entries = await this.loadMainEntries();
      return rankEntries(entries, query, limit);
    } catch {
      return [];
    }
  }

  /** Same-concept occurrences across traditions (cross-darshana links). */
  async findConceptsById(conceptId: string): Promise<RankedEntry[]> {
    if (!conceptId) return [];
    try {
      const entries = await this.loadMainEntries();
      const norm = conceptId.toLowerCase();
      return entries
        .filter((e) => e.kind === 'concept' && (e.conceptId === conceptId || (e.conceptId || '').toLowerCase() === norm))
        .map((entry) => ({ entry, score: 1 }));
    } catch {
      return [];
    }
  }

  /**
   * Editorial alias lookup for a raw query (verified rows only — review
   * candidates never resolve). The worker is untouched: this is a tiny
   * main-thread table fetch, and callers build disambiguation rows from
   * the returned canonical triples. Never throws.
   */
  async resolveQueryAlias(query: string): Promise<AliasResolution> {
    const q = query.trim();
    if (!q) return { status: 'missing', alias: query };
    try {
      if (!this.aliasTable && !this.aliasPromise) {
        this.aliasPromise = fetch(aliasesUrl())
          .then(async (response) => {
            if (!response.ok) throw new Error(`Alias table request failed (${response.status})`);
            const file = (await response.json()) as AliasFile;
            const table = buildAliasTable(verifiedAliases(file.aliases || []));
            this.aliasTable = table;
            return table;
          })
          .catch(() => {
            this.aliasPromise = undefined;
            return undefined;
          });
      }
      const table = this.aliasTable || (await this.aliasPromise);
      if (!table) return { status: 'missing', alias: query };
      return resolveAlias(q, table);
    } catch {
      return { status: 'missing', alias: query };
    }
  }
}

let shared: SearchClient | undefined;

export function getSearchClient(): SearchClient {
  if (!shared) shared = new SearchClient();
  return shared;
}

/** Test hook: replace the shared client. */
export function setSearchClient(client: SearchClient | undefined): void {
  shared = client;
}
