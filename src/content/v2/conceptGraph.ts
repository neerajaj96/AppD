/**
 * Concept graph data (Prompts 5–6) — pure, deterministic, testable.
 *
 * Builds a hub-and-spoke relationship map from V2 data already in hand:
 * the current concept at the centre, first-degree related concepts around
 * it, and other traditions holding the same normalised identity as an
 * outer set. No fetching, no layout randomness, no new dependencies.
 *
 * Renderers (`src/components/concept-graph/`) draw this data; the
 * semantic relationship lists on the concept page remain the
 * authoritative, keyboard-complete representation. Relationship meaning
 * stays honest: concept satellites are linkage ("related concept"),
 * tradition satellites are occurrence ("same name occurs here") — never
 * doctrinal equivalence.
 */

export type GraphNodeKind = 'self' | 'concept' | 'tradition';

export interface GraphNode {
  /** Stable key for React + tests. */
  id: string;
  label: string;
  kind: GraphNodeKind;
  href: string;
  /** Optional caller-resolved context line (source text, unit counts). */
  detail?: string;
}

export interface ConceptGraphData {
  center: GraphNode;
  satellites: GraphNode[];
  /** Relationships beyond the display caps; the full lists follow below. */
  hiddenRelated: number;
  hiddenTraditions: number;
}

export interface RelatedConceptInput {
  traditionId: string;
  textId: string;
  conceptId: string;
  title: string;
  detail?: string;
}

export interface GraphOccurrenceInput {
  traditionId: string;
  /** Display title resolved by the caller (never a raw id in the UI). */
  traditionLabel?: string;
  detail?: string;
}

export const MAX_RELATED_NODES = 8;
export const MAX_TRADITION_NODES = 6;

export function buildConceptGraph(input: {
  traditionId: string;
  textId: string;
  conceptId: string;
  title: string;
  related: RelatedConceptInput[];
  occurrences: GraphOccurrenceInput[];
}): ConceptGraphData | null {
  const related = input.related.filter((r) => r.conceptId !== input.conceptId);
  const shownRelated = related.slice(0, MAX_RELATED_NODES);
  // Not enough relationships for a map to say anything: callers fall back
  // to the semantic lists alone.
  if (shownRelated.length < 2) return null;

  const others: GraphOccurrenceInput[] = [];
  {
    const seen = new Set<string>();
    for (const occ of input.occurrences) {
      if (occ.traditionId === input.traditionId || seen.has(occ.traditionId)) continue;
      seen.add(occ.traditionId);
      others.push(occ);
    }
  }
  const traditionNodes: GraphNode[] = others.slice(0, MAX_TRADITION_NODES).map((occ) => ({
    id: `tradition:${occ.traditionId}`,
    label: occ.traditionLabel || occ.traditionId,
    kind: 'tradition',
    href: `/system/${occ.traditionId}`,
    detail: occ.detail,
  }));
  const hiddenTraditions = others.length - traditionNodes.length;

  return {
    center: {
      id: `self:${input.traditionId}/${input.textId}/${input.conceptId}`,
      label: input.title,
      kind: 'self',
      href: `/system/${input.traditionId}/text/${input.textId}/concept/${input.conceptId}`,
    },
    satellites: [
      ...shownRelated.map((r) => ({
        id: `concept:${r.traditionId}/${r.textId}/${r.conceptId}`,
        label: r.title,
        kind: 'concept' as const,
        href: `/system/${r.traditionId}/text/${r.textId}/concept/${r.conceptId}`,
        detail: r.detail,
      })),
      ...traditionNodes,
    ],
    hiddenRelated: related.length - shownRelated.length,
    hiddenTraditions,
  };
}

// ---------------------------------------------------------------------------
// Deterministic layout: pure position computation, no DOM measurement.
// ---------------------------------------------------------------------------

export interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  /** Labels sit outside the ring: below on the lower half, above otherwise. */
  labelBelow: boolean;
}

export interface GraphLayout {
  width: number;
  height: number;
  cx: number;
  cy: number;
  nodes: PositionedNode[];
}

export const LAYOUT_WIDTH = 440;
export const LAYOUT_HEIGHT = 340;

/** Evenly spaced ring positions; every coordinate stays inside the canvas. */
export function layoutGraph(data: ConceptGraphData, width = LAYOUT_WIDTH, height = LAYOUT_HEIGHT): GraphLayout {
  const cx = width / 2;
  const cy = height / 2;
  // Label margins keep outer text inside the canvas on all sides.
  const rx = Math.max(40, width / 2 - 62);
  const ry = Math.max(30, height / 2 - 54);
  const n = data.satellites.length;
  const nodes = data.satellites.map((node, i) => {
    const angle = n === 0 ? 0 : (2 * Math.PI * i) / n - Math.PI / 2;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    return { ...node, x, y, labelBelow: Math.sin(angle) >= 0 };
  });
  return { width, height, cx, cy, nodes };
}
