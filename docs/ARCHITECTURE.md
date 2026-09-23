# Architecture (V2 foundation)

The web client in `src/` remains the shipped target (HashRouter, Vite,
`src/main.tsx`). This phase introduces a content-first scholarly library
layer beside the existing monolith — it does not replace screens yet.

## Layers

- **Canonical contract** (`src/content/v2/schema.ts`, `content/schema/*.json`):
  versioned (`schemaVersion: 2`) pure-data entities for tradition, text,
  canonical unit, concept, thread, reference, source, provenance,
  editorial status, diagram and alias. No React dependency.
- **Traditions** (`src/content/v2/tradition.ts`): explicit scholarly
  categories (philosophical school, scriptural, sectarian, Tantric,
  devotional, practice, modern synthesis, secondary exposition) reusing
  existing system IDs so shared links keep working.
- **Ingestion** (`src/content/v2/ingest.ts`): normalises JSON, legacy
  TypeScript maps, generated output and manifests into V2.
- **Compatibility** (`src/content/v2/adapters.ts`): legacy `System` →
  V2 corpus without data loss. The old factory stays runtime truth until
  chunked loading ships.
- **Validation / reporting** (`src/content/v2/validate.ts`,
  `report.ts`, `scripts/validate-content.ts`, `scripts/content-report.ts`).
- **Chunking** (`src/content/v2/chunks.ts`): manifest-first addresses
  (`/content/<text>/manifest`, `/content/<text>/section/<s>`, …) and a
  `TextChunkLoader` interface. The memory loader proves discovery without
  importing every text.
- **Search** (`src/content/v2/search-index.ts`,
  `scripts/build-search-index.ts`): build-time multilingual index shaped
  for a future Web Worker consumer.
- **Graph** (`src/content/v2/graph.ts`): canonical-ID lookups with
  explicit `found | missing | ambiguous` states.
- **Design** (`src/design/semantic-tokens.ts`): Guṇa palette preserved,
  exposed as semantic roles.
- **Accessibility** (`src/a11y/`): focus, dialog/sheet trap, live
  regions, keyboard roving, reduced-motion and language metadata.
- **Study state** (`src/study/`): versioned store unifying bookmarks,
  history, thread progress, searches, notes, highlights and offline
  selections; IndexedDB first, localStorage fallback, legacy migration.
- **Offline** (`src/offline/strategy.ts`): shell / metadata / text-pack
  cache architecture with versioned names.

## What still uses the monolith

Runtime screens, `src/content/index.ts`, `factory.ts`,
`src/utils/references.ts` and `searchIndex.ts` are unchanged. V2 modules
read an adapted snapshot; they never mutate legacy content.
