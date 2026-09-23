/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useSearchParams } from 'react-router';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ReadingProvider } from './context/ReadingContext';
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
const ThreadsIndex = lazy(() => import('./components/ThreadsIndex'));

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

function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const btn = (active: boolean) =>
    `px-2.5 py-1 rounded transition-colors motion-reduce:transition-none ${
      active
        ? 'bg-avyakta-4 text-sattva shadow-xs font-semibold'
        : 'text-sattva-dim hover:text-sattva'
    }`;
  return (
    <div
      role="group"
      aria-label={t(language, 'languagesLabel')}
      className="flex items-center gap-0.5 bg-avyakta-3 p-1 rounded-lg border border-tamas-deep text-xs font-medium shrink-0"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={btn(language === 'en')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ml')}
        aria-pressed={language === 'ml'}
        className={btn(language === 'ml')}
      >
        {compact ? 'മ' : 'മലയാളം'}
      </button>
    </div>
  );
}

function PrimaryNav() {
  const { language } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const path = location.pathname;
  // The Traditions destination is a section of Home: when already home,
  // plain navigation would be a no-op, so scroll explicitly instead.
  const scrollToTraditions = () => {
    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      document
        .getElementById('traditions')
        ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }, 60);
  };
  const items = [
    {
      key: 'home',
      to: '/',
      label: t(language, 'homeNav'),
      active: path === '/' && searchParams.get('focus') === null,
    },
    {
      key: 'traditions',
      to: '/?focus=traditions',
      label: t(language, 'systemsLabel'),
      active: path === '/' && searchParams.get('focus') === 'traditions',
    },
    {
      key: 'threads',
      to: '/threads',
      label: t(language, 'threadsNav'),
      active: path === '/threads' || (path.startsWith('/system/') && path.endsWith('/thread')),
    },
    {
      key: 'intro',
      to: '/intro',
      label: t(language, 'introTab'),
      active: path === '/intro',
    },
  ];
  return (
    <nav aria-label={t(language, 'primaryNav')} className="min-w-0">
      <ul className="flex items-center gap-1 overflow-x-auto">
        {items.map((item) => (
          <li key={item.key} className="shrink-0">
            <Link
              to={item.to}
              aria-current={item.active ? 'page' : undefined}
              onClick={item.key === 'traditions' && path === '/' ? scrollToTraditions : undefined}
              className={`relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${
                item.active ? 'text-sattva' : 'text-sattva-dim hover:text-sattva'
              }`}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-rajas transition-opacity motion-reduce:transition-none ${
                  item.active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HeaderNav() {
  const { language } = useLanguage();
  return (
    <header className="bg-avyakta-2/95 backdrop-blur-md border-b border-tamas-deep sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Brand row: wordmark, global search, language switcher. */}
        <div className="flex min-w-0 items-center gap-2 py-2.5 sm:gap-3">
          <Link
            to="/"
            aria-label={language === 'ml' ? 'ദർശന — പ്രധാനം' : 'Darśana — home'}
            className="shrink-0 rounded-sm transition-colors motion-reduce:transition-none"
          >
            <span className="block font-serif text-xl font-bold leading-none tracking-tight text-sattva">
              {language === 'ml' ? 'ദർശന' : 'Darśana'}
            </span>
            <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-tamas sm:block">
              {language === 'ml' ? 'തത്ത്വചിന്താ ഗ്രന്ഥശാല' : 'Philosophy library'}
            </span>
          </Link>
          <div className="min-w-0 flex-1">
            <SearchPalette />
          </div>
          <LanguageToggle compact />
        </div>
        {/* Primary navigation row: product destinations, route-aware. */}
        <div className="border-t border-tamas-deep/60">
          <PrimaryNav />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="border-t border-tamas-deep pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-serif font-bold text-sattva">
          {language === 'ml' ? 'ദർശന' : 'Darśana'}
        </span>
        <span className="min-w-0 flex-1 basis-48 text-sm text-sattva-dim">
          {t(language, 'footerNote')}
        </span>
        <Link
          to="/intro"
          className="text-sm font-medium text-sattva-dim hover:text-sattva transition-colors motion-reduce:transition-none"
        >
          {t(language, 'introTab')}
        </Link>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ReadingProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-avyakta text-sattva font-sans flex flex-col">
          <SkipLink />
          <HeaderNav />
          <main id="main-content" tabIndex={-1} className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 focus:outline-none">
            <ErrorBoundary>
            <Suspense fallback={<ScreenFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/threads" element={<ThreadsIndex />} />
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
          <Footer />
        </div>
      </HashRouter>
      </ReadingProvider>
    </LanguageProvider>
  );
}
