import { emptyStudyState, type StudyState } from './schema';
import { migrateLegacyStudyState, normaliseStudyState } from './migrations';

/**
 * Unified study store (V2 foundation).
 *
 * Tiny preferences (language, font scale) stay in localStorage; structured
 * study data (bookmarks, history, thread progress, search history, notes,
 * highlights, offline selections) moves to IndexedDB where available, with
 * a localStorage fallback so private mode and older browsers keep working.
 * Stored payloads carry `StudySchemaVersion` and migrate forward.
 */

const PREF_KEY = 'darsana_study_prefs_v2';
const STRUCTURED_KEY = 'darsana_study_v2';
const DB_NAME = 'darsana-study';
const DB_STORE = 'state';
const DB_KEY = 'v2';

function readPrefs(): Partial<StudyState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (raw) return normaliseStudyState(JSON.parse(raw));
  } catch {
    // Fall through to legacy migration.
  }
  return migrateLegacyStudyState();
}

function openDb(): Promise<IDBDatabase | undefined> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(undefined);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(DB_STORE)) {
          request.result.createObjectStore(DB_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

async function readStructured(): Promise<Partial<StudyState>> {
  const db = await openDb();
  if (!db) {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(STRUCTURED_KEY);
      return raw ? normaliseStudyState(JSON.parse(raw)) : {};
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = () => resolve(req.result ? normaliseStudyState(req.result) : {});
      req.onerror = () => resolve({});
    } catch {
      resolve({});
    }
  });
}

async function writeStructured(state: StudyState): Promise<void> {
  const db = await openDb();
  if (!db) {
    try {
      window.localStorage.setItem(STRUCTURED_KEY, JSON.stringify(state));
    } catch {
      // Fail-silent by contract.
    }
    return;
  }
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put({ ...state }, DB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
  try {
    window.localStorage.setItem(
      PREF_KEY,
      JSON.stringify({ language: state.language, fontScale: state.fontScale, version: state.version }),
    );
  } catch {
    // Preferences are a courtesy.
  }
}

export class StudyStore {
  private state: StudyState;
  private listeners = new Set<(state: StudyState) => void>();

  constructor(initial?: StudyState) {
    this.state = initial || { ...emptyStudyState(), ...readPrefs() };
  }

  static async load(): Promise<StudyStore> {
    const prefs = readPrefs();
    const structured = await readStructured();
    const merged = normaliseStudyState({ ...emptyStudyState(), ...prefs, ...structured });
    if (Object.keys(structured).length === 0 && typeof window !== 'undefined') {
      // First V2 run: persist the migrated legacy snapshot for later loads.
      const store = new StudyStore(merged);
      await store.persist();
      return store;
    }
    return new StudyStore(merged);
  }

  get(): StudyState {
    return this.state;
  }

  subscribe(listener: (state: StudyState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) listener(this.state);
  }

  async update(patch: Partial<StudyState>): Promise<void> {
    this.state = normaliseStudyState({ ...this.state, ...patch });
    await this.persist();
    this.emit();
  }

  async persist(): Promise<void> {
    await writeStructured(this.state);
  }
}
