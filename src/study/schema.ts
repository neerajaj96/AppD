/**
 * Unified study-state schema (V2 foundation).
 *
 * The current app keeps several independent localStorage stores
 * (bookmarks, recent history, thread progress, search history, reading
 * preferences). This schema versions a single study state that can hold
 * them together, with IndexedDB reserved for structured data (notes,
 * highlights, offline selections) and localStorage kept for tiny
 * preference values only.
 */

export const STUDY_SCHEMA_VERSION = 2 as const;

export interface VerseRef {
  systemId: string;
  textId: string;
  verseId: string;
}

export interface StudyNote {
  id: string;
  ref: VerseRef;
  body: string;
  updatedAt: string;
}

export interface Highlight {
  id: string;
  ref: VerseRef;
  excerpt: string;
  createdAt: string;
}

export interface StudyState {
  version: typeof STUDY_SCHEMA_VERSION;
  language: 'en' | 'ml';
  fontScale: 1 | 1.125 | 1.25;
  bookmarks: VerseRef[];
  recentHistory: VerseRef[];
  threadProgress: Record<string, number>;
  searchHistory: string[];
  notes: StudyNote[];
  highlights: Highlight[];
  offlineSelections: string[];
}

export function emptyStudyState(): StudyState {
  return {
    version: STUDY_SCHEMA_VERSION,
    language: 'en',
    fontScale: 1,
    bookmarks: [],
    recentHistory: [],
    threadProgress: {},
    searchHistory: [],
    notes: [],
    highlights: [],
    offlineSelections: [],
  };
}
