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

// Provenance: the Sadhana-Samara inner-war reading distilled here follows
// Brahmarsi Satyadev (1883-1932, disciple of Bijoy Krishna Chattopadhyay),
// 'Sadhan-Samar' (Hindi rendering ready 1927; Vol. 1: Brahmagranthi-bheda).
// Author died 1932: public domain in India (life + 60) and the US (Indian
// copyright expired before URAA restoration date). Retellings here are in
// this project's own words; the Guptavati material is a separate,
// much older commentary tradition (Bhaskararaya).

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
