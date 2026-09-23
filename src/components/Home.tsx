import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { X as RemoveIcon, Map as ThreadIcon, Quote as VerseIcon, Sparkles as ConceptIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, traditionHref } from '../content/v2/catalog';
import { useCatalog } from '../content/v2/hooks';
import { getRecentVisits, resolveVerseRefs, type ResolvedVerseRef } from '../utils/readingHistory';
import { getBookmarks, removeBookmark } from '../utils/bookmarks';
import { getThreadProgress } from '../utils/threadProgress';
import { ActionLink, Card, CardBody, Eyebrow, SectionTitle, chipBase } from './Primitives';

const ONBOARD_KEY = 'darsana_onboarding_seen';

function isOnboardingSeen(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(ONBOARD_KEY) === '1';
  } catch {
    return true;
  }
}

export default function Home() {
  const { language } = useLanguage();
  const catalog = useCatalog();
  // First-visit orientation only; dismissed readers never see it again.
  const [showOnboard, setShowOnboard] = useState(() => !isOnboardingSeen());
  const dismissOnboard = () => {
    try {
      window.localStorage.setItem(ONBOARD_KEY, '1');
    } catch {
      // Session-only dismissal then; the card simply returns next visit.
    }
    setShowOnboard(false);
  };
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
  const traditionById = useMemo(() => new Map(traditions.map((t) => [t.id, t])), [traditions]);

  // Continuity hero: the most-recent verse wins, paired with its system's
  // thread resume when one exists. Thread-only readers fall back to their
  // furthest thread by completion fraction; otherwise the latest bookmark.
  // Additive only — the shelf and trail sections below stay untouched.
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
    let best: { sid: string; total: number; stored: number; fraction: number } | null = null;
    for (const sys of traditions) {
      const resume = threadResumeFor(sys.id as string);
      if (!resume) continue;
      const fraction = (resume.stored + 1) / resume.total;
      if (!best || fraction > best.fraction) {
        best = { sid: sys.id as string, ...resume, fraction };
      }
    }
    if (best) {
      return {
        kind: 'thread' as const,
        systemId: best.sid,
        title: t(language, 'resumeThread'),
        context: `${contextOf(best.sid)} · ${t(language, 'stepOf', { current: best.stored + 1, total: best.total })}`,
        threadHref: `/system/${best.sid}/thread?step=${best.stored + 1}`,
      };
    }
    if (shelf.length > 0) {
      const r = shelf[shelf.length - 1];
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
  }, [language, recent, shelf, traditions, traditionById]);
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-serif font-bold text-sattva mb-4">{language === 'ml' ? 'ദർശന' : 'Darśana'}</h1>
        <p className="text-lg text-sattva-dim max-w-2xl mx-auto">
          {t(language, 'appTagline')}
        </p>
        <Link
          to="/intro"
          className="inline-flex items-center mt-6 px-5 py-2.5 rounded-xl bg-avyakta-2 border border-tamas-deep text-sm font-semibold text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
        >
          {t(language, 'introTab')} →
        </Link>
      </div>

      {continueTarget && (
        <section aria-label={t(language, 'continueReading')} className="animate-fade-in">
          <Card>
            <CardBody>
              <Eyebrow accentPrimary={getSystemAccent(continueTarget.systemId).primary} className="mb-3">
                {t(language, 'continueReading')}
              </Eyebrow>
              <h2 className="t-display2 text-sattva">{continueTarget.title}</h2>
              <p className="t-subtitle text-sattva-dim">{continueTarget.context}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {continueTarget.kind === 'verse' ? (
                  <>
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
                  </>
                ) : (
                  <ActionLink to={continueTarget.threadHref} variant="primary" label={t(language, 'resumeThread')}>
                    {t(language, 'resumeThread')} →
                  </ActionLink>
                )}
              </div>
            </CardBody>
          </Card>
        </section>
      )}

      {showOnboard && (
        <section
          aria-label={t(language, 'onboardTitle')}
          className="bg-avyakta-2 rounded-xl border border-tamas-deep shadow-xs p-6"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-xl font-serif font-bold text-sattva">
              {t(language, 'onboardTitle')}
            </h2>
            <button
              type="button"
              onClick={dismissOnboard}
              aria-label={t(language, 'dismissLabel')}
              className="flex items-center justify-center shrink-0 min-h-9 min-w-9 rounded-lg text-sattva-dim hover:text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
            >
              <RemoveIcon aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <ThreadIcon aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0 text-rajas" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-sattva">
                  {t(language, 'coreThread')}
                </span>
                <span className="block text-sm text-sattva-dim">
                  {t(language, 'threadFunction')}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <VerseIcon aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0 text-rajas" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-sattva">
                  {t(language, 'textsLabel')}
                </span>
                <span className="block text-sm text-sattva-dim">
                  {t(language, 'textsFunction')}
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ConceptIcon aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0 text-rajas" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-sattva">
                  {t(language, 'conceptsLabel')}
                </span>
                <span className="block text-sm text-sattva-dim">
                  {t(language, 'conceptsFunction')}
                </span>
              </span>
            </li>
          </ul>
          <Link
            to="/intro"
            className="inline-flex items-center mt-4 text-sm font-semibold text-rajas-dim hover:underline"
          >
            {t(language, 'introTab')} →
          </Link>
        </section>
      )}

      {shelf.length > 0 && (
        <section aria-label={t(language, 'savedLabel')}>
          <SectionTitle count={shelf.length} className="mb-2">
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
        <section aria-label={t(language, 'recentlyViewed')}>
          <SectionTitle count={recent.length} className="mb-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {traditions.map((system) => {
          const accent = getSystemAccent(system.id);
          const display = getTraditionDisplay(system, language);
          // Single-text systems skip the interstitial: the System page would
          // list exactly one row pointing where this card already can, so link
          // straight to the text (Home → Text → Verse = 2 clicks, not 3).
          // The overview stays reachable via every breadcrumb above it.
          const target = traditionHref(system);
          const texts = catalog.status === 'ok'
            ? catalog.data.texts.filter((tx) => tx.traditionId === system.id)
            : [];
          const conceptTotal = texts.reduce((acc, tx) => acc + tx.conceptCount, 0);
          // Per-card thread footprint, shown only past Step 1 to mirror the
          // resume convention elsewhere. Display only, never a nested link —
          // the card itself already navigates to the resume doorway.
          const totalSteps = system.threadSteps;
          const storedRaw = getThreadProgress(system.id);
          const storedStep = storedRaw !== null && storedRaw < totalSteps ? storedRaw : -1;
          const showProgress = totalSteps > 0 && storedStep > 0;
          const percent = showProgress ? Math.round(((storedStep + 1) / totalSteps) * 100) : 0;
          return (
            <Link
              key={system.id}
              to={target}
              className={`block group bg-avyakta-2 rounded-xl shadow-xs border border-tamas-deep hover:shadow-md transition-all motion-reduce:transition-none p-6 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sattva/70 focus-visible:ring-offset-2 focus-visible:ring-offset-avyakta`}
            >
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-1.5 bg-(--accent) opacity-90 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100 transition-opacity motion-reduce:transition-none forced-colors:bg-[Highlight]"
                style={{ '--accent': accent.primary } as React.CSSProperties}
              />
              <h2
                className="text-2xl font-serif font-bold text-sattva mb-2"
              >
                {display.title}
              </h2>
              <p className="text-sattva-dim mb-4 h-12 overflow-hidden">
                {display.subtitle}
              </p>
              <div className="text-sm font-medium text-sattva-dim uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{t(language, 'textsLabel')}</span>
                <span className="text-xs font-normal text-tamas lowercase">
                  {conceptTotal} {t(language, 'conceptsCount')}
                </span>
              </div>
              <ul className="space-y-1">
                {texts.map((text) => (
                  <li key={text.textId} className="text-sattva flex items-center justify-between text-sm">
                    <div className="flex items-center min-w-0">
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full me-2.5 shrink-0 bg-(--accent) ring-1 ring-inset ring-white/10 forced-colors:bg-[CanvasText]"
                        style={{ '--accent': accent.primary } as React.CSSProperties}
                      ></span>
                      {text.transliteratedTitle}
                    </div>
                  </li>
                ))}
              </ul>
              {showProgress && (
                <div className="mt-4 pt-3 border-t border-tamas-deep">
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
