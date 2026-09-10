import { useParams, Link } from 'react-router';
import { getSystem } from '../content';
import { ChevronRight } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';
import { getVerseTerm } from '../utils/textTerminology';

// System page: header plus the plain list of texts (subsystems).
// The Verses / Thread / Concepts dropdowns live one level down, on each
// text's own page (TextIndex).
export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');

  if (!system) {
    return <div className="text-center py-12">{t(language, 'systemNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const display = getSystemDisplay(system, language);

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

      {/* Texts (subsystems) */}
      <div className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xl font-serif font-bold text-sattva">{t(language, 'textsLabel')}</h2>
        </div>
        <div className="px-3 pb-3 space-y-1">
          {system.texts.map((text) => (
            <Link
              key={text.id}
              to={`/system/${system.id}/text/${text.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-avyakta-3 transition-colors group"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-sattva truncate">{text.transliteratedTitle}</span>
                <span className="block text-xs text-sattva-dim truncate">
                  {text.author}
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
      </div>
    </div>
  );
}
