import type { GraphNode } from '../../content/v2/conceptGraph';
import { t } from '../../i18n/ui';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Narrow-viewport presentation of the same relationship data: a focused
 * vertical list instead of a shrunken radial diagram. Every row meets
 * touch-target size, labels never overlap, and selection drives the same
 * shared detail panel as the wide viewport.
 */
export default function ConceptGraphNarrowList({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: GraphNode[];
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}) {
  const { language } = useLanguage();
  return (
    <ul className="space-y-2">
      {nodes.map((node) => {
        const selected = node.id === selectedId;
        return (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => onSelect(node.id)}
              aria-current={selected ? 'true' : undefined}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors motion-reduce:transition-none ${
                selected
                  ? 'border-sattva-dim bg-avyakta-3'
                  : 'border-tamas-deep bg-avyakta-2 hover:bg-avyakta-3'
              }`}
            >
              <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center">
                {node.kind === 'tradition' ? (
                  <span className="inline-block h-3 w-3 rounded-[3px] border-2 border-purusha" />
                ) : (
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-sattva-dim" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm ${selected ? 'font-semibold text-sattva' : 'text-sattva'}`}>
                  {node.label}
                </span>
                <span className="block text-xs text-tamas">
                  {node.kind === 'tradition'
                    ? t(language, 'graphOccurrence')
                    : t(language, 'graphRelatedConcept')}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
