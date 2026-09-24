import { useLanguage } from '../context/LanguageContext';
import { t, type UIKey } from '../i18n/ui';
import type { EditorialFieldState, EditorialStatus, SourceProvenance } from '../content/v2/schema';
import { CollapsibleSection } from './Primitives';

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
      <div className="space-y-4">
        {prov.length > 0 && (
          <dl className="space-y-2">
            {prov.map((row, i) => (
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
        )}
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
    </CollapsibleSection>
  );
}
