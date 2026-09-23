import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { X as RemoveIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, traditionHref } from '../content/v2/catalog';
import type { TraditionSummary } from '../content/v2/chunks';
import { useCatalog } from '../content/v2/hooks';
import { getRecentVisits, resolveVerseRefs, type ResolvedVerseRef } from '../utils/readingHistory';
import { getBookmarks, removeBookmark } from '../utils/bookmarks';
import { getThreadProgress } from '../utils/threadProgress';
import { ActionLink, Card, CardBody, CountBadge, Eyebrow, MetaRow, SectionHeader, SectionTitle, chipBase } from './Primitives';
import { TraditionThreadRow } from './ThreadsIndex';

function scrollToTraditions() {
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document
    .getElementById('traditions')
    ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

function TraditionCard({ tradition, unitTotal }: { tradition: TraditionSummary; unitTotal: number }) {
  const { language } = useLanguage();
  const accent = getSystemAccent(tradition.id);
  const display = getTraditionDisplay(tradition, language);
  const totalSteps = tradition.threadSteps;
  const storedRaw = getThreadProgress(tradition.id);
  const storedStep = storedRaw !== null && storedRaw < totalSteps ? storedRaw : -1;
  const showProgress = totalSteps > 0 && storedStep > 0;
  const percent = showProgress ? Math.round(((storedStep + 1) / totalSteps) * 100) : 0;
  return (
    <Link
      key={tradition.id}
      to={traditionHref(tradition)}
      className="group flex min-w-0 flex-col rounded-2xl border border-tamas-deep bg-avyakta-2 p-6 shadow-xs hover:bg-avyakta-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sattva/70 focus-visible:ring-offset-2 focus-visible:ring-offset-avyakta transition-colors motion-reduce:transition-none relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-(--accent) opacity-90 group-hover:opacity-100 transition-opacity motion-reduce:transition-none forced-colors:bg-[Highlight]"
        style={{ '--accent': accent.primary } as React.CSSProperties}
      />
      <h3 className="font-serif text-2xl font-bold text-sattva">{display.title}</h3>
      {language === 'ml' && tradition.transliteratedTitle && (
        <p className="mt-0.5 truncate text-sm text-tamas">{tradition.transliteratedTitle}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-sattva-dim line-clamp-2">{display.subtitle}</p>
      <dl className="mt-4 space-y-1 border-t border-tamas-deep pt-3 text-sm">
        <MetaRow
          label={t(language, 'textsLabel')}
          value={`${t(language, 'textsCount', { count: tradition.textIds.length })} · ${t(language, 'unitsCount', { count: unitTotal })}`}
        />
        {totalSteps > 0 && (
          <MetaRow label={t(language, 'threadsNav')} value={t(language, 'stepsCount', { count: totalSteps })} />
        )}
      </dl>
      {showProgress && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate font-medium text-sattva-dim">
              {t(language, 'resumeThread')} · {t(language, 'stepOf', { current: storedStep + 1, total: totalSteps })}
            </span>
            <span className="shrink-0 tabular-nums text-tamas">{percent}%</span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-1 overflow-hidden rounded-full bg-avyakta-3">
            <div
              className="h-full rounded-full forced-colors:bg-[Highlight]"
              style={{ width: `${percent}%`, backgroundColor: accent.primary }}
            />
          </div>
        </div>
      )}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sattva-dim group-hover:text-sattva transition-colors motion-reduce:transition-none">
        {t(language, 'openSystemLabel')}
      </span>
    </Link>
  );
}

const ORG_STEPS = [
  { title: 'orgStepTradition', body: 'orgStepTraditionDesc' },
  { title: 'orgStepText', body: 'orgStepTextDesc' },
  { title: 'orgStepUnit', body: 'orgStepUnitDesc' },
  { title: 'orgStepConcept', body: 'orgStepConceptDesc' },
  { title: 'orgStepRelated', body: 'orgStepRelatedDesc' },
] as const;

export default function Home() {
  const { language } = useLanguage();
  const catalog = useCatalog();
  const [searchParams] = useSearchParams();
  // One-tap return paths: curated shelf first, automatic trail after.
  // Stored refs resolve through text chunks (async); unresolvable entries
  // drop out exactly as before.
  const [recent, setRecent] = useState<ResolvedVerseRef[]>([]);
  const [shelf, setShelf] = useState<ResolvedVerseRef[]>([]);
  useEffect(() => {
    let live = true;
    resolveVerseRefs(getRecentVisits()).then((rows) => {
      if (live) setRecent(rows);
    });
    resolveVerseRefs(getBookmarks()).then((rows) => {
      if (live) setShelf(rows);
    });
    return () => {
      live = false;
    };
  }, []);
  const handleRemove = (systemId: string, textId: string, verseId: string) => {
    removeBookmark(systemId, textId, verseId);
    resolveVerseRefs(getBookmarks()).then(setShelf);
  };

  const traditions = catalog.status === 'ok' ? catalog.data.traditions : [];
  const texts = catalog.status === 'ok' ? catalog.data.texts : [];
  const traditionById = useMemo(() => new Map(traditions.map((trad) => [trad.id, trad])), [traditions]);
  const unitsByTradition = useMemo(() => {
    const map = new Map<string, number>();
    for (const tx of texts) map.set(tx.traditionId, (map.get(tx.traditionId) || 0) + tx.unitCount);
    return map;
  }, [texts]);

  // Header "Traditions" navigation lands here: scroll past the hero to
  // the collection grid once the catalog has rendered it.
  useEffect(() => {
    if (searchParams.get('focus') === 'traditions' && catalog.status === 'ok') {
      const timer = window.setTimeout(scrollToTraditions, 60);
      return () => window.clearTimeout(timer);
    }
  }, [searchParams, catalog.status]);

  // Continuity hero: the most-recent verse wins, paired with its system's
  // thread resume when one exists. Thread-only readers fall back to their
  // furthest thread by completion fraction; otherwise the latest bookmark.
  const continueTarget = useMemo(() => {
    const threadResumeFor = (sid: string) => {
      const sys = traditionById.get(sid);
      const total = sys?.threadSteps ?? 0;
      if (!sys || total === 0) return null;
      const stored = getThreadProgress(sid);
      if (stored === null || stored <= 0 || stored >= total) return null;
      return { total, stored };
    };
    const contextOf = (sid: string) => {
      const sys = traditionById.get(sid);
      return sys ? getTraditionDisplay(sys, language).title : sid;
    };
    if (recent.length > 0) {
      const r = recent[0];
      return {
        kind: 'verse' as const,
        systemId: r.systemId,
        title: `${r.term} ${r.number} · ${r.textTitle}`,
        context: contextOf(r.systemId),
        verseHref: `/system/${r.systemId}/text/${r.textId}/verse/${r.verseId}`,
        thread: threadResumeFor(r.systemId),
      };
    }
    return null;
  }, [language, recent, traditionById]);
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero: what Darśana is, where to begin. */}
      <div className="pt-4 text-center sm:pt-8">
        <p className="t-eyebrow text-sattva-dim">{t(language, 'heroEyebrow')}</p>
        <h1 className="t-display1 text-sattva mt-3">{language === 'ml' ? 'ദർശന' : 'Darśana'}</h1>
        <p className="t-subtitle mx-auto mt-3 max-w-2xl text-lg">
          {t(language, 'appTagline')}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <ActionLink to="/?focus=traditions" variant="primary" label={t(language, 'beginExploring')}>
            {t(language, 'beginExploring')}
          </ActionLink>
          <ActionLink to="/threads" variant="ghost" label={t(language, 'guidedLearning')}>
            {t(language, 'guidedLearning')}
          </ActionLink>
        </div>
      </div>

      {continueTarget && (
        <section aria-label={t(language, 'continueReading')}>
          <Card>
            <CardBody padding="plain">
              <Eyebrow accentPrimary={getSystemAccent(continueTarget.systemId).primary} className="mb-3">
                {t(language, 'continueReading')}
              </Eyebrow>
              <h2 className="t-display2 text-sattva">{continueTarget.title}</h2>
              <p className="t-subtitle text-sattva-dim">{continueTarget.context}</p>
              <div className="flex flex-wrap gap-2 pt-3">
                <ActionLink to={continueTarget.verseHref} variant="primary" label={t(language, 'openVerseLabel')}>
                  {t(language, 'openVerseLabel')}
                </ActionLink>
                {continueTarget.thread && (
                  <ActionLink
                    to={`/system/${continueTarget.systemId}/thread?step=${continueTarget.thread.stored + 1}`}
                    variant="ghost"
                    label={`${t(language, 'resumeThread')} · ${t(language, 'stepOf', { current: continueTarget.thread.stored + 1, total: continueTarget.thread.total })}`}
                  >
                    {t(language, 'resumeThread')} · {t(language, 'stepOf', { current: continueTarget.thread.stored + 1, total: continueTarget.thread.total })}
                  </ActionLink>
                )}
              </div>
            </CardBody>
          </Card>
        </section>
      )}

      {/* Explore traditions: the collection grid. */}
      <section aria-labelledby="traditions-heading" id="traditions" className="scroll-mt-32 space-y-4">
        <SectionHeader
          title={<span id="traditions-heading">{t(language, 'exploreTraditions')}</span>}
        />
        <p className="-mt-2 text-sm text-sattva-dim">{t(language, 'traditionsLede')}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {traditions.map((system) => (
            <TraditionCard
              key={system.id}
              tradition={system}
              unitTotal={unitsByTradition.get(system.id) || 0}
            />
          ))}
        </div>
      </section>

      {/* Guided threads: first-class learning paths. */}
      <section aria-labelledby="threads-heading" className="space-y-4">
        <SectionHeader
          title={<span id="threads-heading">{t(language, 'threadsTitle')}</span>}
          action={
            <Link
              to="/threads"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
            >
              {t(language, 'viewThread')} →
            </Link>
          }
        />
        <p className="-mt-2 text-sm text-sattva-dim">{t(language, 'threadsLede')}</p>
        <div className="space-y-3">
          {traditions
            .filter((trad) => trad.threadSteps > 0)
            .map((trad) => (
              <TraditionThreadRow key={trad.id} tradition={trad} />
            ))}
        </div>
      </section>

      {shelf.length > 0 && (
        <section aria-label={t(language, 'savedLabel')} className="space-y-2">
          <SectionTitle count={shelf.length}>
            {t(language, 'savedLabel')}
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {shelf.map((r) => (
              <span
                key={`saved:${r.systemId}:${r.textId}:${r.verseId}`}
                className="inline-flex items-center gap-1 max-w-full rounded-full bg-avyakta-2 border border-tamas-deep p-1 ps-3"
              >
                <Link
                  to={`/system/${r.systemId}/text/${r.textId}/verse/${r.verseId}`}
                  className="min-w-0 truncate text-sm text-sattva hover:text-rajas transition-colors motion-reduce:transition-none"
                >
                  {r.term} {r.number} · {r.textTitle}
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(r.systemId, r.textId, r.verseId)}
                  aria-label={`${t(language, 'removeLabel')} ${r.term} ${r.number}`}
                  className="flex items-center justify-center shrink-0 min-h-9 min-w-9 rounded-full text-sattva-dim hover:text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                >
                  <RemoveIcon aria-hidden="true" className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section aria-label={t(language, 'recentlyViewed')} className="space-y-2">
          <SectionTitle count={recent.length}>
            {t(language, 'recentlyViewed')}
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <Link
                key={`${r.systemId}:${r.textId}:${r.verseId}`}
                to={`/system/${r.systemId}/text/${r.textId}/verse/${r.verseId}`}
                className={chipBase}
              >
                {r.term} {r.number} · {r.textTitle}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Library orientation: how the collection is organised. */}
      <section aria-labelledby="orientation-heading" className="space-y-4">
        <SectionHeader title={<span id="orientation-heading">{t(language, 'orgTitle')}</span>} />
        <p className="-mt-2 text-sm text-sattva-dim">{t(language, 'orgLede')}</p>
        <ol className="space-y-3">
          {ORG_STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-2xl border border-tamas-deep bg-avyakta-2 p-4"
            >
              <CountBadge variant="tile">{i + 1}</CountBadge>
              <span className="min-w-0">
                <span className="block font-serif font-bold text-sattva">{t(language, step.title)}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-sattva-dim">
                  {t(language, step.body)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
