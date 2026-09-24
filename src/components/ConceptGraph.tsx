import { Link } from 'react-router';
import type { ConceptGraphData } from '../content/v2/conceptGraph';

/**
 * Lightweight concept map: hub-and-spoke SVG over real V2 relationships.
 *
 * No graph library, no animation, no new bundle weight to speak of. Nodes
 * are real router links (keyboard-focusable, with visible focus via the
 * global `.concept-graph` rule in index.css). Shape distinguishes kind —
 * circles for concepts, rounded squares for traditions — with a text
 * legend, so meaning never rides on colour alone. The semantic lists on
 * the concept page stay the authoritative representation; this map is a
 * visual shortcut to the same destinations.
 */

const WIDTH = 440;
const HEIGHT = 340;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RX = 165;
const RY = 118;

function truncate(label: string, max = 20): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

export default function ConceptGraph({ data, caption }: { data: ConceptGraphData; caption: string }) {
  const n = data.satellites.length;
  return (
    <figure className="min-w-0">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="concept-graph h-auto w-full"
        role="img"
        aria-label={caption}
      >
        {/* Spokes first so nodes paint above them. */}
        {data.satellites.map((node, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const x = CX + RX * Math.cos(angle);
          const y = CY + RY * Math.sin(angle);
          return (
            <line
              key={`spoke-${node.id}`}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="var(--color-hair)"
              strokeWidth={1}
              aria-hidden="true"
            />
          );
        })}
        {/* Central concept. */}
        <g>
          <circle cx={CX} cy={CY} r={10} fill="var(--color-rajas)" aria-hidden="true" />
          <text
            x={CX}
            y={CY + 26}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fill="var(--color-sattva)"
            aria-hidden="true"
          >
            {truncate(data.center.label, 24)}
          </text>
        </g>
        {data.satellites.map((node, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const x = CX + RX * Math.cos(angle);
          const y = CY + RY * Math.sin(angle);
          const below = Math.sin(angle) >= 0;
          return (
            <Link key={node.id} to={node.href} aria-label={`${node.label} (${node.kind})`}>
              {node.kind === 'tradition' ? (
                <rect
                  x={x - 7}
                  y={y - 7}
                  width={14}
                  height={14}
                  rx={3}
                  fill="transparent"
                  stroke="var(--color-purusha)"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="transparent"
                  stroke="var(--color-sattva-dim)"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              )}
              <text
                x={x}
                y={below ? y + 22 : y - 14}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-sattva-dim)"
                aria-hidden="true"
              >
                {truncate(node.label)}
              </text>
            </Link>
          );
        })}
      </svg>
      <figcaption className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tamas">
        <span>{caption}</span>
        <span className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span className="inline-block h-2 w-2 rounded-full border border-sattva-dim" /> concept
        </span>
        <span className="inline-flex items-center gap-1.5" aria-hidden="true">
          <span className="inline-block h-2 w-2 rounded-[2px] border border-purusha" /> tradition
        </span>
      </figcaption>
    </figure>
  );
}
