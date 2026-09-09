import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { nyayaSutrasEn } from './nyaya-sutras-en';
import { nyayaSutrasMalayalam } from './nyaya-sutras-ml';
import { nyayaConceptsEn } from './nyaya-sutras-concepts-en';
import { nyayaSutrasConceptsMl } from './nyaya-sutras-concepts-ml';
import { nyayaSutrasThreadEn } from './nyaya-sutras-thread-en';
import { nyayaSutrasThreadMl } from './nyaya-sutras-thread-ml';

// Provenance: sutra translations and Bhashya/Vartika substance follow the
// public-domain English rendering by Mm. Dr. Ganganatha Jha (1872-1941),
// first published serially in 'Indian Thought' Vols. IV-XI, 1912-1919
// (Motilal Banarsidass reprint, 1984). PD in India (life + 60) and the US
// (pre-1930 publication). Commentaries here are condensed in the app's own
// words; only short sutra renderings track Jha closely. Malayalam
// translations are original to this project.

const mappedNyayaConceptsEn = nyayaConceptsEn.map((c: any) => ({
  id: c.id,
  title: `${c.sanskrit} (${c.iast}) - ${c.english}`,
  summary: `Category: ${c.category}\n\nDefinition: ${c.definition}\n\nSignificance: ${c.significance}${c.forBeginners ? "\n\nFor Beginners: " + c.forBeginners : ""}`,
  relatedVerseIds: []
}));

export const nyayaSutras: ClassicalText = buildClassicalText(
  {
    id: 'nyaya-sutras',
    title: 'Nyāya Sūtra',
    transliteratedTitle: 'Nyāya Sūtra',
    author: 'Gautama',
    system: 'nyaya',
    verseTerm: 'Sūtra'
  },
  {
    en: nyayaSutrasEn,
    ml: nyayaSutrasMalayalam
  },
  {
    en: mappedNyayaConceptsEn,
    ml: nyayaSutrasConceptsMl
  }
);

const enrichedThreadEn = nyayaSutrasThreadEn.map((step: any) => {
  const concept = nyayaConceptsEn.find(c => c.id === step.conceptId);
  if (concept && concept.forBeginners) {
    return { ...step, narrative: step.narrative + "\n\nFor Beginners: " + concept.forBeginners };
  }
  return step;
});

export const nyayaSutrasThread = buildSystemThread('nyaya-sutras', {
  en: enrichedThreadEn,
  ml: nyayaSutrasThreadMl
});
