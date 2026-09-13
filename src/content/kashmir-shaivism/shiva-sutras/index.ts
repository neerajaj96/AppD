import { ClassicalText } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { shivaSutrasVersesEn } from './shiva-sutras-verses-en';
import { shivaSutrasConceptsEn } from './shiva-sutras-concepts-en';
import { shivaSutrasThreadEn } from './shiva-sutras-thread-en';

// Śiva-sūtras of Vasugupta with Kṣemarāja's Vimarśinī line (Jaideva Singh
// edition as source). Text file stays isolated in this directory; the text
// belongs to the unified 'tantra' system (see src/content/tantra/index.ts).
export const shivaSutrasText: ClassicalText = buildClassicalText(
  {
    id: 'shiva-sutras',
    title: 'Śiva-sūtras',
    transliteratedTitle: 'Śiva-sūtras',
    author: 'Vasugupta (with Kṣemarāja’s Vimarśinī)',
    system: 'tantra',
    contentDepth: 'full',
    verseTerm: 'Sūtra'
  },
  {
    en: shivaSutrasVersesEn
  },
  {
    en: shivaSutrasConceptsEn
  }
);

export const shivaSutrasThread = buildSystemThread('shiva-sutras', {
  en: shivaSutrasThreadEn
});
