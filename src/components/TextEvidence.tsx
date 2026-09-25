import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { t, type UIKey } from '../i18n/ui';
import { useTextSources } from '../content/v2/hooks';
import { buildTextEvidenceSummary } from '../content/v2/evidenceSummary';
import { EVIDENCE_RELATIONS, type CanonicalUnit } from '../content/v2/schema';
import type { UnresolvedReason } from '../content/v2/report';
import { EvidenceRelationBadge, SourceCard } from './Provenance';
import { CollapsibleSection, RowChevron, SectionHeader, SectionTitle } from './Primitives';

/**
 * Text-level scholarly evidence overview — a presentation layer over the
 * already-loaded V2 text data. Counts come from the shared `auditText`
 * derivation, so this panel agrees with `buildEvidenceAudit()` by
 * construction. Neutral wording throughout: absence from the repository
 * never implies historical absence, and representation never implies
 * verification.
 */

const REASON_LABEL: Record<UnresolvedReason, UIKey> = {
  'no-source-record': 'reasonNoSourceRecord',
  'no-unit-association': 'reasonNoUnitAssociation',
  'notes-without-deterministic-mapping': 'reasonNotesWithoutMapping',
  unclassified: 'reasonUnclassified',
};

const REASON_ORDER: UnresolvedReason[] = [
  'no-source-record',
  'no-unit-association',
  'notes-without-deterministic-mapping',
  'unclassified',
];

export default function TextEvidenceSection({
  systemId,
  textId,
  units,
}: {
  systemId?: string;
  textId?: string;
  units: CanonicalUnit[];
}) {
  const { language } = useLanguage();
  const sourcesState = useTextSources(textId);
  // A missing or unreachable registry is honestly empty: units-derived
  // counts stay valid and unresolved reasons fall back to no-source-record.
  const sources = sourcesState.status === 'ok' ? sourcesState.data : [];
  const summary = buildTextEvidenceSummary(textId || '', systemId || '', units, sources);
  const { audit } = summary;
  const total = audit.unitCount;

  const readerHref = (unitId: string | undefined) =>
    systemId && textId && unitId ? `/system/${systemId}/text/${textId}/verse/${unitId}` : null;

  const segments: Array<{
    key: string;
    label: string;
    count: number;
    openLabel?: UIKey;
    unitId?: string;
    barClass: string;
  }> = [
    {
      key: 'evidence-linked',
      label: t(language, 'metricEvidenceLinked'),
      count: audit.evidenceLinkedUnits,
      openLabel: 'openFirstEvidenceUnit',
      unitId: summary.firstEvidenceLinkedUnitId,
      barClass: 'bg-sattva/80',
    },
    {
      key: 'locator-only',
      label: t(language, 'metricLocatorOnly'),
      count: audit.locatorOnlyUnits,
      openLabel: 'openFirstLocatorUnit',
      unitId: summary.firstLocatorOnlyUnitId,
      barClass: 'bg-sattva/40',
    },
    {
      key: 'source-only',
      label: t(language, 'evidenceSourceOnly'),
      count: summary.sourceOnlyUnits,
      unitId: summary.firstSourceOnlyUnitId,
      barClass: 'bg-sattva/25',
    },
    {
      key: 'unresolved',
      label: t(language, 'evidenceNotRepresented'),
      count: audit.unresolvedUnits,
      openLabel: 'openFirstUnresolvedUnit',
      unitId: summary.firstUnresolvedUnitId,
      barClass: 'bg-tamas',
    },
  ];

  const metrics: Array<{ label: string; value: number }> = [
    { label: t(language, 'metricUnits'), value: total },
    { label: t(language, 'metricSources'), value: audit.sourceRecordCount },
    { label: t(language, 'metricEvidenceLinked'), value: audit.evidenceLinkedUnits },
    { label: t(language, 'metricLocatorOnly'), value: audit.locatorOnlyUnits },
  ];

  const relations = EVIDENCE_RELATIONS.map((relation) => ({
    relation,
    count: audit.evidenceRelationCounts[relation] || 0,
  })).filter((r) => r.count > 0);

  const reasons = REASON_ORDER.map((reason) => ({
    reason,
    count: audit.unresolvedReasons[reason],
  })).filter((r) => r.count > 0);

  return (
    <section
      aria-labelledby="text-evidence-heading"
      className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden"
    >
      <div className="p-5 sm:p-6 space-y-6">
        <div>
          <SectionHeader title={<span id="text-evidence-heading">{t(language, 'evidenceOverviewTitle')}</span>} />
          <p className="t-body-sans text-sattva-dim mt-2">{t(language, 'evidenceOverviewLede')}</p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-tamas-deep bg-tamas-deep sm:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-avyakta-2 px-4 py-3">
              <dt className="t-eyebrow text-tamas">{m.label}</dt>
              <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div>
          <SectionTitle>{t(language, 'evidenceCoverageTitle')}</SectionTitle>
          <div aria-hidden="true" className="mt-3 flex h-2 overflow-hidden rounded-full bg-avyakta-4">
            {segments.map((s) =>
              s.count > 0 && total > 0 ? (
                <div
                  key={s.key}
                  className={s.barClass}
                  style={{ width: `${(s.count / total) * 100}%` }}
                />
              ) : null,
            )}
          </div>
          <ul className="mt-1 divide-y divide-tamas-deep">
            {segments.map((s) => {
              const href = s.openLabel && s.unitId ? readerHref(s.unitId) : null;
              const count = (
                <span className="shrink-0 tabular-nums text-sm text-sattva-dim">
                  {s.count}
                  <span className="sr-only"> {t(language, 'metricUnits')}</span>
                </span>
              );
              return (
                <li key={s.key}>
                  {href ? (
                    <Link
                      to={href}
                      aria-label={s.openLabel ? t(language, s.openLabel) : undefined}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-sattva">{s.label}</span>
                      {count}
                      <RowChevron />
                    </Link>
                  ) : (
                    <div className="flex min-h-11 items-center justify-between gap-3 px-2 py-2">
                      <span className="min-w-0 flex-1 truncate text-sm text-sattva-dim">{s.label}</span>
                      {count}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {relations.length > 0 && (
          <div>
            <SectionTitle>{t(language, 'evidenceRelationsTitle')}</SectionTitle>
            <ul className="mt-3 space-y-1">
              {relations.map((r) => (
                <li key={r.relation} className="flex items-center justify-between gap-3 px-2 py-1.5">
                  <EvidenceRelationBadge relation={r.relation} />
                  <span className="shrink-0 tabular-nums text-sm text-sattva-dim">
                    {r.count}
                    <span className="sr-only"> {t(language, 'metricUnits')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <SectionTitle count={sources.length}>{t(language, 'sourcesTitle')}</SectionTitle>
          {sources.length > 0 ? (
            <div className="mt-1">
              <p className="t-caption text-tamas px-2 py-1">
                {t(language, 'sourcesRoleCoverage', {
                  roled: summary.sourcesWithRoles,
                  total: sources.length,
                })}
              </p>
              <div className="divide-y divide-tamas-deep">
                {sources.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </div>
          ) : (
            <p className="t-body-sans text-sattva-dim mt-2 px-2">{t(language, 'noSourcesTitle')}</p>
          )}
        </div>

        {audit.unresolvedUnits > 0 && (
          <CollapsibleSection
            title={t(language, 'evidenceNotRepresented')}
            count={audit.unresolvedUnits}
            defaultOpen={false}
          >
            <div className="space-y-3">
              <p className="t-body-sans text-sattva-dim">{t(language, 'unresolvedBody')}</p>
              <dl className="space-y-1.5">
                {reasons.map((r) => (
                  <div key={r.reason} className="flex items-baseline justify-between gap-3 text-sm">
                    <dt className="shrink-0 text-tamas">{t(language, REASON_LABEL[r.reason])}</dt>
                    <dd className="tabular-nums text-sattva-dim">{r.count}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </section>
  );
}
