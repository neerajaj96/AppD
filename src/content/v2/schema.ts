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
  /**
   * Thread-step claim: what the passage establishes (Phase 4). Lives
   * in localisations so both languages carry it; never a free-form AI
   * summary — traceable to the step's evidence.
   */
  claim?: string;
  /**
   * Thread-step transition: why the reader proceeds here from the
   * previous step. First steps carry none.
   */
  transition?: string;
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
  /**
   * Speaker label exactly as printed in the source edition, where the
   * edition states one (e.g. Gītā `अर्जुन`). Absent means no label is
   * printed at that unit — normal mid-run — never an unknown speaker.
   * Optional: units without edition evidence stay absent, never guessed.
   */
  speaker?: string;
  /**
   * The edition's own number for this unit where it differs from, or
   * clarifies, the canonical `number` (e.g. Gītā KSTS `12` for canonical
   * `2.11`, `78-79` for a split verse, `6.10` for transposed text).
   * Absent means identical to canonical or unestablished — never invented.
   */
  sourceNumber?: string;
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
  /**
   * Scholarly provenance of the concept record itself. `legacy-project`
   * marks records authored from project commentary before source
   * grounding existed; `source-grounded` marks records whose terms and
   * occurrences trace to the source edition. Absent stays absent (older
   * records predate the distinction); curation backfills Gītā records.
   */
  status?: ConceptProvenanceStatus;
  /** Source terms (Layer A) with normalised scholarly labels (Layer B). */
  sourceTerms?: V2SourceTerm[];
  /** Evidence-backed occurrences; replaces bare unit-id lists. */
  occurrences?: V2ConceptOccurrence[];
  /** Typed relationships; each carries its own evidence. */
  conceptLinks?: V2ConceptLink[];
}

/**
 * Concept-record provenance. Only these two states exist: a record is
 * either project-authored (`legacy-project`) or source-traced
 * (`source-grounded`). Interpretive claims (Layer C) live in occurrence
 * notes and link evidence, never in this flag.
 */
export const CONCEPT_PROVENANCE_STATUSES = ['legacy-project', 'source-grounded'] as const;

export type ConceptProvenanceStatus = (typeof CONCEPT_PROVENANCE_STATUSES)[number];

export function isConceptProvenanceStatus(value: unknown): value is ConceptProvenanceStatus {
  return typeof value === 'string' && (CONCEPT_PROVENANCE_STATUSES as readonly string[]).includes(value);
}

/**
 * How a concept label relates to the source. `attested` (verbatim
 * Devanagari form found in print), `normalised` (editorial IAST head
 * form), `translated` (rendered into another language),
 * `inferred` (analytical label — never presented as a quotation).
 */
export const CONCEPT_TERM_KINDS = ['attested', 'normalised', 'translated', 'inferred'] as const;

export type ConceptTermKind = (typeof CONCEPT_TERM_KINDS)[number];

export function isConceptTermKind(value: unknown): value is ConceptTermKind {
  return typeof value === 'string' && (CONCEPT_TERM_KINDS as readonly string[]).includes(value);
}

export interface V2SourceTerm {
  /** Exact form (`कर्म`, `Karman`, `action`). */
  form: string;
  kind: ConceptTermKind;
  /** Script/language of the form where not obvious. */
  language?: 'sa' | 'en' | 'ml';
  note?: string;
}

/**
 * One evidence-backed occurrence: the full chain from concept to
 * source. Folio and KSTS number resolve through the text's page map
 * (e.g. `gitaPageMap`) at validation/render time; an explicit `folio`
 * is carried only when the evidence sits off the verse page
 * (avataraṇikā, front matter), and then `unmappedReason` is required.
 * Commentary-span precision stays pending until segmentation exists —
 * the `context` field says what granularity this row actually has.
 */
export interface V2ConceptOccurrence {
  /** Canonical unit carrying the occurrence. */
  unitId: string;
  /** Exact printed source term at this occurrence, where distinctive. */
  sourceTerm?: string;
  /** Which layer establishes it (`text` for mūla terms, `commentary` for glosses). */
  relation?: V2EvidenceRelation;
  /** Granularity/role, e.g. `pratīka gloss`, `nanu resolution`, `avataraṇikā`. */
  context?: string;
  /** Explicit folio when the evidence sits off the verse page. */
  folio?: number;
  /** Required when the unit has no KSTS row (front/chapter-opening matter). */
  unmappedReason?: string;
  /** Brief verbatim fragment (Devanāgarī only — enforced). */
  quote?: string;
  note?: string;
}

/**
 * Typed concept relationships. Only these types exist; each link
 * carries evidence (supporting units and/or a note) — co-occurrence
 * alone never justifies a link.
 */
export const CONCEPT_LINK_TYPES = [
  'synonymous-with',
  'variant-of',
  'broader-than',
  'narrower-than',
  'presupposes',
  'contrasts-with',
  'explains',
  'qualified-by',
  'leads-to',
  'inseparable-from',
  'distinguished-from',
  'identified-with',
] as const;

export type ConceptLinkType = (typeof CONCEPT_LINK_TYPES)[number];

export function isConceptLinkType(value: unknown): value is ConceptLinkType {
  return typeof value === 'string' && (CONCEPT_LINK_TYPES as readonly string[]).includes(value);
}

export interface V2ConceptLink {
  /** Target concept id (same text unless evidence says otherwise). */
  to: string;
  type: ConceptLinkType;
  /** Supporting canonical units. */
  units?: string[];
  /** Why the link holds, with source grounding. */
  note?: string;
}

export interface V2ThreadStep {
  id: string;
  /** Owning text for steps in a multi-text tradition thread. */
  textId?: string;
  conceptId?: string;
  /** All involved concepts (Phase 4); conceptId stays the primary for legacy readers. */
  conceptIds?: string[];
  unitIds?: string[];
  /**
   * Rhetorical role of the step (Phase 4 scholarly threads).
   * Optional and never forced; unmarked steps stay unmarked.
   */
  role?: ThreadStepRole;
  /**
   * How the step is evidenced: direct passage, printed cross-reference,
   * structural (chapter opening/closing), or editorial synthesis.
   * Synthesis must never render as quotation.
   */
  evidenceKind?: ThreadEvidenceKind;
  /**
   * Whether the step's claim is source-backed or editorial. Required
   * wherever a claim is present on a scholarly thread.
   */
  claimStatus?: ThreadClaimStatus;
  /** Commentary-span ids grounding sub-unit precision (Gītā sidecar). */
  spanIds?: string[];
  localisations: Partial<Record<SupportedV2Language, UnitLocalisation>>;
}

/**
 * ThreadStep rhetorical roles (closed vocabulary). `context` covers
 * gateway/background matter such as avatāraṇikās; `unresolved` marks
 * a step that ends in an open question rather than a conclusion.
 */
export const THREAD_STEP_ROLES = [
  'question',
  'premise',
  'objection',
  'response',
  'distinction',
  'definition',
  'example',
  'inference',
  'consequence',
  'conclusion',
  'context',
  'unresolved',
] as const;

export type ThreadStepRole = (typeof THREAD_STEP_ROLES)[number];

export function isThreadStepRole(value: unknown): value is ThreadStepRole {
  return typeof value === 'string' && (THREAD_STEP_ROLES as readonly string[]).includes(value);
}

export const THREAD_EVIDENCE_KINDS = ['direct', 'cross-reference', 'structural', 'synthesis'] as const;

export type ThreadEvidenceKind = (typeof THREAD_EVIDENCE_KINDS)[number];

export function isThreadEvidenceKind(value: unknown): value is ThreadEvidenceKind {
  return typeof value === 'string' && (THREAD_EVIDENCE_KINDS as readonly string[]).includes(value);
}

export const THREAD_CLAIM_STATUSES = ['source-backed', 'editorial'] as const;

export type ThreadClaimStatus = (typeof THREAD_CLAIM_STATUSES)[number];

export function isThreadClaimStatus(value: unknown): value is ThreadClaimStatus {
  return typeof value === 'string' && (THREAD_CLAIM_STATUSES as readonly string[]).includes(value);
}

export interface V2Thread {
  id: string;
  traditionId: string;
  textId?: string;
  title?: string;
  /**
   * Orientation threads navigate; scholarly threads argue from
   * evidence. Absent means orientation (all records predate the
   * distinction).
   */
  kind?: ThreadKind;
  /** Scholarly subtype; only meaningful with kind `scholarly`. */
  scholarlyType?: ScholarlyThreadType;
  /** Localised title/summary for switchers and headers. */
  localisations?: Partial<Record<SupportedV2Language, UnitLocalisation>>;
  steps: V2ThreadStep[];
}

export const THREAD_KINDS = ['orientation', 'scholarly'] as const;

export type ThreadKind = (typeof THREAD_KINDS)[number];

export function isThreadKind(value: unknown): value is ThreadKind {
  return typeof value === 'string' && (THREAD_KINDS as readonly string[]).includes(value);
}

export const SCHOLARLY_THREAD_TYPES = [
  'concept',
  'argument',
  'cross-verse',
  'chapter',
  'doctrinal',
  'recensional',
] as const;

export type ScholarlyThreadType = (typeof SCHOLARLY_THREAD_TYPES)[number];

export function isScholarlyThreadType(value: unknown): value is ScholarlyThreadType {
  return typeof value === 'string' && (SCHOLARLY_THREAD_TYPES as readonly string[]).includes(value);
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
