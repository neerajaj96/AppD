import { useParams, Link } from 'react-router';
import { useMemo } from 'react';
import { Map as MapIcon, BookOpen as TextIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary, textLanguages } from '../content/v2/catalog';
import { useCatalog } from '../content/v2/hooks';
import type { GlobalManifest, TextSummary } from '../content/v2/chunks';
import type { AsyncState } from '../content/v2/hooks';
import { Breadcrumb, LoadingState, PageHeader, RowChevron, accentTint } from './Primitives';
import { getThreadProgress } from '../utils/threadProgress';

// Tradition collection page: identity, collection stats, guided thread
// doorway and the text collection. Manifest-only — no chunks load here.
export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const catalog = useCatalog();

  const tradition = catalog.status === 'ok'
    ? catalog.data.traditions.find((trad) => trad.id === systemId)
    : undefined;
  const texts = useMemoTexts(catalog, systemId);

  if (catalog.status === 'loading') {
    return <LoadingState text={t(language, 'loading')} />;
  }

  if (catalog.status !== 'ok' || !tradition) {
    return (
      <div className="text-center py-12">
        {catalog.status === 'offline' ? t(language, 'offlineNotice') : t(language, 'systemNotFound')}
      </div>
    );
  }

  const accent = getSystemAccent(tradition.id);
  const display = getTraditionDisplay(tradition, language);
  const totalSteps = tradition.threadSteps;
  const unitTotal = texts.reduce((n, tx) => n + tx.unitCount, 0);
  const conceptTotal = texts.reduce((n, tx) => n + tx.conceptCount, 0);
  const hasMl = texts.some((tx) => textLanguages(tx).ml > 0);

  // Thread doorway: param-less entry lets ThreadView restore the furthest
  // visited step (UX-008), so this one row serves both Start and Resume.
  const storedStep = getThreadProgress(tradition.id);
  const started = storedStep !== null && storedStep > 0 && storedStep < totalSteps;
  const percent = started ? Math.round(((storedStep + 1) / totalSteps) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto pb-16">
      <Breadcrumb trail={[{ to: '/', label: t(language, 'homeNav') }]} current={display.title} />
      <PageHeader
        eyebrow={`${tradition.id.toUpperCase()} · ${t(language, 'systemsLabel').toUpperCase()}`}
        accentPrimary={accent.primary}
        title={display.title}
        lede={display.subtitle}
      />

      {/* Collection statistics: what this tradition holds. */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-tamas-deep bg-tamas-deep sm:grid-cols-4">
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'textsLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{texts.length}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'versesLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{unitTotal}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'conceptsLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{conceptTotal}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'languagesLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">
            {hasMl ? 'EN · ML' : 'EN'}
          </dd>
        </div>
      </dl>

      {/* Guided thread doorway with live progress. */}
      {totalSteps > 0 && (
        <section aria-label={t(language, 'coreThread')} className="overflow-hidden rounded-2xl border border-tamas-deep bg-avyakta-2 shadow-xs">
          <Link
            to={`/system/${tradition.id}/thread${started ? `?step=${storedStep + 1}` : ''}`}
            className="group flex w-full items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: accentTint(accent.primary), color: accent.primary }}
            >
              <MapIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg font-bold text-sattva">
                {t(language, 'coreThread')}
                <span className="ml-2 font-sans text-sm font-medium text-sattva-dim">
                  {t(language, 'stepsCount', { count: totalSteps })}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-sm text-sattva-dim">
                {started
                  ? `${t(language, 'resumeThread')} · ${t(language, 'stepOf', { current: storedStep + 1, total: totalSteps })}`
                  : t(language, 'threadFunction')}
              </span>
              {started && (
                <span aria-hidden="true" className="mt-2 block h-1 overflow-hidden rounded-full bg-avyakta-3">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: accent.primary }}
                  />
                </span>
              )}
            </span>
            <RowChevron />
          </Link>
        </section>
      )}

      {/* Text collection. */}
      <section aria-label={t(language, 'textsLabel')} className="space-y-3">
        {texts.map((text) => {
          const langs = textLanguages(text);
          const langBadge = langs.ml > 0 ? 'EN · ML' : 'EN';
          return (
            <Link
              key={text.textId}
              to={`/system/${tradition.id}/text/${text.textId}`}
              className="group flex items-center gap-4 rounded-2xl border border-tamas-deep bg-avyakta-2 p-5 shadow-xs hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: accentTint(accent.primary), color: accent.primary }}
              >
                <TextIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-lg font-bold text-sattva">
                  {text.transliteratedTitle}
                </span>
                <span className="mt-0.5 block truncate text-sm text-sattva-dim">
                  {[text.author, text.unitCount > 0
                    ? `${text.unitCount} ${getVerseTermForSummary(text, text.unitCount).toLowerCase()}`
                    : '',
                  text.conceptCount > 0
                    ? `${text.conceptCount} ${t(language, 'conceptsLabel').toLowerCase()}`
                    : '',
                  ].filter(Boolean).join(' · ')}
                </span>
                <span className="mt-1.5 block text-xs font-semibold uppercase tracking-wider text-tamas">
                  {langBadge}
                </span>
              </span>
              <RowChevron />
            </Link>
          );
        })}
      </section>
    </div>
  );
}

function useMemoTexts(catalog: AsyncState<GlobalManifest>, systemId: string | undefined): TextSummary[] {
  return useMemo(() => {
    if (catalog.status !== 'ok' || !systemId) return [];
    return catalog.data.texts.filter((tx) => tx.traditionId === systemId);
  }, [catalog, systemId]);
}
