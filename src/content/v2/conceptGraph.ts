/**
 * Concept graph data (Prompt 5) — pure, deterministic, testable.
 *
 * Builds a hub-and-spoke relationship map from V2 data already in hand:
 * the current concept at the centre, first-degree related concepts around
 * it, and other traditions holding the same normalised identity as an
 * outer set. No fetching, no layout randomness, no new dependencies.
 *
 * The SVG renderer (`src/components/ConceptGraph.tsx`) draws this data;
 * the semantic relationship lists on the concept page remain the
 * authoritative, keyboard-complete representation.
 */

export type GraphNodeKind = 'self' | 'concept' | 'tradition';

export interface GraphNode {
  /** Stable key for React + tests. */
  id: string;
  label: string;
  kind: GraphNodeKind;
  href: string;
}

export interface ConceptGraphData {
  center: GraphNode;
  satellites: GraphNode[];
}

export interface RelatedConceptInput {
  traditionId: string;
  textId: string;
  conceptId: string;
  title: string;
}

export interface GraphOccurrenceInput {
  traditionId: string;
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
  const related = input.related
    .filter((r) => r.conceptId !== input.conceptId)
    .slice(0, MAX_RELATED_NODES);
  // Not enough relationships for a map to say anything: callers fall back
  // to the semantic lists alone.
  if (related.length < 2) return null;

  const seenTraditions = new Set<string>();
  const traditionNodes: GraphNode[] = [];
  for (const occ of input.occurrences) {
    if (occ.traditionId === input.traditionId || seenTraditions.has(occ.traditionId)) continue;
    seenTraditions.add(occ.traditionId);
    if (traditionNodes.length >= MAX_TRADITION_NODES) break;
    traditionNodes.push({
      id: `tradition:${occ.traditionId}`,
      label: occ.traditionId,
      kind: 'tradition',
      href: `/system/${occ.traditionId}`,
    });
  }

  return {
    center: {
      id: `self:${input.traditionId}/${input.textId}/${input.conceptId}`,
      label: input.title,
      kind: 'self',
      href: `/system/${input.traditionId}/text/${input.textId}/concept/${input.conceptId}`,
    },
    satellites: [
      ...related.map((r) => ({
        id: `concept:${r.traditionId}/${r.textId}/${r.conceptId}`,
        label: r.title,
        kind: 'concept' as const,
        href: `/system/${r.traditionId}/text/${r.textId}/concept/${r.conceptId}`,
      })),
      ...traditionNodes,
    ],
  };
}
