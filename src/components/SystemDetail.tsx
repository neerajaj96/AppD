import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { getSystem } from '../content';
import { BookOpen, Map as MapIcon, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';
import { getVerseTerm } from '../utils/textTerminology';

type Section = 'texts' | 'thread' | 'concepts' | null;

export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const [open, setOpen] = useState<Section>(null);

  if (!system) {
    return <div className="text-center py-12">{t(language, 'systemNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const display = getSystemDisplay(system, language);
  const totalConcepts = system.texts.reduce((n, tx) => n + tx.concepts.length, 0);
  const toggle = (s: Exclude<Section, null>) => setOpen(( cur) => (cur === s ? null : s));

  const sections = [
    {
      key: 'texts' as const,
      icon: <BookOpen className="w-5 h-5" />,
      title: t(language, 'primaryTexts'),
      desc: t(language, 'textsFunction'),
      count: system.texts.length,
    },
    ...(system.thread && system.thread.length > 0
      ? [
          {
            key: 'thread' as const,
            icon: <MapIcon className="w-5 h-5" />,
            title: t(language, 'coreThread'),
            desc: t(language, 'threadFunction'),
            count: system.thread.length,
          },
        ]
      : []),
    ...(totalConcepts > 0
      ? [
          {
            key: 'concepts' as const,
            icon: <Sparkles className="w-5 h-5" />,
            title: t(language, 'foundationalConcepts', { count: totalConcepts }),
            desc: t(language, 'conceptsFunction'),
            count: totalConcepts,
          },
        ]
      : []),
  ];

  const iconBox = 'flex items-center justify-center w-10 h-10 rounded-xl shrink-0';

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="py-6 border-b border-tamas-deep">
        <div
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
        >
          {system.id.toUpperCase()} DARŚANA
        </div>
        <h1 className="text-4xl font-serif font-bold text-sattva mb-2">{display.title}</h1>
        <p className="text-xl text-sattva-dim">{display.subtitle}</p>
      </div>

      {sections.map((s) => {
        const isOpen = open === s.key;
        return (
          <section key={s.key} className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
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

            {isOpen && s.key === 'texts' && (
              <div className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
                {system.texts.map((text) => (
                  <Link
                    key={text.id}
                    to={`/system/${system.id}/text/${text.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-avyakta-3 transition-colors group"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-sattva truncate">{text.transliteratedTitle}</span>
                      <span className="block text-xs text-sattva-dim truncate">
                        {t(language, 'authorLabel')}: {text.author}
                        {text.verses.length > 0 && (
                          <> • {text.verses.length} {getVerseTerm(text, text.verses.length).toLowerCase()}</>
                        )}
                        {text.concepts.length > 0 && (
                          <> • {text.concepts.length} {t(language, 'conceptsLabel').toLowerCase()}</>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-tamas shrink-0 group-hover:text-sattva transition-colors" />
                  </Link>
                ))}
              </div>
            )}

            {isOpen && s.key === 'thread' && system.thread && (
              <div className="px-3 pb-3 space-y-1 border-t border-tamas-deep pt-3">
                {system.thread.map((step, idx) => {
                  const content = step.content[language] ?? step.content.en;
                  return (
                    <Link
                      key={step.id}
                      to={`/system/${system.id}/thread?step=${idx + 1}`}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-avyakta-3 transition-colors group"
                    >
                      <span
                        className="text-xs font-bold tabular-nums w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
                        style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
                      >
                        {idx + 1}
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
              <div className="px-3 pb-3 space-y-4 border-t border-tamas-deep pt-3">
                {system.texts.map(
                  (text) =>
                    text.concepts.length > 0 && (
                      <div key={text.id}>
                        {system.texts.length > 1 && (
                          <div className="text-xs font-semibold uppercase tracking-wider text-sattva-dim px-4 mb-1">
                            {text.transliteratedTitle}
                          </div>
                        )}
                        <div className="space-y-1">
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
                      </div>
                    )
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
