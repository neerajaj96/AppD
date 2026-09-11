import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { lalitaSahasranamaVersesEn } from './lalita-sahasranama-verses-en';
import { lsPurvaVersesEn } from './frame/ls-purva-verses-en';
import { lsUttaraVersesEnA } from './frame/ls-uttara-verses-en-a';
import { lsUttaraVersesEnB } from './frame/ls-uttara-verses-en-b';
import { lalitaSahasranamaConceptsEn } from './lalita-sahasranama-concepts-en';
import { lalitaSahasranamaThreadEn } from './lalita-sahasranama-thread-en';

// Lalitā Sahasranāma — the thousand-name hymn of Lalitā Tripurasundarī
// (Brahmāṇḍa Purāṇa, Lalitopākhyāna; composed by the eight Vāc Devis).
// Verses: 4 dhyāna + 183 stotra ślokas, framed by 64 pūrva-pīṭhikā and
// 84 uttara-pīṭhikā (phalaśruti) verses in recitation order.
// Concepts: all 1000 nāmas, each linked to its stotra verse
// (sequence-verified). Summaries are this project's own paraphrases; see
// lalita-sahasranama-source-provenance.ts.
export const lalitaSahasranamaText: ClassicalText = buildClassicalText(
  {
    id: 'lalita-sahasranama',
    title: 'ललितासहस्रनाम (Lalitā Sahasranāma)',
    transliteratedTitle: 'Lalitāsahasranāma',
    author: 'Vāc Devīs / Vedavyāsa (Brahmāṇḍa Purāṇa)',
    system: 'tantra',
    contentDepth: 'full',
    verseTerm: 'Śloka',
  },
  {
    en: [...lsPurvaVersesEn, ...lalitaSahasranamaVersesEn, ...lsUttaraVersesEnA, ...lsUttaraVersesEnB],
  },
  {
    en: lalitaSahasranamaConceptsEn,
  }
);

export const lalitaSahasranamaThread = buildSystemThread('lalita-sahasranama', {
  en: lalitaSahasranamaThreadEn,
});
