import { auditText, type TextEvidenceAudit } from './report';
import type { CanonicalUnit, V2Source } from './schema';

/**
 * Text-level scholarly evidence summary — a presentation-ready view over
 * the already-loaded V2 text data. All counts derive from the shared
 * `auditText` derivation, so the text landing page agrees with
 * `buildEvidenceAudit()` by construction. Pure and deterministic; no
 * metadata is invented, only counted.
 */

export interface TextEvidenceSummary {
  audit: TextEvidenceAudit;
  /** Source records carrying an explicit role. */
  sourcesWithRoles: number;
  /** Source records without an explicit role (mixed-content notes records). */
  sourcesWithoutRoles: number;
  /** Units with a source association but neither links nor locators. */
  sourceOnlyUnits: number;
  /** First unit ids per coverage segment, for honest reader navigation. */
  firstEvidenceLinkedUnitId?: string;
  firstLocatorOnlyUnitId?: string;
  firstSourceOnlyUnitId?: string;
  firstUnresolvedUnitId?: string;
}

export function buildTextEvidenceSummary(
  textId: string,
  traditionId: string,
  units: CanonicalUnit[],
  sources: V2Source[],
): TextEvidenceSummary {
  const audit = auditText(textId, traditionId, units, sources);
  let sourcesWithRoles = 0;
  for (const source of sources) {
    if (source.role) sourcesWithRoles += 1;
  }
  let sourceOnlyUnits = 0;
  let firstEvidenceLinkedUnitId: string | undefined;
  let firstLocatorOnlyUnitId: string | undefined;
  let firstSourceOnlyUnitId: string | undefined;
  let firstUnresolvedUnitId: string | undefined;
  for (const unit of units) {
    const hasSource = (unit.sourceIds?.length ?? 0) > 0;
    const hasLinks = (unit.evidenceLinks?.length ?? 0) > 0;
    const hasLocator = !!unit.provenance?.locator;
    if (hasLinks && !firstEvidenceLinkedUnitId) firstEvidenceLinkedUnitId = unit.id;
    if (hasLocator && !hasSource && !hasLinks && !firstLocatorOnlyUnitId) {
      firstLocatorOnlyUnitId = unit.id;
    }
    if (hasSource && !hasLinks && !hasLocator) {
      sourceOnlyUnits += 1;
      if (!firstSourceOnlyUnitId) firstSourceOnlyUnitId = unit.id;
    }
    if (!hasSource && !hasLinks && !hasLocator && !firstUnresolvedUnitId) {
      firstUnresolvedUnitId = unit.id;
    }
  }
  return {
    audit,
    sourcesWithRoles,
    sourcesWithoutRoles: sources.length - sourcesWithRoles,
    sourceOnlyUnits,
    firstEvidenceLinkedUnitId,
    firstLocatorOnlyUnitId,
    firstSourceOnlyUnitId,
    firstUnresolvedUnitId,
  };
}
