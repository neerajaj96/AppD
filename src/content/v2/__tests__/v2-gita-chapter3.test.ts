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
  auditChapter3,
  buildChapter3EvidenceMap,
  CHAPTER3_ARGUMENTS,
  CHAPTER3_UNITS,
  chapter3ExtraVerses,
  chapter3KstsForRepo,
  formatChapter3Audit,
} from '../gitaChapter3';
import {
  CHAPTER3_APPARATUS,
  CHAPTER3_CLOSING_MATTER,
  CHAPTER3_COMMENTARY_INVENTORY,
  CHAPTER3_OPENING_MATTER,
  chapter3ApparatusCounts,
  chapter3CoverageGaps,
  chapter3InventoryForKsts,
  chapter3RepoUnit,
  validateChapter3Inventory,
} from '../gitaChapter3Inventory';
import { auditCommentary } from '../commentaryAudit';
import { unitCanonicalUrl } from '../citation';

// Phase-12 Chapter-3 edition tests: mapping with the KSTS 38–42
// extras, locators, segments, passages, verification honesty,
// inventory, apparatus, xrefs, arguments and reader access. The
// transmitted gloss is only partly transcribed; the tests pin the
// boundary between the verified core and the inventoried gaps.
// Deterministic throughout.

const CHAPTER3_SPAN_IDS = [
  'gita-seg-3.1-2-joint',
  'gita-seg-3.3-gloss',
  'gita-seg-3.22-gloss',
  'gita-seg-3.48-gloss',
  'gita-ps-3-prasasti',
];

const CHAPTER3_PASSAGE_IDS = [
  'gita-tx-3.1-2-joint',
  'gita-tx-3.3-gloss',
  'gita-tx-3.22-gloss',
  'gita-tx-3.48-gloss',
  'gita-tx-3-prasasti',
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

describe('chapter-3 KSTS mapping with extras', () => {
  it('covers every Chapter-3 repository unit in the evidence map', () => {
    expect(CHAPTER3_UNITS).toEqual(Array.from({ length: 43 }, (_, i) => `3.${i + 1}`));
    const map = buildChapter3EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER3_UNITS);
  });

  it('maps the KSTS↔vulgate offset with five extras', () => {
    expect(chapter3RepoUnit(1)).toBe('3.1');
    expect(chapter3RepoUnit(37)).toBe('3.37');
    expect(chapter3RepoUnit(38)).toBeNull();
    expect(chapter3RepoUnit(42)).toBeNull();
    expect(chapter3RepoUnit(43)).toBe('3.38');
    expect(chapter3RepoUnit(48)).toBe('3.43');
    expect(chapter3ExtraVerses()).toEqual(['3.38', '3.39', '3.40', '3.41', '3.42']);
    expect(chapter3KstsForRepo('3.1')).toBe('3.1');
    expect(chapter3KstsForRepo('3.38')).toBe('3.43');
    expect(chapter3KstsForRepo('3.43')).toBe('3.48');
    expect(gitaSourceNumber('3.43')).toBe('48');
  });

  it('spans PDF pp.71–101 inside the chapter frame', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 3);
    expect(chapter).toMatchObject({ pdfStart: 71, pdfEnd: 101, printedStart: 61, printedEnd: 91, kstsFirst: 1, kstsLast: 48 });
  });
});

describe('chapter-3 spans', () => {
  it('ships the five print-demarcated Chapter-3 spans', () => {
    for (const id of CHAPTER3_SPAN_IDS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
  });

  it('gives every Chapter-3 span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const id of CHAPTER3_SPAN_IDS) {
      const span = passageSpanById(id);
      if (!span) throw new Error(`missing span ${id}`);
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(span.status).toBe('source');
      expect(span.transcription).toBeUndefined();
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      expect(span.folio).toBe((span.pdf as number) - 10);
      const chapter = GITA_CHAPTERS.find((c) => (span.pdf as number) >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
      expect(chapter?.chapter).toBe(3);
    }
  });

  it('shares the joint span across exactly KSTS 3.1–3.2', () => {
    expect(passageSpanById('gita-seg-3.1-2-joint')?.unitIds).toEqual(['3.1', '3.2']);
    expect(passageSpanById('gita-seg-3.48-gloss')?.ksts).toEqual(['3.48']);
  });
});

describe('chapter-3 passages', () => {
  it('ships the five reviewed Chapter-3 passages', () => {
    for (const id of CHAPTER3_PASSAGE_IDS) {
      expect(passageById(id)?.id).toBe(id);
    }
    expect(CHAPTER3_PASSAGE_IDS).toHaveLength(5);
  });

  it('keeps every Chapter-3 passage text-layer-reviewed with honest uncertainty', () => {
    for (const id of CHAPTER3_PASSAGE_IDS) {
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
    const unresolved = CHAPTER3_PASSAGE_IDS.filter((id) => (passageById(id)?.text || '').includes('[?]'));
    expect(unresolved.sort()).toEqual(['gita-tx-3-prasasti', 'gita-tx-3.3-gloss']);
  });

  it('preserves reviewed wording (spot checks against the text layer)', () => {
    expect(passageById('gita-tx-3.1-2-joint')?.text).toContain('मोहयसीव');
    expect(passageById('gita-tx-3.3-gloss')?.text).toContain('ज्ञानयोगेन सांख्यानां कर्मयोगेन योगिनाम्');
    expect(passageById('gita-tx-3.22-gloss')?.text).toContain('तदेकानुष्ठापुरुषविषयमेवेति');
    expect(passageById('gita-tx-3.48-gloss')?.text).toContain('तदेनमपि शत्रुमात्मैकसहायो निपातयितुमर्हसीति ओम्');
  });

  it('gives every Chapter-3 span exactly one transcribed passage', () => {
    for (const id of CHAPTER3_SPAN_IDS) {
      expect(passagesForSpan(id).map((p) => p.id)).toHaveLength(1);
    }
  });
});

describe('chapter-3 inventory', () => {
  it('covers all 48 KSTS verses with placed commentary regions', () => {
    expect(CHAPTER3_COMMENTARY_INVENTORY).toHaveLength(48);
    expect(CHAPTER3_COMMENTARY_INVENTORY.map((r) => r.ksts)).toEqual(
      Array.from({ length: 48 }, (_, i) => `3.${i + 1}`),
    );
    for (const row of CHAPTER3_COMMENTARY_INVENTORY) {
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.closePdf).toBeGreaterThanOrEqual(row.pdf);
    }
    expect(validateChapter3Inventory()).toEqual([]);
  });

  it('transcribes five KSTS verses and exposes forty-three gaps', () => {
    const gaps = chapter3CoverageGaps();
    expect(gaps).toHaveLength(43);
    expect(gaps).toContain('3.38');
    expect(gaps).toContain('3.42');
    expect(gaps).toContain('3.20');
    expect(gaps).toContain('3.47');
    expect(gaps).not.toContain('3.1');
    expect(gaps).not.toContain('3.3');
    expect(gaps).not.toContain('3.48');
  });

  it('resolves verse lookups through the inventory', () => {
    expect(chapter3InventoryForKsts('3.38')?.repoUnit).toBeNull();
    expect(chapter3InventoryForKsts('3.43')?.repoUnit).toBe('3.38');
    expect(chapter3InventoryForKsts('3.48')?.passageIds).toContain('gita-tx-3.48-gloss');
    expect(chapter3InventoryForKsts('3.99')).toBeUndefined();
  });

  it('corrects the Phase-2 misattribution without touching its quotation', () => {
    const edge = GITA_QUOTATION_EDGES.find((e) => e.id === 'gita-xref-019');
    expect(edge?.fromUnitId).toBe('3.22');
    expect(edge?.toUnitId).toBe('3.17');
    expect(edge?.quotedText).toContain('यस्त्वात्मरतिरेव');
  });

  it('frames the non-verse chapter matter without transcription gaps hidden', () => {
    expect(CHAPTER3_OPENING_MATTER.map((f) => f.id)).toEqual(['ch3-frame-open']);
    expect(CHAPTER3_CLOSING_MATTER.map((f) => f.id)).toEqual([
      'ch3-frame-prasasti',
      'ch3-frame-colophon',
    ]);
    expect(CHAPTER3_CLOSING_MATTER.find((f) => f.id === 'ch3-frame-colophon')?.status).toBe('locator-only');
  });

  it('records folio fragments only, with no variants observed', () => {
    expect(CHAPTER3_APPARATUS).toHaveLength(4);
    expect(chapter3ApparatusCounts()).toEqual({ observed: 4, mapped: 0, unresolved: 4 });
    for (const item of CHAPTER3_APPARATUS) {
      expect(item.attribution).toBe('ambiguous');
      expect(item.status).toBe('unresolved');
      expect(item.kind).toBe('folio-mark');
      expect(item.siglum).toBeNull();
      expect(item.folio).toBe(item.pdf - 10);
    }
  });
});

describe('chapter-3 evidence map and audit', () => {
  it('keeps mula locator-only and marks exactly the verified core as source-text', () => {
    const map = buildChapter3EvidenceMap();
    expect(map).toHaveLength(43);
    for (const row of map) {
      expect(row.mulaStatus).toBe('locator-only');
    }
    const withText = map.filter((r) => r.evidenceStatus === 'source-text').map((r) => r.unitId);
    expect(withText.sort()).toEqual(['3.1', '3.2', '3.22', '3.3', '3.43'].sort());
    for (const row of map) {
      if (withText.includes(row.unitId)) expect(row.verification).not.toBe('locator-only');
      else expect(row.verification).toBe('locator-only');
    }
  });

  it('reports actual Chapter-3 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter3EvidenceMap(text.concepts);
    const coverage = auditChapter3(map, text.concepts);
    expect(coverage.units).toEqual({ total: 43, withLocator: 43, withSegment: 5, withSourceText: 5 });
    expect(coverage.ksts).toEqual({ total: 48, transcribed: 5, untranscribed: 43, extras: 5 });
    expect(coverage.mula).toEqual({ verses: 43, transcribed: 0, locatorOnly: 43 });
    expect(coverage.commentary).toEqual({
      verifiedSource: 1,
      textLayerReviewed: 5,
      pageImageCollated: 0,
      locatorOnlyUnits: 38,
      unresolvedPassages: 2,
    });
    expect(coverage.inventory).toEqual({ verses: 48, transcribed: 5, untranscribed: 43 });
    expect(coverage.gaps).toHaveLength(43);
    // Pre-existing signals only: samuccaya on 3.1 is span-grounded to
    // the avataraṇikā; karmayoga on 3.3 stays locator-only. Phase 12
    // grounds nothing new.
    expect(coverage.concepts).toEqual({ sourceGrounded: 2, exactTextGrounded: 1, locatorOnly: 1 });
    expect(coverage.threads).toEqual({ steps: 1, sourceTextGrounded: 1, segmentGrounded: 0, locatorOnly: 0 });
    expect(coverage.xrefs).toEqual({ explicit: 16, quotation: 16, unresolved: 7 });
    expect(coverage.arguments).toEqual({ total: 5, sourceBacked: 5, unresolved: 0 });
    expect(coverage.apparatus).toEqual({ observed: 4, mapped: 0, unresolved: 4 });
    const rendered = formatChapter3Audit(coverage);
    for (const line of ['Chapter 3 Scholarly Audit', 'Units:', 'KSTS:', 'Mula:', 'Commentary:', 'Inventory:', 'Concepts:', 'Threads:', 'Cross-references:', 'Arguments:', 'Apparatus:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    expect(rendered).toContain('transcribed: 0');
  });
});

describe('chapter-3 xrefs', () => {
  it('ships six hosted Chapter-3 quotation edges', () => {
    for (const id of ['gita-xref-072', 'gita-xref-073', 'gita-xref-074', 'gita-xref-075', 'gita-xref-076', 'gita-xref-077']) {
      const edge = GITA_QUOTATION_EDGES.find((e) => e.id === id);
      expect(edge?.kind).toBe('commentary-quotes-unit');
      expect(edge?.fromUnitId).not.toBeNull();
      if (edge?.fromUnitId !== null) expect(gitaMapForUnit(edge.fromUnitId)).toBeDefined();
      if (edge?.toUnitId !== null) expect(gitaMapForUnit(edge.toUnitId)).toBeDefined();
    }
    expect(GITA_QUOTATION_EDGES.find((e) => e.id === 'gita-xref-074')?.toUnitId).toBe('2.49');
  });

  it('keeps every edge quotation-kind (no invented external attributions)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });
});

describe('chapter-3 arguments without a concept graph', () => {
  it('grounds every argument in exact evidence', () => {
    expect(CHAPTER3_ARGUMENTS).toHaveLength(5);
    for (const arg of CHAPTER3_ARGUMENTS) {
      expect(arg.status).toBe('source');
      expect(passageSpanById(arg.segmentId as string)).toBeDefined();
      expect(passageById(arg.passageId as string)?.spanId).toBe(arg.segmentId);
    }
  });

  it('builds no concepts or threads from Chapter 3 yet', () => {
    const ch3SpanIds = new Set(CHAPTER3_SPAN_IDS);
    const { text } = curatedGita();
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) {
          // Only the pre-existing avataraṇikā grounding may cite Chapter 3.
          if (ch3SpanIds.has(occ.spanId)) expect(occ.spanId).toBe('gita-ps-3-avat');
          else expect(ch3SpanIds.has(occ.spanId)).toBe(false);
        }
      }
    }
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        if ((step.unitIds || []).some((u) => u.startsWith('3.'))) {
          // Only the pre-existing samuccaya gateway step may touch Chapter 3.
          expect(`${thread.id}/${step.id}`).toBe('gita-rk-samuccaya-marga/gita-rk-samuccaya-2');
        }
        for (const sid of step.spanIds || []) {
          if (sid === 'gita-ps-3-avat') continue;
          expect(ch3SpanIds.has(sid)).toBe(false);
        }
      }
    }
  });
});

describe('chapter-3 reader access', () => {
  it('reaches chapter, middle verses and both closers through the reader selectors', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const verseId of ['3.1', '3.3', '3.22', '3.30', '3.43']) {
      expect(unitIds.has(verseId)).toBe(true);
      const area = readerAreaForVerse(verseId, GITA_COMMENTARY_TEXTS);
      expect(area.row).toBeDefined();
      const verse = Number(verseId.split('.')[1]);
      if (verse > 1) expect(unitIds.has(`3.${verse - 1}`)).toBe(true);
      if (verse < 43) expect(unitIds.has(`3.${verse + 1}`)).toBe(true);
    }
    expect(unitIds.has('4.1')).toBe(true);
  });

  it('opens commentary and provenance for transcribed verses', () => {
    const first = readerAreaForVerse('3.1', GITA_COMMENTARY_TEXTS);
    expect(first.spans.map((s) => s.id)).toContain('gita-seg-3.1-2-joint');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-3-avat');
    expect(first.hits.map((p) => p.id)).toContain('gita-tx-3.1-2-joint');
    const closer = readerAreaForVerse('3.43', GITA_COMMENTARY_TEXTS);
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-3.48-gloss');
    expect(closer.hits.map((p) => p.id)).toContain('gita-tx-3-prasasti');
  });

  it('shows locators with quotation edges where the gloss stays untranscribed', () => {
    const area = readerAreaForVerse('3.9', GITA_COMMENTARY_TEXTS);
    expect(area.row).toBeDefined();
    expect(area.hits).toHaveLength(0);
    expect(area.outgoing.map((e) => e.id).sort()).toEqual(['gita-xref-018', 'gita-xref-077']);
  });

  it('keeps canonical verse URLs stable for the chapter edges', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '3.1')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/3.1',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '3.43')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/3.43',
    );
  });

  it('ships Chapter-3 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-3.1-2-joint', 'gita-tx-3.3-gloss', 'gita-tx-3-prasasti']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
    expect(data).toHaveLength(114);
  });

  it('keeps the commentary-wide span audit clean after the Chapter-3 growth', () => {
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
