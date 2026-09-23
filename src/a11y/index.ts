/**
 * Accessibility primitives foundation (V2).
 *
 * Reusable, framework-light helpers for focus management, dialogs,
 * sheets, live regions, keyboard navigation, reduced motion and language
 * metadata. Screens adopt these incrementally; no existing screen is
 * rebuilt in this phase.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function moveFocusTo(target: string | HTMLElement | null): void {
  if (typeof document === 'undefined' || !target) return;
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: false });
}

/** Trap Tab focus inside a dialog/sheet element; returns a release function. */
export function trapFocus(container: HTMLElement): () => void {
  const selector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
    );
    if (items.length === 0) return;
    const first = items[0] as HTMLElement;
    const last = items[items.length - 1] as HTMLElement;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}

/** Announce a message through a polite live region. */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined' || !message) return;
  let region = document.querySelector<HTMLElement>(`[data-live-region="${priority}"]`);
  if (!region) {
    region = document.createElement('div');
    region.setAttribute('data-live-region', priority);
    region.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    region.setAttribute('aria-live', priority);
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
  region.textContent = '';
  window.setTimeout(() => {
    if (region) region.textContent = message;
  }, 30);
}

/** Standard roving-index keyboard handling for lists and toolbars. */
export function rovingIndex(
  event: React.KeyboardEvent | KeyboardEvent,
  current: number,
  count: number,
): number | undefined {
  const key = event.key;
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    event.preventDefault();
    return (current + 1) % Math.max(1, count);
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    event.preventDefault();
    return (current - 1 + count) % Math.max(1, count);
  }
  if (key === 'Home') {
    event.preventDefault();
    return 0;
  }
  if (key === 'End') {
    event.preventDefault();
    return Math.max(0, count - 1);
  }
  return undefined;
}

/** Language metadata helpers for parallel English/Malayalam content. */
export function langAttributes(lang: 'en' | 'ml'): { lang: string; dir: 'ltr' } {
  return { lang, dir: 'ltr' };
}

export const a11y = {
  prefersReducedMotion,
  moveFocusTo,
  trapFocus,
  announce,
  rovingIndex,
  langAttributes,
};
