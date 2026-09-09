import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { deviMahatmyaVersesEn } from './devi-mahatmya-verses-en';
import { deviMahatmyaVersesMl } from './devi-mahatmya-verses-ml';
import { deviMahatmyaConceptsEn } from './devi-mahatmya-concepts-en';
import { deviMahatmyaConceptsMl } from './devi-mahatmya-concepts-ml';
import { deviMahatmyaThreadEn } from './devi-mahatmya-thread-en';
import { deviMahatmyaThreadMl } from './devi-mahatmya-thread-ml';
import {
  guptavatiConceptsEn,
  guptavatiConceptsMl,
  guptavatiIntroTopics,
  guptavatiUpodghataEn
} from './devi-mahatmya-intro-guptavati';
import type { UpodghataTopicEn } from './devi-mahatmya-intro-guptavati';

export {
  guptavatiIntroTopics,
  guptavatiConceptsEn,
  guptavatiConceptsMl,
  guptavatiUpodghataEn
};
export type { UpodghataTopicEn };

export const deviMahatmyaText: ClassicalText = buildClassicalText(
  {
    id: 'devi-mahatmya',
    title: 'देवीमाहात्म्यम् (Devī Māhātmya)',
    transliteratedTitle: 'Devīmāhātmyam',
    author: 'Sage Mārkaṇḍeya / Sage Medhas',
    system: 'tantra',
    contentDepth: 'full',
    verseTerm: 'Śloka'
  },
  {
    en: deviMahatmyaVersesEn,
    ml: deviMahatmyaVersesMl
  },
  {
    en: [...deviMahatmyaConceptsEn, ...guptavatiConceptsEn],
    ml: [...deviMahatmyaConceptsMl, ...guptavatiConceptsMl]
  }
);

// Text file stays isolated in this directory; the text now belongs to the
// unified 'tantra' system (see src/content/tantra/index.ts).
export const deviMahatmyaThread = buildSystemThread('devi-mahatmya', {
  en: deviMahatmyaThreadEn,
  ml: deviMahatmyaThreadMl
});
