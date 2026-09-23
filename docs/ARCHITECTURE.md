# Architecture (V2 runtime pipeline)

The web client in `src/` remains the shipped target (HashRouter, Vite,
`src/main.tsx`). Content now loads as static JSON chunks — the initial
bundle no longer contains the philosophical corpus.

## Runtime flow

React → V2 repository (`src/content/v2/repository.ts`) → fetch chunk
loader (`src/content/v2/chunks.ts`) → `public/content/` JSON → only the
opened text.

## Shell and navigation

- **Shell** (`src/App.tsx`): sticky two-row header (brand + global
  search + EN/ML toggle; route-aware primary nav for Home, Traditions,
  Threads, Introduction), skip link, `max-w-4xl` main, minimal footer.
  New `/threads` route serves the catalog-only threads index.
- **Home** (`src/components/Home.tsx`): hero → continue reading →
  traditions grid → guided threads → saved/recent → library
  orientation. The header Traditions link lands on `/?focus=traditions`
  and scrolls to the grid.
- **Tradition page** (`src/components/SystemDetail.tsx`): collection
  landing from the global manifest only (stats, thread doorway with
  progress, text cards with EN/ML badges).
- **Primitives** (`src/components/Primitives.tsx`): generic,
  data-agnostic `PageHeader`, `SectionHeader`, `MetaRow`, `LoadingState`
  and `EmptyState` beside the existing set.

## Layers

- **Chunk generation** (`scripts/build-content-chunks.ts`, `npm run
  content:chunks`): legacy corpus → V2 adapter → validation (fails the
  build on errors) → `public/content/manifest.json`, per-text
  `manifest.json`/`meta.json`/`threads.json`, section-grouped
  `units/chunk-N.json`, `concepts/chunk-N.json`,
  `threads/<tradition>.json` and `search-index.json`. Units split at
  ≤150 per chunk, concepts at ≤200. Generated output is gitignored and
  rebuilt in dev (`predev --if-missing`), CI and `npm run build`.
- **Loader** (`src/content/v2/chunks.ts`): `FetchChunkLoader` with an
  in-memory session cache and typed `ok | missing | offline | error`
  results. Discovery happens through the global manifest only.
- **Repository** (`src/content/v2/repository.ts`): `getTraditions`,
  `getText`, `getUnits`, `getUnit`, `getConcepts`, `getConcept`,
  `getThreads`, `getTraditionThread` plus in-text relation queries.
  React-independent; screens use `src/content/v2/hooks.ts`.
- **Compatibility** (`src/content/v2/compat.ts`): V2 → legacy shapes
  with IDs preserved verbatim (bookmarks, history, thread progress and
  URLs keep working).
- **Search** (`src/search/`): pure ranking (`rank.ts`) shared by a Web
  Worker (`search-worker.ts`, index fetched inside the worker) and a
  main-thread fallback (`client.ts`). The palette queries the generated
  index; nothing scans the corpus at runtime.
- **Linkifier** (`src/utils/crossref.ts`): corpus-free with injectable
  resolvers. Build-time tests inject the strict registry; `RichText`
  resolves bare concept links against the loaded text's concept set.
- **Study state** (`src/study/`): unchanged storage contract; history
  resolution is async over chunks (`resolveVerseRefs`).
- **Offline** (`public/sw.js`, cache `darsana-v2`): same-origin GETs —
  including content chunks and the search index — cache on first use.

## What still uses the monolith

Only build-time Node (chunk generation, validators, reports) and the
vitest integrity suite import `src/content/index.ts`. The deprecated
runtime modules `src/utils/references.ts` and `src/utils/searchIndex.ts`
are retained for tests only and must not be re-imported by screens.
