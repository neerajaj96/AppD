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
import { deviMahatmyaVersesEnUttaranga } from './devi-mahatmya-verses-en-uttaranga';
import { deviMahatmyaVersesEnUttaranga2 } from './devi-mahatmya-verses-en-uttaranga2';
import { deviMahatmyaVersesEnUttaranga3 } from './devi-mahatmya-verses-en-uttaranga3';

export { deviMahatmyaVersesEnPrayoga };

export interface RawVerseEn {
  id: string;
  number: string;
  section: string;
  devanagari: string;
  iast: string;
  conceptIds?: string[];
  interpretiveNotes?: { note: string }[];
  translation: string;
  commentary: string;
  keyPoints?: string[];
}

// Canonical Devi Mahatmya order: Vedic root (Devi Sukta, the mula-upadana),
// Purvanga (Kavaca, Argala, Kilaka + Vedokta Ratri),
// Prathama Carita (ch.1), Madhyama Carita (ch.2-4), Uttama Carita (ch.5-13),
// Prayoga Vidhi ritual manual, Uttaranga set 1 (Rahasya-traya + Kshama +
// mantra-vibhaga) in ./devi-mahatmya-verses-en-uttaranga.ts, and Uttaranga
// set 2 (Guru-Kilaka, Kshamapana, Saptashloki, Dvatrimsha, Kunjika,
// Ashtottara/Manasa/Atharva indexes) in
// ./devi-mahatmya-verses-en-uttaranga2.ts, and Parishista set 3
// (Pitha, Mahavidya, Kalika-mahatmya, Laghu, Apaduddhara, Kali-stotra,
// Shanti, Pauranika-shanti, Para-devi-sukta, Siddha-samputa) in
// ./devi-mahatmya-verses-en-uttaranga3.ts. Order appends only — existing
// ids and sequence are untouched.
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
  ...deviMahatmyaVersesEnUttaranga,
  ...deviMahatmyaVersesEnUttaranga2,
  ...deviMahatmyaVersesEnUttaranga3,
];
