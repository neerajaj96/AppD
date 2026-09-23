import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getSystemAccent } from '../utils/theme';
import { ChevronRight, ChevronLeft, ArrowLeft, Share2, Check, Bookmark } from 'lucide-react';
import Markdown from 'react-markdown';
import RichText from './RichText';
import ReadingControls from './ReadingControls';
import { Breadcrumb, BottomBar, Notice, CollapsibleSection, Card, CardBody, PageShell, SwipeHint } from './Primitives';
import {
  RelatedConceptsSection,
  RelatedVersesSection,
  ThreadMentionsSection,
} from './ReferenceLinks';
import type { ConceptHit, ThreadStepHit, VerseHit } from '../utils/references';
import { usePagerKeys } from '../utils/pagerKeys';
import { SWIPE_SURFACE_STYLE, useSwipeNav } from '../utils/useSwipeNav';
import { recordVerseVisit } from '../utils/readingHistory';
import { isBookmarked, toggleBookmark } from '../utils/bookmarks';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary } from '../content/v2/catalog';
import { useCatalog, useV2Text, useTraditionThread } from '../content/v2/hooks';
import { v2ConceptToConcept, v2StepToThreadStep, v2UnitToVerse } from '../content/v2/compat';

// Verse page via the V2 repository: the text's chunks arrive on demand and
// relations resolve within the loaded text. Visual behaviour is unchanged.
export default function VerseDetail() {
  const { systemId, textId, verseId } = useParams();
  const { language, setLanguage } = useLanguage();
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle');
  const catalog = useCatalog();
  const textData = useV2Text(textId);
  const traditionThread = useTraditionThread(systemId);

  const tradition = catalog.status === 'ok'
    ? catalog.data.traditions.find((t) => t.id === systemId)
    : undefined;
  const summary = catalog.status === 'ok'
    ? catalog.data.texts.find((t) => t.textId === textId)
    : undefined;

  const units = useMemo(
    () => (textData.status === 'ok' ? textData.data.units : []),
    [textData],
  );
  const unit = useMemo(() => units.find((u) => u.id === verseId), [units, verseId]);
  const verse = useMemo(() => (unit ? v2UnitToVerse(unit) : undefined), [unit]);

  const verseTerm = getVerseTermForSummary(summary, 1);

  // Cache next/prev verses so the pager does not scan the array on every
  // render. Guarded: all hooks in this component stay unconditional so a
  // hop from a valid verse to a missing id never changes the hook order.
  const { prevVerse, nextVerse } = useMemo(() => {
    if (!unit) return { prevVerse: null, nextVerse: null };
    const currentIndex = units.findIndex((u) => u.id === unit.id);
    return {
      prevVerse: currentIndex > 0 ? units[currentIndex - 1] : null,
      nextVerse: currentIndex >= 0 && currentIndex < units.length - 1 ? units[currentIndex + 1] : null,
    };
  }, [units, unit]);

  const navigate = useNavigate();
  const nextHref = systemId && textId && nextVerse
    ? `/system/${systemId}/text/${textId}/verse/${nextVerse.id}`
    : null;
  const prevHref = systemId && textId && prevVerse
    ? `/system/${systemId}/text/${textId}/verse/${prevVerse.id}`
    : null;
  usePagerKeys(
    nextHref ? () => navigate(nextHref) : null,
    prevHref ? () => navigate(prevHref) : null,
  );
  // Phone-friendly paging: swipe left for the next verse, right for the
  // previous one. Progressive enhancement over the BottomBar and arrow
  // keys; vertical reading scroll and text selection never trigger it.
  const swipeRef = useSwipeNav(
    nextHref ? () => navigate(nextHref) : null,
    prevHref ? () => navigate(prevHref) : null,
  );

  // Feed the Home continuity strip (deduped, most-recent-first) and keep
  // the bookmark toggle honest across prev/next walks of the same mount.
  const [saved, setSaved] = useState(() =>
    systemId && textId && verseId
      ? isBookmarked(systemId, textId, verseId)
      : false,
  );
  useEffect(() => {
    if (!systemId || !textId || !verseId || !unit) return;
    recordVerseVisit(systemId, textId, verseId);
    setSaved(isBookmarked(systemId, textId, verseId));
  }, [systemId, textId, verseId, unit]);

  // Wikipedia-style interlinks, resolved within the loaded text chunks.
  const relatedConcepts: ConceptHit[] = useMemo(() => {
    if (!systemId || !textId || !unit) return [];
    const out: ConceptHit[] = [];
    for (const cid of unit.conceptIds || []) {
      const concept = textData.status === 'ok'
        ? textData.data.concepts.find((c) => c.id === cid)
        : undefined;
      if (concept) {
        out.push({
          systemId,
          textId,
          concept: v2ConceptToConcept(concept),
        });
      }
    }
    return out;
  }, [systemId, textId, unit, textData]);

  const relatedVerses: VerseHit[] = useMemo(() => {
    if (!systemId || !textId || !unit || textData.status !== 'ok') return [];
    const mine = new Set(unit.conceptIds || []);
    if (mine.size === 0) return [];
    const scored: Array<{ verse: ReturnType<typeof v2UnitToVerse>; shared: number }> = [];
    for (const other of textData.data.units) {
      if (other.id === unit.id) continue;
      let shared = 0;
      for (const cid of other.conceptIds || []) if (mine.has(cid)) shared += 1;
      if (shared > 0) scored.push({ verse: v2UnitToVerse(other), shared });
    }
    scored.sort((a, b) => b.shared - a.shared);
    return scored.slice(0, 8).map((s) => ({ systemId, textId, verse: s.verse }));
  }, [systemId, textId, unit, textData]);

  const threadSteps: ThreadStepHit[] = useMemo(() => {
    if (!systemId || !textId || !verseId || traditionThread.status !== 'ok') return [];
    const out: ThreadStepHit[] = [];
    traditionThread.data.forEach((thread) => {
      thread.steps.forEach((step, stepIndex) => {
        if ((step.textId || thread.textId) !== textId) return;
        if ((step.unitIds || []).includes(verseId)) {
          out.push({ systemId, stepIndex, step: v2StepToThreadStep(step, textId) });
        }
      });
    });
    return out;
  }, [systemId, textId, verseId, traditionThread]);

  if (catalog.status === 'loading' || textData.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  if (catalog.status !== 'ok' || textData.status !== 'ok' || !unit || !verse || !tradition || !summary) {
    const offline = textData.status === 'offline' || catalog.status === 'offline';
    return (
      <div className="text-center py-12">
        {offline ? t(language, 'offlineNotice') : t(language, 'verseNotFoundFallback', { term: getVerseTermForSummary(summary, 1) })}
      </div>
    );
  }

  const handleBookmark = () => {
    setSaved(toggleBookmark(systemId as string, textId as string, verseId as string));
  };

  const activeContent = verse.content[language] ?? verse.content.en;
  const fallbackContent = verse.content.en;

  const translation = activeContent?.translation || fallbackContent?.translation;
  const commentary = activeContent?.commentary || fallbackContent?.commentary;
  const wordMeaning = (activeContent as any)?.wordMeaning || (fallbackContent as any)?.wordMeaning;
  const variantNote = (activeContent as any)?.variantNote || (fallbackContent as any)?.variantNote;
  const keyPoints = (activeContent?.keyPoints && activeContent.keyPoints.length > 0)
    ? activeContent.keyPoints
    : fallbackContent?.keyPoints;

  const isCurrentLangAvailable = !!verse.content[language];
  const isShowingFallback = !isCurrentLangAvailable && language === 'ml';

  // Interlink sections above (kept with the other hooks so hook order is
  // stable); the narrowed system/text/verse below are safe to dereference.
  const flashShareState = (state: 'copied' | 'shared') => {
    setShareState(state);
    setTimeout(() => setShareState('idle'), 2000);
  };

  // Chat-ready citation: reference + source text + translation + deep link.
  // Commentary stays behind the link — pasting pages of it into a chat was
  // the old behaviour and buried the verse itself.
  const toPlain = (markdown: string): string =>
    markdown
      .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(^|\s)[*_]([^*_]+)[*_](?=\s|$)/g, '$1$2')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .trim();

  const handleShare = async () => {
    const systemTitle = getTraditionDisplay(tradition, language).title;
    const manifest = textData.data.manifest;
    const body = [
      `${systemTitle} — ${manifest.transliteratedTitle}`,
      `${verse.section ? `${verse.section} • ` : ''}${verseTerm} ${verse.number}`,
      verse.devanagari?.trim(),
      verse.iast?.trim(),
      translation ? toPlain(translation) : '',
    ]
      .filter(Boolean)
      .join('\n');

    // System share sheet first (mobile expectation: WhatsApp, mail, …).
    // Clipboard is the fallback, never a surprise after a dismissed sheet.
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({
          title: `${verseTerm} ${verse.number} · ${manifest.transliteratedTitle}`,
          text: body,
          url: window.location.href,
        });
        flashShareState('shared');
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    const textToCopy = `${body}\n\n${window.location.href}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      flashShareState('copied');
    } catch {
      setShareState('idle');
    }
  };

  const knownConceptIds = useMemo(
    () => new Set((unit.conceptIds || []).concat(relatedConcepts.map((h) => h.concept.id as string))),
    [unit, relatedConcepts],
  );

  return (
    <PageShell className="select-text">
      {/* Breadcrumb on its own row; controls wrap below on narrow
          viewports so neither squeezes the other on phones. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            trail={[
              { to: `/system/${systemId}`, label: getTraditionDisplay(tradition, language).title },
              { to: `/system/${systemId}/text/${textId}`, label: textData.data.manifest.transliteratedTitle },
            ]}
            current={`${verseTerm} ${verse.number}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 sm:justify-end sm:shrink-0 sm:ms-2">
          <ReadingControls />
          <button
            type="button"
            onClick={handleBookmark}
            aria-pressed={saved}
            title={saved ? t(language, 'savedLabel') : t(language, 'saveLabel')}
            className="flex items-center justify-center min-h-9 min-w-9 rounded-lg bg-avyakta-3 hover:bg-avyakta-4 transition-colors motion-reduce:transition-none"
          >
            <Bookmark
              aria-hidden="true"
              fill={saved ? 'currentColor' : 'none'}
              className={`w-4 h-4 ${saved ? 'text-rajas' : 'text-sattva-dim'}`}
            />
            <span className="sr-only">
              {saved ? t(language, 'savedLabel') : t(language, 'saveLabel')}
            </span>
          </button>
          {verse.content.en && (
            <button
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors motion-reduce:transition-none ${
                language === 'en' ? 'bg-avyakta-4 text-sattva shadow-xs' : 'bg-avyakta-3 hover:bg-avyakta-4 text-sattva'
              }`}
              title="English translation"
            >
              English
            </button>
          )}

          {verse.content.ml && (
            <button
              onClick={() => setLanguage('ml')}
              aria-pressed={language === 'ml'}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors motion-reduce:transition-none ${
                language === 'ml' ? 'bg-avyakta-4 text-sattva shadow-xs' : 'bg-avyakta-3 hover:bg-avyakta-4 text-sattva'
              }`}
              title={t(language, 'malayalamTranslationTitle')}
            >
              മലയാളം
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-avyakta-3 hover:bg-avyakta-4 text-sattva font-medium transition-colors motion-reduce:transition-none"
            title={t(language, 'copyShareTitle')}
          >
            {shareState !== 'idle' ? (
              <>
                <Check aria-hidden="true" className="w-3.5 h-3.5 text-teal" />
                <span className="text-teal">
                  {shareState === 'shared' ? t(language, 'sharedLabel') : t(language, 'copiedLabel')}
                </span>
              </>
            ) : (
              <>
                <Share2 aria-hidden="true" className="w-3.5 h-3.5" />
                <span>{t(language, 'shareLabel')}</span>
              </>
            )}
          </button>
          {/* Screen-reader confirmation for the visual tick above (WCAG 4.1.3).
              Sighted behaviour is unchanged; the visual label stays the
              single source of truth, mirrored here for announcements. */}
          {shareState !== 'idle' && (
            <span role="status" className="sr-only">
              {shareState === 'shared' ? t(language, 'sharedLabel') : t(language, 'copiedLabel')}
            </span>
          )}
        </div>
      </div>

      {isShowingFallback && (
        <Notice tone="amber">{t(language, 'mlFallbackVerse')}</Notice>
      )}

      <div ref={swipeRef} style={SWIPE_SURFACE_STYLE}>
      <Card>
        <CardBody>
          <div className="text-center space-y-6">
            <h2 className="text-lg font-medium text-tamas tracking-widest uppercase">
              {verse.section ? `${verse.section} • ` : ''} {verseTerm} {verse.number}
            </h2>

            {verse.devanagari && (
              <div lang="sa" className="t-devanagari text-3xl md:text-4xl text-sattva">
                {verse.devanagari.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {verse.iast && (
            <div lang="sa-Latn" className="text-xl md:text-2xl text-sattva italic leading-relaxed">
              {verse.iast.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
              ))}
            </div>
            )}
          </div>

          {translation && (
            <CollapsibleSection
              title={
                language === 'ml' && verse.content.ml?.translation
                  ? `${t(language, 'translationLabel')} (Translation)`
                  : t(language, 'translationLabel')
              }
              defaultOpen
            >
              <div className="t-body-serif text-sattva">
                <Markdown>{translation}</Markdown>
              </div>
            </CollapsibleSection>
          )}

          {wordMeaning && (
            <CollapsibleSection
              title={
                language === 'ml' && (verse.content.ml as any)?.wordMeaning
                  ? `${t(language, 'wordMeaningLabel')} (Word by Word)`
                  : t(language, 'wordMeaningLabel')
              }
              defaultOpen={false}
            >
              <div className="t-body-sans text-sattva-dim">
                <Markdown>{wordMeaning}</Markdown>
              </div>
            </CollapsibleSection>
          )}

          {commentary && (
            <CollapsibleSection
              title={
                language === 'ml' && verse.content.ml?.commentary
                  ? `${t(language, 'commentaryLabel')} (Commentary)`
                  : t(language, 'commentaryLabel')
              }
              defaultOpen={false}
            >
              <div className="prose max-w-none text-sattva">
                <RichText
                  text={commentary}
                  systemId={systemId}
                  textId={textId}
                  knownConcepts={knownConceptIds}
                />
              </div>
            </CollapsibleSection>
          )}

          {keyPoints && keyPoints.length > 0 && (
            <CollapsibleSection
              title={
                language === 'ml' && verse.content.ml?.keyPoints
                  ? `${t(language, 'keyPoints')} (Key Points)`
                  : t(language, 'keyPoints')
              }
            >
              <ul className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="flex text-sattva items-start">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-rajas mt-2 me-3 shrink-0 forced-colors:bg-[CanvasText]"></span>
                    <span className="flex-1">
                      <RichText
                        text={point}
                        systemId={systemId}
                        textId={textId}
                        knownConcepts={knownConceptIds}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {variantNote && (
            <CollapsibleSection title={t(language, 'variantNoteLabel')} defaultOpen={false}>
              <div className="t-body-sans text-sattva-dim">
                <Markdown>{variantNote}</Markdown>
              </div>
            </CollapsibleSection>
          )}

          {verse.interpretiveNotes && verse.interpretiveNotes.length > 0 && (
            <CollapsibleSection title={t(language, 'variantNoteLabel')} defaultOpen={false}>
              <ul className="space-y-2">
                {verse.interpretiveNotes.map((n, idx) => (
                  <li key={idx} className="flex text-sattva-dim items-start text-sm md:text-base">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-rajas mt-2 me-3 shrink-0 forced-colors:bg-[CanvasText]"></span>
                    <span className="flex-1">
                      <RichText
                        text={n.note}
                        systemId={systemId}
                        textId={textId}
                        knownConcepts={knownConceptIds}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          <RelatedConceptsSection items={relatedConcepts} currentSystemId={systemId} />
          <RelatedVersesSection items={relatedVerses} verseTerm={verseTerm} />
          <ThreadMentionsSection steps={threadSteps} />
        </CardBody>
      </Card>
      </div>
      {(prevHref || nextHref) && <SwipeHint text={t(language, 'swipeHint')} />}

      <BottomBar>
        {prevVerse ? (
          <Link
            to={`/system/${systemId}/text/${textId}/verse/${prevVerse.id}`}
            aria-label={`${t(language, 'previous')}: ${verseTerm} ${prevVerse.number}`}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-2 text-sm font-medium text-sattva-dim hover:text-rajas transition-colors motion-reduce:transition-none"
          >
            <ChevronLeft aria-hidden="true" className="w-5 h-5 mr-1" />
            <span className="whitespace-nowrap">{verseTerm} {prevVerse.number}</span>
          </Link>
        ) : (
          <div className="w-20" />
        )}

        <Link
          to={`/system/${systemId}/text/${textId}`}
          className="flex items-center gap-1.5 px-4 min-h-11 min-w-0 max-w-[46vw] rounded-full hover:bg-avyakta-3 transition-colors motion-reduce:transition-none text-sattva-dim hover:text-sattva"
          title={t(language, 'backToIndex')}
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium truncate">{t(language, 'backToIndex')}</span>
        </Link>

        {nextVerse ? (
          <Link
            to={`/system/${systemId}/text/${textId}/verse/${nextVerse.id}`}
            aria-label={`${t(language, 'next')}: ${verseTerm} ${nextVerse.number}`}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-2 text-sm font-medium text-sattva-dim hover:text-rajas transition-colors motion-reduce:transition-none"
          >
            <span className="whitespace-nowrap">{verseTerm} {nextVerse.number}</span>
            <ChevronRight aria-hidden="true" className="w-5 h-5 ml-1" />
          </Link>
        ) : (
          <div className="w-20" />
        )}
      </BottomBar>
    </PageShell>
  );
}
