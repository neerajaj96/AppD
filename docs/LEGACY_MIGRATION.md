# Legacy Migration (KEEP / MIGRATE / DEPRECATE / DELETE)

Surveyed in this phase; nothing below is deleted yet. All paths verified
against the working tree.

## KEEP

- `src/content/` corpus files — canonical philosophical content; V2
  adapts them without rewriting.
- `src/content/factory.ts`, `src/content/index.ts` — runtime compiler
  until chunked loading ships.
- `src/utils/references.ts`, `src/utils/searchIndex.ts` — shipped graph
  and search until V2 replacements land.
- `src/components/Primitives.tsx`, `src/index.css`, `src/theme/tokens.ts`,
  `src/utils/theme.ts` — Guṇa design truth.
- `public/manifest.webmanifest`, `index.html` — PWA shell.

## MIGRATE

- Content discovery → manifest-first chunks (`src/content/v2/chunks.ts`).
- Continuity stores (`bookmarks.ts`, `readingHistory.ts`,
  `searchHistory.ts`, `threadProgress.ts`) → `src/study/` unified store.
- Handwritten `public/sw.js` assumptions → versioned strategy in
  `src/offline/strategy.ts` (worker replacement lands later).
- Hash routes → canonical URLs (see `docs/ROUTING_MIGRATION.md`).

## DEPRECATE (do not extend)

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
