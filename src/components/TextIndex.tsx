import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { getText, getSystem } from '../content';
import { BookOpen, Map as MapIcon, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import Markdown from 'react-markdown';
import RichText from './RichText';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';

type Section = 'verses' | 'thread' | 'concepts' | null;

// Text (subsystem) page: header plus three dropdown buttons —
// Verses, Thread steps of this text, Concepts. All collapsed by
// default; rows show titles only, no lengthy details.
export default function TextIndex() {
  const { systemId, textId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const text = getText(systemId || '', textId || '');
  // Verses open by default so each section shows its ślokas inline —
  // no redirect to a separate verse page to read the content.
  const [open, setOpen] = useState<Section>('verses');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const threadSteps = useMemo(() => {
    if (!system || !text) return [] as { step: (typeof system.thread)[number]; globalIndex: number }[];
    return system.thread
      .map((step, globalIndex) => ({ step, globalIndex }))
      .filter(({ step }) => (step.textId || system.texts[0]?.id) === text.id);
  }, [system, text]);

  if (!system || !text) {
    return <div className="text-center py-12">{t(language, 'textNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const systemDisplay = getSystemDisplay(system, language);
  const hasVerses = text.verses.length > 0;
  const hasConcepts = text.concepts.length > 0;
  const toggle = (s: Exclude<Section, null>) => setOpen((cur) => (cur === s ? null : s));

  const verseTermPlural = getVerseTerm(text, 2).toLowerCase();
  const verseTermSingular = getVerseTerm(text, 1);
  const iconBox = 'flex items-center justify-center w-10 h-10 rounded-xl shrink-0';

  const sections = [
    ...(hasVerses
      ? [
          {
            key: 'verses' as const,
            icon: <BookOpen className="w-5 h-5" />,
            title: `${getVerseTerm(text, text.verses.length)} (${text.verses.length})`,
            desc: t(language, 'versesFunction'),
            count: text.verses.length,
          },
        ]
      : []),
    ...(threadSteps.length > 0
      ? [
          {
            key: 'thread' as const,
            icon: <MapIcon className="w-5 h-5" />,
            title: t(language, 'coreThread'),
            desc: t(language, 'threadFunction'),
            count: threadSteps.length,
          },
        ]
      : []),
    ...(hasConcepts
      ? [
          {
            key: 'concepts' as const,
            icon: <Sparkles className="w-5 h-5" />,
            title: `${t(language, 'conceptsLabel')} (${text.concepts.length})`,
            desc: t(language, 'conceptsFunction'),
            count: text.concepts.length,
          },
        ]
      : []),
  ];

  const verseSections = useMemo(() => {
    const seen: string[] = [];
    text.verses.forEach((v) => {
      const s = v.section || '';
      if (!seen.includes(s)) seen.push(s);
    });
    return seen.map((s) => ({
      section: s,
      verses: text.verses.filter((v) => (v.section || '') === s),
    }));
  }, [text]);

  const multiSection = verseSections.length > 1;
  const visibleSections = selectedSection == null
    ? verseSections
    : verseSections.filter((g) => g.section === selectedSection);

  const jumpToSection = (section: string | null) => {
    setSelectedSection(section);
    setOpen('verses');
    // Let the verses panel expand first, then bring it into view.
    requestAnimationFrame(() => {
      document.getElementById('verses-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

      {/* Chapter / section jump buttons — one clickable button per
          verse section (Adhyāya/Pāda, Pāda, Parikṣā, ...). Visible as soon
          as the text has more than one section. */}
      {hasVerses && multiSection && (
        <nav aria-label={t(language, 'chaptersLabel')} className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-sattva-dim mb-2.5">
            {t(language, 'chaptersLabel')} • {text.verses.length} {verseTermPlural}
          </div>
          <div className="flex flex-wrap gap-2">
            {verseSections.map((g) => {
              const active = selectedSection === g.section && open === 'verses';
              return (
                <button
                  key={g.section || 'unsectioned'}
                  onClick={() => jumpToSection(g.section)}
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

      {sections.map((s) => {
        const isOpen = open === s.key;
        return (
          <section key={s.key} id={s.key === 'verses' ? 'verses-panel' : undefined} className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden scroll-mt-20">
            <button
              onClick={() => toggle(s.key)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors"
            >
              <span className={iconBox} style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}>
                {s.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-lg font-serif font-bold text-sattva">
                  {s.title}
                  <span className="ml-2 text-sm font-sans font-medium text-sattva-dim">({s.count})</span>
                </span>
                <span className="block text-sm text-sattva-dim mt-0.5">{s.desc}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-tamas shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && s.key === 'verses' && (
              <div className="px-3 pb-3 space-y-4 border-t border-tamas-deep pt-3">
                {multiSection && (
                  <div className="flex flex-wrap gap-2 px-1 pt-1" role="tablist" aria-label={t(language, 'browseBySection')}>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        selectedSection == null
                          ? 'text-avyakta border-transparent'
                          : 'bg-avyakta-3 text-sattva-dim border-tamas-deep hover:text-sattva'
                      }`}
                      style={selectedSection == null ? { backgroundColor: accent.primary } : undefined}
                    >
                      {t(language, 'showAllSections')} ({text.verses.length})
                    </button>
                    {verseSections.map((g) => {
                      const active = selectedSection === g.section;
                      return (
                        <button
                          key={g.section || 'unsectioned'}
                          onClick={() => setSelectedSection(g.section)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors max-w-full truncate ${
                            active
                              ? 'text-avyakta border-transparent'
                              : 'bg-avyakta-3 text-sattva-dim border-tamas-deep hover:text-sattva'
                          }`}
                          style={active ? { backgroundColor: accent.primary } : undefined}
                          title={g.section}
                        >
                          {g.section} ({g.verses.length})
                        </button>
                      );
                    })}
                  </div>
                )}
                {visibleSections.map((g) => (
                  <div key={g.section || 'unsectioned'}>
                    {g.section && verseSections.length > 1 && (
                      <div className="sticky top-16 z-[5] bg-avyakta-2/95 backdrop-blur-sm text-sm font-serif font-bold text-sattva px-4 py-2.5 mb-2 border-b border-tamas-deep truncate">
                        {g.section}
                      </div>
                    )}
                    <div className="space-y-3">
                      {g.verses.map((verse) => {
                        const active = verse.content[language] ?? verse.content.en;
                        const fallback = verse.content.en;
                        const translation = active?.translation || fallback?.translation;
                        const commentary = active?.commentary || fallback?.commentary;
                        const keyPoints =
                          active?.keyPoints && active.keyPoints.length > 0
                            ? active.keyPoints
                            : fallback?.keyPoints;
                        return (
                          <article
                            key={verse.id}
                            id={`verse-${verse.id}`}
                            className="bg-avyakta-3 rounded-xl border border-tamas-deep px-5 py-5 space-y-4 scroll-mt-32"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h4 className="text-sm font-bold text-tamas uppercase tracking-widest">
                                {verseTermSingular} {verse.number}
                              </h4>
                              <Link
                                to={`/system/${system.id}/text/${text.id}/verse/${verse.id}`}
                                className="text-xs text-sattva-dim hover:text-rajas transition-colors shrink-0"
                                title="Open full page"
                              >
                                ⧉
                              </Link>
                            </div>

                            {verse.devanagari && (
                              <div className="text-2xl text-sattva leading-relaxed font-serif">
                                {verse.devanagari.split('\n').map((line, i) => (
                                  <div key={i}>{line}</div>
                                ))}
                              </div>
                            )}

                            {verse.iast && (
                              <div className="text-lg text-sattva-dim italic leading-relaxed">
                                {verse.iast.split('\n').map((line, i) => (
                                  <div key={i}>{line}</div>
                                ))}
                              </div>
                            )}

                            {translation && (
                              <div className="pt-3 border-t border-tamas-deep">
                                <div className="text-xs font-bold text-tamas uppercase tracking-wider mb-2">
                                  {t(language, 'translationLabel')}
                                </div>
                                <div className="text-base text-sattva leading-relaxed font-serif">
                                  <Markdown>{translation}</Markdown>
                                </div>
                              </div>
                            )}

                            {commentary && (
                              <div className="pt-3 border-t border-tamas-deep">
                                <div className="text-xs font-bold text-tamas uppercase tracking-wider mb-2">
                                  {t(language, 'commentaryLabel')}
                                </div>
                                <div className="text-sm text-sattva leading-relaxed">
                                  <RichText
                                    text={commentary}
                                    systemId={system.id as string}
                                    textId={text.id as string}
                                  />
                                </div>
                              </div>
                            )}

                            {keyPoints && keyPoints.length > 0 && (
                              <div className="pt-3 border-t border-tamas-deep">
                                <div className="text-xs font-bold text-tamas uppercase tracking-wider mb-2">
                                  {t(language, 'keyPoints')}
                                </div>
                                <ul className="space-y-1.5">
                                  {keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex text-sattva items-start text-sm">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rajas mt-1.5 mr-2.5 shrink-0" />
                                      <span className="flex-1">
                                        <RichText
                                          text={point}
                                          systemId={system.id as string}
                                          textId={text.id as string}
                                        />
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isOpen && s.key === 'thread' && (
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

            {isOpen && s.key === 'concepts' && (
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
        );
      })}
    </div>
  );
}
