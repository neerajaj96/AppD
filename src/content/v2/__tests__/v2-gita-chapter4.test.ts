import * as fs from 'node:fs';
import * as path from 'node:path';
import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import { gitaMapForUnit } from '../gitaPageMap';
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
  auditChapter4,
  buildChapter4EvidenceMap,
  CHAPTER4_ARGUMENTS,
  CHAPTER4_UNITS,
  formatChapter4Audit,
} from '../gitaChapter4';
import {
  CHAPTER4_APPARATUS,
  CHAPTER4_CLOSING_MATTER,
  CHAPTER4_COMMENTARY_INVENTORY,
  CHAPTER4_OPENING_MATTER,
  chapter4ApparatusCounts,
  chapter4CoverageGaps,
  chapter4InventoryForKsts,
  validateChapter4Inventory,
} from '../gitaChapter4Inventory';
import { auditCommentary } from '../commentaryAudit';
import { unitCanonicalUrl } from '../citation';

// Phase-13 Chapter-4 edition tests: fully-aligned mapping, locators,
// segments, passages, verification honesty, inventory, apparatus,
// xrefs, arguments and reader access. The transmitted gloss is only
// partly transcribed; the tests pin the boundary between the verified
// core and the inventoried gaps. Deterministic throughout.

const CHAPTER4_SPAN_IDS = [
  'gita-seg-4.1-3-joint',
  'gita-seg-4.13-gloss',
  'gita-seg-4.42-gloss',
  'gita-ps-4-prasasti',
];

const CHAPTER4_PASSAGE_IDS = [
  'gita-tx-4.1-3-joint',
  'gita-tx-4.13-gloss',
  'gita-tx-4.42-gloss',
  'gita-tx-4-prasasti',
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

describe('chapter-4 KSTS mapping', () => {
  it('covers every Chapter-4 repository unit in the evidence map', () => {
    expect(CHAPTER4_UNITS).toEqual(Array.from({ length: 42 }, (_, i) => `4.${i + 1}`));
    const map = buildChapter4EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER4_UNITS);
  });

  it('keeps Chapter 4 fully aligned (KSTS == vulgate, no extras)', () => {
    for (let v = 1; v <= 42; v += 1) {
      const row = gitaMapForUnit(`4.${v}`);
      if (!row) throw new Error(`missing map row 4.${v}`);
      expect(row.ksts).toEqual([`4.${v}`]);
      expect(row.status).toBe('aligned');
      expect(row.folio).toBe((row.pdf as number) - 10);
    }
  });

  it('spans PDF pp.102–125 inside the chapter frame', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 4);
    expect(chapter).toMatchObject({ pdfStart: 102, pdfEnd: 125, printedStart: 92, printedEnd: 115, kstsFirst: 1, kstsLast: 42 });
  });
});

describe('chapter-4 spans', () => {
  it('ships the four print-demarcated Chapter-4 spans', () => {
    for (const id of CHAPTER4_SPAN_IDS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
  });

  it('gives every Chapter-4 span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const id of CHAPTER4_SPAN_IDS) {
      const span = passageSpanById(id);
      if (!span) throw new Error(`missing span ${id}`);
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(span.status).toBe('source');
      expect(span.transcription).toBeUndefined();
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      expect(span.folio).toBe((span.pdf as number) - 10);
      const chapter = GITA_CHAPTERS.find((c) => (span.pdf as number) >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
      expect(chapter?.chapter).toBe(4);
    }
  });

  it('shares the joint span across exactly KSTS 4.1–4.3', () => {
    expect(passageSpanById('gita-seg-4.1-3-joint')?.unitIds).toEqual(['4.1', '4.2', '4.3']);
    expect(passageSpanById('gita-seg-4.42-gloss')?.ksts).toEqual(['4.42']);
  });
});

describe('chapter-4 passages', () => {
  it('ships the four reviewed Chapter-4 passages', () => {
    for (const id of CHAPTER4_PASSAGE_IDS) {
      expect(passageById(id)?.id).toBe(id);
    }
    expect(CHAPTER4_PASSAGE_IDS).toHaveLength(4);
  });

  it('keeps every Chapter-4 passage text-layer-reviewed with honest uncertainty', () => {
    for (const id of CHAPTER4_PASSAGE_IDS) {
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

  it('marks exactly two passages unresolved, never silently', () => {
    const unresolved = CHAPTER4_PASSAGE_IDS.filter((id) => (passageById(id)?.text || '').includes('[?]'));
    expect(unresolved.sort()).toEqual(['gita-tx-4-prasasti', 'gita-tx-4.13-gloss']);
  });

  it('preserves reviewed wording (spot checks against the text layer)', () => {
    expect(passageById('gita-tx-4.1-3-joint')?.text).toContain('ज्ञानकर्मसमुच्चयानुष्ठानात्मकस्य');
    expect(passageById('gita-tx-4.13-gloss')?.text).toContain('मामकर्तारं');
    expect(passageById('gita-tx-4.42-gloss')?.text).toContain('सुच्छेदत्वप्रतिपादनार्थमुक्तमिति ओम्');
  });

  it('gives every Chapter-4 span exactly one transcribed passage', () => {
    for (const id of CHAPTER4_SPAN_IDS) {
      expect(passagesForSpan(id).map((p) => p.id)).toHaveLength(1);
    }
  });
});

describe('chapter-4 inventory', () => {
  it('covers all 42 KSTS verses with placed commentary regions', () => {
    expect(CHAPTER4_COMMENTARY_INVENTORY).toHaveLength(42);
    expect(CHAPTER4_COMMENTARY_INVENTORY.map((r) => r.ksts)).toEqual(
      Array.from({ length: 42 }, (_, i) => `4.${i + 1}`),
    );
    for (const row of CHAPTER4_COMMENTARY_INVENTORY) {
      expect(row.repoUnit).toBe(row.ksts);
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.closePdf).toBeGreaterThanOrEqual(row.pdf);
    }
    expect(validateChapter4Inventory()).toEqual([]);
  });

  it('transcribes five KSTS verses and exposes thirty-seven gaps', () => {
    const gaps = chapter4CoverageGaps();
    expect(gaps).toHaveLength(37);
    expect(gaps).toContain('4.20');
    expect(gaps).toContain('4.28');
    expect(gaps).toContain('4.41');
    expect(gaps).not.toContain('4.1');
    expect(gaps).not.toContain('4.13');
    expect(gaps).not.toContain('4.42');
  });

  it('resolves verse lookups through the inventory', () => {
    expect(chapter4InventoryForKsts('4.13')?.passageIds).toEqual(['gita-tx-4.13-gloss']);
    expect(chapter4InventoryForKsts('4.42')?.passageIds).toContain('gita-tx-4-prasasti');
    expect(chapter4InventoryForKsts('4.99')).toBeUndefined();
  });

  it('frames the non-verse chapter matter without transcription gaps hidden', () => {
    expect(CHAPTER4_OPENING_MATTER.map((f) => f.id)).toEqual(['ch4-frame-open']);
    expect(CHAPTER4_CLOSING_MATTER.map((f) => f.id)).toEqual([
      'ch4-frame-prasasti',
      'ch4-frame-colophon',
    ]);
    expect(CHAPTER4_CLOSING_MATTER.find((f) => f.id === 'ch4-frame-colophon')?.status).toBe('locator-only');
  });

  it('records folio fragments only, with no variants observed', () => {
    expect(CHAPTER4_APPARATUS).toHaveLength(3);
    expect(chapter4ApparatusCounts()).toEqual({ observed: 3, mapped: 0, unresolved: 3 });
    for (const item of CHAPTER4_APPARATUS) {
      expect(item.attribution).toBe('ambiguous');
      expect(item.status).toBe('unresolved');
      expect(item.kind).toBe('folio-mark');
      expect(item.siglum).toBeNull();
      expect(item.folio).toBe(item.pdf - 10);
    }
  });
});

describe('chapter-4 evidence map and audit', () => {
  it('keeps mula locator-only and marks exactly the verified core as source-text', () => {
    const map = buildChapter4EvidenceMap();
    expect(map).toHaveLength(42);
    for (const row of map) {
      expect(row.mulaStatus).toBe('locator-only');
    }
    const withText = map.filter((r) => r.evidenceStatus === 'source-text').map((r) => r.unitId);
    expect(withText.sort()).toEqual(['4.1', '4.13', '4.2', '4.3', '4.42'].sort());
    for (const row of map) {
      if (withText.includes(row.unitId)) expect(row.verification).not.toBe('locator-only');
      else expect(row.verification).toBe('locator-only');
    }
  });

  it('reports actual Chapter-4 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter4EvidenceMap(text.concepts);
    const coverage = auditChapter4(map, text.concepts);
    expect(coverage.units).toEqual({ total: 42, withLocator: 42, withSegment: 5, withSourceText: 5 });
    expect(coverage.mula).toEqual({ verses: 42, transcribed: 0, locatorOnly: 42 });
    expect(coverage.commentary).toEqual({
      verifiedSource: 1,
      textLayerReviewed: 4,
      pageImageCollated: 0,
      locatorOnlyUnits: 37,
      unresolvedPassages: 2,
    });
    expect(coverage.inventory).toEqual({ verses: 42, transcribed: 5, untranscribed: 37 });
    expect(coverage.gaps).toHaveLength(37);
    // Pre-existing signals only: samuccaya on 4.1 is span-grounded to
    // the avataraṇikā. Phase 13 grounds nothing new.
    expect(coverage.concepts).toEqual({ sourceGrounded: 1, exactTextGrounded: 1, locatorOnly: 0 });
    expect(coverage.threads).toEqual({ steps: 1, sourceTextGrounded: 1, segmentGrounded: 0, locatorOnly: 0 });
    expect(coverage.xrefs).toEqual({ explicit: 11, quotation: 11, unresolved: 3 });
    expect(coverage.arguments).toEqual({ total: 4, sourceBacked: 4, unresolved: 0 });
    expect(coverage.apparatus).toEqual({ observed: 3, mapped: 0, unresolved: 3 });
    const rendered = formatChapter4Audit(coverage);
    for (const line of ['Chapter 4 Scholarly Audit', 'Units:', 'Mula:', 'Commentary:', 'Inventory:', 'Concepts:', 'Threads:', 'Cross-references:', 'Arguments:', 'Apparatus:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    expect(rendered).toContain('transcribed: 0');
  });
});

describe('chapter-4 xrefs', () => {
  it('ships three hosted Chapter-4 quotation edges', () => {
    for (const id of ['gita-xref-078', 'gita-xref-079', 'gita-xref-080']) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge?.kind).toBe('commentary-quotes-unit');
      expect(edge?.fromUnitId).not.toBeNull();
      if (edge?.fromUnitId !== null) expect(gitaMapForUnit(edge.fromUnitId)).toBeDefined();
      if (edge?.toUnitId !== null) expect(gitaMapForUnit(edge.toUnitId)).toBeDefined();
    }
    expect(GITA_QUOTATION_EDGES.find((e) => e.id === 'gita-xref-080')?.toUnitId).toBe('9.32');
  });

  it('keeps every edge quotation-kind (no invented external attributions)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });
});

describe('chapter-4 arguments without a concept graph', () => {
  it('grounds every argument in exact evidence', () => {
    expect(CHAPTER4_ARGUMENTS).toHaveLength(4);
    for (const arg of CHAPTER4_ARGUMENTS) {
      expect(arg.status).toBe('source');
      expect(passageSpanById(arg.segmentId as string)).toBeDefined();
      expect(passageById(arg.passageId as string)?.spanId).toBe(arg.segmentId);
    }
  });

  it('builds no concepts or threads from Chapter 4 yet', () => {
    const ch4SpanIds = new Set(CHAPTER4_SPAN_IDS);
    const { text } = curatedGita();
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) {
          // Only the pre-existing avataraṇikā grounding may cite Chapter 4.
          if (ch4SpanIds.has(occ.spanId)) expect(occ.spanId).toBe('gita-ps-4-avat');
          else expect(ch4SpanIds.has(occ.spanId)).toBe(false);
        }
      }
    }
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        if ((step.unitIds || []).some((u) => u.startsWith('4.'))) {
          // Only the pre-existing samuccaya distinction step may touch Chapter 4.
          expect(`${thread.id}/${step.id}`).toBe('gita-rk-samuccaya-marga/gita-rk-samuccaya-3');
        }
        for (const sid of step.spanIds || []) {
          if (sid === 'gita-ps-4-avat') continue;
          expect(ch4SpanIds.has(sid)).toBe(false);
        }
      }
    }
  });
});

describe('chapter-4 reader access', () => {
  it('reaches chapter, middle verses and both closers through the reader selectors', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const verseId of ['4.1', '4.13', '4.24', '4.28', '4.42']) {
      expect(unitIds.has(verseId)).toBe(true);
      const area = readerAreaForVerse(verseId, GITA_COMMENTARY_TEXTS);
      expect(area.row).toBeDefined();
      const verse = Number(verseId.split('.')[1]);
      if (verse > 1) expect(unitIds.has(`4.${verse - 1}`)).toBe(true);
      if (verse < 42) expect(unitIds.has(`4.${verse + 1}`)).toBe(true);
    }
    expect(unitIds.has('5.1')).toBe(true);
  });

  it('opens commentary and provenance for transcribed verses', () => {
    const first = readerAreaForVerse('4.1', GITA_COMMENTARY_TEXTS);
    expect(first.spans.map((s) => s.id)).toContain('gita-seg-4.1-3-joint');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-4-avat');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-4.1-3-joint');
    const closer = readerAreaForVerse('4.42', GITA_COMMENTARY_TEXTS);
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-4.42-gloss');
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-4-prasasti');
  });

  it('shows locators with quotation edges where the gloss stays untranscribed', () => {
    const area = readerAreaForVerse('4.24', GITA_COMMENTARY_TEXTS);
    expect(area.row).toBeDefined();
    expect(area.hits).toHaveLength(0);
    expect(area.outgoing.map((e) => e.id).sort()).toEqual(['gita-xref-078', 'gita-xref-079']);
  });

  it('keeps canonical verse URLs stable for the chapter edges', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '4.1')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/4.1',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '4.42')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/4.42',
    );
  });

  it('ships Chapter-4 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-4.1-3-joint', 'gita-tx-4.13-gloss', 'gita-tx-4-prasasti']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
    expect(data).toHaveLength(118);
  });

  it('keeps the commentary-wide span audit clean after the Chapter-4 growth', () => {
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
