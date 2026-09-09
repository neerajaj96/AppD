import { SupportedLanguage } from '../types/i18n';
import type { System } from '../types/content';

/**
 * Localized darśana names + subtitles. Canonical English stays in
 * src/content/index.ts (System.title/subtitle); this sidecar map provides
 * the Malayalam display layer so Malayalam mode never falls back to
 * English-only system headers. Kept separate (not on System) to respect
 * the strict content schema in src/types/content.ts.
 */
export const systemNames: Record<string, { en: { title: string; subtitle: string }; ml: { title: string; subtitle: string } }> = {
  samkhya: {
    en: { title: 'Sāṃkhya', subtitle: 'The reckoning of principles' },
    ml: { title: 'സാംഖ്യം', subtitle: 'തത്ത്വങ്ങളുടെ എണ്ണവും വിവേചനവും' },
  },
  yoga: {
    en: { title: 'Yoga', subtitle: "The stilling of the mind's fluctuations" },
    ml: { title: 'യോഗം', subtitle: 'ചിത്തവൃത്തികളുടെ നിരോധം' },
  },
  nyaya: {
    en: { title: 'Nyāya', subtitle: 'The architecture of logic, epistemology, and fruitful action (Pravṛtti-sāmarthya)' },
    ml: { title: 'ന്യായം', subtitle: 'യുക്തിയുടെയും ജ്ഞാനശാസ്ത്രത്തിന്റെയും ഫലവത്തായ പ്രവൃത്തിയുടെയും ശാസ്ത്രം (പ്രവൃത്തിസാമർത്ഥ്യം)' },
  },
  vaisesika: {
    en: { title: 'Vaiśeṣika', subtitle: 'The categorization of reality and atomism' },
    ml: { title: 'വൈശേഷികം', subtitle: 'യാഥാർത്ഥ്യത്തിന്റെ വർഗ്ഗീകരണവും പരമാണുവാദവും' },
  },
  mimamsa: {
    en: { title: 'Pūrva Mīmāṃsā', subtitle: 'The Exegesis of Dharma' },
    ml: { title: 'പൂർവ്വമീമാംസ', subtitle: 'ധർമ്മത്തിന്റെ വ്യാഖ്യാനശാസ്ത്രം' },
  },
  vedanta: {
    en: { title: 'Vedanta', subtitle: 'The End of the Vedas (Advaita)' },
    ml: { title: 'വേദാന്തം', subtitle: 'വേദങ്ങളുടെ അന്ത്യം (അദ്വൈതം)' },
  },
  tantra: {
    en: { title: 'Tantra', subtitle: 'The non-dual science of Śakti — goddess, energy and recognition' },
    ml: { title: 'തന്ത്രം', subtitle: 'ശക്തിയുടെ അദ്വൈതശാസ്ത്രം — ദേവി, ഊർജ്ജം, പ്രത്യഭിജ്ഞ' },
  },
};

export function getSystemDisplay(system: Pick<System, 'id' | 'title' | 'subtitle'>, lang: SupportedLanguage): { title: string; subtitle: string } {
  const entry = systemNames[system.id as string];
  if (lang === 'ml' && entry?.ml) return entry.ml;
  if (entry?.en) return entry.en;
  return { title: system.title, subtitle: system.subtitle };
}
