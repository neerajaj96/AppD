import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { vsStotraA } from './vs-stotra-a';
import { vsStotraB } from './vs-stotra-b';
import { vsStotraC } from './vs-stotra-c';
import { vsFrameEn } from './frame/vs-frame-verses-en';
import { vishnuSahasranamaConceptsEn } from './vishnu-sahasranama-concepts-en';
import { vishnuSahasranamaThreadEn } from './vishnu-sahasranama-thread-en';

// Viṣṇu Sahasranāma — the thousand-name hymn of Viṣṇu as Para-Brahman
// (Mahābhārata, Anuśāsana-Parva, Bhīṣma to Yudhiṣṭhira).
// Verses: 13 pūrva-pīṭhikā + 1 dhyāna + 1 rakṣā + 107 stotra ślokas
// + 22 phalaśruti, in recitation order.
// Concepts: all 1000 nāmas, each linked to its stotra verse
// (sequence-verified against the edition text). Summaries are this
// project's own paraphrases; see
// vishnu-sahasranama-source-provenance.ts.
export const vishnuSahasranamaText: ClassicalText = buildClassicalText(
  {
    id: 'vishnu-sahasranama',
    title: 'विष्णुसहस्रनाम (Viṣṇu Sahasranāma)',
    transliteratedTitle: 'Viṣṇusahasranāma',
    author: 'Vedavyāsa (Mahābhārata, Anuśāsana-Parva)',
    system: 'vedanta',
    contentDepth: 'full',
    verseTerm: 'Śloka',
  },
  {
    en: [...vsFrameEn.slice(0, 14), ...vsStotraA, ...vsStotraB, ...vsStotraC, ...vsFrameEn.slice(14)],
  },
  {
    en: vishnuSahasranamaConceptsEn,
  }
);

export const vishnuSahasranamaThread = buildSystemThread('vishnu-sahasranama', {
  en: vishnuSahasranamaThreadEn,
});
