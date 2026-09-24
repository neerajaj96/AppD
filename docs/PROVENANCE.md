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

## Pilot: Devi-Mahatmya (repeatable editorial workflow)

The first text curated end-to-end (182/184 units with source locators;
2 honestly unresolved). It was selected because its legacy table maps
app sections to source pages — the only such evidence in the corpus.

1. **Trace**: `devi-mahatmya-source-provenance.ts` (44 rows of
   `appIds → pdfPages` against an 814-page edition) plus per-unit
   `interpretiveNotes` already in the content.
2. **Text record**: the table travels verbatim as notes on one
   `V2Source` (`devi-mahatmya-source-notes`); no author/year/publisher
   fields exist in evidence, so none were created.
3. **Unit locators**: `extractLocatorStems` reduces rows to dash-boundary
   prefix stems (slash lists yield nothing); `matchUnitLocator` takes
   the longest match (`dm-1-` can never catch `dm-13-5`). Matched units
   get `provenance.locator` (the row's page range, e.g. `pp.472-523`);
   the rest stay absent. The build refuses to emit on zero matches and
   prints the coverage count.
4. **Citation**: unit locators flow into `formatCitation`, e.g.
   `Devīmāhātmyam, 8.39-42. Sage Mārkaṇḍeya / Sage Medhas. pp.472-523.
   Darśana canonical unit: <url>.`
5. **Uncertainty kept**: no editorial states asserted (review status
   unknown), 2 units unresolved, other texts untouched.

To scale to another text: supply a per-section locator table (or accept
notes-only records), add its mapping in `build-content-chunks.ts`,
extend the pilot tests, and confirm validator errors stay zero. Unit
variants, translation provenance and editorial review states follow the
same `provenance`/`sourceIds`/notes mechanisms — no new systems.
