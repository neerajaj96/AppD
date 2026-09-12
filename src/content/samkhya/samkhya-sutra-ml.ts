import { LocalizedContent } from '../../types/i18n';
import { samkhyaSutraMl1 } from './samkhya-sutra-ml-1';
import { samkhyaSutraMl2 } from './samkhya-sutra-ml-2';
import { samkhyaSutraMl3 } from './samkhya-sutra-ml-3';
import { samkhyaSutraMl4 } from './samkhya-sutra-ml-4';
import { samkhyaSutraMl5 } from './samkhya-sutra-ml-5';
import { samkhyaSutraMl6 } from './samkhya-sutra-ml-6';

/** Complete Malayalam verse-map: 522 sūtras. */
export const samkhyaSutraMl: Record<string, Partial<LocalizedContent>> = {
  ...samkhyaSutraMl1,
  ...samkhyaSutraMl2,
  ...samkhyaSutraMl3,
  ...samkhyaSutraMl4,
  ...samkhyaSutraMl5,
  ...samkhyaSutraMl6
};
