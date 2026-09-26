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
  /**
   * Scholarly provenance of the record (Phase 3 Gītā ontology).
   * `legacy-project`: authored from project commentary before source
   * grounding existed. `source-grounded`: terms and occurrences trace
   * to the source edition. Canonical vocabularies live in
   * `src/content/v2/schema.ts` (`ConceptProvenanceStatus`,
   * `ConceptTermKind`, `ConceptLinkType`); these inline literals mirror
   * them so the base type stays dependency-free.
   */
  status?: 'legacy-project' | 'source-grounded';
  /** Source terms with per-form layer kinds (Layer A vs Layer B). */
  sourceTerms?: Array<{
    form: string;
    kind: 'attested' | 'normalised' | 'translated' | 'inferred';
    language?: 'sa' | 'en' | 'ml';
    note?: string;
  }>;
  /** Evidence-backed occurrences (canonical unit + commentary context). */
  occurrences?: Array<{
    unitId: string;
    sourceTerm?: string;
    relation?: 'text' | 'translation' | 'commentary' | 'interpretation' | 'provenance';
    context?: string;
    folio?: number;
    unmappedReason?: string;
    spanId?: string;
    quote?: string;
    note?: string;
  }>;
  /** Typed relationships, each carrying its own evidence. */
  conceptLinks?: Array<{
    to: string;
    type: 'synonymous-with' | 'variant-of' | 'broader-than' | 'narrower-than' | 'presupposes' | 'contrasts-with' | 'explains' | 'qualified-by' | 'leads-to' | 'inseparable-from' | 'distinguished-from' | 'identified-with';
    units?: string[];
    note?: string;
  }>;
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
