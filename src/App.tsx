/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { t } from './i18n/ui';

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


function HeaderNav() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-avyakta-2 border-b border-tamas-deep sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="text-xl font-serif font-bold tracking-tight text-sattva hover:text-sattva-dim transition-colors">
          {language === 'ml' ? 'ദർശന' : 'Darśana'}
        </Link>
        <div className="flex items-center space-x-3">
          <Link
            to="/intro"
            className="text-sm font-medium text-sattva-dim hover:text-sattva transition-colors"
          >
            {t(language, 'introTab')}
          </Link>
        <div className="flex items-center space-x-1 bg-avyakta-3 p-1 rounded-lg border border-tamas-deep text-xs font-medium">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded transition-colors ${
              language === 'en'
                ? 'bg-avyakta-4 text-sattva shadow-xs font-semibold'
                : 'text-sattva-dim hover:text-sattva'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ml')}
            className={`px-2.5 py-1 rounded transition-colors ${
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
      <HashRouter>
        <div className="min-h-screen bg-avyakta text-sattva font-sans">
          <HeaderNav />
          <main className="max-w-4xl mx-auto px-4 py-8">
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
          </main>
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}

