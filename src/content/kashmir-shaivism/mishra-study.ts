// Mishra study companion: a concepts-only text in the unified 'tantra' system.
// See src/content/tantra/index.ts for the assembly. Text file isolation is
// respected: Mishra's synthesis lives in mishra-study-concepts-en.ts,
// mishra-study-thread-en.ts and mishra-source-provenance.ts (this directory);
// only the built System entry lives under src/content/tantra/.
import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { mishraStudyConceptsEn } from './mishra-study-concepts-en';
import { mishraStudyThreadEn } from './mishra-study-thread-en';

export { mishraSourceProvenance } from './mishra-source-provenance';

// A study companion, not a root scripture: concepts-only (no verses).
// Summaries are original paraphrases in this app's own words.
export const mishraStudyText: ClassicalText = buildClassicalText(
  {
    id: 'mishra-study',
    title: 'Kashmir Śaivism: The Central Philosophy (Study Guide)',
    transliteratedTitle: 'Kashmir Shaivism Study Guide (after Mishra)',
    author: 'Darshana study guide after Kamalakar Mishra',
    system: 'tantra',
    contentDepth: 'concepts-only',
    verseTerm: 'Chapter'
  },
  {
    en: [],
  },
  {
    en: mishraStudyConceptsEn,
  }
);

export const mishraStudyThread = buildSystemThread('mishra-study', {
  en: mishraStudyThreadEn,
});
