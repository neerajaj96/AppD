import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import { Search as SearchIcon, X as ClearIcon, History as HistoryIcon } from 'lucide-react';
import { matchesSanskritQuery } from '../utils/sanskrit';
import { getTraditionDisplay, getVerseTermForSummary } from '../content/v2/catalog';
import { useCatalog } from '../content/v2/hooks';
import { getSearchClient } from '../search/client';
import type { RankedEntry } from '../search/rank';
import { getRecentSearches, recordSearch, clearSearches } from '../utils/searchHistory';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/ui';

interface PaletteRow {
  key: string;
  href: string;
  title: string;
  context: string;
}

/**
 * Corpus command palette over the generated V2 search index.
 *
 * The ranked index builds at content-chunk time and loads lazily (Web
 * Worker when available, main-thread fallback otherwise) — typing never
 * scans the legacy corpus. Browse shortcuts and tradition/text jumps come
 * from the tiny global manifest.
 */
export default function SearchPalette() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  // Deferred so each keystroke paints first and the index query
  // follows without blocking input.
  const deferredQuery = useDeferredValue(query);
  const [recents, setRecents] = useState<string[]>([]);
  const [results, setResults] = useState<RankedEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const dismiss = () => {
    setOpen(false);
    setQuery('');
    setActive(0);
  };

  // A followed result redeems its query: remember it for the empty-state
  // shortcuts. Blanks are ignored by the store itself.
  const recordCurrentQuery = () => {
    const q = query.trim();
    if (!q) return;
    recordSearch(q);
  };

  const handleResultClick = () => {
    recordCurrentQuery();
    dismiss();
  };

  const closeReturnFocus = () => {
    dismiss();
    triggerRef.current?.focus();
  };

  // Global toggle; the input itself handles Escape/arrows/Enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Autofocus + lock background scroll while open. Recents refresh on
  // every opening since the palette stays mounted in the header.
  useEffect(() => {
    if (!open) return;
    setRecents(getRecentSearches());
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Query the generated index (worker first, main-thread fallback).
  useEffect(() => {
    const raw = deferredQuery.trim();
    if (!raw || !open) {
      setResults([]);
      setSearching(false);
      return;
    }
    let live = true;
    setSearching(true);
    getSearchClient()
      .search(raw, 200)
      .then((rows) => {
        if (!live) return;
        setResults(rows);
        setSearching(false);
        setActive(0);
      });
    return () => {
      live = false;
    };
  }, [deferredQuery, open]);

  const traditions = catalog.status === 'ok' ? catalog.data.traditions : [];
  const texts = catalog.status === 'ok' ? catalog.data.texts : [];

  // Pre-typed browse shortcuts: every darshana, one tap away.
  const browse: PaletteRow[] = useMemo(
    () =>
      traditions.map((s) => {
        const display = getTraditionDisplay(s, language);
        return {
          key: `browse:${s.id}`,
          href: s.textIds.length === 1 ? `/system/${s.id}/text/${s.textIds[0]}` : `/system/${s.id}`,
          title: display.title,
          context: display.subtitle,
        };
      }),
    [traditions, language],
  );

  const groups = useMemo(() => {
    // Diacritic-normalised matching throughout (matchesSanskritQuery), so a
    // plain-ASCII query like "samkhya" still finds "Sāṃkhya".
    const raw = deferredQuery.trim();
    if (!raw) return null;

    const nav: PaletteRow[] = [];
    for (const s of traditions) {
      const display = getTraditionDisplay(s, language);
      if (
        matchesSanskritQuery(display.title, raw) ||
        matchesSanskritQuery(s.title, raw) ||
        matchesSanskritQuery(s.id as string, raw)
      ) {
        nav.push({
          key: `sys:${s.id}`,
          href: s.textIds.length === 1 ? `/system/${s.id}/text/${s.textIds[0]}` : `/system/${s.id}`,
          title: display.title,
          context: t(language, 'systemsLabel'),
        });
      }
      for (const txt of texts.filter((x) => x.traditionId === s.id)) {
        if (
          matchesSanskritQuery(txt.transliteratedTitle, raw) ||
          matchesSanskritQuery(txt.textId as string, raw)
        ) {
          nav.push({
            key: `txt:${s.id}:${txt.textId}`,
            href: `/system/${s.id}/text/${txt.textId}`,
            title: txt.transliteratedTitle,
            context: display.title,
          });
        }
      }
      if (nav.length >= 6) break;
    }

    const textById = new Map(texts.map((x) => [x.textId, x]));
    const traditionById = new Map(traditions.map((x) => [x.id, x]));
    const rowFor = (entry: RankedEntry['entry']): PaletteRow | undefined => {
      const traditionTitle = traditionById.has(entry.traditionId)
        ? getTraditionDisplay(traditionById.get(entry.traditionId) as (typeof traditions)[number], language).title
        : entry.traditionId;
      if (entry.kind === 'unit' && entry.unitId) {
        const summary = textById.get(entry.textId);
        const term = getVerseTermForSummary(summary, 1);
        const snippet = (entry.en || '').split('\n')[0]?.slice(0, 90);
        return {
          key: entry.key,
          href: `/system/${entry.traditionId}/text/${entry.textId}/verse/${entry.unitId}`,
          title: `${term} ${entry.number || entry.unitId}`,
          context: `${traditionTitle} • ${summary?.transliteratedTitle || entry.textId}${snippet ? ` — ${snippet}` : ''}`,
        };
      }
      if (entry.kind === 'concept' && entry.conceptId) {
        const summary = textById.get(entry.textId);
        return {
          key: entry.key,
          href: `/system/${entry.traditionId}/text/${entry.textId}/concept/${entry.conceptId}`,
          title: entry.title || entry.conceptId,
          context: `${traditionTitle} • ${summary?.transliteratedTitle || entry.textId}`,
        };
      }
      if (entry.kind === 'thread-step') {
        const total = traditionById.get(entry.traditionId)?.threadSteps ?? 0;
        const stepNo = (entry.stepIndex ?? 0) + 1;
        return {
          key: entry.key,
          href: `/system/${entry.traditionId}/thread?step=${stepNo}`,
          title: total > 0
            ? `${t(language, 'stepOf', { current: stepNo, total })}: ${entry.title}`
            : (entry.title || ''),
          context: traditionTitle,
        };
      }
      return undefined;
    };

    const concepts: PaletteRow[] = [];
    const steps: PaletteRow[] = [];
    const verses: PaletteRow[] = [];
    for (const { entry } of results) {
      if (entry.kind === 'text' || entry.kind === 'tradition') continue;
      const row = rowFor(entry);
      if (!row) continue;
      if (entry.kind === 'concept' && concepts.length < 8) concepts.push(row);
      else if (entry.kind === 'thread-step' && steps.length < 6) steps.push(row);
      else if (entry.kind === 'unit' && verses.length < 12) verses.push(row);
      if (concepts.length >= 8 && steps.length >= 6 && verses.length >= 12) break;
    }

    return { nav, concepts, steps, verses };
  }, [deferredQuery, language, results, traditions, texts]);

  const flat: PaletteRow[] = groups
    ? [...groups.nav, ...groups.concepts, ...groups.steps, ...groups.verses]
    : [];

  // Screen-reader status for the ranked result set (WCAG 4.1.3). Sighted
  // readers perceive counts via group headings; without a live region the
  // same update is silent. Deferred query keeps the announcement in step
  // with the rendered list. Empty query announces nothing — the dialogue
  // label plus browse shortcuts already orient the reader.
  const statusMessage = !groups
    ? ''
    : searching
      ? ''
      : flat.length === 0
        ? t(language, 'searchNoResults', { query: deferredQuery.trim() })
        : t(language, 'searchResultsCount', { count: flat.length, query: deferredQuery.trim() });

  // Keep the keyboard-active row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeReturnFocus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      const row = flat[active];
      if (row) {
        e.preventDefault();
        recordCurrentQuery();
        dismiss();
        navigate(row.href);
      }
    }
  };

  const renderGroup = (heading: string, rows: PaletteRow[], offset: number) => {
    if (rows.length === 0) return null;
    return (
      <div key={heading}>
        <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-tamas">
          {heading} ({rows.length})
        </div>
        {rows.map((row, i) => {
          const idx = offset + i;
          return (
            <Link
              key={row.key}
              to={row.href}
              data-idx={idx}
              onClick={handleResultClick}
              onMouseEnter={() => setActive(idx)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl min-h-11 transition-colors motion-reduce:transition-none ${
                idx === active ? 'bg-avyakta-3' : ''
              }`}
            >
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-sattva truncate">
                  {row.title}
                </span>
                <span className="block text-xs text-sattva-dim truncate">
                  {row.context}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+k Meta+k"
        className="flex flex-1 sm:w-56 sm:flex-none min-w-0 items-center gap-2 min-h-11 px-3 rounded-lg bg-avyakta-3 border border-tamas-deep text-sm text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
      >
        <SearchIcon aria-hidden="true" className="w-4 h-4 shrink-0" />
        <span className="truncate">{t(language, 'searchTrigger')}</span>
        <kbd
          aria-hidden="true"
          className="hidden sm:inline ml-auto text-xs text-tamas border border-tamas-deep rounded px-1.5 py-0.5"
        >
          ⌘K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label={t(language, 'searchTitle')}
          >
            <div
              aria-hidden="true"
              onClick={closeReturnFocus}
              className="absolute inset-0 bg-overlay"
            />
            <div className="relative max-w-lg mx-auto mt-[10vh] px-4">
              <div className="bg-avyakta-2 border border-tamas-deep rounded-2xl shadow-lg overflow-hidden animate-fade-in">
                <div className="flex items-center gap-2 px-4 border-b border-tamas-deep">
                  <SearchIcon aria-hidden="true" className="w-4 h-4 shrink-0 text-tamas" />
                  <input
                    ref={inputRef}
                    value={query}
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActive(0);
                    }}
                    onKeyDown={onInputKey}
                    placeholder={t(language, 'searchPlaceholder')}
                    aria-label={t(language, 'searchTitle')}
                    className="flex-1 min-w-0 bg-transparent py-4 text-base text-sattva placeholder:text-tamas focus:outline-none"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setActive(0);
                        inputRef.current?.focus();
                      }}
                      aria-label={t(language, 'clearLabel')}
                      className="flex items-center justify-center min-h-11 min-w-11 rounded-lg text-sattva-dim hover:text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                    >
                      <ClearIcon aria-hidden="true" className="w-4 h-4" />
                    </button>
                  ) : (
                    <kbd
                      aria-hidden="true"
                      className="text-xs text-tamas border border-tamas-deep rounded px-1.5 py-0.5"
                    >
                      esc
                    </kbd>
                  )}
                </div>

                <div role="status" aria-live="polite" className="sr-only">
                  {statusMessage}
                </div>
                <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
                  {!groups && (
                    <>
                      {recents.length > 0 && (
                        <div>
                          <div className="px-3 pt-3 pb-1 flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-tamas">
                              {t(language, 'recentSearches')} ({recents.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                clearSearches();
                                setRecents([]);
                                inputRef.current?.focus();
                              }}
                              aria-label={t(language, 'clearLabel')}
                              className="flex items-center justify-center min-h-9 min-w-9 rounded-lg text-sattva-dim hover:text-sattva hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                            >
                              <ClearIcon aria-hidden="true" className="w-4 h-4" />
                            </button>
                          </div>
                          {recents.map((r) => (
                            <button
                              key={`recent:${r}`}
                              type="button"
                              onClick={() => {
                                setQuery(r);
                                setActive(0);
                                inputRef.current?.focus();
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl min-h-11 text-left hover:bg-avyakta-3 transition-colors motion-reduce:transition-none"
                            >
                              <HistoryIcon aria-hidden="true" className="w-4 h-4 shrink-0 text-tamas" />
                              <span className="flex-1 min-w-0 block text-sm text-sattva truncate">
                                {r}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-tamas">
                        {t(language, 'systemsLabel')}
                      </div>
                      {browse.map((row, i) => (
                        <Link
                          key={row.key}
                          to={row.href}
                          data-idx={i}
                          onClick={handleResultClick}
                          onMouseEnter={() => setActive(i)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl min-h-11 transition-colors motion-reduce:transition-none ${
                            i === active ? 'bg-avyakta-3' : ''
                          }`}
                        >
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-medium text-sattva truncate">
                              {row.title}
                            </span>
                            <span className="block text-xs text-sattva-dim truncate">
                              {row.context}
                            </span>
                          </span>
                        </Link>
                      ))}
                      <div className="px-3 py-3 text-xs text-tamas">
                        {t(language, 'searchEmpty')}
                      </div>
                    </>
                  )}

                  {groups && flat.length === 0 && (
                    <div className="px-3 py-6 text-sm text-sattva-dim text-center">
                      {searching ? t(language, 'loading') : t(language, 'searchNoResults', { query: query.trim() })}
                    </div>
                  )}

                  {groups && (
                    <>
                      {renderGroup(t(language, 'systemsLabel'), groups.nav, 0)}
                      {renderGroup(
                        t(language, 'conceptsLabel'),
                        groups.concepts,
                        groups.nav.length,
                      )}
                      {renderGroup(
                        t(language, 'threadLabel'),
                        groups.steps,
                        groups.nav.length + groups.concepts.length,
                      )}
                      {renderGroup(
                        t(language, 'versesLabel'),
                        groups.verses,
                        groups.nav.length + groups.concepts.length + groups.steps.length,
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
