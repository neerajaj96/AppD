import type { CanonicalUnit } from './schema';
import type { SupportedLanguage } from '../../types/i18n';

/**
 * Pure selection helpers for the scholarly reader (Prompt 4).
 *
 * Language fallback and unit adjacency live here — outside components —
 * so the reading order, language selection and prev/next boundaries are
 * deterministic and unit-testable. No corpus imports; operates on loaded
 * V2 chunks only.
 */

/** Localised payload with English fallback (Malayalam pending → English). */
export function pickLocalisation<T extends { translation?: string; commentary?: string; title?: string; summary?: string; narrative?: string }>(
  localisations: Partial<Record<SupportedLanguage, T>>,
  lang: SupportedLanguage,
): { active: T | undefined; isFallback: boolean } {
  const direct = localisations[lang];
  if (direct && (direct.translation || direct.commentary || direct.title || direct.summary || direct.narrative)) {
    return { active: direct, isFallback: false };
  }
  const en = localisations.en;
  if (en && (en.translation || en.commentary || en.title || en.summary || en.narrative)) {
    return { active: en, isFallback: lang !== 'en' };
  }
  return { active: direct || en, isFallback: lang !== 'en' };
}

/** Previous/next units in actual V2 chunk order. Null at each boundary. */
export function getAdjacentUnits(
  units: CanonicalUnit[],
  unitId: string,
): { prev: CanonicalUnit | null; next: CanonicalUnit | null; index: number } {
  const index = units.findIndex((u) => u.id === unitId);
  if (index < 0) return { prev: null, next: null, index: -1 };
  return {
    prev: index > 0 ? units[index - 1] : null,
    next: index >= 0 && index < units.length - 1 ? units[index + 1] : null,
    index,
  };
}
