import React, { useId, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ── Shared web primitives (0.7) ──────────────────────────────────────
// Web-only replacements for ad hoc shells duplicated across screens.
// Guna Tailwind classes only; system identity arrives via accent var
// strings (e.g. 'var(--color-amber)') so no ad-hoc hex appears here.
// Type roles favour src/index.css (.t-display2, .t-body-sans, …) to
// optimise behaviour across viewports and scripts.

/** Translucent accent tint that respects CSS vars. Avoids the invalid
 *  `var(--x)15` pattern by using color-mix, widely supported as baseline. */
export function accentTint(primary: string, percent = 14): string {
  return `color-mix(in srgb, ${primary} ${percent}%, transparent)`;
}

export function PageShell({
  children,
  width = 'narrow',
  className = '',
}: {
  children: React.ReactNode;
  width?: 'narrow' | 'wide';
  className?: string;
}) {
  const max = width === 'wide' ? 'max-w-4xl' : 'max-w-3xl';
  return (
    <div className={`space-y-8 animate-fade-in ${max} mx-auto pb-24 ${className}`}>{children}</div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-avyakta-2 rounded-2xl border border-tamas-deep shadow-xs overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  padding = 'article',
  className = '',
}: {
  children: React.ReactNode;
  padding?: 'article' | 'plain' | 'tight';
  className?: string;
}) {
  const pad =
    padding === 'article'
      ? 'p-8 md:p-10 space-y-8'
      : padding === 'plain'
        ? 'p-6'
        : 'p-5';
  return <div className={`${pad} ${className}`}>{children}</div>;
}

export function SectionTitle({
  children,
  icon,
  count,
  as = 'h3',
  className = '',
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  /** h3 for static labels; span when nested inside a toggle button (where
   *  the outer heading wraps the button instead — buttons admit only
   *  phrasing content, so an h3 must never sit inside one). */
  as?: 'h3' | 'span';
  className?: string;
}) {
  const Tag = as === 'span' ? 'span' : 'h3';
  return (
    <Tag className={`text-sm font-bold text-tamas uppercase tracking-wider flex items-center forced-colors:text-[CanvasText] ${className}`}>
      {icon && <span className="me-2 inline-flex">{icon}</span>}
      {children}
      {count !== undefined && <span className="ms-1.5 font-medium">({count})</span>}
    </Tag>
  );
}

/** Collection page header: eyebrow kicker, display title and a short lede.
 *  Data-agnostic — callers pass strings only. */
export function PageHeader({
  eyebrow,
  accentPrimary,
  title,
  lede,
  actions,
}: {
  eyebrow?: React.ReactNode;
  accentPrimary?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-tamas-deep pb-6">
      {eyebrow && (
        <Eyebrow accentPrimary={accentPrimary} className="mb-3">
          {eyebrow}
        </Eyebrow>
      )}
      <h1 className="t-display1 text-sattva">{title}</h1>
      {lede && <p className="t-subtitle text-sattva-dim mt-2 max-w-2xl">{lede}</p>}
      {actions && <div className="flex flex-wrap gap-2 mt-4">{actions}</div>}
    </div>
  );
}

/** Section header: small heading row with an optional trailing action. */
export function SectionHeader({
  title,
  action,
  className = '',
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <h2 className="t-h3 text-sattva">{title}</h2>
      {action}
    </div>
  );
}

/** Single-line metadata row: dim label, sattva value, truncated. */
export function MetaRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="shrink-0 text-tamas">{label}</dt>
      <dd className="min-w-0 truncate text-right tabular-nums text-sattva-dim">{value}</dd>
    </div>
  );
}

/** Loading placeholder: polite live region, no layout shift surprises. */
export function LoadingState({ text }: { text: string }) {
  return (
    <div role="status" className="py-16 text-center text-tamas text-sm animate-pulse">
      {text}
    </div>
  );
}

/** Empty placeholder for lists with nothing to show yet. */
export function EmptyState({ title, body }: { title: React.ReactNode; body?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-tamas-deep bg-avyakta-2 px-6 py-10 text-center">
      <p className="font-serif font-bold text-sattva">{title}</p>
      {body && <p className="t-body-sans text-sattva-dim mt-1">{body}</p>}
    </div>
  );
}

export function Eyebrow({
  children,
  accentPrimary,
  className = '',
}: {
  children: React.ReactNode;
  accentPrimary?: string;
  className?: string;
}) {
  // Typography converges on the .t-eyebrow type token instead of re-deriving
  // eyebrow metrics ad hoc (the component ran 12px/0.05em against the token's
  // 11px/0.14em). Accent arrives as a --accent var so the forced-colours
  // rules can genuinely override it (sessions 4–5 pattern); the ring exists
  // only in forced colours, so normal-mode rendering is unchanged.
  const tone = accentPrimary
    ? 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-(--accent) forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
    : 'text-sattva-dim';
  return (
    <span
      className={`t-eyebrow inline-flex items-center rounded-full px-2.5 py-0.5 forced-colors:ring-1 forced-colors:ring-inset forced-colors:ring-[CanvasText] ${tone} ${className}`}
      style={accentPrimary ? ({ '--accent': accentPrimary } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}

export function CountBadge({
  children,
  accentPrimary,
  variant = 'pill',
  className = '',
}: {
  children: React.ReactNode;
  accentPrimary?: string;
  /** pill: section counts · numeral: verse numbers · tile: square step numbers. */
  variant?: 'pill' | 'numeral' | 'tile';
  className?: string;
}) {
  const shape =
    variant === 'tile'
      ? 'h-7 w-7 p-0'
      : variant === 'numeral'
        ? 'min-w-10 px-2 py-1.5'
        : 'px-2.5 py-1.5';
  // Accent arrives as a --accent var rather than an inline backgroundColor
  // so the forced-colours rules below can genuinely override it (session-4
  // pattern). The 12% tint matches the pre-var rendering exactly; srgb is
  // deliberate, since mixing with transparent preserves hue in any space.
  const tone = accentPrimary
    ? 'bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-(--accent) forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
    : '';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ring-1 ring-inset ring-white/10 forced-colors:ring-[CanvasText] ${shape} ${tone} ${className}`}
      style={accentPrimary ? ({ '--accent': accentPrimary } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}

export const chipBase =
  'inline-flex items-center px-3 py-1.5 rounded-full bg-avyakta-3 text-sattva text-sm hover:bg-avyakta-4 transition-colors motion-reduce:transition-none min-h-11 forced-colors:ring-1 forced-colors:ring-inset forced-colors:ring-[CanvasText]';

export function ChipLink({
  to,
  children,
  title,
}: {
  to: string;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <Link to={to} className={chipBase} title={title}>
      {children}
    </Link>
  );
}

export function Notice({
  children,
  tone = 'amber',
}: {
  children: React.ReactNode;
  tone?: 'amber' | 'neutral';
}) {
  // role="status" is deliberate: every caller discloses a Malayalam-fallback
  // at page load, and screen-reader users must hear that the content they are
  // about to read is a fallback. Forced-colours pins keep the boundary and
  // the message legible when author tints collapse to Canvas.
  const cls =
    tone === 'amber'
      ? 'bg-amber-dim/20 border-amber-dim text-amber forced-colors:bg-[Canvas] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]'
      : 'bg-avyakta-3 border-tamas-deep text-sattva-dim forced-colors:bg-[Canvas] forced-colors:border-[CanvasText] forced-colors:text-[CanvasText]';
  return (
    <div role="status" className={`p-3 border rounded-lg text-xs ${cls}`}>
      {children}
    </div>
  );
}

/** APG disclosure section: outer h3 wraps the toggle button (valid —
 *  buttons admit only phrasing content, so the heading must contain the
 *  button, never the reverse), with aria-expanded + aria-controls pairing
 *  the button to its panel. The chevron speaks the single app-wide
 *  disclosure language (DisclosureChevron, down/up). */
export function CollapsibleSection({
  title,
  icon,
  count,
  defaultOpen = true,
  children,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const buttonId = useId();
  const panelId = useId();
  return (
    <div className="pt-6 border-t border-tamas">
      <h3 className="mb-4">
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full flex items-center justify-between cursor-pointer"
        >
          <SectionTitle as="span" icon={icon} count={count}>
            {title}
          </SectionTitle>
          <DisclosureChevron open={open} className="ms-2" />
        </button>
      </h3>
      {open && (
        <div id={panelId} aria-labelledby={buttonId}>
          {children}
        </div>
      )}
    </div>
  );
}

// Fixed prev/index/next bar. Height budget (~76px, ~94px with a large
// home-indicator inset) must stay under PageShell's pb-24 (96px) clearance —
// keep the two in sync. Rendered as a labelled nav landmark since every
// caller fills it with page navigation.
export function BottomBar({
  children,
  width = 'narrow',
  label = 'Page navigation',
}: {
  children: React.ReactNode;
  width?: 'narrow' | 'wide';
  label?: string;
}) {
  const max = width === 'wide' ? 'max-w-4xl' : 'max-w-3xl';
  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-avyakta-2/80 backdrop-blur-md border-t border-tamas-deep forced-colors:bg-[Canvas] forced-colors:border-[CanvasText]"
    >
      <div className={`${max} mx-auto flex justify-between items-center gap-2 min-w-0`}>{children}</div>
    </nav>
  );
}

// Phone-friendly swipe discovery (Batch 2): a single whisper-quiet line
// under the reading card. Redundant with the BottomBar for screen readers,
// hence aria-hidden; sighted thumb readers get the cue. Guna tone only.
export function SwipeHint({ text }: { text: string }) {
  return (
    <p aria-hidden="true" className="pt-1 text-center text-xs text-tamas select-none">
      {text}
    </p>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  label?: string;
}) {
  const cls =
    variant === 'primary'
      ? 'bg-rajas text-sattva hover:bg-rajas-dim'
      : 'bg-avyakta-3 border border-tamas-deep text-sattva hover:bg-avyakta-4';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center justify-center min-h-11 min-w-11 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors motion-reduce:transition-none ${cls}`}
    >
      {children}
    </button>
  );
}

export function ActionLink({
  to,
  children,
  variant = 'ghost',
  label,
}: {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  label?: string;
}) {
  const cls =
    variant === 'primary'
      ? 'bg-rajas text-sattva hover:bg-rajas-dim'
      : 'bg-avyakta-3 border border-tamas-deep text-sattva hover:bg-avyakta-4';
  return (
    <Link
      to={to}
      aria-label={label}
      className={`inline-flex items-center justify-center min-h-11 min-w-11 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors motion-reduce:transition-none ${cls}`}
    >
      {children}
    </Link>
  );
}

export function Breadcrumb({
  trail,
  current,
}: {
  trail: { to: string; label: string }[];
  current: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-sattva-dim min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
        {trail.map((item, index) => (
          <li key={`${item.to}-${index}`} className="flex min-w-0 items-center gap-1.5">
            <Link
              to={item.to}
              className="inline-flex min-h-11 min-w-0 items-center rounded-sm hover:text-rajas hover:underline hover:decoration-rajas/40 hover:underline-offset-4 transition-colors motion-reduce:transition-none"
            >
              <span className="truncate">{item.label}</span>
            </Link>
            <span aria-hidden="true" className="inline-flex shrink-0">
              <BreadcrumbChevron />
            </span>
          </li>
        ))}
        <li className="flex min-w-0 items-center">
          <span aria-current="page" className="truncate font-medium text-sattva">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}

// ── Chevron affordance (Item 4) ───────────────────────────────────
// Single standard for disclosure vs navigation cues. Decorative only:
// aria-hidden with state exposed via the parent button's aria-expanded.
// Sizes, colour, and motion stay consistent to optimise scanning
// behaviour; hover and keyboard focus receive the same brightening.
// Row chevrons add a 2px motion-safe forward nudge (mirrored in RTL)
// so navigation is never signalled by colour alone. Disclosure chevrons
// rotate on the vertical axis, which is direction-neutral, so they
// carry no RTL flip.

export function DisclosureChevron({
  open,
  className = '',
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <ChevronDown
      aria-hidden="true"
      focusable="false"
      className={`w-5 h-5 text-tamas shrink-0 transition-transform duration-base motion-reduce:transition-none forced-colors:text-[CanvasText] ${open ? 'rotate-180' : ''} ${className}`}
    />
  );
}

export function RowChevron({ className = '' }: { className?: string }) {
  return (
    <ChevronRight
      aria-hidden="true"
      focusable="false"
      className={`h-4 w-4 shrink-0 text-tamas transition-all duration-base motion-reduce:transition-none motion-safe:group-hover:translate-x-0.5 motion-safe:rtl:group-hover:-translate-x-0.5 group-hover:text-sattva group-focus-visible:text-sattva forced-colors:text-[CanvasText] forced-colors:group-hover:text-[CanvasText] forced-colors:group-focus-visible:text-[CanvasText] rtl:rotate-180 ${className}`}
    />
  );
}

export function BreadcrumbChevron({ className = '' }: { className?: string }) {
  return (
    <ChevronRight
      aria-hidden="true"
      focusable="false"
      className={`h-4 w-4 shrink-0 text-tamas forced-colors:text-[CanvasText] rtl:rotate-180 ${className}`}
    />
  );
}
