/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ReadingProvider } from './context/ReadingContext';
import { useCatalog } from './content/v2/hooks';
import { getTraditionDisplay } from './content/v2/catalog';
import { t } from './i18n/ui';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import SearchPalette from './components/SearchPalette';

const Home = lazy(() => import('./components/Home'));
const Intro = lazy(() => import('./components/Intro'));
const SystemDetail = lazy(() => import('./components/SystemDetail'));
const TextIndex = lazy(() => import('./components/TextIndex'));
const VerseDetail = lazy(() => import('./components/VerseDetail'));
const ConceptDetail = lazy(() => import('./components/ConceptDetail'));
const ThreadView = lazy(() => import('./components/ThreadView'));

function ScreenFallback() {
  return (
    <div className="py-16 text-center text-tamas text-sm animate-pulse">
      <FallbackText />
    </div>
  );
}

function FallbackText() {
  const { language } = useLanguage();
  return <>{t(language, 'loading')}</>;
}

function SkipLink() {
  const { language } = useLanguage();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-avyakta-2 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sattva focus:outline-none focus-visible:outline-2 focus-visible:outline-sattva"
    >
      {t(language, 'skipToContent')}
    </a>
  );
}


function HeaderNav() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const traditions = catalog.status === 'ok' ? catalog.data.traditions : [];
  // Current system from the route (works for system/text/verse/concept/thread
  // paths alike) so the jump control always reflects where the reader is.
  const segments = location.pathname.split('/');
  const currentSystemId = segments[1] === 'system' ? (segments[2] ?? '') : '';

  return (
    <header className="bg-avyakta-2 border-b border-tamas-deep sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link to="/" className="mr-auto text-xl font-serif font-bold tracking-tight text-sattva hover:text-sattva-dim transition-colors motion-reduce:transition-none">
          {language === 'ml' ? 'ദർശന' : 'Darśana'}
        </Link>
        {/* Row 2 on phones (search + system jump side by side); dissolves
            into the header row on wider screens. */}
        <div className="order-3 basis-full flex min-w-0 gap-2 sm:contents">
          <SearchPalette />
          <label htmlFor="system-jump" className="sr-only">
            {t(language, 'systemsLabel')}
          </label>
          <select
            id="system-jump"
            value={currentSystemId}
            onChange={(e) => {
              if (e.target.value) navigate(`/system/${e.target.value}`);
            }}
            className="flex-1 min-w-0 sm:w-44 sm:flex-none min-h-11 rounded-lg bg-avyakta-3 border border-tamas-deep px-2.5 text-sm text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
          >
          <option value="">{t(language, 'systemsLabel')}…</option>
          {traditions.map((s) => (
            <option key={s.id} value={s.id}>
              {getTraditionDisplay(s, language).title}
            </option>
          ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/intro"
            className="text-sm font-medium text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
          >
            {t(language, 'introTab')}
          </Link>
        <div className="flex items-center space-x-1 bg-avyakta-3 p-1 rounded-lg border border-tamas-deep text-xs font-medium">
          <button
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`px-2.5 py-1 rounded transition-colors motion-reduce:transition-none ${
              language === 'en'
                ? 'bg-avyakta-4 text-sattva shadow-xs font-semibold'
                : 'text-sattva-dim hover:text-sattva'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ml')}
            aria-pressed={language === 'ml'}
            className={`px-2.5 py-1 rounded transition-colors motion-reduce:transition-none ${
              language === 'ml'
                ? 'bg-avyakta-4 text-sattva shadow-xs font-semibold'
                : 'text-sattva-dim hover:text-sattva'
            }`}
          >
            മലയാളം
          </button>
        </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ReadingProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-avyakta text-sattva font-sans">
          <SkipLink />
          <HeaderNav />
          <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-4 py-8 focus:outline-none">
            <ErrorBoundary>
            <Suspense fallback={<ScreenFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/system/:systemId" element={<SystemDetail />} />
                <Route path="/system/:systemId/thread" element={<ThreadView />} />
                <Route path="/system/:systemId/text/:textId" element={<TextIndex />} />
                <Route path="/system/:systemId/text/:textId/verse/:verseId" element={<VerseDetail />} />
                <Route path="/system/:systemId/text/:textId/concept/:conceptId" element={<ConceptDetail />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </HashRouter>
      </ReadingProvider>
    </LanguageProvider>
  );
}

