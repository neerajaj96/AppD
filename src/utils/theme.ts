export interface SystemAccent {
  primary: string;
  secondary: string;
  bgLight: string;
  borderLight: string;
  text: string;
  badge: string;
}

export const systemAccents: Record<string, SystemAccent> = {
  samkhya: {
    primary: 'var(--color-amber)',
    secondary: 'var(--color-amber-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-amber-dim',
    text: 'text-amber',
    badge: 'bg-avyakta-4 text-amber',
  },
  yoga: {
    primary: 'var(--color-teal)',
    secondary: 'var(--color-teal-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-teal-dim',
    text: 'text-teal',
    badge: 'bg-avyakta-4 text-teal',
  },
  nyaya: {
    primary: 'var(--color-cerulean)',
    secondary: 'var(--color-cerulean-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-cerulean-dim',
    text: 'text-cerulean',
    badge: 'bg-avyakta-4 text-cerulean',
  },
  vaisesika: {
    primary: 'var(--color-sage)',
    secondary: 'var(--color-sage-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-sage-dim',
    text: 'text-sage',
    badge: 'bg-avyakta-4 text-sage',
  },
  mimamsa: {
    primary: 'var(--color-crimson)',
    secondary: 'var(--color-crimson-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-crimson-dim',
    text: 'text-crimson',
    badge: 'bg-avyakta-4 text-crimson',
  },
  vedanta: {
    primary: 'var(--color-indigo)',
    secondary: 'var(--color-indigo-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-indigo-dim',
    text: 'text-indigo',
    badge: 'bg-avyakta-4 text-indigo',
  },
  'kashmir-shaivism': {
    primary: 'var(--color-purusha)',
    secondary: 'var(--color-purusha-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-purusha-dim',
    text: 'text-purusha',
    badge: 'bg-avyakta-4 text-purusha',
  },
  shakta: {
    primary: 'var(--color-rajas)',
    secondary: 'var(--color-rajas-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-rajas-dim',
    text: 'text-rajas',
    badge: 'bg-avyakta-4 text-rajas',
  },
  // Unified Tantra system: kumkum-rose of the goddess traditions — distinct
  // from Mīmāṃsā crimson (sacrificial fire) and rajas terracotta. Registered
  // in index.css + tokens.ts; no ad-hoc hexes.
  tantra: {
    primary: 'var(--color-shakti)',
    secondary: 'var(--color-shakti-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-shakti-dim',
    text: 'text-shakti',
    badge: 'bg-avyakta-4 text-shakti',
  },
  // Kundalini Tantra is a modern Tantric-Yogic synthesis built on Yoga's
  // practice frame; it shares Yoga's teal rather than minting a new hue —
  // no ad-hoc hexes per the Guna theme law.
  'kundalini-tantra': {
    primary: 'var(--color-teal)',
    secondary: 'var(--color-teal-dim)',
    bgLight: 'bg-avyakta-3',
    borderLight: 'border-teal-dim',
    text: 'text-teal',
    badge: 'bg-avyakta-4 text-teal',
  },
};

export const defaultAccent: SystemAccent = {
  primary: 'var(--color-sattva)',
  secondary: 'var(--color-sattva-dim)',
  bgLight: 'bg-avyakta-3',
  borderLight: 'border-sattva-dim',
  text: 'text-sattva',
  badge: 'bg-avyakta-4 text-sattva',
};

export function getSystemAccent(systemId: string): SystemAccent {
  return systemAccents[systemId.toLowerCase()] ?? defaultAccent;
}
