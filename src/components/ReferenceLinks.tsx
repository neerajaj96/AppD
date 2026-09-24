import React from 'react';
import { Link } from 'react-router';
import { Network, Quote, ListTree, Globe2 } from 'lucide-react';
import type { ConceptHit, ThreadStepHit, VerseHit } from '../utils/references';
import type { SupportedLanguage } from '../types/i18n';
import { useLanguage } from '../context/LanguageContext';
import { systemNames } from '../i18n/systems';
import { t } from '../i18n/ui';
import { CollapsibleSection, chipBase } from './Primitives';

/**
 * Reference sections without the content corpus. Hits arrive as legacy
 * shapes built from V2 chunks (see `src/content/v2/compat.ts`); titles
 * resolve from the hit payloads and the static `systemNames` sidecar, so
 * this module never imports the monolithic content bundle.
 */

function conceptTitleOf(hit: ConceptHit, lang: SupportedLanguage): string {
  return hit.concept.content[lang]?.title || hit.concept.content.en?.title || (hit.concept.id as string);
}

function stepTitleOf(step: ThreadStepHit['step'], lang: SupportedLanguage): string {
  return step.content[lang]?.title || step.content.en?.title || (step.id as string);
}

function systemTitleOf(systemId: string, lang: SupportedLanguage): string {
  const entry = systemNames[systemId];
  if (lang === 'ml' && entry?.ml) return entry.ml.title;
  return entry?.en.title || systemId;
}

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
    <CollapsibleSection title={title} icon={icon} count={count}>
      {children}
    </CollapsibleSection>
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
        const systemTitle = crossSystem ? systemTitleOf(hit.systemId, language) : undefined;
        const title = conceptTitleOf(hit, language);
        return (
          <Link
            key={key}
            to={`/system/${hit.systemId}/text/${hit.textId}/concept/${hit.concept.id}`}
            className={chipBase}
            title={crossSystem && systemTitle ? `${title} — ${systemTitle}` : title}
          >
            {title}
            {crossSystem && systemTitle && (
              <span className="ms-1.5 text-[11px] uppercase font-semibold text-sattva-dim">
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
export function VerseChips({ items, verseTerm = 'Verse' }: { items: VerseHit[]; verseTerm?: string }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((hit) => {
        const tip = hit.verse.content[language]?.translation || hit.verse.content.en?.translation;
        return (
          <Link
            key={`${hit.systemId}:${hit.textId}:${hit.verse.id}`}
            to={`/system/${hit.systemId}/text/${hit.textId}/verse/${hit.verse.id}`}
            className={chipBase}
            title={tip?.slice(0, 120)}
          >
            {verseTerm} {hit.verse.number}
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
          className={chipBase}
        >
          {stepLabel} {stepIndex + 1}: {stepTitleOf(step, language).slice(0, 42)}
          {stepTitleOf(step, language).length > 42 ? '…' : ''}
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
    <RefSection icon={<Network aria-hidden="true" className="w-4 h-4" />} title={t(language, 'relatedConcepts')} count={items.length}>
      <ConceptChips items={items} currentSystemId={currentSystemId} />
    </RefSection>
  );
}

export function RelatedVersesSection({ items, title, verseTerm }: { items: VerseHit[]; title?: string; verseTerm?: string }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <RefSection icon={<Quote aria-hidden="true" className="w-4 h-4" />} title={title || t(language, 'relatedVerses')} count={items.length}>
      <VerseChips items={items} verseTerm={verseTerm} />
    </RefSection>
  );
}

export function ThreadMentionsSection({ steps, title }: { steps: ThreadStepHit[]; title?: string }) {
  const { language } = useLanguage();
  if (steps.length === 0) return null;
  return (
    <RefSection icon={<ListTree aria-hidden="true" className="w-4 h-4" />} title={title || t(language, 'exploredInThread')} count={steps.length}>
      <ThreadStepLinks steps={steps} />
    </RefSection>
  );
}

export function CrossSystemSection({ items }: { items: ConceptHit[] }) {
  const { language } = useLanguage();
  if (items.length === 0) return null;
  return (
    <RefSection icon={<Globe2 aria-hidden="true" className="w-4 h-4" />} title={t(language, 'alsoInOtherDarshanas')} count={items.length}>
      <ConceptChips items={items} currentSystemId="" />
    </RefSection>
  );
}
