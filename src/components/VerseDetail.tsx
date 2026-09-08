import { getSystemAccent } from '../utils/theme';
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { getVerse, getText, getSystem } from '../content';
import { ChevronRight, ChevronLeft, ArrowLeft, Share2, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';

export default function VerseDetail() {
  const { systemId, textId, verseId } = useParams();
  const { language, setLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const system = getSystem(systemId || '');
  const text = getText(systemId || '', textId || '');
  const verse = getVerse(systemId || '', textId || '', verseId || '');

  const verseTerm = getVerseTerm(text, 1);

  if (!system || !text || !verse) {
    return <div className="text-center py-12">{verseTerm} not found</div>;
  }

  // Memoize next/prev verses so we don't scan the entire array on every render
  const { prevVerse, nextVerse } = useMemo(() => {
    const currentIndex = text.verses.findIndex(v => v.id === verse.id);
    return {
      prevVerse: currentIndex > 0 ? text.verses[currentIndex - 1] : null,
      nextVerse: currentIndex >= 0 && currentIndex < text.verses.length - 1 ? text.verses[currentIndex + 1] : null,
    };
  }, [text.verses, verse.id]);

  const activeContent = verse.content[language] ?? verse.content.en;
  const fallbackContent = verse.content.en;

  const translation = activeContent?.translation || fallbackContent?.translation;
  const commentary = activeContent?.commentary || fallbackContent?.commentary;
  const keyPoints = (activeContent?.keyPoints && activeContent.keyPoints.length > 0)
    ? activeContent.keyPoints
    : fallbackContent?.keyPoints;

  const isCurrentLangAvailable = !!verse.content[language];
  const isShowingFallback = !isCurrentLangAvailable && language === 'ml';

  const handleCopy = async () => {
    const textToCopy = `${system.title} - ${text.transliteratedTitle}\n${verseTerm} ${verse.number}\n${verse.devanagari ? verse.devanagari + '\n' : ''}${verse.iast}\n\n${translation || ''}\n\n${commentary || ''}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-24 select-text">
      <div className="flex items-center justify-between text-sm text-sattva-dim">
        <div className="flex items-center space-x-2 truncate">
          <Link to={`/system/${system.id}`} className="hover:text-rajas transition-colors">
            {system.title}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link to={`/system/${system.id}/text/${text.id}`} className="hover:text-rajas transition-colors truncate">
            {text.transliteratedTitle}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-sattva font-medium whitespace-nowrap">{verseTerm} {verse.number}</span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          {verse.content.en && (
            <button
              onClick={() => setLanguage('en')}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                language === 'en' ? 'bg-avyakta-4 text-sattva shadow-xs' : 'bg-avyakta-3 hover:bg-avyakta-4 text-sattva'
              }`}
              title="English translation"
            >
              English
            </button>
          )}

          {verse.content.ml && (
            <button
              onClick={() => setLanguage('ml')}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                language === 'ml' ? 'bg-avyakta-4 text-sattva shadow-xs' : 'bg-avyakta-3 hover:bg-avyakta-4 text-sattva'
              }`}
              title="മലയാളം വിവർത്തനം"
            >
              മലയാളം
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-avyakta-3 hover:bg-avyakta-4 text-sattva font-medium transition-colors"
            title="Copy or share verse text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal" />
                <span className="text-teal">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isShowingFallback && (
        <div className="p-3 bg-amber-dim/20 border border-amber-dim rounded-lg text-xs text-amber flex items-center justify-between">
          <span>Malayalam translation for this verse is pending. Displaying English version.</span>
        </div>
      )}

      <div className="bg-avyakta-2 rounded-2xl shadow-xs border border-tamas-deep overflow-hidden">
        <div className="p-8 md:p-10 space-y-8">
          <div className="text-center space-y-6">
            <h2 className="text-lg font-medium text-tamas tracking-widest uppercase">
              {verse.section ? `${verse.section} • ` : ''} {verseTerm} {verse.number}
            </h2>
            
            {verse.devanagari && (
              <div className="text-3xl md:text-4xl text-sattva leading-normal font-serif">
                {verse.devanagari.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
            
            <div className="text-xl md:text-2xl text-sattva italic leading-relaxed">
              {verse.iast.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {translation && (
            <div className="pt-6 border-t border-tamas">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-tamas uppercase tracking-wider">
                  {language === 'ml' && verse.content.ml?.translation
                    ? 'വിവർത്തനം (Translation)'
                    : 'Translation'}
                </h3>
              </div>
              <div className="text-lg md:text-xl text-sattva leading-relaxed font-serif">
                <Markdown>{translation}</Markdown>
              </div>
            </div>
          )}

          {commentary && (
            <div className="pt-6 border-t border-tamas">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-tamas uppercase tracking-wider">
                  {language === 'ml' && verse.content.ml?.commentary
                    ? 'ഭാഷ്യം / വ്യാഖ്യാനം (Commentary)'
                    : 'Commentary'}
                </h3>
              </div>
              <div className="prose max-w-none text-sattva">
                <Markdown>{commentary}</Markdown>
              </div>
            </div>
          )}

          {keyPoints && keyPoints.length > 0 && (
            <div className="pt-6 border-t border-tamas">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-tamas uppercase tracking-wider">
                  {language === 'ml' && verse.content.ml?.keyPoints
                    ? 'പ്രധാന തത്ത്വങ്ങൾ (Key Points)'
                    : 'Key Points'}
                </h3>
              </div>
              <ul className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="flex text-sattva items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-rajas mt-2 mr-3 shrink-0"></span>
                    <span className="flex-1"><Markdown>{point}</Markdown></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-avyakta-2/80 backdrop-blur-md border-t border-tamas-deep">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {prevVerse ? (
            <Link
              to={`/system/${system.id}/text/${text.id}/verse/${prevVerse.id}`}
              className="flex items-center text-sm font-medium text-sattva-dim hover:text-rajas transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">{verseTerm}</span> {prevVerse.number}
            </Link>
          ) : (
            <div className="w-20" />
          )}

          <Link
            to={`/system/${system.id}/text/${text.id}`}
            className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-avyakta-3 transition-colors text-sattva-dim"
            title="Back to Index"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {nextVerse ? (
            <Link
              to={`/system/${system.id}/text/${text.id}/verse/${nextVerse.id}`}
              className="flex items-center text-sm font-medium text-sattva-dim hover:text-rajas transition-colors"
            >
              <span className="hidden sm:inline">{verseTerm}</span> {nextVerse.number}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </div>
    </div>
  );
}

