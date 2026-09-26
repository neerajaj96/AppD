import * as fs from 'node:fs';
import * as path from 'node:path';
import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import {
  GITA_COMMENTARY_TEXTS,
  isSourceTranscription,
  KSTS_SOURCE_ID,
  passageById,
  passagesForSpan,
  validatePassages,
} from '../gitaCommentaryText';
import { GITA_PASSAGE_SPANS } from '../gitaSpans';
import { GITA_SCHOLARLY_THREADS } from '../gitaThreads';
import { FetchChunkLoader } from '../chunks';
import { V2Repository } from '../repository';
import { auditCommentary } from '../commentaryAudit';
import { uiStrings, type UIKey } from '../../../i18n/ui';

// Phase-6 source-text tests: preservation, integrity, mapping, states,
// lazy loading and the no-fabrication invariants. Real curated corpus
// where units matter; the passage table itself otherwise.

const EXPECTED_IDS = [
  'gita-tx-13.1-glosa',
  'gita-tx-13.2-nanu',
  'gita-tx-13.2-resolution',
  'gita-tx-2.39-tail',
  'gita-tx-3-avat',
  'gita-tx-4-avat',
  'gita-tx-5.3-sent',
  'gita-tx-7.14-def',
  'gita-tx-7.14-q2',
  'gita-tx-7.14-resp',
  'gita-tx-18.61-maya',
];

function curatedGita() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
  if (!text) throw new Error('no gita text');
  return { corpus, text };
}

describe('passage identity and preservation', () => {
  it('ships exactly the eleven reviewed pilot passages', () => {
    expect(GITA_COMMENTARY_TEXTS.map((p) => p.id).sort()).toEqual([...EXPECTED_IDS].sort());
    expect(passageById('gita-tx-13.2-nanu')?.spanId).toBe('gita-ps-13.2-nanu');
    expect(passageById('gita-tx-nope')).toBeUndefined();
    expect(passagesForSpan('gita-seg-13.2-resolution')).toHaveLength(1);
  });

  it('preserves reviewed wording (spot checks against inspection)', () => {
    const nanu = passageById('gita-tx-13.2-nanu');
    expect(nanu?.text).toContain('ननु परमार्थत एक एव प्रमाता प्रतिपादितः');
    expect(nanu?.text).toContain('परिहर्तुमाह -');
    const samuccaya = passageById('gita-tx-2.39-tail');
    expect(samuccaya?.text).toContain('ज्ञानक्रियासमुच्चयमेव');
    const maya = passageById('gita-tx-18.61-maya');
    expect(maya?.text).toContain('मायाशक्त्यवभासित');
  });

  it('retains uncertainty explicitly instead of fixing it', () => {
    const resolution = passageById('gita-tx-13.2-resolution');
    expect(resolution?.text).toContain('[?]');
    expect(resolution?.note).toBeDefined();
  });

  it('keeps every passage Unicode-clean Devanagari with no Latin', () => {
    for (const p of GITA_COMMENTARY_TEXTS) {
      expect(isSourceTranscription(p.text)).toBe(true);
    }
    expect(isSourceTranscription('')).toBe(false);
    expect(isSourceTranscription('karma is action')).toBe(false);
    expect(isSourceTranscription(undefined)).toBe(false);
  });
});

describe('passage mapping and states', () => {
  it('anchors every passage to units, folio and the KSTS record', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const p of GITA_COMMENTARY_TEXTS) {
      expect(p.unitIds.length).toBeGreaterThan(0);
      for (const uid of p.unitIds) expect(unitIds.has(uid)).toBe(true);
      expect(p.folio).toBe(p.pdf - 10);
      expect(p.sourceId).toBe(KSTS_SOURCE_ID);
      expect(p.status).toBe('verified-source');
    }
  });

  it('links spanned passages to resolving spans', () => {
    const known = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    for (const p of GITA_COMMENTARY_TEXTS) {
      if (p.spanId !== undefined) expect(known.has(p.spanId)).toBe(true);
    }
  });
});

describe('passage validation', () => {
  it('accepts the pilot table without errors', () => {
    expect(validatePassages(GITA_COMMENTARY_TEXTS)).toEqual([]);
  });

  it('rejects missing provenance, bad states and non-source text', () => {
    const base = GITA_COMMENTARY_TEXTS[0];
    expect(validatePassages([{ ...base, id: '', text: 'x' }]).length).toBeGreaterThan(0);
    expect(validatePassages([
      { ...base, id: 't1', status: 'reviewed' as never },
      { ...base, id: 't1-ok', status: 'verified-source' },
    ])).toEqual(['t1: unknown status reviewed']);
    expect(
      validatePassages([{ ...base, id: 't2', text: 'editorial summary here' }]),
    ).toEqual(['t2: text absent or not Devanagari source transcription']);
    // Regression: text without provenance or verification state fails.
    expect(
      validatePassages([{ ...base, id: 't3', sourceId: '  ', status: undefined as never }]).length,
    ).toBeGreaterThan(0);
  });

  it('requires notes wherever uncertainty markers appear', () => {
    expect(
      validatePassages([{ ...GITA_COMMENTARY_TEXTS[0], id: 't4', text: 'कर्म[?]x', note: undefined }]),
    ).toContain('t4: uncertainty markers without documenting note');
  });

  it('rejects duplicates and malformed locators', () => {
    const dup = { ...GITA_COMMENTARY_TEXTS[0], id: GITA_COMMENTARY_TEXTS[1].id };
    expect(validatePassages([GITA_COMMENTARY_TEXTS[1], dup])).toContain(
      `duplicate passage id ${dup.id}`,
    );
  });
});

describe('diplomatic separation', () => {
  it('carries no normalized-text column anywhere', () => {
    const serialised = JSON.stringify(GITA_COMMENTARY_TEXTS);
    expect(serialised).not.toMatch(/normali[sz]ed/i);
  });
});

describe('passage evidence resolution', () => {
  it('covers thread steps claiming span evidence', () => {
    const bySpan = new Map<string, number>();
    for (const p of GITA_COMMENTARY_TEXTS) {
      if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
    }
    // nanu, resolution, 2.39-tail, both avats, q2, response, maya gloss.
    for (const sid of [
      'gita-ps-13.2-nanu',
      'gita-seg-13.2-resolution',
      'gita-seg-2.39-tail',
      'gita-ps-3-avat',
      'gita-ps-4-avat',
      'gita-seg-7.14-q2',
      'gita-seg-7.14-response',
      'gita-ps-18.61-maya',
    ]) {
      expect(bySpan.get(sid)).toBeGreaterThan(0);
    }
  });
});

describe('passages lazy loading', () => {
  function mockFetch(routes: Record<string, unknown>) {
    return async (url: string): Promise<Response> => {
      for (const [suffix, value] of Object.entries(routes)) {
        if (url.endsWith(suffix)) {
          if (value === '__404__') return new Response('nope', { status: 404 });
          return new Response(JSON.stringify(value), { status: 200 });
        }
      }
      return new Response('nope', { status: 404 });
    };
  }

  it('loads passage arrays and rejects malformed payloads', async () => {
    const rows = [{ id: 'gita-tx-13.2-nanu' }];
    const okRepo = new V2Repository(
      new FetchChunkLoader(mockFetch({ 'bhagavad-gita/passages.json': rows })),
    );
    expect(await okRepo.getPassages('bhagavad-gita')).toEqual({ status: 'ok', data: rows });
    const badRepo = new V2Repository(
      new FetchChunkLoader(mockFetch({ 'bhagavad-gita/passages.json': { nope: 1 } })),
    );
    expect((await badRepo.getPassages('bhagavad-gita')).status).toBe('error');
    const missingRepo = new V2Repository(
      new FetchChunkLoader(mockFetch({ 'bhagavad-gita/passages.json': '__404__' })),
    );
    expect((await missingRepo.getPassages('bhagavad-gita')).status).toBe('missing');
  });

  it('ships the pilot passages in the built lazy chunk', () => {
    const file = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'passages.json');
    if (!fs.existsSync(file)) {
      console.warn('public/content passages.json missing (run content:chunks); skipping');
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Array<{ id: string }>;
    expect(data.map((r) => r.id).sort()).toEqual([...EXPECTED_IDS].sort());
  });

  it('keeps passage data out of unit chunks and component bundles', () => {
    const unitsDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'units');
    if (fs.existsSync(unitsDir)) {
      for (const f of fs.readdirSync(unitsDir)) {
        if (!f.endsWith('.json') || f === 'index.json') continue;
        expect(fs.readFileSync(path.join(unitsDir, f), 'utf8')).not.toContain('gita-tx-');
      }
    }
    const componentFiles = ['ThreadView.tsx', 'ConceptDetail.tsx', 'VerseDetail.tsx', 'TextIndex.tsx'];
    for (const name of componentFiles) {
      const src = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'components', name), 'utf8');
      expect(src).not.toContain('gitaCommentaryText');
    }
  });
});

describe('commentary audit with source text', () => {
  function gitaConcepts() {
    return curatedGita().text.concepts;
  }

  it('counts transcribed, verified and step/concept coverage', () => {
    const audit = auditCommentary({
      spans: GITA_PASSAGE_SPANS,
      threads: GITA_SCHOLARLY_THREADS,
      concepts: gitaConcepts(),
      passages: GITA_COMMENTARY_TEXTS,
    });
    expect(audit.texts).toEqual({
      total: 11,
      verifiedSource: 11,
      extractionUnreviewed: 0,
      partiallyVerified: 0,
    });
    expect(audit.stepsWithText).toBeGreaterThan(0);
    expect(audit.conceptsWithText).toBeGreaterThan(0);
    expect(audit.danglingSpanRefs).toBe(0);
  });
});

describe('source-text interface strings', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = ['ramakanthaSource', 'passageVerified', 'passageUnverified'];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});
