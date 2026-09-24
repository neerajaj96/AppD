import { Link } from 'react-router';
import { X as ClearIcon } from 'lucide-react';
import type { GraphNode } from '../../content/v2/conceptGraph';
import { t } from '../../i18n/ui';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Selected-relationship detail: the bridge between the visual map and
 * navigation. Names the relationship honestly — linkage for concepts,
 * occurrence (never equivalence) for traditions — and offers one clear
 * onward action plus reset. Screen-reader users meet the same content
 * through the semantic lists below; this panel is a shortcut, not a gate.
 */
export default function ConceptGraphSelection({
  node,
  contextName,
  onClear,
}: {
  node: GraphNode;
  /** Source text title, for the concept-linkage sentence. */
  contextName: string;
  onClear: () => void;
}) {
  const { language } = useLanguage();
  const isTradition = node.kind === 'tradition';
  return (
    <div
      role="status"
      className="rounded-2xl border border-sattva-dim/40 bg-avyakta-2 p-4"
    >
      <p className="t-eyebrow text-tamas">
        {isTradition ? t(language, 'graphOccurrence') : t(language, 'graphRelatedConcept')}
      </p>
      <p className="mt-1 font-serif text-lg font-bold text-sattva">{node.label}</p>
      <p className="mt-1 text-sm leading-relaxed text-sattva-dim">
        {isTradition ? t(language, 'samenameNote') : t(language, 'graphLinkedIn', { text: contextName })}
      </p>
      {node.detail && (
        <p className="mt-1 text-xs tabular-nums text-tamas">{node.detail}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to={node.href}
          className="inline-flex min-h-11 items-center rounded-xl bg-rajas px-5 py-2.5 text-sm font-semibold text-sattva hover:bg-rajas-dim transition-colors motion-reduce:transition-none"
        >
          {isTradition ? t(language, 'graphOpenTradition') : t(language, 'graphOpenConcept')}
        </Link>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-tamas-deep bg-avyakta-3 px-4 py-2.5 text-sm font-medium text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
        >
          <ClearIcon aria-hidden="true" className="h-4 w-4" />
          {t(language, 'graphClear')}
        </button>
      </div>
    </div>
  );
}
