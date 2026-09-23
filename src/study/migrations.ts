import { emptyStudyState, STUDY_SCHEMA_VERSION, type StudyState, type VerseRef } from './schema';

/**
 * Study-state migrations — recover existing localStorage stores into the
 * versioned V2 shape. Every read is fail-silent (private mode must never
 * break reading) and every migration is idempotent.
 */

const KEYS = {
  language: 'darsana_language',
  fontScale: 'darsana_font_scale',
  bookmarks: 'darsana_bookmarks',
  recent: 'darsana_recent_verses',
  searches: 'darsana_recent_searches',
  threadPrefix: 'darsana_thread_step_',
} as const;

function readJson<T>(key: string): T | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function isVerseRef(value: unknown): value is VerseRef {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as VerseRef).systemId === 'string' &&
    typeof (value as VerseRef).textId === 'string' &&
    typeof (value as VerseRef).verseId === 'string'
  );
}

function threadProgressFromStorage(): Record<string, number> {
  const out: Record<string, number> = {};
  if (typeof window === 'undefined') return out;
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(KEYS.threadPrefix)) continue;
      const systemId = key.slice(KEYS.threadPrefix.length);
      const n = Math.floor(Number(window.localStorage.getItem(key)));
      if (systemId && Number.isFinite(n) && n >= 0) out[systemId] = n;
    }
  } catch {
    // Progress is a courtesy; ignore storage failures.
  }
  return out;
}

/** Collect legacy stores into a V2 study state (version stamped). */
export function migrateLegacyStudyState(): StudyState {
  const base = emptyStudyState();
  const bookmarks = readJson<unknown[]>(KEYS.bookmarks);
  if (Array.isArray(bookmarks)) base.bookmarks = bookmarks.filter(isVerseRef).slice(0, 200);
  const recent = readJson<unknown[]>(KEYS.recent);
  if (Array.isArray(recent)) base.recentHistory = recent.filter(isVerseRef).slice(0, 12);
  const searches = readJson<unknown[]>(KEYS.searches);
  if (Array.isArray(searches)) {
    base.searchHistory = searches.filter((q): q is string => typeof q === 'string' && q.trim().length > 0).slice(0, 6);
  }
  const language = readJson<string>(KEYS.language);
  if (language === 'en' || language === 'ml') base.language = language;
  const fontScale = readJson<number>(KEYS.fontScale);
  if (fontScale === 1 || fontScale === 1.125 || fontScale === 1.25) base.fontScale = fontScale;
  base.threadProgress = threadProgressFromStorage();
  return { ...base, version: STUDY_SCHEMA_VERSION };
}

/** Validate and repair an unknown payload into a StudyState. */
export function normaliseStudyState(raw: unknown): StudyState {
  const base = emptyStudyState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<StudyState>;
  return {
    version: STUDY_SCHEMA_VERSION,
    language: r.language === 'ml' ? 'ml' : 'en',
    fontScale: r.fontScale === 1.125 || r.fontScale === 1.25 ? r.fontScale : 1,
    bookmarks: Array.isArray(r.bookmarks) ? r.bookmarks.filter(isVerseRef) : [],
    recentHistory: Array.isArray(r.recentHistory) ? r.recentHistory.filter(isVerseRef) : [],
    threadProgress:
      r.threadProgress && typeof r.threadProgress === 'object' ? (r.threadProgress as Record<string, number>) : {},
    searchHistory: Array.isArray(r.searchHistory)
      ? r.searchHistory.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
      : [],
    notes: Array.isArray(r.notes) ? r.notes : [],
    highlights: Array.isArray(r.highlights) ? r.highlights : [],
    offlineSelections: Array.isArray(r.offlineSelections) ? r.offlineSelections : [],
  };
}
