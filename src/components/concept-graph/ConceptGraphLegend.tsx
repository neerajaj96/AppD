import { t } from '../../i18n/ui';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Shape-plus-text legend for the concept map. Meaning never rides on
 * colour alone: circles are concepts, rounded squares are traditions,
 * each named in words and localised (the previous legend hard-coded
 * English).
 */
export default function ConceptGraphLegend() {
  const { language } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tamas">
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border border-sattva-dim" />
        {t(language, 'graphLegendConcept')}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-[2px] border border-purusha" />
        {t(language, 'graphLegendTradition')}
      </span>
    </div>
  );
}
