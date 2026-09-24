import { normaliseId } from './ids';
import type { V2Concept, CanonicalUnit } from './schema';
import { SCHEMA_VERSION } from './schema';

/**
 * Cross-text concept occurrence index (Prompt 5 — knowledge layer).
 *
 * A concept must not be trapped inside one text. This build-time index
 * maps each normalised concept identity to every text occurrence, with
 * just enough unit metadata (id, number, section) to render source rows
 * and counts. Actual unit content still loads lazily per text through
 * the repository — the browser never fetches full units to discover
 * occurrences.
 *
 * Distinct canonical identities are preserved: one normalised key may
 * hold several occurrences with different tradition/text/conceptId
 * triples, and they are never merged into a single doctrine.
 */

export interface OccurrenceUnit {
  unitId: string;
  number: string;
  section: string;
}

export interface ConceptOccurrence {
  traditionId: string;
  textId: string;
  conceptId: string;
  title: string;
  titleMl?: string;
  unitCount: number;
  units: OccurrenceUnit[];
}

export interface ConceptIndexEntry {
  /** Normalised concept identity (diacritic/case/separator-insensitive). */
  key: string;
  occurrences: ConceptOccurrence[];
}

export interface ConceptOccurrenceIndex {
  schemaVersion: typeof SCHEMA_VERSION;
  generatedAt: string;
  concepts: ConceptIndexEntry[];
}

export interface OccurrenceTextInput {
  traditionId: string;
  textId: string;
  concepts: V2Concept[];
  units: CanonicalUnit[];
}

/** Deterministic build: texts in (traditionId, textId) order, units in chunk order. */
export function buildConceptOccurrenceIndex(texts: OccurrenceTextInput[]): ConceptOccurrenceIndex {
  const buckets = new Map<string, ConceptOccurrence[]>();
  const ordered = [...texts].sort(
    (a, b) => (a.traditionId === b.traditionId ? (a.textId < b.textId ? -1 : 1) : a.traditionId < b.traditionId ? -1 : 1),
  );
  for (const text of ordered) {
    const unitsById = new Map(text.units.map((u) => [u.id, u]));
    const concepts = [...text.concepts].sort((a, b) => (a.id < b.id ? -1 : 1));
    for (const concept of concepts) {
      const key = normaliseId(concept.id);
      if (!key) continue;
      const units: OccurrenceUnit[] = [];
      for (const uid of concept.relatedUnitIds || []) {
        const unit = unitsById.get(uid);
        if (unit) units.push({ unitId: unit.id, number: unit.number, section: unit.section });
      }
      const occurrence: ConceptOccurrence = {
        traditionId: text.traditionId,
        textId: text.textId,
        conceptId: concept.id,
        title: concept.localisations.en?.title || concept.id,
        titleMl: concept.localisations.ml?.title || undefined,
        unitCount: units.length,
        units,
      };
      const list = buckets.get(key);
      if (list) list.push(occurrence);
      else buckets.set(key, [occurrence]);
    }
  }
  const concepts: ConceptIndexEntry[] = Array.from(buckets.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, occurrences]) => ({ key, occurrences }));
  return { schemaVersion: SCHEMA_VERSION, generatedAt: new Date().toISOString(), concepts };
}

/** Look up occurrences for a concept id (any transliteration variant). */
export function findOccurrences(index: ConceptOccurrenceIndex, conceptId: string): ConceptOccurrence[] {
  const key = normaliseId(conceptId);
  if (!key) return [];
  return index.concepts.find((entry) => entry.key === key)?.occurrences || [];
}

/** Distinct traditions holding an occurrence, in first-seen order. */
export function occurrenceTraditions(occurrences: ConceptOccurrence[]): string[] {
  const out: string[] = [];
  for (const occ of occurrences) {
    if (!out.includes(occ.traditionId)) out.push(occ.traditionId);
  }
  return out;
}
