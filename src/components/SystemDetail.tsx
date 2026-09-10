import { useParams, Link } from 'react-router';
import { getSystem } from '../content';
import { BookOpen, Map as MapIcon, Sparkles, ChevronRight } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';
import { getVerseTerm } from '../utils/textTerminology';

export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');

  if (!system) {
    return <div className="text-center py-12">{t(language, 'systemNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const display = getSystemDisplay(system, language);
  const totalConcepts = system.texts.reduce((n, tx) => n + tx.concepts.length, 0);

  const iconBox = 'flex items-center justify-center w-10 h-10 rounded-xl shrink-0';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16 max-w-3xl mx-auto">
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

      {/* Option 1 — Texts */}
      <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-6 shadow-xs">
        <div className="flex items-start gap-4 mb-5">
          <span className={iconBox} style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}>
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-serif font-bold text-sattva">{t(language, 'primaryTexts')}</h2>
            <p className="text-sm text-sattva-dim mt-1">{t(language, 'textsFunction')}</p>
          </div>
        </div>
        <div className="space-y-2">
          {system.texts.map((text) => (
            <Link
              key={text.id}
              to={`/system/${system.id}/text/${text.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-avyakta hover:bg-avyakta-3 border border-transparent hover:border-tamas-deep transition-colors group"
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
      </section>

      {/* Option 2 — Thread */}
      {system.thread && system.thread.length > 0 && (
        <Link
          to={`/system/${system.id}/thread`}
          className="block bg-avyakta-2 rounded-2xl border border-tamas-deep p-6 shadow-xs hover:border-tamas transition-colors group"
        >
          <div className="flex items-start gap-4">
            <span className={iconBox} style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}>
              <MapIcon className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-serif font-bold text-sattva">{t(language, 'coreThread')}</h2>
              <p className="text-sm text-sattva-dim mt-1">{t(language, 'threadFunction')}</p>
              <span className="inline-flex items-center mt-3 text-sm font-semibold" style={{ color: accent.primary }}>
                {t(language, 'startThread', { count: system.thread.length })}
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* Option 3 — Concepts */}
      {totalConcepts > 0 && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep p-6 shadow-xs">
          <div className="flex items-start gap-4 mb-5">
            <span className={iconBox} style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}>
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-sattva">
                {t(language, 'foundationalConcepts', { count: totalConcepts })}
              </h2>
              <p className="text-sm text-sattva-dim mt-1">{t(language, 'conceptsFunction')}</p>
            </div>
          </div>
          <div className="space-y-5">
            {system.texts.map((text) => (
              text.concepts.length > 0 && (
                <div key={text.id}>
                  {system.texts.length > 1 && (
                    <div className="text-xs font-semibold uppercase tracking-wider text-sattva-dim mb-2">
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
