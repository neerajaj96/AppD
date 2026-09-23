/**
 * Semantic design-token layer (V2 foundation).
 *
 * The Guṇa identity is preserved — sattva, rajas, tamas, avyakta and
 * puruṣa remain the conceptual palette — but components now consume
 * semantic roles (surface, text, border, accent, focus, status) instead
 * of raw colour values. System accents map through the same roles, so no
 * component needs to know a hex value. See `docs` contrast notes below.
 */

export type SemanticRole =
  | 'surface'
  | 'surfaceElevated'
  | 'surfaceInteractive'
  | 'textPrimary'
  | 'textSecondary'
  | 'textMuted'
  | 'borderSubtle'
  | 'accent'
  | 'accentInteractive'
  | 'accentSurface'
  | 'accentOnSurface'
  | 'focus'
  | 'success'
  | 'warning'
  | 'danger';

export const semanticTokens: Record<SemanticRole, string> = {
  surface: 'var(--color-avyakta)',
  surfaceElevated: 'var(--color-avyakta-2)',
  surfaceInteractive: 'var(--color-avyakta-3)',
  textPrimary: 'var(--color-sattva)',
  textSecondary: 'var(--color-sattva-dim)',
  textMuted: 'var(--color-tamas)',
  borderSubtle: 'var(--color-hair)',
  accent: 'var(--accent, var(--color-rajas))',
  accentInteractive: 'var(--accent-dim, var(--color-rajas-dim))',
  accentSurface: 'color-mix(in srgb, var(--accent, var(--color-rajas)) 12%, transparent)',
  accentOnSurface: 'var(--accent, var(--color-rajas))',
  focus: 'var(--color-sattva)',
  success: 'var(--color-sage)',
  warning: 'var(--color-amber)',
  danger: 'var(--color-crimson)',
};

export const semanticTailwind: Record<SemanticRole, string> = {
  surface: 'bg-avyakta text-sattva',
  surfaceElevated: 'bg-avyakta-2 text-sattva',
  surfaceInteractive: 'bg-avyakta-3 text-sattva',
  textPrimary: 'text-sattva',
  textSecondary: 'text-sattva-dim',
  textMuted: 'text-tamas',
  borderSubtle: 'border-hair',
  accent: 'text-(--accent)',
  accentInteractive: 'hover:text-(--accent)',
  accentSurface: 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]',
  accentOnSurface: 'text-(--accent)',
  focus: 'outline-sattva',
  success: 'text-sage',
  warning: 'text-amber',
  danger: 'text-crimson',
};

/**
 * Contrast validation notes (WCAG AA, normal text 4.5:1, large text 3:1).
 *
 * Verified pairs on the avyakta ground (#141420):
 * - sattva (#f4ecd8) on avyakta — passes AAA for body and headings.
 * - sattva-dim (#c4baa6) on avyakta — passes AA for body text.
 * - tamas (#62687a) on avyakta — fails body contrast; muted use only
 *   (captions, decorative hints, disabled states), never essential prose.
 * - rajas (#c66c55), amber (#e8a23d), teal (#4fb3a3), purusha (#a48ce8)
 *   on avyakta — pass AA for large text and UI accents; body prose stays
 *   in sattva tones with accents reserved for headings, badges and links.
 * - All accent-on-surface tints keep the accent glyph itself at full
 *   strength over a 12% tint, preserving the underlying text contrast.
 */
export const contrastNotes = [
  'sattva on avyakta: AAA body + headings',
  'sattva-dim on avyakta: AA body',
  'tamas on avyakta: muted only, never essential prose',
  'accents on avyakta: AA large text + UI, prose stays sattva',
] as const;
