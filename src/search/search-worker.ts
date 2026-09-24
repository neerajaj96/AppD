/**
 * Search worker — tiered V2 search off the main thread.
 *
 * Protocol:
 *   main → worker: { id, type: 'init', discoveryUrl, shardPrefix, shardSuffix }
 *   main → worker: { id, type: 'query', query, limit? }
 *   worker → main: { id, type: 'ready' }
 *                 | { id, type: 'results', results }
 *                 | { id, type: 'error', message }
 *
 * URL construction stays on the main thread (document base URI); the
 * worker only fetches. Discovery loads once; text shards load on demand
 * per query plan and stay cached in the worker for the session.
 */
import { TieredSearch } from './tiered';
import type { RankedEntry } from './rank';

type InMessage =
  | { id: number; type: 'init'; discoveryUrl: string; discoveryMlUrl: string; shardPrefix: string; shardSuffix: string }
  | { id: number; type: 'query'; query: string; limit?: number; lang?: 'en' | 'ml' };

type OutMessage =
  | { id: number; type: 'ready' }
  | { id: number; type: 'results'; results: RankedEntry[] }
  | { id: number; type: 'error'; message: string };

let engine: TieredSearch | undefined;

const scope = self as unknown as {
  postMessage: (message: OutMessage) => void;
  onmessage: ((event: MessageEvent<InMessage>) => void) | null;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Search request failed (${response.status}): ${url}`);
  return (await response.json()) as T;
}

scope.onmessage = async (event: MessageEvent<InMessage>) => {
  const message = event.data;
  try {
    if (message.type === 'init') {
      engine = new TieredSearch(
        {
          discovery: message.discoveryUrl,
          discoveryMl: message.discoveryMlUrl,
          shard: (textId: string) => `${message.shardPrefix}${encodeURIComponent(textId)}${message.shardSuffix}`,
        },
        { fetchJson },
      );
      await engine.ensureDiscovery();
      scope.postMessage({ id: message.id, type: 'ready' });
      return;
    }
    if (message.type === 'query') {
      if (!engine) {
        scope.postMessage({ id: message.id, type: 'error', message: 'Search engine not initialised' });
        return;
      }
      const results = await engine.query(message.query, message.limit || 200, message.lang || 'en');
      scope.postMessage({ id: message.id, type: 'results', results });
    }
  } catch (error) {
    scope.postMessage({ id: message.id, type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

export {};
