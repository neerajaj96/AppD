import { useParams, Link } from 'react-router';
import { useMemo } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';
import { getTraditionDisplay, getVerseTermForSummary } from '../content/v2/catalog';
import { useCatalog } from '../content/v2/hooks';
import type { GlobalManifest, TextSummary } from '../content/v2/chunks';
import type { AsyncState } from '../content/v2/hooks';
import { RowChevron, Eyebrow, accentTint } from './Primitives';
import { getThreadProgress } from '../utils/threadProgress';

// System page: header plus the plain list of texts (subsystems).
// The Verses / Thread / Concepts dropdowns live one level down, on each
// text's own page (TextIndex). Data comes from the global manifest only.
export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const catalog = useCatalog();

  const tradition = catalog.status === 'ok'
    ? catalog.data.traditions.find((t) => t.id === systemId)
    : undefined;
  const texts = useMemoTexts(catalog, systemId);

  if (catalog.status === 'loading') {
    return <div className="py-16 text-center text-tamas text-sm animate-pulse">{t(language, 'loading')}</div>;
  }

  if (catalog.status !== 'ok' || !tradition) {
    return (
      <div className="text-center py-12">
        {catalog.status === 'offline' ? t(language, 'offlineNotice') : t(language, 'systemNotFound')}
      </div>
    );
  }

  const accent = getSystemAccent(tradition.id);
  const display = getTraditionDisplay(tradition, language);
  const totalSteps = tradition.threadSteps;

  // Thread doorway: param-less entry lets ThreadView restore the furthest
  // visited step (UX-008), so this one row serves both Start and Resume.
  const storedStep = getThreadProgress(tradition.id);
  const resumeStep =
    storedStep !== null && storedStep > 0 && storedStep < totalSteps
      ? storedStep
      : null;

  return (
    <div className="space-y-4 animate-fade-in pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div className="py-6 border-b border-tamas-deep">
        <Eyebrow accentPrimary={accent.primary} className="mb-3">
          {tradition.id.toUpperCase()} DARŚANA
        </Eyebrow>
        <h1 className="text-4xl font-serif font-bold text-sattva mb-2">{display.title}</h1>
        <p className="text-xl text-sattva-dim">{display.subtitle}</p>
      </div>

      {/* Thread doorway — guided narrative without detouring via a text page. */}
      {totalSteps > 0 && (
        <section className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
          <Link
            to={`/system/${tradition.id}/thread`}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-avyakta transition-colors motion-reduce:transition-none group"
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
                <span className="ml-2 text-sm font-sans font-medium text-sattva-dim">({totalSteps})</span>
              </span>
              <span className="block text-sm text-sattva-dim mt-0.5 truncate">
                {resumeStep !== null
                  ? `${t(language, 'resumeThread')} · ${t(language, 'stepOf', { current: resumeStep + 1, total: totalSteps })}`
                  : t(language, 'threadFunction')}
              </span>
            </span>
            <RowChevron />
          </Link>
        </section>
      )}

      {/* Texts (subsystems) */}
      <div className="bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xl font-serif font-bold text-sattva">{t(language, 'textsLabel')}</h2>
        </div>
        <div className="px-3 pb-3 space-y-1">
          {texts.map((text) => (
            <Link
              key={text.textId}
              to={`/system/${tradition.id}/text/${text.textId}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-avyakta-3 transition-colors motion-reduce:transition-none group"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-sattva truncate">{text.transliteratedTitle}</span>
                <span className="block text-xs text-sattva-dim truncate">
                  {text.author}
                  {text.unitCount > 0 && (
                    <> • {text.unitCount} {getVerseTermForSummary(text, text.unitCount).toLowerCase()}</>
                  )}
                  {text.conceptCount > 0 && (
                    <> • {text.conceptCount} {t(language, 'conceptsLabel').toLowerCase()}</>
                  )}
                </span>
              </span>
              <RowChevron />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function useMemoTexts(catalog: AsyncState<GlobalManifest>, systemId: string | undefined): TextSummary[] {
  return useMemo(() => {
    if (catalog.status !== 'ok' || !systemId) return [];
    return catalog.data.texts.filter((t) => t.traditionId === systemId);
  }, [catalog, systemId]);
}
