import * as fs from 'node:fs';
import * as path from 'node:path';
import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import { GITA_UNIT_MAP, gitaMapForUnit, gitaSourceNumber } from '../gitaPageMap';
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
  auditChapter1,
  buildChapter1EvidenceMap,
  CHAPTER1_ARGUMENTS,
  CHAPTER1_UNITS,
  chapter1UnitMap,
  chapter1UpodghataEdges,
  formatChapter1Audit,
  LEGACY_UPODGHATA_EDGE_IDS,
} from '../gitaChapter1';
import {
  CHAPTER1_APPARATUS,
  CHAPTER1_CLOSING_MATTER,
  CHAPTER1_COMMENTARY_INVENTORY,
  CHAPTER1_OPENING_MATTER,
  chapter1ApparatusCounts,
  chapter1CoverageGaps,
  chapter1InventoryForVerse,
  validateChapter1Inventory,
} from '../gitaChapter1Inventory';
import { auditCommentary } from '../commentaryAudit';
import { unitCanonicalUrl } from '../citation';

// Phase-10 Chapter-1 tātparya-edition tests: mapping, locators, segments,
// passages, verification honesty, inventory, apparatus, xrefs, arguments,
// reader access and the no-concept-graph proof. Deterministic throughout.

const CHAPTER1_SPAN_IDS = [
  'gita-ps-1-upodghata-open',
  'gita-ps-1-upodghata-close',
  'gita-ps-1-upakrama',
  'gita-seg-1.1-prasna',
  'gita-seg-1.2-19-sainya',
  'gita-seg-1.20-23-nirupana',
  'gita-seg-1.24-25-sphuta',
  'gita-seg-1.26-28-darsana',
  'gita-seg-1.29-46-mithyajnana',
  'gita-seg-1.47-gatartha',
  'gita-ps-1-upasamhara',
  'gita-ps-1-prasasti',
];

const CHAPTER1_PASSAGE_IDS = [
  'gita-tx-1-upodghata-open',
  'gita-tx-1-upodghata-close',
  'gita-tx-1-upakrama',
  'gita-tx-1.1-prasna',
  'gita-tx-1.2-19-sainya',
  'gita-tx-1.20-23-nirupana',
  'gita-tx-1.24-25-sphuta',
  'gita-tx-1.26-28-darsana',
  'gita-tx-1.29-46-mithyajnana',
  'gita-tx-1.47-gatartha',
  'gita-tx-1-upasamhara',
  'gita-tx-1-prasasti',
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

describe('chapter-1 KSTS mapping', () => {
  it('covers every Chapter-1 unit in the authoritative map', () => {
    expect(CHAPTER1_UNITS).toEqual(Array.from({ length: 47 }, (_, i) => `1.${i + 1}`));
    const map = buildChapter1EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER1_UNITS);
  });

  it('keeps Chapter 1 fully aligned (KSTS == vulgate, no offset)', () => {
    for (let v = 1; v <= 47; v += 1) {
      const row = GITA_UNIT_MAP[`1.${v}`];
      expect(row.ksts).toEqual([`1.${v}`]);
      expect(row.status).toBe('aligned');
      expect(gitaSourceNumber(`1.${v}`)).toBe(String(v));
      expect(row.folio).toBe((row.pdf as number) - 10);
    }
  });

  it('spans PDF pp.11–26 inside the chapter frame', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 1);
    expect(chapter).toMatchObject({ pdfStart: 11, pdfEnd: 26, printedStart: 1, printedEnd: 16, kstsFirst: 1, kstsLast: 47 });
    expect(Object.keys(chapter1UnitMap())).toHaveLength(47);
  });
});

describe('chapter-1 spans', () => {
  it('ships the twelve print-demarcated Chapter-1 spans', () => {
    for (const id of CHAPTER1_SPAN_IDS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
  });

  it('gives every Chapter-1 span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const id of CHAPTER1_SPAN_IDS) {
      const span = passageSpanById(id);
      if (!span) throw new Error(`missing span ${id}`);
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(span.status).toBe('source');
      expect(span.transcription).toBeUndefined();
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      expect(span.folio).toBe((span.pdf as number) - 10);
      const chapter = GITA_CHAPTERS.find((c) => (span.pdf as number) >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
      expect(chapter?.chapter).toBe(1);
    }
  });

  it('shares group spans across exactly their verse groups', () => {
    expect(passageSpanById('gita-seg-1.2-19-sainya')?.unitIds).toHaveLength(18);
    expect(passageSpanById('gita-seg-1.29-46-mithyajnana')?.unitIds).toHaveLength(18);
    expect(passageSpanById('gita-seg-1.1-prasna')?.unitIds).toEqual(['1.1']);
    expect(passageSpanById('gita-seg-1.47-gatartha')?.unitIds).toEqual(['1.47']);
  });
});

describe('chapter-1 passages', () => {
  it('ships the eleven reviewed Chapter-1 passages', () => {
    for (const id of CHAPTER1_PASSAGE_IDS) {
      expect(passageById(id)?.id).toBe(id);
    }
    expect(CHAPTER1_PASSAGE_IDS).toHaveLength(12);
  });

  it('keeps every Chapter-1 passage text-layer-reviewed with honest uncertainty', () => {
    for (const id of CHAPTER1_PASSAGE_IDS) {
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
    const unresolved = CHAPTER1_PASSAGE_IDS.filter((id) => (passageById(id)?.text || '').includes('[?]'));
    expect(unresolved.sort()).toEqual([
      'gita-tx-1-prasasti',
      'gita-tx-1.26-28-darsana',
      'gita-tx-1.29-46-mithyajnana',
    ]);
  });

  it('preserves reviewed wording (spot checks against the text layer)', () => {
    expect(passageById('gita-tx-1-upakrama')?.text).toContain('कर्मणां परित्यागानुपपत्तेः');
    expect(passageById('gita-tx-1.47-gatartha')?.text).toContain('तात्पर्यतः प्रथमोऽध्यायो व्याख्यातः');
    expect(passageById('gita-tx-1-upasamhara')?.text).toContain('हेत्वर्जुनविषादप्रतिपादनार्थः समाप्तः');
    expect(passageById('gita-tx-1.1-prasna')?.text).toContain('धृतराष्ट्रप्रश्नचोदितसंजयवाक्यानि');
  });

  it('gives every Chapter-1 span exactly one transcribed passage', () => {
    for (const id of CHAPTER1_SPAN_IDS) {
      expect(passagesForSpan(id).map((p) => p.id)).toHaveLength(1);
    }
  });
});

describe('chapter-1 inventory', () => {
  it('covers all 47 KSTS verses with source-grounded regions', () => {
    expect(CHAPTER1_COMMENTARY_INVENTORY).toHaveLength(47);
    expect(CHAPTER1_COMMENTARY_INVENTORY.map((r) => r.ksts)).toEqual(
      Array.from({ length: 47 }, (_, i) => `1.${i + 1}`),
    );
    for (const row of CHAPTER1_COMMENTARY_INVENTORY) {
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.spanIds.length).toBeGreaterThan(0);
      expect(row.passageIds.length).toBeGreaterThan(0);
    }
    expect(validateChapter1Inventory()).toEqual([]);
    expect(chapter1CoverageGaps()).toEqual([]);
  });

  it('resolves verse lookups through the inventory', () => {
    expect(chapter1InventoryForVerse('1.10')?.passageIds).toEqual(['gita-tx-1.2-19-sainya']);
    expect(chapter1InventoryForVerse('1.46')?.passageIds).toEqual(['gita-tx-1.29-46-mithyajnana']);
    expect(chapter1InventoryForVerse('1.47')?.passageIds).toContain('gita-tx-1-upasamhara');
    expect(chapter1InventoryForVerse('1.99')).toBeUndefined();
  });

  it('frames the non-verse chapter matter without transcription gaps hidden', () => {
    expect(CHAPTER1_OPENING_MATTER.map((f) => f.id)).toEqual([
      'ch1-frame-title',
      'ch1-frame-mangala',
      'ch1-frame-upodghata',
    ]);
    expect(CHAPTER1_CLOSING_MATTER.map((f) => f.id)).toEqual([
      'ch1-frame-upasamhara',
      'ch1-frame-prasasti',
      'ch1-frame-colophon',
    ]);
    const mangala = CHAPTER1_OPENING_MATTER.find((f) => f.id === 'ch1-frame-mangala');
    expect(mangala?.status).toBe('locator-only');
    expect(mangala?.passageIds).toEqual([]);
  });

  it('keeps every apparatus item ambiguous and unresolved', () => {
    expect(CHAPTER1_APPARATUS).toHaveLength(5);
    expect(chapter1ApparatusCounts()).toEqual({ observed: 5, mapped: 0, unresolved: 5 });
    for (const item of CHAPTER1_APPARATUS) {
      expect(item.attribution).toBe('ambiguous');
      expect(item.status).toBe('unresolved');
      expect(item.folio).toBe(item.pdf - 10);
    }
    expect(CHAPTER1_APPARATUS.find((i) => i.id === 'gita-app-1-11-1')?.raw).toContain('स्वरूपं सर्वेशमिति पाठः');
  });
});

describe('chapter-1 evidence map and audit', () => {
  it('keeps every verse at source-text with locator-only mula', () => {
    const map = buildChapter1EvidenceMap();
    expect(map).toHaveLength(47);
    for (const row of map) {
      expect(row.evidenceStatus).toBe('source-text');
      expect(row.verification).toBe('text-layer-reviewed');
      expect(row.mulaStatus).toBe('locator-only');
      expect(row.segmentIds.length).toBeGreaterThan(0);
      expect(row.passageIds.length).toBeGreaterThan(0);
    }
  });

  it('attaches frame matter only to the chapter-entry units', () => {
    const map = buildChapter1EvidenceMap();
    const first = map.find((r) => r.unitId === '1.1');
    expect(first?.passageIds).toEqual([
      'gita-tx-1-upodghata-open',
      'gita-tx-1-upodghata-close',
      'gita-tx-1-upakrama',
      'gita-tx-1.1-prasna',
    ]);
    const last = map.find((r) => r.unitId === '1.47');
    expect(last?.passageIds).toEqual([
      'gita-tx-1.47-gatartha',
      'gita-tx-1-upasamhara',
      'gita-tx-1-prasasti',
    ]);
    const middle = map.find((r) => r.unitId === '1.10');
    expect(middle?.passageIds).toEqual(['gita-tx-1.2-19-sainya']);
  });

  it('reports actual Chapter-1 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter1EvidenceMap(text.concepts);
    const coverage = auditChapter1(map, text.concepts);
    expect(coverage.units).toEqual({ total: 47, withLocator: 47, withSegment: 47, withSourceText: 47 });
    expect(coverage.mula).toEqual({ verses: 47, transcribed: 0, locatorOnly: 47 });
    expect(coverage.commentary).toEqual({
      verifiedSource: 0,
      textLayerReviewed: 12,
      pageImageCollated: 0,
      locatorOnlyUnits: 0,
      unresolvedPassages: 3,
    });
    expect(coverage.inventory).toEqual({ verses: 47, transcribed: 47, untranscribed: 0 });
    expect(coverage.gaps).toEqual([]);
    expect(coverage.concepts).toEqual({ sourceGrounded: 1, exactTextGrounded: 0, locatorOnly: 1 });
    expect(coverage.threads).toEqual({ steps: 0, sourceTextGrounded: 0, segmentGrounded: 0, locatorOnly: 0 });
    expect(coverage.xrefs).toEqual({ explicit: 10, quotation: 10, legacyUpodghata: 15, unresolved: 8 });
    expect(coverage.arguments).toEqual({ total: 9, sourceBacked: 9, unresolved: 0 });
    expect(coverage.apparatus).toEqual({ observed: 5, mapped: 0, unresolved: 5 });
    const rendered = formatChapter1Audit(coverage);
    for (const line of ['Chapter 1 Scholarly Audit', 'Units:', 'Mula:', 'Commentary:', 'Inventory:', 'Concepts:', 'Threads:', 'Cross-references:', 'Arguments:', 'Apparatus:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    expect(rendered).toContain('transcribed: 0');
  });
});

describe('chapter-1 xrefs', () => {
  it('pins the fifteen legacy upodghata edges without attaching them to verses', () => {
    expect(LEGACY_UPODGHATA_EDGE_IDS).toHaveLength(15);
    for (const id of LEGACY_UPODGHATA_EDGE_IDS) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge).toBeDefined();
      expect(edge?.fromUnitId).toBeNull();
      expect(edge?.kind).toBe('commentary-quotes-unit');
      expect((edge?.quotedText || '').trim().length).toBeGreaterThan(0);
    }
  });

  it('ships nine new Chapter-1 upodghata edges with null hosts', () => {
    expect(chapter1UpodghataEdges().sort()).toEqual([
      'gita-xref-059',
      'gita-xref-060',
      'gita-xref-061',
      'gita-xref-062',
      'gita-xref-063',
      'gita-xref-064',
      'gita-xref-065',
      'gita-xref-066',
      'gita-xref-067',
    ]);
    for (const id of chapter1UpodghataEdges()) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge?.fromUnitId).toBeNull();
      expect(edge?.kind).toBe('commentary-quotes-unit');
      if (edge?.toUnitId !== null) expect(gitaMapForUnit(edge?.toUnitId as string)).toBeDefined();
    }
  });

  it('keeps every edge quotation-kind (no invented external attributions)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });
});

describe('chapter-1 arguments without a concept graph', () => {
  it('grounds every argument in exact evidence', () => {
    expect(CHAPTER1_ARGUMENTS).toHaveLength(9);
    for (const arg of CHAPTER1_ARGUMENTS) {
      expect(arg.status).toBe('source');
      const segment = passageSpanById(arg.segmentId as string);
      expect(segment).toBeDefined();
      expect(passageById(arg.passageId as string)?.spanId).toBe(arg.segmentId);
      for (const u of arg.unitIds) expect(CHAPTER1_UNITS).toContain(u);
    }
  });

  it('builds no concepts or threads from Chapter 1 yet (one pre-existing pilot signal stays locator-only)', () => {
    const { text } = curatedGita();
    // The single pre-existing 1.x occurrence is a pilot concept pointing
    // at the upodghāta (folio 2, no span); Phase 10 grounds nothing new.
    // Exact-span evidence (gita-ps-1-upodghata-open, same folio) is now
    // available for a future phase — recorded here, not asserted.
    const ch1SpanIds = new Set(CHAPTER1_SPAN_IDS);
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) expect(ch1SpanIds.has(occ.spanId)).toBe(false);
      }
    }
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        expect((step.unitIds || []).some((u) => u.startsWith('1.'))).toBe(false);
        for (const sid of step.spanIds || []) expect(ch1SpanIds.has(sid)).toBe(false);
      }
    }
  });
});

describe('chapter-1 reader access', () => {
  it('reaches chapter, middle verses and both closers through the reader selectors', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const verseId of ['1.1', '1.20', '1.29', '1.46', '1.47']) {
      expect(unitIds.has(verseId)).toBe(true);
      const area = readerAreaForVerse(verseId, GITA_COMMENTARY_TEXTS);
      expect(area.row).toBeDefined();
      expect(area.spans.length).toBeGreaterThan(0);
      expect(area.hits.length).toBeGreaterThan(0);
      // Previous/next navigation stays inside the curated corpus.
      const verse = Number(verseId.split('.')[1]);
      if (verse > 1) expect(unitIds.has(`1.${verse - 1}`)).toBe(true);
      if (verse < 47) expect(unitIds.has(`1.${verse + 1}`)).toBe(true);
    }
    expect(unitIds.has('2.1')).toBe(true);
  });

  it('opens commentary and provenance for a substantial middle verse', () => {
    const area = readerAreaForVerse('1.10', GITA_COMMENTARY_TEXTS);
    expect(area.spans.map((s) => s.id)).toEqual(['gita-seg-1.2-19-sainya']);
    expect(area.hits.map((p) => p.id)).toEqual(['gita-tx-1.2-19-sainya']);
    expect(area.hits[0].folio).toBe(16);
  });

  it('keeps canonical verse URLs stable for the chapter edges', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '1.1')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/1.1',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '1.47')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/1.47',
    );
  });

  it('ships Chapter-1 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-1-upakrama', 'gita-tx-1.29-46-mithyajnana', 'gita-tx-1-prasasti']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
    expect(data).toHaveLength(123);
  });

  it('keeps the commentary-wide span audit clean after the Chapter-1 growth', () => {
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
