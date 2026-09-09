import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { kundaliniTantraConceptsEn } from './kundalini-tantra-concepts-en';
import { kundaliniTantraThreadEn } from './kundalini-tantra-thread-en';

// Modern tantric synthesis (no sutra verses): concepts-only text.
// Summaries are original paraphrases; no verbatim book prose is stored.
export const kundaliniTantraText: ClassicalText = buildClassicalText(
  {
    id: 'kundalini-tantra',
    title: 'Kundalini Tantra',
    transliteratedTitle: 'Kundalini Tantra',
    author: 'Swami Satyananda Saraswati',
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
