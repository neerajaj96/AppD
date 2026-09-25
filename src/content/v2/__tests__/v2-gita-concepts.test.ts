import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import { validateCorpus } from '../validate';
import { CONCEPT_LINK_TYPES, CONCEPT_PROVENANCE_STATUSES, CONCEPT_TERM_KINDS } from '../schema';
const PILOT_IDS_LOCAL = [
  'gita-rk-karman',
  'gita-rk-jnana',
  'gita-rk-samuccaya',
  'gita-rk-prakriti',
  'gita-rk-purusa',
  'gita-rk-maya',
  'gita-rk-moksa',
];
import { GITA_UNIT_MAP, GITA_ADHIKA_MAP, gitaMapForUnit } from '../gitaPageMap';
import { EDITORIAL_ALIASES } from '../aliases';
import { uiStrings, type UIKey } from '../../../i18n/ui';

// Phase-3 pilot concept tests: provenance separation, evidence chains,
// typed relationships and the thirteen machine invariants. Real curated
// corpus for integration points, synthetic checks nowhere needed.

let cache: { corpus: ReturnType<typeof adaptSystemsToV2>; text: NonNullable<ReturnType<typeof adaptSystemsToV2>['texts'][number]> } | undefined;
function curatedGita() {
  if (!cache) {
    const corpus = adaptSystemsToV2(systems);
    applyProvenanceCuration(corpus);
    const text = corpus.texts.find((t) => t.id === 'bhagavad-gita');
    if (!text) throw new Error('no gita text');
    cache = { corpus, text };
  }
  return cache;
}

function pilots() {
  return curatedGita().text.concepts.filter((c) => PILOT_IDS_LOCAL.includes(c.id));
}

const byId = (id: string) => pilots().find((c) => c.id === id);

describe('pilot set and provenance separation', () => {
  it('ships exactly the seven curated pilots as source-grounded', () => {
    expect(pilots().map((c) => c.id).sort()).toEqual([...PILOT_IDS_LOCAL].sort());
    for (const c of pilots()) {
      expect(c.status).toBe('source-grounded');
    }
  });

  it('marks every legacy concept legacy-project after curation, pilots untouched', () => {
    const { text } = curatedGita();
    expect(text.concepts.length).toBe(25 + 7);
    for (const c of text.concepts) {
      expect(c.status).toBeDefined();
      if (c.id.startsWith('gita-rk-')) expect(c.status).toBe('source-grounded');
      else expect(c.status).toBe('legacy-project');
    }
  });

  it('keeps legacy records free of the new evidential fields', () => {
    const { text } = curatedGita();
    for (const c of text.concepts.filter((c) => c.status === 'legacy-project')) {
      expect(c.occurrences || []).toEqual([]);
      expect(c.conceptLinks || []).toEqual([]);
      expect(c.sourceTerms || []).toEqual([]);
    }
  });

  it('gives every pilot English and Malayalam titles that differ', () => {
    for (const c of pilots()) {
      const en = c.localisations.en;
      const ml = c.localisations.ml;
      expect(en?.title?.trim().length).toBeGreaterThan(0);
      expect(en?.summary?.trim().length).toBeGreaterThan(0);
      expect(ml?.title?.trim().length).toBeGreaterThan(0);
      expect(ml?.summary?.trim().length).toBeGreaterThan(0);
      // A real translation, never a copied label.
      expect(ml?.title).not.toBe(en?.title);
    }
  });
});

describe('source terms keep their layer', () => {
  it('uses only the closed kind vocabulary with Devanagari attestation', () => {
    for (const c of pilots()) {
      expect((c.sourceTerms || []).length).toBeGreaterThan(0);
      for (const t of c.sourceTerms || []) {
        expect(CONCEPT_TERM_KINDS).toContain(t.kind);
        if (t.kind === 'attested') {
          expect(t.form).toMatch(/^[\u0900-\u097F\s.,;:'"()\-–—॥।]+$/);
        }
      }
      // Normalised scholarly label present alongside attested forms.
      expect((c.sourceTerms || []).some((t) => t.kind === 'normalised')).toBe(true);
    }
  });

  it('never presents an English gloss as a source quotation', () => {
    for (const c of pilots()) {
      for (const t of c.sourceTerms || []) {
        if (t.kind === 'translated') {
          expect(t.note).toBeDefined();
        }
      }
      for (const o of c.occurrences || []) {
        if (o.quote !== undefined) {
          expect(o.quote).toMatch(/^[\u0900-\u097F\s.,;:'"()\-–—॥।]+$/);
        }
      }
    }
  });
});

describe('evidence-backed occurrences', () => {
  it('derives relatedUnitIds exactly from occurrences', () => {
    for (const c of pilots()) {
      expect((c.occurrences || []).length).toBeGreaterThan(0);
      expect([...(c.relatedUnitIds || [])].sort()).toEqual(
        [...new Set((c.occurrences || []).map((o) => o.unitId))].sort(),
      );
    }
  });

  it('points every occurrence at a real unit with resolvable KSTS/folio', () => {
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    for (const c of pilots()) {
      for (const o of c.occurrences || []) {
        expect(unitIds.has(o.unitId)).toBe(true);
        const row = gitaMapForUnit(o.unitId);
        if (o.unmappedReason) {
          // Opening-matter evidence: explicit folio, no verse number.
          expect(o.folio).toBeDefined();
        } else {
          expect(row).toBeDefined();
          expect(row?.folio).toBeDefined();
          expect(row?.ksts.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('resolves chapter-13 occurrences through the concordance, not naively', () => {
    const jnana = byId('gita-rk-jnana');
    const occ = jnana?.occurrences?.find((o) => o.unitId === '13.3');
    expect(occ).toBeDefined();
    expect(GITA_UNIT_MAP['13.3'].ksts).toEqual(['13.2']);
    expect(GITA_UNIT_MAP['13.3'].folio).toBe(278);
  });

  it('grounds samuccaya across intro matter and three chapters', () => {
    const units = (byId('gita-rk-samuccaya')?.occurrences || []).map((o) => o.unitId);
    expect(units).toContain('2.38');
    expect(units).toContain('3.1');
    expect(units).toContain('4.1');
    expect(units).toContain('5.3');
  });
});

describe('typed relationships', () => {
  it('derives relatedConceptIds exactly from links', () => {
    for (const c of pilots()) {
      expect([...(c.relatedConceptIds || [])].sort()).toEqual(
        [...new Set((c.conceptLinks || []).map((l) => l.to))].sort(),
      );
    }
  });

  it('keeps every link evidenced, typed and in-text', () => {
    const ids = new Set(pilots().map((c) => c.id));
    const { text } = curatedGita();
    const unitIds = new Set(text.units.map((u) => u.id));
    const expected: Array<[string, string, (typeof CONCEPT_LINK_TYPES)[number]]> = [
      ['gita-rk-karman', 'gita-rk-jnana', 'presupposes'],
      ['gita-rk-jnana', 'gita-rk-prakriti', 'explains'],
      ['gita-rk-samuccaya', 'gita-rk-moksa', 'leads-to'],
      ['gita-rk-prakriti', 'gita-rk-purusa', 'contrasts-with'],
    ];
    expect(
      pilots().flatMap((c) => (c.conceptLinks || []).map((l) => [c.id, l.to, l.type])),
    ).toEqual(expected);
    for (const c of pilots()) {
      for (const l of c.conceptLinks || []) {
        expect(ids.has(l.to)).toBe(true);
        expect((l.units || []).length > 0 || (l.note || '').trim().length > 0).toBe(true);
        for (const u of l.units || []) expect(unitIds.has(u)).toBe(true);
      }
    }
  });

  it('creates no cross-tradition links in the pilot', () => {
    const ids = new Set([...pilots().map((c) => c.id)]);
    for (const c of pilots()) {
      for (const l of c.conceptLinks || []) expect(ids.has(l.to)).toBe(true);
    }
  });
});

describe('search aliases converge without merging', () => {
  const pilotTriples = new Set(PILOT_IDS_LOCAL.map((id) => `vedanta/bhagavad-gita/${id}`));

  it('registers verified spellings for every pilot', () => {
    for (const triple of pilotTriples) {
      const rows = EDITORIAL_ALIASES.filter(
        (a) => a.canonicalId === triple && a.status === 'verified',
      );
      expect(rows.length).toBeGreaterThan(0);
    }
  });

  it('shares no alias spelling between two pilots', () => {
    const seen = new Map<string, string>();
    for (const a of EDITORIAL_ALIASES) {
      if (!pilotTriples.has(a.canonicalId) || a.status !== 'verified') continue;
      const prior = seen.get(a.alias);
      expect(prior === undefined || prior === a.canonicalId).toBe(true);
      seen.set(a.alias, a.canonicalId);
    }
  });
});

describe('concept interface strings', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = [
      'statusGrounded',
      'statusGroundedNote',
      'statusLegacy',
      'statusLegacyNote',
      'sourceTermsTitle',
      'relationshipsTitle',
      'termAttested',
      'termNormalised',
      'termTranslated',
      'termInferred',
      'relSynonymousWith',
      'relVariantOf',
      'relBroaderThan',
      'relNarrowerThan',
      'relPresupposes',
      'relContrastsWith',
      'relExplains',
      'relQualifiedBy',
      'relLeadsTo',
      'relInseparableFrom',
      'relDistinguishedFrom',
      'relIdentifiedWith',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });
});

describe('pilot validation integration', () => {
  it('raises no errors for pilot records in the curated corpus', () => {
    const { corpus } = curatedGita();
    const result = validateCorpus(corpus);
    const pilotErrors = result.errors.filter((e) => (e.entityId || '').startsWith('gita-rk-'));
    expect(pilotErrors).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('keeps the provenance vocabulary closed', () => {
    expect(CONCEPT_PROVENANCE_STATUSES).toEqual(['legacy-project', 'source-grounded']);
  });
});
