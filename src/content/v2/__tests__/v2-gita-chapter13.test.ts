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
  KSTS_SOURCE_ID,
  isSourceTranscription,
  passageById,
  validatePassages,
} from '../gitaCommentaryText';
import { GITA_SCHOLARLY_THREADS } from '../gitaThreads';
import { GITA_QUOTATION_EDGES } from '../gitaXrefs';
import { parseGitaVerseRef } from '../gitaDocument';
import {
  CHAPTER13_ARGUMENTS,
  CHAPTER13_UNITS,
  auditChapter13,
  buildChapter13EvidenceMap,
  formatChapter13Audit,
} from '../gitaChapter13';
import { auditCommentary } from '../commentaryAudit';
import { formatCitation, threadStepUrl, unitCanonicalUrl } from '../citation';
import { buildSearchIndex } from '../search-index';
import { rankEntries } from '../../../search/rank';
import { resolveThreadPosition } from '../../../utils/threadNav';
import { uiStrings, type UIKey } from '../../../i18n/ui';

// Phase-7 Chapter-13 reference-edition tests: mapping, locators,
// segments, passages, verification honesty, concepts, threads, xrefs,
// quotations, variants, citations, lazy loading, search, parity and the
// corrected-architecture regressions. Deterministic throughout.

function curatedGita() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
  if (!text) throw new Error('no gita text');
  return { corpus, text };
}

describe('chapter-13 KSTS mapping', () => {
  it('covers every Chapter-13 unit in the authoritative map', () => {
    expect(CHAPTER13_UNITS).toEqual(Array.from({ length: 35 }, (_, i) => `13.${i + 1}`));
    const map = buildChapter13EvidenceMap();
    expect(map.map((r) => r.unitId)).toEqual(CHAPTER13_UNITS);
  });

  it('leaves 13.1 vulgate-only and shifts 13.2–13.35 exactly one below', () => {
    expect(GITA_UNIT_MAP['13.1']).toMatchObject({ ksts: [], status: 'vulgate-only' });
    expect(gitaSourceNumber('13.1')).toBeUndefined();
    for (let v = 2; v <= 35; v += 1) {
      const row = GITA_UNIT_MAP[`13.${v}`];
      expect(row.ksts).toEqual([`13.${v - 1}`]);
      expect(row.status).toBe('offset');
      expect(gitaSourceNumber(`13.${v}`)).toBe(String(v - 1));
    }
    expect(gitaSourceNumber('13.35')).toBe('34');
  });

  it('keeps 13.1 correctly classified (no Kashmir-only inversion)', () => {
    const row = GITA_UNIT_MAP['13.1'];
    expect(row.note || '').not.toMatch(/kashmir-only/i);
    expect(row.note || '').not.toMatch(/kashmir.{0,20}extra/i);
    expect(`${row.status} ${row.note || ''}`).toMatch(/vulgate-only|absent/i);
  });

  it('keeps legacy IDs and URLs stable', () => {
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '13.3')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/13.3',
    );
    expect(threadStepUrl('https://x.test/', 'vedanta', 'gita-rk-kshetra', 1)).toBe(
      'https://x.test/#/system/vedanta/thread?thread=gita-rk-kshetra&step=2',
    );
    expect(resolveThreadPosition(
      [{ id: 't0', steps: new Array(3).fill(0) }, { id: 'gita-rk-kshetra', steps: new Array(5).fill(0) }],
      'gita-rk-kshetra',
      '3',
    )).toEqual({ threadIndex: 1, stepIndex: 2 });
  });
});

describe('chapter-13 locator consistency', () => {
  it('keeps folio ten below pdf inside the Chapter-13 span', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 13);
    if (!chapter) throw new Error('no ch13');
    for (const unitId of CHAPTER13_UNITS) {
      const row = gitaMapForUnit(unitId);
      if (row?.pdf === undefined) {
        expect(row?.folio).toBeUndefined();
        continue;
      }
      expect(row.folio).toBe(row.pdf - 10);
      expect(row.pdf).toBeGreaterThanOrEqual(chapter.pdfStart);
      expect(row.pdf).toBeLessThanOrEqual(chapter.pdfEnd);
    }
  });

  it('gives every Chapter-13 span parseable KSTS refs and chapter-consistent locators', () => {
    const chapter = GITA_CHAPTERS.find((c) => c.chapter === 13);
    for (const span of GITA_PASSAGE_SPANS.filter((s) => s.unitIds.some((u) => u.startsWith('13.')))) {
      expect(span.unitIds.length).toBeGreaterThan(0);
      for (const ref of span.ksts) expect(parseGitaVerseRef(ref)).not.toBeNull();
      if (span.pdf !== undefined && span.folio !== undefined) {
        expect(span.folio).toBe(span.pdf - 10);
      }
      if (span.pdf !== undefined && chapter) {
        expect(span.pdf).toBeGreaterThanOrEqual(chapter.pdfStart - 1);
        expect(span.pdf).toBeLessThanOrEqual(chapter.pdfEnd + 1);
      }
    }
  });
});

describe('chapter-13 segment to unit consistency', () => {
  it('points every Chapter-13 span unit at a real canonical unit', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const span of GITA_PASSAGE_SPANS.filter((s) => s.unitIds.some((u) => u.startsWith('13.')))) {
      for (const uid of span.unitIds) expect(unitIds.has(uid)).toBe(true);
      expect(passageSpanById(span.id)?.id).toBe(span.id);
    }
  });

  it('carries no transcription on spans (no-fabrication proof)', () => {
    for (const span of GITA_PASSAGE_SPANS) {
      expect(span.transcription).toBeUndefined();
    }
  });
});

describe('chapter-13 commentary to source consistency', () => {
  it('anchors every Chapter-13 passage to units, folio and the KSTS record', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    const ch13 = GITA_COMMENTARY_TEXTS.filter((p) => p.unitIds.some((u) => u.startsWith('13.')));
    expect(ch13.length).toBe(14);
    for (const p of ch13) {
      for (const uid of p.unitIds) expect(unitIds.has(uid)).toBe(true);
      expect(p.folio).toBe(p.pdf - 10);
      expect(p.sourceId).toBe(KSTS_SOURCE_ID);
      if (p.spanId !== undefined) {
        expect(passageSpanById(p.spanId)).toBeDefined();
      }
      for (const ref of p.ksts || []) expect(parseGitaVerseRef(ref)).not.toBeNull();
    }
  });

  it('duplicates no source passages', () => {
    const ids = GITA_COMMENTARY_TEXTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const texts = GITA_COMMENTARY_TEXTS.map((p) => p.text);
    expect(new Set(texts).size).toBe(texts.length);
    expect(validatePassages(GITA_COMMENTARY_TEXTS)).toEqual([]);
  });

  it('fabricates no transcription', () => {
    for (const p of GITA_COMMENTARY_TEXTS) {
      expect(isSourceTranscription(p.text)).toBe(true);
      expect(p.text).not.toMatch(/[a-zA-Z]/);
    }
    expect(JSON.stringify(GITA_COMMENTARY_TEXTS)).not.toMatch(/normali[sz]ed/i);
    const resolution = passageById('gita-tx-13.2-resolution');
    expect(resolution?.text).toContain('[?]');
    expect(resolution?.note?.trim().length).toBeGreaterThan(0);
  });

  it('keeps verification states honest (never collated without collation)', () => {
    for (const p of GITA_COMMENTARY_TEXTS) {
      expect(p.status).not.toBe('page-image-collated');
      expect(p.status).not.toBe('partially-collated');
    }
    const map = buildChapter13EvidenceMap();
    for (const row of map) {
      if (row.passageIds.length === 0) expect(row.verification).toBe('locator-only');
      else expect(row.verification).toBe('text-layer-reviewed');
    }
    expect(map.find((r) => r.unitId === '13.1')?.evidenceStatus).toBe('locator-only');
  });
});

describe('chapter-13 concept to segment resolution', () => {
  it('resolves every Chapter-13 occurrence span and unit', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    const known = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (!occ.unitId.startsWith('13.')) continue;
        expect(unitIds.has(occ.unitId)).toBe(true);
        if (occ.spanId !== undefined) expect(known.has(occ.spanId)).toBe(true);
      }
    }
  });

  it('strengthens puruṣa, prakṛti, māyā and jñāna with exact Chapter-13 evidence', () => {
    const { text } = curatedGita();
    const byId = new Map(text.concepts.map((c) => [c.id, c]));
    for (const cid of ['gita-rk-purusa', 'gita-rk-prakriti', 'gita-rk-maya', 'gita-rk-jnana']) {
      const concept = byId.get(cid);
      expect(concept).toBeDefined();
      const ch13 = (concept?.occurrences || []).filter((o) => o.unitId.startsWith('13.'));
      expect(ch13.length).toBeGreaterThan(1);
      expect(ch13.some((o) => o.spanId !== undefined)).toBe(true);
    }
  });
});

describe('chapter-13 thread to segment and source-text resolution', () => {
  it('keeps Thread A 5/5 segment-grounded with honest source-text gaps', () => {
    const thread = GITA_SCHOLARLY_THREADS.find((t) => t.id === 'gita-rk-kshetra');
    if (!thread) throw new Error('no thread A');
    expect(thread.steps).toHaveLength(5);
    const known = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    for (const step of thread.steps) {
      for (const sid of step.spanIds || []) expect(known.has(sid)).toBe(true);
    }
    const bySpan = new Map<string, number>();
    for (const p of GITA_COMMENTARY_TEXTS) {
      if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
    }
    const covered = thread.steps.filter(
      (s) =>
        (s.spanIds || []).some((sid) => bySpan.has(sid)) ||
        GITA_COMMENTARY_TEXTS.some(
          (p) => p.spanId === undefined && (p.unitIds || []).some((u) => (s.unitIds || []).includes(u)),
        ),
    );
    expect(covered.length).toBe(4);
    const verseStep = thread.steps.find((s) => (s.spanIds || []).includes('gita-seg-13.2-verse'));
    expect(verseStep).toBeDefined();
    expect(bySpan.get('gita-seg-13.2-verse') || 0).toBe(0);
  });

  it('keeps the orientation thread first and scholarly threads appended', () => {
    const { corpus } = curatedGita();
    expect(corpus.texts.find((t) => t.id === 'bhagavad-gita')).toBeDefined();
  });
});

describe('chapter-13 argument structure', () => {
  it('grounds every sourced argument in an exact segment and passage', () => {
    const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    const knownPassages = new Set(GITA_COMMENTARY_TEXTS.map((p) => p.id));
    expect(CHAPTER13_ARGUMENTS.length).toBeGreaterThan(10);
    for (const arg of CHAPTER13_ARGUMENTS) {
      expect(arg.unitIds.length).toBeGreaterThan(0);
      for (const uid of arg.unitIds) expect(gitaMapForUnit(uid)).toBeDefined();
      if (arg.status === 'source') {
        expect(arg.segmentId).toBeDefined();
        expect(knownSpans.has(arg.segmentId as string)).toBe(true);
        if (arg.passageId !== undefined) {
          expect(knownPassages.has(arg.passageId)).toBe(true);
          expect(passageById(arg.passageId)?.spanId).toBe(arg.segmentId);
        }
      } else {
        expect(arg.status).toBe('unresolved');
      }
    }
  });

  it('retains the unresolved jneya objection without manufacturing a role', () => {
    const unresolved = CHAPTER13_ARGUMENTS.find((a) => a.id === 'gita-arg-13.13-jneya-obj');
    expect(unresolved?.role).toBe('unresolved');
    expect(unresolved?.status).toBe('unresolved');
    expect(unresolved?.passageId).toBeUndefined();
  });
});

describe('chapter-13 xref, quotation and variant integrity', () => {
  it('keeps explicit xref hosts honest and targets resolvable', () => {
    const ch13 = GITA_QUOTATION_EDGES.filter(
      (e) =>
        (e.fromUnitId !== null && e.fromUnitId.startsWith('13.')) ||
        (e.toUnitId !== null && e.toUnitId.startsWith('13.')),
    );
    expect(ch13.length).toBeGreaterThanOrEqual(6);
    for (const e of ch13) {
      expect(e.quotedText.trim().length).toBeGreaterThan(0);
      expect(e.locator.trim().length).toBeGreaterThan(0);
      expect(e.kind).toBe('commentary-quotes-unit');
      if (e.fromUnitId !== null) expect(gitaMapForUnit(e.fromUnitId)).toBeDefined();
      if (e.toUnitId !== null) expect(gitaMapForUnit(e.toUnitId)).toBeDefined();
    }
  });

  it('documents the disagreeing (13.5) locator as unresolved, never as an edge', () => {
    const hit = GITA_QUOTATION_EDGES.filter((e) => e.locator === '(१३।५)');
    expect(hit).toEqual([]);
  });

  it('creates no false external attributions (unresolved quotations stay in docs)', () => {
    for (const e of GITA_QUOTATION_EDGES) {
      expect(e.kind).toBe('commentary-quotes-unit');
    }
  });

  it('expands no unexplained sigla and imports no guesswork variants', () => {
    const serialised = JSON.stringify(GITA_COMMENTARY_TEXTS);
    expect(serialised).not.toMatch(/पुस्तक/);
  });
});

describe('chapter-13 citation precision', () => {
  it('cites segments without changing unit citations', () => {
    const base = {
      textTitle: 'Bhagavad Gītā',
      unitNumber: '13.3',
      locator: 'KSTS 13.2, p. 278',
      url: 'https://x.test/#/system/vedanta/thread?thread=gita-rk-kshetra&step=2',
    };
    expect(formatCitation(base)).toContain('Darśana canonical unit:');
    const seg = formatCitation({ ...base, segment: 'gita-ps-13.2-nanu: nanu passage' });
    expect(seg).toContain('gita-ps-13.2-nanu: nanu passage');
    expect(seg).toContain('Darśana scholarly reference:');
  });
});

describe('chapter-13 lazy loading', () => {
  it('ships Chapter-13 passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    for (const id of ['gita-tx-13-avat', 'gita-tx-13.34-synthesis', 'gita-tx-13.22-mahesvara']) {
      expect(data.map((r) => r.id)).toContain(id);
    }
  });

  it('keeps passage data out of unit chunks and component bundles', () => {
    const unitsDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'units');
    if (fs.existsSync(unitsDir)) {
      for (const f of fs.readdirSync(unitsDir)) {
        if (!f.endsWith('.json') || f === 'index.json') continue;
        expect(fs.readFileSync(path.join(unitsDir, f), 'utf8')).not.toContain('gita-tx-13-avat');
      }
    }
    const componentFiles = ['ThreadView.tsx', 'VerseDetail.tsx'];
    for (const name of componentFiles) {
      const src = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'components', name), 'utf8');
      expect(src).not.toContain('gitaCommentaryText');
    }
  });
});

describe('chapter-13 search indexing', () => {
  it('indexes Chapter-13 commentary Devanagari on verse entries (lazy shards)', () => {
    const { corpus } = curatedGita();
    const index = buildSearchIndex(corpus);
    const units = index.entries.filter(
      (e) => e.textId === 'bhagavad-gita' && e.kind === 'unit' && (e.unitId || '').startsWith('13.'),
    );
    expect(units.length).toBe(35);
    const withCommentary = units.filter((e) => (e.devanagari || '').includes('क्षेत्र'));
    expect(withCommentary.length).toBeGreaterThan(3);
  });

  it('finds Chapter-13 verses by exact Devanagari source terms', () => {
    const { corpus } = curatedGita();
    const index = buildSearchIndex(corpus);
    const gita = index.entries.filter((e) => e.textId === 'bhagavad-gita');
    const hits = rankEntries(gita, 'वेदकत्वमात्र', 50);
    expect(hits.some((h) => h.entry.unitId === '13.3')).toBe(true);
    const maya = rankEntries(gita, 'मायाशक्ति', 50);
    expect(maya.length).toBeGreaterThan(0);
  });

  it('filters Chapter 13 by unit number', () => {
    const { corpus } = curatedGita();
    const index = buildSearchIndex(corpus);
    const gita = index.entries.filter((e) => e.textId === 'bhagavad-gita');
    const hits = rankEntries(gita, '13.3', 50);
    expect(hits.some((h) => h.entry.unitId === '13.3')).toBe(true);
  });
});

describe('chapter-13 UI parity', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = [
      'ramakanthaSource',
      'passageVerified',
      'passageUnverified',
      'commentarySegment',
      'transcriptionAbsent',
      'relatedVerses',
      'commentaryLabel',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});

describe('chapter-13 scholarly audit', () => {
  it('reports actual Chapter-13 coverage (counts only)', () => {
    const { text } = curatedGita();
    const map = buildChapter13EvidenceMap(text.concepts);
    expect(map).toHaveLength(35);
    const coverage = auditChapter13(map, text.concepts);
    expect(coverage.units).toEqual({
      total: 35,
      withLocator: 34,
      withSegment: 11,
      withSourceText: 11,
    });
    expect(coverage.commentary.pageImageCollated).toBe(0);
    expect(coverage.commentary.verifiedSource + coverage.commentary.textLayerReviewed).toBe(14);
    const rendered = formatChapter13Audit(coverage);
    for (const line of ['Chapter 13 Scholarly Audit', 'Units:', 'Commentary:', 'Concepts:', 'Threads:', 'Cross-references:']) {
      expect(rendered).toContain(line);
    }
    expect(rendered).not.toMatch(/%/);
    const audit = auditCommentary({
      spans: GITA_PASSAGE_SPANS,
      threads: GITA_SCHOLARLY_THREADS,
      concepts: text.concepts,
      passages: GITA_COMMENTARY_TEXTS,
    });
    expect(audit.danglingSpanRefs).toBe(0);
  });
});
