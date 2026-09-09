import { systems, getSystem, getText } from '../content';
import type {
  ClassicalText,
  Concept,
  System,
  ThreadStep,
  Verse,
} from '../types/content';
import type { SupportedLanguage } from '../types/i18n';

/**
 * Central reference graph — the "Wikipedia layer" of the Darshana app.
 *
 * All interlinking between verses, concepts, thread steps and systems is
 * derived here at runtime from the compiled content (see `src/content/` and
 * the bidirectional stitching in `src/content/factory.ts`). Nothing is
 * hardcoded: UI components query this module instead of building ad-hoc
 * lookups, so every verse page, concept article and thread step renders the
 * same connected graph.
 *
 * ID reality: `relatedConceptIds` in the raw sources are aspirational tags as
 * often as strict ids (diacritic variants, free-text terms, cross-system
 * mentions). Every resolver below is therefore defensive — it returns
 * `undefined` for dangling references and the UI only renders resolvable
 * ("blue") links.
 */

export interface VerseHit {
  systemId: string;
  textId: string;
  verse: Verse;
}

export interface ConceptHit {
  systemId: string;
  textId: string;
  concept: Concept;
}

export interface ThreadStepHit {
  systemId: string;
  stepIndex: number;
  step: ThreadStep;
}

/** Normalize an id for fuzzy matching: strip diacritics, lowercase, unify separators. */
export function normalizeRefId(id: string): string {
  return id
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ---------------------------------------------------------------------------
// Global concept index (built once, lazily)
// ---------------------------------------------------------------------------

let conceptIndex: ConceptHit[] | null = null;
let conceptExactIndex: Map<string, ConceptHit[]> | null = null;
let conceptNormIndex: Map<string, ConceptHit[]> | null = null;

function getConceptIndex(): ConceptHit[] {
  if (conceptIndex) return conceptIndex;
  const hits: ConceptHit[] = [];
  for (const sys of systems) {
    for (const text of sys.texts) {
      for (const concept of text.concepts || []) {
        hits.push({ systemId: sys.id as string, textId: text.id as string, concept });
      }
    }
  }
  conceptIndex = hits;
  return hits;
}

function getExactIndex(): Map<string, ConceptHit[]> {
  if (conceptExactIndex) return conceptExactIndex;
  const map = new Map<string, ConceptHit[]>();
  for (const hit of getConceptIndex()) {
    const key = hit.concept.id as string;
    const list = map.get(key);
    if (list) list.push(hit);
    else map.set(key, [hit]);
  }
  conceptExactIndex = map;
  return map;
}

function getNormIndex(): Map<string, ConceptHit[]> {
  if (conceptNormIndex) return conceptNormIndex;
  const map = new Map<string, ConceptHit[]>();
  for (const hit of getConceptIndex()) {
    const key = normalizeRefId(hit.concept.id as string);
    const list = map.get(key);
    if (list) list.push(hit);
    else map.set(key, [hit]);
  }
  conceptNormIndex = map;
  return map;
}

// ---------------------------------------------------------------------------
// Direct lookups
// ---------------------------------------------------------------------------

export function findVerse(systemId: string, textId: string, verseId: string): VerseHit | undefined {
  const text = getText(systemId, textId);
  const verse = text?.verses.find((v) => (v.id as string) === verseId);
  return verse ? { systemId, textId, verse } : undefined;
}

export function findConcept(
  conceptId: string,
  preferred?: { systemId?: string; textId?: string },
): ConceptHit | undefined {
  if (!conceptId) return undefined;
  const all = getConceptIndex();

  // 1. Exact match inside the preferred text.
  if (preferred?.systemId && preferred?.textId) {
    const hit = all.find(
      (h) =>
        h.systemId === preferred.systemId &&
        h.textId === preferred.textId &&
        (h.concept.id as string) === conceptId,
    );
    if (hit) return hit;
  }

  // 2. Exact match inside the preferred system.
  if (preferred?.systemId) {
    const hit = all.find(
      (h) => h.systemId === preferred.systemId && (h.concept.id as string) === conceptId,
    );
    if (hit) return hit;
  }

  // 3. Exact match anywhere.
  const exact = getExactIndex().get(conceptId);
  if (exact && exact.length > 0) return exact[0];

  // 4. Normalized (diacritic/case/separator-insensitive) match anywhere.
  const norm = getNormIndex().get(normalizeRefId(conceptId));
  if (norm && norm.length > 0) return norm[0];

  return undefined;
}

/** Every occurrence of a concept id across the whole corpus (for cross-darshana links). */
export function findAllConcepts(conceptId: string): ConceptHit[] {
  if (!conceptId) return [];
  const exact = getExactIndex().get(conceptId);
  if (exact && exact.length > 0) return [...exact];
  return [...(getNormIndex().get(normalizeRefId(conceptId)) || [])];
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function getConceptTitle(hit: ConceptHit, lang: SupportedLanguage): string {
  return (
    hit.concept.content[lang]?.title ||
    hit.concept.content.en?.title ||
    (hit.concept.id as string)
  );
}

export function getConceptSummary(hit: ConceptHit, lang: SupportedLanguage): string | undefined {
  return hit.concept.content[lang]?.summary || hit.concept.content.en?.summary;
}

export function getThreadStepTitle(step: ThreadStep, lang: SupportedLanguage): string {
  return step.content[lang]?.title || step.content.en?.title || (step.id as string);
}

// ---------------------------------------------------------------------------
// Verse <-> Concept relations
// ---------------------------------------------------------------------------

/** Concepts tagged on a verse (verse.conceptIds), resolved to hits. */
export function getConceptsForVerse(
  systemId: string,
  textId: string,
  verseId: string,
): ConceptHit[] {
  const text = getText(systemId, textId);
  const verse = text?.verses.find((v) => (v.id as string) === verseId);
  if (!verse) return [];
  const out: ConceptHit[] = [];
  for (const cid of verse.conceptIds || []) {
    const hit = findConcept(cid as string, { systemId, textId });
    if (hit) out.push(hit);
  }
  return out;
}

/** Verses linked to a concept (concept.relatedVerseIds, stitched bidirectionally at build). */
export function getVersesForConcept(
  systemId: string,
  textId: string,
  conceptId: string,
): VerseHit[] {
  const text = getText(systemId, textId);
  const concept = text?.concepts.find((c) => (c.id as string) === conceptId);
  if (!concept) return [];
  const out: VerseHit[] = [];
  for (const vid of concept.relatedVerseIds || []) {
    const hit = findVerse(systemId, textId, vid as string);
    if (hit) out.push(hit);
  }
  return out;
}

/**
 * Related concepts for a concept article — the "See also" section.
 * Order: explicit relatedConceptIds (resolvable only), then the same concept
 * discussed in other darshanas, then concepts co-occurring on shared verses.
 */
export function getRelatedConcepts(
  systemId: string,
  textId: string,
  conceptId: string,
  limit = 12,
): ConceptHit[] {
  const text = getText(systemId, textId);
  const concept = text?.concepts.find((c) => (c.id as string) === conceptId);
  if (!concept) return [];

  const seen = new Set<string>([`${systemId}:${textId}:${conceptId}`]);
  const out: ConceptHit[] = [];
  const push = (hit: ConceptHit) => {
    const key = `${hit.systemId}:${hit.textId}:${hit.concept.id as string}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(hit);
  };

  // 1. Explicit links.
  for (const cid of concept.relatedConceptIds || []) {
    if (out.length >= limit) break;
    const hit = findConcept(cid as string, { systemId, textId });
    if (hit) push(hit);
  }

  // 2. Same concept id in other systems/texts (cross-darshana bridge).
  if (out.length < limit) {
    for (const hit of findAllConcepts(conceptId)) {
      if (out.length >= limit) break;
      push(hit);
    }
  }

  // 3. Co-occurrence: concepts sharing this concept's verses, ranked by overlap.
  if (out.length < limit) {
    const verseIds = new Set((concept.relatedVerseIds || []).map((v) => v as string));
    const counts = new Map<string, { hit: ConceptHit; count: number }>();
    for (const other of text.concepts) {
      const oid = other.id as string;
      if (oid === conceptId) continue;
      let shared = 0;
      for (const vid of other.relatedVerseIds || []) {
        if (verseIds.has(vid as string)) shared++;
      }
      if (shared > 0) {
        counts.set(oid, {
          hit: { systemId, textId, concept: other },
          count: shared,
        });
      }
    }
    const ranked = Array.from(counts.values()).sort((a, b) => b.count - a.count);
    for (const { hit } of ranked) {
      if (out.length >= limit) break;
      push(hit);
    }
  }

  return out;
}

/**
 * Verses related to a verse: other verses in the same text sharing concepts,
 * ranked by number of shared concepts. Excludes self.
 */
export function getRelatedVerses(
  systemId: string,
  textId: string,
  verseId: string,
  limit = 8,
): VerseHit[] {
  const text = getText(systemId, textId);
  const verse = text?.verses.find((v) => (v.id as string) === verseId);
  if (!verse || !text) return [];
  const mine = new Set((verse.conceptIds || []).map((c) => c as string));
  if (mine.size === 0) return [];

  const scored: { hit: VerseHit; shared: number }[] = [];
  for (const other of text.verses) {
    if ((other.id as string) === verseId) continue;
    let shared = 0;
    for (const cid of other.conceptIds || []) {
      if (mine.has(cid as string)) shared++;
    }
    if (shared > 0) scored.push({ hit: { systemId, textId, verse: other }, shared });
  }
  scored.sort((a, b) => b.shared - a.shared);
  return scored.slice(0, limit).map((s) => s.hit);
}

/** Same concept id discussed in other darshanas (excludes the given location). */
export function getCrossSystemConcepts(
  conceptId: string,
  exclude?: { systemId: string; textId?: string },
): ConceptHit[] {
  return findAllConcepts(conceptId).filter((h) => {
    if (!exclude) return true;
    if (h.systemId !== exclude.systemId) return true;
    return exclude.textId !== undefined && h.textId !== exclude.textId;
  });
}

// ---------------------------------------------------------------------------
// Thread backlinks ("what links here")
// ---------------------------------------------------------------------------

export function getThreadStepsForVerse(
  systemId: string,
  textId: string,
  verseId: string,
): ThreadStepHit[] {
  const system = getSystem(systemId);
  if (!system?.thread) return [];
  const out: ThreadStepHit[] = [];
  system.thread.forEach((step, stepIndex) => {
    if ((step.textId as string) !== textId) return;
    if ((step.verseIds || []).some((v) => (v as string) === verseId)) {
      out.push({ systemId, stepIndex, step });
    }
  });
  return out;
}

export function getThreadStepsForConcept(
  systemId: string,
  textId: string,
  conceptId: string,
): ThreadStepHit[] {
  const system = getSystem(systemId);
  if (!system?.thread) return [];
  const text = getText(systemId, textId);
  const concept = text?.concepts.find((c) => (c.id as string) === conceptId);
  const conceptVerses = new Set((concept?.relatedVerseIds || []).map((v) => v as string));

  const direct: ThreadStepHit[] = [];
  const viaVerse: ThreadStepHit[] = [];
  system.thread.forEach((step, stepIndex) => {
    if ((step.textId as string) !== textId) return;
    if (step.kind === 'concept' && (step.conceptId as string | undefined) === conceptId) {
      direct.push({ systemId, stepIndex, step });
      return;
    }
    if (
      conceptVerses.size > 0 &&
      (step.verseIds || []).some((v) => conceptVerses.has(v as string))
    ) {
      viaVerse.push({ systemId, stepIndex, step });
    }
  });
  return [...direct, ...viaVerse];
}

// ---------------------------------------------------------------------------
// Corpus-wide helpers for tests / diagnostics
// ---------------------------------------------------------------------------

export function getAllSystems(): System[] {
  return systems;
}

export function getAllTexts(): { systemId: string; text: ClassicalText }[] {
  return systems.flatMap((s) =>
    s.texts.map((text) => ({ systemId: s.id as string, text })),
  );
}
