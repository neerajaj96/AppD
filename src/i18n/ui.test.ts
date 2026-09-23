import { t, uiStrings, type UIKey } from './ui';

function placeholders(s: string): string[] {
  return Array.from(s.matchAll(/\{(\w+)\}/g)).map((m) => m[1]).sort();
}

describe('ui chrome localisation', () => {
  it('provides a non-empty Malayalam string for every English key', () => {
    const missing: string[] = [];
    for (const key of Object.keys(uiStrings.en) as UIKey[]) {
      const ml = uiStrings.ml[key];
      if (!ml || ml.trim().length === 0) missing.push(key);
    }
    expect(missing).toEqual([]);
  });

  it('keeps interpolation placeholders identical across languages', () => {
    const drift: string[] = [];
    for (const key of Object.keys(uiStrings.en) as UIKey[]) {
      const enVars = placeholders(uiStrings.en[key]);
      const mlVars = placeholders(uiStrings.ml[key] || '');
      if (enVars.join(',') !== mlVars.join(',')) drift.push(key);
    }
    expect(drift).toEqual([]);
  });

  it('interpolates counts without leftover braces', () => {
    expect(t('en', 'stepsCount', { count: 12 })).toBe('12 steps');
    expect(t('ml', 'stepsCount', { count: 12 })).toContain('12');
    expect(t('en', 'textsCount', { count: 3 })).toBe('3 texts');
    expect(t('en', 'stepOf', { current: 2, total: 9 })).toBe('Step 2 of 9');
  });

  it('exposes the new shell navigation strings in both languages', () => {
    const keys: UIKey[] = [
      'homeNav',
      'threadsNav',
      'primaryNav',
      'heroEyebrow',
      'beginExploring',
      'guidedLearning',
      'exploreTraditions',
      'traditionsLede',
      'threadsTitle',
      'threadsLede',
      'stepsCount',
      'textsCount',
      'unitsCount',
      'languagesLabel',
      'viewThread',
      'orgTitle',
      'orgLede',
      'footerNote',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});
