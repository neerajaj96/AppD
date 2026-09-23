# Routing Migration Plan (hash → canonical URLs)

No routes are rewritten in this phase. The future system keeps every
existing identifier and adds canonical paths.

## Current (HashRouter)

- `/` home
- `/intro`
- `/system/:systemId`
- `/system/:systemId/thread`
- `/system/:systemId/text/:textId`
- `/system/:systemId/text/:textId/verse/:verseId`
- `/system/:systemId/text/:textId/concept/:conceptId`

## Future (canonical)

- `/darshana/:tradition` (≡ current system)
- `/text/:text` with tradition inferred from manifest
- `/text/:text/verse/:locator` (`section:number` or canonical unit id)
- `/text/:text/concept/:concept`
- `/thread/:tradition`
- `/compare` and `/sources` views backed by V2 references and provenance

## Compatibility

- Tradition IDs reuse system IDs (`samkhya`, `yoga`, …); text, unit and
  concept IDs are preserved verbatim by the V2 adapter.
- Shared `#/` links must redirect (client-side map from old hash to new
  path) for at least two releases.
- Locators accept both canonical numbers (`I.2`, `1.1.1`) and unit IDs;
  malformed locators surface a not-found state, never a guess.
