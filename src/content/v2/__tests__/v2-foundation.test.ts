import { systems } from '../../index';
import { adaptSystemsToV2 } from '../adapters';
import { SCHEMA_VERSION } from '../schema';
import { buildAliasTable, isCanonicalId, normaliseId, resolveAlias } from '../ids';
import { validateCorpus } from '../validate';
import { buildContentReport } from '../report';
import { buildManifest, createMemoryLoader } from '../chunks';
import { buildSearchIndex } from '../search-index';
import { createGraph } from '../graph';

describe('V2 foundation', () => {
  it('carries schemaVersion 2', () => {
    expect(SCHEMA_VERSION).toBe(2);
    const corpus = adaptSystemsToV2(systems);
    expect(corpus.schemaVersion).toBe(2);
    expect(corpus.texts.length).toBeGreaterThan(0);
  });

  it('validates canonical IDs and namespaced forms', () => {
    expect(isCanonicalId('satkaryavada')).toBe(true);
    expect(isCanonicalId('samkhya::satkaryavada')).toBe(true);
    expect(isCanonicalId('')).toBe(false);
    expect(isCanonicalId('a::b::c')).toBe(false);
    expect(normaliseId('satkāryavāda')).toBe('satkaryavada');
  });

  it('never resolves an ambiguous alias silently', () => {
    const table = buildAliasTable([
      { alias: 'maya', canonicalId: 'vedanta::maya' },
      { alias: 'māyā', canonicalId: 'tantra::maya' },
    ]);
    const resolved = resolveAlias('maya', table);
    expect(resolved.status).toBe('ambiguous');
  });

  it('adapts legacy content without data loss', () => {
    const corpus = adaptSystemsToV2(systems);
    const legacyUnits = systems.flatMap((s) => s.texts.flatMap((t) => t.verses)).length;
    const adaptedUnits = corpus.texts.flatMap((t) => t.units).length;
    expect(adaptedUnits).toBe(legacyUnits);
    const legacyConcepts = systems.flatMap((s) => s.texts.flatMap((t) => t.concepts)).length;
    const adaptedConcepts = corpus.texts.flatMap((t) => t.concepts).length;
    expect(adaptedConcepts).toBe(legacyConcepts);
  });

  it('keeps English/Malayalam as parallel localisations of one unit', () => {
    const corpus = adaptSystemsToV2(systems);
    const withBoth = corpus.texts.flatMap((t) => t.units).filter((u) => u.localisations.en && u.localisations.ml);
    expect(withBoth.length).toBeGreaterThan(0);
    for (const unit of withBoth.slice(0, 20)) {
      expect(unit.id).toBeTruthy();
      expect(unit.number).toBeTruthy();
    }
  });

  it('validates the adapted corpus with no dangling intra-text errors', () => {
    const corpus = adaptSystemsToV2(systems);
    const result = validateCorpus(corpus);
    // The legacy corpus is stitched bidirectionally, so adapted intra-text
    // references must hold. Surface the first error if this regresses.
    expect(result.errors.slice(0, 5)).toEqual([]);
  });

  it('generates manifests from actual data', () => {
    const corpus = adaptSystemsToV2(systems);
    const text = corpus.texts[0];
    if (!text) throw new Error('no texts');
    const manifest = buildManifest(text);
    expect(manifest.schemaVersion).toBe(2);
    expect(manifest.units.present).toBe(text.units.length);
    expect(manifest.languages.en.units).toBeLessThanOrEqual(text.units.length);
  });

  it('creates a memory chunk loader that never imports every text to list', async () => {
    const corpus = adaptSystemsToV2(systems);
    const loader = createMemoryLoader(corpus);
    const manifests = await loader.listManifests();
    expect(manifests.length).toBe(corpus.texts.length);
    const first = manifests[0];
    if (!first) throw new Error('no manifests');
    expect(await loader.loadManifest(first.textId)).toMatchObject({ textId: first.textId });
  });

  it('builds a search index covering units, concepts and threads', () => {
    const corpus = adaptSystemsToV2(systems);
    const index = buildSearchIndex(corpus);
    expect(index.version).toBe(2);
    expect(index.entries.length).toBeGreaterThan(corpus.texts.length);
    expect(index.entries.some((e) => e.kind === 'unit')).toBe(true);
    expect(index.entries.some((e) => e.kind === 'concept')).toBe(true);
  });

  it('resolves canonical graph lookups and reports ambiguity explicitly', () => {
    const corpus = adaptSystemsToV2(systems);
    const graph = createGraph(corpus);
    const firstText = corpus.texts[0];
    if (!firstText) throw new Error('no texts');
    const firstUnit = firstText.units[0];
    if (firstUnit) {
      const hit = graph.getUnit(firstText.traditionId, firstText.id, firstUnit.id);
      expect(hit.status).toBe('found');
      expect(graph.getUnit(firstText.traditionId, firstText.id, 'no-such-unit')?.status).toBe('missing');
    }
    const report = buildContentReport(corpus);
    expect(report.units).toBeGreaterThan(0);
    expect(report.texts).toBe(corpus.texts.length);
  });
});
