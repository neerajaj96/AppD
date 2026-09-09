import { useMemo } from 'react';
import { Link } from 'react-router';
import Markdown from 'react-markdown';
import { linkifyReferences, type RefLink } from '../utils/crossref';
import { findConcept } from '../utils/references';
import { useLanguage } from '../context/LanguageContext';

interface RichTextProps {
  text: string;
  /** Resolution context for bare [[concept:id]] / [[verse:id]] wiki links. */
  systemId?: string;
  textId?: string;
  className?: string;
}

/** Unwrap Markdown paragraphs so linkified prose stays inline. */
function InlineMarkdown({ source }: { source: string }) {
  return (
    <Markdown components={{ p: ({ children }) => <>{children}</> }}>
      {source}
    </Markdown>
  );
}

function RefRouterLink({ link, label, fallback }: { link: RefLink; label?: string; fallback: string }) {
  const { language } = useLanguage();
  const linkClass =
    'text-rajas hover:text-rajas-dim underline decoration-rajas/40 underline-offset-2 transition-colors';

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
    const hit = findConcept(link.conceptId, { systemId: link.systemId, textId: link.textId });
    const title =
      hit?.concept.content[language]?.title || hit?.concept.content.en?.title;
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
export default function RichText({ text, systemId, textId, className }: RichTextProps) {
  const segments = useMemo(
    () => linkifyReferences(text || '', { systemId, textId }),
    [text, systemId, textId],
  );

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.link ? (
          <RefRouterLink key={i} link={seg.link} label={seg.label} fallback={seg.text} />
        ) : (
          <InlineMarkdown key={i} source={seg.text} />
        ),
      )}
    </span>
  );
}
