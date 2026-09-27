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
  auditChapter5,
  buildChapter5EvidenceMap,
  CHAPTER5_ARGUMENTS,
  CHAPTER5_UNITS,
  chapter5KstsForRepo,
  formatChapter5Audit,
} from '../gitaChapter5';
import {
  CHAPTER5_APPARATUS,
  CHAPTER5_CLOSING_MATTER,
  CHAPTER5_COMMENTARY_INVENTORY,
  CHAPTER5_OPENING_MATTER,
  chapter5ApparatusCounts,
  chapter5CoverageGaps,
  chapter5InventoryForKsts,
  chapter5RepoUnit,
  validateChapter5Inventory,
} from '../gitaChapter5Inventory';
import { auditCommentary } from '../commentaryAudit';
import { unitCanonicalUrl } from '../citation';

// Phase-14 Chapter-5 edition tests: offset mapping with the transposed
// 5.19, locators, segments, passages, verification honesty, inventory,
// apparatus, xrefs, arguments and reader access. The transmitted gloss
// is only partly transcribed; the tests pin the boundary between the
// verified core and the inventoried gaps. Deterministic throughout.

const CHAPTER5_SPAN_IDS = [
  'gita-ps-5-avat',
  'gita-seg-5.1-gloss',
  'gita-seg-5.2-gloss',
  'gita-seg-5.28-gloss',
  'gita-ps-5-prasasti',
];

const CHAPTER5_PASSAGE_IDS = [
  'gita-tx-5-avat',
  'gita-tx-5.1-gloss',
  'gita-tx-5.2-gloss',
  'gita-tx-5.28-gloss',
  'gita-tx-5-prasasti',
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

describe('chapter-5 KSTS mapping with the transposed 5.19', () => {
  it('covers every Chapter-5 repository unit in the evidence map', () => {
    expect(CHAPTER5_UNITS).toEqual(Array.from({ length: 29 }, (_, i) => `5.${i + 1}`));
    const map = buildChapter5EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER5_UNITS);
  });

  it('maps the KSTS↔vulgate offset past the absent 5.19', () => {
    expect(chapter5RepoUnit(1)).toBe('5.1');
    expect(chapter5RepoUnit(18)).toBe('5.18');
    expect(chapter5RepoUnit(19)).toBe('5.20');
    expect(chapter5RepoUnit(28)).toBe('5.29');
    expect(chapter5KstsForRepo('5.18')).toBe('5.18');
    expect(chapter5KstsForRepo('5.20')).toBe('5.19');
    expect(chapter5KstsForRepo('5.29')).toBe('5.28');
    // Vulgate 5.19 has no KSTS counterpart inside this chapter: its
    // text stands transposed as KSTS 6.10 (handled by Chapter 6).
    expect(chapter5KstsForRepo('5.19')).toBeNull();
    expect(gitaMapForUnit('5.19')).toMatchObject({ status: 'transposed' });
  });

  it('spans PDF pp.126–144 inside the chapter frame', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 5);
    expect(chapter).toMatchObject({ pdfStart: 126, pdfEnd: 144, printedStart: 116, printedEnd: 134, kstsFirst: 1, kstsLast: 28 });
  });
});

describe('chapter-5 spans', () => {
  it('ships the five print-demarcated Chapter-5 spans', () => {
    for (const id of CHAPTER5_SPAN_IDS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
  });

  it('gives every Chapter-5 span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const id of CHAPTER5_SPAN_IDS) {
      const span = passageSpanById(id);
      if (!span) throw new Error(`missing span ${id}`);
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(span.status).toBe('source');
      expect(span.transcription).toBeUndefined();
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      expect(span.folio).toBe((span.pdf as number) - 10);
      const chapter = GITA_CHAPTERS.find((c) => (span.pdf as number) >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
      expect(chapter?.chapter).toBe(5);
    }
  });

  it('places the closing spans on repo 5.29 (KSTS 5.28)', () => {
    expect(passageSpanById('gita-seg-5.28-gloss')?.unitIds).toEqual(['5.29']);
    expect(passageSpanById('gita-seg-5.28-gloss')?.ksts).toEqual(['5.28']);
    expect(passageSpanById('gita-ps-5-prasasti')?.unitIds).toEqual(['5.29']);
  });
});

describe('chapter-5 passages', () => {
  it('ships the five reviewed Chapter-5 passages', () => {
    for (const id of CHAPTER5_PASSAGE_IDS) {
      expect(passageById(id)?.id).toBe(id);
    }
    expect(CHAPTER5_PASSAGE_IDS).toHaveLength(5);
  });

  it('keeps every Chapter-5 passage text-layer-reviewed with honest uncertainty', () => {
    for (const id of CHAPTER5_PASSAGE_IDS) {
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

  it('marks exactly one passage unresolved, never silently', () => {
    const unresolved = CHAPTER5_PASSAGE_IDS.filter((id) => (passageById(id)?.text || '').includes('[?]'));
    expect(unresolved).toEqual(['gita-tx-5.2-gloss']);
  });

  it('preserves reviewed wording (spot checks against the text layer)', () => {
    expect(passageById('gita-tx-5-avat')?.text).toContain('पुनरुत्पन्नसंशयोऽर्जुन उवाच');
    expect(passageById('gita-tx-5.1-gloss')?.text).toContain('उक्तयोर्योगपद्येन');
    expect(passageById('gita-tx-5.2-gloss')?.text).toContain('उक्तवक्ष्यमाणहेतुपर्यालोचनया प्रकृष्यते');
    expect(passageById('gita-tx-5.28-gloss')?.text).toContain('मुक्तिमाप्नोतीति');
  });

  it('gives every Chapter-5 span exactly one transcribed passage', () => {
    for (const id of CHAPTER5_SPAN_IDS) {
      expect(passagesForSpan(id).map((p) => p.id)).toHaveLength(1);
    }
  });
});

describe('chapter-5 inventory', () => {
  it('covers all 28 KSTS verses with placed commentary regions', () => {
    expect(CHAPTER5_COMMENTARY_INVENTORY).toHaveLength(28);
    expect(CHAPTER5_COMMENTARY_INVENTORY.map((r) => r.ksts)).toEqual(
      Array.from({ length: 28 }, (_, i) => `5.${i + 1}`),
    );
    for (const row of CHAPTER5_COMMENTARY_INVENTORY) {
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.closePdf).toBeGreaterThanOrEqual(row.pdf);
    }
    expect(validateChapter5Inventory()).toEqual([]);
  });

  it('transcribes four KSTS verses and exposes twenty-four gaps', () => {
    const gaps = chapter5CoverageGaps();
    expect(gaps).toHaveLength(24);
    expect(gaps).toContain('5.10');
    expect(gaps).toContain('5.19');
    expect(gaps).toContain('5.27');
    expect(gaps).not.toContain('5.1');
    expect(gaps).not.toContain('5.3');
    expect(gaps).not.toContain('5.28');
  });

  it('resolves verse lookups through the inventory', () => {
    expect(chapter5InventoryForKsts('5.3')?.passageIds).toEqual(['gita-tx-5.3-sent']);
    expect(chapter5InventoryForKsts('5.28')?.repoUnit).toBe('5.29');
    expect(chapter5InventoryForKsts('5.28')?.passageIds).toContain('gita-tx-5-prasasti');
    expect(chapter5InventoryForKsts('5.99')).toBeUndefined();
  });

  it('frames the non-verse chapter matter without transcription gaps hidden', () => {
    expect(CHAPTER5_OPENING_MATTER.map((f) => f.id)).toEqual(['ch5-frame-open']);
    expect(CHAPTER5_CLOSING_MATTER.map((f) => f.id)).toEqual([
      'ch5-frame-prasasti',
      'ch5-frame-colophon',
    ]);
    expect(CHAPTER5_CLOSING_MATTER.find((f) => f.id === 'ch5-frame-colophon')?.status).toBe('locator-only');
  });

  it('records folio fragments only, with no variants observed', () => {
    expect(CHAPTER5_APPARATUS).toHaveLength(2);
    expect(chapter5ApparatusCounts()).toEqual({ observed: 2, mapped: 0, unresolved: 2 });
    for (const item of CHAPTER5_APPARATUS) {
      expect(item.attribution).toBe('ambiguous');
      expect(item.status).toBe('unresolved');
      expect(item.kind).toBe('folio-mark');
      expect(item.siglum).toBeNull();
      expect(item.folio).toBe(item.pdf - 10);
    }
  });
});

describe('chapter-5 evidence map and audit', () => {
  it('keeps mula locator-only and marks exactly the verified core as source-text', () => {
    const map = buildChapter5EvidenceMap();
    expect(map).toHaveLength(29);
    for (const row of map) {
      expect(row.mulaStatus).toBe('locator-only');
    }
    const withText = map.filter((r) => r.evidenceStatus === 'source-text').map((r) => r.unitId);
    expect(withText.sort()).toEqual(['5.1', '5.2', '5.29', '5.3'].sort());
    for (const row of map) {
      if (withText.includes(row.unitId)) expect(row.verification).not.toBe('locator-only');
      else expect(row.verification).toBe('locator-only');
    }
  });

  it('reports actual Chapter-5 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter5EvidenceMap(text.concepts);
    const coverage = auditChapter5(map, text.concepts);
    expect(coverage.units).toEqual({ total: 29, withLocator: 29, withSegment: 3, withSourceText: 4 });
    expect(coverage.ksts).toEqual({ total: 28, transcribed: 4, untranscribed: 24, extras: 0 });
    expect(coverage.mula).toEqual({ verses: 29, transcribed: 0, locatorOnly: 29 });
    expect(coverage.commentary).toEqual({
      verifiedSource: 1,
      textLayerReviewed: 5,
      pageImageCollated: 0,
      locatorOnlyUnits: 25,
      unresolvedPassages: 1,
    });
    expect(coverage.inventory).toEqual({ verses: 28, transcribed: 4, untranscribed: 24 });
    expect(coverage.gaps).toHaveLength(24);
    // Pre-existing signals only: karma on 5.1 stays locator-only while
    // the samuccaya-practitioner occurrence on 5.3 is met by the
    // spanless 5.3 sentence. Phase 14 grounds nothing new.
    expect(coverage.concepts).toEqual({ sourceGrounded: 2, exactTextGrounded: 1, locatorOnly: 1 });
    expect(coverage.threads).toEqual({ steps: 1, sourceTextGrounded: 1, segmentGrounded: 0, locatorOnly: 0 });
    expect(coverage.xrefs).toEqual({ explicit: 2, quotation: 2, unresolved: 3 });
    expect(coverage.arguments).toEqual({ total: 4, sourceBacked: 4, unresolved: 0 });
    expect(coverage.apparatus).toEqual({ observed: 2, mapped: 0, unresolved: 2 });
    const rendered = formatChapter5Audit(coverage);
    for (const line of ['Chapter 5 Scholarly Audit', 'Units:', 'KSTS:', 'Mula:', 'Commentary:', 'Inventory:', 'Concepts:', 'Threads:', 'Cross-references:', 'Arguments:', 'Apparatus:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    expect(rendered).toContain('transcribed: 0');
  });
});

describe('chapter-5 xrefs', () => {
  it('ships two null-host Chapter-5 avataraṇikā edges', () => {
    for (const id of ['gita-xref-081', 'gita-xref-082']) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge?.kind).toBe('commentary-quotes-unit');
      expect(edge?.fromUnitId).toBeNull();
      if (edge?.toUnitId !== null) expect(gitaMapForUnit(edge.toUnitId)).toBeDefined();
    }
    expect(GITA_QUOTATION_EDGES.find((e) => e.id === 'gita-xref-082')?.toUnitId).toBe('4.41');
  });

  it('keeps every edge quotation-kind (no invented external attributions)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });
});

describe('chapter-5 arguments without a concept graph', () => {
  it('grounds every argument in exact evidence', () => {
    expect(CHAPTER5_ARGUMENTS).toHaveLength(4);
    for (const arg of CHAPTER5_ARGUMENTS) {
      expect(arg.status).toBe('source');
      expect(passageSpanById(arg.segmentId as string)).toBeDefined();
      expect(passageById(arg.passageId as string)?.spanId).toBe(arg.segmentId);
    }
  });

  it('builds no concepts or threads from Chapter 5 yet', () => {
    const ch5SpanIds = new Set(CHAPTER5_SPAN_IDS);
    const { text } = curatedGita();
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) expect(ch5SpanIds.has(occ.spanId)).toBe(false);
      }
    }
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        if ((step.unitIds || []).some((u) => u.startsWith('5.'))) {
          // Only the pre-existing samuccaya practitioner step may touch Chapter 5.
          expect(`${thread.id}/${step.id}`).toBe('gita-rk-samuccaya-marga/gita-rk-samuccaya-4');
        }
        for (const sid of step.spanIds || []) expect(ch5SpanIds.has(sid)).toBe(false);
      }
    }
  });
});

describe('chapter-5 reader access', () => {
  it('reaches chapter, middle verses and both closers through the reader selectors', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const verseId of ['5.1', '5.3', '5.14', '5.19', '5.29']) {
      expect(unitIds.has(verseId)).toBe(true);
      const area = readerAreaForVerse(verseId, GITA_COMMENTARY_TEXTS);
      expect(area.row).toBeDefined();
      const verse = Number(verseId.split('.')[1]);
      if (verse > 1) expect(unitIds.has(`5.${verse - 1}`)).toBe(true);
      if (verse < 29) expect(unitIds.has(`5.${verse + 1}`)).toBe(true);
    }
    expect(unitIds.has('6.1')).toBe(true);
  });

  it('opens commentary and provenance for transcribed verses', () => {
    const first = readerAreaForVerse('5.1', GITA_COMMENTARY_TEXTS);
    expect(first.spans.map((s) => s.id)).toContain('gita-seg-5.1-gloss');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-5-avat');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-5.1-gloss');
    const sentArea = readerAreaForVerse('5.3', GITA_COMMENTARY_TEXTS);
    expect(sentArea.hits.map((p) => p.id)).toEqual(['gita-tx-5.3-sent']);
    expect(sentArea.spans).toHaveLength(0);
    const closer = readerAreaForVerse('5.29', GITA_COMMENTARY_TEXTS);
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-5.28-gloss');
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-5-prasasti');
  });

  it('shows locators with quotation edges where the gloss stays untranscribed', () => {
    const area = readerAreaForVerse('5.2', GITA_COMMENTARY_TEXTS);
    expect(area.row).toBeDefined();
    expect(area.hits.length).toBeGreaterThan(0);
    expect(area.outgoing.map((e) => e.id)).toEqual(['gita-xref-023']);
  });

  it('keeps canonical verse URLs stable for the chapter edges', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '5.1')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/5.1',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '5.29')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/5.29',
    );
  });

  it('ships Chapter-5 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-5-avat', 'gita-tx-5.2-gloss', 'gita-tx-5-prasasti']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
    expect(data).toHaveLength(123);
  });

  it('keeps the commentary-wide span audit clean after the Chapter-5 growth', () => {
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
