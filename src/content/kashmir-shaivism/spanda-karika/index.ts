import { ClassicalText } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { spandaKarikaVersesEn } from './spanda-karika-verses-en';
import { spandaKarikaVersesMl } from './spanda-karika-verses-ml';
import { spandaKarikaConceptsEn } from './spanda-karika-concepts-en';
import { spandaKarikaConceptsMl } from './spanda-karika-concepts-ml';
import { spandaKarikaThreadEn } from './spanda-karika-thread-en';
import { spandaKarikaThreadMl } from './spanda-karika-thread-ml';
import { spandaKarikaStudyEn } from './spanda-karika-study-en';

// Spanda-kārikās (Vasugupta/Kallaṭa) with Kṣemarāja's Spanda-nirṇaya line
// (Jaideva Singh edition as source: Drive 1XPiaj9NoV9CHFnDl9yuNXS-ThxG75JcN,
// MLBD 2007). Text file stays isolated in this directory; the text belongs to
// the unified 'tantra' system (see src/content/tantra/index.ts).
//
// Carry-over policy (copyright + architecture): Singh's translation and
// commentary are NOT reproduced. What is carried over is structure (53
// kārikās, 4 niḥṣyandas), our own concise translations/commentaries in EN +
// ML, original word-by-word glosses + textual notes (study layer), an original
// introduction digest and glossary standing in for Singh's front/back matter,
// and full EN+ML concept/thread overlays.

// Overlay the study layer (wordMeaning / variantNote) onto the EN verses.
const spandaKarikaVersesEnStudied = (spandaKarikaVersesEn as any[]).map((v: any) => {
  const study = (spandaKarikaStudyEn as Record<string, any>)[v.id];
  if (!study) return v;
  const extra: any = { wordMeaning: study.wordMeaning };
  if (study.variantNote) extra.variantNote = study.variantNote;
  return { ...v, ...extra };
});

export const spandaKarikaText: ClassicalText = buildClassicalText(
  {
    id: 'spanda-karika',
    title: 'Spanda-kārikās',
    transliteratedTitle: 'Spanda-kārikās',
    author: 'Vasugupta / Kallaṭa (with Kṣemarāja’s Spanda-nirṇaya)',
    system: 'tantra',
    contentDepth: 'full',
    verseTerm: 'Kārikā'
  },
  {
    en: spandaKarikaVersesEnStudied,
    ml: spandaKarikaVersesMl
  },
  {
    en: spandaKarikaConceptsEn,
    ml: spandaKarikaConceptsMl
  }
);

export const spandaKarikaThread = buildSystemThread('spanda-karika', {
  en: spandaKarikaThreadEn,
  ml: spandaKarikaThreadMl
});

// Standalone study apparatus (Devi-Māhātmya Upodghāta pattern: exported
// directly, not part of the ClassicalText schema).
export { spandaKarikaStudyEn } from './spanda-karika-study-en';
export { spandaKarikaIntroEn } from './spanda-karika-intro-en';
export { spandaKarikaIntroMl } from './spanda-karika-intro-ml';
export { spandaKarikaGlossaryEn } from './spanda-karika-glossary-en';
export { spandaKarikaGlossaryMl } from './spanda-karika-glossary-ml';
export {
  spandaKarikaAlphabeticalIndexEn,
  spandaKarikaWordIndexEn,
  spandaKarikaSubjectIndexEn
} from './spanda-karika-indexes-en';
export { spandaKarikaSubjectIndexMl } from './spanda-karika-indexes-ml';
