// Bhagavad Gītā with the Sarvatobhadra of Rājānaka Rāmakantha (KSTS LXIV, 1943).
// One compiled text: 701 mūla verses (Kashmir recension: 700 + the extra 13.1
// opening question) + 13 adhika-padyāni appendix verses, 25 concepts + 7 Rāmakaṇṭha-grounded pilot concepts, 18 thread steps.
// English complete; Malayalam verses follow (concepts/thread already bilingual).
import { ClassicalText, ThreadStep } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { gitaEnPart1 } from './gita-en-part1';
import { gitaEnPart2 } from './gita-en-part2';
import { gitaEnPart3 } from './gita-en-part3';
import { gitaEnPart4 } from './gita-en-part4';
import { gitaEnPart5 } from './gita-en-part5';
import { gitaEnPart6 } from './gita-en-part6';
import { gitaEnAdhika } from './gita-en-adhika';
import { gitaMlPart1 } from './gita-ml-part1';
import { gitaMlPart2 } from './gita-ml-part2';
import { gitaMlPart3 } from './gita-ml-part3';
import { gitaMlPart4 } from './gita-ml-part4';
import { gitaMlPart5 } from './gita-ml-part5';
import { gitaMlPart6 } from './gita-ml-part6';
import { gitaMlAdhika } from './gita-ml-adhika';
import { gitaConceptsEn } from './gita-concepts-en';
import { gitaConceptsMl } from './gita-concepts-ml';
import { gitaRamakanthaConcepts } from './gita-ramakantha-concepts';
import { gitaThreadEn } from './gita-thread-en';
import { gitaThreadMl } from './gita-thread-ml';

const TEXT_ID = 'bhagavad-gita';

const allEnVerses = [
  ...gitaEnPart1,
  ...gitaEnPart2,
  ...gitaEnPart3,
  ...gitaEnPart4,
  ...gitaEnPart5,
  ...gitaEnPart6,
  ...gitaEnAdhika,
];

const allMlVerses = [
  ...gitaMlPart1,
  ...gitaMlPart2,
  ...gitaMlPart3,
  ...gitaMlPart4,
  ...gitaMlPart5,
  ...gitaMlPart6,
  ...gitaMlAdhika,
];

export const bhagavadGitaText: ClassicalText = buildClassicalText(
  {
    id: TEXT_ID,
    title: 'Bhagavad Gītā',
    transliteratedTitle: 'Bhagavad Gita',
    author: 'Vyāsa (with Sarvatobhadra of Rājānaka Rāmakantha)',
    system: 'vedanta',
    verseTerm: 'Śloka',
    contentStatus: 'complete',
  },
  {
    en: allEnVerses,
    ml: allMlVerses,
  },
  {
    en: [...gitaConceptsEn, ...gitaRamakanthaConcepts],
    ml: gitaConceptsMl,
  }
);

export const bhagavadGitaThread: ThreadStep[] = buildSystemThread(TEXT_ID, {
  en: gitaThreadEn,
  ml: gitaThreadMl,
});
