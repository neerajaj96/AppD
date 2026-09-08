// ─────────────────────────────────────────────────────────────────────────
// Web truth lives in src/index.css (@theme). This file is the canonical
// hex registry shared with native/RN code — keep values in sync with
// index.css when adding or renaming tokens. Components must not hardcode
// hexes; web code uses Tailwind classes (bg-avyakta-2, text-sattva, ...)
// backed by index.css, via getSystemAccent in src/utils/theme.ts.
//
// The palette is named after the three guṇas of Sāṃkhya — sattva (clarity),
// rajas (activity), tamas (inertia) — the three qualities said to compose
// all of prakṛti (manifest nature), plus avyakta, the unmanifest ground
// they arise from. That's not decoration: it's the actual conceptual
// vocabulary of the texts this app renders, so the tokens double as a
// small teaching device — anyone who reads the theme file learns the
// terms the content uses.
//
// v2 — single palette, deliberately. Avyakta is documented two paragraphs
// down as "the unmanifest... near-black"; tamas as "weight and shadow."
// Both are dark by definition in the texts this app renders. A "light"
// variant of either isn't a lighter mood — it's a different word wearing
// the same name. One coherent dark palette, built out properly across all
// six darśanas, serves the material better than two incoherent ones.
// ─────────────────────────────────────────────────────────────────────────

export type ColorPalette = typeof darkColors;

export const darkColors = {
  // Ground — avyakta, the unmanifest. Not flat black: a near-black indigo,
  // because prakṛti is never truly void, only unresolved.
  avyakta: '#12141c',
  avyakta2: '#1a1d29',
  avyakta3: '#232636',
  avyakta4: '#2c2f45', // highest elevation: modals, popovers, active chips

  // Sattva — clarity, illumination, the guṇa of knowledge. Warm parchment-gold.
  sattva: '#e8d9b0',
  sattvaDim: '#c9b98a',
  sattvaBright: '#f5e9c8', // one or two moments per screen that should feel lit from within — pair with glowText, never used at body-text scale
  sattvaGlow: 'rgba(232, 217, 176, 0.16)',

  // Rajas — activity, passion, the guṇa of motion. Terracotta / oxide-copper,
  // like a temple seal stamped in red ochre.
  rajas: '#a8452b',
  rajasDim: '#7a3220',
  rajasGlow: 'rgba(168, 69, 43, 0.20)',

  // Tamas — inertia, obscuration, the guṇa of weight and shadow. A dim slate,
  // never a "muted grey" — it should read as substance withheld, not absence.
  tamas: '#5b5f72',
  tamasDeep: '#3f4252',

  // Puruṣa — the witness-consciousness Sāṃkhya sets opposite prakṛti:
  // still, single, uninflected by the three guṇas. A cool amethyst-violet,
  // the one hue in the palette that isn't a guṇa — used sparingly, for
  // the ontology graph and moments of "seeing," never for action, mood,
  // or (see getSystemAccent below) a system's own identity colour.
  purusha: '#a48ce8',
  purushaDim: '#7c68b8',
  purushaGlow: 'rgba(164, 140, 232, 0.22)',

  // ── System accents ──────────────────────────────────────────────────
  // One jewel-tone per darśana. See getSystemAccent for why each school
  // got the hue it got — not assigned round-robin from a swatch book.
  amber: '#e8a23d',    // Sāṃkhya
  amberDim: '#b97a24',
  teal: '#4fb3a3',     // Yoga
  tealDim: '#347a70',
  cerulean: '#4a7fc4', // Nyāya
  ceruleanDim: '#33588c',
  sage: '#6b9078',     // Vaiśeṣika
  sageDim: '#496356',
  crimson: '#c73e4a',  // Mīmāṃsā
  crimsonDim: '#8f2c35',
  indigo: '#5a5aa0',   // Vedānta
  indigoDim: '#3d3d75',

  // Ink — the reader's own register: text, not doctrine.
  ink: '#eae7de',
  inkDim: '#9b9cad',

  hair: '#2c2f40',
  bg: '#05060a',

  shadow: 'rgba(0,0,0,0.45)',
  overlay: 'rgba(5,6,10,0.72)', // modal / sheet scrim
};

// The one exported theme. Import `colors` in new code; `darkColors` is
// kept as the underlying name purely so nothing that already imports it
// by that name breaks mid-rollout.
export const colors = darkColors;

export const fonts = {
  display: 'Fraunces_500Medium',
  displaySemibold: 'Fraunces_600SemiBold',
  serif: 'CormorantGaramond_400Regular',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  sanskrit: 'NotoSerifDevanagari_400Regular',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansBold: 'Inter_600SemiBold',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 28, xxxl: 36 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

// ─────────────────────────────────────────────────────────────────────────
// Type scale — one place that fixes family + size + line-height + tracking
// per role, so screens stop re-deriving the same numbers ad hoc. Serif for
// anything that is text-to-be-read (translation, commentary, narrative);
// display for titles; sans for interface chrome (labels, buttons, counts).
// ─────────────────────────────────────────────────────────────────────────
export const type = {
  eyebrow: { fontFamily: fonts.sansBold, fontSize: 10.5, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  display1: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  // One register heavier than display1 — Fraunces_600SemiBold, loaded
  // in App.tsx alongside the medium weight. Spend it on a single hero
  // moment per screen (a greeting, a featured verse-of-the-day), not as
  // a general-purpose "bold" substitute for display1.
  display1Strong: { fontFamily: fonts.displaySemibold, fontSize: 28, lineHeight: 34 },
  display2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22 },
  subtitle: { fontFamily: fonts.serifItalic, fontSize: 14.5, lineHeight: 20 },
  body: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 25 },
  bodySans: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 23 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 17 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase' as const },
  sanskritNum: { fontFamily: fonts.sanskrit, fontSize: 14, letterSpacing: 1.4 },
};

// The three guṇas in sequence — sattva rising into rajas settling into
// tamas — the app's one recurring graphic signature: a thin tri-colour
// rule under page titles and along hero-card edges. Every darśana in the
// library agrees the three qualities are inseparable and always co-present,
// in different proportions; the rule is a literal rendering of that idea
// rather than a generic "brand gradient."
export const gunaStops = (c: ColorPalette): [string, string, string] => [c.sattvaDim, c.rajas, c.tamas];

// ─────────────────────────────────────────────────────────────────────────
// Every darśana's identity, chosen for what the school actually argues —
//  - Sāṃkhya (amber)    — the older analytic enumeration; old palm-leaf
//                          manuscripts and temple ochre.
//  - Yoga (teal)         — the practice built on Sāṃkhya's categories;
//                          cooler, stiller, closer to puruṣa.
//  - Nyāya (cerulean)    — formal inference, the "lamp of reasoning"; a
//                          clear, cool blue for a discipline organized
//                          entirely around clarity of argument.
//  - Vaiśeṣika (sage)    — substance, quality, the atom (paramāṇu); a
//                          mineral, categorized green — historically
//                          paired with Nyāya, visually its own thing.
//  - Mīmāṃsā (crimson)   — Vedic ritual exegesis, dharma enacted through
//                          sacrifice; the vermilion of kumkum and the
//                          sacrificial fire — not the same red as rajas's
//                          terracotta.
//  - Vedānta (indigo)    — non-dual Brahman; deep and luminous rather
//                          than bright, closer to puruṣa's family than
//                          any other accent — but Vedānta doesn't get to
//                          borrow puruṣa itself, which stays reserved for
//                          the ontology graph.
// Unknown/future systems fall back to the sattva/rajas/tamas guṇa
// sequence rather than crashing.
// ─────────────────────────────────────────────────────────────────────────
export function getSystemAccent(c: ColorPalette, systemId?: string) {
  switch (systemId) {
    case 'samkhya':
      return { primary: c.amber, dim: c.amberDim, glow: 'rgba(232, 162, 61, 0.22)', pair: [c.sattva, c.amber, c.rajas] as [string, string, string] };
    case 'yoga':
      return { primary: c.teal, dim: c.tealDim, glow: 'rgba(79, 179, 163, 0.22)', pair: [c.purusha, c.teal, c.rajasDim] as [string, string, string] };
    case 'nyaya':
      return { primary: c.cerulean, dim: c.ceruleanDim, glow: 'rgba(74, 127, 196, 0.22)', pair: [c.sattva, c.cerulean, c.tamas] as [string, string, string] };
    case 'vaisesika':
      return { primary: c.sage, dim: c.sageDim, glow: 'rgba(107, 144, 120, 0.22)', pair: [c.sattva, c.sage, c.tamasDeep] as [string, string, string] };
    case 'mimamsa':
      return { primary: c.crimson, dim: c.crimsonDim, glow: 'rgba(199, 62, 74, 0.22)', pair: [c.sattva, c.crimson, c.rajas] as [string, string, string] };
    case 'vedanta':
      return { primary: c.indigo, dim: c.indigoDim, glow: 'rgba(90, 90, 160, 0.22)', pair: [c.purusha, c.indigo, c.avyakta4] as [string, string, string] };
    case 'kashmir-shaivism':
      // Pratyabhijñā / Spanda: the consciousness school. Purusha-violet is
      // identity here, not a borrowed graph color — the school's subject
      // matter IS witness-consciousness. Distinct from Mīmāṃsā crimson.
      return { primary: c.purusha, dim: c.purushaDim, glow: c.purushaGlow, pair: [c.purusha, c.crimson, c.avyakta4] as [string, string, string] };
    case 'shakta':
      return { primary: c.rajas, dim: c.rajasDim, glow: c.rajasGlow, pair: [c.sattva, c.rajas, c.crimson] as [string, string, string] };
    default:
      return { primary: c.sattva, dim: c.sattvaDim, glow: c.sattvaGlow, pair: gunaStops(c) };
  }
}

// The full prakṛti spectrum — every named hue in the palette in one sweep,
// for the one or two places per screen that should feel genuinely
// luminous (a hero glow, the verse-of-the-day devanagari block) rather
// than quietly tasteful. Use through <AuroraGlow />, not raw.
export const auroraStops = (c: ColorPalette): string[] => [c.purushaGlow, c.sattvaGlow, c.amber, c.rajasGlow, c.tealDim];

// Soft elevation via glow-border rather than a real drop shadow — shadows
// barely read against a near-black surface. `level` 1–3, low to high.
export function getElevation(level: 1 | 2 | 3 = 1) {
  const cfg = { 1: [2, 6, 0.28], 2: [4, 12, 0.34], 3: [6, 20, 0.4] } as const;
  const [h, r, o] = cfg[level];
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: h },
    shadowOpacity: o,
    shadowRadius: r,
    elevation: level * 2,
  };
}

export const motion = {
  fast: 140,
  base: 220,
  slow: 340,
};

// A soft luminous halo behind a display title — spend this on the one or
// two headlines per screen that should feel touched by sattva (light),
// not on body text or anything read at length.
export const glowText = (color: string, radius = 12) => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: radius,
});