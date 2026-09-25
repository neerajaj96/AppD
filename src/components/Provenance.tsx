import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t, type UIKey } from '../i18n/ui';
import type { EditorialFieldState, EditorialStatus, SourceProvenance, SourceRecordRole, V2EvidenceLink, V2EvidenceRelation, V2Source } from '../content/v2/schema';
import { copyText } from '../content/v2/citation';
import { announce } from '../a11y';
import { CollapsibleSection, DisclosureChevron, SectionTitle } from './Primitives';

/**
 * Restrained Source / Textual information area (Prompt 4).
 *
 * Renders only the provenance and editorial fields the V2 data actually
 * carries — absent fields are omitted, never faked with placeholders.
 * Returns null when there is nothing to show, so callers need no
 * conditional logic. Pure row builders keep the omission contract
 * unit-testable without rendering.
 */

export type ProvRowKey = 'source' | 'translator' | 'reference' | 'rights' | 'note';

export interface ProvRow {
  key: ProvRowKey;
  value: string;
  url?: string;
}

/** Flatten a V2 provenance record into display rows, skipping unknowns. */
export function provenanceRows(prov: SourceProvenance | undefined): ProvRow[] {
  if (!prov) return [];
  const rows: ProvRow[] = [];
  const citation = [prov.author, prov.edition, prov.publisher, prov.year]
    .filter((v) => v !== undefined && String(v).trim().length > 0)
    .map(String)
    .join(', ');
  const sourceValue = [prov.sourceTitle, citation]
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .join(' — ');
  if (sourceValue) rows.push({ key: 'source', value: sourceValue, url: prov.url });
  if (prov.translator?.trim()) rows.push({ key: 'translator', value: prov.translator.trim() });
  const reference = [prov.locator, prov.page, prov.section, prov.volume]
    .filter((v) => v !== undefined && String(v).trim().length > 0)
    .map(String)
    .join(' · ');
  if (reference) rows.push({ key: 'reference', value: reference });
  if (prov.rights && prov.rights !== 'unknown') {
    rows.push({ key: 'rights', value: prov.rights });
  }
  if (prov.notes?.trim()) rows.push({ key: 'note', value: prov.notes.trim() });
  // A bare URL with no other data still earns one row.
  if (rows.length === 0 && prov.url) rows.push({ key: 'source', value: prov.url, url: prov.url });
  return rows;
}

export type EdField =
  | 'sanskrit'
  | 'iast'
  | 'englishTranslation'
  | 'malayalamTranslation'
  | 'englishCommentary'
  | 'malayalamCommentary'
  | 'concepts'
  | 'references'
  | 'provenance';

export interface EdRow {
  field: EdField;
  state: EditorialFieldState;
}

/** Keep only editorial fields that carry an actual state. */
export function editorialRows(ed: EditorialStatus | undefined): EdRow[] {
  if (!ed) return [];
  const fields: EdField[] = [
    'sanskrit',
    'iast',
    'englishTranslation',
    'malayalamTranslation',
    'englishCommentary',
    'malayalamCommentary',
    'concepts',
    'references',
    'provenance',
  ];
  return fields.flatMap((field) => {
    const state = ed[field];
    return state ? [{ field, state }] : [];
  });
}

const PROV_LABEL: Record<ProvRowKey, UIKey> = {
  source: 'provSource',
  translator: 'provTranslator',
  reference: 'provReference',
  rights: 'provRights',
  note: 'provNote',
};

const RIGHTS_LABEL: Record<string, UIKey> = {
  'public-domain': 'rightsPublicDomain',
  original: 'rightsOriginal',
  licensed: 'rightsLicensed',
};

const ED_FIELD_LABEL: Record<EdField, UIKey> = {
  sanskrit: 'edSanskrit',
  iast: 'edIast',
  englishTranslation: 'translationLabel',
  malayalamTranslation: 'edMlTranslation',
  englishCommentary: 'commentaryLabel',
  malayalamCommentary: 'edMlCommentary',
  concepts: 'conceptsLabel',
  references: 'edReferences',
  provenance: 'edProvenance',
};

const ED_STATE_LABEL: Record<EditorialFieldState, UIKey> = {
  missing: 'edMissing',
  draft: 'edDraft',
  generated: 'edGenerated',
  'review-needed': 'edReviewNeeded',
  reviewed: 'edReviewed',
  verified: 'edVerified',
};

/** Localised label for a source-record role; absent role renders nothing. */
export const SOURCE_ROLE_LABEL: Record<SourceRecordRole, UIKey> = {
  'primary-text': 'rolePrimaryText',
  translation: 'roleTranslation',
  commentary: 'roleCommentary',
  secondary: 'roleSecondary',
  provenance: 'roleProvenance',
  editorial: 'roleEditorial',
};

/** Localised label for a unit→source evidence relationship. */
export const EVIDENCE_RELATION_LABEL: Record<V2EvidenceRelation, UIKey> = {
  text: 'relationText',
  translation: 'relationTranslation',
  commentary: 'relationCommentary',
  interpretation: 'relationInterpretation',
  provenance: 'relationProvenance',
};

/**
 * Crash-safe lookups for role/relation labels. Typed callers always hit,
 * but repository payloads arrive as JSON — an unrecognised value renders
 * nothing instead of throwing inside `t()`.
 */
export function sourceRoleLabelKey(role: string | undefined): UIKey | undefined {
  if (!role) return undefined;
  return (SOURCE_ROLE_LABEL as Record<string, UIKey | undefined>)[role];
}

/** Crash-safe lookup for evidence-relation labels; unknown values render nothing. */
export function evidenceRelationLabelKey(relation: string | undefined): UIKey | undefined {
  if (!relation) return undefined;
  return (EVIDENCE_RELATION_LABEL as Record<string, UIKey | undefined>)[relation];
}

export interface EvidenceRow {
  source: V2Source;
  relation?: V2EvidenceRelation;
}

/**
 * Pair each attached source with its evidence relation, preserving every
 * record in registry order. Sources without a link keep no relation (the
 * card renders normally, never fabricating one); dangling link targets
 * match nothing and are ignored.
 */
export function resolveEvidenceRows(
  sources: V2Source[],
  evidenceLinks?: V2EvidenceLink[],
): EvidenceRow[] {
  return sources.map((source) => {
    const link = (evidenceLinks || []).find((l) => l.sourceId === source.id);
    const relation = link && evidenceRelationLabelKey(link.relation) ? link.relation : undefined;
    return { source, relation };
  });
}

export default function SourceInfo({
  provenance,
  editorial,
}: {
  provenance?: SourceProvenance;
  editorial?: EditorialStatus;
}) {
  const { language } = useLanguage();
  const prov = provenanceRows(provenance);
  const ed = editorialRows(editorial);
  if (prov.length === 0 && ed.length === 0) return null;
  return (
    <CollapsibleSection title={t(language, 'sourceInfoTitle')} defaultOpen={false}>
      <ProvenanceContent provenance={provenance} editorial={editorial} />
    </CollapsibleSection>
  );
}

/** Inner provenance/editorial content without its own disclosure wrapper. */
export function ProvenanceContent({
  provenance,
  editorial,
}: {
  provenance?: SourceProvenance;
  editorial?: EditorialStatus;
}) {
  const { language } = useLanguage();
  const prov = provenanceRows(provenance);
  const ed = editorialRows(editorial);
  if (prov.length === 0 && ed.length === 0) return null;
  return (
    <div className="space-y-4">
      {prov.length > 0 && <ProvRows rows={prov} />}
      {ed.length > 0 && <EditorialRows rows={ed} />}
    </div>
  );
}

/** Field-level editorial workflow state, kept separate from source evidence. */
export function EditorialRows({ rows }: { rows: EdRow[] }) {
  const { language } = useLanguage();
  return (
    <div>
      <h4 className="t-label text-tamas mb-2">{t(language, 'edTitle')}</h4>
      <dl className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.field} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="shrink-0 text-tamas">{t(language, ED_FIELD_LABEL[row.field])}</dt>
            <dd className="text-right text-sattva-dim">{t(language, ED_STATE_LABEL[row.state])}</dd>
          </div>
        ))}
      </dl>
      <p className="t-caption text-tamas mt-2">{t(language, 'editorialNote')}</p>
    </div>
  );
}

/** Shared definition-list rendering for provenance rows. */
export function ProvRows({ rows }: { rows: ProvRow[] }) {
  const { language } = useLanguage();
  return (
    <dl className="space-y-2">
      {rows.map((row, i) => (
        <div key={`${row.key}-${i}`} className="flex items-baseline justify-between gap-3 text-sm">
          <dt className="shrink-0 text-tamas">{t(language, PROV_LABEL[row.key])}</dt>
          <dd className="min-w-0 text-right text-sattva-dim">
            {row.key === 'rights' && RIGHTS_LABEL[row.value] ? (
              t(language, RIGHTS_LABEL[row.value])
            ) : row.url ? (
              <a
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="break-all underline decoration-rajas/40 underline-offset-2 hover:text-sattva transition-colors motion-reduce:transition-none"
              >
                {row.value}
                <ExternalLink aria-hidden="true" focusable="false" className="ms-1 inline h-3.5 w-3.5 shrink-0 align-baseline" />
                <span className="sr-only">{t(language, 'externalLinkNote')}</span>
              </a>
            ) : (
              <span className="break-words">{row.value}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Quiet semantic badge naming what an attached source establishes for one
 * unit. Bracketed text (never colour alone) carries the meaning; the chip
 * stays visually secondary to the source title.
 */
export function EvidenceRelationBadge({ relation }: { relation: V2EvidenceRelation }) {
  const { language } = useLanguage();
  const key = evidenceRelationLabelKey(relation);
  if (!key) return null;
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-tamas-deep bg-avyakta-3 px-2 py-0.5 text-xs font-semibold text-sattva-dim">
      [{t(language, key)}]
    </span>
  );
}

/**
 * One source record as a compact expandable row. The title leads; the
 * source role (what the source IS for Darśana) renders as a quiet line
 * while the evidence relation (what the source establishes for this
 * unit) renders as a bracketed badge — the two are never merged into one
 * label. Full edition metadata opens in place; a record carrying nothing
 * beyond its title renders statically with no empty disclosure.
 */
export function SourceCard({ source, relation }: { source: V2Source; relation?: V2EvidenceRelation }) {
  const { language } = useLanguage();
  const roleKey = sourceRoleLabelKey(source.role);
  const relationKey = evidenceRelationLabelKey(relation);
  const details = provenanceRows(source);
  const header = (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {relationKey && relation && <EvidenceRelationBadge relation={relation} />}
        <span className="font-serif font-bold text-sattva break-words">{source.title}</span>
      </span>
      {roleKey && <span className="mt-0.5 block text-xs text-tamas">{t(language, roleKey)}</span>}
    </span>
  );
  // Nothing to expand: show the source normally, without fabricating chrome.
  if (details.length === 0) {
    return (
      <article aria-label={source.title} className="border-b border-tamas-deep py-2.5 last:border-b-0">
        {header}
      </article>
    );
  }
  return (
    <article
      id={`source-${source.id}`}
      aria-label={source.title}
      className="border-b border-tamas-deep py-1 last:border-b-0"
    >
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-2.5 rounded-lg py-2.5 [&::-webkit-details-marker]:hidden">
          {header}
          <span className="sr-only">{t(language, 'sourceDetails')}</span>
          <DisclosureChevron open={false} className="mt-1 shrink-0 group-open:rotate-180" />
        </summary>
        <div className="pb-3">
          <ProvRows rows={details} />
        </div>
      </details>
    </article>
  );
}

/**
 * Compact evidence list for one unit: every attached source stays
 * represented as its own expandable row with its own relation badge.
 * With no attachments, a localised empty state explains the absence —
 * absence from the repository never claims absence of a historical
 * source.
 */
export function EvidenceList({ rows }: { rows: EvidenceRow[] }) {
  const { language } = useLanguage();
  return (
    <section aria-label={t(language, 'evidenceTitle')}>
      <h4 className="t-label text-tamas mb-1">
        {t(language, 'evidenceTitle')}
        {rows.length > 0 && <span className="ms-1.5 font-medium">({rows.length})</span>}
      </h4>
      {rows.length > 0 ? (
        <ul>
          {rows.map(({ source, relation }) => (
            <li key={source.id}>
              <SourceCard source={source} relation={relation} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-1">
          <p className="text-sm font-semibold text-sattva">{t(language, 'noSourcesTitle')}</p>
          <p className="t-body-sans text-sattva-dim mt-0.5">{t(language, 'noSourcesBody')}</p>
        </div>
      )}
    </section>
  );
}

/** List of source records. Renders nothing when the registry is empty. */
export function SourceList({ sources }: { sources: V2Source[] }) {
  const { language } = useLanguage();
  if (sources.length === 0) return null;
  return (
    <section aria-label={t(language, 'sourcesTitle')} className="space-y-3">
      <SectionTitle count={sources.length}>{t(language, 'sourcesTitle')}</SectionTitle>
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </section>
  );
}

/** Deterministic citation text for a canonical unit. */
export function CitationText({ citation }: { citation: string }) {
  const { language } = useLanguage();
  return (
    <p aria-label={t(language, 'citationLabel')} className="t-body-sans text-sattva-dim break-words [overflow-wrap:anywhere]">
      {citation}
    </p>
  );
}

/**
 * Copy-citation action. The visible label never depends on hover; success
 * swaps the label briefly while failure shows a persistent inline error.
 * Screen-reader confirmation travels through the shared live-region
 * announcer (mirroring the reader share control: visual feedback stays
 * aria-hidden so the message is never announced twice). No new clipboard
 * abstraction — the shared `copyText` helper does the work.
 */
export function CitationButton({ citation }: { citation: string }) {
  const { language } = useLanguage();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={async () => {
          window.clearTimeout(timer.current);
          const ok = await copyText(citation);
          announce(t(language, ok ? 'citationCopied' : 'citationCopyFailed'), ok ? 'polite' : 'assertive');
          setState(ok ? 'copied' : 'failed');
          if (ok) {
            timer.current = window.setTimeout(() => setState('idle'), 2000);
          }
        }}
        aria-label={t(language, 'copyCitation')}
        className="inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-xl text-sm font-semibold bg-avyakta-3 border border-tamas-deep text-sattva hover:bg-avyakta-4 transition-colors motion-reduce:transition-none"
      >
        {state === 'copied' ? t(language, 'citationCopied') : t(language, 'copyCitation')}
      </button>
      {state !== 'idle' && (
        <p aria-hidden="true" className={`text-xs ${state === 'copied' ? 'text-teal' : 'text-crimson'}`}>
          {t(language, state === 'copied' ? 'citationCopied' : 'citationCopyFailed')}
        </p>
      )}
    </div>
  );
}
