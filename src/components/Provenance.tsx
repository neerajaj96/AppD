import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { t, type UIKey } from '../i18n/ui';
import type { EditorialFieldState, EditorialStatus, SourceProvenance, V2Source } from '../content/v2/schema';
import { copyText } from '../content/v2/citation';
import { announce } from '../a11y';
import { CollapsibleSection, SectionTitle } from './Primitives';

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
      {ed.length > 0 && (
        <div>
          <h4 className="t-label text-tamas mb-2">{t(language, 'edTitle')}</h4>
          <dl className="space-y-1.5">
            {ed.map((row) => (
              <div key={row.field} className="flex items-baseline justify-between gap-3 text-sm">
                <dt className="shrink-0 text-tamas">{t(language, ED_FIELD_LABEL[row.field])}</dt>
                <dd className="text-right text-sattva-dim">{t(language, ED_STATE_LABEL[row.state])}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

/** Shared definition-list rendering for provenance rows. */
function ProvRows({ rows }: { rows: ProvRow[] }) {
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
 * One source record as a stable, linkable card. Only carried fields
 * render — the record id anchors it as a semantic reference.
 */
export function SourceCard({ source }: { source: V2Source }) {
  return (
    <article
      id={`source-${source.id}`}
      aria-label={source.title}
      className="rounded-2xl border border-tamas-deep bg-avyakta-2 p-5"
    >
      <h4 className="font-serif font-bold text-sattva break-words">{source.title}</h4>
      <p className="mt-0.5 text-xs tabular-nums text-tamas">{source.id}</p>
      <div className="mt-3">
        <ProvRows rows={provenanceRows(source)} />
      </div>
    </article>
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
    <p aria-label={t(language, 'citationLabel')} className="t-body-sans text-sattva-dim break-words">
      {citation}
    </p>
  );
}

/** Copy-citation action with polite success / assertive failure announcements. */
export function CitationButton({ citation }: { citation: string }) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(citation);
        announce(t(language, ok ? 'citationCopied' : 'citationCopyFailed'), ok ? 'polite' : 'assertive');
        if (ok) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }
      }}
      aria-label={t(language, 'copyCitation')}
      className="inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-xl text-sm font-semibold bg-avyakta-3 border border-tamas-deep text-sattva hover:bg-avyakta-4 transition-colors motion-reduce:transition-none"
    >
      {copied ? t(language, 'citationCopied') : t(language, 'copyCitation')}
    </button>
  );
}
