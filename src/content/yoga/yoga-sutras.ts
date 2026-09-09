import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { yogaSutrasEn } from './yoga-sutras-en';
import { yogaSutrasMalayalam, yogaSutrasSamadhiPadaRemaining, yogaSutrasSadhanaPada1to15, yogaSutrasSadhanaPada16to30, yogaSutrasSadhanaPada31to55, yogaSutrasVibhutiPada1to20, yogaSutrasVibhutiPada21to55, yogaSutrasKaivalyaPada } from './yoga-sutras-ml';
import { yogaSutrasConceptsEn } from './yoga-sutras-concepts-en';
import { yogaSutrasConceptsMl } from './yoga-sutras-concepts-ml';
import { yogaSutrasThreadEn } from './yoga-sutras-thread-en';
import { yogaSutrasThreadMl } from './yoga-sutras-thread-ml';

const samadhiPada = [...yogaSutrasMalayalam, ...yogaSutrasSamadhiPadaRemaining].map(m => ({ ...m, chapter: 'I', id: `I.${m.id}` }));
const sadhanaPada = [...yogaSutrasSadhanaPada1to15, ...yogaSutrasSadhanaPada16to30, ...yogaSutrasSadhanaPada31to55].map(m => ({ ...m, chapter: 'II', id: `II.${m.id}` }));
const vibhutiPada = [...yogaSutrasVibhutiPada1to20, ...yogaSutrasVibhutiPada21to55].map(m => ({ ...m, chapter: 'III', id: `III.${m.id}` }));
const kaivalyaPada = [...yogaSutrasKaivalyaPada].map(m => ({ ...m, chapter: 'IV', id: `IV.${m.id}` }));

const allYogaSutrasMl = [...samadhiPada, ...sadhanaPada, ...vibhutiPada, ...kaivalyaPada];

export const yogaSutras: ClassicalText = buildClassicalText(
  {
    id: 'yoga-sutras',
    title: 'Yoga Sūtras',
    transliteratedTitle: 'Yoga Sūtras',
    author: 'Patañjali',
    system: 'yoga',
    verseTerm: 'Sūtra'
  },
  {
    en: yogaSutrasEn,
    ml: allYogaSutrasMl
  },
  {
    en: yogaSutrasConceptsEn,
    ml: yogaSutrasConceptsMl
  }
);

export const yogaSutrasThread = buildSystemThread('yoga-sutras', {
  en: yogaSutrasThreadEn,
  ml: yogaSutrasThreadMl
});
