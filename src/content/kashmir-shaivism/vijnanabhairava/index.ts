import { ClassicalText } from '../../../types/content';
import { buildClassicalText, buildSystemThread } from '../../factory';
import { vijnanabhairavaVersesEn1 } from './vijnanabhairava-verses-en-1';
import { vijnanabhairavaVersesEn2 } from './vijnanabhairava-verses-en-2';
import { vijnanabhairavaVersesEn3 } from './vijnanabhairava-verses-en-3';
import { vijnanabhairavaVersesMl1 } from './vijnanabhairava-verses-ml-1';
import { vijnanabhairavaVersesMl2 } from './vijnanabhairava-verses-ml-2';
import { vijnanabhairavaVersesMl3 } from './vijnanabhairava-verses-ml-3';
import { vijnanabhairavaConceptsEn } from './vijnanabhairava-concepts-en';
import { vijnanabhairavaConceptsMl } from './vijnanabhairava-concepts-ml';
import { vijnanabhairavaThreadEn } from './vijnanabhairava-thread-en';
import { vijnanabhairavaThreadMl } from './vijnanabhairava-thread-ml';

// Vijñānabhairava-tantra (Bhairava-Āgama; 112 dhāraṇās with frame + closing:
// 118 verses). Structural source: Jaideva Singh's edition, "Vijñānabhairava
// or Divine Consciousness" (MLBD 2002 — Drive source
// 1h1EsUYNe4dwrUZ5VrjtUbmEaa8apeRZj). Text file stays isolated in this
// directory; the text belongs to the 'kashmir-shaivism' system
// (see ../index.ts).
//
// Carry-over policy (copyright + architecture): Singh's translation and
// commentary are NOT reproduced. Sanskrit is limited to short traditional
// seed-phrases; renderings, commentaries and key points are this app's own
// concise paraphrase of the Trika line in EN + ML, with original
// concept/thread overlays.
export const vijnanabhairavaText: ClassicalText = buildClassicalText(
  {
    id: 'vijnanabhairava',
    title: 'Vijñānabhairava-tantra',
    transliteratedTitle: 'Vijñānabhairava-tantra',
    author: 'Bhairava-Āgama (Devī–Bhairava dialogue)',
    system: 'kashmir-shaivism',
    contentDepth: 'full',
    verseTerm: 'Dhāraṇā',
  },
  {
    en: [...vijnanabhairavaVersesEn1, ...vijnanabhairavaVersesEn2, ...vijnanabhairavaVersesEn3],
    ml: { ...vijnanabhairavaVersesMl1, ...vijnanabhairavaVersesMl2, ...vijnanabhairavaVersesMl3 },
  },
  {
    en: vijnanabhairavaConceptsEn,
    ml: vijnanabhairavaConceptsMl,
  }
);

export const vijnanabhairavaThread = buildSystemThread('vijnanabhairava', {
  en: vijnanabhairavaThreadEn,
  ml: vijnanabhairavaThreadMl,
});
