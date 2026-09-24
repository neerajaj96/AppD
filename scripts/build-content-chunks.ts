/**
 * Build static V2 content chunks.
 *
 * Usage: npm run content:chunks [-- --if-missing]
 * Pipeline: legacy content → V2 adapter → validation → manifests →
 * independently loadable JSON under public/content/.
 *
 * Units split into ≤150-unit section-grouped chunks; concepts into
 * ≤200-concept chunks. Counts are always derived from actual data.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2, adaptSystemThread } from '../src/content/v2/adapters.ts';
import { validateCorpus } from '../src/content/v2/validate.ts';
import { buildManifest } from '../src/content/v2/chunks.ts';
import { buildSearchIndex, splitSearchIndex } from '../src/content/v2/search-index.ts';
import { buildConceptOccurrenceIndex } from '../src/content/v2/occurrences.ts';
import { buildTextSource, extractLocatorStems, formatSourceTable, matchUnitLocator, matchUnitSources } from '../src/content/v2/textSources.ts';
import { CURATED_SOURCES_BY_TEXT, SOURCE_NOTE_PREFIXES } from '../src/content/v2/curatedSources.ts';
import { lalitaSahasranamaSourceProvenance } from '../src/content/lalita-sahasranama/lalita-sahasranama-source-provenance.ts';
import { vishnuSahasranamaSourceProvenance } from '../src/content/vishnu-sahasranama/vishnu-sahasranama-source-provenance.ts';
import { deviMahatmyaSourceProvenance } from '../src/content/devi-mahatmya/devi-mahatmya-source-provenance.ts';
import { mishraSourceProvenance } from '../src/content/kashmir-shaivism/mishra-source-provenance.ts';
import type { System } from '../src/types/content.ts';
import type {
  ConceptIndexFile,
  GlobalManifest,
  TextManifestFile,
  TextSummary,
  TraditionSummary,
  UnitIndexFile,
} from '../src/content/v2/chunks.ts';
import type { CanonicalUnit, V2Concept, V2Thread } from '../src/content/v2/schema.ts';

const OUT = path.join('public', 'content');
const UNIT_CHUNK = 150;
const CONCEPT_CHUNK = 200;

function slugify(section: string, fallback: string): string {
  const slug = section
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

function writeJson(file: string, value: unknown): number {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = JSON.stringify(value);
  fs.writeFileSync(file, body, 'utf8');
  return Buffer.byteLength(body);
}

function chunkUnits(units: CanonicalUnit[]): { files: Array<{ file: string; units: CanonicalUnit[] }>; sections: Array<{ section: string; count: number; chunk: string }> } {
  // Group by section first so a section rarely straddles two files.
  const bySection = new Map<string, CanonicalUnit[]>();
  for (const unit of units) {
    const key = unit.section || '';
    const list = bySection.get(key);
    if (list) list.push(unit);
    else bySection.set(key, [unit]);
  }
  const files: Array<{ file: string; units: CanonicalUnit[] }> = [];
  const sections: Array<{ section: string; count: number; chunk: string }> = [];
  let current: CanonicalUnit[] = [];
  let fileIndex = 0;
  const flush = () => {
    if (current.length === 0) return;
    const file = `chunk-${fileIndex}.json`;
    files.push({ file, units: current });
    current = [];
    fileIndex += 1;
  };
  for (const [section, list] of bySection) {
    if (current.length > 0 && current.length + list.length > UNIT_CHUNK) flush();
    if (list.length >= UNIT_CHUNK && current.length === 0) {
      // One very large section: split it across files.
      for (let i = 0; i < list.length; i += UNIT_CHUNK) {
        const slice = list.slice(i, i + UNIT_CHUNK);
        const file = `chunk-${fileIndex}.json`;
        files.push({ file, units: slice });
        sections.push({ section, count: slice.length, chunk: file });
        fileIndex += 1;
      }
      continue;
    }
    const file = `chunk-${fileIndex}.json`;
    current.push(...list);
    sections.push({ section, count: list.length, chunk: file });
    if (current.length >= UNIT_CHUNK) flush();
  }
  flush();
  // Fix chunk names for sections buffered before a flush boundary moved on.
  const fileOf = new Map<CanonicalUnit, string>();
  for (const f of files) for (const u of f.units) fileOf.set(u, f.file);
  for (const s of sections) {
    const first = units.find((u) => (u.section || '') === s.section);
    if (first) s.chunk = fileOf.get(first) || s.chunk;
  }
  void slugify;
  return { files, sections };
}

function chunkConcepts(concepts: V2Concept[]): Array<{ file: string; concepts: V2Concept[] }> {
  const files: Array<{ file: string; concepts: V2Concept[] }> = [];
  for (let i = 0; i < concepts.length; i += CONCEPT_CHUNK) {
    files.push({ file: `chunk-${files.length}.json`, concepts: concepts.slice(i, i + CONCEPT_CHUNK) });
  }
  if (files.length === 0) files.push({ file: 'chunk-0.json', concepts: [] });
  return files;
}

const args = process.argv.slice(2);
if (args.includes('--if-missing') && fs.existsSync(path.join(OUT, 'manifest.json'))) {
  console.log('Content chunks already present; skipping (remove public/content to rebuild).');
  process.exit(0);
}

const corpus = adaptSystemsToV2(systems);

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
// no locator rather than receiving a guessed one. Runs before validation
// so curated provenance is itself validated.
{
  const devi = corpus.texts.find((t) => t.id === 'devi-mahatmya');
  if (devi) {
    const stems = extractLocatorStems(deviMahatmyaSourceProvenance);
    let matched = 0;
    for (const unit of devi.units) {
      if (unit.provenance?.locator) continue;
      const locator = matchUnitLocator(unit.id, stems);
      if (locator) {
        unit.provenance = { ...(unit.provenance || {}), locator };
        matched += 1;
      }
    }
    const total = devi.units.length;
    console.log(`Provenance pilot (devi-mahatmya): ${matched}/${total} units carry a source locator; ${total - matched} remain unresolved.`);
    if (matched === 0) {
      console.error('Provenance pilot matched zero units; refusing to emit uncurated chunks.');
      process.exit(1);
    }
  }
}
// Scaled curation (Class A texts): curated edition registries plus
// per-unit sourceIds exactly where a unit's own notes invoke the source.
// Appendix/adhika units without edition notes attach nothing.
for (const [textId, records] of Object.entries(CURATED_SOURCES_BY_TEXT)) {
  const text = corpus.texts.find((t) => t.id === textId);
  if (!text) {
    console.error(`Curated sources reference unknown text ${textId}; refusing to emit.`);
    process.exit(1);
  }
  text.sources = [...(text.sources || []), ...records];
  const candidates = SOURCE_NOTE_PREFIXES.filter((c) => c.textId === textId);
  let attached = 0;
  let bare = 0;
  for (const unit of text.units) {
    const notes = (unit.interpretiveNotes || []).map((n) => n.note);
    const ids = matchUnitSources(notes, candidates);
    const known = ids.filter((id) => records.some((r) => r.id === id));
    if (known.length > 0) {
      unit.sourceIds = [...(unit.sourceIds || []), ...known.filter((id) => !(unit.sourceIds || []).includes(id))];
      attached += 1;
    } else {
      bare += 1;
    }
  }
  console.log(`Provenance curation (${textId}): ${attached}/${text.units.length} units attach sources; ${bare} remain unresolved.`);
  if (attached === 0) {
    console.error(`Curated sources for ${textId} matched zero units; refusing to emit.`);
    process.exit(1);
  }
}
const validation = validateCorpus(corpus);
if (validation.errors.length > 0) {
  console.error(`Validation failed with ${validation.errors.length} errors:`);
  for (const issue of validation.errors.slice(0, 20)) {
    console.error(`  [${issue.code}] ${issue.textId || ''}${issue.entityId ? `/${issue.entityId}` : ''} ${issue.message}`);
  }
  process.exit(1);
}

const legacyById = new Map<string, System>();
for (const system of systems as System[]) {
  for (const text of system.texts) legacyById.set(text.id as string, system);
}

const traditionThreads = new Map<string, V2Thread[]>();
for (const system of systems as System[]) {
  traditionThreads.set(system.id as string, adaptSystemThread(system));
}

let bytes = 0;
let files = 0;
const track = (file: string, value: unknown) => {
  bytes += writeJson(file, value);
  files += 1;
};

const summaries: TextSummary[] = [];
for (const text of corpus.texts) {
  const legacySystem = legacyById.get(text.id);
  const legacyText = legacySystem?.texts.find((t) => (t.id as string) === text.id);
  const sections = new Map<string, number>();
  for (const unit of text.units) {
    sections.set(unit.section || '', (sections.get(unit.section || '') || 0) + 1);
  }
  const sectionList = Array.from(sections.entries()).map(([section, count]) => ({ section, count }));
  const manifest = buildManifest(text);
  const file: TextManifestFile = {
    ...manifest,
    title: text.title,
    transliteratedTitle: text.transliteratedTitle,
    author: text.author,
    verseTerm: text.verseTerm,
    sections: sectionList,
    conceptCount: text.concepts.length,
    threadSteps: (text.threads || []).reduce((n, t) => n + t.steps.length, 0),
  };
  track(path.join(OUT, text.id, 'manifest.json'), file);
  track(path.join(OUT, text.id, 'meta.json'), file);
  track(path.join(OUT, text.id, 'threads.json'), text.threads || []);
  track(path.join(OUT, text.id, 'sources.json'), text.sources || []);

  const units = chunkUnits(text.units);
  const unitIndex: UnitIndexFile = {
    textId: text.id,
    unitCount: text.units.length,
    sections: units.sections,
    chunks: units.files.map((f) => f.file),
  };
  track(path.join(OUT, text.id, 'units', 'index.json'), unitIndex);
  for (const f of units.files) {
    track(path.join(OUT, text.id, 'units', f.file), f.units);
  }

  const conceptFiles = chunkConcepts(text.concepts);
  const conceptIndex: ConceptIndexFile = {
    textId: text.id,
    conceptCount: text.concepts.length,
    chunks: conceptFiles.map((f) => f.file),
  };
  track(path.join(OUT, text.id, 'concepts', 'index.json'), conceptIndex);
  for (const f of conceptFiles) {
    track(path.join(OUT, text.id, 'concepts', f.file), f.concepts);
  }

  summaries.push({
    textId: text.id,
    traditionId: text.traditionId,
    title: text.title,
    transliteratedTitle: text.transliteratedTitle,
    author: text.author,
    sourceRole: text.sourceRole,
    verseTerm: text.verseTerm || (legacyText as { verseTerm?: string } | undefined)?.verseTerm,
    contentStatus: text.contentStatus,
    unitCount: text.units.length,
    conceptCount: text.concepts.length,
    threadSteps: file.threadSteps,
    languages: {
      en: text.units.filter((u) => u.localisations.en).length,
      ml: text.units.filter((u) => u.localisations.ml).length,
    },
    sections: sectionList,
  });
}

for (const [traditionId, threads] of traditionThreads) {
  track(path.join(OUT, 'threads', `${traditionId}.json`), threads);
}

const traditionSummaries: TraditionSummary[] = corpus.traditions.map((tradition) => {
  const legacy = (systems as System[]).find((s) => (s.id as string) === tradition.id);
  const textIds = summaries.filter((s) => s.traditionId === tradition.id).map((s) => s.textId);
  return {
    ...tradition,
    subtitle: (legacy as { subtitle?: string } | undefined)?.subtitle,
    textIds,
    threadSteps: (traditionThreads.get(tradition.id) || []).reduce((n, t) => n + t.steps.length, 0),
  };
});

const global: GlobalManifest = {
  schemaVersion: corpus.schemaVersion,
  generatedAt: new Date().toISOString(),
  traditions: traditionSummaries,
  texts: summaries.sort((a, b) => (a.textId < b.textId ? -1 : 1)),
};
track(path.join(OUT, 'manifest.json'), global);

// Editorial alias table: the versioned human-spelling → canonical
// triple dataset both the validator and the runtime resolve against.
track(path.join(OUT, 'aliases.json'), {
  schemaVersion: corpus.schemaVersion,
  generatedAt: new Date().toISOString(),
  aliases: corpus.aliases,
});

const indexThreads = Array.from(traditionThreads.values()).flat();
const searchIndex = buildSearchIndex(corpus, indexThreads);
// Tiered search layout: one small discovery file plus full per-text
// shards, so first keystrokes never download the whole corpus index.
const searchSplit = splitSearchIndex(searchIndex);
track(path.join(OUT, 'search', 'discovery.json'), searchSplit.discovery);
track(path.join(OUT, 'search', 'discovery-ml.json'), searchSplit.discoveryMl);
const shardSizes: Array<{ textId: string; bytes: number }> = [];
for (const [textId, entries] of searchSplit.shards) {
  const file = path.join(OUT, 'search', 'texts', `${textId}.json`);
  bytes += writeJson(file, { version: 2, generatedAt: searchIndex.generatedAt, entries });
  const stat = fs.statSync(file);
  shardSizes.push({ textId, bytes: stat.size });
  files += 1;
}
// The monolithic index is superseded by the tiered layout; never ship a
// stale copy from an earlier generation.
fs.rmSync(path.join(OUT, 'search-index.json'), { force: true });
shardSizes.sort((a, b) => b.bytes - a.bytes);
const kinds: Record<string, number> = {};
for (const entry of searchIndex.entries) kinds[entry.kind] = (kinds[entry.kind] || 0) + 1;
track(path.join(OUT, 'search-index-meta.json'), {
  version: 2,
  generatedAt: searchIndex.generatedAt,
  entries: searchIndex.entries.length,
  kinds,
  tiers: {
    discoveryEntries: searchSplit.discovery.entries.length,
    shards: shardSizes,
  },
});

// Cross-text concept occurrence index: normalised identity → every text
// occurrence with unit id/number/section only. Unit content stays lazy.
const occurrenceIndex = buildConceptOccurrenceIndex(
  corpus.texts.map((text) => ({
    traditionId: text.traditionId,
    textId: text.id,
    concepts: text.concepts,
    units: text.units,
  })),
);
track(path.join(OUT, 'concepts', 'index.json'), occurrenceIndex);
const multiText = occurrenceIndex.concepts.filter((c) => c.occurrences.length > 1).length;

console.log(`Content chunks: ${files} files, ${(bytes / 1024 / 1024).toFixed(1)} MB → ${OUT}/`);
console.log(`Texts: ${summaries.length} · Units: ${summaries.reduce((n, s) => n + s.unitCount, 0)} · Warnings: ${validation.warnings.length}`);
console.log(`Concept identities: ${occurrenceIndex.concepts.length} · multi-text: ${multiText}`);
