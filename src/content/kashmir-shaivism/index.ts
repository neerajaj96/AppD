import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { tantralokaConceptsEn, TantralokaConcept } from './tantraloka-concepts-en';
import { tantralokaConceptsMl } from './tantraloka-concepts-ml';
import { tantralokaThreadMl } from './tantraloka-thread-ml';
import { tantralokaVersesEn } from './tantraloka-verses-en';
import { tantralokaVersesMl } from './tantraloka-verses-ml';
import { mishraTrikaConceptsEn } from './mishra-trika-concepts-en';
import { mishraTrikaThreadEn } from './mishra-trika-thread-en';

const mappedConceptsEn = tantralokaConceptsEn.map((c: TantralokaConcept) => ({
  id: c.id,
  title: `${c.sanskrit} (${c.iast}) - ${c.english}`,
  category: c.category,
  summary: c.definition + "\n\nSignificance: " + c.significance + (c.forBeginners ? "\n\nFor Beginners: " + c.forBeginners : ""),
  relatedConceptIds: c.relatedConcepts
}));

const mappedConceptsMl = Object.entries(tantralokaConceptsMl).map(([id, c]) => ({
  id,
  title: (c as { title: string }).title,
  summary: (c as { summary: string }).summary,
}));

const mappedThreadEn = tantralokaConceptsEn.map((c: TantralokaConcept, index: number) => ({
  id: `ks-step-${index + 1}`,
  conceptId: c.id,
  title: c.english,
  narrative: `Part of the master ontology of Kashmir Shaivism.\n\nCategory: ${c.category}\n\n${c.definition}\n\n${c.forBeginners ? "For Beginners: " + c.forBeginners : ""}`
}));

const mappedThreadMl = Object.entries(tantralokaThreadMl).map(([id, t]) => ({
  id,
  title: (t as { title: string }).title,
  narrative: (t as { narrative: string }).narrative
}));

// Text file stays isolated in this directory; the text now belongs to the
// unified 'tantra' system (see src/content/tantra/index.ts).
// The closing synthesis (ks-step-190+) carries the metaphysical chapters of
// the former standalone Mishra study guide, merged here verbatim — its
// foundation and practice chapters live instead in the Kuṇḍalinī Tantra text
// (see ../kundalini-tantra/mishra-bridge-concepts-en.ts). The merged steps
// have no Malayalam entries yet and fall back to English (as the guide did).
export const tantralokaText: ClassicalText = buildClassicalText(
  {
    id: 'tantraloka',
    title: 'Tantrāloka',
    transliteratedTitle: 'Tantrāloka',
    author: 'Abhinavagupta',
    system: 'tantra',
    contentDepth: 'full',
    verseTerm: 'Śloka'
  },
  {
    en: tantralokaVersesEn,
    ml: tantralokaVersesMl
  },
  {
    en: [...mappedConceptsEn, ...mishraTrikaConceptsEn],
    ml: mappedConceptsMl
  }
);

export const tantralokaThread = buildSystemThread('tantraloka', {
  en: [...mappedThreadEn, ...mishraTrikaThreadEn],
  ml: mappedThreadMl
});
