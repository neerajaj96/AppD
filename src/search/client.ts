import { aliasesUrl, searchDiscoveryMlUrl, searchDiscoveryUrl, searchShardUrl } from '../content/v2/chunks';
import { buildAliasTable, resolveAlias, type AliasResolution } from '../content/v2/ids';
import { verifiedAliases, type AliasFile } from '../content/v2/aliases';
import { TieredSearch } from './tiered';
import type { RankedEntry } from './rank';

/**
 * Search client — tiered V2 search without importing the corpus.
 *
 * First keystrokes cost only the small discovery index; text shards
 * follow the query plan (bounded per query) and stay cached for the
 * session. Prefers the Web Worker; falls back to the identical
 * main-thread engine when workers are unavailable or fail. Alias
 * resolution stays a tiny main-thread table fetch; the worker is
 * untouched by identity concerns.
 */

type Pending = {
  resolve: (value: RankedEntry[] | true) => void;
  reject: (reason: Error) => void;
};

function shardPrefixSuffix(): { prefix: string; suffix: string } {
  // Split around a sentinel text id so the worker can address shards
  // without receiving functions across the message boundary.
  const sentinel = '__TEXT__';
  const sample = searchShardUrl(sentinel);
  const parts = sample.split(sentinel);
  return { prefix: parts[0] || '', suffix: parts[1] || '' };
}

class SearchClient {
  private worker: Worker | undefined;
  private workerFailed = false;
  private workerReady = false;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private fallback: TieredSearch | undefined;
  private aliasTable: Map<string, string[]> | undefined;
  private aliasPromise: Promise<Map<string, string[]> | undefined> | undefined;

  private tieredUrls() {
    return {
      discovery: searchDiscoveryUrl(),
      discoveryMl: searchDiscoveryMlUrl(),
      shard: (textId: string) => searchShardUrl(textId),
    };
  }

  private fallbackEngine(): TieredSearch {
    if (!this.fallback) {
      this.fallback = new TieredSearch(this.tieredUrls(), {
        fetchJson: async <T>(url: string): Promise<T> => {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Search request failed (${response.status}): ${url}`);
          return (await response.json()) as T;
        },
      });
    }
    return this.fallback;
  }

  private ensureWorker(): Worker | undefined {
    if (this.worker || this.workerFailed) return this.worker;
    try {
      if (typeof Worker === 'undefined') return undefined;
      const worker = new Worker(new URL('./search-worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event: MessageEvent) => {
        const data = event.data as
          | { id: number; type: 'ready' }
          | { id: number; type: 'results'; results: RankedEntry[] }
          | { id: number; type: 'error'; message?: string };
        const entry = this.pending.get(data.id);
        if (!entry) return;
        this.pending.delete(data.id);
        if (data.type === 'results') entry.resolve(data.results);
        else if (data.type === 'ready') entry.resolve(true);
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
        resolve: resolve as (value: RankedEntry[] | true) => void,
        reject,
      });
      worker.postMessage({ ...message, id });
    });
  }

  /** Ranked results for a query; empty for blank input. Never throws. */
  async search(query: string, limit = 200, lang: 'en' | 'ml' = 'en'): Promise<RankedEntry[]> {
    if (!query.trim()) return [];
    const worker = this.ensureWorker();
    if (worker && !this.workerFailed) {
      try {
        if (!this.workerReady) {
          const { prefix, suffix } = shardPrefixSuffix();
          await this.send<true>({
            type: 'init',
            discoveryUrl: searchDiscoveryUrl(),
            discoveryMlUrl: searchDiscoveryMlUrl(),
            shardPrefix: prefix,
            shardSuffix: suffix,
          });
          this.workerReady = true;
        }
        return await this.send<RankedEntry[]>({ type: 'query', query, limit, lang });
      } catch {
        // Fall through to main-thread ranking below.
      }
    }
    try {
      return await this.fallbackEngine().query(query, limit, lang);
    } catch {
      return [];
    }
  }

  /**
   * Editorial alias lookup for a raw query (verified rows only — review
   * candidates never resolve). Tiny table fetch, cached. Never throws.
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
