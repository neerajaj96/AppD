import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Map as MapIcon, Sparkles, BookOpen as TextIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary, textLanguages } from '../content/v2/catalog';
import { useCatalog, useV2Text, useTraditionThread, useTextSources } from '../content/v2/hooks';
import { v2ConceptToConcept, v2StepToThreadStep, v2UnitToVerse } from '../content/v2/compat';
import { CountBadge, DisclosureChevron, RowChevron, Breadcrumb, ActionLink, ActionButton, PageHeader, SectionHeader, accentTint } from './Primitives';
import SourceInfo, { SourceList } from './Provenance';
import { getThreadProgress } from '../utils/threadProgress';

type Panel = 'thread' | 'concepts' | null;

/** Text source registry section. Silent unless records exist. */
function TextSourceSection({ textId }: { textId: string | undefined }) {
  const state = useTextSources(textId);
  if (state.status !== 'ok' || state.data.length === 0) return null;
  return <SourceList sources={state.data} />;
}

// Scholarly text landing page (Prompt 4): Tradition → Text → Structure →
// Study modes. Breadcrumb, identity, counts, language coverage, study
// actions, expandable section navigation, concepts with link counts, and
// related texts from the same tradition.
//
// Data arrives through the V2 repository (manifest + text chunks), never
// through the legacy corpus import.
export default function TextIndex() {
  const { systemId, textId } = useParams();
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

  const [openPanel, setOpenPanel] = useState<Panel>(null);
  // Which text sections (chapters) are expanded. First one opens by
  // default; reset whenever the user navigates to a different text.
  const [openSections, setOpenSections] = useState<string[]>([]);

  const legacyThread = useMemo(() => {
    if (traditionThread.status !== 'ok' || !textId) return [];
    return traditionThread.data
      .flatMap((thread) => thread.steps.map((step) => ({ step, thread })))
      .map(({ step }, globalIndex) => ({
        step: v2StepToThreadStep(step, step.textId || textId),
        globalIndex,
      }))
      .filter(({ step }) => (step.textId as string) === textId);
  }, [traditionThread, textId]);

  const threadSteps = legacyThread;

  // Resume entry: furthest visited system-thread step, shown only when it
  // belongs to this text and lies beyond Step 1 (otherwise it is noise).
  const resumeStep = useMemo(() => {
    if (!systemId || !textId || traditionThread.status !== 'ok') return null;
    const all = traditionThread.data.flatMap((thread) => thread.steps);
    const total = all.length;
    const stored = getThreadProgress(systemId);
    if (stored === null || stored <= 0 || stored >= total) return null;
    const step = all[stored];
    if (!step) return null;
    if ((step.textId || '') !== textId) return null;
    const content = step.localisations[language] ?? step.localisations.en;
    return { index: stored, total, title: content?.title || step.id };
  }, [systemId, textId, language, traditionThread]);

  const verses = useMemo(
    () => (textData.status === 'ok' ? textData.data.units.map(v2UnitToVerse) : []),
    [textData],
  );
  const concepts = useMemo(
    () => (textData.status === 'ok' ? textData.data.concepts.map(v2ConceptToConcept) : []),
    [textData],
  );

  const verseSections = useMemo(() => {
    const seen: string[] = [];
    verses.forEach((v) => {
      const s = v.section || '';
      if (!seen.includes(s)) seen.push(s);
    });
    return seen.map((s) => {
      const list = verses.filter((v) => (v.section || '') === s);
      return {
        section: s,
        verses: list,
        range: list.length > 0 ? `${list[0].number} – ${list[list.length - 1].number}` : '',
      };
    });
  }, [verses]);

  const multiSection = verseSections.length > 1;

  // Sibling texts in the same tradition for onward study.
  const siblingTexts = useMemo(() => {
    if (catalog.status !== 'ok' || !systemId || !textId) return [];
    return catalog.data.texts.filter((tx) => tx.traditionId === systemId && tx.textId !== textId);
  }, [catalog, systemId, textId]);

  // Open the first section by default so users see where the units live.
  useEffect(() => {
    if (verseSections.length > 0) {
      setOpenSections([verseSections[0].section]);
    } else {
      setOpenSections([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textId]);

  if (catalog.status === 'loading' || textData.status === 'loading' || traditionThread.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  if (catalog.status === 'error' || textData.status === 'error') {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sattva-dim">{t(language, 'offlineNotice')}</p>
        <ActionButton onClick={() => window.location.reload()} label={t(language, 'retryLabel')}>
          {t(language, 'retryLabel')}
        </ActionButton>
      </div>
    );
  }

  if (catalog.status !== 'ok' || textData.status !== 'ok' || !tradition || !summary) {
    const message = textData.status === 'offline' || catalog.status === 'offline'
      ? t(language, 'offlineNotice')
      : t(language, 'textNotFound');
    return <div className="text-center py-12">{message}</div>;
  }

  const manifest = textData.data.manifest;
  const accent = getSystemAccent(systemId || '');
  const systemDisplay = getTraditionDisplay(tradition, language);
  const hasVerses = verses.length > 0;
  const hasConcepts = concepts.length > 0;
  const togglePanel = (p: Exclude<Panel, null>) => setOpenPanel((cur) => (cur === p ? null : p));

  const verseTermPlural = getVerseTermForSummary(summary, 2).toLowerCase();
  const verseTermSingular = getVerseTermForSummary(summary, 1);
  const langs = textLanguages(summary);
  const langBadge = langs.ml > 0 ? 'EN · ML' : langs.en > 0 ? 'EN' : '';
  const firstVerse = verses[0];
  const showTranslit = manifest.title !== manifest.transliteratedTitle;

  const toggleSection = (section: string) =>
    setOpenSections((cur) =>
      cur.includes(section) ? cur.filter((s) => s !== section) : [...cur, section],
    );

  const jumpToSection = (section: string) => {
    setOpenSections((cur) => (cur.includes(section) ? cur : [...cur, section]));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Motion-sensitive readers must never receive a forced glide:
        // mirror the global reduced-motion guard in index.css.
        const reduced =
          typeof window !== 'undefined' &&
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document
          .getElementById(`section-${section || 'unsectioned'}`)
          ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    });
  };

  const sectionTitle = (section: string, count: number) => {
    if (section) return section;
    // Single-section / unsectioned texts: label the one dropdown.
    return `${getVerseTermForSummary(summary, count)} (${count})`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto pb-16">
      <Breadcrumb
        trail={[{ to: `/system/${systemId}`, label: systemDisplay?.title ?? tradition.title }]}
        current={manifest.transliteratedTitle}
      />

      <PageHeader
        eyebrow={`${systemDisplay?.title ?? tradition.title} · ${t(language, 'textsLabel')}`}
        accentPrimary={accent.primary}
        title={manifest.title}
        lede={
          <>
            {showTranslit && <span className="block">{manifest.transliteratedTitle}</span>}
            {manifest.author && (
              <span className="block">
                {t(language, 'authorLabel')}: {manifest.author}
              </span>
            )}
          </>
        }
        actions={
          <>
            {firstVerse && (
              <ActionLink
                to={`/system/${systemId}/text/${textId}/verse/${firstVerse.id}`}
                variant="primary"
                label={t(language, 'beginReading')}
              >
                {t(language, 'beginReading')}
              </ActionLink>
            )}
            {threadSteps.length > 0 && (
              <ActionLink
                to={resumeStep !== null
                  ? `/system/${systemId}/thread?step=${resumeStep.index + 1}`
                  : `/system/${systemId}/thread`}
                variant="ghost"
                label={resumeStep !== null ? t(language, 'resumeThread') : t(language, 'viewThread')}
              >
                {resumeStep !== null ? t(language, 'resumeThread') : t(language, 'viewThread')}
              </ActionLink>
            )}
          </>
        }
      />

      {/* Collection statistics: quietly factual, never dominant. */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-tamas-deep bg-tamas-deep sm:grid-cols-4">
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'versesLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{verses.length}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'conceptsLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{concepts.length}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'languagesLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">{langBadge || '—'}</dd>
        </div>
        <div className="bg-avyakta-2 px-4 py-3">
          <dt className="t-eyebrow text-tamas">{t(language, 'threadLabel')}</dt>
          <dd className="mt-1 font-serif text-2xl font-bold tabular-nums text-sattva">
            {threadSteps.length > 0 ? threadSteps.length : '—'}
          </dd>
        </div>
      </dl>

      <SourceInfo provenance={manifest.source} editorial={undefined} />
      <TextSourceSection textId={textId} />

      {/* Chapter / section quick-jump — one pill per verse section.
          Clicking a pill expands that section dropdown and scrolls to it. */}
      {hasVerses && multiSection && (
        <nav aria-label={t(language, 'chaptersLabel')} className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-sattva-dim">
              {t(language, 'chaptersLabel')} • {verses.length} {verseTermPlural}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <button
                onClick={() => setOpenSections(verseSections.map((g) => g.section))}
                className="text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
              >
                {t(language, 'expandAll')}
              </button>
              <span className="text-tamas">•</span>
              <button
                onClick={() => setOpenSections([])}
                className="text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
              >
                {t(language, 'collapseAll')}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {verseSections.map((g) => {
              const active = openSections.includes(g.section);
              return (
                <button
                  key={g.section || 'unsectioned'}
                  onClick={() => jumpToSection(g.section)}
                  aria-expanded={openSections.includes(g.section)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors motion-reduce:transition-none ${
                    active
                      ? 'text-avyakta border-transparent'
                      : 'bg-avyakta-3 text-sattva-dim border-tamas-deep hover:text-sattva hover:border-tamas'
                  }`}
                  style={active ? { backgroundColor: accent.primary } : undefined}
                >
                  {g.section || t(language, 'showAllSections')}
                  <span className="ml-1.5 text-xs opacity-80 tabular-nums">({g.verses.length})</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Sections as dropdowns — each expands to its clickable units. */}
      {hasVerses && (
        <section aria-label={t(language, 'chaptersLabel')} className="space-y-3">
          {verseSections.map((g, idx) => {
            const expanded = openSections.includes(g.section);
            // Index-based panel id: section names carry spaces and
            // diacritics, so they cannot serve as id fragments directly.
            // Mirrors the CollapsibleSection button/panel pairing.
            const panelId = `verses-panel-${idx}`;
            return (
              <div
                key={g.section || 'unsectioned'}
                id={`section-${g.section || 'unsectioned'}`}
                className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden scroll-mt-20"
              >
                <button
                  onClick={() => toggleSection(g.section)}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors motion-reduce:transition-none"
                >
                  <CountBadge accentPrimary={accent.primary}>{g.verses.length}</CountBadge>
                  <span className="flex-1 min-w-0">
                    <span className="block text-lg font-serif font-bold text-sattva truncate" title={g.section || undefined}>
                      {sectionTitle(g.section, g.verses.length)}
                    </span>
                    <span className="block text-sm text-sattva-dim mt-0.5 tabular-nums">
                      {g.range ? `${verseTermSingular} ${g.range} · ` : ''}{g.verses.length} {verseTermPlural}
                    </span>
                  </span>
                  <DisclosureChevron open={expanded} />
                </button>

                {expanded && (
                  <div id={panelId} className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
                    {g.verses.map((verse) => {
                      const active = verse.content[language] ?? verse.content.en;
                      const preview =
                        verse.devanagari?.split('\n')[0] ||
                        verse.iast?.split('\n')[0] ||
                        active?.translation?.split('\n')[0] ||
                        '';
                      return (
                        <Link
                          key={verse.id}
                          to={`/system/${systemId}/text/${textId}/verse/${verse.id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-avyakta-3 transition-colors motion-reduce:transition-none group"
                        >
                          <CountBadge accentPrimary={accent.primary} variant="numeral">
                            {verse.number}
                          </CountBadge>
                          <span className="flex-1 min-w-0">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-tamas">
                              {verseTermSingular} {verse.number}
                            </span>
                            {preview && (
                              <span className="block text-sm text-sattva truncate mt-0.5" title={preview}>
                                {preview}
                              </span>
                            )}
                          </span>
                          <RowChevron />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Thread steps dropdown */}
      {threadSteps.length > 0 && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
          <button
            onClick={() => togglePanel('thread')}
            aria-expanded={openPanel === 'thread'}
            aria-controls="thread-panel"
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors motion-reduce:transition-none"
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: accentTint(accent.primary), color: accent.primary }}
            >
              <MapIcon aria-hidden="true" className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-lg font-serif font-bold text-sattva">
                {t(language, 'coreThread')}
                <span className="ml-2 text-sm font-sans font-medium text-sattva-dim">({threadSteps.length})</span>
              </span>
              <span className="block text-sm text-sattva-dim mt-0.5">{t(language, 'threadFunction')}</span>
            </span>
            <DisclosureChevron open={openPanel === 'thread'} />
          </button>

          {openPanel === 'thread' && (
            <div id="thread-panel" className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
              {resumeStep !== null && (
                <Link
                  key="resume-thread"
                  to={`/system/${systemId}/thread?step=${resumeStep.index + 1}`}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors motion-reduce:transition-none group"
                  style={{ backgroundColor: accentTint(accent.primary) }}
                >
                  <CountBadge accentPrimary={accent.primary} variant="tile">
                    {resumeStep.index + 1}
                  </CountBadge>
                  <span className="text-sm font-semibold text-sattva truncate flex-1">
                    {t(language, 'resumeThread')} · {t(language, 'stepOf', { current: resumeStep.index + 1, total: resumeStep.total })}: {resumeStep.title}
                  </span>
                  <RowChevron />
                </Link>
              )}
              {threadSteps.map(({ step, globalIndex }) => {
                const content = step.content[language] ?? step.content.en;
                return (
                  <Link
                    key={step.id}
                    to={`/system/${systemId}/thread?step=${globalIndex + 1}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-avyakta-3 transition-colors motion-reduce:transition-none group"
                  >
                    <CountBadge accentPrimary={accent.primary} variant="tile">
                      {globalIndex + 1}
                    </CountBadge>
                    <span className="text-sm text-sattva truncate flex-1">
                      {content?.title || step.id}
                    </span>
                    <RowChevron />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Concepts with link counts */}
      {hasConcepts && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
          <button
            onClick={() => togglePanel('concepts')}
            aria-expanded={openPanel === 'concepts'}
            aria-controls="concepts-panel"
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors motion-reduce:transition-none"
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: accentTint(accent.primary), color: accent.primary }}
            >
              <Sparkles aria-hidden="true" className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-lg font-serif font-bold text-sattva">
                {t(language, 'conceptsLabel')} ({concepts.length})
              </span>
              <span className="block text-sm text-sattva-dim mt-0.5">{t(language, 'conceptsFunction')}</span>
            </span>
            <DisclosureChevron open={openPanel === 'concepts'} />
          </button>

          {openPanel === 'concepts' && (
            <div id="concepts-panel" className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
              {concepts.map((concept) => {
                const localized = concept.content[language] ?? concept.content.en;
                const linked = concept.relatedVerseIds?.length || 0;
                return (
                  <Link
                    key={concept.id}
                    to={`/system/${systemId}/text/${textId}/concept/${concept.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl hover:bg-avyakta-3 transition-colors motion-reduce:transition-none group"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-sattva truncate">
                        {localized?.title || concept.id}
                      </span>
                      {linked > 0 && (
                        <span className="block text-xs text-tamas tabular-nums">
                          {t(language, 'linkedVerses', { count: linked, term: verseTermPlural })}
                        </span>
                      )}
                    </span>
                    <RowChevron />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Related study: sibling texts in the same tradition. */}
      {siblingTexts.length > 0 && (
        <section aria-label={t(language, 'otherTexts')} className="space-y-3">
          <SectionHeader title={t(language, 'otherTexts')} />
          {siblingTexts.map((text) => (
            <Link
              key={text.textId}
              to={`/system/${systemId}/text/${text.textId}`}
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
                <span className="mt-0.5 block truncate text-sm tabular-nums text-sattva-dim">
                  {text.unitCount} {getVerseTermForSummary(text, text.unitCount).toLowerCase()} · {text.conceptCount} {t(language, 'conceptsLabel').toLowerCase()}
                </span>
              </span>
              <RowChevron />
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
