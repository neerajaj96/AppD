import { ClassicalText } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { shivaSutrasVersesEn } from './shiva-sutras-verses-en';
import { shivaSutrasVersesMl } from './shiva-sutras-verses-ml';
import { shivaSutrasConceptsEn } from './shiva-sutras-concepts-en';
import { shivaSutrasConceptsMl } from './shiva-sutras-concepts-ml';
import { shivaSutrasThreadEn } from './shiva-sutras-thread-en';
import { shivaSutrasThreadMl } from './shiva-sutras-thread-ml';
import { shivaSutrasStudyEn } from './shiva-sutras-study-en';

// Śiva-sūtras of Vasugupta with Kṣemarāja's Vimarśinī line (Jaideva Singh
// edition as source: Drive 1owICBYbrfgLfEocl76tsbIs4D_4Z4kMb, MLBD 2006).
// Text file stays isolated in this directory; the text belongs to the
// 'kashmir-shaivism' system (see src/content/kashmir-shaivism/index.ts).
//
// Carry-over policy (copyright + architecture): Singh's translation and
// commentary are NOT reproduced. What is carried over is structure (77
// sūtras, 3 sections), our own concise translations/commentaries in EN + ML,
// original word-by-word glosses + textual notes (study layer), an original
// introduction digest and glossary standing in for Singh's front/back
// matter, and full EN+ML concept/thread overlays.

// Overlay the study layer (wordMeaning / variantNote) onto the EN verses.
const shivaSutrasVersesEnStudied = (shivaSutrasVersesEn as any[]).map((v: any) => {
  const study = (shivaSutrasStudyEn as Record<string, any>)[v.id];
  if (!study) return v;
  const extra: any = { wordMeaning: study.wordMeaning };
  if (study.variantNote) extra.variantNote = study.variantNote;
  return { ...v, ...extra };
});

export const shivaSutrasText: ClassicalText = buildClassicalText(
  {
    id: 'shiva-sutras',
    title: 'Śiva-sūtras',
    transliteratedTitle: 'Śiva-sūtras',
    author: 'Vasugupta (with Kṣemarāja’s Vimarśinī)',
    system: 'kashmir-shaivism',
    contentDepth: 'full',
    verseTerm: 'Sūtra'
  },
  {
    en: shivaSutrasVersesEnStudied,
    ml: shivaSutrasVersesMl
  },
  {
    en: shivaSutrasConceptsEn,
    ml: shivaSutrasConceptsMl
  }
);

export const shivaSutrasThread = buildSystemThread('shiva-sutras', {
  en: shivaSutrasThreadEn,
  ml: shivaSutrasThreadMl
});

// Standalone study apparatus (Devi-Māhātmya Upodghāta pattern: exported
// directly, not part of the ClassicalText schema).
export { shivaSutrasStudyEn } from './shiva-sutras-study-en';
export { shivaSutrasIntroEn } from './shiva-sutras-intro-en';
export { shivaSutrasIntroMl } from './shiva-sutras-intro-ml';
export { shivaSutrasGlossaryEn } from './shiva-sutras-glossary-en';
export { shivaSutrasGlossaryMl } from './shiva-sutras-glossary-ml';
export {
  shivaSutrasAlphabeticalIndexEn,
  shivaSutrasWordIndexEn,
  shivaSutrasSubjectIndexEn
} from './shiva-sutras-indexes-en';
export { shivaSutrasSubjectIndexMl } from './shiva-sutras-indexes-ml';
