# Type Safety — migration debt

## Done in this phase

- New foundation is strict: `tsconfig.v2.json` enables `strict: true`
  and `noImplicitOverride` for `src/content/v2/`, `src/study/`,
  `src/a11y/`, `src/design/`, `src/offline/` and the three content
  scripts. `npm run typecheck` covers both the legacy config and V2.
- Canonical content types, adapters, validators, graph, chunking and
  search-index builders live under that strict boundary.

## Remaining debt

- Root `tsconfig.json` stays `strict: false` so the existing corpus and
  screens keep building. Enabling `strict: true` globally today would
  produce hundreds of unrelated errors in legacy content files.
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are
  intentionally off even in V2: the corpus uses indexed access and
  optional localisation fields pervasively, and enabling them now would
  add noise without scholarly value. Revisit after chunked JSON lands.
- `scripts/` legacy helpers (`append-*`, `merge-*`) remain outside both
  typechecks; they are deprecated in favour of the V2 scripts.
