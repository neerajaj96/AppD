import { SCHEMA_VERSION, type V2Corpus, type V2TextManifest } from './schema';

/**
 * Chunking foundation — the architecture that stops the app shipping the
 * whole corpus as one giant JavaScript module.
 *
 * A future text loads independently through stable chunk addresses:
 *
 *   /content/<text>/manifest
 *   /content/<text>/section/<section>
 *   /content/<text>/units/...
 *   /content/<text>/concepts/...
 *
 * Runtime code discovers texts through manifests, never by importing
 * every content file to see what exists. This module defines the manifest
 * shape, path helpers and a loader interface; the static JSON emit lands
 * in a later phase, but manifests generated here already describe the
 * real corpus (never fabricated counts).
 */

export const CONTENT_BASE_PATH = '/content';

export function manifestPath(textId: string): string {
  return `${CONTENT_BASE_PATH}/${textId}/manifest`;
}

export function sectionPath(textId: string, section: string): string {
  const safe = encodeURIComponent(section || 'unsectioned');
  return `${CONTENT_BASE_PATH}/${textId}/section/${safe}`;
}

export function unitChunkPath(textId: string, unitId: string): string {
  return `${CONTENT_BASE_PATH}/${textId}/units/${encodeURIComponent(unitId)}`;
}

export function conceptChunkPath(textId: string, conceptId: string): string {
  return `${CONTENT_BASE_PATH}/${textId}/concepts/${encodeURIComponent(conceptId)}`;
}

export function languageChunkPath(textId: string, lang: 'en' | 'ml'): string {
  return `${CONTENT_BASE_PATH}/${textId}/lang/${lang}`;
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

/** Minimal loader contract for independently fetched text chunks. */
export interface TextChunkLoader {
  listManifests(): Promise<V2TextManifest[]>;
  loadManifest(textId: string): Promise<V2TextManifest | undefined>;
  loadUnits(textId: string, section?: string): Promise<unknown[]>;
  loadConcepts(textId: string): Promise<unknown[]>;
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
