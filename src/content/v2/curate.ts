import { deviMahatmyaSourceProvenance } from '../devi-mahatmya/devi-mahatmya-source-provenance';
import { lalitaSahasranamaSourceProvenance } from '../lalita-sahasranama/lalita-sahasranama-source-provenance';
import { vishnuSahasranamaSourceProvenance } from '../vishnu-sahasranama/vishnu-sahasranama-source-provenance';
import { mishraSourceProvenance } from '../kashmir-shaivism/mishra-source-provenance';
import { CURATED_SOURCES_BY_TEXT, SOURCE_NOTE_PREFIXES } from './curatedSources';
import {
  buildTextSource,
  extractLocatorStems,
  formatSourceTable,
  matchUnitEvidence,
  matchUnitLocator,
  matchUnitSources,
} from './textSources';
import type { V2Corpus } from './schema';

/**
 * Provenance curation (build-time only — never imported by runtime UI).
 *
 * Applies every evidence-backed curation step to an adapted corpus in
 * one place so chunk generation, the evidence audit and tests share a
 * single source of truth instead of three near-identical copies:
 *
 * 1. Text-level source records carried verbatim from legacy provenance
 *    statements (never parsed into invented fields).
 * 2. Devi-Mahatmya per-unit source locators via longest dash-boundary
 *    stem match; unmatched units keep nothing.
 * 3. Class A per-unit `sourceIds` exactly where a unit's own notes
 *    invoke the source, with precise `evidenceLinks` carrying each
 *    candidate's curated relation.
 *
 * Pure and deterministic: same corpus in, same corpus out. Callers own
 * logging and failure policy. Runs before validation so curated
 * provenance is itself validated.
 */

export interface TextCurationStats {
  /** Units that attached at least one source id. */
  attached: number;
  /** Units with no source association of any kind. */
  bare: number;
  /** Devi-Mahatmya units that gained a source locator. */
  locatorMatched: number;
}

export interface CurationResult {
  stats: Record<string, TextCurationStats>;
}

function emptyStats(): TextCurationStats {
  return { attached: 0, bare: 0, locatorMatched: 0 };
}

export function applyProvenanceCuration(corpus: V2Corpus): CurationResult {
  const stats: Record<string, TextCurationStats> = {};

  // Text-level source records carried verbatim from legacy provenance
  // statements (free prose/tables, never parsed into invented fields).
  // The Mishra Trika companion material merged into the tantraloka text,
  // so its provenance table travels with that text.
  for (const text of corpus.texts) {
    const record =
      text.id === 'lalita-sahasranama'
        ? buildTextSource(text.id, text.transliteratedTitle, lalitaSahasranamaSourceProvenance)
        : text.id === 'vishnu-sahasranama'
          ? buildTextSource(text.id, text.transliteratedTitle, vishnuSahasranamaSourceProvenance)
          : text.id === 'devi-mahatmya'
            ? buildTextSource(text.id, text.transliteratedTitle, formatSourceTable(deviMahatmyaSourceProvenance))
            : text.id === 'tantraloka'
              ? buildTextSource(text.id, text.transliteratedTitle, formatSourceTable(mishraSourceProvenance))
              : null;
    if (record) text.sources = [record];
  }

  // Pilot curation (devi-mahatmya): per-unit source locators from the
  // legacy section table, longest-stem match. Units without a match keep
  // no locator rather than receiving a guessed one.
  {
    const devi = corpus.texts.find((t) => t.id === 'devi-mahatmya');
    if (devi) {
      const textStats = emptyStats();
      const stems = extractLocatorStems(deviMahatmyaSourceProvenance);
      for (const unit of devi.units) {
        if (unit.provenance?.locator) continue;
        const locator = matchUnitLocator(unit.id, stems);
        if (locator) {
          unit.provenance = { ...(unit.provenance || {}), locator };
          textStats.locatorMatched += 1;
        }
      }
      stats['devi-mahatmya'] = textStats;
    }
  }

  // Scaled curation (Class A texts): curated edition registries plus
  // per-unit sourceIds exactly where a unit's own notes invoke the
  // source, with precise evidence links carrying each candidate's
  // curated relation. Appendix/adhika units without edition notes
  // attach nothing.
  for (const [textId, records] of Object.entries(CURATED_SOURCES_BY_TEXT)) {
    const text = corpus.texts.find((t) => t.id === textId);
    if (!text) continue;
    text.sources = [...(text.sources || []), ...records];
    const textStats = stats[textId] || emptyStats();
    const candidates = SOURCE_NOTE_PREFIXES.filter((c) => c.textId === textId);
    for (const unit of text.units) {
      const notes = (unit.interpretiveNotes || []).map((n) => n.note);
      const ids = matchUnitSources(notes, candidates);
      const known = ids.filter((id) => records.some((r) => r.id === id));
      if (known.length > 0) {
        unit.sourceIds = [...(unit.sourceIds || []), ...known.filter((id) => !(unit.sourceIds || []).includes(id))];
        const links = matchUnitEvidence(notes, candidates).filter((link) =>
          known.includes(link.sourceId),
        );
        if (links.length > 0) {
          const existing = unit.evidenceLinks || [];
          unit.evidenceLinks = [
            ...existing,
            ...links.filter((link) => !existing.some((e) => e.sourceId === link.sourceId)),
          ];
        }
        textStats.attached += 1;
      } else {
        textStats.bare += 1;
      }
    }
    stats[textId] = textStats;
  }

  return { stats };
}
