/**
 * Reading display preferences (Prompt 4 — scholarly reader).
 *
 * Which layers of a unit the reader wants to see: Sanskrit source
 * (Devanāgarī + IAST together, since they are one textual object),
 * translation and commentary. Persisted in localStorage beside the text
 * scale, fail-silent in private mode, and independent of routing and
 * study state. Pure load/save helpers so the persistence contract is
 * unit-testable without rendering React.
 */

export interface ReadingDisplayPrefs {
  showSanskrit: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
}

export const DEFAULT_DISPLAY_PREFS: ReadingDisplayPrefs = {
  showSanskrit: true,
  showTranslation: true,
  showCommentary: true,
};

const STORAGE_KEY = 'darsana_reading_display';

function storage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function sanitise(raw: unknown): ReadingDisplayPrefs {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_DISPLAY_PREFS };
  const r = raw as Partial<Record<keyof ReadingDisplayPrefs, unknown>>;
  return {
    showSanskrit: typeof r.showSanskrit === 'boolean' ? r.showSanskrit : DEFAULT_DISPLAY_PREFS.showSanskrit,
    showTranslation: typeof r.showTranslation === 'boolean' ? r.showTranslation : DEFAULT_DISPLAY_PREFS.showTranslation,
    showCommentary: typeof r.showCommentary === 'boolean' ? r.showCommentary : DEFAULT_DISPLAY_PREFS.showCommentary,
  };
}

/** Load persisted display prefs, falling back to all-visible. Never throws. */
export function loadDisplayPrefs(): ReadingDisplayPrefs {
  try {
    const store = storage();
    if (!store) return { ...DEFAULT_DISPLAY_PREFS };
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DISPLAY_PREFS };
    return sanitise(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_DISPLAY_PREFS };
  }
}

/** Persist display prefs. Never throws. */
export function saveDisplayPrefs(prefs: ReadingDisplayPrefs): void {
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(sanitise(prefs)));
  } catch {
    // Private mode — the session simply keeps the in-memory prefs.
  }
}
