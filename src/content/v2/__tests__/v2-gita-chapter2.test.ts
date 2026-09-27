import * as fs from 'node:fs';
import * as path from 'node:path';
import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import { gitaMapForUnit, gitaSourceNumber } from '../gitaPageMap';
import { GITA_CHAPTERS } from '../gitaChapters';
import { GITA_PASSAGE_SPANS, passageSpanById } from '../gitaSpans';
import {
  GITA_COMMENTARY_TEXTS,
  isSourceTranscription,
  KSTS_SOURCE_ID,
  passageById,
  passagesForSpan,
  validatePassages,
} from '../gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from '../gitaThreads';
import { GITA_QUOTATION_EDGES } from '../gitaXrefs';
import { parseGitaVerseRef } from '../gitaDocument';
import {
  auditChapter2,
  buildChapter2EvidenceMap,
  CHAPTER2_ARGUMENTS,
  CHAPTER2_UNITS,
  chapter2ExtraVerses,
  chapter2KstsForRepo,
  formatChapter2Audit,
} from '../gitaChapter2';
import {
  CHAPTER2_APPARATUS,
  CHAPTER2_CLOSING_MATTER,
  CHAPTER2_COMMENTARY_INVENTORY,
  CHAPTER2_OPENING_MATTER,
  chapter2ApparatusCounts,
  chapter2CoverageGaps,
  chapter2InventoryForKsts,
  chapter2RepoUnit,
  validateChapter2Inventory,
} from '../gitaChapter2Inventory';
import { auditCommentary } from '../commentaryAudit';
import { unitCanonicalUrl } from '../citation';

// Phase-11 Chapter-2 edition tests: mapping with the KSTS extras,
// locators, segments, passages, verification honesty, inventory,
// apparatus, xrefs, arguments and reader access. The transmitted gloss
// is only partly transcribed; the tests pin the boundary between the
// verified core and the inventoried gaps. Deterministic throughout.

const CHAPTER2_SPAN_IDS = [
  'gita-ps-2-avat',
  'gita-seg-2.1-sphuta',
  'gita-seg-2.2-gloss',
  'gita-seg-2.3-gloss',
  'gita-seg-2.4-gloss',
  'gita-seg-2.5-gloss',
  'gita-seg-2.6-gloss',
  'gita-seg-2.7-gloss',
  'gita-seg-2.8-gloss',
  'gita-seg-2.9-10-joint',
  'gita-ps-2-upasamhara',
  'gita-seg-2.74-gloss',
  'gita-ps-2-prasasti',
];

const CHAPTER2_PASSAGE_IDS = [
  'gita-tx-2-avat',
  'gita-tx-2.1-sphuta',
  'gita-tx-2.2-gloss',
  'gita-tx-2.3-gloss',
  'gita-tx-2.4-gloss',
  'gita-tx-2.5-gloss',
  'gita-tx-2.6-gloss',
  'gita-tx-2.7-gloss',
  'gita-tx-2.8-gloss',
  'gita-tx-2.9-10-joint',
  'gita-tx-2-upasamhara',
  'gita-tx-2.74-gloss',
  'gita-tx-2-prasasti',
];

function curatedGita() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
  if (!text) throw new Error('no gita text');
  return { corpus, text };
}

/** The exact VerseDetail.tsx GitaRamakanthaArea selectors, replicated. */
function readerAreaForVerse(verseId: string, passages: typeof GITA_COMMENTARY_TEXTS) {
  const row = gitaMapForUnit(verseId);
  const spans = GITA_PASSAGE_SPANS.filter((s) => (s.unitIds || []).includes(verseId));
  const hits = passages.filter((p) => (p.unitIds || []).includes(verseId));
  const outgoing = GITA_QUOTATION_EDGES.filter((e) => e.fromUnitId === verseId);
  const incoming = GITA_QUOTATION_EDGES.filter((e) => e.toUnitId === verseId && e.fromUnitId !== verseId);
  return { row, spans, hits, outgoing, incoming };
}

describe('chapter-2 KSTS mapping with extras', () => {
  it('covers every Chapter-2 repository unit in the evidence map', () => {
    expect(CHAPTER2_UNITS).toEqual(Array.from({ length: 72 }, (_, i) => `2.${i + 1}`));
    const map = buildChapter2EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER2_UNITS);
  });

  it('maps the KSTS↔vulgate offset with two extras', () => {
    expect(chapter2RepoUnit(1)).toBe('2.1');
    expect(chapter2RepoUnit(10)).toBe('2.10');
    expect(chapter2RepoUnit(11)).toBeNull();
    expect(chapter2RepoUnit(12)).toBe('2.11');
    expect(chapter2RepoUnit(49)).toBe('2.48');
    expect(chapter2RepoUnit(50)).toBeNull();
    expect(chapter2RepoUnit(51)).toBe('2.49');
    expect(chapter2RepoUnit(74)).toBe('2.72');
    expect(chapter2ExtraVerses()).toEqual(['2.11', '2.50']);
    expect(chapter2KstsForRepo('2.38')).toBe('2.39');
    expect(chapter2KstsForRepo('2.72')).toBe('2.74');
    expect(gitaSourceNumber('2.38')).toBe('39');
  });

  it('spans PDF pp.27–70 inside the chapter frame', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 2);
    expect(chapter).toMatchObject({ pdfStart: 27, pdfEnd: 70, printedStart: 17, printedEnd: 60, kstsFirst: 1, kstsLast: 74 });
  });
});

describe('chapter-2 spans', () => {
  it('ships the thirteen print-demarcated Chapter-2 spans', () => {
    for (const id of CHAPTER2_SPAN_IDS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
  });

  it('gives every Chapter-2 span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const id of CHAPTER2_SPAN_IDS) {
      const span = passageSpanById(id);
      if (!span) throw new Error(`missing span ${id}`);
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(span.status).toBe('source');
      expect(span.transcription).toBeUndefined();
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      expect(span.folio).toBe((span.pdf as number) - 10);
      const chapter = GITA_CHAPTERS.find((c) => (span.pdf as number) >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
      expect(chapter?.chapter).toBe(2);
    }
  });

  it('shares the joint span across exactly KSTS 2.9–2.10', () => {
    expect(passageSpanById('gita-seg-2.9-10-joint')?.unitIds).toEqual(['2.9', '2.10']);
    expect(passageSpanById('gita-seg-2.74-gloss')?.ksts).toEqual(['2.74']);
  });
});

describe('chapter-2 passages', () => {
  it('ships the thirteen reviewed Chapter-2 passages', () => {
    for (const id of CHAPTER2_PASSAGE_IDS) {
      expect(passageById(id)?.id).toBe(id);
    }
    expect(CHAPTER2_PASSAGE_IDS).toHaveLength(13);
  });

  it('keeps every Chapter-2 passage text-layer-reviewed with honest uncertainty', () => {
    for (const id of CHAPTER2_PASSAGE_IDS) {
      const passage = passageById(id);
      if (!passage) throw new Error(`missing passage ${id}`);
      expect(passage.status).toBe('text-layer-reviewed');
      expect(passage.sourceId).toBe(KSTS_SOURCE_ID);
      expect(passage.folio).toBe(passage.pdf - 10);
      expect(isSourceTranscription(passage.text)).toBe(true);
      if (passage.text.includes('[?]')) expect((passage.note || '').trim().length).toBeGreaterThan(0);
      if (passage.spanId !== undefined) expect(passageSpanById(passage.spanId)).toBeDefined();
    }
    expect(validatePassages(GITA_COMMENTARY_TEXTS)).toEqual([]);
  });

  it('marks exactly three passages unresolved, never silently', () => {
    const unresolved = CHAPTER2_PASSAGE_IDS.filter((id) => (passageById(id)?.text || '').includes('[?]'));
    expect(unresolved.sort()).toEqual([
      'gita-tx-2.4-gloss',
      'gita-tx-2.6-gloss',
      'gita-tx-2.9-10-joint',
    ]);
  });

  it('preserves reviewed wording (spot checks against the text layer)', () => {
    expect(passageById('gita-tx-2-avat')?.text).toContain('व्यामोहवशविसंस्थुलमर्जुनं');
    expect(passageById('gita-tx-2.1-sphuta')?.text).toBe('स्पष्टार्थः श्रोकः');
    expect(passageById('gita-tx-2.9-10-joint')?.text).toContain('श्लोकद्वयमेतत् गतार्थम्');
    expect(passageById('gita-tx-2.74-gloss')?.text).toContain('तदैकात्म्यमापद्यते इति');
  });

  it('gives every Chapter-2 span exactly one transcribed passage', () => {
    for (const id of CHAPTER2_SPAN_IDS) {
      expect(passagesForSpan(id).map((p) => p.id)).toHaveLength(1);
    }
  });
});

describe('chapter-2 inventory', () => {
  it('covers all 74 KSTS verses with placed commentary regions', () => {
    expect(CHAPTER2_COMMENTARY_INVENTORY).toHaveLength(74);
    expect(CHAPTER2_COMMENTARY_INVENTORY.map((r) => r.ksts)).toEqual(
      Array.from({ length: 74 }, (_, i) => `2.${i + 1}`),
    );
    for (const row of CHAPTER2_COMMENTARY_INVENTORY) {
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.closePdf).toBeGreaterThanOrEqual(row.pdf);
    }
    expect(validateChapter2Inventory()).toEqual([]);
  });

  it('transcribes twelve KSTS verses and exposes sixty-two gaps', () => {
    const gaps = chapter2CoverageGaps();
    expect(gaps).toHaveLength(62);
    expect(gaps).toContain('2.11');
    expect(gaps).toContain('2.50');
    expect(gaps).toContain('2.40');
    expect(gaps).toContain('2.73');
    expect(gaps).not.toContain('2.1');
    expect(gaps).not.toContain('2.39');
    expect(gaps).not.toContain('2.74');
  });

  it('resolves verse lookups through the inventory', () => {
    expect(chapter2InventoryForKsts('2.11')?.repoUnit).toBeNull();
    expect(chapter2InventoryForKsts('2.12')?.repoUnit).toBe('2.11');
    expect(chapter2InventoryForKsts('2.74')?.passageIds).toContain('gita-tx-2.74-gloss');
    expect(chapter2InventoryForKsts('2.99')).toBeUndefined();
  });

  it('records the mismatched gloss closes verbatim, never normalised', () => {
    const close70 = chapter2InventoryForKsts('2.70');
    expect(close70?.commentaryEnd).toContain('६८');
    expect(close70?.unresolved.some((u) => u.includes('६८'))).toBe(true);
    const close74 = chapter2InventoryForKsts('2.74');
    expect(close74?.unresolved.some((u) => u.includes('७२'))).toBe(true);
  });

  it('frames the non-verse chapter matter without transcription gaps hidden', () => {
    expect(CHAPTER2_OPENING_MATTER.map((f) => f.id)).toEqual(['ch2-frame-open']);
    expect(CHAPTER2_CLOSING_MATTER.map((f) => f.id)).toEqual([
      'ch2-frame-upasamhara',
      'ch2-frame-prasasti',
      'ch2-frame-colophon',
    ]);
    expect(CHAPTER2_CLOSING_MATTER.find((f) => f.id === 'ch2-frame-colophon')?.status).toBe('locator-only');
  });

  it('keeps every apparatus item ambiguous and unresolved, with out-of-set sigla preserved', () => {
    expect(CHAPTER2_APPARATUS).toHaveLength(19);
    expect(chapter2ApparatusCounts()).toEqual({ observed: 19, mapped: 0, unresolved: 19 });
    for (const item of CHAPTER2_APPARATUS) {
      expect(item.attribution).toBe('ambiguous');
      expect(item.status).toBe('unresolved');
      expect(item.folio).toBe(item.pdf - 10);
    }
    expect(CHAPTER2_APPARATUS.find((i) => i.id === 'gita-app-2-36-1')?.siglum).toBeNull();
    expect(CHAPTER2_APPARATUS.find((i) => i.id === 'gita-app-2-59-1')?.siglum).toBeNull();
    expect(CHAPTER2_APPARATUS.filter((i) => i.kind === 'folio-mark')).toHaveLength(6);
  });
});

describe('chapter-2 evidence map and audit', () => {
  it('keeps mula locator-only and marks exactly the verified core as source-text', () => {
    const map = buildChapter2EvidenceMap();
    expect(map).toHaveLength(72);
    for (const row of map) {
      expect(row.mulaStatus).toBe('locator-only');
    }
    const withText = map.filter((r) => r.evidenceStatus === 'source-text').map((r) => r.unitId);
    expect(withText.sort()).toEqual(
      ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', '2.38', '2.72'].sort(),
    );
    for (const row of map) {
      if (withText.includes(row.unitId)) expect(row.verification).toBe('text-layer-reviewed');
      else expect(row.verification).toBe('locator-only');
    }
  });

  it('reports actual Chapter-2 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter2EvidenceMap(text.concepts);
    const coverage = auditChapter2(map, text.concepts);
    expect(coverage.units).toEqual({ total: 72, withLocator: 72, withSegment: 12, withSourceText: 12 });
    expect(coverage.ksts).toEqual({ total: 74, transcribed: 12, untranscribed: 62, extras: 2 });
    expect(coverage.mula).toEqual({ verses: 72, transcribed: 0, locatorOnly: 72 });
    expect(coverage.commentary).toEqual({
      verifiedSource: 1,
      textLayerReviewed: 13,
      pageImageCollated: 0,
      locatorOnlyUnits: 60,
      unresolvedPassages: 4,
    });
    expect(coverage.inventory).toEqual({ verses: 74, transcribed: 12, untranscribed: 62 });
    expect(coverage.gaps).toHaveLength(62);
    // Pre-existing signals only: samuccaya on 2.38 is span-grounded to
    // the tail bridge; karma/jñāna on 2.47 stay locator-only. Phase 11
    // grounds nothing new.
    expect(coverage.concepts).toEqual({ sourceGrounded: 3, exactTextGrounded: 1, locatorOnly: 2 });
    expect(coverage.threads).toEqual({ steps: 1, sourceTextGrounded: 1, segmentGrounded: 0, locatorOnly: 0 });
    expect(coverage.xrefs).toEqual({ explicit: 6, quotation: 6, unresolved: 5 });
    expect(coverage.arguments).toEqual({ total: 8, sourceBacked: 8, unresolved: 0 });
    expect(coverage.apparatus).toEqual({ observed: 19, mapped: 0, unresolved: 19 });
    const rendered = formatChapter2Audit(coverage);
    for (const line of ['Chapter 2 Scholarly Audit', 'Units:', 'KSTS:', 'Mula:', 'Commentary:', 'Inventory:', 'Concepts:', 'Threads:', 'Cross-references:', 'Arguments:', 'Apparatus:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    expect(rendered).toContain('transcribed: 0');
  });
});

describe('chapter-2 xrefs', () => {
  it('ships four hosted Chapter-2 quotation edges', () => {
    for (const id of ['gita-xref-068', 'gita-xref-069', 'gita-xref-070', 'gita-xref-071']) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge?.kind).toBe('commentary-quotes-unit');
      expect(edge?.fromUnitId).not.toBeNull();
      if (edge?.fromUnitId !== null) expect(gitaMapForUnit(edge.fromUnitId)).toBeDefined();
      if (edge?.toUnitId !== null) expect(gitaMapForUnit(edge.toUnitId)).toBeDefined();
    }
    expect(GITA_QUOTATION_EDGES.find((e) => e.id === 'gita-xref-068')?.toUnitId).toBeNull();
  });

  it('keeps every edge quotation-kind (no invented external attributions)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });
});

describe('chapter-2 arguments without a concept graph', () => {
  it('grounds every argument in exact evidence', () => {
    expect(CHAPTER2_ARGUMENTS).toHaveLength(8);
    for (const arg of CHAPTER2_ARGUMENTS) {
      expect(arg.status).toBe('source');
      expect(passageSpanById(arg.segmentId as string)).toBeDefined();
      expect(passageById(arg.passageId as string)?.spanId).toBe(arg.segmentId);
    }
  });

  it('builds no concepts or threads from Chapter 2 yet', () => {
    const ch2SpanIds = new Set(CHAPTER2_SPAN_IDS);
    const { text } = curatedGita();
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) expect(ch2SpanIds.has(occ.spanId)).toBe(false);
      }
    }
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        if ((step.unitIds || []).some((u) => u.startsWith('2.'))) {
          // Only the pre-existing samuccaya tail step may touch Chapter 2.
          expect(`${thread.id}/${step.id}`).toBe('gita-rk-samuccaya-marga/gita-rk-samuccaya-1');
        }
        for (const sid of step.spanIds || []) {
          if (ch2SpanIds.has(sid)) expect(sid).toBe('gita-seg-2.39-tail');
        }
      }
    }
  });
});

describe('chapter-2 reader access', () => {
  it('reaches chapter, middle verses and both closers through the reader selectors', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const verseId of ['2.1', '2.10', '2.38', '2.55', '2.72']) {
      expect(unitIds.has(verseId)).toBe(true);
      const area = readerAreaForVerse(verseId, GITA_COMMENTARY_TEXTS);
      expect(area.row).toBeDefined();
      const verse = Number(verseId.split('.')[1]);
      if (verse > 1) expect(unitIds.has(`2.${verse - 1}`)).toBe(true);
      if (verse < 72) expect(unitIds.has(`2.${verse + 1}`)).toBe(true);
    }
    expect(unitIds.has('3.1')).toBe(true);
  });

  it('opens commentary and provenance for transcribed verses', () => {
    const first = readerAreaForVerse('2.1', GITA_COMMENTARY_TEXTS);
    expect(first.spans.map((s) => s.id)).toContain('gita-seg-2.1-sphuta');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-2.1-sphuta');
    const tail = readerAreaForVerse('2.38', GITA_COMMENTARY_TEXTS);
    expect(tail.hits.map((p) => p.id)).toContain('gita-tx-2.39-tail');
    expect(tail.spans.map((s) => s.id)).toContain('gita-seg-2.39-tail');
  });

  it('shows locators with quotation edges where the gloss stays untranscribed', () => {
    const area = readerAreaForVerse('2.55', GITA_COMMENTARY_TEXTS);
    expect(area.row).toBeDefined();
    expect(area.hits).toHaveLength(0);
    expect(area.outgoing.map((e) => e.id).sort()).toEqual(['gita-xref-070', 'gita-xref-071']);
  });

  it('keeps canonical verse URLs stable for the chapter edges', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '2.1')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/2.1',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '2.72')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/2.72',
    );
  });

  it('ships Chapter-2 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-2-avat', 'gita-tx-2.9-10-joint', 'gita-tx-2-prasasti']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
    expect(data).toHaveLength(109);
  });

  it('keeps the commentary-wide span audit clean after the Chapter-2 growth', () => {
    const { text } = curatedGita();
    const audit = auditCommentary({
      spans: GITA_PASSAGE_SPANS,
      threads: GITA_SCHOLARLY_THREADS,
      concepts: text.concepts,
      passages: GITA_COMMENTARY_TEXTS,
    });
    expect(audit.danglingSpanRefs).toBe(0);
  });
});
