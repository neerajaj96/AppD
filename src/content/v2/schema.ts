/**
 * Darśana V2 canonical content contract (schemaVersion 2).
 *
 * Pure data only — this module must never import React or UI code. It
 * describes the scholarly library the app renders, in a form that can be
 * validated, chunked, indexed and stored independently of the current
 * monolithic `src/content` bundle.
 *
 * Indian English is used in all prose fields handled through this schema.
 */

export const SCHEMA_VERSION = 2 as const;

/** Scholarly category of a tradition. Never collapse these silently. */
export type TraditionCategory =
  | 'philosophical-school'
  | 'scriptural-tradition'
  | 'sectarian-tradition'
  | 'tantric-tradition'
  | 'devotional-tradition'
  | 'practice-tradition'
  | 'modern-synthesis'
  | 'secondary-exposition';

export interface Tradition {
  id: string;
  title: string;
  transliteratedTitle?: string;
  category: TraditionCategory;
  description?: string;
  /** Key into the Guṇa accent registry (e.g. `samkhya`, `yoga`). */
  accentKey?: string;
}

/** Explicit role of a text within its tradition. */
export type SourceRole =
  | 'primary'
  | 'scripture'
  | 'commentary'
  | 'devotional'
  | 'secondary'
  | 'modern-synthesis'
  | 'practice'
  | 'reference';

export type ContentStatus = 'complete' | 'partial' | 'concepts-only' | 'unknown';

/** Kinds of canonical unit already present in the corpus. */
export type UnitType =
  | 'sutra'
  | 'sloka'
  | 'karika'
  | 'mantra'
  | 'verse'
  | 'paragraph'
  | 'section';

export type SupportedV2Language = 'en' | 'ml';

/**
 * One language rendering of a canonical unit. Every field is optional so
 * that sūtra, mantra, paragraph and section units are not forced into
 * verse semantics. A localisation may carry whichever fields suit its unit.
 */
export interface UnitLocalisation {
  title?: string;
  translation?: string;
  commentary?: string;
  summary?: string;
  narrative?: string;
  keyPoints?: string[];
  wordMeaning?: string;
  variantNote?: string;
  beginnerExplanation?: string;
  advancedExplanation?: string;
  misconceptions?: string[];
}

export type RightsStatus = 'public-domain' | 'original' | 'licensed' | 'unknown';

/** Explicit provenance for a unit, text or concept. Unknown stays unknown. */
export interface SourceProvenance {
  sourceTitle?: string;
  author?: string;
  edition?: string;
  publisher?: string;
  year?: string | number;
  translator?: string;
  page?: string;
  section?: string;
  volume?: string;
  locator?: string;
  url?: string;
  rights?: RightsStatus;
  notes?: string;
}

export type EditorialFieldState =
  | 'missing'
  | 'draft'
  | 'generated'
  | 'review-needed'
  | 'reviewed'
  | 'verified';

/** Field-level editorial status; replaces complete/partial alone. */
export interface EditorialStatus {
  sanskrit?: EditorialFieldState;
  iast?: EditorialFieldState;
  englishTranslation?: EditorialFieldState;
  malayalamTranslation?: EditorialFieldState;
  englishCommentary?: EditorialFieldState;
  malayalamCommentary?: EditorialFieldState;
  concepts?: EditorialFieldState;
  references?: EditorialFieldState;
  provenance?: EditorialFieldState;
}

export interface CanonicalUnit {
  id: string;
  number: string;
  section: string;
  subsection?: string;
  unitType: UnitType;
  devanagari?: string;
  iast?: string;
  /** Language-independent metadata (metre, adhyāya, pāda, …). */
  metadata?: Record<string, string>;
  localisations: Partial<Record<SupportedV2Language, UnitLocalisation>>;
  conceptIds?: string[];
  sourceIds?: string[];
  /**
   * Precise evidence relationships to attached sources. Optional and
   * sparse: `sourceIds` alone remains the broad association, and units
   * without links behave exactly as before. A link is only encoded
   * where repository evidence states what the source supplied.
   */
  evidenceLinks?: V2EvidenceLink[];
  diagramIds?: string[];
  /** Original textual notes (e.g. edition variants); carried verbatim. */
  interpretiveNotes?: Array<{ note: string }>;
  provenance?: SourceProvenance;
  editorial?: EditorialStatus;
}

export interface V2Concept {
  id: string;
  category?: string;
  diagramIds?: string[];
  relatedUnitIds?: string[];
  relatedConceptIds?: string[];
  localisations: Partial<Record<SupportedV2Language, UnitLocalisation>>;
  provenance?: SourceProvenance;
  editorial?: EditorialStatus;
}

export interface V2ThreadStep {
  id: string;
  /** Owning text for steps in a multi-text tradition thread. */
  textId?: string;
  conceptId?: string;
  unitIds?: string[];
  localisations: Partial<Record<SupportedV2Language, UnitLocalisation>>;
}

export interface V2Thread {
  id: string;
  traditionId: string;
  textId?: string;
  title?: string;
  steps: V2ThreadStep[];
}

/** Typed reference kinds. Prefer these over free-form strings. */
export type ReferenceKind =
  | 'unit-to-concept'
  | 'concept-to-unit'
  | 'concept-to-concept'
  | 'unit-to-unit'
  | 'text-to-text'
  | 'thread-to-concept'
  | 'thread-to-unit'
  | 'concept-to-tradition'
  | 'cross-tradition'
  | 'source-to-unit';

export interface V2Reference {
  kind: ReferenceKind;
  from: string;
  to: string;
  note?: string;
}

/**
 * Role a source record plays in producing Darśana content — distinct
 * from the record's identity (what the source IS) and from the
 * text-level `SourceRole` (what a text is within its tradition).
 * Optional: records whose evidence supports no single role stay absent
 * rather than carrying a guessed label.
 */
export const SOURCE_RECORD_ROLES = [
  'primary-text',
  'translation',
  'commentary',
  'secondary',
  'provenance',
  'editorial',
] as const;

export type SourceRecordRole = (typeof SOURCE_RECORD_ROLES)[number];

export function isSourceRecordRole(value: unknown): value is SourceRecordRole {
  return typeof value === 'string' && (SOURCE_RECORD_ROLES as readonly string[]).includes(value);
}

/**
 * Precise evidence relationship between one unit and one attached
 * source: which layer of the unit the source supports. Distinct from
 * the source record's own role (what the source IS for the text) and
 * from the broad `sourceIds` association (WHICH sources are attached).
 * A link is only encoded where repository evidence states the layer;
 * vague consultation notes keep the broad association without a link.
 */
export const EVIDENCE_RELATIONS = [
  'text',
  'translation',
  'commentary',
  'interpretation',
  'provenance',
] as const;

export type V2EvidenceRelation = (typeof EVIDENCE_RELATIONS)[number];

export function isEvidenceRelation(value: unknown): value is V2EvidenceRelation {
  return typeof value === 'string' && (EVIDENCE_RELATIONS as readonly string[]).includes(value);
}

export interface V2EvidenceLink {
  sourceId: string;
  relation: V2EvidenceRelation;
}

export interface V2Source {
  id: string;
  title: string;
  author?: string;
  edition?: string;
  publisher?: string;
  year?: string | number;
  translator?: string;
  page?: string;
  section?: string;
  volume?: string;
  locator?: string;
  url?: string;
  rights?: RightsStatus;
  notes?: string;
  role?: SourceRecordRole;
}

export interface V2Diagram {
  id: string;
  title: string;
}

/** Human alias pointing at a canonical namespaced ID. */
export type AliasStatus = 'verified' | 'review';

export interface V2Alias {
  alias: string;
  /** Canonical concept identity in `tradition/text/concept` triple form. */
  canonicalId: string;
  /** verified: curated equivalence, safe to resolve. review: candidate, inert. */
  status?: AliasStatus;
  note?: string;
}

export interface V2Text {
  id: string;
  title: string;
  transliteratedTitle: string;
  author?: string;
  traditionalAttribution?: string;
  traditionId: string;
  sourceRole: SourceRole;
  description?: string;
  /** Display term for canonical units (Sūtra, Kārikā, …); carried from legacy meta. */
  verseTerm?: string;
  contentStatus: ContentStatus;
  languages: SupportedV2Language[];
  units: CanonicalUnit[];
  concepts: V2Concept[];
  threads?: V2Thread[];
  sources?: V2Source[];
  diagrams?: V2Diagram[];
  aliases?: V2Alias[];
  provenance?: SourceProvenance;
  editorial?: EditorialStatus;
}

export interface V2TextManifest {
  schemaVersion: typeof SCHEMA_VERSION;
  textId: string;
  traditionId: string;
  units: { expected: number; present: number };
  languages: {
    en: { units: number; concepts: number };
    ml: { units: number; concepts: number };
  };
  status: ContentStatus;
  source?: SourceProvenance;
}

export interface V2Corpus {
  schemaVersion: typeof SCHEMA_VERSION;
  traditions: Tradition[];
  texts: V2Text[];
  aliases: V2Alias[];
}
