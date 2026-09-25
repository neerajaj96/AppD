import { validateCorpus } from '../validate';
import {
  GITA_DOCUMENT_UNIT_KINDS,
  GITA_MAPPING_STATUSES,
  GITA_REFERENCE_KINDS,
  GITA_SIGLA,
  isGitaMappingStatus,
  isGitaReferenceKind,
  isGitaSiglum,
  parseErratumRow,
  parseGitaVerseRef,
} from '../gitaDocument';
import { GITA_CHAPTERS, gitaChapterForPdfPage } from '../gitaChapters';
import {
  GITA_ADHIKA_MAP,
  GITA_KSTS_EXTRAS,
  GITA_UNIT_MAP,
  gitaMapForUnit,
  gitaSourceNumber,
} from '../gitaPageMap';
import { GITA_COMMENTARY_SPANS, commentarySpanForUnit } from '../gitaSpans';
import { GITA_QUOTATION_EDGES } from '../gitaXrefs';
import type { V2Corpus } from '../schema';

// Phase-2 backbone tests: concordance, folio mapping, chapters,
// appendix, spans, errata, references. All deterministic and corpus-free
// except the validation passthrough (synthetic corpus only).

const REPO_N = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
const KSTS_N = [47, 74, 48, 42, 28, 49, 30, 28, 35, 42, 60, 20, 34, 27, 20, 24, 28, 79];

function mulaIds(): string[] {
  const ids: string[] = [];
  REPO_N.forEach((n, i) => {
    for (let v = 1; v <= n; v += 1) ids.push(`${i + 1}.${v}`);
  });
  return ids;
}

describe('chapter-13 numbering and concordance', () => {
  it('leaves the vulgate question without a KSTS counterpart', () => {
    expect(GITA_UNIT_MAP['13.1']).toMatchObject({ ksts: [], status: 'vulgate-only' });
    expect(gitaSourceNumber('13.1')).toBeUndefined();
  });

  it('shifts repo 13.2–13.35 exactly one below vulgate', () => {
    for (let v = 2; v <= 35; v += 1) {
      const row = GITA_UNIT_MAP[`13.${v}`];
      expect(row.ksts).toEqual([`13.${v - 1}`]);
      expect(row.status).toBe('offset');
      expect(gitaSourceNumber(`13.${v}`)).toBe(String(v - 1));
    }
    expect(gitaSourceNumber('13.35')).toBe('34');
  });

  it('never renumbers canonical ids', () => {
    for (const id of mulaIds()) {
      expect(GITA_UNIT_MAP[id]).toBeDefined();
    }
  });
});

describe('sourceNumber mapping', () => {
  it('uses bare numbers within a chapter and qualifies across chapters', () => {
    expect(gitaSourceNumber('2.12')).toBe('13');
    expect(gitaSourceNumber('5.19')).toBe('6.10');
    expect(gitaSourceNumber('18.78')).toBe('78-79');
    expect(gitaSourceNumber('11.46')).toBeUndefined();
    expect(gitaSourceNumber('nope')).toBeUndefined();
  });

  it('parses every mapped KSTS reference as a valid verse ref', () => {
    for (const [id, row] of Object.entries(GITA_UNIT_MAP)) {
      for (const ref of row.ksts) {
        expect(parseGitaVerseRef(ref)).not.toBeNull();
      }
      void id;
    }
  });
});

describe('folio and pdf mapping', () => {
  it('keeps folio exactly ten below pdf inside the verified range', () => {
    for (const row of Object.values(GITA_UNIT_MAP)) {
      if (row.pdf === undefined) {
        expect(row.folio).toBeUndefined();
        continue;
      }
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.pdf).toBeGreaterThanOrEqual(11);
      expect(row.pdf).toBeLessThanOrEqual(431);
    }
  });

  it('places every mapped verse inside its chapter span', () => {
    for (const [id, row] of Object.entries(GITA_UNIT_MAP)) {
      if (row.pdf === undefined) continue;
      // Transposed rows live under another chapter (5.19 text at KSTS 6.10).
      const kstsChapter = Number(row.ksts[0].split('.')[0]);
      const chapter = GITA_CHAPTERS[kstsChapter - 1];
      expect(row.pdf).toBeGreaterThanOrEqual(chapter.pdfStart);
      expect(row.pdf).toBeLessThanOrEqual(chapter.pdfEnd);
    }
  });

  it('accounts every KSTS number as mapped or extra', () => {
    const mapped = new Set<string>();
    for (const row of Object.values(GITA_UNIT_MAP)) {
      for (const ref of row.ksts) mapped.add(ref);
    }
    for (const e of GITA_KSTS_EXTRAS) mapped.add(e.ksts);
    // Transposed 5.19 text lives at KSTS 6.10 (referenced, not extra).
    for (let ch = 1; ch <= 18; ch += 1) {
      for (let v = 1; v <= KSTS_N[ch - 1]; v += 1) {
        expect(mapped.has(`${ch}.${v}`)).toBe(true);
      }
    }
  });

  it('keeps extras disjoint from canonical mappings except shared spans', () => {
    // Shared-span numbers (6.39, 11.40, 11.41, 18.79) belong to spans,
    // never to the extras list.
    const extraKeys = new Set(GITA_KSTS_EXTRAS.map((e) => e.ksts));
    for (const shared of ['6.39', '11.40', '11.41', '18.79']) {
      expect(extraKeys.has(shared)).toBe(false);
    }
    expect(GITA_KSTS_EXTRAS).toHaveLength(13);
  });
});

describe('chapter boundaries', () => {
  it('lists eighteen contiguous non-overlapping chapters', () => {
    expect(GITA_CHAPTERS).toHaveLength(18);
    GITA_CHAPTERS.forEach((c, i) => {
      expect(c.chapter).toBe(i + 1);
      expect(c.printedStart).toBe(c.pdfStart - 10);
      expect(c.printedEnd).toBe(c.pdfEnd - 10);
      expect(c.kstsLast - c.kstsFirst + 1).toBe(KSTS_N[i]);
      if (i > 0) expect(c.pdfStart).toBe(GITA_CHAPTERS[i - 1].pdfEnd + 1);
    });
  });

  it('resolves pages to their chapter', () => {
    expect(gitaChapterForPdfPage(21)?.chapter).toBe(1);
    expect(gitaChapterForPdfPage(287)?.chapter).toBe(13);
    expect(gitaChapterForPdfPage(431)).toBeUndefined();
  });

  it('records no philosophical chapter titles from the edition', () => {
    for (const c of GITA_CHAPTERS) {
      expect(c).not.toHaveProperty('title');
    }
  });
});

describe('appendix mapping', () => {
  it('covers all thirteen adhika units without touching the mūla sequence', () => {
    expect(Object.keys(GITA_ADHIKA_MAP)).toHaveLength(13);
    for (let n = 1; n <= 13; n += 1) {
      const row = GITA_ADHIKA_MAP[`adhika.${n}`];
      expect(row).toBeDefined();
      expect(row.status.startsWith('appendix')).toBe(true);
      expect(row.pdf).toBeDefined();
      expect(row.folio).toBeDefined();
    }
    for (const id of mulaIds()) {
      expect(GITA_ADHIKA_MAP[id]).toBeUndefined();
    }
  });

  it('shares inline-numbered verses with the mūla map where printed', () => {
    for (const [adhika, ksts] of [
      ['adhika.3', '3.38'],
      ['adhika.8', '2.50'],
      ['adhika.10', '9.7'],
      ['adhika.11', '11.28'],
    ] as Array<[string, string]>) {
      expect(GITA_ADHIKA_MAP[adhika].ksts).toEqual([ksts]);
    }
  });
});

describe('joint commentary spans', () => {
  it('keeps every spanned verse individually addressable', () => {
    expect(GITA_COMMENTARY_SPANS).toHaveLength(2);
    for (const span of GITA_COMMENTARY_SPANS) {
      expect(span.unitIds.length).toBeGreaterThan(1);
      for (const id of span.unitIds) {
        expect(GITA_UNIT_MAP[id]).toBeDefined();
        expect(commentarySpanForUnit(id)?.id).toBe(span.id);
      }
    }
    expect(commentarySpanForUnit('2.12')).toBeUndefined();
  });
});

describe('errata representation', () => {
  it('parses unambiguous rows and refuses the rest', () => {
    expect(parseErratumRow('२ १५ परपुरुषार्थत्वात् पुरुषार्थत्वात्')).toEqual({
      printedPage: 2,
      line: 15,
      incorrect: 'परपुरुषार्थत्वात्',
      correct: 'पुरुषार्थत्वात्',
    });
    expect(parseErratumRow('406 12 abc def')).toEqual({
      printedPage: 406,
      line: 12,
      incorrect: 'abc',
      correct: 'def',
    });
    // Multi-word readings need human splitting: null, never guessed.
    expect(parseErratumRow('११ १ संयतस्तत्परेन्द्रियः तत्परः संयतेन्द्रियः')).toBeNull();
    expect(parseErratumRow('nonsense')).toBeNull();
    expect(parseErratumRow('')).toBeNull();
  });

  it('never applies corrections silently (model carries both readings)', () => {
    const row = parseErratumRow('२ १५ परपुरुषार्थत्वात् पुरुषार्थत्वात्');
    expect(row?.incorrect).not.toBe(row?.correct);
  });
});

describe('witness sigla', () => {
  it('accepts only the observed set, leaving पु. unexplained', () => {
    for (const s of ['क', 'ख', 'ग', 'पु.']) expect(isGitaSiglum(s)).toBe(true);
    for (const s of ['घ', 'ङ', 'pustaka', '', undefined]) expect(isGitaSiglum(s)).toBe(false);
    expect(GITA_SIGLA).toContain('पु.');
  });

  it('keeps mapping statuses and reference kinds closed', () => {
    for (const s of GITA_MAPPING_STATUSES) expect(isGitaMappingStatus(s)).toBe(true);
    expect(isGitaMappingStatus('verified')).toBe(false);
    for (const k of GITA_REFERENCE_KINDS) expect(isGitaReferenceKind(k)).toBe(true);
    expect(GITA_DOCUMENT_UNIT_KINDS.length).toBeGreaterThan(0);
  });
});

describe('quotation edges', () => {
  it('resolves every target to the map or the extras, never to nothing', () => {
    const mapped = new Set<string>();
    for (const row of Object.values(GITA_UNIT_MAP)) {
      for (const ref of row.ksts) mapped.add(ref);
    }
    for (const e of GITA_KSTS_EXTRAS) mapped.add(e.ksts);
    mapped.add('2.50');
    for (const e of GITA_QUOTATION_EDGES) {
      const key = `${e.toKsts.chapter}.${e.toKsts.verse}`;
      expect(mapped.has(key)).toBe(true);
    }
  });

  it('keeps hosts honest: null only with a note, units resolving', () => {
    expect(GITA_QUOTATION_EDGES.length).toBeGreaterThan(0);
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.quotedText.trim().length).toBeGreaterThan(0);
      expect(e.locator.trim().length).toBeGreaterThan(0);
      expect(e.kind).toBe('commentary-quotes-unit');
      if (e.fromUnitId === null) {
        expect(e.note).toBeDefined();
      } else {
        expect(GITA_UNIT_MAP[e.fromUnitId] || GITA_ADHIKA_MAP[e.fromUnitId]).toBeDefined();
      }
      if (e.toUnitId !== null) {
        expect(GITA_UNIT_MAP[e.toUnitId] || GITA_ADHIKA_MAP[e.toUnitId]).toBeDefined();
      }
    }
  });

  it('points the (2,50) quotations at the unit carrying that content', () => {
    const edges = GITA_QUOTATION_EDGES.filter(
      (e) => e.toKsts.chapter === 2 && e.toKsts.verse === 50,
    );
    expect(edges.length).toBeGreaterThan(0);
    for (const e of edges) expect(e.toUnitId).toBe('adhika.8');
  });
});

describe('backbone validation passthrough', () => {
  function corpusWithUnit(extra: Record<string, unknown>): V2Corpus {
    return {
      schemaVersion: 2,
      traditions: [{ id: 't1', title: 'T1', category: 'philosophical-school' as const, textIds: ['x'], threadSteps: 0 }],
      texts: [
        {
          id: 'x',
          title: 'X',
          transliteratedTitle: 'X',
          traditionId: 't1',
          sourceRole: 'primary' as const,
          contentStatus: 'complete' as const,
          languages: ['en' as const],
          units: [
            {
              id: 'u1',
              number: '1',
              section: 'S',
              unitType: 'sloka' as const,
              iast: '',
              localisations: { en: { translation: 'T' } },
              ...extra,
            },
          ],
          concepts: [],
        },
      ],
      aliases: [],
    };
  }

  it('accepts speaker, sourceNumber and locator without new error codes', () => {
    const result = validateCorpus(
      corpusWithUnit({ speaker: 'अर्जुन', sourceNumber: '12', provenance: { locator: 'p. 22' } }),
    );
    expect(result.errors).toEqual([]);
  });
});

describe('map lookup helpers', () => {
  it('resolves mūla and adhika ids and nothing else', () => {
    expect(gitaMapForUnit('2.12')?.status).toBe('offset');
    expect(gitaMapForUnit('adhika.3')?.status).toBe('appendix-inline');
    expect(gitaMapForUnit('18.78')?.ksts).toEqual(['18.78', '18.79']);
    expect(gitaMapForUnit('nope')).toBeUndefined();
  });
});
