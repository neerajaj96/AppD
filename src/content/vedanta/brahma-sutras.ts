import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { brahmaSutrasEn } from './brahma-sutras-en';
import { brahmaSutrasEnAdhyaya2 } from './brahma-sutras-en-adhyaya2';
import { brahmaSutrasEnAdhyaya3Part1 } from './brahma-sutras-en-adhyaya3-1';
import { brahmaSutrasEnAdhyaya3Part2 } from './brahma-sutras-en-adhyaya3-2';
import { brahmaSutrasEnAdhyaya4 } from './brahma-sutras-en-adhyaya4';
import { brahmaSutrasMl } from './brahma-sutras-ml';
import { brahmaSutrasConceptsEn } from './brahma-sutras-concepts-en';
import { brahmaSutrasConceptsMl } from './brahma-sutras-concepts-ml';
import { brahmaSutrasThreadEn } from './brahma-sutras-thread-en';

// The Brahma Sūtra source files use a compact legacy shape
// ({ id: "1.1.1", sanskrit, adhyaya, pada, translation }) which does not
// match the global Verse schema (id, number, section, devanagari, iast,
// content). Normalize here so the compiler in ../factory receives valid
// Verse/Concept input and ID sync with the thread (verseIds like "1.1.1")
// is preserved. Per AGENTS.md: verses must contain id/number/section/
// devanagari/iast/content; no schema invention.
function normalizeSutra(raw: any) {
  const id = `${raw.id}`;
  const adhyaya = raw.adhyaya;
  const pada = raw.pada;
  const section =
    raw.section ||
    (adhyaya != null && pada != null
      ? `Adhyāya ${adhyaya} · Pāda ${pada}`
      : 'Brahma Sūtras');
  return {
    ...raw,
    id,
    number: raw.number ?? id,
    section,
    devanagari: raw.devanagari ?? raw.sanskrit,
    // No IAST source for this text; keep empty string (never undefined)
    // so VerseDetail/searchIndex can safely call .split/.toLowerCase.
    iast: raw.iast ?? '',
  };
}

function normalizeConcept(raw: any) {
  return {
    ...raw,
    // Factory reads relatedConceptIds; legacy files use relatedConcepts.
    relatedConceptIds: raw.relatedConceptIds ?? raw.relatedConcepts ?? [],
  };
}

const allEnVerses = [
  ...brahmaSutrasEn,
  ...brahmaSutrasEnAdhyaya2,
  ...brahmaSutrasEnAdhyaya3Part1,
  ...brahmaSutrasEnAdhyaya3Part2,
  ...brahmaSutrasEnAdhyaya4
].map(normalizeSutra);

const allMlVerses = brahmaSutrasMl.map(normalizeSutra);

export const brahmaSutrasText: ClassicalText = buildClassicalText(
  {
    id: 'brahma-sutras',
    title: 'Brahma Sutras',
    transliteratedTitle: 'Brahma Sutras',
    author: 'Bādarāyaṇa (with Śaṅkara Bhāṣya)',
    system: 'vedanta',
    verseTerm: 'Sūtra',
    contentStatus: 'partial'
  },
  {
    en: allEnVerses,
    ml: allMlVerses
  },
  {
    en: brahmaSutrasConceptsEn.map(normalizeConcept),
    ml: brahmaSutrasConceptsMl.map(normalizeConcept)
  }
);

export const brahmaSutrasThread = buildSystemThread('brahma-sutras', {
  en: brahmaSutrasThreadEn
});
