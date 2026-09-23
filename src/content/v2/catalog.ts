import type { SupportedLanguage } from '../../types/i18n';
import { systemNames } from '../../i18n/systems';
import type { TextSummary, TraditionSummary } from './chunks';

/**
 * Catalog display helpers — titles, subtitles and verse terms from the
 * global manifest only, so navigation chrome never needs content chunks.
 * Malayalam display comes from the existing `systemNames` sidecar, keyed
 * by the preserved tradition/system ID.
 */

export function getTraditionDisplay(
  tradition: Pick<TraditionSummary, 'id' | 'title'> & { subtitle?: string },
  lang: SupportedLanguage,
): { title: string; subtitle: string } {
  const entry = systemNames[tradition.id];
  if (lang === 'ml' && entry?.ml) return entry.ml;
  if (entry?.en) return entry.en;
  return { title: tradition.title, subtitle: tradition.subtitle || '' };
}

/** Verse term with the legacy pluralisation behaviour preserved. */
export function getVerseTermForSummary(text: Pick<TextSummary, 'verseTerm'> | undefined, count = 1): string {
  const term = text?.verseTerm || 'Verse';
  if (count === 1) return term;
  if (term === 'Sūtra') return 'Sūtras';
  if (term === 'Kārikā') return 'Kārikās';
  if (term === 'Śloka') return 'Ślokas';
  if (term === 'Mantra') return 'Mantras';
  if (term === 'Śloka / Mantra') return 'Ślokas / Mantras';
  return term.endsWith('s') ? term : `${term}s`;
}

/** Deep-link rule: single-text traditions open the text directly. */
export function traditionHref(tradition: Pick<TraditionSummary, 'id' | 'textIds'>, textId?: string): string {
  if (tradition.textIds.length === 1 && !textId) {
    return `/system/${tradition.id}/text/${tradition.textIds[0]}`;
  }
  return `/system/${tradition.id}`;
}
