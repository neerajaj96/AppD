import { migrateLegacyStudyState, normaliseStudyState } from './migrations';
import { emptyStudyState } from './schema';

describe('study-state migrations', () => {
  it('migrates an empty storage to a versioned state', () => {
    const state = migrateLegacyStudyState();
    expect(state.version).toBe(2);
    expect(state.bookmarks).toEqual([]);
  });

  it('normalises unknown payloads without throwing', () => {
    const state = normaliseStudyState({ language: 'xx', fontScale: 99, bookmarks: [{ nope: 1 }] });
    expect(state.language).toBe('en');
    expect(state.fontScale).toBe(1);
    expect(state.bookmarks).toEqual([]);
  });

  it('keeps valid legacy-shaped refs', () => {
    const state = normaliseStudyState({
      ...emptyStudyState(),
      bookmarks: [{ systemId: 'yoga', textId: 'yoga-sutras', verseId: 'I.2' }],
      searchHistory: ['citta', ''],
    });
    expect(state.bookmarks).toHaveLength(1);
    expect(state.searchHistory).toEqual(['citta']);
  });
});
