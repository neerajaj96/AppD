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
