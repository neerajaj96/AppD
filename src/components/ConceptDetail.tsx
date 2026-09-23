import { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary } from '../content/v2/catalog';
import { useCatalog, useV2Text, useTraditionThread } from '../content/v2/hooks';
import { v2ConceptToConcept, v2StepToThreadStep, v2UnitToVerse } from '../content/v2/compat';
import { getSearchClient } from '../search/client';
import type { ConceptHit } from '../utils/references';
import RichText from './RichText';
import ReadingControls from './ReadingControls';
import { usePagerKeys } from '../utils/pagerKeys';
import { SWIPE_SURFACE_STYLE, useSwipeNav } from '../utils/useSwipeNav';
import { BottomBar, Notice, Card, CardBody, Breadcrumb, PageShell, SectionTitle, SwipeHint } from './Primitives';
import {
  RelatedConceptsSection,
  RelatedVersesSection,
  ThreadMentionsSection,
  CrossSystemSection,
} from './ReferenceLinks';

/**
 * Concept article — the Wikipedia-style entry point for a single tattva /
 * padartha. Aggregates everything that links to it: defining verses, related
 * concepts, thread steps, and occurrences in other darshanas (via the
 * generated search index). Data arrives through the V2 repository.
 */
export default function ConceptDetail() {
  const { systemId, textId, conceptId } = useParams();
  const { language } = useLanguage();
  const catalog = useCatalog();
  const textData = useV2Text(textId);
  const traditionThread = useTraditionThread(systemId);

  const tradition = catalog.status === 'ok'
    ? catalog.data.traditions.find((t) => t.id === systemId)
    : undefined;
  const summary = catalog.status === 'ok'
    ? catalog.data.texts.find((t) => t.textId === textId)
    : undefined;

  const units = useMemo(() => (textData.status === 'ok' ? textData.data.units : []), [textData]);
  const v2Concepts = useMemo(() => (textData.status === 'ok' ? textData.data.concepts : []), [textData]);
  const v2Concept = useMemo(() => v2Concepts.find((c) => c.id === conceptId), [v2Concepts, conceptId]);
  const concept = useMemo(() => (v2Concept ? v2ConceptToConcept(v2Concept) : undefined), [v2Concept]);

  const nav = useMemo(() => {
    if (!v2Concept) return { prev: null, next: null };
    const idx = v2Concepts.findIndex((c) => c.id === v2Concept.id);
    return {
      prev: idx > 0 ? v2Concepts[idx - 1] : null,
      next: idx >= 0 && idx < v2Concepts.length - 1 ? v2Concepts[idx + 1] : null,
    };
  }, [v2Concepts, v2Concept]);

  const navigate = useNavigate();
  usePagerKeys(
    nav.next && systemId && textId
      ? () => navigate(`/system/${systemId}/text/${textId}/concept/${nav.next?.id}`)
      : null,
    nav.prev && systemId && textId
      ? () => navigate(`/system/${systemId}/text/${textId}/concept/${nav.prev?.id}`)
      : null,
  );
  // Phone-friendly paging: swipe left for the next concept, right for the
  // previous one. Mirrors the BottomBar; vertical scroll never pages.
  const swipeRef = useSwipeNav(
    nav.next && systemId && textId
      ? () => navigate(`/system/${systemId}/text/${textId}/concept/${nav.next?.id}`)
      : null,
    nav.prev && systemId && textId
      ? () => navigate(`/system/${systemId}/text/${textId}/concept/${nav.prev?.id}`)
      : null,
  );

  const verses = useMemo(() => {
    if (!systemId || !textId || !v2Concept) return [];
    const byId = new Map(units.map((u) => [u.id, u]));
    return (v2Concept.relatedUnitIds || []).flatMap((uid) => {
      const unit = byId.get(uid);
      return unit && systemId && textId ? [{ systemId, textId, verse: v2UnitToVerse(unit) }] : [];
    });
  }, [systemId, textId, v2Concept, units]);

  const related = useMemo(() => {
    if (!systemId || !textId || !v2Concept) return [];
    const byId = new Map(v2Concepts.map((c) => [c.id, c]));
    const out: ConceptHit[] = [];
    const seen = new Set([v2Concept.id]);
    for (const cid of v2Concept.relatedConceptIds || []) {
      if (out.length >= 12) break;
      const hit = byId.get(cid);
      if (hit && !seen.has(cid)) {
        seen.add(cid);
        out.push({ systemId, textId, concept: v2ConceptToConcept(hit) });
      }
    }
    if (out.length < 12) {
      const mine = new Set(v2Concept.relatedUnitIds || []);
      const scored: Array<{ concept: (typeof v2Concepts)[number]; shared: number }> = [];
      for (const other of v2Concepts) {
        if (other.id === v2Concept.id || seen.has(other.id)) continue;
        let shared = 0;
        for (const uid of other.relatedUnitIds || []) if (mine.has(uid)) shared += 1;
        if (shared > 0) scored.push({ concept: other, shared });
      }
      scored.sort((a, b) => b.shared - a.shared);
      for (const s of scored) {
        if (out.length >= 12) break;
        seen.add(s.concept.id);
        out.push({ systemId, textId, concept: v2ConceptToConcept(s.concept) });
      }
    }
    return out;
  }, [systemId, textId, v2Concept, v2Concepts]);

  const threadSteps = useMemo(() => {
    if (!systemId || !textId || !conceptId || traditionThread.status !== 'ok' || !v2Concept) return [];
    const unitSet = new Set(v2Concept.relatedUnitIds || []);
    const direct: Array<{ systemId: string; stepIndex: number; step: ReturnType<typeof v2StepToThreadStep> }> = [];
    const viaUnit: Array<{ systemId: string; stepIndex: number; step: ReturnType<typeof v2StepToThreadStep> }> = [];
    traditionThread.data.forEach((thread) => {
      thread.steps.forEach((step, stepIndex) => {
        if ((step.textId || thread.textId) !== textId) return;
        const legacy = v2StepToThreadStep(step, textId);
        if (step.conceptId === conceptId) {
          direct.push({ systemId, stepIndex, step: legacy });
          return;
        }
        if (unitSet.size > 0 && (step.unitIds || []).some((u) => unitSet.has(u))) {
          viaUnit.push({ systemId, stepIndex, step: legacy });
        }
      });
    });
    return [...direct, ...viaUnit];
  }, [systemId, textId, conceptId, traditionThread, v2Concept]);

  // Cross-darshana occurrences resolve through the generated search index
  // (lazy, cached) rather than a corpus-wide scan.
  const [crossSystem, setCrossSystem] = useState<ConceptHit[]>([]);
  useEffect(() => {
    if (!systemId || !conceptId) return;
    let live = true;
    getSearchClient()
      .findConceptsById(conceptId)
      .then((hits) => {
        if (!live) return;
        setCrossSystem(
          hits
            .filter((h) => h.entry.traditionId !== systemId)
            .map((h) => ({
              systemId: h.entry.traditionId,
              textId: h.entry.textId,
              concept: {
                id: h.entry.conceptId as never,
                content: {
                  en: { title: h.entry.title, summary: undefined },
                },
              } as ConceptHit['concept'],
            })),
        );
      });
    return () => {
      live = false;
    };
  }, [systemId, conceptId]);

  // Long defining-verse lists collapse to 12 with an explicit expander —
  // the heading always states the true total, so nothing is silently lost.
  const [versesExpanded, setVersesExpanded] = useState(false);

  if (catalog.status === 'loading' || textData.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  if (catalog.status !== 'ok' || textData.status !== 'ok' || !v2Concept || !concept || !tradition || !summary) {
    const offline = textData.status === 'offline' || catalog.status === 'offline';
    return <div className="text-center py-12">{offline ? t(language, 'offlineNotice') : t(language, 'conceptNotFound')}</div>;
  }

  const content = concept.content[language] ?? concept.content.en;
  const title = content?.title || (concept.id as string);
  const summaryText = content?.summary;
  const verseTermPlural = getVerseTermForSummary(summary, 2);
  const verseTermSingular = getVerseTermForSummary(summary, 1);
  const systemDisplay = getTraditionDisplay(tradition, language);
  const isMlFallback = language === 'ml' && !concept.content.ml;
  const knownConceptIds = new Set(v2Concepts.map((c) => c.id));

  return (
    <PageShell className="select-text">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            trail={[
              { to: `/system/${systemId}`, label: systemDisplay.title },
              { to: `/system/${systemId}/text/${textId}`, label: textData.data.manifest.transliteratedTitle },
            ]}
            current={title}
          />
        </div>
        <ReadingControls />
      </div>

      <div ref={swipeRef} style={SWIPE_SURFACE_STYLE}>
      <Card>
        {isMlFallback && (
          <div className="mx-8 mt-8 md:mx-10">
            <Notice tone="amber">{t(language, 'mlFallbackThread')}</Notice>
          </div>
        )}
        <CardBody>
          <div className="space-y-3">
            <div className="text-xs font-semibold text-tamas uppercase tracking-widest">
              {t(language, 'conceptLabel')} • {textData.data.manifest.transliteratedTitle}
            </div>
            <h1 className="text-3xl font-serif font-bold text-sattva leading-tight">{title}</h1>
            {concept.category && (
              <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-avyakta-3 text-sattva-dim font-medium">
                {concept.category}
              </span>
            )}
          </div>

          {summaryText && (
            <div className="text-lg md:text-xl text-sattva leading-relaxed font-serif">
              <RichText text={summaryText} systemId={systemId} textId={textId} knownConcepts={knownConceptIds} />
            </div>
          )}

          {verses.length > 0 && (
            <div className="pt-6 border-t border-tamas">
              <SectionTitle className="mb-4">
                {t(language, 'definingLabel', { term: verseTermPlural, count: verses.length })}
              </SectionTitle>
              <div className="space-y-3">
                {(versesExpanded ? verses : verses.slice(0, 12)).map(({ verse }) => {
                  const translation =
                    verse.content[language]?.translation || verse.content.en?.translation;
                  return (
                    <Link
                      key={verse.id as string}
                      to={`/system/${systemId}/text/${textId}/verse/${verse.id}`}
                      className="block p-4 rounded-xl bg-avyakta-3/50 hover:bg-avyakta-3 transition-colors motion-reduce:transition-none group"
                    >
                      <div className="text-sm font-semibold text-rajas mb-1">
                        {verseTermSingular} {verse.number}
                      </div>
                      {translation && (
                        <div className="text-sm text-sattva-dim line-clamp-2 leading-relaxed">
                          {translation}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
              {verses.length > 12 && (
                <button
                  type="button"
                  onClick={() => setVersesExpanded((v) => !v)}
                  aria-expanded={versesExpanded}
                  className="mt-3 w-full px-4 min-h-11 rounded-xl bg-avyakta-3/50 hover:bg-avyakta-3 text-sm font-medium text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
                >
                  {versesExpanded
                    ? t(language, 'collapseAll')
                    : `${t(language, 'expandAll')} (${verses.length})`}
                </button>
              )}
            </div>
          )}

          <RelatedConceptsSection items={related} currentSystemId={systemId} />
          <ThreadMentionsSection steps={threadSteps} />
          <CrossSystemSection items={crossSystem} />
        </CardBody>
      </Card>
      </div>
      {(nav.prev || nav.next) && <SwipeHint text={t(language, 'swipeHint')} />}

      <BottomBar>
        {nav.prev ? (
          <Link
            to={`/system/${systemId}/text/${textId}/concept/${nav.prev.id}`}
            aria-label={`${t(language, 'previous')}: ${(nav.prev.localisations[language]?.title || nav.prev.localisations.en?.title || nav.prev.id) as string}`}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-2 text-sm font-medium text-sattva-dim hover:text-rajas transition-colors motion-reduce:transition-none"
          >
            <ChevronLeft aria-hidden="true" className="w-5 h-5 mr-1" />
            <span className="max-w-24 truncate sm:max-w-40">
              {(nav.prev.localisations[language]?.title || nav.prev.localisations.en?.title || nav.prev.id) as string}
            </span>
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

        {nav.next ? (
          <Link
            to={`/system/${systemId}/text/${textId}/concept/${nav.next.id}`}
            aria-label={`${t(language, 'next')}: ${(nav.next.localisations[language]?.title || nav.next.localisations.en?.title || nav.next.id) as string}`}
            className="flex items-center shrink-0 min-h-11 min-w-11 px-2 text-sm font-medium text-sattva-dim hover:text-rajas transition-colors motion-reduce:transition-none"
          >
            <span className="max-w-24 truncate sm:max-w-40">
              {(nav.next.localisations[language]?.title || nav.next.localisations.en?.title || nav.next.id) as string}
            </span>
            <ChevronRight aria-hidden="true" className="w-5 h-5 ml-1" />
          </Link>
        ) : (
          <div className="w-20" />
        )}
      </BottomBar>
    </PageShell>
  );
}
