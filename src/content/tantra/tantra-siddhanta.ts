import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { tantraSiddhantaConceptsEn } from './tantra-siddhanta-concepts-en';
import { tantraSiddhantaThreadEn } from './tantra-siddhanta-thread-en';

// Our own compilation: original doctrine retold, no verses, no borrowed prose.
export const tantraSiddhantaText: ClassicalText = buildClassicalText(
  {
    id: 'tantra-siddhanta',
    title: 'Tantra-Siddhānta',
    transliteratedTitle: 'Tantra-Siddhānta',
    author: 'Darshana compilation (Trika, Krama, Kula, Spanda, Pratyabhijñā and Śrīvidyā synthesis)',
    system: 'tantra',
    contentDepth: 'concepts-only',
    verseTerm: 'Section'
  },
  {
    en: [],
  },
  {
    en: tantraSiddhantaConceptsEn,
  }
);

export const tantraSiddhantaThread = buildSystemThread('tantra-siddhanta', {
  en: tantraSiddhantaThreadEn,
});
