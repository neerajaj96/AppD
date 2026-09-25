import type {
  ClassicalText,
  Concept,
  System,
  Verse,
} from '../../types/content';
import {
  SCHEMA_VERSION,
  type CanonicalUnit,
  type SourceRole,
  type UnitType,
  type V2Concept,
  type V2Corpus,
  type V2Text,
  type V2Thread,
  type V2ThreadStep,
} from './schema';
import { TRADITIONS } from './tradition';
import { EDITORIAL_ALIASES } from './aliases';

/**
 * Temporary compatibility path: legacy content → V2 canonical model.
 *
 * The old factory (`src/content/factory.ts`) remains the runtime truth
 * until the chunked V2 loader ships. This adapter lets validators,
 * reports, the reference graph and the search-index builder consume the
 * existing corpus as V2 without duplicating or rewriting philosophical
 * content. It performs no data loss: every verse, concept and thread step
 * is carried across, with unit types inferred from the legacy `verseTerm`
 * and text identifiers.
 */

function inferUnitType(text: ClassicalText): UnitType {
  const term = (text.verseTerm || text.id || '').toLowerCase();
  if (term.includes('karika')) return 'karika';
  if (term.includes('sutra') || term.includes('sūtra')) return 'sutra';
  if (term.includes('sloka') || term.includes('śloka') || term.includes('shloka')) return 'sloka';
  if (term.includes('mantra')) return 'mantra';
  if (term.includes('name') || term.includes('sahasra')) return 'mantra';
  if (term.includes('paragraph')) return 'paragraph';
  if (term.includes('section')) return 'section';
  if (text.id.includes('karika')) return 'karika';
  if (text.id.includes('sutra')) return 'sutra';
  if (text.id.includes('sahasranama')) return 'mantra';
  if (text.id.includes('mahatmya') || text.id.includes('gita')) return 'sloka';
  return 'verse';
}

function inferSourceRole(text: ClassicalText): SourceRole {
  const id = text.id.toLowerCase();
  if (id.includes('sahasranama') || id.includes('mahatmya') || id.includes('stotra')) {
    return 'devotional';
  }
  if (id.includes('mishra') || id.includes('kundalini')) return 'modern-synthesis';
  if (id.includes('glossary') || id.includes('index')) return 'reference';
  if (text.contentDepth === 'concepts-only') return 'secondary';
  return 'primary';
}

function adaptVerse(unit: Verse, unitType: UnitType): CanonicalUnit {
  return {
    id: unit.id as string,
    number: unit.number ?? (unit.id as string),
    section: unit.section ?? '',
    unitType,
    devanagari: unit.devanagari,
    iast: unit.iast ?? '',
    localisations: {
      en: unit.content.en
        ? {
            translation: unit.content.en.translation,
            commentary: unit.content.en.commentary,
            keyPoints: unit.content.en.keyPoints,
            wordMeaning: unit.content.en.wordMeaning,
            variantNote: unit.content.en.variantNote,
          }
        : undefined,
      ml: unit.content.ml
        ? {
            translation: unit.content.ml.translation,
            commentary: unit.content.ml.commentary,
            keyPoints: unit.content.ml.keyPoints,
            wordMeaning: unit.content.ml.wordMeaning,
            variantNote: unit.content.ml.variantNote,
          }
        : undefined,
    },
    conceptIds: (unit.conceptIds || []).map(String),
    diagramIds: unit.diagramId ? [unit.diagramId] : [],
    interpretiveNotes: unit.interpretiveNotes,
  };
}

function adaptConcept(concept: Concept): V2Concept {
  return {
    id: concept.id as string,
    category: concept.category,
    diagramIds: concept.diagramId ? [concept.diagramId] : [],
    relatedUnitIds: (concept.relatedVerseIds || []).map(String),
    relatedConceptIds: (concept.relatedConceptIds || []).map(String),
    status: concept.status,
    sourceTerms: concept.sourceTerms?.map((t) => ({ ...t })),
    occurrences: concept.occurrences?.map((o) => ({ ...o })),
    conceptLinks: concept.conceptLinks?.map((l) => ({ ...l, units: l.units ? [...l.units] : undefined })),
    localisations: {
      en: concept.content.en
        ? { title: concept.content.en.title, summary: concept.content.en.summary }
        : undefined,
      ml: concept.content.ml
        ? { title: concept.content.ml.title, summary: concept.content.ml.summary }
        : undefined,
    },
  };
}

export function adaptText(text: ClassicalText, traditionId: string): V2Text {
  const unitType = inferUnitType(text);
  return {
    id: text.id as string,
    title: text.title,
    transliteratedTitle: text.transliteratedTitle,
    author: text.author,
    traditionId,
    sourceRole: inferSourceRole(text),
    verseTerm: text.verseTerm,
    contentStatus:
      text.contentStatus === 'partial'
        ? 'partial'
        : text.contentDepth === 'concepts-only'
          ? 'concepts-only'
          : 'complete',
    languages: ['en', 'ml'],
    units: text.verses.map((v) => adaptVerse(v, unitType)),
    concepts: text.concepts.map(adaptConcept),
  };
}

export function adaptSystemThread(system: System): V2Thread[] {
  const steps: V2ThreadStep[] = system.thread.map((step) => ({
    id: step.id as string,
    textId: (step.textId as string) || undefined,
    conceptId: step.conceptId ? (step.conceptId as string) : undefined,
    unitIds: (step.verseIds || []).map(String),
    localisations: {
      en: step.content.en
        ? {
            title: step.content.en.title,
            narrative: step.content.en.narrative,
            summary: step.content.en.summary,
            keyPoints: step.content.en.keyPoints,
          }
        : undefined,
      ml: step.content.ml
        ? {
            title: step.content.ml.title,
            narrative: step.content.ml.narrative,
            summary: step.content.ml.summary,
            keyPoints: step.content.ml.keyPoints,
          }
        : undefined,
    },
  }));
  return [
    {
      id: `${system.id}-thread`,
      traditionId: system.id as string,
      title: `${system.title} thread`,
      steps,
    },
  ];
}

/** Adapt the full legacy `systems` array into a V2 corpus snapshot. */
export function adaptSystemsToV2(systems: System[]): V2Corpus {
  const texts: V2Text[] = [];
  for (const system of systems) {
    const sid = system.id as string;
    for (const text of system.texts) {
      const adapted = adaptText(text, sid);
      const stepsForText: V2ThreadStep[] = system.thread
        .filter((step) => (step.textId as string) === (text.id as string))
        .map((step) => ({
          id: step.id as string,
          textId: text.id as string,
          conceptId: step.conceptId ? (step.conceptId as string) : undefined,
          unitIds: (step.verseIds || []).map(String),
          localisations: {
            en: step.content.en
              ? {
                  title: step.content.en.title,
                  narrative: step.content.en.narrative,
                  summary: step.content.en.summary,
                  keyPoints: step.content.en.keyPoints,
                }
              : undefined,
            ml: step.content.ml
              ? {
                  title: step.content.ml.title,
                  narrative: step.content.ml.narrative,
                  summary: step.content.ml.summary,
                  keyPoints: step.content.ml.keyPoints,
                }
              : undefined,
          },
        }));
      // Threads are stored per tradition as well; keep per-text slices here
      // for chunked loading, wrapped as single-step threads below by callers.
      const asThreads: V2Thread[] = stepsForText.length
        ? [
            {
              id: `${sid}-${text.id}-thread`,
              traditionId: sid,
              textId: text.id as string,
              steps: stepsForText,
            },
          ]
        : [];
      adapted.threads = asThreads;
      texts.push(adapted);
    }
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    traditions: TRADITIONS.filter((t) => systems.some((s) => (s.id as string) === t.id)),
    texts,
    // Editorial identity table: curated alias → canonical triple rows.
    // Resolution is single-step (name → triple, never chained), so alias
    // cycles are impossible by construction.
    aliases: EDITORIAL_ALIASES.map(({ alias, canonicalId, status, note }) => ({
      alias,
      canonicalId,
      status,
      note,
    })),
  };
}
