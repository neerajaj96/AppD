import { ClassicalText, System, SystemId } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { mimamsaSutrasEn } from './mimamsa-sutras-en';
import { mimamsaSutrasMl } from './mimamsa-sutras-ml';
import { mimamsaConceptsEn } from './mimamsa-sutras-concepts-en';
import { mimamsaConceptsMl } from './mimamsa-sutras-concepts-ml';
import { mimamsaThreadEn } from './mimamsa-sutras-thread-en';
import { mimamsaThreadMl } from './mimamsa-sutras-thread-ml';

const mappedMimamsaMl = mimamsaSutrasMl.map((m: any) => ({
  id: m.id,
  translation: m.translation ?? m.malayalamSutra,
  commentary: m.commentary ?? m.malayalamCommentary,
  keyPoints: m.keyPoints
}));

const mappedMimamsaConceptsEn = mimamsaConceptsEn.map((c: any) => ({
  id: c.id,
  title: `${c.sanskrit} (${c.iast}) - ${c.english}`,
  summary: `**Category**: ${c.category}\n\n**Definition**: ${c.definition}\n\n**Significance**: ${c.significance}`,
  relatedVerseIds: []
}));

export const mimamsaSutrasText: ClassicalText = buildClassicalText(
  {
    id: 'mimamsa-sutras',
    title: 'Mīmāṃsā Sūtras',
    transliteratedTitle: 'Mīmāṃsā Sūtras',
    author: 'Jaimini',
    system: 'mimamsa',
    verseTerm: 'Sūtra'
  },
  {
    en: mimamsaSutrasEn,
    ml: mappedMimamsaMl
  },
  {
    en: mappedMimamsaConceptsEn,
    ml: mimamsaConceptsMl
  }
);

export const mimamsaSystem: System = {
  id: 'mimamsa' as SystemId,
  title: 'Pūrva Mīmāṃsā',
  subtitle: 'The Exegesis of Dharma',
  texts: [mimamsaSutrasText],
  thread: buildSystemThread('mimamsa-sutras', {
    en: mimamsaThreadEn,
    ml: mimamsaThreadMl
  })
};
