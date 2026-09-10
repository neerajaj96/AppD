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

function makeText(
  id: string,
  title: string,
  versesEn: any[],
  versesMl: any[],
  conceptsEn: any[],
  conceptsMl: any[]
): ClassicalText {
  return buildClassicalText(
    {
      id,
      title,
      transliteratedTitle: title,
      author: 'Vyāsa (Brahmāṇḍa Purāṇa)',
      system: 'vedanta',
      verseTerm: 'Verse'
    },
    { en: versesEn, ml: versesMl },
    { en: conceptsEn, ml: conceptsMl }
  );
}

export const adhyatmaBalaText = makeText(
  'adhyatma-bala', 'Adhyātma Rāmāyaṇa — Bāla Kāṇḍa',
  adhyatmaBalaEn, adhyatmaBalaMl,
  adhyatmaBalaConceptsEn, adhyatmaBalaConceptsMl
);
export const adhyatmaAyodhyaText = makeText(
  'adhyatma-ayodhya', 'Adhyātma Rāmāyaṇa — Ayodhyā Kāṇḍa',
  adhyatmaAyodhyaEn, adhyatmaAyodhyaMl,
  adhyatmaAyodhyaConceptsEn, adhyatmaAyodhyaConceptsMl
);
export const adhyatmaAranyaText = makeText(
  'adhyatma-aranya', 'Adhyātma Rāmāyaṇa — Araṇya Kāṇḍa',
  adhyatmaAranyaEn, adhyatmaAranyaMl,
  adhyatmaAranyaConceptsEn, adhyatmaAranyaConceptsMl
);
export const adhyatmaKishkindhaText = makeText(
  'adhyatma-kishkindha', 'Adhyātma Rāmāyaṇa — Kiṣkindhā Kāṇḍa',
  adhyatmaKishkindhaEn, adhyatmaKishkindhaMl,
  adhyatmaKishkindhaConceptsEn, adhyatmaKishkindhaConceptsMl
);
export const adhyatmaSundaraText = makeText(
  'adhyatma-sundara', 'Adhyātma Rāmāyaṇa — Sundara Kāṇḍa',
  adhyatmaSundaraEn, adhyatmaSundaraMl,
  adhyatmaSundaraConceptsEn, adhyatmaSundaraConceptsMl
);
export const adhyatmaYuddhaText = makeText(
  'adhyatma-yuddha', 'Adhyātma Rāmāyaṇa — Yuddha Kāṇḍa',
  adhyatmaYuddhaEn, adhyatmaYuddhaMl,
  adhyatmaYuddhaConceptsEn, adhyatmaYuddhaConceptsMl
);
export const adhyatmaUttaraText = makeText(
  'adhyatma-uttara', 'Adhyātma Rāmāyaṇa — Uttara Kāṇḍa',
  adhyatmaUttaraEn, adhyatmaUttaraMl,
  adhyatmaUttaraConceptsEn, adhyatmaUttaraConceptsMl
);

export const adhyatmaTexts: ClassicalText[] = [
  adhyatmaBalaText,
  adhyatmaAyodhyaText,
  adhyatmaAranyaText,
  adhyatmaKishkindhaText,
  adhyatmaSundaraText,
  adhyatmaYuddhaText,
  adhyatmaUttaraText
];

function makeThread(textId: string, steps: any[]): ThreadStep[] {
  const en = steps.map((s: any) => ({
    id: s.id,
    conceptId: s.conceptId,
    verseIds: s.verseIds,
    title: s.content.en.title,
    narrative: s.content.en.narrative
  }));
  const ml: Record<string, any> = {};
  steps.forEach((s: any) => {
    ml[s.id] = { title: s.content.ml.title, narrative: s.content.ml.narrative };
  });
  return buildSystemThread(textId, { en, ml } as any);
}

export const adhyatmaThread: ThreadStep[] = [
  ...makeThread('adhyatma-bala', adhyatmaBalaThread),
  ...makeThread('adhyatma-ayodhya', adhyatmaAyodhyaThread),
  ...makeThread('adhyatma-aranya', adhyatmaAranyaThread),
  ...makeThread('adhyatma-kishkindha', adhyatmaKishkindhaThread),
  ...makeThread('adhyatma-sundara', adhyatmaSundaraThread),
  ...makeThread('adhyatma-yuddha', adhyatmaYuddhaThread),
  ...makeThread('adhyatma-uttara', adhyatmaUttaraThread)
];
