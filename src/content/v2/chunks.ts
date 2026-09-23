import {
  SCHEMA_VERSION,
  type CanonicalUnit,
  type ContentStatus,
  type SourceRole,
  type Tradition,
  type V2Concept,
  type V2Corpus,
  type V2TextManifest,
  type V2Thread,
} from './schema';

/**
 * Chunked content delivery — the runtime replacement for importing the
 * entire corpus as one JavaScript module.
 *
 * Build-time (`scripts/build-content-chunks.ts`) emits deterministic JSON
 * under `public/content/`:
 *
 *   content/manifest.json                  global catalog (traditions + text summaries)
 *   content/<text>/manifest.json            per-text manifest + meta + sections
 *   content/<text>/meta.json                light text meta (no units)
 *   content/<text>/threads.json             per-text thread slices
 *   content/<text>/units/index.json         section → chunk map
 *   content/<text>/units/chunk-N.json       canonical units (≤150 per chunk)
 *   content/<text>/concepts/index.json      chunk map
 *   content/<text>/concepts/chunk-N.json    concepts (≤200 per chunk)
 *   content/threads/<tradition>.json        full tradition thread
 *   content/search-index.json               build-time search index
 *
 * Runtime discovers texts through the global manifest only. Chunks are
 * fetched on demand, cached in memory, and every failure is typed so the
 * UI can render honest loading / missing / offline states.
 */

/** Base is relative so GitHub Pages project sites keep working. */
export function contentBase(): string {
  const base = import.meta.env.BASE_URL || './';
  return base.endsWith('/') ? `${base}content` : `${base}/content`;
}

export function globalManifestUrl(): string {
  return `${contentBase()}/manifest.json`;
}

export function textManifestUrl(textId: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/manifest.json`;
}

export function textMetaUrl(textId: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/meta.json`;
}

export function textThreadsUrl(textId: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/threads.json`;
}

export function traditionThreadUrl(traditionId: string): string {
  return `${contentBase()}/threads/${encodeURIComponent(traditionId)}.json`;
}

export function unitIndexUrl(textId: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/units/index.json`;
}

export function unitChunkUrl(textId: string, file: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/units/${encodeURIComponent(file)}`;
}

export function conceptIndexUrl(textId: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/concepts/index.json`;
}

export function conceptChunkUrl(textId: string, file: string): string {
  return `${contentBase()}/${encodeURIComponent(textId)}/concepts/${encodeURIComponent(file)}`;
}

export function searchIndexUrl(): string {
  return `${contentBase()}/search-index.json`;
}

/** One row of the global catalog — enough to navigate without any chunks. */
export interface TextSummary {
  textId: string;
  traditionId: string;
  title: string;
  transliteratedTitle: string;
  author?: string;
  sourceRole: SourceRole;
  verseTerm?: string;
  contentStatus: ContentStatus;
  unitCount: number;
  conceptCount: number;
  threadSteps: number;
  /** Localised unit coverage, for language badges without loading chunks. */
  languages: { en: number; ml: number };
  sections: Array<{ section: string; count: number }>;
}

export interface TraditionSummary extends Tradition {
  subtitle?: string;
  textIds: string[];
  threadSteps: number;
}

export interface GlobalManifest {
  schemaVersion: typeof SCHEMA_VERSION;
  generatedAt: string;
  traditions: TraditionSummary[];
  texts: TextSummary[];
}

/** Per-text manifest file: counts plus the meta a text page needs. */
export interface TextManifestFile extends V2TextManifest {
  title: string;
  transliteratedTitle: string;
  author?: string;
  verseTerm?: string;
  sections: Array<{ section: string; count: number }>;
  conceptCount: number;
  threadSteps: number;
}

export interface UnitIndexFile {
  textId: string;
  unitCount: number;
  sections: Array<{ section: string; count: number; chunk: string }>;
  chunks: string[];
}

export interface ConceptIndexFile {
  textId: string;
  conceptCount: number;
  chunks: string[];
}

export type LoadStatus = 'ok' | 'missing' | 'offline' | 'error';

export type LoadResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'missing' | 'offline' | 'error'; message: string };

export type FetchImpl = (url: string) => Promise<Response>;

/** Minimal loader contract for independently fetched text chunks. */
export interface TextChunkLoader {
  listManifests(): Promise<V2TextManifest[]>;
  loadManifest(textId: string): Promise<V2TextManifest | undefined>;
  loadUnits(textId: string, section?: string): Promise<CanonicalUnit[]>;
  loadConcepts(textId: string): Promise<V2Concept[]>;
}

/** In-memory loader over an adapted corpus — used by tests and the CLI. */
export function createMemoryLoader(corpus: V2Corpus): TextChunkLoader {
  const manifests = buildAllManifests(corpus);
  return {
    async listManifests() {
      return manifests;
    },
    async loadManifest(textId: string) {
      return manifests.find((m) => m.textId === textId);
    },
    async loadUnits(textId: string, section?: string) {
      const text = corpus.texts.find((t) => t.id === textId);
      if (!text) return [];
      return section ? text.units.filter((u) => u.section === section) : text.units;
    },
    async loadConcepts(textId: string) {
      return corpus.texts.find((t) => t.id === textId)?.concepts || [];
    },
  };
}

/** Manifest for one text, derived from actual adapted data. */
export function buildManifest(
  text: { id: string; traditionId: string; contentStatus: V2TextManifest['status']; units: Array<{ localisations: { en?: unknown; ml?: unknown } }>; concepts: Array<{ localisations: { en?: unknown; ml?: unknown } }>; provenance?: V2TextManifest['source'] },
  expectedUnits?: number,
): V2TextManifest {
  const present = text.units.length;
  const enUnits = text.units.filter((u) => u.localisations.en).length;
  const mlUnits = text.units.filter((u) => u.localisations.ml).length;
  const enConcepts = text.concepts.filter((c) => c.localisations.en).length;
  const mlConcepts = text.concepts.filter((c) => c.localisations.ml).length;
  return {
    schemaVersion: SCHEMA_VERSION,
    textId: text.id,
    traditionId: text.traditionId,
    units: { expected: expectedUnits ?? present, present },
    languages: {
      en: { units: enUnits, concepts: enConcepts },
      ml: { units: mlUnits, concepts: mlConcepts },
    },
    status: text.contentStatus,
    source: text.provenance,
  };
}

export function buildAllManifests(corpus: V2Corpus): V2TextManifest[] {
  return corpus.texts.map((text) => buildManifest(text));
}

function defaultFetch(): FetchImpl | undefined {
  if (typeof fetch !== 'undefined') return fetch.bind(globalThis);
  return undefined;
}

function classifyError(error: unknown): LoadResult<never> {
  const message = error instanceof Error ? error.message : String(error);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { status: 'offline', message: 'Device is offline' };
  }
  if (/offline|network|fetch|load failed/i.test(message)) {
    return { status: 'offline', message };
  }
  return { status: 'error', message };
}

/**
 * Browser fetch loader with in-memory caching. Every chunk is fetched at
 * most once per session; failures are typed, never thrown, so screens can
 * distinguish a missing text from a lost connection.
 */
export class FetchChunkLoader {
  private fetchImpl: FetchImpl | undefined;
  private cache = new Map<string, unknown>();

  constructor(fetchImpl?: FetchImpl) {
    this.fetchImpl = fetchImpl || defaultFetch();
  }

  /** Drop cached chunks (used by tests and cache-busting flows). */
  clearCache(): void {
    this.cache.clear();
  }

  private async getJson<T>(url: string): Promise<LoadResult<T>> {
    if (this.cache.has(url)) return { status: 'ok', data: this.cache.get(url) as T };
    if (!this.fetchImpl) return { status: 'error', message: 'No fetch implementation available' };
    let response: Response;
    try {
      response = await this.fetchImpl(url);
    } catch (error) {
      return classifyError(error);
    }
    if (response.status === 404) return { status: 'missing', message: `Not found: ${url}` };
    if (!response.ok) return { status: 'error', message: `Request failed (${response.status}): ${url}` };
    try {
      const data = (await response.json()) as T;
      this.cache.set(url, data);
      return { status: 'ok', data };
    } catch (error) {
      return { status: 'error', message: `Malformed JSON: ${url} (${error instanceof Error ? error.message : String(error)})` };
    }
  }

  loadGlobalManifest(): Promise<LoadResult<GlobalManifest>> {
    return this.getJson<GlobalManifest>(globalManifestUrl());
  }

  loadTextManifest(textId: string): Promise<LoadResult<TextManifestFile>> {
    return this.getJson<TextManifestFile>(textManifestUrl(textId));
  }

  loadTextMeta(textId: string): Promise<LoadResult<TextManifestFile>> {
    return this.getJson<TextManifestFile>(textMetaUrl(textId));
  }

  loadTextThreads(textId: string): Promise<LoadResult<V2Thread[]>> {
    return this.getJson<V2Thread[]>(textThreadsUrl(textId));
  }

  loadTraditionThread(traditionId: string): Promise<LoadResult<V2Thread[]>> {
    return this.getJson<V2Thread[]>(traditionThreadUrl(traditionId));
  }

  async loadUnits(textId: string, section?: string): Promise<LoadResult<CanonicalUnit[]>> {
    const index = await this.getJson<UnitIndexFile>(unitIndexUrl(textId));
    if (index.status !== 'ok') return index;
    const wanted = section
      ? index.data.sections.filter((s) => s.section === section)
      : index.data.sections;
    if (section && wanted.length === 0) {
      return { status: 'missing', message: `No such section in ${textId}: ${section}` };
    }
    const files = Array.from(new Set(wanted.map((s) => s.chunk)));
    const out: CanonicalUnit[] = [];
    for (const file of files) {
      const chunk = await this.getJson<CanonicalUnit[]>(unitChunkUrl(textId, file));
      if (chunk.status !== 'ok') return chunk;
      out.push(...(section ? chunk.data.filter((u) => u.section === section) : chunk.data));
    }
    return { status: 'ok', data: out };
  }

  /** Fetch one unit without loading sibling chunks when the index allows it. */
  async loadUnit(textId: string, unitId: string): Promise<LoadResult<CanonicalUnit>> {
    const all = await this.loadUnits(textId);
    if (all.status !== 'ok') return all;
    const hit = all.data.find((u) => u.id === unitId);
    return hit ? { status: 'ok', data: hit } : { status: 'missing', message: `No such unit: ${textId}/${unitId}` };
  }

  async loadConcepts(textId: string): Promise<LoadResult<V2Concept[]>> {
    const index = await this.getJson<ConceptIndexFile>(conceptIndexUrl(textId));
    if (index.status !== 'ok') return index;
    const out: V2Concept[] = [];
    for (const file of index.data.chunks) {
      const chunk = await this.getJson<V2Concept[]>(conceptChunkUrl(textId, file));
      if (chunk.status !== 'ok') return chunk;
      out.push(...chunk.data);
    }
    return { status: 'ok', data: out };
  }

  async loadConcept(textId: string, conceptId: string): Promise<LoadResult<V2Concept>> {
    const all = await this.loadConcepts(textId);
    if (all.status !== 'ok') return all;
    const hit = all.data.find((c) => c.id === conceptId);
    return hit ? { status: 'ok', data: hit } : { status: 'missing', message: `No such concept: ${textId}/${conceptId}` };
  }
}
