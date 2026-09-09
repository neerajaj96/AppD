import React from 'react';
import { Link } from 'react-router';
import { Network, Quote, ListTree, Globe2 } from 'lucide-react';
import type { ConceptHit, ThreadStepHit, VerseHit } from '../utils/references';
import { getConceptTitle, getThreadStepTitle } from '../utils/references';
import { getText, getSystem } from '../content';
import { useLanguage } from '../context/LanguageContext';
import { getVerseTerm } from '../utils/textTerminology';
import { t } from '../i18n/ui';
import { getSystemDisplay } from '../i18n/systems';

const chipClass =
  'inline-flex items-center px-3 py-1.5 rounded-full bg-avyakta-3 text-sattva text-sm hover:bg-avyakta-4 transition-colors';

export function RefSection({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-6 border-t border-tamas">
      <h3 className="text-sm font-bold text-tamas uppercase tracking-wider mb-4 flex items-center">
        <span className="mr-2 inline-flex">{icon}</span>
        {title}
        {count !== undefined && <span className="ml-1.5 font-medium">({count})</span>}
      </h3>
      {children}
    </div>
  );
}

/** Chips linking to concept articles. Shows the home-system badge for cross-darshana hits. */
export function ConceptChips({
  items,
  currentSystemId,
}: {
  items: ConceptHit[];
  currentSystemId?: string;
}) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((hit) => {
        const key = `${hit.systemId}:${hit.textId}:${hit.concept.id}`;
        const crossSystem = currentSystemId !== undefined && hit.systemId !== currentSystemId;
        const hitSystem = crossSystem ? getSystem(hit.systemId) : undefined;
        const systemTitle = hitSystem ? getSystemDisplay(hitSystem, language).title : undefined;
        return (
          <Link
            key={key}
            to={`/system/${hit.systemId}/text/${hit.textId}/concept/${hit.concept.id}`}
            className={chipClass}
            title={crossSystem ? `${getConceptTitle(hit, language)} — ${systemTitle}` : getConceptTitle(hit, language)}
          >
            {getConceptTitle(hit, language)}
            {crossSystem && systemTitle && (
              <span className="ml-1.5 text-[10px] uppercase font-semibold text-sattva-dim">
                {systemTitle}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/** Chips linking to verse pages, labelled with the text's own verse term. */
export function VerseChips({ items }: { items: VerseHit[] }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((hit) => {
        const text = getText(hit.systemId, hit.textId);
        const term = getVerseTerm(text, 1);
        const tip = hit.verse.content[language]?.translation || hit.verse.content.en?.translation;
        return (
          <Link
            key={`${hit.systemId}:${hit.textId}:${hit.verse.id}`}
            to={`/system/${hit.systemId}/text/${hit.textId}/verse/${hit.verse.id}`}
            className={chipClass}
            title={tip?.slice(0, 120)}
          >
            {term} {hit.verse.number}
          </Link>
        );
      })}
    </div>
  );
}

/** Backlinks: thread steps that mention a verse or concept ("what links here"). */
export function ThreadStepLinks({ steps }: { steps: ThreadStepHit[] }) {
  const { language } = useLanguage();
  if (steps.length === 0) return null;
  const stepLabel = language === 'ml' ? 'ഘട്ടം' : 'Step';
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map(({ systemId, stepIndex, step }) => (
        <Link
          key={`${systemId}:${step.id}:thread`}
          to={`/system/${systemId}/thread?step=${stepIndex + 1}`}
          className={chipClass}
        >
          {stepLabel} {stepIndex + 1}: {getThreadStepTitle(step, language).slice(0, 42)}
          {getThreadStepTitle(step, language).length > 42 ? '…' : ''}
        </Link>
      ))}
    </div>
  );
}

export function RelatedConceptsSection({
  items,
  currentSystemId,
}: {
  items: ConceptHit[];
  currentSystemId?: string;
}) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <RefSection icon={<Network className="w-4 h-4" />} title={t(language, 'relatedConcepts')} count={items.length}>
      <ConceptChips items={items} currentSystemId={currentSystemId} />
    </RefSection>
  );
}

export function RelatedVersesSection({ items, title }: { items: VerseHit[]; title?: string }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <RefSection icon={<Quote className="w-4 h-4" />} title={title || t(language, 'relatedVerses')} count={items.length}>
      <VerseChips items={items} />
    </RefSection>
  );
}

export function ThreadMentionsSection({ steps }: { steps: ThreadStepHit[] }) {
  const { language } = useLanguage();
  if (steps.length === 0) return null;
  return (
    <RefSection icon={<ListTree className="w-4 h-4" />} title={t(language, 'exploredInThread')} count={steps.length}>
      <ThreadStepLinks steps={steps} />
    </RefSection>
  );
}

export function CrossSystemSection({ items }: { items: ConceptHit[] }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <RefSection icon={<Globe2 className="w-4 h-4" />} title={t(language, 'alsoInOtherDarshanas')} count={items.length}>
      <ConceptChips items={items} currentSystemId="" />
    </RefSection>
  );
}
