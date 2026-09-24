import { useEffect, useMemo, useState } from 'react';
import { layoutGraph, type ConceptGraphData } from '../../content/v2/conceptGraph';
import { t } from '../../i18n/ui';
import { useLanguage } from '../../context/LanguageContext';
import ConceptGraphViewport from './ConceptGraphViewport';
import ConceptGraphNarrowList from './ConceptGraphNarrowList';
import ConceptGraphSelection from './ConceptGraphSelection';
import ConceptGraphLegend from './ConceptGraphLegend';

/**
 * Interactive relationship explorer: owns selection state and composes
 * the wide SVG viewport, the narrow vertical presentation, the legend
 * and the selection detail into one figure.
 *
 * Responsive contract: viewports 640px and up get the radial map;
 * narrower screens get the full-width tappable list over the same data
 * and the same detail panel — never a shrunken diagram. Selection
 * resets whenever the underlying concept changes.
 */
export default function ConceptExplorer({
  data,
  contextName,
  caption,
}: {
  data: ConceptGraphData;
  /** Source text title used in the linkage sentence. */
  contextName: string;
  caption: string;
}) {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [data.center.id]);

  const layout = useMemo(() => layoutGraph(data), [data]);
  const selected = data.satellites.find((node) => node.id === selectedId) || null;
  const hiddenTotal = data.hiddenRelated + data.hiddenTraditions;

  return (
    <figure className="min-w-0 space-y-3">
      {/* Wide: radial map. Narrow: vertical tappable list. Same data,
          same selection, same detail panel. */}
      <div className="hidden sm:block">
        <ConceptGraphViewport
          layout={layout}
          caption={caption}
          centerLabel={data.center.label}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
      <div className="sm:hidden">
        <ConceptGraphNarrowList nodes={data.satellites} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
      <ConceptGraphLegend />
      {selected && (
        <ConceptGraphSelection
          node={selected}
          contextName={contextName}
          onClear={() => setSelectedId(null)}
        />
      )}
      <figcaption className="text-xs text-tamas">
        {caption}
        {hiddenTotal > 0 && (
          <>
            {' '}
            {t(language, 'graphMore', {
              shown: data.satellites.length,
              total: data.satellites.length + hiddenTotal,
            })}
          </>
        )}
      </figcaption>
    </figure>
  );
}
