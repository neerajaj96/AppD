import { getSystemAccent } from '../utils/theme';
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getText, getSystem } from '../content';
import { Search, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { searchVerses } from '../utils/searchIndex';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';

export default function TextIndex() {
  const { systemId, textId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const text = getText(systemId || '', textId || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActiveSection('all');
    setSearchQuery('');
    setCollapsedSections(new Set());
  }, [systemId, textId]);

  const hasVerses = (text?.verses.length ?? 0) > 0;
  const hasConcepts = (text?.concepts.length ?? 0) > 0;
  const [activeTab, setActiveTab] = useState<'verses' | 'concepts'>('verses');

  useEffect(() => {
    setActiveTab(hasVerses ? 'verses' : 'concepts');
  }, [systemId, textId, hasVerses]);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  if (!system || !text) {
    return <div className="text-center py-12">Text not found</div>;
  }

  const showVerses = hasVerses && activeTab === 'verses';

  // Canonical section order for Devi Mahatmya; any other text falls back
  // to first-seen order. Grouping uses the existing Verse.section field —
  // no schema change.
  const SECTION_ORDER = useMemo(() => [
    'Aṅga-Stotra: Devī Kavaca (Mātṛ-Anubhūti)',
    'Aṅga-Stotra: Argala Stotra (Mātṛ-mukhī Gati)',
    'Aṅga-Stotra: Kīlaka Stotra (Adhikāra-Nirṇaya)',
    'Prathama Carita (Brahma-Granthi Bheda / Madhu-Kaiṭabha Vadha)',
    'Madhyama Carita (Viṣṇu-Granthi Bheda / Mahiṣāsura Vadha)',
    'Uttama Carita (Rudra-Granthi Bheda / Śumbha-Niśumbha Vadha)',
  ], []);

  const shortSectionLabel = (section: string) => {
    if (section.includes('Kavaca')) return language === 'ml' ? 'കവചം' : 'Kavaca';
    if (section.includes('Argala')) return language === 'ml' ? 'അർഗല' : 'Argala';
    if (section.includes('Kīlaka') || section.includes('Kilaka')) return language === 'ml' ? 'കീലകം' : 'Kīlaka';
    if (section.includes('Prathama')) return language === 'ml' ? 'പ്രഥമ ചരിതം · അ1' : 'Prathama · Ch1';
    if (section.includes('Madhyama')) return language === 'ml' ? 'മധ്യമ ചരിതം · അ2-4' : 'Madhyama · Ch2-4';
    if (section.includes('Uttama')) return language === 'ml' ? 'ഉത്തമ ചരിതം · അ5-13' : 'Uttama · Ch5-13';
    // Generic fallback for all other systems: take the leading part before
    // any '—', ':', '(' or '|' separator, truncated to keep chips compact.
    let short = section;
    for (const sep of ['—', '-', ':', '(', '|']) {
      if (sep === '-' && !/ - /.test(short)) continue;
      const idx = short.indexOf(sep === '-' ? ' - ' : sep);
      if (idx > 0) short = short.slice(0, idx).trim();
    }
    short = short.trim() || section;
    return short.length > 28 ? `${short.slice(0, 27).trim()}…` : short;
  };

  const orderedSections = useMemo(() => {
    if (!hasVerses) return [] as string[];
    const seen = Array.from(new Set(text.verses.map((v) => v.section || '')));
    return seen.sort((a, b) => {
      const ia = SECTION_ORDER.indexOf(a);
      const ib = SECTION_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return seen.indexOf(a) - seen.indexOf(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [hasVerses, text.verses, SECTION_ORDER]);

  const sectionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    text.verses.forEach((v) => {
      const key = v.section || '';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [text.verses]);

  const searchedVerses = useMemo(() => {
    if (!hasVerses) return [];
    if (!searchQuery.trim()) return text.verses;
    const rankedResults = searchVerses(searchQuery, { systemId: system.id, textId: text.id });
    return rankedResults.map(r => r.item.verse);
  }, [hasVerses, text.verses, searchQuery, system.id, text.id]);

  const filteredVerses = useMemo(() => {
    if (activeSection === 'all') return searchedVerses;
    return searchedVerses.filter((v) => (v.section || '') === activeSection);
  }, [searchedVerses, activeSection]);

  const groupedVerses = useMemo(() => {
    const groups = new Map<string, typeof filteredVerses>();
    filteredVerses.forEach((v) => {
      const key = v.section || '';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(v);
    });
    return orderedSections
      .filter((s) => groups.has(s))
      .map((s) => ({ section: s, verses: groups.get(s)! }));
  }, [filteredVerses, orderedSections]);

  const filteredConcepts = useMemo(() => {
    if (!hasConcepts) return [];
    if (!searchQuery.trim()) return text.concepts;
    const q = searchQuery.toLowerCase();
    return text.concepts.filter(c => {
      const enTitle = c.content.en?.title?.toLowerCase() || '';
      const enSummary = c.content.en?.summary?.toLowerCase() || '';
      const mlTitle = c.content.ml?.title?.toLowerCase() || '';
      const cat = c.category?.toLowerCase() || '';
      return enTitle.includes(q) || enSummary.includes(q) || mlTitle.includes(q) || cat.includes(q);
    });
  }, [hasConcepts, text.concepts, searchQuery]);

  const isMalayalam = language === 'ml';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center text-sm text-sattva-dim mb-2 space-x-2">
        <Link to={`/system/${system.id}`} className="hover:text-rajas transition-colors">
          {system.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-sattva">{text.transliteratedTitle}</span>
      </div>

      <div className="py-4 border-b border-tamas-deep">
        <h1 className="text-3xl font-serif font-bold text-sattva mb-2">
          {text.transliteratedTitle}
        </h1>
        <p className="text-sattva-dim">
          {text.author ? `Author: ${text.author} • ` : ''}
          {hasVerses ? `${text.verses.length} ${getVerseTerm(text, text.verses.length).toLowerCase()}` : ''}
          {hasVerses && hasConcepts ? ' • ' : ''}
          {hasConcepts ? `${text.concepts.length} philosophical concepts` : ''}
        </p>

        {hasVerses && hasConcepts && (
          <div className="flex space-x-2 mt-4">
            <button
              id="tab-verses"
              onClick={() => setActiveTab('verses')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'verses'
                  ? 'bg-avyakta-4 text-sattva'
                  : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
              }`}
            >
              {getVerseTerm(text, text.verses.length)} ({text.verses.length})
            </button>
            <button
              id="tab-concepts"
              onClick={() => setActiveTab('concepts')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'concepts'
                  ? 'bg-avyakta-4 text-sattva'
                  : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
              }`}
            >
              Concepts ({text.concepts.length})
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-tamas" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-tamas-deep rounded-lg focus:ring-rajas focus:border-rajas bg-avyakta-2"
          placeholder={showVerses ? `Search ${getVerseTerm(text, 2).toLowerCase()} by term, number, or Sanskrit...` : "Search concepts, categories, or Sanskrit terms..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showVerses && orderedSections.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-sattva-dim uppercase tracking-wider">
              {language === 'ml' ? 'വിഭാഗം തിരഞ്ഞെടുക്കുക' : 'Browse by section'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCollapsedSections(new Set())}
                className="text-[11px] font-semibold text-sattva-dim hover:text-sattva hover:underline transition-colors"
              >
                {language === 'ml' ? 'എല്ലാം തുറക്കുക' : 'Expand all'}
              </button>
              <span className="text-tamas-deep">•</span>
              <button
                onClick={() => setCollapsedSections(new Set(orderedSections))}
                className="text-[11px] font-semibold text-sattva-dim hover:text-sattva hover:underline transition-colors"
              >
                {language === 'ml' ? 'എല്ലാം അടയ്ക്കുക' : 'Collapse all'}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSection === 'all'
                  ? 'bg-avyakta-4 text-sattva'
                  : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
              }`}
            >
              {language === 'ml' ? `എല്ലാം (${text.verses.length})` : `All (${text.verses.length})`}
            </button>
            {orderedSections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeSection === section
                    ? 'bg-avyakta-4 text-sattva'
                    : 'bg-avyakta-3 text-sattva-dim hover:bg-avyakta-4'
                }`}
                title={section}
              >
                {shortSectionLabel(section)} ({sectionCounts.get(section) || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-avyakta-2 rounded-xl shadow-xs border border-tamas-deep overflow-hidden divide-y divide-tamas-deep">
        {!showVerses ? (
          filteredConcepts.length === 0 ? (
            <div className="p-8 text-center text-sattva-dim">
              No concepts found matching "{searchQuery}"
            </div>
          ) : (
            filteredConcepts.map((concept) => {
              const activeContent = (isMalayalam && concept.content.ml) ? concept.content.ml : concept.content.en;
              return (
                <Link
                  key={concept.id}
                  to={`/system/${system.id}/text/${text.id}/concept/${concept.id}`}
                  className="block p-5 hover:bg-avyakta/80 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-base text-sattva">
                      {activeContent?.title || concept.id}
                    </h3>
                    {concept.category && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-avyakta-3 text-sattva-dim font-medium">
                        {concept.category}
                      </span>
                    )}
                  </div>
                  {activeContent?.summary && (
                    <p className="text-sm text-sattva-dim line-clamp-3 leading-relaxed">
                      {activeContent.summary}
                    </p>
                  )}
                  {(concept.relatedVerseIds?.length || concept.relatedConceptIds?.length) ? (
                    <div className="mt-2 text-[11px] font-medium text-sattva-dim">
                      {(concept.relatedVerseIds?.length || 0) > 0 && (
                        <span>{concept.relatedVerseIds!.length} linked {getVerseTerm(text, concept.relatedVerseIds!.length).toLowerCase()}</span>
                      )}
                      {(concept.relatedVerseIds?.length || 0) > 0 && (concept.relatedConceptIds?.length || 0) > 0 && (
                        <span> • </span>
                      )}
                      {(concept.relatedConceptIds?.length || 0) > 0 && (
                        <span>{concept.relatedConceptIds!.length} related concepts</span>
                      )}
                    </div>
                  ) : null}
                </Link>
              );
            })
          )
        ) : (
          filteredVerses.length === 0 ? (
            <div className="p-8 text-center text-sattva-dim">
              No {getVerseTerm(text, 2).toLowerCase()} found matching "{searchQuery}"
            </div>
          ) : (
            groupedVerses.map((group) => {
              const isCollapsed = collapsedSections.has(group.section) && !searchQuery.trim() && activeSection === 'all';
              return (
              <div key={group.section || 'unsectioned'}>
                {(activeSection === 'all' || groupedVerses.length > 1) && group.section ? (
                  <button
                    onClick={() => toggleSection(group.section)}
                    aria-expanded={!isCollapsed}
                    className="w-full text-left px-5 pt-4 pb-3 bg-avyakta-3/50 hover:bg-avyakta-3 transition-colors flex items-center justify-between gap-3"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-serif font-bold text-sattva truncate">
                        {shortSectionLabel(group.section)}
                      </span>
                      <span className="block text-xs font-semibold text-sattva-dim uppercase tracking-wider truncate mt-0.5">
                        {group.section}
                      </span>
                      <span className="block text-[11px] text-sattva-dim mt-0.5">
                        {group.verses.length} {getVerseTerm(text, group.verses.length).toLowerCase()} • {group.verses[0]?.number} → {group.verses[group.verses.length - 1]?.number}
                      </span>
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-avyakta-2 border border-tamas-deep flex items-center justify-center text-sattva-dim">
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </span>
                  </button>
                ) : null}
                {!isCollapsed &&
                group.verses.map((verse) => {
                  const activeTranslation = (isMalayalam && verse.content.ml?.translation)
                    ? verse.content.ml.translation
                    : verse.content.en?.translation;

                  return (
                    <Link
                      key={verse.id}
                      to={`/system/${system.id}/text/${text.id}/verse/${verse.id}`}
                      className="block p-5 hover:bg-avyakta transition-colors group"
                    >
                      <div className="flex items-start">
                        <div className="w-16 font-medium text-sattva-dim pt-1 shrink-0">
                          {verse.number}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="text-sattva italic text-sm md:text-base leading-relaxed font-serif">
                            {verse.iast}
                          </div>
                          {activeTranslation && (
                            <div className="text-sattva-dim text-sm md:text-base line-clamp-2">
                              {activeTranslation}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}

