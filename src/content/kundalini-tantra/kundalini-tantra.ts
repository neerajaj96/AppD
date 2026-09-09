import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { kundaliniTantraConceptsEn } from './kundalini-tantra-concepts-en';
import { kundaliniTantraThreadEn } from './kundalini-tantra-thread-en';

// Traditional kuṇḍalinī teaching (no sutra verses): concepts-only text.
// Summaries are original paraphrases in this app's own words.
export const kundaliniTantraText: ClassicalText = buildClassicalText(
  {
    id: 'kundalini-tantra',
    title: 'Kundalini Tantra',
    transliteratedTitle: 'Kundalini Tantra',
    author: 'Darshana compilation',
    system: 'tantra',
    contentDepth: 'concepts-only',
    verseTerm: 'Chapter'
  },
  {
    en: [],
  },
  {
    en: kundaliniTantraConceptsEn,
  }
);

export const kundaliniTantraThread = buildSystemThread('kundalini-tantra', {
  en: kundaliniTantraThreadEn,
});
