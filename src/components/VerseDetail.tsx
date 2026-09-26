import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, ArrowLeft, Share2, Check, Bookmark } from 'lucide-react';
import Markdown from 'react-markdown';
import RichText from './RichText';
import ReadingControls from './ReadingControls';
import { CitationButton, CitationText, EditorialRows, EvidenceList, ProvRows, editorialRows, provenanceRows, resolveEvidenceRows } from './Provenance';
import { formatCitation, selectCitationSource, unitCanonicalUrl } from '../content/v2/citation';
import type { V2Source } from '../content/v2/schema';
import { useReading } from '../context/ReadingContext';
import { Breadcrumb, BottomBar, Notice, CollapsibleSection, Card, CardBody, PageShell, SwipeHint, ActionButton } from './Primitives';
import {
  RelatedConceptRows,
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
import { useCatalog, useV2Text, useTraditionThread, useTextSources } from '../content/v2/hooks';
import { v2ConceptToConcept, v2StepToThreadStep, v2UnitToVerse } from '../content/v2/compat';
import { getAdjacentUnits, pickLocalisation } from '../content/v2/select';
import type { CanonicalUnit } from '../content/v2/schema';
import type { TextManifestFile } from '../content/v2/chunks';

/**
 * Scholarly apparatus for one canonical unit, ordered to answer: what is
 * the citation, what source relationship is established, where is the
 * unit located, and what is its editorial state. Citation first
 * (compact but prominent), then evidence rows pairing each attached
 * source with its own relation badge, then the unit's provenance
 * locator kept strictly separate from evidence relations, then
 * editorial workflow metadata — never implying review equals
 * historical verification. Citation generation is untouched.
 */
function UnitSourceArea({
  unit,
  manifest,
  systemId,
  textId,
  verseId,
}: {
  unit: CanonicalUnit;
  manifest: TextManifestFile;
  systemId: string;
  textId: string;
  verseId: string;
}) {
  const { language } = useLanguage();
  const sourcesState = useTextSources(textId);
  const attached: V2Source[] =
    sourcesState.status === 'ok' && unit.sourceIds
      ? sourcesState.data.filter((s) => unit.sourceIds?.includes(s.id))
      : [];
  const registryCount = sourcesState.status === 'ok' ? sourcesState.data.length : 0;
  // Citation edition metadata comes from the source carrying the `text`
  // relation when evidence links establish one, else the first attached
  // source — identical output wherever no precise link exists.
  const primary = selectCitationSource(attached, unit.evidenceLinks);
  const rows = resolveEvidenceRows(attached, unit.evidenceLinks);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const citation = formatCitation({
    textTitle: manifest.transliteratedTitle,
    unitNumber: unit.number,
    author: manifest.author,
    edition: primary?.edition,
    publisher: primary?.publisher,
    year: primary?.year,
    locator: primary?.locator || unit.provenance?.locator,
    page: primary?.page || unit.provenance?.page,
    url: unitCanonicalUrl(origin, systemId, textId, verseId),
  });
  const locator = unit.provenance?.locator?.trim();
  const ed = editorialRows(unit.editorial);
  const showProvenance = Boolean(locator) || provenanceRows(unit.provenance).length > 0;
  return (
    <CollapsibleSection title={t(language, 'sourcesAndCitation')} defaultOpen={false}>
      <div className="space-y-6">
        <section aria-label={t(language, 'citeThisUnit')}>
          <h4 className="t-label text-tamas mb-2">{t(language, 'citeThisUnit')}</h4>
          <div className="space-y-2">
            <CitationText citation={citation} />
            <CitationButton citation={citation} />
          </div>
        </section>
        <EvidenceList rows={rows} />
        {attached.length === 0 && registryCount > 0 && (
          <p className="text-sm text-sattva-dim">
            <Link
              to={`/system/${systemId}/text/${textId}`}
              className="underline decoration-rajas/40 underline-offset-2 hover:text-sattva transition-colors motion-reduce:transition-none"
            >
              {t(language, 'viewTextSources')}
            </Link>
          </p>
        )}
        {showProvenance && (
          <section aria-label={t(language, 'edProvenance')}>
            <h4 className="t-label text-tamas mb-2">{t(language, 'edProvenance')}</h4>
            {locator ? (
              <dl className="space-y-2">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="shrink-0 text-tamas">{t(language, 'sourceLocatorLabel')}</dt>
                  <dd className="min-w-0 text-right text-sattva-dim break-words">{locator}</dd>
                </div>
              </dl>
            ) : (
              <ProvRows rows={provenanceRows(unit.provenance)} />
            )}
            {attached.length === 0 && locator && (
              <p className="t-body-sans text-sattva-dim mt-1.5">{t(language, 'locatorOnlyNote')}</p>
            )}
          </section>
        )}
        {ed.length > 0 && (
          <section aria-label={t(language, 'edTitle')}>
            <EditorialRows rows={ed} />
          </section>
        )}
      </div>
    </CollapsibleSection>
  );
}

/**
 * Scholarly unit reader (Prompt 4) — the core reading surface.
 *
 * Reading order: breadcrumb → unit identifier → Sanskrit source
 * (Devanāgarī + IAST as one textual object) → translation → commentary →
 * textual notes → word meanings → key points → related concepts → related
 * units → thread appearances → prev/next navigation. Layer visibility
 * follows the persisted reading preferences; provenance renders only from
 * V2 data actually present. Data arrives through the V2 repository.
 */
export default function VerseDetail() {
  const { systemId, textId, verseId } = useParams();
  const { language, setLanguage } = useLanguage();
  const { display } = useReading();
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

  // Adjacent units in actual V2 chunk order; null at each boundary.
  // Guarded: all hooks stay unconditional so a hop from a valid verse to
  // a missing id never changes the hook order.
  const { prevVerse, nextVerse } = useMemo(() => {
    if (!unit) return { prevVerse: null, nextVerse: null };
    const { prev, next } = getAdjacentUnits(units, unit.id);
    return { prevVerse: prev, nextVerse: next };
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
          out.push({ systemId, stepIndex, step: v2StepToThreadStep(step, textId), threadId: thread.id });
        }
      });
    });
    return out;
  }, [systemId, textId, verseId, traditionThread]);

  if (catalog.status === 'loading' || textData.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  const failed = catalog.status === 'error' || textData.status === 'error';
  if (failed) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sattva-dim">{t(language, 'offlineNotice')}</p>
        <ActionButton onClick={() => window.location.reload()} label={t(language, 'retryLabel')}>
          {t(language, 'retryLabel')}
        </ActionButton>
      </div>
    );
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

  // Language selection with English fallback lives in the shared selector
  // so the rule is identical everywhere and unit-testable.
  const { active: activeLoc, isFallback } = pickLocalisation(unit.localisations, language);
  const enLoc = unit.localisations.en;
  const translation = activeLoc?.translation || enLoc?.translation;
  const commentary = activeLoc?.commentary || enLoc?.commentary;
  const wordMeaning = (activeLoc as { wordMeaning?: string } | undefined)?.wordMeaning
    || (enLoc as { wordMeaning?: string } | undefined)?.wordMeaning;
  const variantNote = (activeLoc as { variantNote?: string } | undefined)?.variantNote
    || (enLoc as { variantNote?: string } | undefined)?.variantNote;
  const activeKeys = activeLoc?.keyPoints && activeLoc.keyPoints.length > 0
    ? activeLoc.keyPoints
    : enLoc?.keyPoints;
  const keyPoints = activeKeys && activeKeys.length > 0 ? activeKeys : undefined;

  const isShowingFallback = isFallback && language === 'ml' && !!enLoc;
  const layersHidden = !display.showTranslation && !display.showCommentary;

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
          <ReadingControls showLayers />
          <button
            type="button"
            onClick={handleBookmark}
            aria-pressed={saved}
            title={saved ? t(language, 'savedLabel') : t(language, 'saveLabel')}
            aria-label={saved ? t(language, 'savedLabel') : t(language, 'saveLabel')}
            className="flex items-center justify-center min-h-9 min-w-9 rounded-lg bg-avyakta-3 hover:bg-avyakta-4 transition-colors motion-reduce:transition-none"
          >
            <Bookmark
              aria-hidden="true"
              fill={saved ? 'currentColor' : 'none'}
              className={`w-4 h-4 ${saved ? 'text-rajas' : 'text-sattva-dim'}`}
            />
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
          {/* The Sanskrit source is the primary textual object: centred,
              set large in the Devanagari and transliteration faces, with
              word-wrap guards for narrow viewports. */}
          {display.showSanskrit && (verse.devanagari || verse.iast) && (
            <div className="text-center space-y-6">
              <div>
                {verse.section && (
                  <p className="t-eyebrow text-tamas mb-2">{verse.section}</p>
                )}
                <h1 className="t-display2 text-sattva">
                  {verseTerm} {verse.number}
                </h1>
              </div>

              {verse.devanagari && (
                <div lang="sa" className="t-devanagari text-3xl md:text-4xl text-sattva break-words">
                  {verse.devanagari.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}

              {verse.iast && (
                <div lang="sa-Latn" className="text-xl md:text-2xl text-sattva italic leading-relaxed break-words">
                  {verse.iast.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {(!display.showSanskrit || (!verse.devanagari && !verse.iast)) && (
            <div className="text-center">
              {verse.section && (
                <p className="t-eyebrow text-tamas mb-2">{verse.section}</p>
              )}
              <h1 className="t-display2 text-sattva">
                {verseTerm} {verse.number}
              </h1>
            </div>
          )}

          {display.showTranslation && translation && (
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

          {display.showCommentary && commentary && (
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

          {layersHidden && (translation || commentary) && (
            <Notice tone="neutral">{t(language, 'readingHiddenNotice')}</Notice>
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

          {wordMeaning && (
            <CollapsibleSection
              title={
                language === 'ml' && (verse.content.ml as { wordMeaning?: string } | undefined)?.wordMeaning
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

          <UnitSourceArea
            unit={unit}
            manifest={textData.data.manifest}
            systemId={systemId as string}
            textId={textId as string}
            verseId={verseId as string}
          />

          <RelatedConceptRows items={relatedConcepts} />
          <RelatedVersesSection items={relatedVerses} title={t(language, 'relatedUnits')} verseTerm={verseTerm} />
          <ThreadMentionsSection steps={threadSteps} title={t(language, 'threadAppearances')} />
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
