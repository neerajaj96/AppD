import { deviMahatmyaVersesEnKavaca } from './devi-mahatmya-verses-en-kavaca';
import { deviMahatmyaVersesEnDevisukta } from './devi-mahatmya-verses-en-devisukta';
import { deviMahatmyaVersesEnArgala } from './devi-mahatmya-verses-en-argala';
import { deviMahatmyaVersesEnKilaka } from './devi-mahatmya-verses-en-kilaka';
import {
  deviMahatmyaCh01En,
  deviMahatmyaCh02En,
  deviMahatmyaCh03En,
  deviMahatmyaCh04En,
  deviMahatmyaCh05En,
  deviMahatmyaCh06En,
  deviMahatmyaCh07En,
  deviMahatmyaCh08En,
  deviMahatmyaCh09En,
  deviMahatmyaCh10En,
  deviMahatmyaCh11En,
  deviMahatmyaCh12En,
  deviMahatmyaCh13En,
} from './chapters';
import { deviMahatmyaVersesEnPrayoga } from './devi-mahatmya-verses-en-prayoga';

export { deviMahatmyaVersesEnPrayoga };

export interface RawVerseEn {
  id: string;
  number: string;
  section: string;
  devanagari: string;
  iast: string;
  conceptIds?: string[];
  translation: string;
  commentary: string;
  keyPoints?: string[];
}

// Canonical Devi Mahatmya order: Vedic root (Devi Sukta, the mula-upadana),
// Purvanga (Kavaca, Argala, Kilaka),
// Prathama Carita (ch.1), Madhyama Carita (ch.2-4), Uttama Carita (ch.5-13),
// and Prayoga Vidhi ritual manual. Chapters live in ./chapters/ch01-ch13.
export const deviMahatmyaVersesEn: RawVerseEn[] = [
  ...deviMahatmyaVersesEnDevisukta,
  ...deviMahatmyaVersesEnKavaca,
  ...deviMahatmyaVersesEnArgala,
  ...deviMahatmyaVersesEnKilaka,
  ...deviMahatmyaCh01En,
  ...deviMahatmyaCh02En,
  ...deviMahatmyaCh03En,
  ...deviMahatmyaCh04En,
  ...deviMahatmyaCh05En,
  ...deviMahatmyaCh06En,
  ...deviMahatmyaCh07En,
  ...deviMahatmyaCh08En,
  ...deviMahatmyaCh09En,
  ...deviMahatmyaCh10En,
  ...deviMahatmyaCh11En,
  ...deviMahatmyaCh12En,
  ...deviMahatmyaCh13En,
  ...deviMahatmyaVersesEnPrayoga,
];
