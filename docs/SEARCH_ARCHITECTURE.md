# Search Architecture

Build-time generation first, worker-ready consumption later.

- **Generation** (`src/content/v2/search-index.ts`,
  `scripts/build-search-index.ts`): entries for traditions, texts,
  canonical units, concepts and thread steps with English, Malayalam,
  Devanagari, IAST and ASCII-normalised fields plus unit numbers and
  names. Output is JSON (`dist/search-index.json` by default) with a
  kind breakdown logged to the terminal.
- **Runtime today**: `src/utils/searchIndex.ts` remains the shipped
  in-memory verse search. The V2 index does not replace it yet; it
  establishes the data shape the worker will consume.
- **Worker path**: the index is plain JSON with stable `key`,
  `traditionId`, `textId`, `unitId`/`conceptId` and `kind` fields, so
  ranking can move off the main thread without re-modelling.

Run `npm run content:index` to regenerate; per-text chunk emission is
the next recommended phase.
