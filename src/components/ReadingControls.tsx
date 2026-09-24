import { useReading } from '../context/ReadingContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';

/**
 * Reading controls for the study screens: text-size segmented control
 * plus, on the verse reader, layer toggles for the Sanskrit source,
 * translation and commentary. Every control is a labelled button with
 * aria-pressed state; preferences persist through ReadingContext without
 * touching routing or study state.
 */
export default function ReadingControls({ showLayers = false }: { showLayers?: boolean }) {
  const { language } = useLanguage();
  const { scale, maxScale, decrease, increase, display, toggleDisplay } = useReading();
  const btn =
    'flex items-center justify-center min-h-9 min-w-9 rounded-lg bg-avyakta-3 hover:bg-avyakta-4 text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none disabled:opacity-40 disabled:pointer-events-none';
  const layer = (active: boolean) =>
    `px-2.5 min-h-9 rounded-lg text-xs font-semibold transition-colors motion-reduce:transition-none ${
      active ? 'bg-avyakta-4 text-sattva shadow-xs' : 'bg-avyakta-3 text-sattva-dim hover:text-sattva'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 shrink-0">
      <div className="flex items-center gap-1" role="group" aria-label={t(language, 'textSizeIncrease')}>
        <button
          type="button"
          onClick={decrease}
          disabled={scale === 0}
          title={t(language, 'textSizeDecrease')}
          aria-label={t(language, 'textSizeDecrease')}
          className={btn}
        >
          <span aria-hidden="true" className="text-xs font-bold">
            A−
          </span>
        </button>
        <button
          type="button"
          onClick={increase}
          disabled={scale === maxScale}
          title={t(language, 'textSizeIncrease')}
          aria-label={t(language, 'textSizeIncrease')}
          className={btn}
        >
          <span aria-hidden="true" className="text-xs font-bold">
            A+
          </span>
        </button>
      </div>
      {showLayers && (
        <div className="flex items-center gap-1" role="group">
          <button
            type="button"
            onClick={() => toggleDisplay('showSanskrit')}
            aria-pressed={display.showSanskrit}
            title={t(language, 'sanskritToggle')}
            className={layer(display.showSanskrit)}
          >
            {t(language, 'sanskritToggle')}
          </button>
          <button
            type="button"
            onClick={() => toggleDisplay('showTranslation')}
            aria-pressed={display.showTranslation}
            title={t(language, 'translationLabel')}
            className={layer(display.showTranslation)}
          >
            {t(language, 'translationLabel')}
          </button>
          <button
            type="button"
            onClick={() => toggleDisplay('showCommentary')}
            aria-pressed={display.showCommentary}
            title={t(language, 'commentaryLabel')}
            className={layer(display.showCommentary)}
          >
            {t(language, 'commentaryLabel')}
          </button>
        </div>
      )}
    </div>
  );
}
