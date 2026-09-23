import type { CanonicalUnit, V2Concept, V2Corpus, V2Text, Tradition } from './schema';
import { buildAliasTable, normaliseId, resolveAlias } from './ids';

/**
 * Canonical reference graph over validated V2 IDs.
 *
 * Unlike the legacy fuzzy graph (`src/utils/references.ts`), every lookup
 * here is backed by canonical IDs. Ambiguous human aliases never resolve
 * silently — they return an explicit ambiguity state so the UI can offer
 * a disambiguation choice instead of linking to an arbitrary result.
 */

export type LookupResult<T> =
  | { status: 'found'; value: T }
  | { status: 'missing'; id: string }
  | { status: 'ambiguous'; candidates: string[] };

export class V2Graph {
  private corpus: V2Corpus;
  private unitIndex = new Map<string, { text: V2Text; unit: CanonicalUnit }>();
  private conceptIndex = new Map<string, Array<{ text: V2Text; concept: V2Concept }>>();
  private textIndex = new Map<string, V2Text>();
  private traditionIndex = new Map<string, Tradition>();

  constructor(corpus: V2Corpus) {
    this.corpus = corpus;
    for (const tradition of corpus.traditions) this.traditionIndex.set(tradition.id, tradition);
    for (const text of corpus.texts) {
      this.textIndex.set(`${text.traditionId}/${text.id}`, text);
      this.textIndex.set(text.id, text);
      for (const unit of text.units) {
        this.unitIndex.set(`${text.traditionId}/${text.id}/${unit.id}`, { text, unit });
        if (!this.unitIndex.has(unit.id)) this.unitIndex.set(unit.id, { text, unit });
      }
      for (const concept of text.concepts) {
        const key = `${text.traditionId}/${text.id}/${concept.id}`;
        const list = this.conceptIndex.get(concept.id) || [];
        list.push({ text, concept });
        this.conceptIndex.set(concept.id, list);
        this.conceptIndex.set(key, [{ text, concept }]);
      }
    }
  }

  getTradition(id: string): LookupResult<Tradition> {
    const hit = this.traditionIndex.get(id);
    return hit ? { status: 'found', value: hit } : { status: 'missing', id };
  }

  getText(traditionId: string, textId: string): LookupResult<V2Text> {
    const hit = this.textIndex.get(`${traditionId}/${textId}`) || this.textIndex.get(textId);
    return hit ? { status: 'found', value: hit } : { status: 'missing', id: `${traditionId}/${textId}` };
  }

  getUnit(traditionId: string, textId: string, unitId: string): LookupResult<CanonicalUnit> {
    const hit =
      this.unitIndex.get(`${traditionId}/${textId}/${unitId}`) || this.unitIndex.get(unitId);
    return hit ? { status: 'found', value: hit.unit } : { status: 'missing', id: unitId };
  }

  getConcept(traditionId: string, textId: string, conceptId: string): LookupResult<V2Concept> {
    const scoped = this.conceptIndex.get(`${traditionId}/${textId}/${conceptId}`);
    if (scoped && scoped.length > 0) return { status: 'found', value: scoped[0]?.concept as V2Concept };
    const all = this.conceptIndex.get(conceptId) || [];
    if (all.length === 1) return { status: 'found', value: all[0]?.concept as V2Concept };
    if (all.length > 1) {
      return {
        status: 'ambiguous',
        candidates: all.map((h) => `${h.text.traditionId}/${h.text.id}/${h.concept.id}`),
      };
    }
    // Alias fallback across the corpus alias table.
    const table = buildAliasTable(this.corpus.aliases || []);
    const resolved = resolveAlias(conceptId, table);
    if (resolved.status === 'resolved') {
      const target = this.conceptIndex.get(resolved.canonicalId);
      if (target && target.length > 0) return { status: 'found', value: target[0]?.concept as V2Concept };
    }
    if (resolved.status === 'ambiguous') return { status: 'ambiguous', candidates: resolved.candidates };
    return { status: 'missing', id: conceptId };
  }

  getConceptUnits(traditionId: string, textId: string, conceptId: string): CanonicalUnit[] {
    const concept = this.getConcept(traditionId, textId, conceptId);
    if (concept.status !== 'found') return [];
    const ids = concept.value.relatedUnitIds || [];
    const text = this.textIndex.get(`${traditionId}/${textId}`) || this.textIndex.get(textId);
    if (!text) return [];
    const byId = new Map(text.units.map((u) => [u.id, u]));
    return ids.flatMap((id) => (byId.get(id) ? [byId.get(id) as CanonicalUnit] : []));
  }

  getUnitConcepts(traditionId: string, textId: string, unitId: string): V2Concept[] {
    const unit = this.getUnit(traditionId, textId, unitId);
    if (unit.status !== 'found') return [];
    const text = this.textIndex.get(`${traditionId}/${textId}`) || this.textIndex.get(textId);
    if (!text) return [];
    const byId = new Map(text.concepts.map((c) => [c.id, c]));
    return (unit.value.conceptIds || []).flatMap((id) => (byId.get(id) ? [byId.get(id) as V2Concept] : []));
  }

  getRelatedConcepts(traditionId: string, textId: string, conceptId: string, limit = 12): V2Concept[] {
    const concept = this.getConcept(traditionId, textId, conceptId);
    if (concept.status !== 'found') return [];
    const text = this.textIndex.get(`${traditionId}/${textId}`) || this.textIndex.get(textId);
    if (!text) return [];
    const byId = new Map(text.concepts.map((c) => [c.id, c]));
    const out: V2Concept[] = [];
    const seen = new Set([conceptId]);
    for (const cid of concept.value.relatedConceptIds || []) {
      if (out.length >= limit) break;
      if (seen.has(cid)) continue;
      const hit = byId.get(cid);
      if (hit) {
        seen.add(cid);
        out.push(hit);
      }
    }
    // Cross-tradition occurrences of the same normalised concept.
    if (out.length < limit) {
      const norm = normaliseId(conceptId);
      for (const otherText of this.corpus.texts) {
        if (out.length >= limit) break;
        if (otherText.id === text.id && otherText.traditionId === text.traditionId) continue;
        for (const other of otherText.concepts) {
          if (out.length >= limit) break;
          if (normaliseId(other.id) === norm && !seen.has(other.id)) {
            seen.add(other.id);
            out.push(other);
          }
        }
      }
    }
    return out;
  }

  getCrossTraditionRelations(conceptId: string): Array<{ traditionId: string; textId: string; concept: V2Concept }> {
    const norm = normaliseId(conceptId);
    const out: Array<{ traditionId: string; textId: string; concept: V2Concept }> = [];
    for (const text of this.corpus.texts) {
      for (const concept of text.concepts) {
        if (normaliseId(concept.id) === norm) {
          out.push({ traditionId: text.traditionId, textId: text.id, concept });
        }
      }
    }
    return out;
  }

  getThreadReferences(traditionId: string, textId: string): Array<{ stepId: string; conceptId?: string; unitIds: string[] }> {
    const text = this.textIndex.get(`${traditionId}/${textId}`) || this.textIndex.get(textId);
    if (!text?.threads) return [];
    return text.threads.flatMap((thread) =>
      thread.steps.map((step) => ({ stepId: step.id, conceptId: step.conceptId, unitIds: step.unitIds || [] })),
    );
  }
}

export function createGraph(corpus: V2Corpus): V2Graph {
  return new V2Graph(corpus);
}
