import type { Tradition } from './schema';

/**
 * Initial tradition registry for the V2 rebuild.
 *
 * Each entry keeps the existing system identifier so shared links remain
 * valid, but records an explicit scholarly category instead of forcing
 * every tradition into one shape. Categories follow the Phase 1 brief:
 * philosophical schools, scriptural and sectarian traditions, Tantric and
 * devotional currents, practice lineages, modern syntheses and secondary
 * expositions are distinguished even when the current navigation shows
 * them side by side.
 */
export const TRADITIONS: Tradition[] = [
  {
    id: 'samkhya',
    title: 'Sāṃkhya',
    transliteratedTitle: 'Samkhya',
    category: 'philosophical-school',
    description:
      'Classical enumeration school; the analytic reckoning of principles (tattvas) underlying much of the later corpus.',
    accentKey: 'samkhya',
  },
  {
    id: 'yoga',
    title: 'Yoga',
    transliteratedTitle: 'Yoga',
    category: 'philosophical-school',
    description:
      'Pātañjala school built on Sāṃkhya categories, organised around practice and the stilling of mental fluctuations.',
    accentKey: 'yoga',
  },
  {
    id: 'nyaya',
    title: 'Nyāya',
    transliteratedTitle: 'Nyaya',
    category: 'philosophical-school',
    description: 'School of logic, epistemology and disciplined debate.',
    accentKey: 'nyaya',
  },
  {
    id: 'vaisesika',
    title: 'Vaiśeṣika',
    transliteratedTitle: 'Vaisesika',
    category: 'philosophical-school',
    description: 'School of categories, substance and atomist natural philosophy.',
    accentKey: 'vaisesika',
  },
  {
    id: 'mimamsa',
    title: 'Mīmāṃsā',
    transliteratedTitle: 'Mimamsa',
    category: 'philosophical-school',
    description: 'School of Vedic exegesis and dharma as enacted duty.',
    accentKey: 'mimamsa',
  },
  {
    id: 'vedanta',
    title: 'Vedānta',
    transliteratedTitle: 'Vedanta',
    category: 'scriptural-tradition',
    description:
      'Brahma Sūtras, Bhagavad Gītā and related scriptural commentarial corpus centred on Brahman.',
    accentKey: 'vedanta',
  },
  {
    id: 'tantra',
    title: 'Tantra',
    transliteratedTitle: 'Tantra',
    category: 'tantric-tradition',
    description: 'Unified Tantric and Śākta corpus, including devotional syntheses.',
    accentKey: 'tantra',
  },
  {
    id: 'kashmir-shaivism',
    title: 'Kashmir Shaivism',
    transliteratedTitle: 'Kashmir Shaivism',
    category: 'tantric-tradition',
    description: 'Trika, Spanda and Pratyabhijñā recognition schools.',
    accentKey: 'kashmir-shaivism',
  },
  {
    id: 'kundalini-tantra',
    title: 'Kundalini Tantra',
    transliteratedTitle: 'Kundalini Tantra',
    category: 'modern-synthesis',
    description: 'Modern Tantric-Yogic synthesis organised around practice.',
    accentKey: 'kundalini-tantra',
  },
  {
    id: 'shakta',
    title: 'Śākta',
    transliteratedTitle: 'Shakta',
    category: 'devotional-tradition',
    description: 'Goddess-centred devotional current cross-referenced from Tantra texts.',
    accentKey: 'shakta',
  },
];

export function getTraditionCategory(id: string): Tradition['category'] | undefined {
  return TRADITIONS.find((t) => t.id === id)?.category;
}
