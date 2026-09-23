# Study State

`src/study/` unifies the current independent localStorage stores without
deleting them yet.

- **Schema** (`schema.ts`): versioned (`STUDY_SCHEMA_VERSION = 2`)
  state holding language, reading preferences, bookmarks, recent
  history, thread progress, search history, notes, highlights and
  offline selections.
- **Migrations** (`migrations.ts`): fail-silent, idempotent recovery of
  `darsana_bookmarks`, `darsana_recent_verses`,
  `darsana_recent_searches`, `darsana_thread_step_*` and preference
  keys into V2. Malformed entries are dropped, never thrown.
- **Store** (`store.ts`): `StudyStore` with subscribe/update/persist.
  Structured data prefers IndexedDB (`darsana-study`); tiny preferences
  stay in localStorage; a localStorage fallback covers private mode.
  First V2 load persists the migrated legacy snapshot.

Existing continuity modules remain operational; adoption is incremental.
