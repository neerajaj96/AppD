import { useMemo } from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import { linkifyReferences, type ConceptLocation, type RefLink } from '../utils/crossref';

interface RichTextProps {
  text: string;
  /** Resolution context for bare [[concept:id]] / [[verse:id]] wiki links. */
  systemId?: string;
  textId?: string;
  className?: string;
  /**
   * Concepts known to exist in the current text (built from loaded chunks).
   * Bare `[[concept-id]]` links resolve against this set; anything else
   * renders as plain text rather than a dead link.
   */
  knownConcepts?: Pick<ConceptLocation, 'conceptId'>[] | Set<string>;
  /** Display title for a linked concept (falls back to the concept id). */
  conceptTitle?: (conceptId: string) => string | undefined;
}

/** Unwrap Markdown paragraphs so linkified prose stays inline. */
function InlineMarkdown({ source }: { source: string }) {
  return (
    <Markdown components={{ p: ({ children }) => <>{children}</> }}>
      {source}
    </Markdown>
  );
}

function RefRouterLink({ link, label, fallback, conceptTitle }: { link: RefLink; label?: string; fallback: string; conceptTitle?: (conceptId: string) => string | undefined }) {
  const linkClass =
    'text-rajas hover:text-rajas-dim underline decoration-rajas/40 underline-offset-2 transition-colors motion-reduce:transition-none';

  if (link.kind === 'verse') {
    return (
      <Link
        to={`/system/${link.systemId}/text/${link.textId}/verse/${link.verseId}`}
        className={linkClass}
        title={`${link.textId} ${link.verseId}`}
      >
        {label || fallback}
      </Link>
    );
  }
  if (link.kind === 'concept') {
    const title = conceptTitle?.(link.conceptId);
    return (
      <Link
        to={`/system/${link.systemId}/text/${link.textId}/concept/${link.conceptId}`}
        className={linkClass}
        title={title || link.conceptId}
      >
        {label || title || fallback}
      </Link>
    );
  }
  if (link.kind === 'thread') {
    const to =
      link.stepIndex !== undefined
        ? `/system/${link.systemId}/thread?step=${link.stepIndex + 1}`
        : `/system/${link.systemId}/thread`;
    return (
      <Link to={to} className={linkClass}>
        {label || fallback}
      </Link>
    );
  }
  return (
    <Link to={`/system/${link.systemId}/text/${link.textId}`} className={linkClass}>
      {label || fallback}
    </Link>
  );
}

/**
 * Wikipedia-style prose renderer: Markdown plus inline links for every
 * resolvable verse / concept / thread / text reference.
 * Unresolvable references render as plain text — never dead links.
 */
export default function RichText({ text, systemId, textId, className, knownConcepts, conceptTitle }: RichTextProps) {
  const segments = useMemo(() => {
    const known = knownConcepts instanceof Set
      ? knownConcepts
      : new Set((knownConcepts || []).map((c) => c.conceptId));
    return linkifyReferences(
      text || '',
      { systemId, textId },
      {
        findConcept: (conceptId, preferred) => {
          if (!known.has(conceptId)) return undefined;
          return {
            systemId: preferred?.systemId || systemId || '',
            textId: preferred?.textId || textId || '',
            conceptId,
          };
        },
      },
    );
  }, [text, systemId, textId, knownConcepts]);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.link ? (
          <RefRouterLink key={i} link={seg.link} label={seg.label} fallback={seg.text} conceptTitle={conceptTitle} />
        ) : (
          <InlineMarkdown key={i} source={seg.text} />
        ),
      )}
    </span>
  );
}
