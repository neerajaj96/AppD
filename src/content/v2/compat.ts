import type { ClassicalText, Concept, ConceptId, System, SystemId, TextId, ThreadStep, ThreadStepId, Verse, VerseId } from '../../types/content';
import type { SupportedLanguage } from '../../types/i18n';
import type { CanonicalUnit, V2Concept, V2ThreadStep } from './schema';

/**
 * Legacy compatibility — V2 chunks converted to the legacy shapes the
 * current screens render. IDs are preserved verbatim so bookmarks,
 * history, thread progress and every existing URL keep working.
 * New code should prefer V2 types; this bridge exists so the UI migration
 * stays visual-behaviour-identical while the data source changes.
 */

export function v2UnitToVerse(unit: CanonicalUnit): Verse {
  return {
    id: unit.id as VerseId,
    number: unit.number,
    section: unit.section,
    devanagari: unit.devanagari,
    iast: unit.iast || '',
    diagramId: unit.diagramIds?.[0],
    conceptIds: (unit.conceptIds || []) as ConceptId[],
    interpretiveNotes: unit.interpretiveNotes,
    content: {
      en: unit.localisations.en
        ? {
            translation: unit.localisations.en.translation,
            commentary: unit.localisations.en.commentary,
            keyPoints: unit.localisations.en.keyPoints,
            wordMeaning: unit.localisations.en.wordMeaning,
            variantNote: unit.localisations.en.variantNote,
          }
        : undefined,
      ml: unit.localisations.ml
        ? {
            translation: unit.localisations.ml.translation,
            commentary: unit.localisations.ml.commentary,
            keyPoints: unit.localisations.ml.keyPoints,
            wordMeaning: unit.localisations.ml.wordMeaning,
            variantNote: unit.localisations.ml.variantNote,
          }
        : undefined,
    } as Verse['content'],
  };
}

export function v2ConceptToConcept(concept: V2Concept): Concept {
  return {
    id: concept.id as ConceptId,
    diagramId: concept.diagramIds?.[0],
    relatedVerseIds: (concept.relatedUnitIds || []) as VerseId[],
    relatedConceptIds: (concept.relatedConceptIds || []) as ConceptId[],
    category: concept.category,
    content: {
      en: concept.localisations.en
        ? { title: concept.localisations.en.title, summary: concept.localisations.en.summary }
        : undefined,
      ml: concept.localisations.ml
        ? { title: concept.localisations.ml.title, summary: concept.localisations.ml.summary }
        : undefined,
    } as Concept['content'],
  };
}

export function v2StepToThreadStep(step: V2ThreadStep, fallbackTextId: string): ThreadStep {
  const base = {
    id: step.id as ThreadStepId,
    textId: (step.textId || fallbackTextId) as TextId,
    content: {
      en: step.localisations.en
        ? {
            title: step.localisations.en.title,
            narrative: step.localisations.en.narrative,
            summary: step.localisations.en.summary,
            keyPoints: step.localisations.en.keyPoints,
          }
        : undefined,
      ml: step.localisations.ml
        ? {
            title: step.localisations.ml.title,
            narrative: step.localisations.ml.narrative,
            summary: step.localisations.ml.summary,
            keyPoints: step.localisations.ml.keyPoints,
          }
        : undefined,
    } as ThreadStep['content'],
  };
  if (step.conceptId) {
    return {
      ...base,
      kind: 'concept',
      conceptId: step.conceptId as ConceptId,
      verseIds: (step.unitIds || []) as VerseId[],
    };
  }
  return {
    ...base,
    kind: 'verses',
    verseIds: (step.unitIds || []) as VerseId[],
  };
}

export interface LegacyTextParams {
  textId: string;
  title: string;
  transliteratedTitle: string;
  author?: string;
  traditionId: string;
  verseTerm?: string;
  contentStatus?: ClassicalText['contentStatus'];
  units: CanonicalUnit[];
  concepts: V2Concept[];
}

export function v2TextToClassicalText(params: LegacyTextParams): ClassicalText {
  return {
    id: params.textId as TextId,
    title: params.title,
    transliteratedTitle: params.transliteratedTitle,
    author: params.author || '',
    system: params.traditionId as SystemId,
    verseTerm: params.verseTerm,
    contentStatus: params.contentStatus || 'complete',
    verses: params.units.map(v2UnitToVerse),
    concepts: params.concepts.map(v2ConceptToConcept),
  };
}

export interface LegacySystemParams {
  traditionId: string;
  title: string;
  subtitle: string;
  texts: ClassicalText[];
  steps: V2ThreadStep[];
  fallbackTextId: string;
}

export function v2ToLegacySystem(params: LegacySystemParams): System {
  return {
    id: params.traditionId as SystemId,
    title: params.title,
    subtitle: params.subtitle,
    texts: params.texts,
    thread: params.steps.map((s) => v2StepToThreadStep(s, params.fallbackTextId)),
  };
}

export function threadStepTitle(step: V2ThreadStep, lang: SupportedLanguage): string {
  return step.localisations[lang]?.title || step.localisations.en?.title || step.id;
}

export function conceptTitle(concept: V2Concept, lang: SupportedLanguage): string {
  return concept.localisations[lang]?.title || concept.localisations.en?.title || concept.id;
}
