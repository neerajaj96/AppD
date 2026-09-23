import { Link } from 'react-router';
import { Map as ThreadIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay } from '../content/v2/catalog';
import type { TraditionSummary } from '../content/v2/chunks';
import { useCatalog } from '../content/v2/hooks';
import { getThreadProgress } from '../utils/threadProgress';
import { Breadcrumb, LoadingState, PageHeader, RowChevron, accentTint } from './Primitives';

/** Compact thread row for one tradition: steps, progress, start/resume. */
export function TraditionThreadRow({ tradition }: { tradition: TraditionSummary }) {
  const { language } = useLanguage();
  const accent = getSystemAccent(tradition.id);
  const display = getTraditionDisplay(tradition, language);
  const total = tradition.threadSteps;
  const stored = getThreadProgress(tradition.id) ?? -1;
  const started = stored > 0 && stored < total;
  const percent = started ? Math.round(((stored + 1) / total) * 100) : 0;
  return (
    <Link
      to={`/system/${tradition.id}/thread${started ? `?step=${stored + 1}` : ''}`}
      className="group flex items-center gap-4 rounded-2xl border border-tamas-deep bg-avyakta-2 p-5 shadow-xs hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: accentTint(accent.primary), color: accent.primary }}
      >
        <ThreadIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-serif text-lg font-bold text-sattva">
          {display.title}
        </span>
        <span className="mt-0.5 block truncate text-sm text-sattva-dim">
          {started
            ? `${t(language, 'resumeThread')} · ${t(language, 'stepOf', { current: stored + 1, total })}`
            : `${t(language, 'stepsCount', { count: total })} · ${display.subtitle}`}
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
  );
}

/**
 * Guided threads index — every tradition's learning path in one place,
 * with resume progress where the reader has begun. Catalog-only: no
 * content chunks load until a thread opens.
 */
export default function ThreadsIndex() {
  const { language } = useLanguage();
  const catalog = useCatalog();

  if (catalog.status === 'loading') {
    return <LoadingState text={t(language, 'loading')} />;
  }
  if (catalog.status !== 'ok') {
    return (
      <div className="text-center py-12">
        {catalog.status === 'offline' ? t(language, 'offlineNotice') : t(language, 'threadNotFound')}
      </div>
    );
  }

  const threads = catalog.data.traditions.filter((trad) => trad.threadSteps > 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto pb-16">
      <Breadcrumb trail={[]} current={t(language, 'threadsTitle')} />
      <PageHeader
        eyebrow={t(language, 'threadsNav')}
        title={t(language, 'threadsTitle')}
        lede={t(language, 'threadsLede')}
      />

      <div className="space-y-3">
        {threads.map((trad) => (
          <TraditionThreadRow key={trad.id} tradition={trad} />
        ))}
      </div>
    </div>
  );
}
