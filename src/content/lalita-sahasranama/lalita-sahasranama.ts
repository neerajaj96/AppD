import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { lalitaSahasranamaVersesEn } from './lalita-sahasranama-verses-en';
import { lalitaSahasranamaConceptsEn } from './lalita-sahasranama-concepts-en';
import { lalitaSahasranamaThreadEn } from './lalita-sahasranama-thread-en';

// Lalitā Sahasranāma — the thousand-name hymn of Lalitā Tripurasundarī
// (Brahmāṇḍa Purāṇa, Lalitopākhyāna; composed by the eight Vāc Devis).
// Verses: 4 dhyāna + 183 stotra ślokas. Concepts: all 1000 nāmas, each
// linked to its stotra verse (sequence-verified). Summaries are this
// project's own paraphrases; see lalita-sahasranama-source-provenance.ts.
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
    en: lalitaSahasranamaVersesEn,
  },
  {
    en: lalitaSahasranamaConceptsEn,
  }
);

export const lalitaSahasranamaThread = buildSystemThread('lalita-sahasranama', {
  en: lalitaSahasranamaThreadEn,
});
