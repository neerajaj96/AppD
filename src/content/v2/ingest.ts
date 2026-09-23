import { SCHEMA_VERSION, type CanonicalUnit, type V2Concept, type V2Corpus, type V2Text } from './schema';
import { TRADITIONS } from './tradition';

/**
 * Content ingestion layer — normalises JSON, legacy TypeScript maps,
 * generated assistant output and text manifests into the V2 schema.
 *
 * Each `ingest*` helper is deliberately forgiving at the boundary and
 * strict at the centre: unknown fields are dropped, missing canonical
 * fields fall back to documented defaults, and the result always carries
 * `schemaVersion: 2` so downstream validators can rely on the shape.
 */

export interface IngestResult<T> {
  value: T;
  warnings: string[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function ingestUnit(raw: unknown): IngestResult<CanonicalUnit> {
  const warnings: string[] = [];
  const r = asRecord(raw);
  const id = asString(r['id']);
  if (!id) warnings.push('unit without id');
  const localisations: CanonicalUnit['localisations'] = {};
  const rawLoc = asRecord(r['localisations']);
  const rawContent = asRecord(r['content']);
  for (const lang of ['en', 'ml'] as const) {
    const contentLang = asRecord(rawContent[lang]);
    const loc = asRecord(rawLoc[lang] ?? (r[lang] as unknown) ?? contentLang);
    if (Object.keys(loc).length > 0) {
      localisations[lang] = {
        title: typeof loc['title'] === 'string' ? (loc['title'] as string) : undefined,
        translation: typeof loc['translation'] === 'string' ? (loc['translation'] as string) : undefined,
        commentary: typeof loc['commentary'] === 'string' ? (loc['commentary'] as string) : undefined,
        summary: typeof loc['summary'] === 'string' ? (loc['summary'] as string) : undefined,
        narrative: typeof loc['narrative'] === 'string' ? (loc['narrative'] as string) : undefined,
        keyPoints: Array.isArray(loc['keyPoints']) ? (loc['keyPoints'] as string[]) : undefined,
        wordMeaning: typeof loc['wordMeaning'] === 'string' ? (loc['wordMeaning'] as string) : undefined,
        variantNote: typeof loc['variantNote'] === 'string' ? (loc['variantNote'] as string) : undefined,
      };
    }
  }
  // Legacy flat fields (translation/commentary at top level) map to English.
  if (!localisations.en && (typeof r['translation'] === 'string' || typeof r['commentary'] === 'string')) {
    localisations.en = {
      translation: typeof r['translation'] === 'string' ? (r['translation'] as string) : undefined,
      commentary: typeof r['commentary'] === 'string' ? (r['commentary'] as string) : undefined,
    };
  }
  return {
    value: {
      id: id || 'unknown-unit',
      number: asString(r['number'], id || 'unknown'),
      section: asString(r['section'], ''),
      subsection: typeof r['subsection'] === 'string' ? (r['subsection'] as string) : undefined,
      unitType: (typeof r['unitType'] === 'string' ? (r['unitType'] as CanonicalUnit['unitType']) : 'verse'),
      devanagari: typeof r['devanagari'] === 'string' ? (r['devanagari'] as string) : undefined,
      iast: asString(r['iast'], ''),
      localisations,
      conceptIds: Array.isArray(r['conceptIds']) ? (r['conceptIds'] as string[]) : [],
      diagramIds: Array.isArray(r['diagramIds'])
        ? (r['diagramIds'] as string[])
        : typeof r['diagramId'] === 'string'
          ? [r['diagramId'] as string]
          : [],
    },
    warnings,
  };
}

export function ingestConcept(raw: unknown): IngestResult<V2Concept> {
  const warnings: string[] = [];
  const r = asRecord(raw);
  const id = asString(r['id']);
  if (!id) warnings.push('concept without id');
  const enSource = asRecord(r['en'] ?? asRecord(r['localisations'])['en'] ?? asRecord(asRecord(r['content'])['en']));
  const mlSource = asRecord(r['ml'] ?? asRecord(r['localisations'])['ml'] ?? asRecord(asRecord(r['content'])['ml']));
  const title = asString(r['title'] ?? enSource['title']);
  const summary = asString(r['summary'] ?? enSource['summary']);
  if (!title || !summary) warnings.push(`concept ${id || '?'} lacks English title/summary`);
  return {
    value: {
      id: id || 'unknown-concept',
      category: typeof r['category'] === 'string' ? (r['category'] as string) : undefined,
      diagramIds: Array.isArray(r['diagramIds'])
        ? (r['diagramIds'] as string[])
        : typeof r['diagramId'] === 'string'
          ? [r['diagramId'] as string]
          : [],
      relatedUnitIds: Array.isArray(r['relatedUnitIds'])
        ? (r['relatedUnitIds'] as string[])
        : Array.isArray(r['relatedVerseIds'])
          ? (r['relatedVerseIds'] as string[])
          : [],
      relatedConceptIds: Array.isArray(r['relatedConceptIds']) ? (r['relatedConceptIds'] as string[]) : [],
      localisations: {
        en: title || summary ? { title: title || undefined, summary: summary || undefined } : undefined,
        ml:
          asString(mlSource['title']) || asString(mlSource['summary'])
            ? { title: asString(mlSource['title']) || undefined, summary: asString(mlSource['summary']) || undefined }
            : undefined,
      },
    },
    warnings,
  };
}

export function ingestText(raw: unknown): IngestResult<V2Text> {
  const warnings: string[] = [];
  const r = asRecord(raw);
  const units = Array.isArray(r['units']) ? r['units'] as unknown[] : [];
  const concepts = Array.isArray(r['concepts']) ? r['concepts'] as unknown[] : [];
  const ingestedUnits = units.map((u) => {
    const res = ingestUnit(u);
    warnings.push(...res.warnings);
    return res.value;
  });
  const ingestedConcepts = concepts.map((c) => {
    const res = ingestConcept(c);
    warnings.push(...res.warnings);
    return res.value;
  });
  return {
    value: {
      id: asString(r['id'], 'unknown-text'),
      title: asString(r['title'], 'Untitled'),
      transliteratedTitle: asString(r['transliteratedTitle'], asString(r['title'], 'Untitled')),
      author: typeof r['author'] === 'string' ? (r['author'] as string) : undefined,
      traditionalAttribution: typeof r['traditionalAttribution'] === 'string' ? (r['traditionalAttribution'] as string) : undefined,
      traditionId: asString(r['traditionId'] ?? r['systemId'], 'unknown'),
      sourceRole: (typeof r['sourceRole'] === 'string' ? (r['sourceRole'] as V2Text['sourceRole']) : 'primary'),
      contentStatus: (typeof r['contentStatus'] === 'string' ? (r['contentStatus'] as V2Text['contentStatus']) : 'unknown'),
      languages: ['en', 'ml'],
      units: ingestedUnits,
      concepts: ingestedConcepts,
    },
    warnings,
  };
}

/** Ingest a manifest-described JSON bundle into a corpus snapshot. */
export function ingestCorpus(raw: unknown): IngestResult<V2Corpus> {
  const warnings: string[] = [];
  const r = asRecord(raw);
  const rawTexts = Array.isArray(r['texts']) ? (r['texts'] as unknown[]) : [];
  const texts = rawTexts.map((t) => {
    const res = ingestText(t);
    warnings.push(...res.warnings);
    return res.value;
  });
  return {
    value: {
      schemaVersion: SCHEMA_VERSION,
      traditions: TRADITIONS,
      texts,
      aliases: Array.isArray(r['aliases']) ? (r['aliases'] as V2Corpus['aliases']) : [],
    },
    warnings,
  };
}
