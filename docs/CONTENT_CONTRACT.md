# Content Contract (V2, schemaVersion 2)

Pure-data contract in `src/content/v2/schema.ts`; JSON Schema mirrors in
`content/schema/`. The model supports the existing corpus without forcing
material into verse semantics.

## Entities

- **Tradition**: `id`, `title`, `category` (eight scholarly categories),
  optional description and accent key. IDs reuse system IDs.
- **Text**: `id`, `title`, `transliteratedTitle`, `author`,
  `traditionalAttribution`, `traditionId`, `sourceRole` (`primary`,
  `scripture`, `commentary`, `devotional`, `secondary`,
  `modern-synthesis`, `practice`, `reference`), `description`,
  `contentStatus`, `languages`, `units`, `concepts`, optional threads,
  sources, diagrams, aliases, provenance and editorial status.
- **CanonicalUnit**: `id`, `number`, `section`, `subsection`, `unitType`
  (`sutra`, `sloka`, `karika`, `mantra`, `verse`, `paragraph`, `section`),
  `devanagari`, `iast`, language-independent `metadata`,
  `localisations` (`en`/`ml` parallel, never varying canonical fields),
  concept/source/diagram references, provenance and editorial status.
- **Localisation**: `title`, `translation`, `commentary`, `summary`,
  `narrative`, `keyPoints`, `wordMeaning`, `variantNote`,
  `beginnerExplanation`, `advancedExplanation`, `misconceptions`. No field
  is required for every unit type.
- **Concept**: `id`, `category`, `diagramIds`, `relatedUnitIds`,
  `relatedConceptIds`, parallel localisations, provenance, editorial.
- **Thread**: curated flat sequence of `ThreadStep` (`conceptId`,
  `unitIds`, localised narrative). No nested modules.
- **Reference**: typed `kind` (`unit-to-concept`, `concept-to-unit`,
  `concept-to-concept`, `unit-to-unit`, `text-to-text`,
  `thread-to-concept`, `thread-to-unit`, `concept-to-tradition`,
  `cross-tradition`, `source-to-unit`) with `from`/`to`.
- **Source / Provenance**: title, author, edition, publisher, year,
  translator, page, section, volume, locator, URL, rights
  (`public-domain`, `original`, `licensed`, `unknown`), notes. Unknown
  stays unknown — ingestion never fabricates values.
- **EditorialStatus**: field-level states (`missing`, `draft`,
  `generated`, `review-needed`, `reviewed`, `verified`) for Sanskrit,
  IAST, English/Malayalam translation and commentary, concepts,
  references and provenance.
- **Diagram**: `id` + `title`, registered centrally.
- **Alias**: human alias → canonical ID. Namespaced canonical IDs use
  `tradition::local` where ambiguity exists (for example
  `samkhya::satkaryavada`). Ambiguous aliases report `ambiguous`; they
  never resolve silently.
- **Manifest**: `schemaVersion`, `textId`, `traditionId`, unit counts
  (`expected`/`present`), per-language unit/concept counts, status and
  source. Generated from actual data only.
