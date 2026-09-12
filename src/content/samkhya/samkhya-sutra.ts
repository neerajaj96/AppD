import { ClassicalText } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { samkhyaSutraEn } from './samkhya-sutra-en';
import { samkhyaSutraMl } from './samkhya-sutra-ml';
import { samkhyaSutraConceptsEn } from './samkhya-sutra-concepts-en';
import { samkhyaSutraConceptsMl } from './samkhya-sutra-concepts-ml';
import { samkhyaSutraThreadEn } from './samkhya-sutra-thread-en';
import { samkhyaSutraThreadMl } from './samkhya-sutra-thread-ml';

/**
 * Sāṅkhya-Pravacana-Sūtra (Kapila Sūtras / Ṣaṣṭitantra) — complete edition.
 *
 * 522 sūtras across the six adhyāyas (I:161 · II:46 · III:84 · IV:32 ·
 * V:129 · VI:70), fully bilingual (en + ml) with translation, commentary
 * and key points on every sūtra, 23 concepts and a 15-step thread.
 *
 * Reading text follows the Sinha (1915, Sacred Books of the Hindus, after
 * Garbe) edition with Aniruddha's Vṛtti and Vijñānabhikṣu's Bhāṣya —
 * a 14th-century compilation of the Sāṅkhya school (Īśvarakṛṣṇa's Kārikā,
 * already in this app, condenses this Ṣaṣṭitantra). IAST is pada-form with
 * normalized sandhi; Devanagari is generated from it. Malayalam phrasing
 * follows the supplied 71-page Kārikā commentary's terminology. Some
 * editions number the closing sūtras of Books I/VI jointly — variants noted
 * per sūtra where relevant.
 * verseTerm 'Sūtra' drives the reader UI labels.
 */
export const samkhyaSutra: ClassicalText = buildClassicalText(
  {
    id: 'samkhya-sutra',
    title: 'Sāṅkhya-Pravacana-Sūtra',
    transliteratedTitle: 'Sāṅkhya-Pravacana-Sūtra',
    author: 'Maharṣi Kapila (Ṣaṣṭitantra)',
    system: 'samkhya',
    verseTerm: 'Sūtra',
    contentStatus: 'complete'
  },
  {
    en: samkhyaSutraEn,
    ml: samkhyaSutraMl
  },
  {
    en: samkhyaSutraConceptsEn,
    ml: samkhyaSutraConceptsMl
  }
);

export const samkhyaSutraThread = buildSystemThread('samkhya-sutra', {
  en: samkhyaSutraThreadEn,
  ml: samkhyaSutraThreadMl
});
