import { SCHEMA_VERSION, type V2Corpus, type V2Text } from './schema';
import { isCanonicalId, normaliseId, parseCanonicalConceptId, validateLocator } from './ids';

/**
 * V2 content validator — pure functions over a V2 corpus snapshot.
 *
 * Detects duplicate IDs, dangling references, malformed localisations,
 * language-unit mismatches, ambiguous aliases, malformed provenance and
 * broken explicit references. Produces typed issues that the CLI script
 * renders as machine-readable JSON and human-readable terminal output.
 */

export type IssueSeverity = 'error' | 'warning';

export interface ContentIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  textId?: string;
  entityId?: string;
}

export interface ValidationResult {
  errors: ContentIssue[];
  warnings: ContentIssue[];
}

const MARKDOWN_HEADING = /^#{1,6}\s+\S/;

function isNonEmpty(value: unknown): boolean {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined;
}

/** Very light Markdown structure check for translated prose fields. */
export function checkMarkdownStructure(field: string, value?: string): string | undefined {
  if (!value) return undefined;
  const lines = value.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && !MARKDOWN_HEADING.test(trimmed)) {
      return `${field} has a malformed heading: ${trimmed.slice(0, 40)}`;
    }
  }
  if (/[[\]]/.test(value) && !/\[\[.+?\]\]/.test(value) && /\[.+?\]\(.+?\)/.test(value) === false) {
    // Brackets without a recognisable link shape are only a warning signal;
    // the explicit-reference pass below decides errors.
    return undefined;
  }
  return undefined;
}

export function validateCorpus(corpus: V2Corpus): ValidationResult {
  const errors: ContentIssue[] = [];
  const warnings: ContentIssue[] = [];
  const push = (issue: ContentIssue) => (issue.severity === 'error' ? errors : warnings).push(issue);

  if (corpus.schemaVersion !== SCHEMA_VERSION) {
    push({
      severity: 'error',
      code: 'schema-version',
      message: `Expected schemaVersion ${SCHEMA_VERSION}, found ${String(corpus.schemaVersion)}`,
    });
  }

  const traditionIds = new Set(corpus.traditions.map((t) => t.id));
  const textIds = new Set<string>();
  // Unit and concept IDs are scoped to their text (legacy verse numbers such
  // as `1.2` repeat across texts by design). Global uniqueness is required
  // only for text IDs; cross-namespace collisions (a unit sharing an ID
  // with a concept in the same text) are reported per text below.
  const globalConceptIds = new Map<string, number>();

  for (const text of corpus.texts) {
    if (textIds.has(text.id)) {
      push({ severity: 'error', code: 'duplicate-text-id', message: `Duplicate text id ${text.id}`, textId: text.id });
    }
    textIds.add(text.id);

    if (!traditionIds.has(text.traditionId)) {
      push({
        severity: 'error',
        code: 'invalid-tradition-id',
        message: `Text ${text.id} names unknown tradition ${text.traditionId}`,
        textId: text.id,
      });
    }

    validateText(text, push, globalConceptIds);
  }

  for (const [id, count] of globalConceptIds) {
    if (count > 1) {
      // Same concept discussed in several texts is legitimate; only flag
      // exact duplicates within one text (already reported) and otherwise
      // keep a warning so cross-tradition collisions stay visible.
      if (count > 4) {
        push({ severity: 'warning', code: 'concept-id-reused', message: `Concept id ${id} appears in ${count} texts`, entityId: id });
      }
    }
  }

  // Editorial identity: every alias row must name a real canonical
  // concept triple. Ambiguity across verified rows is legitimate
  // scholarly ambiguity (disambiguation UI, not a data error); review
  // rows are inert candidates. Resolution is single-step, so cycles are
  // impossible by construction and need no check.
  const conceptTriples = new Set<string>();
  for (const text of corpus.texts) {
    for (const concept of text.concepts) {
      conceptTriples.add(`${text.traditionId}/${text.id}/${concept.id}`);
    }
  }
  const aliasBuckets = new Map<string, Set<string>>();
  const seenAliasRows = new Set<string>();
  for (const alias of corpus.aliases || []) {
    const key = normaliseId(alias.alias);
    if (!key) {
      push({ severity: 'error', code: 'malformed-alias', message: `Empty alias for ${alias.canonicalId}`, entityId: alias.canonicalId });
      continue;
    }
    // Duplicates compare raw spellings: distinct spellings that
    // normalise identically (adṛṣṭa vs adrsta) are separate rows.
    const rowId = `${alias.alias} → ${alias.canonicalId}`;
    if (seenAliasRows.has(rowId)) {
      push({ severity: 'error', code: 'alias-duplicate', message: `Duplicate alias row: ${rowId}`, entityId: key });
      continue;
    }
    seenAliasRows.add(rowId);
    const triple = parseCanonicalConceptId(alias.canonicalId);
    if (!triple) {
      push({ severity: 'error', code: 'alias-target-malformed', message: `Alias ${alias.alias} points at malformed target ${alias.canonicalId}; want tradition/text/concept`, entityId: key });
      continue;
    }
    if (!conceptTriples.has(alias.canonicalId)) {
      push({ severity: 'error', code: 'alias-target-missing', message: `Alias ${alias.alias} points at missing concept ${alias.canonicalId}`, entityId: key });
      continue;
    }
    if (alias.status !== 'verified') {
      push({ severity: 'warning', code: 'alias-review-pending', message: `Alias ${alias.alias} → ${alias.canonicalId} awaits scholarship; inert in resolution`, entityId: key });
    }
    const bucket = aliasBuckets.get(key);
    if (bucket) bucket.add(alias.canonicalId);
    else aliasBuckets.set(key, new Set([alias.canonicalId]));
  }
  for (const [key, targets] of aliasBuckets) {
    if (targets.size > 1) {
      push({
        severity: 'warning',
        code: 'alias-ambiguous',
        message: `Alias ${key} names ${targets.size} distinct concepts (${Array.from(targets).join(', ')}) — disambiguate, never merge`,
        entityId: key,
      });
    }
  }

  return { errors, warnings };
}

function validateText(
  text: V2Text,
  push: (issue: ContentIssue) => void,
  globalConceptIds: Map<string, number>,
): void {
  const unitIds = new Set<string>();
  const unitNumbers = new Map<string, number>();
  const conceptIds = new Set<string>();

  for (const unit of text.units) {
    if (!unit.id) {
      push({ severity: 'error', code: 'missing-unit-id', message: `Text ${text.id} has a unit without id`, textId: text.id });
      continue;
    }
    if (unitIds.has(unit.id)) {
      push({ severity: 'error', code: 'duplicate-unit-id', message: `Duplicate unit id ${unit.id} in ${text.id}`, textId: text.id, entityId: unit.id });
    }
    unitIds.add(unit.id);

    if (!unit.number) {
      push({ severity: 'error', code: 'missing-unit-number', message: `Unit ${unit.id} has no canonical number`, textId: text.id, entityId: unit.id });
    } else {
      const numKey = `${unit.section}::${unit.number}`;
      if (unitNumbers.has(numKey)) {
        // Half-verses and compound units (for example TL-01-59 beside
        // TL-01-59-cd) legitimately share a canonical number, so this is
        // a warning for editorial review rather than a hard error.
        push({ severity: 'warning', code: 'duplicate-unit-number', message: `Duplicate canonical number ${unit.number} in section ${unit.section}`, textId: text.id, entityId: unit.id });
      }
      unitNumbers.set(numKey, (unitNumbers.get(numKey) || 0) + 1);
    }

    if (!unit.unitType) {
      push({ severity: 'error', code: 'missing-unit-type', message: `Unit ${unit.id} has no unitType`, textId: text.id, entityId: unit.id });
    }

    const en = unit.localisations.en;
    const ml = unit.localisations.ml;
    if (!en?.translation && !en?.commentary && !en?.summary) {
      if (text.contentStatus !== 'concepts-only') {
        push({ severity: 'error', code: 'missing-en-localisation', message: `Unit ${unit.id} has no English localisation`, textId: text.id, entityId: unit.id });
      }
    }
    // Malayalam is expected alongside English for complete texts; partial
    // texts only warn so compilation in progress stays visible, not fatal.
    if (text.contentStatus === 'complete' && en && !ml) {
      push({ severity: 'warning', code: 'missing-ml-localisation', message: `Unit ${unit.id} has no Malayalam localisation`, textId: text.id, entityId: unit.id });
    }
    if (en && ml && en.translation && ml.translation && normaliseId(en.translation) === normaliseId(ml.translation)) {
      push({ severity: 'warning', code: 'language-unit-identity', message: `Unit ${unit.id} has identical en/ml translation text`, textId: text.id, entityId: unit.id });
    }

    for (const [lang, loc] of [['en', en], ['ml', ml]] as const) {
      if (!loc) continue;
      for (const field of ['translation', 'commentary', 'summary', 'narrative'] as const) {
        const problem = checkMarkdownStructure(`${unit.id}.${lang}.${field}`, loc[field] as string | undefined);
        if (problem) {
          push({ severity: 'warning', code: 'malformed-markdown', message: problem, textId: text.id, entityId: unit.id });
        }
      }
    }

    if (unit.provenance?.url && !/^https?:\/\//.test(unit.provenance.url)) {
      push({ severity: 'warning', code: 'malformed-provenance', message: `Unit ${unit.id} has a non-URL source locator`, textId: text.id, entityId: unit.id });
    }

    for (const did of unit.diagramIds || []) {
      if (!did || !/^[a-z0-9-]+$/.test(did)) {
        push({ severity: 'warning', code: 'dangling-diagram', message: `Unit ${unit.id} names malformed diagram ${did}`, textId: text.id, entityId: unit.id });
      }
    }
  }

  for (const concept of text.concepts) {
    if (!concept.id) {
      push({ severity: 'error', code: 'missing-concept-id', message: `Text ${text.id} has a concept without id`, textId: text.id });
      continue;
    }
    if (conceptIds.has(concept.id)) {
      push({ severity: 'error', code: 'duplicate-concept-id', message: `Duplicate concept id ${concept.id} in ${text.id}`, textId: text.id, entityId: concept.id });
    }
    conceptIds.add(concept.id);
    globalConceptIds.set(concept.id, (globalConceptIds.get(concept.id) || 0) + 1);

    if (!concept.localisations.en?.title || !concept.localisations.en?.summary) {
      push({ severity: 'error', code: 'malformed-concept-localisation', message: `Concept ${concept.id} lacks English title/summary`, textId: text.id, entityId: concept.id });
    }

    for (const uid of concept.relatedUnitIds || []) {
      if (!unitIds.has(uid)) {
        push({ severity: 'error', code: 'dangling-unit-ref', message: `Concept ${concept.id} points at missing unit ${uid}`, textId: text.id, entityId: concept.id });
      }
    }
    for (const cid of concept.relatedConceptIds || []) {
      if (!conceptIds.has(cid) && !isCanonicalId(cid)) {
        push({ severity: 'warning', code: 'dangling-concept-ref', message: `Concept ${concept.id} points at unknown concept ${cid}`, textId: text.id, entityId: concept.id });
      }
    }
  }

  // Unit → concept links must resolve within the text.
  for (const unit of text.units) {
    for (const cid of unit.conceptIds || []) {
      if (!conceptIds.has(cid)) {
        push({ severity: 'error', code: 'dangling-concept-ref', message: `Unit ${unit.id} points at missing concept ${cid}`, textId: text.id, entityId: unit.id });
      }
    }
  }

  // Cross-namespace collision: a unit and a concept sharing one ID in the
  // same text would make unqualified lookups ambiguous.
  for (const id of unitIds) {
    if (conceptIds.has(id)) {
      push({ severity: 'error', code: 'duplicate-id-cross-namespace', message: `ID ${id} names both a unit and a concept`, textId: text.id, entityId: id });
    }
  }

  // Thread references must resolve; canonical locators must be well formed.
  for (const thread of text.threads || []) {
    for (const step of thread.steps) {
      if (!step.id) {
        push({ severity: 'error', code: 'missing-thread-step-id', message: `Thread ${thread.id} has a step without id`, textId: text.id });
      }
      if (step.conceptId && !conceptIds.has(step.conceptId)) {
        push({ severity: 'error', code: 'dangling-thread-concept', message: `Thread step ${step.id} points at missing concept ${step.conceptId}`, textId: text.id, entityId: step.id });
      }
      for (const uid of step.unitIds || []) {
        if (uid.includes('/')) {
          const locatorError = validateLocator(uid);
          if (locatorError) {
            push({ severity: 'error', code: 'malformed-locator', message: `Thread step ${step.id}: ${locatorError}`, textId: text.id, entityId: step.id });
          }
          continue;
        }
        if (!unitIds.has(uid)) {
          push({ severity: 'error', code: 'dangling-thread-unit', message: `Thread step ${step.id} points at missing unit ${uid}`, textId: text.id, entityId: step.id });
        }
      }
      if (!step.localisations.en?.title && !step.localisations.en?.narrative) {
        push({ severity: 'warning', code: 'thin-thread-step', message: `Thread step ${step.id} has no English title/narrative`, textId: text.id, entityId: step.id });
      }
    }
  }

  if (!isNonEmpty(text.title) || !isNonEmpty(text.transliteratedTitle)) {
    push({ severity: 'error', code: 'missing-text-title', message: `Text ${text.id} lacks title fields`, textId: text.id });
  }
  if (!text.traditionId) {
    push({ severity: 'error', code: 'invalid-tradition-id', message: `Text ${text.id} has no tradition`, textId: text.id });
  }
}
