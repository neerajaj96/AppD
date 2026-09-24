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

## Scholarly reader (Prompt 4)

- **Text landing** (`TextIndex.tsx`): manifest-driven header (identity,
  author, unit/concept/language/thread stats), begin-reading and guided
  thread actions, expandable section navigation with unit ranges,
  concepts with link counts, sibling texts. No description or
  provenance is ever invented — absent fields are omitted.
- **Unit reader** (`VerseDetail.tsx`): breadcrumb → h1 identifier →
  Sanskrit object (Devanāgarī + IAST, `lang` attributes, word-wrap
  guards) → translation → commentary → textual notes → word meanings →
  key points → concepts → related units → thread appearances → prev/next
  in true V2 chunk order (`getAdjacentUnits`).
- **Preferences** (`context/readingPrefs.ts` + `ReadingContext`):
  persisted Sanskrit/translation/commentary layer toggles beside the
  text scale; `ReadingControls` exposes them only on the verse reader.
- **Provenance** (`components/Provenance.tsx`): renders V2 provenance
  and editorial states only when present (`provenanceRows` /
  `editorialRows` skip unknowns); null otherwise. No generated chunk
  currently carries provenance, so the area stays hidden until sources
  record it.
- **Selection helpers** (`content/v2/select.ts`): English-fallback
  language rule and boundary-safe adjacency as pure, tested functions.

## Concept knowledge layer (Prompt 5)

- **Occurrence index** (`content/v2/occurrences.ts`, emitted as
  `public/content/concepts/index.json`, ~1.3 MB lazy): normalised
  concept identity → every text occurrence with unit id/number/section
  only. 2752 identities, 28 multi-text. Distinct canonical triples are
  never merged; unit content still loads lazily per text.
- **Repository** additions: `getConceptOccurrences` (catalog-ordered,
  cached) and `getTraditionConceptThreadSteps` (single thread file).
  In-text relations keep resolving from loaded chunks with no extra
  requests and no second relationship system.
- **Concept page** (`ConceptDetail.tsx`): identity → summary → concept
  map → source units (with sections) → related concepts → Appears in →
  thread appearances → Related across traditions (with a shared-names
  neutrality note) → provenance. The old search-index-based
  cross-system section is replaced by the occurrence index.
- **Concept map** (`content/v2/conceptGraph.ts` + `components/concept-graph/`):
  hub-and-spoke data over real relations only (centre + ≤8 related
  concepts + ≤6 other traditions, with overflow counts; hidden when
  sparse). `ConceptExplorer` owns selection and composes the wide SVG
  viewport, the narrow tappable list (under 640px — never a shrunken
  diagram), the shape-plus-text legend and the selection detail panel
  (honest linkage vs occurrence wording, one onward action, reset).
  Zero dependencies, zero animation; nodes are keyboard-focusable
  router links with a visible-focus rule, and the semantic lists stay
  authoritative.
- **Verse reader**: related concepts render as title + summary rows
  (`RelatedConceptRows`); search concept results carry language-aware
  summary blurbs (`conceptSummary` in `search/rank.ts`).

## What still uses the monolith

Only build-time Node (chunk generation, validators, reports) and the
vitest integrity suite import `src/content/index.ts`. The deprecated
runtime modules `src/utils/references.ts` and `src/utils/searchIndex.ts`
are retained for tests only and must not be re-imported by screens.
