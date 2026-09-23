# Legacy Migration (KEEP / MIGRATE / DEPRECATE / DELETE)

## Status after the runtime-pipeline phase

### REPLACED (runtime no longer imports the corpus)

- Screen data loading (`TextIndex`, `VerseDetail`, `ConceptDetail`,
  `ThreadView`, `Home`, `SystemDetail`, header, search palette) now runs
  through `src/content/v2/repository.ts` over `public/content/` chunks.
- Runtime reference resolution moved from `src/utils/references.ts` to
  in-text repository queries over loaded chunks.
- Runtime search moved from `src/utils/searchIndex.ts` (full-corpus
  scan) to `src/search/client.ts` over the generated index.
- Inline link parsing (`src/utils/crossref.ts`) is corpus-free with
  injectable resolvers; `RichText` resolves against loaded chunks.
- `resolveVerseRefs` is async over chunks (same storage contract).

## KEEP

- `src/content/` corpus files — canonical philosophical sources for
  chunk generation; V2 adapts them without rewriting.
- `src/content/factory.ts`, `src/content/index.ts` — build-time and
  test-only assembly (scripts + vitest). Never imported by browser code.
- `src/components/Primitives.tsx`, `src/index.css`, `src/theme/tokens.ts`,
  `src/utils/theme.ts` — Guṇa design truth.
- `public/manifest.webmanifest`, `index.html` — PWA shell.

## MIGRATE (done except where noted)

- Content discovery → manifest-first chunks (`src/content/v2/chunks.ts`).
  Done; `createMemoryLoader` remains for tests/CLI.
- Continuity stores (`bookmarks.ts`, `readingHistory.ts`,
  `searchHistory.ts`, `threadProgress.ts`) → `src/study/` unified store.
  Storage kept; history resolution is async. Full store adoption pending.
- Handwritten `public/sw.js` assumptions → versioned strategy in
  `src/offline/strategy.ts` (worker replacement lands later).
- Hash routes → canonical URLs (see `docs/ROUTING_MIGRATION.md`).

## DEPRECATE (do not extend)

- `src/utils/references.ts`, `src/utils/searchIndex.ts` — retained for
  the vitest integrity/search suites only; screens must not re-import
  them or the corpus returns to the bundle.
- Root `App.tsx` Expo entry — retained reference only, excluded from
  typecheck/build.
- `scripts/append-all.ts`, `append-tantraloka.ts`, `merge-*` helpers —
  superseded by `scripts/validate-content.ts`, `content-report.ts` and
  `build-search-index.ts`. They assume `npx tsx`, which is not installed;
  new scripts run through esbuild, which ships with Vite.

## DELETE (candidates, pending reference check)

- Redundant `bun.lock` alongside `package-lock.json` (npm is the
  documented installer; confirm no Bun workflow needs it first).
- React-Native-only ESLint plugins in `.eslintrc.js` for web code.
- Unused assets under `public/assets` and `assets/` once the audit
  confirms no references.
- Obsolete `.env.example` entries with no consumer.

## Configuration conflicts found

- `package.json` documents `npm run lint` as `tsc --noEmit`, but
  `tsconfig.json` excludes `scripts/`, tests and `ErrorBoundary` — lint
  currently typechecks a subset. `tsconfig.v2.json` adds strict coverage
  for the new foundation.
- Legacy scripts assume `tsx`; the repo has no such dependency. New
  content scripts use the bundled esbuild runner instead.
