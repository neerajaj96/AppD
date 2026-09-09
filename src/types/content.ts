import { SupportedLanguage, LocalizedContent } from './i18n';

export type SystemId = string & { __brand: 'SystemId' };
export type TextId = string & { __brand: 'TextId' };
export type VerseId = string & { __brand: 'VerseId' };
export type ConceptId = string & { __brand: 'ConceptId' };
export type ThreadStepId = string & { __brand: 'ThreadStepId' };

export type InterpretiveNote = { note: string };

export interface Verse {
  id: VerseId;
  number: string;
  section: string;
  devanagari?: string;
  iast: string;
  diagramId?: string;
  conceptIds?: ConceptId[];
  interpretiveNotes?: InterpretiveNote[];
  content: Partial<Record<SupportedLanguage, LocalizedContent>>;
}

export interface Concept {
  id: ConceptId;
  diagramId?: string;
  relatedVerseIds?: VerseId[];
  relatedConceptIds?: ConceptId[];
  category?: string;
  content: Partial<Record<SupportedLanguage, LocalizedContent>>;
}

type BaseThreadStep = {
  id: ThreadStepId;
  textId: TextId;
  content: Partial<Record<SupportedLanguage, LocalizedContent>>;
};

export type ThreadStep = BaseThreadStep & (
  | { kind: 'concept'; conceptId: ConceptId; verseIds?: VerseId[] }
  | { kind: 'verses'; verseIds: VerseId[]; conceptId?: undefined }
);

export interface ClassicalText {
  id: TextId;
  title: string;
  transliteratedTitle: string;
  author: string;
  system: SystemId;
  contentDepth?: 'full' | 'concepts-only';
  verseTerm?: string;
  // Compilation completeness of OUR text (not an external source reference):
  // 'partial' marks texts whose verse content is still being compiled and
  // which are therefore exempt from the strict verse-content integrity gate.
  contentStatus?: 'complete' | 'partial';
  verses: Verse[];
  concepts: Concept[];
}

export interface System {
  id: SystemId;
  title: string;
  subtitle: string;
  texts: ClassicalText[];
  thread: ThreadStep[];
}
