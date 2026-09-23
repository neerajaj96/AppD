# Content Pipeline

## Flow

Legacy TypeScript content → adapter → V2 canonical model → validation →
report / manifests / search index → (future) chunked JSON → UI.

## Stages

1. **Ingest** (`src/content/v2/ingest.ts`): accepts JSON bundles, legacy
   maps, generated output and manifests; drops unknown fields and warns
   on missing canonical fields.
2. **Adapt** (`src/content/v2/adapters.ts`): temporary compatibility path
   from `src/content/index.ts` systems into a V2 corpus snapshot. Unit
   types and source roles are inferred from `verseTerm`/text IDs using
   documented heuristics; no philosophical text is rewritten.
3. **Validate** (`scripts/validate-content.ts` + `src/content/v2/validate.ts`):
   duplicate IDs/numbers, cross-namespace collisions, missing canonical
   fields, malformed localisation, en/ml identity mismatches, dangling
   concept/unit/thread/diagram references, invalid tradition/text IDs,
   ambiguous aliases, malformed provenance and Markdown, broken explicit
   references and locators. JSON (`--json`) and human output; non-zero
   exit on errors, warnings distinct.
4. **Report** (`scripts/content-report.ts` + `report.ts`): systems,
   texts, units, concepts, threads, en/ml coverage, provenance and
   reference health with problem entity IDs.
5. **Manifests** (`src/content/v2/chunks.ts`): per-text manifests with
   real counts; chunk addresses under `/content/<text>/…`.
6. **Search index** (`scripts/build-search-index.ts` +
   `search-index.ts`): build-time multilingual entries for a future
   worker consumer.

## Legacy factory

`src/content/factory.ts` is retained. It remains the runtime stitcher
until chunked loading ships; the adapter documents the temporary bridge.
