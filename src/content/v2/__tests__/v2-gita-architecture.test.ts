import {
  GITA_DOCUMENT_UNIT_KINDS,
  isGitaDocumentUnitKind,
  ksts64PdfPage,
  ksts64PrintedFolio,
  parseDevanagariNumber,
  parseGitaVerseRef,
} from '../gitaDocument';

// Architecture-phase tests for the Gītā source-document vocabulary.
// Corpus-free by design: they lock parsing behaviour only, never content.
describe('gita document unit vocabulary', () => {
  it('is a unique kebab-case set covering the observed structures', () => {
    expect(GITA_DOCUMENT_UNIT_KINDS.length).toBeGreaterThan(0);
    expect(new Set(GITA_DOCUMENT_UNIT_KINDS).size).toBe(GITA_DOCUMENT_UNIT_KINDS.length);
    for (const kind of GITA_DOCUMENT_UNIT_KINDS) {
      expect(kind).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });

  it('distinguishes commentary layers instead of flattening them', () => {
    for (const kind of [
      'commentary-block',
      'pratika-gloss',
      'commentary-quotation',
      'commentary-cross-reference',
      'objection-block',
      'response-block',
    ] as const) {
      expect(isGitaDocumentUnitKind(kind)).toBe(true);
    }
  });

  it('rejects unknown kinds without throwing', () => {
    expect(isGitaDocumentUnitKind('commentary')).toBe(false);
    expect(isGitaDocumentUnitKind('')).toBe(false);
    expect(isGitaDocumentUnitKind(undefined)).toBe(false);
    expect(isGitaDocumentUnitKind('pratika-gloss ')).toBe(false);
  });
});

describe('devanagari numerals', () => {
  it('reads devanagari and ascii runs alike', () => {
    expect(parseDevanagariNumber('१३')).toBe(13);
    expect(parseDevanagariNumber('३४')).toBe(34);
    expect(parseDevanagariNumber('421')).toBe(421);
    expect(parseDevanagariNumber('no digits')).toBeNull();
  });
});

describe('commentary verse-reference parsing', () => {
  it('parses the parenthesised locator in either script', () => {
    expect(parseGitaVerseRef('(१३।३४)')).toEqual({ chapter: 13, verse: 34 });
    expect(parseGitaVerseRef('(11.47)')).toEqual({ chapter: 11, verse: 47 });
    expect(parseGitaVerseRef('२।२६')).toEqual({ chapter: 2, verse: 26 });
  });

  it('rejects impossible chapters, verse zero and dotted triples', () => {
    expect(parseGitaVerseRef('(19.1)')).toBeNull();
    expect(parseGitaVerseRef('(0.5)')).toBeNull();
    expect(parseGitaVerseRef('(13.0)')).toBeNull();
    expect(parseGitaVerseRef('1.1.2')).toBeNull();
    expect(parseGitaVerseRef('no reference')).toBeNull();
  });
});

describe('ksts pdf to printed-folio mapping', () => {
  it('maps the verified main-text and back-matter range', () => {
    expect(ksts64PrintedFolio(11)).toBe(1);
    expect(ksts64PrintedFolio(372)).toBe(362);
    expect(ksts64PrintedFolio(415)).toBe(405);
    expect(ksts64PrintedFolio(421)).toBe(411);
    expect(ksts64PrintedFolio(431)).toBe(421);
  });

  it('round-trips inside the verified range', () => {
    for (const printed of [1, 100, 277, 405, 411, 421]) {
      expect(ksts64PrintedFolio(ksts64PdfPage(printed) as number)).toBe(printed);
    }
  });

  it('refuses front matter and out-of-range pages instead of guessing', () => {
    expect(ksts64PrintedFolio(1)).toBeNull();
    expect(ksts64PrintedFolio(10)).toBeNull();
    expect(ksts64PrintedFolio(432)).toBeNull();
    expect(ksts64PdfPage(0)).toBeNull();
    expect(ksts64PdfPage(422)).toBeNull();
  });
});
