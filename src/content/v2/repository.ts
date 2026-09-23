import {
  FetchChunkLoader,
  type GlobalManifest,
  type LoadResult,
  type TextManifestFile,
  type TextSummary,
  type TraditionSummary,
} from './chunks';
import type { CanonicalUnit, V2Concept, V2Thread } from './schema';

/**
 * V2 content repository — the single runtime gateway to chunked content.
 *
 * React code depends on this layer rather than importing content files.
 * All results are typed `LoadResult`s: callers handle `ok | missing |
 * offline | error` explicitly instead of catching exceptions. Loaded
 * chunks are shared through the underlying loader cache, so opening a
 * verse never refetches its text.
 */
export class V2Repository {
  private loader: FetchChunkLoader;
  private catalog: GlobalManifest | undefined;
  private catalogPromise: Promise<LoadResult<GlobalManifest>> | undefined;

  constructor(loader?: FetchChunkLoader) {
    this.loader = loader || new FetchChunkLoader();
  }

  /** Global catalog (traditions + text summaries). Fetched once, then cached. */
  async getCatalog(): Promise<LoadResult<GlobalManifest>> {
    if (this.catalog) return { status: 'ok', data: this.catalog };
    if (!this.catalogPromise) {
      this.catalogPromise = this.loader.loadGlobalManifest().then((result) => {
        if (result.status === 'ok') this.catalog = result.data;
        else this.catalogPromise = undefined;
        return result;
      });
    }
    return this.catalogPromise;
  }

  async getTraditions(): Promise<LoadResult<TraditionSummary[]>> {
    const catalog = await this.getCatalog();
    if (catalog.status !== 'ok') return catalog;
    return { status: 'ok', data: catalog.data.traditions };
  }

  async getTextSummaries(): Promise<LoadResult<TextSummary[]>> {
    const catalog = await this.getCatalog();
    if (catalog.status !== 'ok') return catalog;
    return { status: 'ok', data: catalog.data.texts };
  }

  async getTextSummary(textId: string): Promise<LoadResult<TextSummary>> {
    const catalog = await this.getCatalog();
    if (catalog.status !== 'ok') return catalog;
    const hit = catalog.data.texts.find((t) => t.textId === textId);
    return hit ? { status: 'ok', data: hit } : { status: 'missing', message: `No such text: ${textId}` };
  }

  async getTradition(traditionId: string): Promise<LoadResult<TraditionSummary>> {
    const catalog = await this.getCatalog();
    if (catalog.status !== 'ok') return catalog;
    const hit = catalog.data.traditions.find((t) => t.id === traditionId);
    return hit ? { status: 'ok', data: hit } : { status: 'missing', message: `No such tradition: ${traditionId}` };
  }

  getTextManifest(textId: string): Promise<LoadResult<TextManifestFile>> {
    return this.loader.loadTextManifest(textId);
  }

  /** Alias kept for readability at call sites dealing with verses/units. */
  getText(textId: string): Promise<LoadResult<TextManifestFile>> {
    return this.loader.loadTextMeta(textId);
  }

  getUnits(textId: string, section?: string): Promise<LoadResult<CanonicalUnit[]>> {
    return this.loader.loadUnits(textId, section);
  }

  getUnit(textId: string, unitId: string): Promise<LoadResult<CanonicalUnit>> {
    return this.loader.loadUnit(textId, unitId);
  }

  getConcepts(textId: string): Promise<LoadResult<V2Concept[]>> {
    return this.loader.loadConcepts(textId);
  }

  getConcept(textId: string, conceptId: string): Promise<LoadResult<V2Concept>> {
    return this.loader.loadConcept(textId, conceptId);
  }

  getThreads(textId: string): Promise<LoadResult<V2Thread[]>> {
    return this.loader.loadTextThreads(textId);
  }

  /** Full tradition thread (all texts), used by ThreadView. */
  getTraditionThread(traditionId: string): Promise<LoadResult<V2Thread[]>> {
    return this.loader.loadTraditionThread(traditionId);
  }

  /** Concepts linked from one unit, resolved within the same text. */
  async getUnitConcepts(textId: string, unitId: string): Promise<LoadResult<V2Concept[]>> {
    const [unit, concepts] = await Promise.all([this.getUnit(textId, unitId), this.getConcepts(textId)]);
    if (unit.status !== 'ok') return unit;
    if (concepts.status !== 'ok') return concepts;
    const byId = new Map(concepts.data.map((c) => [c.id, c]));
    return { status: 'ok', data: (unit.data.conceptIds || []).flatMap((id) => (byId.get(id) ? [byId.get(id) as V2Concept] : [])) };
  }

  /** Units linked from one concept, resolved within the same text. */
  async getConceptUnits(textId: string, conceptId: string): Promise<LoadResult<CanonicalUnit[]>> {
    const [concept, units] = await Promise.all([this.getConcept(textId, conceptId), this.getUnits(textId)]);
    if (concept.status !== 'ok') return concept;
    if (units.status !== 'ok') return units;
    const byId = new Map(units.data.map((u) => [u.id, u]));
    return { status: 'ok', data: (concept.data.relatedUnitIds || []).flatMap((id) => (byId.get(id) ? [byId.get(id) as CanonicalUnit] : [])) };
  }

  /** Concepts related to one concept: explicit links, then verse co-occurrence. */
  async getRelatedConcepts(textId: string, conceptId: string, limit = 12): Promise<LoadResult<V2Concept[]>> {
    const [concept, concepts] = await Promise.all([this.getConcept(textId, conceptId), this.getConcepts(textId)]);
    if (concept.status !== 'ok') return concept;
    if (concepts.status !== 'ok') return concepts;
    const byId = new Map(concepts.data.map((c) => [c.id, c]));
    const out: V2Concept[] = [];
    const seen = new Set([conceptId]);
    for (const cid of concept.data.relatedConceptIds || []) {
      if (out.length >= limit) break;
      const hit = byId.get(cid);
      if (hit && !seen.has(cid)) {
        seen.add(cid);
        out.push(hit);
      }
    }
    if (out.length < limit) {
      const mine = new Set(concept.data.relatedUnitIds || []);
      const scored: Array<{ concept: V2Concept; shared: number }> = [];
      for (const other of concepts.data) {
        if (other.id === conceptId || seen.has(other.id)) continue;
        let shared = 0;
        for (const uid of other.relatedUnitIds || []) if (mine.has(uid)) shared += 1;
        if (shared > 0) scored.push({ concept: other, shared });
      }
      scored.sort((a, b) => b.shared - a.shared);
      for (const s of scored) {
        if (out.length >= limit) break;
        seen.add(s.concept.id);
        out.push(s.concept);
      }
    }
    return { status: 'ok', data: out };
  }

  /** Units sharing concepts with one unit, ranked by overlap (excludes self). */
  async getRelatedUnits(textId: string, unitId: string, limit = 8): Promise<LoadResult<CanonicalUnit[]>> {
    const [unit, units] = await Promise.all([this.getUnit(textId, unitId), this.getUnits(textId)]);
    if (unit.status !== 'ok') return unit;
    if (units.status !== 'ok') return units;
    const mine = new Set(unit.data.conceptIds || []);
    if (mine.size === 0) return { status: 'ok', data: [] };
    const scored: Array<{ unit: CanonicalUnit; shared: number }> = [];
    for (const other of units.data) {
      if (other.id === unitId) continue;
      let shared = 0;
      for (const cid of other.conceptIds || []) if (mine.has(cid)) shared += 1;
      if (shared > 0) scored.push({ unit: other, shared });
    }
    scored.sort((a, b) => b.shared - a.shared);
    return { status: 'ok', data: scored.slice(0, limit).map((s) => s.unit) };
  }

  /** Thread steps mentioning a unit (directly or via its step's unit list). */
  async getThreadStepsForUnit(traditionId: string, textId: string, unitId: string): Promise<LoadResult<Array<{ thread: V2Thread; stepIndex: number }>>> {
    const threads = await this.getTraditionThread(traditionId);
    if (threads.status !== 'ok') {
      if (threads.status === 'missing') return { status: 'ok', data: [] };
      return threads;
    }
    const out: Array<{ thread: V2Thread; stepIndex: number }> = [];
    for (const thread of threads.data) {
      thread.steps.forEach((step, stepIndex) => {
        if ((step.textId || thread.textId) !== textId) return;
        if ((step.unitIds || []).includes(unitId)) out.push({ thread, stepIndex });
      });
    }
    return { status: 'ok', data: out };
  }

  /** Thread steps for a concept: direct hits first, then steps via its units. */
  async getThreadStepsForConcept(traditionId: string, textId: string, conceptId: string): Promise<LoadResult<Array<{ thread: V2Thread; stepIndex: number }>>> {
    const [threads, concept] = await Promise.all([this.getTraditionThread(traditionId), this.getConcept(textId, conceptId)]);
    if (threads.status !== 'ok') {
      if (threads.status === 'missing') return { status: 'ok', data: [] };
      return threads;
    }
    const unitSet = new Set(concept.status === 'ok' ? concept.data.relatedUnitIds || [] : []);
    const direct: Array<{ thread: V2Thread; stepIndex: number }> = [];
    const viaUnit: Array<{ thread: V2Thread; stepIndex: number }> = [];
    for (const thread of threads.data) {
      thread.steps.forEach((step, stepIndex) => {
        if ((step.textId || thread.textId) !== textId) return;
        if (step.conceptId === conceptId) {
          direct.push({ thread, stepIndex });
          return;
        }
        if (unitSet.size > 0 && (step.unitIds || []).some((u) => unitSet.has(u))) {
          viaUnit.push({ thread, stepIndex });
        }
      });
    }
    return { status: 'ok', data: [...direct, ...viaUnit] };
  }
}

let shared: V2Repository | undefined;

/** Shared browser repository (one loader cache per session). */
export function getRepository(): V2Repository {
  if (!shared) shared = new V2Repository();
  return shared;
}

/** Test hook: replace the shared repository. */
export function setSharedRepository(repo: V2Repository | undefined): void {
  shared = repo;
}
