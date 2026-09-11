import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getText, getSystem } from '../content';
import { Map as MapIcon, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';

type Panel = 'thread' | 'concepts' | null;

// Text (subsystem) page: chapters/sections are the dropdowns. Each
// section button expands to the list of ślokas it contains, and each
// śloka is a clickable row that opens its in-depth verse page.
// There is no separate top-level "Verses" section — the sections
// themselves ARE the navigation. Thread + Concepts remain as
// dropdowns below the section list.
export default function TextIndex() {
  const { systemId, textId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const text = getText(systemId || '', textId || '');
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  // Which text sections (chapters) are expanded. First one opens by
  // default; reset whenever the user navigates to a different text.
  const [openSections, setOpenSections] = useState<string[]>([]);

  const threadSteps = useMemo(() => {
    if (!system || !text) return [] as { step: (typeof system.thread)[number]; globalIndex: number }[];
    return system.thread
      .map((step, globalIndex) => ({ step, globalIndex }))
      .filter(({ step }) => (step.textId || system.texts[0]?.id) === text.id);
  }, [system, text]);

  const verseSections = useMemo(() => {
    const verses = text?.verses ?? [];
    const seen: string[] = [];
    verses.forEach((v) => {
      const s = v.section || '';
      if (!seen.includes(s)) seen.push(s);
    });
    return seen.map((s) => ({
      section: s,
      verses: verses.filter((v) => (v.section || '') === s),
    }));
  }, [text]);

  const multiSection = verseSections.length > 1;

  // Open the first section by default so users see where the ślokas live.
  useEffect(() => {
    if (verseSections.length > 0) {
      setOpenSections([verseSections[0].section]);
    } else {
      setOpenSections([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text?.id]);

  if (!system || !text) {
    return <div className="text-center py-12">{t(language, 'textNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const systemDisplay = getSystemDisplay(system, language);
  const hasVerses = text.verses.length > 0;
  const hasConcepts = text.concepts.length > 0;
  const togglePanel = (p: Exclude<Panel, null>) => setOpenPanel((cur) => (cur === p ? null : p));

  const verseTermPlural = getVerseTerm(text, 2).toLowerCase();
  const verseTermSingular = getVerseTerm(text, 1);

  const toggleSection = (section: string) =>
    setOpenSections((cur) =>
      cur.includes(section) ? cur.filter((s) => s !== section) : [...cur, section],
    );

  const jumpToSection = (section: string) => {
    setOpenSections((cur) => (cur.includes(section) ? cur : [...cur, section]));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(`section-${section || 'unsectioned'}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const sectionTitle = (section: string, count: number) => {
    if (section) return section;
    // Single-section / unsectioned texts: label the one dropdown.
    return `${getVerseTerm(text, count)} (${count})`;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-3xl mx-auto pb-16">
      <div className="flex items-center text-sm text-sattva-dim mb-2 space-x-2">
        <Link to={`/system/${system.id}`} className="hover:text-rajas transition-colors">
          {systemDisplay?.title ?? system.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-sattva">{text.transliteratedTitle}</span>
      </div>

      <div className="py-4 border-b border-tamas-deep">
        <h1 className="text-3xl font-serif font-bold text-sattva mb-2">
          {text.transliteratedTitle}
        </h1>
        <p className="text-sattva-dim">
          {text.author ? `${t(language, 'authorLabel')}: ${text.author}` : ''}
        </p>
      </div>

      {/* Chapter / section quick-jump — one pill per verse section.
          Clicking a pill expands that section dropdown and scrolls to it. */}
      {hasVerses && multiSection && (
        <nav aria-label={t(language, 'chaptersLabel')} className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-sattva-dim">
              {t(language, 'chaptersLabel')} • {text.verses.length} {verseTermPlural}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <button
                onClick={() => setOpenSections(verseSections.map((g) => g.section))}
                className="text-sattva-dim hover:text-sattva transition-colors"
              >
                {t(language, 'expandAll')}
              </button>
              <span className="text-tamas">•</span>
              <button
                onClick={() => setOpenSections([])}
                className="text-sattva-dim hover:text-sattva transition-colors"
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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

      {/* Sections as dropdowns — each expands to its clickable ślokas. */}
      {hasVerses && (
        <div className="space-y-3">
          {verseSections.map((g) => {
            const expanded = openSections.includes(g.section);
            return (
              <div
                key={g.section || 'unsectioned'}
                id={`section-${g.section || 'unsectioned'}`}
                className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden scroll-mt-20"
              >
                <button
                  onClick={() => toggleSection(g.section)}
                  aria-expanded={expanded}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors"
                >
                  <span
                    className="text-xs font-bold tabular-nums px-2.5 py-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
                  >
                    {g.verses.length}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-lg font-serif font-bold text-sattva truncate" title={g.section || undefined}>
                      {sectionTitle(g.section, g.verses.length)}
                    </span>
                    <span className="block text-sm text-sattva-dim mt-0.5">
                      {g.verses.length} {verseTermPlural} — {t(language, 'versesFunction')}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-tamas shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
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
                          to={`/system/${system.id}/text/${text.id}/verse/${verse.id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-avyakta-3 transition-colors group"
                        >
                          <span
                            className="text-xs font-bold tabular-nums min-w-10 px-2 py-1.5 flex items-center justify-center rounded-lg shrink-0"
                            style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
                          >
                            {verse.number}
                          </span>
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
                          <ChevronRight className="w-4 h-4 text-tamas shrink-0 group-hover:text-sattva transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Thread steps dropdown */}
      {threadSteps.length > 0 && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
          <button
            onClick={() => togglePanel('thread')}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors"
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
            >
              <MapIcon className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-lg font-serif font-bold text-sattva">
                {t(language, 'coreThread')}
                <span className="ml-2 text-sm font-sans font-medium text-sattva-dim">({threadSteps.length})</span>
              </span>
              <span className="block text-sm text-sattva-dim mt-0.5">{t(language, 'threadFunction')}</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-tamas shrink-0 transition-transform ${openPanel === 'thread' ? 'rotate-180' : ''}`}
            />
          </button>

          {openPanel === 'thread' && (
            <div className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
              {threadSteps.map(({ step, globalIndex }) => {
                const content = step.content[language] ?? step.content.en;
                return (
                  <Link
                    key={step.id}
                    to={`/system/${system.id}/thread?step=${globalIndex + 1}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-avyakta-3 transition-colors group"
                  >
                    <span
                      className="text-xs font-bold tabular-nums w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                      style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
                    >
                      {globalIndex + 1}
                    </span>
                    <span className="text-sm text-sattva truncate flex-1">
                      {content?.title || step.id}
                    </span>
                    <ChevronRight className="w-4 h-4 text-tamas shrink-0 group-hover:text-sattva transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Concepts dropdown */}
      {hasConcepts && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
          <button
            onClick={() => togglePanel('concepts')}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors"
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
            >
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-lg font-serif font-bold text-sattva">
                {t(language, 'conceptsLabel')} ({text.concepts.length})
              </span>
              <span className="block text-sm text-sattva-dim mt-0.5">{t(language, 'conceptsFunction')}</span>
            </span>
            <ChevronDown
              className={`w-5 h-5 text-tamas shrink-0 transition-transform ${openPanel === 'concepts' ? 'rotate-180' : ''}`}
            />
          </button>

          {openPanel === 'concepts' && (
            <div className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
              {text.concepts.map((concept) => {
                const localized = concept.content[language] ?? concept.content.en;
                return (
                  <Link
                    key={concept.id}
                    to={`/system/${system.id}/text/${text.id}/concept/${concept.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl hover:bg-avyakta-3 transition-colors group"
                  >
                    <span className="text-sm text-sattva truncate">
                      {localized?.title || concept.id}
                    </span>
                    <ChevronRight className="w-4 h-4 text-tamas shrink-0 group-hover:text-sattva transition-colors" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

