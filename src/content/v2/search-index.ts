import type { V2Corpus, V2Thread } from './schema';
import { normaliseId } from './ids';

/**
 * Build-time search-index generation (foundation).
 *
 * The index is generated from validated V2 data — never assembled at
 * runtime from application imports — so expensive multilingual matching
 * (English, Malayalam, Devanagari, IAST, ASCII-normalised Sanskrit, unit
 * numbers, concepts, text and tradition names, thread steps) can later
 * move into a Web Worker without changing the data shape.
 */

export interface SearchIndexEntry {
  key: string;
  traditionId: string;
  textId: string;
  unitId?: string;
  conceptId?: string;
  kind: 'unit' | 'concept' | 'thread-step' | 'text' | 'tradition';
  /** Canonical unit number (units only) for exact-match ranking. */
  number?: string;
  /** Display title (units: number fallback; concepts/texts/traditions: title). */
  title?: string;
  /** Section within the text (units only). */
  section?: string;
  /** 0-based step index within the tradition thread (thread steps only). */
  stepIndex?: number;
  en: string;
  ml: string;
  devanagari: string;
  iast: string;
  normalised: string;
}

export interface SearchIndex {
  version: 2;
  generatedAt: string;
  entries: SearchIndexEntry[];
}

function fold(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' \n ');
}

export function buildSearchIndex(corpus: V2Corpus, traditionThreads?: V2Thread[]): SearchIndex {
  const entries: SearchIndexEntry[] = [];

  for (const tradition of corpus.traditions) {
    entries.push({
      key: `tradition:${tradition.id}`,
      traditionId: tradition.id,
      textId: '',
      kind: 'tradition',
      title: tradition.title,
      en: fold(tradition.title, tradition.transliteratedTitle, tradition.description),
      ml: '',
      devanagari: '',
      iast: fold(tradition.transliteratedTitle),
      normalised: normaliseId(fold(tradition.title, tradition.transliteratedTitle)),
    });
  }

  for (const text of corpus.texts) {
    entries.push({
      key: `text:${text.traditionId}/${text.id}`,
      traditionId: text.traditionId,
      textId: text.id,
      kind: 'text',
      title: text.transliteratedTitle,
      en: fold(text.title, text.transliteratedTitle, text.description),
      ml: '',
      devanagari: '',
      iast: fold(text.transliteratedTitle),
      normalised: normaliseId(fold(text.title, text.transliteratedTitle)),
    });

    for (const unit of text.units) {
      const en = fold(
        unit.number,
        unit.localisations.en?.title,
        unit.localisations.en?.translation,
        unit.localisations.en?.commentary,
        unit.localisations.en?.summary,
        (unit.localisations.en?.keyPoints || []).join(' '),
        unit.localisations.en?.wordMeaning,
      );
      const ml = fold(
        unit.localisations.ml?.title,
        unit.localisations.ml?.translation,
        unit.localisations.ml?.commentary,
        unit.localisations.ml?.summary,
      );
      entries.push({
        key: `unit:${text.traditionId}/${text.id}/${unit.id}`,
        traditionId: text.traditionId,
        textId: text.id,
        unitId: unit.id,
        kind: 'unit',
        number: unit.number,
        title: unit.localisations.en?.title || unit.number,
        section: unit.section,
        en,
        ml,
        devanagari: unit.devanagari || '',
        iast: unit.iast || '',
        normalised: normaliseId(fold(en, unit.iast, unit.number)),
      });
    }

    for (const concept of text.concepts) {
      const en = fold(concept.localisations.en?.title, concept.localisations.en?.summary);
      const ml = fold(concept.localisations.ml?.title, concept.localisations.ml?.summary);
      entries.push({
        key: `concept:${text.traditionId}/${text.id}/${concept.id}`,
        traditionId: text.traditionId,
        textId: text.id,
        conceptId: concept.id,
        kind: 'concept',
        title: concept.localisations.en?.title || concept.id,
        en,
        ml,
        devanagari: '',
        iast: concept.localisations.en?.title || '',
        normalised: normaliseId(fold(en, concept.id)),
      });
    }

    for (const thread of text.threads || []) {
      // Per-text slices are covered by the tradition-thread pass below when
      // provided; otherwise index the slices without a global step index.
      if (traditionThreads) continue;
      for (const step of thread.steps) {
        entries.push({
          key: `thread-step:${text.traditionId}/${text.id}/${step.id}`,
          traditionId: text.traditionId,
          textId: step.textId || text.id,
          kind: 'thread-step',
          title: step.localisations.en?.title || step.id,
          en: fold(step.localisations.en?.title, step.localisations.en?.narrative),
          ml: fold(step.localisations.ml?.title, step.localisations.ml?.narrative),
          devanagari: '',
          iast: '',
          normalised: normaliseId(fold(step.localisations.en?.title, step.localisations.en?.narrative)),
        });
      }
    }
  }

  // Full tradition threads carry the global step index used by thread URLs.
  for (const thread of traditionThreads || []) {
    thread.steps.forEach((step, stepIndex) => {
      entries.push({
        key: `thread-step:${thread.traditionId}/${step.textId || ''}/${step.id}`,
        traditionId: thread.traditionId,
        textId: step.textId || thread.textId || '',
        kind: 'thread-step',
        title: step.localisations.en?.title || step.id,
        stepIndex,
        en: fold(step.localisations.en?.title, step.localisations.en?.narrative),
        ml: fold(step.localisations.ml?.title, step.localisations.ml?.narrative),
        devanagari: '',
        iast: '',
        normalised: normaliseId(fold(step.localisations.en?.title, step.localisations.en?.narrative)),
      });
    });
  }

  return { version: 2, generatedAt: new Date().toISOString(), entries };
}

/**
 * Tiered search split (Prompt 8).
 *
 * The monolithic index (~17 MB) is discovery metadata plus per-text
 * depth. This pure transform separates them without changing entry
 * shape, so `rankEntries` runs unmodified on any union:
 *
 * - discovery: every tradition/text in full, per concept the title plus
 *   a definitional head, per unit number/title/section/Sanskrit plus a
 *   short translation signal, per thread step title plus narrative head.
 *   Malayalam blobs live in a parallel `ml` discovery file fetched only
 *   for Malayalam UI or Malayalam-script queries.
 * - shards: full entries (today's shape) grouped by text, loaded only
 *   for candidate texts the discovery hits name.
 *
 * Deterministic: input order preserved, snippets cut at fixed lengths.
 */
export interface DiscoveryOptions {
  /** Kept head of unit en blobs (translation-first signal). */
  unitSnippet: number;
  /** Kept head of thread-step en blobs. */
  narrative: number;
  /** Kept head of concept en definitional heads. */
  conceptHead: number;
}

export const DEFAULT_DISCOVERY_OPTIONS: DiscoveryOptions = {
  unitSnippet: 80,
  narrative: 150,
  conceptHead: 60,
};

export type DiscoveryLang = 'en' | 'ml';

function head(text: string | undefined, length: number): string {
  if (!text) return '';
  const collapsed = text.replace(/\s+/g, ' ').trim();
  return collapsed.length > length ? collapsed.slice(0, length) : collapsed;
}

export function toDiscoveryEntry(
  entry: SearchIndexEntry,
  opts: DiscoveryOptions = DEFAULT_DISCOVERY_OPTIONS,
  lang: DiscoveryLang = 'en',
): SearchIndexEntry {
  // The companion language file carries the other localisation; each
  // file stays monolingual except for titles/names, which both keep.
  const keepMl = lang === 'ml';
  switch (entry.kind) {
    case 'tradition':
    case 'text':
      return keepMl ? entry : { ...entry, ml: '' };
    case 'concept': {
      const title = entry.title || '';
      const stripPrefix = (blob: string, prefix: string): string => {
        let rest = blob;
        if (prefix && rest.startsWith(prefix)) rest = rest.slice(prefix.length);
        return rest.replace(/\s+/g, ' ').trim();
      };
      const enHead = stripPrefix(entry.en, title).slice(0, opts.conceptHead);
      const en = keepMl ? '' : enHead ? `${title} \n ${enHead}` : title;
      const mlTitle = (entry.ml || '').split('\n')[0]?.trim() || '';
      const mlHead = stripPrefix(entry.ml, mlTitle).slice(0, opts.conceptHead);
      const ml = keepMl ? (mlHead ? `${mlTitle} \n ${mlHead}` : mlTitle) : mlTitle;
      // Names only: heads stay raw-matchable (with rankEntries' live
      // diacritic fallback), so the fold needs just title/id/ml-name.
      return {
        ...entry,
        en,
        ml,
        normalised: normaliseId(
          [title, mlTitle, entry.conceptId || ''].filter(Boolean).join(' \n '),
        ),
      };
    }
    case 'thread-step': {
      const en = keepMl ? '' : head(entry.en, opts.narrative);
      const ml = keepMl ? head(entry.ml, opts.narrative) : '';
      return { ...entry, en, ml, normalised: normaliseId([entry.title].filter(Boolean).join(' \n ')) };
    }
    case 'unit': {
      const en = keepMl ? '' : head(entry.en, opts.unitSnippet);
      const ml = keepMl ? head(entry.ml, opts.unitSnippet) : '';
      return {
        ...entry,
        en,
        ml,
        // Sections live in the shard; discovery rows never display them.
        section: undefined,
        normalised: normaliseId(
          [(entry.number || ''), entry.title, entry.iast, entry.unitId || ''].filter(Boolean).join(' \n '),
        ),
      };
    }
  }
}

export interface SearchSplit {
  discovery: SearchIndex;
  discoveryMl: SearchIndex;
  /** Full entries per textId (units, concepts and thread steps). */
  shards: Map<string, SearchIndexEntry[]>;
}

export function splitSearchIndex(
  index: SearchIndex,
  opts: DiscoveryOptions = DEFAULT_DISCOVERY_OPTIONS,
): SearchSplit {
  const discoveryEntries: SearchIndexEntry[] = [];
  const mlEntries: SearchIndexEntry[] = [];
  const shards = new Map<string, SearchIndexEntry[]>();
  for (const entry of index.entries) {
    if (entry.kind === 'tradition' || entry.kind === 'text' || !entry.textId) {
      discoveryEntries.push(toDiscoveryEntry(entry, opts, 'en'));
      mlEntries.push(toDiscoveryEntry(entry, opts, 'ml'));
      continue;
    }
    discoveryEntries.push(toDiscoveryEntry(entry, opts, 'en'));
    mlEntries.push(toDiscoveryEntry(entry, opts, 'ml'));
    const list = shards.get(entry.textId);
    if (list) list.push(entry);
    else shards.set(entry.textId, [entry]);
  }
  return {
    discovery: { version: 2, generatedAt: index.generatedAt, entries: discoveryEntries },
    discoveryMl: { version: 2, generatedAt: index.generatedAt, entries: mlEntries },
    shards,
  };
}
