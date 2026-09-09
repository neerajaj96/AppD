import { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { getConcept, getText, getSystem } from '../content';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';
import RichText from './RichText';
import {
  RelatedConceptsSection,
  RelatedVersesSection,
  ThreadMentionsSection,
  CrossSystemSection,
} from './ReferenceLinks';
import {
  getVersesForConcept,
  getRelatedConcepts,
  getThreadStepsForConcept,
  getCrossSystemConcepts,
} from '../utils/references';

/**
 * Concept article — the Wikipedia-style entry point for a single tattva /
 * padartha. Aggregates everything that links to it: defining verses, related
 * concepts, thread steps, and occurrences in other darshanas.
 */
export default function ConceptDetail() {
  const { systemId, textId, conceptId } = useParams();
  const { language } = useLanguage();
  const system = getSystem(systemId || '');
  const text = getText(systemId || '', textId || '');
  const concept = getConcept(systemId || '', textId || '', conceptId || '');

  const nav = useMemo(() => {
    if (!text || !concept) return { prev: null, next: null };
    const idx = text.concepts.findIndex((c) => c.id === concept.id);
    return {
      prev: idx > 0 ? text.concepts[idx - 1] : null,
      next: idx >= 0 && idx < text.concepts.length - 1 ? text.concepts[idx + 1] : null,
    };
  }, [text, concept]);

  const verses = useMemo(
    () => (system && text && concept ? getVersesForConcept(system.id as string, text.id as string, concept.id as string) : []),
    [system, text, concept],
  );
  const related = useMemo(
    () => (system && text && concept ? getRelatedConcepts(system.id as string, text.id as string, concept.id as string) : []),
    [system, text, concept],
  );
  const threadSteps = useMemo(
    () => (system && text && concept ? getThreadStepsForConcept(system.id as string, text.id as string, concept.id as string) : []),
    [system, text, concept],
  );
  const crossSystem = useMemo(
    () => (system && concept ? getCrossSystemConcepts(concept.id as string, { systemId: system.id as string }) : []),
    [system, concept],
  );

  if (!system || !text || !concept) {
    return <div className="text-center py-12">Concept not found</div>;
  }

  const content = concept.content[language] ?? concept.content.en;
  const title = content?.title || (concept.id as string);
  const summary = content?.summary;
  const verseTermPlural = getVerseTerm(text, 2);
  const verseTermSingular = getVerseTerm(text, 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-24 select-text">
      <div className="flex items-center text-sm text-sattva-dim space-x-2 truncate">
        <Link to={`/system/${system.id}`} className="hover:text-rajas transition-colors">
          {system.title}
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link
          to={`/system/${system.id}/text/${text.id}`}
          className="hover:text-rajas transition-colors truncate"
        >
          {text.transliteratedTitle}
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-sattva font-medium truncate">{title}</span>
      </div>

      <div className="bg-avyakta-2 rounded-2xl shadow-xs border border-tamas-deep overflow-hidden">
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-tamas uppercase tracking-widest">
              Concept • {text.transliteratedTitle}
            </div>
            <h1 className="text-3xl font-serif font-bold text-sattva leading-tight">{title}</h1>
            {concept.category && (
              <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-avyakta-3 text-sattva-dim font-medium">
                {concept.category}
              </span>
            )}
          </div>

          {summary && (
            <div className="text-lg md:text-xl text-sattva leading-relaxed font-serif">
              <RichText text={summary} systemId={system.id as string} textId={text.id as string} />
            </div>
          )}

          {verses.length > 0 && (
            <div className="pt-6 border-t border-tamas">
              <h3 className="text-sm font-bold text-tamas uppercase tracking-wider mb-4">
                Defining {verseTermPlural} ({verses.length})
              </h3>
              <div className="space-y-3">
                {verses.slice(0, 12).map(({ verse }) => {
                  const translation =
                    verse.content[language]?.translation || verse.content.en?.translation;
                  return (
                    <Link
                      key={verse.id as string}
                      to={`/system/${system.id}/text/${text.id}/verse/${verse.id}`}
                      className="block p-4 rounded-xl bg-avyakta-3/50 hover:bg-avyakta-3 transition-colors group"
                    >
                      <div className="text-sm font-semibold text-rajas mb-1">
                        {verseTermSingular} {verse.number}
                      </div>
                      {translation && (
                        <div className="text-sm text-sattva-dim line-clamp-2 leading-relaxed">
                          {translation}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <RelatedConceptsSection items={related} currentSystemId={system.id as string} />
          <ThreadMentionsSection steps={threadSteps} />
          <CrossSystemSection items={crossSystem} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-avyakta-2/80 backdrop-blur-md border-t border-tamas-deep">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          {nav.prev ? (
            <Link
              to={`/system/${system.id}/text/${text.id}/concept/${nav.prev.id}`}
              className="flex items-center text-sm font-medium text-sattva-dim hover:text-rajas transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline max-w-40 truncate">
                {(nav.prev.content[language]?.title || nav.prev.content.en?.title || nav.prev.id) as string}
              </span>
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

          {nav.next ? (
            <Link
              to={`/system/${system.id}/text/${text.id}/concept/${nav.next.id}`}
              className="flex items-center text-sm font-medium text-sattva-dim hover:text-rajas transition-colors"
            >
              <span className="hidden sm:inline max-w-40 truncate">
                {(nav.next.content[language]?.title || nav.next.content.en?.title || nav.next.id) as string}
              </span>
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
