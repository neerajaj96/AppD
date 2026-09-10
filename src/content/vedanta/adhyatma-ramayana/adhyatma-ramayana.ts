import { ClassicalText, ThreadStep } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { adhyatmaBalaEn } from './bala-en';
import { adhyatmaBalaMl } from './bala-ml';
import { adhyatmaBalaConceptsEn } from './bala-concepts-en';
import { adhyatmaBalaConceptsMl } from './bala-concepts-ml';
import { adhyatmaBalaThread } from './bala-thread';
import { adhyatmaAyodhyaEn } from './ayodhya-en';
import { adhyatmaAyodhyaMl } from './ayodhya-ml';
import { adhyatmaAyodhyaConceptsEn } from './ayodhya-concepts-en';
import { adhyatmaAyodhyaConceptsMl } from './ayodhya-concepts-ml';
import { adhyatmaAyodhyaThread } from './ayodhya-thread';
import { adhyatmaAranyaEn } from './aranya-en';
import { adhyatmaAranyaMl } from './aranya-ml';
import { adhyatmaAranyaConceptsEn } from './aranya-concepts-en';
import { adhyatmaAranyaConceptsMl } from './aranya-concepts-ml';
import { adhyatmaAranyaThread } from './aranya-thread';
import { adhyatmaKishkindhaEn } from './kishkindha-en';
import { adhyatmaKishkindhaMl } from './kishkindha-ml';
import { adhyatmaKishkindhaConceptsEn } from './kishkindha-concepts-en';
import { adhyatmaKishkindhaConceptsMl } from './kishkindha-concepts-ml';
import { adhyatmaKishkindhaThread } from './kishkindha-thread';
import { adhyatmaSundaraEn } from './sundara-en';
import { adhyatmaSundaraMl } from './sundara-ml';
import { adhyatmaSundaraConceptsEn } from './sundara-concepts-en';
import { adhyatmaSundaraConceptsMl } from './sundara-concepts-ml';
import { adhyatmaSundaraThread } from './sundara-thread';
import { adhyatmaYuddhaEn } from './yuddha-en';
import { adhyatmaYuddhaMl } from './yuddha-ml';
import { adhyatmaYuddhaConceptsEn } from './yuddha-concepts-en';
import { adhyatmaYuddhaConceptsMl } from './yuddha-concepts-ml';
import { adhyatmaYuddhaThread } from './yuddha-thread';
import { adhyatmaUttaraEn } from './uttara-en';
import { adhyatmaUttaraMl } from './uttara-ml';
import { adhyatmaUttaraConceptsEn } from './uttara-concepts-en';
import { adhyatmaUttaraConceptsMl } from './uttara-concepts-ml';
import { adhyatmaUttaraThread } from './uttara-thread';

// One system entry — "Adhyatma Ramayana" — assembled from seven
// per-kāṇḍa source files (kept isolated per the data-layer law).
// Verse ids are namespaced per kāṇḍa (e.g. "bala.1.9") so the single
// compiled text never collides; display numbers/sections keep their
// original canto form with the kāṇḍa name prefixed to the section.

const TEXT_ID = 'adhyatma-ramayana';

const kandas: {
  code: string;
  name: string;
  versesEn: any[];
  versesMl: any[];
  conceptsEn: any[];
  conceptsMl: any[];
  thread: any[];
}[] = [
  { code: 'bala', name: 'Bāla Kāṇḍa', versesEn: adhyatmaBalaEn, versesMl: adhyatmaBalaMl, conceptsEn: adhyatmaBalaConceptsEn, conceptsMl: adhyatmaBalaConceptsMl, thread: adhyatmaBalaThread },
  { code: 'ayodhya', name: 'Ayodhyā Kāṇḍa', versesEn: adhyatmaAyodhyaEn, versesMl: adhyatmaAyodhyaMl, conceptsEn: adhyatmaAyodhyaConceptsEn, conceptsMl: adhyatmaAyodhyaConceptsMl, thread: adhyatmaAyodhyaThread },
  { code: 'aranya', name: 'Araṇya Kāṇḍa', versesEn: adhyatmaAranyaEn, versesMl: adhyatmaAranyaMl, conceptsEn: adhyatmaAranyaConceptsEn, conceptsMl: adhyatmaAranyaConceptsMl, thread: adhyatmaAranyaThread },
  { code: 'kishkindha', name: 'Kiṣkindhā Kāṇḍa', versesEn: adhyatmaKishkindhaEn, versesMl: adhyatmaKishkindhaMl, conceptsEn: adhyatmaKishkindhaConceptsEn, conceptsMl: adhyatmaKishkindhaConceptsMl, thread: adhyatmaKishkindhaThread },
  { code: 'sundara', name: 'Sundara Kāṇḍa', versesEn: adhyatmaSundaraEn, versesMl: adhyatmaSundaraMl, conceptsEn: adhyatmaSundaraConceptsEn, conceptsMl: adhyatmaSundaraConceptsMl, thread: adhyatmaSundaraThread },
  { code: 'yuddha', name: 'Yuddha Kāṇḍa', versesEn: adhyatmaYuddhaEn, versesMl: adhyatmaYuddhaMl, conceptsEn: adhyatmaYuddhaConceptsEn, conceptsMl: adhyatmaYuddhaConceptsMl, thread: adhyatmaYuddhaThread },
  { code: 'uttara', name: 'Uttara Kāṇḍa', versesEn: adhyatmaUttaraEn, versesMl: adhyatmaUttaraMl, conceptsEn: adhyatmaUttaraConceptsEn, conceptsMl: adhyatmaUttaraConceptsMl, thread: adhyatmaUttaraThread },
];

const codeByOldTextId: Record<string, string> = {
  'adhyatma-bala': 'bala',
  'adhyatma-ayodhya': 'ayodhya',
  'adhyatma-aranya': 'aranya',
  'adhyatma-kishkindha': 'kishkindha',
  'adhyatma-sundara': 'sundara',
  'adhyatma-yuddha': 'yuddha',
  'adhyatma-uttara': 'uttara'
};

export const newVerseId = (code: string, oldId: string) => `${code}.${oldId}`;

const allVersesEn = kandas.flatMap((k) =>
  k.versesEn.map((v: any) => ({
    ...v,
    id: newVerseId(k.code, `${v.id}`),
    section: `${k.name} · ${v.section}`
  }))
);

const allVersesMl = kandas.flatMap((k) =>
  k.versesMl.map((v: any) => ({
    ...v,
    id: newVerseId(k.code, `${v.id}`),
    section: `${k.name} · ${v.section}`
  }))
);

const allConceptsEn = kandas.flatMap((k) => k.conceptsEn);
const allConceptsMl = kandas.flatMap((k) => k.conceptsMl);

export const adhyatmaRamayanaText: ClassicalText = buildClassicalText(
  {
    id: TEXT_ID,
    title: 'Adhyātma Rāmāyaṇa',
    transliteratedTitle: 'Adhyātma Rāmāyaṇa',
    author: 'Vyāsa (Brahmāṇḍa Purāṇa)',
    system: 'vedanta',
    verseTerm: 'Śloka'
  },
  { en: allVersesEn, ml: allVersesMl },
  { en: allConceptsEn, ml: allConceptsMl }
);

// Legacy exports kept for reference; the system registers only the
// single merged text above.
export const adhyatmaTexts: ClassicalText[] = [adhyatmaRamayanaText];

function makeThread(textId: string, steps: any[]): ThreadStep[] {
  const en = steps.map((s: any) => {
    const code = codeByOldTextId[s.textId] ?? s.textId;
    return {
      id: s.id,
      conceptId: s.conceptId,
      verseIds: (s.verseIds ?? []).map((v: string) => newVerseId(code, `${v}`)),
      title: s.content.en.title,
      narrative: s.content.en.narrative
    };
  });
  const ml: Record<string, any> = {};
  steps.forEach((s: any) => {
    ml[s.id] = { title: s.content.ml.title, narrative: s.content.ml.narrative };
  });
  return buildSystemThread(textId, { en, ml } as any);
}

export const adhyatmaThread: ThreadStep[] = [
  ...makeThread(TEXT_ID, adhyatmaBalaThread),
  ...makeThread(TEXT_ID, adhyatmaAyodhyaThread),
  ...makeThread(TEXT_ID, adhyatmaAranyaThread),
  ...makeThread(TEXT_ID, adhyatmaKishkindhaThread),
  ...makeThread(TEXT_ID, adhyatmaSundaraThread),
  ...makeThread(TEXT_ID, adhyatmaYuddhaThread),
  ...makeThread(TEXT_ID, adhyatmaUttaraThread)
];
