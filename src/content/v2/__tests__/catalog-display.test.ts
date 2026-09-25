import * as fs from 'node:fs';
import * as path from 'node:path';
import { getTraditionDisplay, getVerseTermForSummary, textLanguages, traditionHref } from '../catalog';

// Shell/navigation helpers stay pure and corpus-free so the header, home,
// threads index and tradition pages never need content chunks to render.
describe('catalog display helpers', () => {
  it('deep-links single-text traditions straight to the text', () => {
    expect(traditionHref({ id: 'yoga', textIds: ['yoga-sutras'] })).toBe('/system/yoga/text/yoga-sutras');
    expect(traditionHref({ id: 'samkhya', textIds: ['a', 'b'] })).toBe('/system/samkhya');
  });

  it('resolves display titles with Malayalam and unknown-id fallbacks', () => {
    expect(getTraditionDisplay({ id: 'yoga', title: 'Yoga' }, 'en').title).toBe('Yoga');
    expect(getTraditionDisplay({ id: 'yoga', title: 'Yoga' }, 'ml').title).toBe('യോഗം');
    expect(getTraditionDisplay({ id: 'nope', title: 'Nope' }, 'en')).toEqual({ title: 'Nope', subtitle: '' });
  });

  it('pluralises verse terms exactly like the legacy helper', () => {
    expect(getVerseTermForSummary({ verseTerm: 'Sūtra' }, 1)).toBe('Sūtra');
    expect(getVerseTermForSummary({ verseTerm: 'Sūtra' }, 5)).toBe('Sūtras');
    expect(getVerseTermForSummary({ verseTerm: 'Kārikā' }, 2)).toBe('Kārikās');
    expect(getVerseTermForSummary(undefined, 2)).toBe('Verses');
  });

  it('reads language coverage defensively for stale cached manifests', () => {
    expect(textLanguages({ unitCount: 10, languages: { en: 10, ml: 4 } })).toEqual({ en: 10, ml: 4 });
    // Manifests cached before language counts shipped carry no field.
    expect(textLanguages({ unitCount: 10 } as never)).toEqual({ en: 10, ml: 0 });
  });

  it('ships language coverage for every text in the generated manifest', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'manifest.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content/manifest.json missing (run content:chunks); skipping');
      return;
    }
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      texts: Array<{ textId: string; languages?: { en: number; ml: number } }>;
    };
    expect(manifest.texts.length).toBeGreaterThan(0);
    for (const text of manifest.texts) {
      expect(typeof text.languages?.en, text.textId).toBe('number');
      expect(typeof text.languages?.ml, text.textId).toBe('number');
    }
  });
});

// Architectural guard: UI and runtime layers must never import the legacy
// corpus (which would drag ~12 MB back into the initial bundle). Type-only
// imports are erased at build time and remain allowed.
describe('no legacy-corpus imports in runtime code', () => {
  const files = [
    'src/App.tsx',
    'src/components/Home.tsx',
    'src/components/SystemDetail.tsx',
    'src/components/ThreadsIndex.tsx',
    'src/components/TextIndex.tsx',
    'src/components/VerseDetail.tsx',
    'src/components/ConceptDetail.tsx',
    'src/components/ThreadView.tsx',
    'src/components/SearchPalette.tsx',
    'src/components/ReferenceLinks.tsx',
    'src/components/RichText.tsx',
    'src/utils/readingHistory.ts',
    'src/utils/crossref.ts',
    'src/content/v2/repository.ts',
    'src/content/v2/catalog.ts',
    'src/content/v2/hooks.ts',
    'src/content/v2/compat.ts',
    'src/content/v2/select.ts',
    'src/content/v2/textSources.ts',
    'src/content/v2/evidenceSummary.ts',
    'src/content/v2/citation.ts',
    'src/content/v2/aliases.ts',
    'src/content/v2/occurrences.ts',
    'src/content/v2/conceptGraph.ts',
    'src/components/concept-graph/ConceptGraphViewport.tsx',
    'src/components/concept-graph/ConceptGraphNarrowList.tsx',
    'src/components/concept-graph/ConceptGraphSelection.tsx',
    'src/components/concept-graph/ConceptGraphLegend.tsx',
    'src/components/concept-graph/ConceptExplorer.tsx',
    'src/context/readingPrefs.ts',
    'src/context/ReadingContext.tsx',
    'src/components/Provenance.tsx',
    'src/components/TextEvidence.tsx',
    'src/components/ReadingControls.tsx',
    'src/search/client.ts',
    'src/search/rank.ts',
  ];
  for (const rel of files) {
    it(`${rel} stays corpus-free`, () => {
      const absolute = path.join(__dirname, '..', '..', '..', '..', rel);
      const source = fs.readFileSync(absolute, 'utf8');
      const valueImports = source
        .split('\n')
        .filter((line) => line.trim().startsWith('import') && !line.includes('import type'))
        .filter((line) => /from\s+['"](\.\.?\/)+content['"]/.test(line));
      expect(valueImports).toEqual([]);
    });
  }
});
