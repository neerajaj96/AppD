# Provenance

Provenance is explicit and conservative. The V2 `SourceProvenance` shape
(`src/content/v2/schema.ts`, mirrored in
`content/schema/provenance.json`) records source title, author, edition,
publisher, year, translator, page, section, volume, locator, source URL,
rights status (`public-domain`, `original`, `licensed`, `unknown`) and
free-form notes.

Rules:

- Unknown information remains unknown; ingestion and manifests never
  fabricate counts, dates or translators.
- URLs are validated for shape only; rights default to `unknown` unless
  the source states otherwise.
- Unit, concept and text provenance share one shape so reports can
  distinguish complete, partial and unknown coverage uniformly.

## Four distinct things (do not merge them)

- **Source record** (`V2Source`, per-text `sources.json`): a stable,
  canonical registry entry describing where content came from. Only
  carried fields render; missing author/year/translator/publisher data
  is never invented. Legacy free-form provenance statements travel
  verbatim as `notes` on one record per text
  (`src/content/v2/textSources.ts`); they are never parsed into fake
  structured fields.
- **Unit provenance** (`CanonicalUnit.provenance`): what is known about
  one specific unit. Empty across the current corpus.
- **Editorial status** (`EditorialStatus`): field-level workflow state
  (`missing`/`draft`/`reviewed`/…), not a source claim.
- **Canonical citation**: a deterministic string built only from
  available metadata (text title, unit number, known author/edition/
  locator) plus the canonical unit URL
  (`src/content/v2/citation.ts`). Copy uses the clipboard API with a
  live-region announcement; no external libraries.

## Runtime path

React → `V2Repository.getSources/getSource` → `text/sources.json`
(loader-cached `LoadResult`s) → `SourceList` / `Citation UI`. Units link
to records through `sourceIds`, validated per text (duplicates and
dangling references are errors, malformed URLs warnings).
