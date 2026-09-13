import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { kundaliniTantraConceptsEn } from './kundalini-tantra-concepts-en';
import { mishraBridgeConceptsEn } from './mishra-bridge-concepts-en';
import { kundaliniTantraConceptsMl } from './kundalini-tantra-concepts-ml';
import { kundaliniTantraThreadEn } from './kundalini-tantra-thread-en';
import { kundaliniTantraThreadMl } from './kundalini-tantra-thread-ml';

// Traditional kuṇḍalinī teaching (no sutra verses): concepts-only text.
// Summaries are original paraphrases in this app's own words.
// The closing Part III (mishra-bridge-concepts-en) carries the foundation
// and practice chapters of the former standalone Kashmir Śaivism study
// guide, merged here verbatim — its metaphysical chapters live instead in
// the Tantrāloka text (see ../kashmir-shaivism/mishra-trika-concepts-en.ts).
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
    en: [...kundaliniTantraConceptsEn, ...mishraBridgeConceptsEn],
    ml: kundaliniTantraConceptsMl,
  }
);

export const kundaliniTantraThread = buildSystemThread('kundalini-tantra', {
  en: kundaliniTantraThreadEn,
  ml: kundaliniTantraThreadMl,
});
