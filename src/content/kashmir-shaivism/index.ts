import { System, ClassicalText, SystemId } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { tantralokaConceptsEn, TantralokaConcept } from './tantraloka-concepts-en';
import { tantralokaConceptsMl } from './tantraloka-concepts-ml';
import { tantralokaThreadMl } from './tantraloka-thread-ml';
import { tantralokaVersesEn } from './tantraloka-verses-en';
import { tantralokaVersesMl } from './tantraloka-verses-ml';

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

export const tantralokaText: ClassicalText = buildClassicalText(
  {
    id: 'tantraloka',
    title: 'Tantrāloka',
    transliteratedTitle: 'Tantrāloka',
    author: 'Abhinavagupta',
    system: 'kashmir-shaivism',
    contentDepth: 'full',
    verseTerm: 'Śloka',
    sources: [{ name: 'Tantrāloka Translation', status: 'integrated' }]
  },
  {
    en: tantralokaVersesEn,
    ml: tantralokaVersesMl
  },
  {
    en: mappedConceptsEn,
    ml: mappedConceptsMl
  }
);

export const kashmirShaivismSystem: System = {
  id: 'kashmir-shaivism' as SystemId,
  title: 'Kashmir Shaivism',
  subtitle: 'The non-dual philosophy of Trika and Spanda',
  texts: [tantralokaText],
  thread: buildSystemThread('tantraloka', {
    en: mappedThreadEn,
    ml: mappedThreadMl
  })
};
