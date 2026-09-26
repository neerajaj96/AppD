import * as fs from 'node:fs';
import * as path from 'node:path';
import { adaptSystemsToV2, adaptSystemThread } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import {
  GITA_COMMENTARY_SPANS,
  GITA_PASSAGE_SPANS,
  PASSAGE_SPAN_ROLES,
  passageSpanById,
} from '../gitaSpans';
import { GITA_CHAPTERS } from '../gitaChapters';
import { GITA_SCHOLARLY_THREADS } from '../gitaThreads';
import { formatCitation, threadStepUrl, unitCanonicalUrl } from '../citation';
import { auditCommentary, formatCommentaryAudit } from '../commentaryAudit';
import { parseGitaVerseRef } from '../gitaDocument';
import { uiStrings, type UIKey } from '../../../i18n/ui';

// Phase-5 segment tests: stable ids, deterministic validation, locator
// precision, resolution in all directions, citation precision and the
// no-fabrication proofs. Real curated corpus where units matter.

function curatedGita() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
  if (!text) throw new Error('no gita text');
  return { corpus, text };
}

const EXPECTED_SPANS = [
  'gita-ps-13-avat',
  'gita-ps-13.2-nanu',
  'gita-ps-3-avat',
  'gita-ps-4-avat',
  'gita-ps-7-avat',
  'gita-ps-18.61-maya',
  'gita-seg-13.1-glosa',
  'gita-seg-13.1-etat',
  'gita-seg-13.1-tatparya',
  'gita-seg-13.2-verse',
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
  'gita-seg-13.34-closing',
  'gita-seg-2.39-tail',
  'gita-seg-7.14-q2',
  'gita-seg-7.14-response',
];

describe('segment identity and stability', () => {
  it('keeps the eighty-five passage spans, no renames, no silent additions', () => {
    expect(GITA_PASSAGE_SPANS.map((s) => s.id).sort()).toEqual([...EXPECTED_SPANS].sort());
  });

  it('keeps the Phase-2 joint spans intact', () => {
    expect(GITA_COMMENTARY_SPANS.map((s) => s.id).sort()).toEqual([
      'gita-span-18.74-75',
      'gita-span-18.76-77',
    ]);
  });

  it('resolves every span id through the lookup', () => {
    for (const id of EXPECTED_SPANS) {
      expect(passageSpanById(id)?.id).toBe(id);
    }
    expect(passageSpanById('gita-seg-nope')).toBeUndefined();
  });
});

describe('segmentation validation', () => {
  it('gives every span units, parseable KSTS refs and chapter-consistent locators', () => {
    for (const span of GITA_PASSAGE_SPANS) {
      expect(span.unitIds.length).toBeGreaterThan(0);
      expect(['source', 'editorial', 'unresolved']).toContain(span.status);
      if (span.role !== undefined) expect(PASSAGE_SPAN_ROLES).toContain(span.role);
      for (const ref of span.ksts) {
        expect(parseGitaVerseRef(ref)).not.toBeNull();
      }
      if (span.pdf !== undefined && span.folio !== undefined) {
        expect(span.folio).toBe(span.pdf - 10);
      }
      if (span.pdf !== undefined) {
        const chapter = GITA_CHAPTERS.find((c) => span.pdf as number >= c.pdfStart && (span.pdf as number) <= c.pdfEnd);
        expect(chapter).toBeDefined();
      }
    }
  });

  it('points every span unit at a real canonical unit', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const span of GITA_PASSAGE_SPANS) {
      for (const uid of span.unitIds) expect(unitIds.has(uid)).toBe(true);
    }
  });

  it('carries no transcription anywhere (no-fabrication proof)', () => {
    for (const span of GITA_PASSAGE_SPANS) {
      expect(span.transcription).toBeUndefined();
    }
  });
});

describe('segment resolution in all directions', () => {
  it('resolves thread step spans and concept occurrence spans', () => {
    const known = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        for (const sid of step.spanIds || []) expect(known.has(sid)).toBe(true);
      }
    }
    const { text } = curatedGita();
    for (const concept of text.concepts) {
      for (const occ of concept.occurrences || []) {
        if (occ.spanId !== undefined) expect(known.has(occ.spanId)).toBe(true);
      }
    }
  });

  it('grounds the expected pilot steps and occurrences', () => {
    const byThreadStep = new Map<string, string[]>();
    for (const thread of GITA_SCHOLARLY_THREADS) {
      for (const step of thread.steps) {
        byThreadStep.set(`${thread.id}/${step.id}`, step.spanIds || []);
      }
    }
    expect(byThreadStep.get('gita-rk-kshetra/gita-rk-kshetra-2')).toEqual(['gita-ps-13.2-nanu']);
    expect(byThreadStep.get('gita-rk-samuccaya-marga/gita-rk-samuccaya-1')).toEqual(['gita-seg-2.39-tail']);
    expect(byThreadStep.get('gita-rk-maya-marga/gita-rk-maya-5')).toEqual(['gita-ps-18.61-maya']);
    const { text } = curatedGita();
    const samuccaya = text.concepts.find((c) => c.id === 'gita-rk-samuccaya');
    const avat = (samuccaya?.occurrences || []).filter((o) => o.spanId?.endsWith('-avat'));
    expect(avat.map((o) => o.unitId).sort()).toEqual(['3.1', '4.1', '7.1']);
  });
});

describe('segment citation precision', () => {
  it('appends verified segment notes without changing unit citations', () => {
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

  it('builds stable thread-step URLs', () => {
    expect(threadStepUrl('https://x.test/', 'vedanta', 'gita-rk-kshetra', 1)).toBe(
      'https://x.test/#/system/vedanta/thread?thread=gita-rk-kshetra&step=2',
    );
    expect(unitCanonicalUrl('https://x.test', 'vedanta', 'bhagavad-gita', '13.3')).toBe(
      'https://x.test/#/system/vedanta/text/bhagavad-gita/verse/13.3',
    );
  });
});

describe('commentary audit', () => {
  function gitaConcepts() {
    const { text } = curatedGita();
    return text.concepts;
  }

  it('measures coverage without scores', () => {
    const audit = auditCommentary({
      spans: GITA_PASSAGE_SPANS,
      threads: GITA_SCHOLARLY_THREADS,
      concepts: gitaConcepts(),
    });
    expect(audit.segments).toEqual({ total: 85, source: 85, editorial: 0, unresolved: 0 });
    expect(audit.evidencePrecision.exactFolio).toBe(85);
    expect(audit.danglingSpanRefs).toBe(0);
    const byId = new Map(audit.threads.map((t) => [t.threadId, t]));
    expect(byId.get('gita-rk-kshetra')).toMatchObject({ steps: 5, stepsWithSegments: 5 });
    expect(byId.get('gita-rk-samuccaya-marga')).toMatchObject({ steps: 6, stepsWithSegments: 4 });
    expect(byId.get('gita-rk-maya-marga')).toMatchObject({ steps: 5, stepsWithSegments: 4 });
    expect(audit.conceptsWithSegments).toBe(7);
    expect(audit.conceptsTotal).toBe(32);
  });

  it('renders the human report without throwing', () => {
    const text = formatCommentaryAudit(
      auditCommentary({ spans: GITA_PASSAGE_SPANS, threads: GITA_SCHOLARLY_THREADS, concepts: gitaConcepts() }),
    );
    for (const line of ['Rāmakaṇṭha Commentary Audit', 'Segments:', 'Evidence precision:', 'Pilot thread coverage:']) {
      expect(text).toContain(line);
    }
    expect(text).not.toMatch(/%/);
  });
});

describe('lazy bundle discipline', () => {
  const unitsDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'bhagavad-gita', 'units');
  const threadsFile = path.join(__dirname, '..', '..', '..', '..', 'public', 'content', 'threads', 'vedanta.json');

  it('keeps span payloads out of unit chunks (spans point at units, not vice versa)', () => {
    if (!fs.existsSync(unitsDir)) {
      console.warn('public/content missing (run content:chunks); skipping');
      return;
    }
    for (const f of fs.readdirSync(unitsDir)) {
      if (!f.endsWith('.json') || f === 'index.json') continue;
      const text = fs.readFileSync(path.join(unitsDir, f), 'utf8');
      expect(text).not.toContain('spanIds');
      expect(text).not.toContain('transcription');
    }
  });

  it('ships thread span references inside the lazy tradition thread chunk', () => {
    if (!fs.existsSync(threadsFile)) {
      console.warn('public/content missing (run content:chunks); skipping');
      return;
    }
    const threads = JSON.parse(fs.readFileSync(threadsFile, 'utf8')) as Array<{ id: string }>;
    expect(threads.map((t) => t.id)).toContain('gita-rk-kshetra');
    const text = fs.readFileSync(threadsFile, 'utf8');
    expect(text).toContain('gita-ps-13.2-nanu');
  });
});

describe('segment interface strings', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = ['commentarySegment', 'transcriptionAbsent'];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});
