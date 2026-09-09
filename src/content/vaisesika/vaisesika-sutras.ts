import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { vaisesikaSutrasEn } from './vaisesika-sutras-en';
import { vaisesikaSutrasBooks4To8 } from './vaisesika-sutras-en-books4-8';
import { vaisesikaSutrasBooks9And10 } from './vaisesika-sutras-en-books9-10';
import { vaisesikaSutrasBook8 } from './vaisesika-sutras-en-book8';
import { vaisesikaSutrasMl } from './vaisesika-sutras-ml';
import { vaisesikaConceptsEn } from './vaisesika-sutras-concepts-en';
import { vaisesikaConceptsMl } from './vaisesika-sutras-concepts-ml';
import { vaisesikaThreadEn } from './vaisesika-sutras-thread-en';

const allVaisesikaVersesEn = [...vaisesikaSutrasEn, ...vaisesikaSutrasBooks4To8.filter((s: any) => s.book !== 8), ...vaisesikaSutrasBook8, ...vaisesikaSutrasBooks9And10];

const mappedVaisesikaEn = allVaisesikaVersesEn.map((v: any) => ({
  id: v.id,
  number: v.id,
  section: v.topic,
  devanagari: v.sanskrit,
  iast: '',
  diagramId: v.diagramId,
  conceptIds: v.conceptIds,
  translation: v.text,
  commentary: v.commentary
}));

const mappedVaisesikaMl = vaisesikaSutrasMl.map((m: any) => ({
  id: m.id,
  translation: m.text,
  commentary: m.commentary
}));

export const vaisesikaSutrasText: ClassicalText = buildClassicalText(
  {
    id: 'vaisesika-sutras',
    title: 'Vaiśeṣika Sūtras',
    transliteratedTitle: 'Vaiśeṣika Sūtra',
    author: 'Maharṣi Kaṇāda',
    system: 'vaisesika',
    verseTerm: 'Sūtra',
    contentStatus: 'partial'
  },
  {
    en: mappedVaisesikaEn,
    ml: mappedVaisesikaMl
  },
  {
    en: vaisesikaConceptsEn,
    ml: vaisesikaConceptsMl
  }
);

export const vaisesikaSutrasThread = buildSystemThread('vaisesika-sutras', {
  en: vaisesikaThreadEn
});
