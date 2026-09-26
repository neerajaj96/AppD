import {
  FetchChunkLoader,
  type GlobalManifest,
  type LoadResult,
  type TextManifestFile,
  type TextSummary,
  type TraditionSummary,
} from './chunks';
import type { CanonicalUnit, V2Concept, V2Source, V2Thread } from './schema';
import type { GitaCommentaryText } from './gitaCommentaryText';
import { buildAliasTable, normaliseId, parseCanonicalConceptId, resolveAlias, type AliasResolution } from './ids';
import { verifiedAliases } from './aliases';
import type { AliasFile } from './aliases';
import type { V2Alias } from './schema';
import type { ConceptOccurrenceIndex, ConceptOccurrence } from './occurrences';

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
  private conceptIndex: ConceptOccurrenceIndex | undefined;
  private conceptIndexPromise: Promise<LoadResult<ConceptOccurrenceIndex>> | undefined;
  private aliasTable: Map<string, string[]> | undefined;
  private aliasTablePromise: Promise<Map<string, string[]> | undefined> | undefined;
  private aliasRows: V2Alias[] | undefined;

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

  /**
   * Per-text source registry. Small JSON, fetched lazily and cached —
   * unit chunks never load merely to discover sources.
   */
  getSources(textId: string): Promise<LoadResult<V2Source[]>> {
    return this.loader.loadTextSources(textId);
  }

  /**
   * Per-text commentary passages. Small JSON, fetched lazily and cached —
   * thread steps never load commentary text merely to discover it.
   */
  getPassages(textId: string): Promise<LoadResult<GitaCommentaryText[]>> {
    return this.loader.loadTextPassages(textId);
  }

  /** One source record by stable id, or missing when unrecorded. */
  async getSource(textId: string, sourceId: string): Promise<LoadResult<V2Source>> {
    const sources = await this.getSources(textId);
    if (sources.status !== 'ok') return sources;
    const hit = sources.data.find((s) => s.id === sourceId);
    return hit ? { status: 'ok', data: hit } : { status: 'missing', message: `No such source: ${textId}/${sourceId}` };
  }

  /** Full tradition thread (all texts), used by ThreadView. */
  getTraditionThread(traditionId: string): Promise<LoadResult<V2Thread[]>> {
    return this.loader.loadTraditionThread(traditionId);
  }

  /**
   * Cross-text occurrences of one concept identity from the lightweight
   * build-time index — no unit chunks load to discover them. Ordered by
   * catalog tradition order, then text, so the sequence is stable and
   * meaningful rather than alphabetical noise. Distinct canonical
   * identities (different tradition/text/conceptId triples) are preserved
   * as separate occurrences, never merged.
   */
  async getConceptOccurrences(conceptId: string): Promise<LoadResult<ConceptOccurrence[]>> {
    const key = normaliseId(conceptId);
    if (!key) return { status: 'missing', message: `No such concept: ${conceptId}` };
    let index = this.conceptIndex;
    if (!index) {
      if (!this.conceptIndexPromise) {
        this.conceptIndexPromise = this.loader.loadConceptIndex().then((result) => {
          if (result.status === 'ok') this.conceptIndex = result.data;
          else this.conceptIndexPromise = undefined;
          return result;
        });
      }
      const loaded = await this.conceptIndexPromise;
      if (loaded.status !== 'ok') return loaded;
      index = loaded.data;
    }
    const entry = index.concepts.find((e) => e.key === key);
    if (!entry || entry.occurrences.length === 0) {
      return { status: 'missing', message: `No such concept: ${conceptId}` };
    }
    const catalog = await this.getCatalog();
    const order = new Map<string, number>();
    if (catalog.status === 'ok') {
      catalog.data.traditions.forEach((t, i) => order.set(t.id, i));
    }
    const occurrences = [...entry.occurrences].sort((a, b) => {
      const ta = order.get(a.traditionId) ?? 999;
      const tb = order.get(b.traditionId) ?? 999;
      if (ta !== tb) return ta - tb;
      if (a.traditionId !== b.traditionId) return a.traditionId < b.traditionId ? -1 : 1;
      if (a.textId !== b.textId) return a.textId < b.textId ? -1 : 1;
      return a.conceptId < b.conceptId ? -1 : 1;
    });
    return { status: 'ok', data: occurrences };
  }

  /**
   * Thread steps of one tradition mentioning a concept, matched on the
   * normalised identity so diacritic variants coincide. Combines direct
   * concept steps with steps whose units the concept defines. Loads only
   * that tradition's thread file.
   */
  async getTraditionConceptThreadSteps(
    traditionId: string,
    conceptId: string,
  ): Promise<LoadResult<Array<{ thread: V2Thread; stepIndex: number }>>> {
    const key = normaliseId(conceptId);
    const threads = await this.getTraditionThread(traditionId);
    if (threads.status !== 'ok') {
      if (threads.status === 'missing') return { status: 'ok', data: [] };
      return threads;
    }
    const out: Array<{ thread: V2Thread; stepIndex: number }> = [];
    for (const thread of threads.data) {
      thread.steps.forEach((step, stepIndex) => {
        if (step.conceptId && normaliseId(step.conceptId) === key) {
          out.push({ thread, stepIndex });
        }
      });
    }
    return { status: 'ok', data: out };
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

  /**
   * Verified-only alias table from `aliases.json` (review rows excluded).
   * Tiny file, loaded once per session; undefined when unreachable, in
   * which case callers treat every name as missing rather than failing.
   */
  private async getAliasTable(): Promise<Map<string, string[]> | undefined> {
    if (this.aliasTable) return this.aliasTable;
    if (!this.aliasTablePromise) {
      this.aliasTablePromise = this.loader.loadAliases().then((result: LoadResult<AliasFile>) => {
        if (result.status !== 'ok') {
          this.aliasTablePromise = undefined;
          return undefined;
        }
        const rows = verifiedAliases(result.data.aliases || []);
        this.aliasRows = rows;
        const table = buildAliasTable(rows);
        this.aliasTable = table;
        return table;
      });
    }
    return this.aliasTablePromise;
  }

  /**
   * Resolve a human spelling to canonical concept triples. Verified rows
   * only; review candidates never resolve. Ambiguity is returned, never
   * guessed away.
   */
  async resolveAliasName(name: string): Promise<AliasResolution> {
    const table = await this.getAliasTable();
    if (!table) return { status: 'missing', alias: name };
    const resolved = resolveAlias(name, table);
    if (resolved.status !== 'resolved') return resolved;
    // Belt-and-braces: the triple must still parse (validator enforces).
    return parseCanonicalConceptId(resolved.canonicalId) ? resolved : { status: 'missing', alias: name };
  }

  /**
   * Alternate spellings explicitly curated for one canonical concept
   * (verified only) — for an "also found as" line, not navigation.
   * Original spellings preserved; never throws.
   */
  async getConceptAliases(traditionId: string, textId: string, conceptId: string): Promise<string[]> {
    await this.getAliasTable();
    const rows = this.aliasRows || [];
    const triple = `${traditionId}/${textId}/${conceptId}`;
    const out: string[] = [];
    for (const row of rows) {
      if (row.canonicalId === triple && !out.includes(row.alias)) out.push(row.alias);
    }
    return out;
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
