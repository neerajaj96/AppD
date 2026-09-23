import type { V2Corpus } from './schema';
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

export function buildSearchIndex(corpus: V2Corpus): SearchIndex {
  const entries: SearchIndexEntry[] = [];

  for (const tradition of corpus.traditions) {
    entries.push({
      key: `tradition:${tradition.id}`,
      traditionId: tradition.id,
      textId: '',
      kind: 'tradition',
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
        en,
        ml,
        devanagari: '',
        iast: concept.localisations.en?.title || '',
        normalised: normaliseId(fold(en, concept.id)),
      });
    }

    for (const thread of text.threads || []) {
      for (const step of thread.steps) {
        entries.push({
          key: `thread-step:${text.traditionId}/${text.id}/${step.id}`,
          traditionId: text.traditionId,
          textId: text.id,
          kind: 'thread-step',
          en: fold(step.localisations.en?.title, step.localisations.en?.narrative),
          ml: fold(step.localisations.ml?.title, step.localisations.ml?.narrative),
          devanagari: '',
          iast: '',
          normalised: normaliseId(fold(step.localisations.en?.title, step.localisations.en?.narrative)),
        });
      }
    }
  }

  return { version: 2, generatedAt: new Date().toISOString(), entries };
}
