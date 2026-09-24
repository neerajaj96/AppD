import { Link } from 'react-router';
import type { GraphLayout } from '../../content/v2/conceptGraph';

/**
 * SVG viewport for the concept map — rendering only. Positions arrive
 * from the pure `layoutGraph` transform; scholarly relationships arrive
 * as data. Nodes are real router links: keyboard-focusable with a
 * visible focus ring, and activated by selection (never navigation) so
 * exploring never loses the reader's place.
 *
 * Wide screens only — narrow viewports use `ConceptGraphNarrowList`
 * instead of a shrunken, unreadable diagram.
 */

function truncate(label: string, max = 20): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export default function ConceptGraphViewport({
  layout,
  caption,
  centerLabel,
  selectedId,
  onSelect,
}: {
  layout: GraphLayout;
  caption: string;
  centerLabel: string;
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="concept-graph h-auto w-full"
      role="group"
      aria-label={caption}
    >
      {/* Spokes first so nodes paint above them. */}
      {layout.nodes.map((node) => (
        <line
          key={`spoke-${node.id}`}
          x1={layout.cx}
          y1={layout.cy}
          x2={node.x}
          y2={node.y}
          stroke="var(--color-hair)"
          strokeWidth={1}
          aria-hidden="true"
        />
      ))}
      {/* Central concept: the reader's current page, not a link. */}
      <g>
        <circle cx={layout.cx} cy={layout.cy} r={10} fill="var(--color-rajas)" aria-hidden="true" />
          <text
            x={layout.cx}
            y={layout.cy + 26}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="var(--color-sattva)"
            aria-hidden="true"
          >
            {truncate(centerLabel, 24)}
          </text>
      </g>
      {layout.nodes.map((node) => {
        const selected = node.id === selectedId;
        return (
          <Link
            key={node.id}
            to={node.href}
            aria-label={`${node.label} (${node.kind})`}
            aria-current={selected ? 'true' : undefined}
            onClick={(event) => {
              // Select to inspect; navigation lives in the detail panel so
              // exploring the map never yanks the reader to a new page.
              event.preventDefault();
              onSelect(node.id);
            }}
          >
            {/* Wide transparent hit area: real touch/mouse target without
                changing the quiet visual weight. */}
            <circle
              cx={node.x}
              cy={node.y}
              r={15}
              fill="transparent"
              aria-hidden="true"
            />
            {node.kind === 'tradition' ? (
              <rect
                x={node.x - 7}
                y={node.y - 7}
                width={14}
                height={14}
                rx={3}
                fill={selected ? 'var(--color-purusha)' : 'transparent'}
                fillOpacity={selected ? 0.35 : 1}
                stroke="var(--color-purusha)"
                strokeWidth={selected ? 3 : 1.5}
                aria-hidden="true"
                className="forced-colors:[stroke:CanvasText]"
              />
            ) : (
              <circle
                cx={node.x}
                cy={node.y}
                r={selected ? 8 : 6}
                fill={selected ? 'var(--color-sattva)' : 'transparent'}
                stroke="var(--color-sattva-dim)"
                strokeWidth={selected ? 3 : 1.5}
                aria-hidden="true"
                className="forced-colors:[stroke:CanvasText] forced-colors:[fill:CanvasText]"
              />
            )}
            <text
              x={node.x}
              y={node.labelBelow ? node.y + 24 : node.y - 16}
              textAnchor="middle"
              fontSize={11}
              fontWeight={selected ? 700 : 400}
              fill={selected ? 'var(--color-sattva)' : 'var(--color-sattva-dim)'}
              aria-hidden="true"
            >
              {truncate(node.label)}
            </text>
          </Link>
        );
      })}
    </svg>
  );
}
