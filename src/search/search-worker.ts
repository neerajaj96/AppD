/**
 * Search worker — executes V2 index ranking off the main thread.
 *
 * Protocol:
 *   main → worker: { id, type: 'load' } | { id, type: 'query', query, limit }
 *   worker → main: { id, type: 'ready', entries } | { id, type: 'results', results } | { id, type: 'error', message }
 *
 * The index JSON is fetched inside the worker so the main thread never
 * holds the full corpus or the full index during typing.
 */
import { rankEntries } from './rank';
import type { SearchIndex, SearchIndexEntry } from '../content/v2/search-index';

type InMessage =
  | { id: number; type: 'load'; url: string }
  | { id: number; type: 'query'; query: string; limit?: number };

type OutMessage =
  | { id: number; type: 'ready'; entries: number }
  | { id: number; type: 'results'; results: Array<{ entry: SearchIndexEntry; score: number }> }
  | { id: number; type: 'error'; message: string };

let entries: SearchIndexEntry[] | undefined;

const scope = self as unknown as {
  postMessage: (message: OutMessage) => void;
  onmessage: ((event: MessageEvent<InMessage>) => void) | null;
};

scope.onmessage = async (event: MessageEvent<InMessage>) => {
  const message = event.data;
  try {
    if (message.type === 'load') {
      const response = await fetch(message.url);
      if (!response.ok) {
        scope.postMessage({ id: message.id, type: 'error', message: `Search index request failed (${response.status})` });
        return;
      }
      const index = (await response.json()) as SearchIndex;
      entries = index.entries;
      scope.postMessage({ id: message.id, type: 'ready', entries: entries.length });
      return;
    }
    if (message.type === 'query') {
      if (!entries) {
        scope.postMessage({ id: message.id, type: 'error', message: 'Search index not loaded' });
        return;
      }
      const results = rankEntries(entries, message.query, message.limit || 200);
      scope.postMessage({ id: message.id, type: 'results', results });
    }
  } catch (error) {
    scope.postMessage({ id: message.id, type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

export {};
