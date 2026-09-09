import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { getSystem } from '../content';
import { BookOpen, Map as MapIcon, Sparkles, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Compass, Layers, Search, ArrowRight } from 'lucide-react';
import RichText from './RichText';
import { ConceptChips } from './ReferenceLinks';
import { getRelatedConcepts } from '../utils/references';
import { getSystemAccent } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';
import { getSystemOverview } from '../content/systemOverviews';
import { getVerseTerm } from '../utils/textTerminology';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';

export default function SystemDetail() {
  const { systemId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(null);
  const [conceptSearch, setConceptSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const overview = getSystemOverview(systemId || '');

  const allConcepts = useMemo(() => {
    if (!system) return [];
    return system.texts.flatMap((t) =>
      (t.concepts || []).map((c) => ({ ...c, textId: t.id, textTitle: t.transliteratedTitle }))
    );
  }, [system]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allConcepts.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [allConcepts]);

  const filteredConcepts = useMemo(() => {
    return allConcepts.filter((c) => {
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!conceptSearch.trim()) return true;
      const q = conceptSearch.toLowerCase();
      const localized = c.content[language] ?? c.content.en;
      const title = (localized?.title || c.id).toLowerCase();
      const summary = (localized?.summary || '').toLowerCase();
      const category = (c.category || '').toLowerCase();
      return title.includes(q) || summary.includes(q) || category.includes(q);
    });
  }, [allConcepts, selectedCategory, conceptSearch, language]);

  if (!system) {
    return <div className="text-center py-12">{t(language, 'systemNotFound')}</div>;
  }

  const accent = getSystemAccent(system.id);
  const display = getSystemDisplay(system, language);

  const handlePillarClick = (conceptId?: string) => {
    if (!conceptId) return;
    setExpandedConceptId(conceptId);
    setSelectedCategory('all');
    setConceptSearch('');
    const el = document.getElementById(`concept-${conceptId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToConcept = (conceptId: string) => {
    setExpandedConceptId(conceptId);
    requestAnimationFrame(() => {
      document.getElementById(`concept-${conceptId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="py-6 border-b border-tamas-deep">
        <div 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3" 
          style={{ backgroundColor: `${accent.primary}15`, color: accent.primary }}
        >
          {system.id.toUpperCase()} DARŚANA
        </div>
        <h1 className="text-4xl font-serif font-bold text-sattva mb-2">{display.title}</h1>
        <p className="text-xl text-sattva-dim">{display.subtitle}</p>
      </div>

      {/* System Overview (Featured Foundations & Methodology) */}
      {overview && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-sattva flex items-center">
              <Compass className="w-6 h-6 mr-2 text-sattva-dim" />
              {t(language, 'systemOverview')}
            </h2>
          </div>

          <div 
            className="bg-avyakta-2 rounded-2xl border p-6 md:p-8 shadow-xs space-y-6"
            style={{ borderColor: `${accent.primary}30` }}
          >
            <div>
              <h3 className="text-xl font-serif font-bold text-sattva mb-2">
                {overview.headline[language] || overview.headline.en}
              </h3>
              <p className="text-sattva leading-relaxed text-base md:text-lg">
                {overview.summary[language] || overview.summary.en}
              </p>
            </div>

            {/* Pillars Grid */}
            <div>
              <h4 className="text-xs font-semibold text-sattva-dim uppercase tracking-wider mb-4 flex items-center">
                <Layers className="w-4 h-4 mr-1.5 text-tamas" />
                {t(language, 'corePillars')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(overview.pillars[language] || overview.pillars.en).map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-avyakta border border-tamas-deep/80 hover:border-tamas-deep transition-all flex flex-col justify-between"
                  >
                    <div>
                      {pillar.sanskritTerm && (
                        <span 
                          className="inline-block text-xs font-medium px-2 py-0.5 rounded mb-2"
                          style={{ backgroundColor: `${accent.primary}12`, color: accent.primary }}
                        >
                          {pillar.sanskritTerm}
                        </span>
                      )}
                      <h5 className="font-serif font-bold text-sattva text-base mb-1.5">
                        {pillar.title}
                      </h5>
                      <p className="text-sm text-sattva-dim leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>

                    {pillar.conceptId && (
                      <button
                        onClick={() => handlePillarClick(pillar.conceptId)}
                        className="mt-3 text-xs font-semibold flex items-center hover:underline self-start pt-2"
                        style={{ color: accent.primary }}
                      >
                        {language === 'ml' ? t(language, 'viewDetails') : t(language, 'exploreConcept')}
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Texts */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-serif font-bold text-sattva flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-sattva-dim" />
          {t(language, 'primaryTexts')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {system.texts.map((text) => (
            <Link
              key={text.id}
              to={`/system/${system.id}/text/${text.id}`}
              className="block bg-avyakta-2 rounded-xl shadow-xs border border-tamas-deep hover:shadow-sm p-5 transition-all group relative overflow-hidden"
              style={{ borderLeftColor: accent.primary, borderLeftWidth: '4px' }}
            >
              <h3 className="text-lg font-bold text-sattva group-hover:text-rajas-dim">
                {text.transliteratedTitle}
              </h3>
              <p className="text-sattva-dim text-sm mb-3">{text.title}</p>
              <div className="text-sm text-sattva-dim">
                <span className="font-medium text-sattva">{t(language, 'authorLabel')}:</span> {text.author}
              </div>
              <div className="text-sm text-sattva-dim mb-2">
                {text.verses.length > 0 && (
                  <span>
                    <span className="font-medium text-sattva">{getVerseTerm(text, text.verses.length)}:</span> {text.verses.length}
                  </span>
                )}
                {text.verses.length > 0 && text.concepts.length > 0 && <span> • </span>}
                {text.concepts.length > 0 && (
                  <span>
                    <span className="font-medium text-sattva">{t(language, 'conceptsLabel')}:</span> {text.concepts.length}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Core Philosophy Thread */}
      {system.thread && system.thread.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-tamas-deep">
          <h2 className="text-2xl font-serif font-bold text-sattva flex items-center">
            <MapIcon className="w-6 h-6 mr-2 text-sattva-dim" />
            {t(language, 'coreThread')}
          </h2>
          <div 
            className="rounded-2xl p-6 md:p-8 text-sattva flex flex-col md:flex-row md:items-center justify-between shadow-xs"
            style={{ backgroundColor: accent.primary }}
          >
            <div>
              <h3 className="text-2xl font-serif font-bold text-sattva mb-2">{t(language, 'exploreNarrative', { title: display.title })}</h3>
              <p className="text-sattva/80 max-w-md text-sm md:text-base">
                {t(language, 'exploreNarrativeDesc', { title: display.title })}
              </p>
            </div>
            <Link
              to={`/system/${system.id}/thread`}
              className="mt-6 md:mt-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-sattva bg-avyakta-2 hover:bg-avyakta-3 shadow-xs transition-colors"
            >
              {t(language, 'startThread', { count: system.thread.length })}
            </Link>
          </div>
        </div>
      )}

      {/* Foundational Concepts */}
      {allConcepts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-tamas-deep">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-serif font-bold text-sattva flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-sattva-dim" />
              {t(language, 'foundationalConcepts', { count: allConcepts.length })}
            </h2>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-tamas" />
              </div>
              <input
                type="text"
                value={conceptSearch}
                onChange={(e) => setConceptSearch(e.target.value)}
                placeholder={t(language, 'filterConcepts')}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-avyakta-2 border border-tamas-deep rounded-lg focus:outline-none focus:ring-1 focus:ring-rajas"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-avyakta-4 text-sattva'
                    : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
                }`}
              >
                {t(language, 'allLabel', { count: allConcepts.length })}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-avyakta-4 text-sattva'
                      : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {filteredConcepts.map((concept, idx) => {
              const localized = concept.content[language] ?? concept.content.en;
              const isExpanded = expandedConceptId === concept.id;

              return (
                <div 
                  id={`concept-${concept.id}`}
                  key={concept.id}
                  className="bg-avyakta-2 rounded-xl border border-tamas-deep overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedConceptId(isExpanded ? null : concept.id)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-avyakta transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sattva text-base">
                          {localized?.title || concept.id}
                        </h4>
                        {concept.category && (
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-avyakta-3 text-sattva-dim">
                            {concept.category}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-sattva-dim">{concept.textTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-tamas">
                      {concept.relatedVerseIds && concept.relatedVerseIds.length > 0 && (
                        <span className="text-xs bg-avyakta-3 px-2 py-0.5 rounded text-sattva-dim">
                          {t(language, 'linkedVerses', { count: concept.relatedVerseIds.length, term: getVerseTerm(system.texts.find((tx) => tx.id === concept.textId), concept.relatedVerseIds.length).toLowerCase() })}
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-tamas space-y-4 text-sattva">
                      {localized?.summary && (
                        <div className="prose prose-sm max-w-none">
                          <RichText
                            text={localized.summary}
                            systemId={system.id as string}
                            textId={concept.textId as string}
                          />
                        </div>
                      )}
                      <div className="pt-3 border-t border-tamas">
                        <Link
                          to={`/system/${system.id}/text/${concept.textId}/concept/${concept.id}`}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: accent.primary }}
                        >
                          {t(language, 'openConceptArticle')}
                        </Link>
                      </div>
                      {concept.relatedVerseIds && concept.relatedVerseIds.length > 0 && (
                        <div className="pt-3 border-t border-tamas">
                          <div className="text-xs font-semibold text-sattva-dim uppercase tracking-wider mb-2">
                            {t(language, 'crossRefVerses')}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {concept.relatedVerseIds.map((vId) => (
                              <Link
                                key={vId}
                                to={`/system/${system.id}/text/${concept.textId}/verse/${vId}`}
                                className="text-xs px-2.5 py-1 rounded bg-avyakta-3 hover:bg-avyakta-4 text-sattva font-medium transition-colors"
                              >
                                Verse {vId}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const related = getRelatedConcepts(
                          system.id as string,
                          concept.textId as string,
                          concept.id as string,
                          8,
                        ).filter((h) => h.systemId !== (system.id as string) || h.textId !== (concept.textId as string) || (h.concept.id as string) !== (concept.id as string));
                        return related.length > 0 ? (
                          <div className="pt-3 border-t border-tamas">
                            <div className="text-xs font-semibold text-sattva-dim uppercase tracking-wider mb-2">
                              {t(language, 'relatedConcepts')}
                            </div>
                            <ConceptChips items={related} currentSystemId={system.id as string} />
                          </div>
                        ) : null;
                      })()}
                      {filteredConcepts.length > 1 && (
                        <div className="pt-3 border-t border-tamas flex items-center justify-between">
                          <button
                            onClick={() => idx > 0 && goToConcept(filteredConcepts[idx - 1].id)}
                            disabled={idx === 0}
                            className="flex items-center text-xs font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-default transition-opacity"
                            style={{ color: accent.primary }}
                          >
                            <ChevronLeft className="w-4 h-4 mr-0.5" />
                            {t(language, 'previous')}
                          </button>
                          <span className="text-[11px] text-sattva-dim font-medium tabular-nums">
                            {idx + 1} / {filteredConcepts.length}
                          </span>
                          <button
                            onClick={() => idx < filteredConcepts.length - 1 && goToConcept(filteredConcepts[idx + 1].id)}
                            disabled={idx === filteredConcepts.length - 1}
                            className="flex items-center text-xs font-semibold hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-default transition-opacity"
                            style={{ color: accent.primary }}
                          >
                            {t(language, 'next')}
                            <ChevronRight className="w-4 h-4 ml-0.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


