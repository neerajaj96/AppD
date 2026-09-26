import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, ArrowLeft, List as ListIcon, X as CloseIcon } from 'lucide-react';
import RichText from './RichText';
import ReadingControls from './ReadingControls';
import { BottomBar, Notice, Card, CardBody, ChipLink, PageShell, SectionTitle, Breadcrumb, CountBadge, SwipeHint, accentTint } from './Primitives';
import { useLanguage } from '../context/LanguageContext';
import { t, type UIKey } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary } from '../content/v2/catalog';
import { useCatalog, useTraditionThread, useV2Text } from '../content/v2/hooks';
import { v2ConceptToConcept, threadStepTitle, v2UnitToVerse } from '../content/v2/compat';
import { gitaMapForUnit } from '../content/v2/gitaPageMap';
import { passageSpanById } from '../content/v2/gitaSpans';
import { formatCitation, threadStepUrl } from '../content/v2/citation';
import { CitationButton } from './Provenance';
import type { ScholarlyThreadType, ThreadEvidenceKind, ThreadStepRole } from '../content/v2/schema';
import { getSystemAccent } from '../utils/theme';
import { getThreadProgress, setThreadProgress } from '../utils/threadProgress';
import { resolveThreadPosition } from '../utils/threadNav';
import { usePagerKeys } from '../utils/pagerKeys';
import { SWIPE_SURFACE_STYLE, useDismissSwipe, useSwipeNav } from '../utils/useSwipeNav';

// Thread reading via the V2 repository: the full tradition thread loads as
// one small chunk, while each step's concept card resolves from that step's
// own text chunks on demand. Visual behaviour is unchanged.
const THREAD_TYPE_LABEL: Record<ScholarlyThreadType, UIKey> = {
  concept: 'threadTypeConcept',
  argument: 'threadTypeArgument',
  'cross-verse': 'threadTypeCrossVerse',
  chapter: 'threadTypeChapter',
  doctrinal: 'threadTypeDoctrinal',
  recensional: 'threadTypeRecensional',
};

const STEP_ROLE_LABEL: Record<ThreadStepRole, UIKey> = {
  question: 'roleQuestion',
  premise: 'rolePremise',
  objection: 'roleObjection',
  response: 'roleResponse',
  distinction: 'roleDistinction',
  definition: 'roleDefinition',
  example: 'roleExample',
  inference: 'roleInference',
  consequence: 'roleConsequence',
  conclusion: 'roleConclusion',
  context: 'roleContext',
  unresolved: 'roleUnresolved',
};

const EVIDENCE_KIND_LABEL: Record<ThreadEvidenceKind, UIKey> = {
  direct: 'evDirect',
  'cross-reference': 'evCrossRef',
  structural: 'evStructural',
  synthesis: 'evSynthesis',
};

/**
 * Resolve which thread and step a URL means. `?thread=<id>&step=<k>`
 * addresses scholarly threads directly; a bare legacy `?step=<n>` walks
 * the concatenated threads so every existing deep link keeps working.
 * Implemented in `utils/threadNav` (framework-free, unit-tested).
 */
export default function ThreadView() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const catalog = useCatalog();
  const traditionThread = useTraditionThread(systemId);
  const [searchParams, setSearchParams] = useSearchParams();

  const threads = useMemo(
    () => (traditionThread.status === 'ok' ? traditionThread.data : []),
    [traditionThread],
  );
  const [threadIndex, setThreadIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const thread = threads.length > 0 ? threads[Math.min(threadIndex, threads.length - 1)] : undefined;
  const steps = useMemo(() => thread?.steps || [], [thread]);
  const totalSteps = steps.length;

  // URL is the source of truth: ?thread=<id>&step=<k> addresses a
  // scholarly thread directly, while a bare legacy ?step=<n> walks the
  // concatenated threads so every existing deep link keeps working.
  // With neither param, the first (orientation) thread restores saved
  // progress exactly as before.
  useEffect(() => {
    if (threads.length === 0) return;
    const hasThread = searchParams.get('thread') !== null;
    const hasStep = searchParams.get('step') !== null;
    if (!hasThread && !hasStep) {
      const stored = getThreadProgress(systemId || '');
      if (stored !== null) {
        setThreadIndex(0);
        setStepIndex(Math.min(stored, Math.max(threads[0].steps.length - 1, 0)));
      }
      return;
    }
    const pos = resolveThreadPosition(threads, searchParams.get('thread'), searchParams.get('step'));
    setThreadIndex((p) => (p === pos.threadIndex ? p : pos.threadIndex));
    setStepIndex((p) => (p === pos.stepIndex ? p : pos.stepIndex));
  }, [threads, searchParams, systemId]);

  const tradition = catalog.status === 'ok'
    ? catalog.data.traditions.find((t) => t.id === systemId)
    : undefined;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStepIndex((prev) => Math.min(prev, Math.max(totalSteps - 1, 0)));
  }, [systemId, totalSteps]);

  // Remember the furthest visited step per system (never throws). Taking
  // the max keeps back-navigation from erasing progress, so the contents
  // list can honestly distinguish reached steps from unreached ones.
  useEffect(() => {
    if (systemId) {
      const clamped = Math.min(stepIndex, Math.max(totalSteps - 1, 0));
      const prev = getThreadProgress(systemId) ?? 0;
      setThreadProgress(systemId, Math.max(prev, clamped));
    }
  }, [systemId, stepIndex, totalSteps]);

  // Drawer behaviour: initial focus on the close control, Tab containment
  // inside the dialogue, Escape dismisses, background scroll locks, and
  // focus returns to the trigger on close. Containment honours the APG
  // dialogue pattern so keyboard behaviour matches mouse behaviour.
  useEffect(() => {
    if (!drawerOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDrawerOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  // Phone-friendly paging lives before the missing-thread early return so
  // hook order stays stable when hopping between systems. Guards return
  // null when there is nothing to page through; the real step handlers
  // below reuse the same clamped index once the thread resolves.
  const clampedSafe = totalSteps > 0 ? Math.min(stepIndex, totalSteps - 1) : 0;
  // Orientation (first thread) keeps bare legacy ?step= URLs; scholarly
  // threads address ?thread=<id>&step=<k> so paging never loses context.
  const writeStepParams = (clamped: number) => {
    if (thread && threadIndex > 0) {
      setSearchParams({ thread: thread.id, step: String(clamped + 1) });
    } else {
      setSearchParams({ step: String(clamped + 1) });
    }
  };
  const goToStepSafe = (next: number) => {
    if (totalSteps === 0) return;
    const clamped = Math.min(Math.max(next, 0), totalSteps - 1);
    setStepIndex(clamped);
    writeStepParams(clamped);
  };
  const canPrevSafe = totalSteps > 0 && clampedSafe > 0;
  const canNextSafe = totalSteps > 0 && clampedSafe < totalSteps - 1;
  usePagerKeys(
    canNextSafe ? () => goToStepSafe(clampedSafe + 1) : null,
    canPrevSafe ? () => goToStepSafe(clampedSafe - 1) : null,
  );
  // Swipe left for the next step, right for the previous one. Vertical
  // reading scroll never pages; the BottomBar stays canonical.
  const swipeRef = useSwipeNav(
    canNextSafe ? () => goToStepSafe(clampedSafe + 1) : null,
    canPrevSafe ? () => goToStepSafe(clampedSafe - 1) : null,
  );
  // Phone-friendly dismiss: swipe down on the contents card to close.
  // List scrolling stays intact — only a clearly vertical downward fling
  // dismisses, and Escape plus the close button stay canonical.
  const dismissRef = useDismissSwipe(
    drawerOpen
      ? () => {
          setDrawerOpen(false);
          triggerRef.current?.focus();
        }
      : null,
    drawerOpen,
  );
  const setDialogRefs = (node: HTMLDivElement | null) => {
    dialogRef.current = node;
    (dismissRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  // The curated concept behind the current step resolves from that step's
  // own text chunks (one small fetch, cached for the session).
  const clampedIndex = Math.min(stepIndex, Math.max(totalSteps - 1, 0));
  const step = totalSteps > 0 ? steps[clampedIndex] : undefined;
  const targetTextId = step?.textId;
  const stepText = useV2Text(targetTextId);
  const stepConcept = useMemo(() => {
    if (!step?.conceptId || stepText.status !== 'ok') return null;
    const found = stepText.data.concepts.find((c) => c.id === step.conceptId);
    return found ? v2ConceptToConcept(found) : null;
  }, [step, stepText]);

  // Segment-grounded citation for the current step: smallest verified
  // locator (KSTS + folio + span notes) with a thread-step URL. Units
  // without verified data cite at unit level; nothing is invented.
  const stepCitation = useMemo(() => {
    if (!step || !systemId || !thread) return null;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const textTitle =
      stepText.status === 'ok' ? stepText.data.manifest.transliteratedTitle : '';
    let unitNumber = '';
    const locators: string[] = [];
    if (stepText.status === 'ok') {
      const first = (step.unitIds || [])
        .map((uid) => stepText.data.units.find((u) => u.id === uid))
        .find(Boolean);
      if (first) unitNumber = v2UnitToVerse(first).number;
      if (targetTextId === 'bhagavad-gita') {
        for (const uid of step.unitIds || []) {
          const row = gitaMapForUnit(uid);
          if (!row || row.ksts.length === 0) continue;
          const nums = row.ksts.map((k) => (k.includes('.') ? k.split('.')[1] : k));
          const ksts = nums.length > 1 ? `${nums[0]}-${nums[nums.length - 1]}` : nums[0];
          locators.push(`KSTS ${ksts}${row.folio !== undefined ? `, p. ${row.folio}` : ''}`);
        }
      }
    }
    const segments = (step.spanIds || []).flatMap((sid) => {
      const span = passageSpanById(sid);
      return span?.note ? [`${sid}: ${span.note}`] : [];
    });
    const idx = thread.steps.findIndex((s) => s.id === step.id);
    const safeIdx = thread.steps.length > 0 ? Math.min(Math.max(idx, 0), thread.steps.length - 1) : 0;
    return formatCitation({
      textTitle,
      unitNumber,
      locator: locators.join('; ') || undefined,
      segment: segments.join('; ') || undefined,
      url: threadStepUrl(origin, systemId, thread.id, safeIdx),
    });
  }, [step, systemId, thread, stepText, targetTextId]);

  if (catalog.status === 'loading' || traditionThread.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  if (catalog.status !== 'ok' || traditionThread.status !== 'ok' || !tradition || totalSteps === 0 || !step) {
    const offline = catalog.status === 'offline' || traditionThread.status === 'offline';
    return <div className="text-center py-12">{offline ? t(language, 'offlineNotice') : t(language, 'threadNotFound')}</div>;
  }

  const goToStep = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), totalSteps - 1);
    setStepIndex(clamped);
    // Push (not replace) so browser Back/Forward steps through visited
    // steps as readers expect. ScrollToTop + focus reset listen to search
    // changes, so history traversal re-orients exactly like button taps.
    writeStepParams(clamped);
  };
  const handleNext = () => goToStep(clampedIndex + 1);
  const handlePrev = () => goToStep(clampedIndex - 1);

  const content = step.localisations[language] ?? step.localisations.en;
  const isFallback = language === 'ml' && !step.localisations.ml;
  const summary = catalog.data.texts.find((t) => t.textId === targetTextId);
  const verseTermSingular = getVerseTermForSummary(summary, 1);
  const verseTermPlural = getVerseTermForSummary(summary, 2);

  const stepConceptTitle =
    stepConcept?.content[language]?.title || stepConcept?.content.en?.title;
  const stepConceptSummary =
    stepConcept?.content[language]?.summary || stepConcept?.content.en?.summary;
  const systemDisplay = getTraditionDisplay(tradition, language);
  const accent = getSystemAccent(systemId || '');
  const percent = Math.round(((clampedIndex + 1) / totalSteps) * 100);
  // Reached vs unreached styling follows the furthest stored step, so a
  // reader who steps back still sees honest progress in the contents list.
  const furthest = Math.max(clampedIndex, getThreadProgress(systemId || '') ?? clampedIndex);
  const knownConceptIds = new Set(
    stepText.status === 'ok' ? stepText.data.concepts.map((c) => c.id) : [],
  );

  const closeDrawer = () => {
    setDrawerOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            trail={[{ to: `/system/${systemId}`, label: systemDisplay.title }]}
            current={t(language, 'threadLabel')}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Step counter doubles as the contents trigger: one control
              instead of two keeps the narrow-viewport header honest. */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            title={t(language, 'threadContents')}
            className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg bg-avyakta-3 border border-tamas-deep text-sm text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
          >
            <ListIcon aria-hidden="true" className="w-4 h-4 shrink-0" />
            <span className="font-medium whitespace-nowrap">
              {t(language, 'stepOf', { current: clampedIndex + 1, total: totalSteps })}
            </span>
            <span aria-hidden="true" className="text-tamas tabular-nums">
              {percent}%
            </span>
            <span className="sr-only">{t(language, 'threadProgress', { percent })}</span>
          </button>
          <ReadingControls />
        </div>
      </div>

      {isFallback && (
        <Notice tone="amber">{t(language, 'mlFallbackThread')}</Notice>
      )}

      {(thread?.kind === 'scholarly' || threads.length > 1) && (
        <div className="rounded-2xl border border-tamas-deep bg-avyakta-2 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                thread?.kind === 'scholarly'
                  ? 'border border-sattva/30 text-sattva'
                  : 'bg-avyakta-3 text-sattva-dim'
              }`}
            >
              {thread?.kind === 'scholarly' ? t(language, 'threadScholarly') : t(language, 'threadOrientation')}
            </span>
            {thread?.kind === 'scholarly' && thread?.scholarlyType && (
              <span className="inline-flex items-center rounded-full bg-avyakta-3 px-2.5 py-0.5 text-xs font-semibold text-sattva-dim">
                {t(language, THREAD_TYPE_LABEL[thread.scholarlyType])}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate font-serif text-lg font-bold text-sattva">
              {thread?.localisations?.[language]?.title ||
                thread?.localisations?.en?.title ||
                thread?.title ||
                t(language, 'threadLabel')}
            </span>
          </div>
          {(thread?.localisations?.[language]?.summary || thread?.localisations?.en?.summary) && (
            <p className="t-body-sans text-sattva-dim mt-1.5">
              {thread?.localisations?.[language]?.summary || thread?.localisations?.en?.summary}
            </p>
          )}
          {threads.length > 1 && (
            <nav aria-label={t(language, 'threadsTitle')} className="mt-3 flex flex-wrap gap-2">
              {threads.map((th, ti) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    setThreadIndex(ti);
                    setStepIndex(0);
                    if (ti > 0) setSearchParams({ thread: th.id, step: '1' });
                    else setSearchParams({ step: '1' });
                  }}
                  aria-current={ti === threadIndex ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none ${
                    ti === threadIndex
                      ? 'bg-avyakta-4 text-sattva shadow-xs'
                      : 'bg-avyakta-3 text-sattva-dim hover:text-sattva'
                  }`}
                >
                  {th.localisations?.[language]?.title ||
                    th.localisations?.en?.title ||
                    th.title ||
                    t(language, 'threadLabel')}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}

      <div ref={swipeRef} style={SWIPE_SURFACE_STYLE}>
      <Card>
        {/* Progress bar doubles as the accessible progress indicator. */}
        <div
          role="progressbar"
          aria-label={t(language, 'threadContents')}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={clampedIndex + 1}
          aria-valuetext={t(language, 'threadProgress', { percent })}
          className="h-1.5 w-full bg-avyakta-3"
        >
          <div
            aria-hidden="true"
            className="h-full bg-rajas transition-all duration-300 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>

        <CardBody>
          {content?.title && (
            <h2 className="t-display2 text-sattva">
              {content.title}
            </h2>
          )}

          {content?.narrative && (
            <div className="t-body-serif text-sattva">
              <RichText
                text={content.narrative}
                systemId={systemId}
                textId={targetTextId}
                knownConcepts={knownConceptIds}
              />
            </div>
          )}

          {(step.role !== undefined ||
            content?.claim !== undefined ||
            content?.transition !== undefined ||
            step.evidenceKind !== undefined ||
            (step.conceptIds || []).length > 0) && (
            <div className="rounded-xl border border-tamas-deep bg-avyakta-3/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                {step.role !== undefined && (
                  <span className="inline-flex items-center rounded-full border border-tamas-deep bg-avyakta-3 px-2 py-0.5 text-xs font-semibold text-sattva-dim">
                    {t(language, STEP_ROLE_LABEL[step.role])}
                  </span>
                )}
                {step.evidenceKind !== undefined && (
                  <span className="text-xs text-tamas">
                    {t(language, EVIDENCE_KIND_LABEL[step.evidenceKind])}
                  </span>
                )}
                {step.claimStatus !== undefined && (
                  <span className="text-xs text-tamas">
                    {step.claimStatus === 'source-backed'
                      ? t(language, 'claimSourceBacked')
                      : t(language, 'claimEditorial')}
                  </span>
                )}
              </div>
              {content?.claim && (
                <p className="mt-2 text-sm text-sattva">
                  <span className="font-semibold">{t(language, 'claimLabel')}: </span>
                  {content.claim}
                </p>
              )}
              {content?.transition && (
                <p className="mt-1.5 text-sm text-sattva-dim">
                  <span className="font-semibold">{t(language, 'transitionLabel')}: </span>
                  {content.transition}
                </p>
              )}
              {(step.conceptIds || []).length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {(step.conceptIds || []).map((cid) => {
                    const found =
                      stepText.status === 'ok'
                        ? stepText.data.concepts.find((c) => c.id === cid)
                        : undefined;
                    const label =
                      found?.localisations[language]?.title ||
                      found?.localisations.en?.title ||
                      cid;
                    return (
                      <Link
                        key={cid}
                        to={`/system/${systemId}/text/${targetTextId}/concept/${cid}`}
                        className="inline-flex min-h-9 items-center rounded-full bg-avyakta-3 px-3 py-1 text-xs font-medium text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
              {step.unitIds && step.unitIds.length > 0 && targetTextId === 'bhagavad-gita' && (
                <p className="mt-2 text-xs tabular-nums text-tamas">
                  {step.unitIds
                    .map((uid) => {
                      const row = gitaMapForUnit(uid);
                      if (!row || row.ksts.length === 0) return null;
                      const nums = row.ksts.map((k) => (k.includes('.') ? k.split('.')[1] : k));
                      const ksts = nums.length > 1 ? `${nums[0]}-${nums[nums.length - 1]}` : nums[0];
                      return `${uid} · KSTS ${ksts}${row.folio !== undefined ? ` · p. ${row.folio}` : ''}`;
                    })
                    .filter(Boolean)
                    .join('   ')}
                </p>
              )}
              {(step.spanIds || []).length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-tamas">
                    {t(language, 'commentarySegment')}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {(step.spanIds || []).map((sid) => {
                      const span = passageSpanById(sid);
                      if (!span) return null;
                      return (
                        <li key={sid} className="text-xs text-sattva-dim break-words">
                          {span.note || sid}
                          {span.folio !== undefined && (
                            <span className="tabular-nums"> · p. {span.folio}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-1 text-xs text-tamas">{t(language, 'transcriptionAbsent')}</p>
                </div>
              )}
              {stepCitation && (
                <div className="mt-2.5">
                  <CitationButton citation={stepCitation} />
                </div>
              )}
            </div>
          )}

          {stepConcept && (
            <div className="pt-6 border-t border-tamas">
              <SectionTitle className="mb-4">{t(language, 'coreConcept')}</SectionTitle>
              <Link
                to={`/system/${systemId}/text/${targetTextId}/concept/${stepConcept.id}`}
                className="block p-4 rounded-xl bg-avyakta-3/50 hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
              >
                <div className="font-serif font-bold text-sattva text-base mb-1">
                  {stepConceptTitle || (stepConcept.id as string)}
                </div>
                {stepConceptSummary && (
                  <div className="text-sm text-sattva-dim line-clamp-3 leading-relaxed">
                    {stepConceptSummary}
                  </div>
                )}
                <div className="mt-2 text-xs font-semibold text-rajas">
                  {t(language, 'openConceptArticleShort')}
                </div>
              </Link>
            </div>
          )}

          {content?.summary && (
            <div className="pt-6 border-t border-tamas">
              <SectionTitle className="mb-4">{t(language, 'summaryLabel')}</SectionTitle>
              <div className="prose max-w-none text-sattva-dim">
                <RichText
                  text={content.summary}
                  systemId={systemId}
                  textId={targetTextId}
                  knownConcepts={knownConceptIds}
                />
              </div>
            </div>
          )}

          {content?.keyPoints && content.keyPoints.length > 0 && (
            <div className="pt-6 border-t border-tamas">
              <SectionTitle className="mb-4">{t(language, 'keyInsights')}</SectionTitle>
              <ul className="space-y-3">
                {content.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex text-sattva items-start">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-rajas mt-2 me-3 shrink-0 forced-colors:bg-[CanvasText]"></span>
                    <span className="flex-1">
                      <RichText
                        text={point}
                        systemId={systemId}
                        textId={targetTextId}
                        knownConcepts={knownConceptIds}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.unitIds && step.unitIds.length > 0 && targetTextId && (
            <div className="pt-6 border-t border-tamas">
              <SectionTitle className="mb-4">{t(language, 'relatedVerses')} ({verseTermPlural})</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {step.unitIds.map((vId) => (
                  <ChipLink
                    key={vId}
                    to={`/system/${systemId}/text/${targetTextId}/verse/${vId}`}
                  >
                    {verseTermSingular} {vId}
                  </ChipLink>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
      </div>
      <SwipeHint text={t(language, 'swipeHint')} />

      {drawerOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t(language, 'threadContents')}
            className="fixed inset-0 z-50"
          >
            <div
              aria-hidden="true"
              onClick={closeDrawer}
              className="absolute inset-0 bg-overlay"
            />
            <div className="relative max-w-lg mx-auto mt-[8vh] px-4">
              <div
                ref={setDialogRefs}
                style={{ touchAction: 'pan-y' }}
                className="bg-avyakta-2 border border-tamas-deep rounded-2xl shadow-lg overflow-hidden animate-fade-in"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-tamas-deep">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-sattva truncate">
                      {t(language, 'threadContents')}
                    </div>
                    <div className="text-xs text-sattva-dim tabular-nums">
                      {t(language, 'stepOf', { current: clampedIndex + 1, total: totalSteps })} · {t(language, 'threadProgress', { percent })}
                    </div>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeDrawer}
                    aria-label={t(language, 'closeLabel')}
                    className="flex items-center justify-center min-h-11 min-w-11 rounded-lg text-sattva-dim hover:text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                  >
                    <CloseIcon aria-hidden="true" className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {steps.map((s, i) => {
                    const title = threadStepTitle(s, language);
                    const isCurrent = i === clampedIndex;
                    const reached = i <= furthest;
                    return (
                      <button
                        key={s.id as string}
                        type="button"
                        onClick={() => {
                          goToStep(i);
                          setDrawerOpen(false);
                          triggerRef.current?.focus();
                        }}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl min-h-11 text-left transition-colors motion-reduce:transition-none ${
                          isCurrent ? '' : 'hover:bg-avyakta-3'
                        }`}
                        style={isCurrent ? { backgroundColor: accentTint(accent.primary) } : undefined}
                      >
                        <CountBadge
                          accentPrimary={isCurrent ? accent.primary : undefined}
                          variant="tile"
                          className={isCurrent || reached ? '' : 'opacity-60'}
                        >
                          {i + 1}
                        </CountBadge>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-sm truncate ${
                              isCurrent ? 'font-semibold text-sattva' : reached ? 'text-sattva' : 'text-tamas'
                            }`}
                          >
                            {title}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <BottomBar>
        {clampedIndex > 0 ? (
          <button
            onClick={handlePrev}
            aria-label={t(language, 'previous')}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-4 py-2 text-sm font-medium text-sattva-dim hover:text-rajas transition-colors motion-reduce:transition-none"
          >
            <ChevronLeft aria-hidden="true" className="w-5 h-5 mr-1" />
            <span className="whitespace-nowrap">{t(language, 'previous')}</span>
          </button>
        ) : (
          <div className="w-24" />
        )}

        <Link
          to={`/system/${systemId}`}
          className="flex items-center gap-1.5 px-4 min-h-11 min-w-0 max-w-[46vw] rounded-full hover:bg-avyakta-3 transition-colors motion-reduce:transition-none text-sattva-dim hover:text-sattva"
          title={t(language, 'backToSystem')}
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium truncate">{t(language, 'backToSystem')}</span>
        </Link>

        {clampedIndex < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            aria-label={t(language, 'next')}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-4 py-2 text-sm font-medium text-rajas hover:text-rajas-dim transition-colors motion-reduce:transition-none"
          >
            <span className="whitespace-nowrap">{t(language, 'next')}</span>
            <ChevronRight aria-hidden="true" className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <div className="w-24" />
        )}
      </BottomBar>
    </PageShell>
  );
}
