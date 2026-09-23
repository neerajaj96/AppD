/**
 * Offline foundation (V2) — cache strategy and content-pack architecture.
 *
 * Desired strategy (documented before the handwritten worker is replaced):
 * - App shell (`index.html`, JS/CSS, manifest, icons): cache-first with a
 *   versioned `darsana-shell-vN` cache, refreshed on deploy.
 * - Metadata (text manifests, search-index header): stale-while-revalidate
 *   in `darsana-meta-vN` so navigation stays instant but discovers updates.
 * - Content packs (per-text JSON chunks under `/content/<text>/…`):
 *   on-demand cache-first in `darsana-text-<id>-vN`; users pin texts for
 *   offline study and unpinned packs expire by least-recent use.
 * - Cache versioning: every cache name carries the schema/manifest version;
 *   activation deletes older generations. Offline status is exposed through
 *   a small observable so the UI can explain what is available offline.
 */

export const CACHE_VERSION = 'v2';

export function shellCacheName(): string {
  return `darsana-shell-${CACHE_VERSION}`;
}

export function metaCacheName(): string {
  return `darsana-meta-${CACHE_VERSION}`;
}

export function textPackCacheName(textId: string): string {
  const safe = textId.replace(/[^a-z0-9-]+/gi, '-').toLowerCase() || 'unknown';
  return `darsana-text-${safe}-${CACHE_VERSION}`;
}

export interface OfflineStatus {
  online: boolean;
  pinnedTexts: string[];
  availablePacks: string[];
}

export function offlineStatusKey(): string {
  return 'darsana_offline_status_v2';
}

export type OfflineStrategy = 'cache-first' | 'stale-while-revalidate' | 'network-first';

export const cacheStrategy: Record<'shell' | 'metadata' | 'contentPack', OfflineStrategy> = {
  shell: 'cache-first',
  metadata: 'stale-while-revalidate',
  contentPack: 'cache-first',
};
