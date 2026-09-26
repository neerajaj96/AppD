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
  'gita-tx-13-avat',
  'gita-tx-13.1-glosa',
  'gita-tx-13.1-etat',
  'gita-tx-13.1-tatparya',
  'gita-tx-13.2-nanu',
  'gita-tx-13.2-resolution',
  'gita-tx-13.2-sarvaksetra',
  'gita-tx-13.3-gloss',
  'gita-tx-13.3-intro',
  'gita-tx-13.3-tat',
  'gita-tx-13.4-rsibhi',
  'gita-tx-13.4-upasamhara',
  'gita-tx-13.5-gloss',
  'gita-tx-13.5-tattva',
  'gita-tx-13.5-karana',
  'gita-tx-13.5-karya',
  'gita-tx-13.6-iccha',
  'gita-tx-13.6-darsanantara',
  'gita-tx-13.6-upasamhara',
  'gita-tx-13.6-siddhanta',
  'gita-tx-13.7-intro',
  'gita-tx-13.7-mana',
  'gita-tx-13.7-adambha',
  'gita-tx-13.7-arjava',
  'gita-tx-13.7-acarya',
  'gita-tx-13.8-sthairya',
  'gita-tx-13.9-asakti',
  'gita-tx-13.10-vivikta',
  'gita-tx-13.11-ajnana',
  'gita-tx-13.12-anadi',
  'gita-tx-13.12-jneya-resp',
  'gita-tx-13.12-pratijna',
  'gita-tx-13.12-pratyavamarsa',
  'gita-tx-13.12-samjna',
  'gita-tx-13.12-nasat',
  'gita-tx-13.13-sarvendriya',
  'gita-tx-13.14-asakta',
  'gita-tx-13.15-bahiranta',
  'gita-tx-13.15-avibhakta',
  'gita-tx-13.16-bhutabhartr',
  'gita-tx-13.17-jnanagamya',
  'gita-tx-13.18-upasamhara',
  'gita-tx-13.19-prakrti',
  'gita-tx-13.19-anaditva',
  'gita-tx-13.19-samanya',
  'gita-tx-13.20-karya',
  'gita-tx-13.20-prakrtihetu',
  'gita-tx-13.21-gunasanga-a',
  'gita-tx-13.21-gunasanga-b',
  'gita-tx-13.22-mahesvara',
  'gita-tx-13.22-dvividha',
  'gita-tx-13.22-upadrastra',
  'gita-tx-13.22-viveka',
  'gita-tx-13.23-phala-intro',
  'gita-tx-13.23-yogi',
  'gita-tx-13.24-dhyana',
  'gita-tx-13.24-sankhya',
  'gita-tx-13.25-samuccaya',
  'gita-tx-13.25-sruta',
  'gita-tx-13.26-samyoga',
  'gita-tx-13.27-sama',
  'gita-tx-13.27-samapasya',
  'gita-tx-13.28-atmahimsa',
  'gita-tx-13.29-prakrtya',
  'gita-tx-13.29-akartra',
  'gita-tx-13.30-ekatva',
  'gita-tx-13.30-vistara',
  'gita-tx-13.31-avyaya-a',
  'gita-tx-13.31-avyaya-b',
  'gita-tx-13.32-akasa',
  'gita-tx-13.33-ravi',
  'gita-tx-13.33-janaka',
  'gita-tx-13.34-synthesis',
  'gita-tx-13.34-moksa',
  'gita-tx-13.34-para',
  'gita-tx-13.34-prasasti',
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
  it('ships exactly the eighty-four reviewed passages (eleven Phase-6 + eleven Phase-7 + sixty-two Phase-8)', () => {
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
      expect(['verified-source', 'text-layer-reviewed']).toContain(p.status);
    }
  });

  it('keeps Phase-6 verified-source distinct from Phase-7 text-layer-reviewed, never collated', () => {
    const pilot = GITA_COMMENTARY_TEXTS.filter((p) =>
      ['gita-tx-13.1-glosa', 'gita-tx-13.2-nanu', 'gita-tx-13.2-resolution'].includes(p.id),
    );
    for (const p of pilot) expect(p.status).toBe('verified-source');
    const ch13 = GITA_COMMENTARY_TEXTS.filter((p) => p.id.startsWith('gita-tx-13-') || p.id.startsWith('gita-tx-13.'));
    const phase7 = ch13.filter((p) => !['gita-tx-13.1-glosa', 'gita-tx-13.2-nanu', 'gita-tx-13.2-resolution'].includes(p.id));
    expect(phase7.length).toBeGreaterThan(0);
    for (const p of phase7) expect(p.status).toBe('text-layer-reviewed');
    for (const p of GITA_COMMENTARY_TEXTS) {
      expect(p.status).not.toBe('page-image-collated');
      expect(p.status).not.toBe('partially-collated');
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

  it('covers every new Chapter-13 span with exact text except the closing apparatus', () => {
    const bySpan = new Map<string, number>();
    for (const p of GITA_COMMENTARY_TEXTS) {
      if (p.spanId !== undefined) bySpan.set(p.spanId, (bySpan.get(p.spanId) || 0) + 1);
    }
    for (const sid of [
      'gita-ps-13-avat',
      'gita-seg-13.1-glosa',
      'gita-seg-13.1-etat',
      'gita-seg-13.1-tatparya',
      'gita-ps-13.2-nanu',
      'gita-seg-13.2-resolution',
      'gita-seg-13.2-sarvaksetra',
      'gita-seg-13.3-gloss',
      'gita-seg-13.3-intro',
      'gita-seg-13.3-tat',
      'gita-seg-13.4-rsibhi',
      'gita-seg-13.4-upasamhara',
      'gita-seg-13.5-gloss',
      'gita-seg-13.5-tattva',
      'gita-seg-13.5-karana',
      'gita-seg-13.5-karya',
      'gita-seg-13.6-iccha',
      'gita-seg-13.6-darsanantara',
      'gita-seg-13.6-upasamhara',
      'gita-seg-13.6-siddhanta',
      'gita-seg-13.7-intro',
      'gita-seg-13.7-mana',
      'gita-seg-13.7-adambha',
      'gita-seg-13.7-arjava',
      'gita-seg-13.7-acarya',
      'gita-seg-13.8-sthairya',
      'gita-seg-13.9-asakti',
      'gita-seg-13.10-vivikta',
      'gita-seg-13.11-ajnana',
      'gita-seg-13.12-jneya-resp',
      'gita-seg-13.12-anadi',
      'gita-seg-13.12-pratijna',
      'gita-seg-13.12-pratyavamarsa',
      'gita-seg-13.12-samjna',
      'gita-seg-13.12-nasat',
      'gita-seg-13.13-sarvendriya',
      'gita-seg-13.14-asakta',
      'gita-seg-13.15-bahiranta',
      'gita-seg-13.15-avibhakta',
      'gita-seg-13.16-bhutabhartr',
      'gita-seg-13.17-jnanagamya',
      'gita-seg-13.18-upasamhara',
      'gita-seg-13.19-prakrti',
      'gita-seg-13.19-anaditva',
      'gita-seg-13.19-samanya',
      'gita-seg-13.20-karya',
      'gita-seg-13.20-prakrtihetu',
      'gita-seg-13.21-gunasanga-a',
      'gita-seg-13.21-gunasanga-b',
      'gita-seg-13.22-mahesvara',
      'gita-seg-13.22-dvividha',
      'gita-seg-13.22-upadrastra',
      'gita-seg-13.22-viveka',
      'gita-seg-13.23-phala-intro',
      'gita-seg-13.23-yogi',
      'gita-seg-13.24-dhyana',
      'gita-seg-13.24-sankhya',
      'gita-seg-13.25-samuccaya',
      'gita-seg-13.25-sruta',
      'gita-seg-13.26-samyoga',
      'gita-seg-13.27-sama',
      'gita-seg-13.27-samapasya',
      'gita-seg-13.28-atmahimsa',
      'gita-seg-13.29-prakrtya',
      'gita-seg-13.29-akartra',
      'gita-seg-13.30-ekatva',
      'gita-seg-13.30-vistara',
      'gita-seg-13.31-avyaya-a',
      'gita-seg-13.31-avyaya-b',
      'gita-seg-13.32-akasa',
      'gita-seg-13.33-ravi',
      'gita-seg-13.33-janaka',
      'gita-seg-13.34-synthesis',
      'gita-seg-13.34-moksa',
      'gita-seg-13.34-para',
      'gita-seg-13.34-prasasti',
    ]) {
      expect(bySpan.get(sid)).toBeGreaterThan(0);
    }
    // The verse-introduction span stays segment-only (mūla excluded) and
    // the closing-apparatus span stays locator-only by design.
    expect(bySpan.get('gita-seg-13.2-verse') || 0).toBe(0);
    expect(bySpan.get('gita-seg-13.34-closing') || 0).toBe(0);
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
      total: 84,
      verifiedSource: 11,
      textLayerReviewed: 73,
      pageImageCollated: 0,
      partiallyCollated: 0,
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
