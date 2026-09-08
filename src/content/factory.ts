import {
  ClassicalText,
  System,
  SystemId,
  TextId,
  Verse,
  Concept,
  ThreadStep,
  SourceEdition,
  VerseId,
  ConceptId,
  ThreadStepId
} from '../types/content';
import { SupportedLanguage } from '../types/i18n';

export interface RawVerse {
  id: string;
  number: string;
  section: string;
  devanagari?: string;
  /** Legacy alias used by Brahma Sūtra sources. */
  sanskrit?: string;
  iast: string;
  diagramId?: string;
  conceptIds?: string[];
  interpretiveNotes?: { source: string; note: string }[];
  translation?: string;
  commentary?: string;
  keyPoints?: string[];
}

export interface RawConcept {
  id: string;
  title?: string;
  summary?: string;
  diagramId?: string;
  category?: string;
  relatedVerseIds?: string[];
  relatedConceptIds?: string[];
  /** Legacy alias used by Brahma Sūtra concept sources. */
  relatedConcepts?: string[];
}

export interface RawThreadStep {
  id: string;
  conceptId?: string;
  verseIds?: string[];
  narrative?: string;
  title?: string;
}

export interface TextMeta {
  id: string;
  title: string;
  transliteratedTitle: string;
  author: string;
  system: string;
  contentDepth?: 'full' | 'concepts-only';
  verseTerm?: string;
  sources: SourceEdition[];
}

function extractVerseContent(item: any, lang: SupportedLanguage) {
  if (!item) return undefined;
  const direct = {
    translation: item.translation || item.text || item.malayalamSutra,
    commentary: item.commentary || item.malayalamCommentary,
    keyPoints: item.keyPoints
  };
  const nested = item.content?.[lang];
  return {
    translation: direct.translation || nested?.translation,
    commentary: direct.commentary || nested?.commentary,
    keyPoints: direct.keyPoints || nested?.keyPoints
  };
}

function extractConceptContent(item: any, lang: SupportedLanguage) {
  if (!item) return undefined;
  const directSummary = item.summary || item.definition || item.basicDefinition;
  const fullSummary = directSummary
    ? (item.advancedExplanation ? `${directSummary}\n\n${item.advancedExplanation}` : directSummary)
    : undefined;
  const direct = {
    title: item.title || item.term || (item.sanskrit && item.english ? `${item.sanskrit} - ${item.english}` : undefined),
    summary: fullSummary
  };
  const nested = item.content?.[lang];
  return {
    title: direct.title || nested?.title,
    summary: direct.summary || nested?.summary
  };
}

function extractThreadContent(item: any, lang: SupportedLanguage) {
  if (!item) return undefined;
  const direct = {
    title: item.title,
    narrative: item.narrative,
    summary: item.summary,
    keyPoints: item.keyPoints
  };
  const nested = item.content?.[lang];
  return {
    title: direct.title || nested?.title,
    narrative: direct.narrative || nested?.narrative,
    summary: direct.summary || nested?.summary,
    keyPoints: direct.keyPoints || nested?.keyPoints
  };
}

export function buildClassicalText(
  meta: TextMeta,
  versesByLang: Partial<Record<SupportedLanguage, Record<string, any>>>,
  conceptsByLang: Partial<Record<SupportedLanguage, Record<string, any>>>
): ClassicalText {
  const baseVerses = (versesByLang.en || []) as RawVerse[];
  const baseConcepts = (conceptsByLang.en || []) as RawConcept[];

  // 1. Build initial maps
  const verseMap = new Map<VerseId, Verse>();
  const conceptMap = new Map<ConceptId, Concept>();

  baseVerses.forEach(base => {
    const v: Verse = {
      id: base.id as VerseId,
      number: base.number ?? `${base.id}`,
      section: base.section ?? '',
      devanagari: base.devanagari ?? base.sanskrit,
      iast: base.iast ?? '',
      diagramId: base.diagramId,
      conceptIds: (base.conceptIds || []) as ConceptId[],
      interpretiveNotes: base.interpretiveNotes,
      content: {}
    };

    // Pre-populate from base.content if present
    if ((base as any).content) {
      Object.keys((base as any).content).forEach(l => {
        const extracted = extractVerseContent(base, l as SupportedLanguage);
        if (extracted && (extracted.translation || extracted.commentary || extracted.keyPoints)) {
          v.content[l as SupportedLanguage] = extracted;
        }
      });
    }

    (Object.keys(versesByLang) as SupportedLanguage[]).forEach(lang => {
      const rawMap = versesByLang[lang];
      if (!rawMap) return;
      
      let localized: any = null;
      if (Array.isArray(rawMap)) {
        localized = rawMap.find((r: any) => `${r.id}` === `${base.id}`);
      } else {
        localized = rawMap[base.id];
      }

      const extracted = extractVerseContent(localized, lang) || extractVerseContent(base, lang);
      if (extracted && (extracted.translation || extracted.commentary || extracted.keyPoints)) {
        v.content[lang] = {
          translation: extracted.translation || v.content[lang]?.translation,
          commentary: extracted.commentary || v.content[lang]?.commentary,
          keyPoints: extracted.keyPoints || v.content[lang]?.keyPoints
        };
      }
    });

    verseMap.set(v.id, v);
  });

  baseConcepts.forEach(base => {
    const c: Concept = {
      id: base.id as ConceptId,
      diagramId: base.diagramId,
      category: base.category,
      relatedVerseIds: (base.relatedVerseIds || []) as VerseId[],
      relatedConceptIds: ((base.relatedConceptIds ?? base.relatedConcepts) || []) as ConceptId[],
      content: {}
    };

    // Pre-populate from base.content if present
    if ((base as any).content) {
      Object.keys((base as any).content).forEach(l => {
        const extracted = extractConceptContent(base, l as SupportedLanguage);
        if (extracted && (extracted.title || extracted.summary)) {
          c.content[l as SupportedLanguage] = extracted;
        }
      });
    }

    (Object.keys(conceptsByLang) as SupportedLanguage[]).forEach(lang => {
      const rawMap = conceptsByLang[lang];
      if (!rawMap) return;
      
      let localized: any = null;
      if (Array.isArray(rawMap)) {
        localized = rawMap.find((r: any) => `${r.id}` === `${base.id}`);
      } else {
        localized = rawMap[base.id];
      }

      const extracted = extractConceptContent(localized, lang) || extractConceptContent(base, lang);
      if (extracted && (extracted.title || extracted.summary)) {
        c.content[lang] = {
          title: extracted.title || c.content[lang]?.title,
          summary: extracted.summary || c.content[lang]?.summary
        };
      }
    });

    conceptMap.set(c.id, c);
  });

  // 2. Bidirectional Stitching using Sets for O(1) deduplication
  const conceptToVerses = new Map<ConceptId, Set<VerseId>>();
  const verseToConcepts = new Map<VerseId, Set<ConceptId>>();

  conceptMap.forEach(c => {
    conceptToVerses.set(c.id, new Set(c.relatedVerseIds || []));
  });

  verseMap.forEach(v => {
    verseToConcepts.set(v.id, new Set(v.conceptIds || []));
  });

  // Pass A: Verse -> Concept
  verseMap.forEach(v => {
    v.conceptIds?.forEach(cid => {
      conceptToVerses.get(cid)?.add(v.id);
    });
  });

  // Pass B: Concept -> Verse
  conceptMap.forEach(c => {
    c.relatedVerseIds?.forEach(vid => {
      verseToConcepts.get(vid)?.add(c.id);
    });
  });

  // Finalize arrays
  conceptMap.forEach(c => {
    c.relatedVerseIds = Array.from(conceptToVerses.get(c.id) || []);
  });

  verseMap.forEach(v => {
    v.conceptIds = Array.from(verseToConcepts.get(v.id) || []);
  });

  return Object.freeze({
    id: meta.id as TextId,
    title: meta.title,
    transliteratedTitle: meta.transliteratedTitle,
    author: meta.author,
    system: meta.system as SystemId,
    contentDepth: meta.contentDepth || 'full',
    verseTerm: meta.verseTerm,
    sources: meta.sources,
    verses: Array.from(verseMap.values()),
    concepts: Array.from(conceptMap.values()),
  });
}

export function buildSystemThread(
  textId: string,
  threadByLang: Partial<Record<SupportedLanguage, any>>
): ThreadStep[] {
  const baseThread = (threadByLang.en || []) as RawThreadStep[];
  
  return baseThread.map((base, index) => {
    const kind = base.conceptId ? 'concept' : 'verses';
    
    if (!base.conceptId && (!base.verseIds || base.verseIds.length === 0)) {
       console.warn(`ThreadStep ${base.id} has no conceptId and no verseIds.`);
    }

    const t: ThreadStep = {
      id: base.id as ThreadStepId,
      textId: textId as TextId,
      kind: kind as any,
      conceptId: base.conceptId as ConceptId,
      verseIds: base.verseIds as VerseId[],
      content: {}
    };

    // Pre-populate from base.content if present
    if ((base as any).content) {
      Object.keys((base as any).content).forEach(l => {
        const extracted = extractThreadContent(base, l as SupportedLanguage);
        if (extracted && (extracted.title || extracted.narrative || extracted.summary || extracted.keyPoints)) {
          t.content[l as SupportedLanguage] = extracted;
        }
      });
    }

    (Object.keys(threadByLang) as SupportedLanguage[]).forEach(lang => {
      const rawMap = threadByLang[lang];
      if (!rawMap) return;
      
      let localized: any = null;
      if (Array.isArray(rawMap)) {
        localized = rawMap.find((r: any) => `${r.id}` === `${base.id}`);
        if (!localized) {
          console.warn(`ThreadStep ${base.id} missing '${lang}' entry; falling back to 'en'.`);
        }
      } else {
        localized = rawMap[base.id];
      }

      const extracted = extractThreadContent(localized, lang) || extractThreadContent(base, lang);
      if (extracted && (extracted.title || extracted.narrative || extracted.summary || extracted.keyPoints)) {
        t.content[lang] = {
          title: extracted.title || t.content[lang]?.title,
          narrative: extracted.narrative || t.content[lang]?.narrative,
          summary: extracted.summary || t.content[lang]?.summary,
          keyPoints: extracted.keyPoints || t.content[lang]?.keyPoints
        };
      }
    });

    return t;
  });
}
