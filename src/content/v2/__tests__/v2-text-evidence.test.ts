import { buildTextEvidenceSummary } from '../evidenceSummary';
import { buildEvidenceAudit } from '../report';
import { uiStrings, type UIKey } from '../../../i18n/ui';
import type { CanonicalUnit, V2Corpus, V2EvidenceLink, V2Source } from '../schema';

// Text-level evidence summary tests: the landing-page derivation must
// agree with buildEvidenceAudit() by construction (shared auditText),
// keep role counts separate from relation counts, and invent nothing.

const unit = (id: string, extra: Partial<CanonicalUnit> = {}): CanonicalUnit => ({
  id,
  number: '1',
  section: 'S',
  unitType: 'sutra' as const,
  iast: '',
  localisations: { en: { translation: 'T' } },
  ...extra,
});

const source = (id: string, extra: Partial<V2Source> = {}): V2Source => ({
  id,
  title: `Title ${id}`,
  ...extra,
});

const link = (sourceId: string, relation: V2EvidenceLink['relation']): V2EvidenceLink => ({
  sourceId,
  relation,
});

function corpusWith(textId: string, units: CanonicalUnit[], sources: V2Source[]): V2Corpus {
  return {
    schemaVersion: 2,
    traditions: [{ id: 't1', title: 'T1', category: 'philosophical-school' as const, textIds: [textId], threadSteps: 0 }],
    texts: [
      {
        id: textId,
        title: 'X',
        transliteratedTitle: 'X',
        traditionId: 't1',
        sourceRole: 'primary' as const,
        contentStatus: 'complete' as const,
        languages: ['en' as const],
        units,
        concepts: [],
        sources,
      },
    ],
    aliases: [],
  };
}

describe('text evidence summary basics', () => {
  it('reports zero counts for an empty text', () => {
    const summary = buildTextEvidenceSummary('x', 't1', [], []);
    expect(summary.audit.unitCount).toBe(0);
    expect(summary.audit.sourceRecordCount).toBe(0);
    expect(summary.audit.sourceLinkedUnits).toBe(0);
    expect(summary.audit.evidenceLinkedUnits).toBe(0);
    expect(summary.audit.locatorUnits).toBe(0);
    expect(summary.audit.locatorOnlyUnits).toBe(0);
    expect(summary.audit.fullyLinkedUnits).toBe(0);
    expect(summary.audit.unresolvedUnits).toBe(0);
    expect(summary.sourceOnlyUnits).toBe(0);
    expect(summary.sourcesWithRoles).toBe(0);
    expect(summary.sourcesWithoutRoles).toBe(0);
    expect(summary.firstEvidenceLinkedUnitId).toBeUndefined();
  });

  it('counts a source-only unit as linked but not evidence-linked', () => {
    const summary = buildTextEvidenceSummary('x', 't1', [unit('u1', { sourceIds: ['s1'] })], [source('s1')]);
    expect(summary.audit.sourceLinkedUnits).toBe(1);
    expect(summary.audit.evidenceLinkedUnits).toBe(0);
    expect(summary.audit.fullyLinkedUnits).toBe(0);
    expect(summary.audit.unresolvedUnits).toBe(0);
    expect(summary.sourceOnlyUnits).toBe(1);
    expect(summary.firstSourceOnlyUnitId).toBe('u1');
  });

  it('counts an evidence-linked unit as fully linked', () => {
    const summary = buildTextEvidenceSummary(
      'x',
      't1',
      [unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'commentary')] })],
      [source('s1', { role: 'commentary' })],
    );
    expect(summary.audit.sourceLinkedUnits).toBe(1);
    expect(summary.audit.evidenceLinkedUnits).toBe(1);
    expect(summary.audit.fullyLinkedUnits).toBe(1);
    expect(summary.audit.unresolvedUnits).toBe(0);
    expect(summary.audit.evidenceRelationCounts).toEqual({ commentary: 1 });
    expect(summary.firstEvidenceLinkedUnitId).toBe('u1');
  });

  it('counts a locator-only unit apart from evidence links', () => {
    const summary = buildTextEvidenceSummary(
      'x',
      't1',
      [unit('u1', { provenance: { locator: 'pp.472-523' } })],
      [source('s1')],
    );
    expect(summary.audit.locatorUnits).toBe(1);
    expect(summary.audit.locatorOnlyUnits).toBe(1);
    expect(summary.audit.evidenceLinkedUnits).toBe(0);
    expect(summary.audit.sourceLinkedUnits).toBe(0);
    expect(summary.audit.unresolvedUnits).toBe(0);
    expect(summary.firstLocatorOnlyUnitId).toBe('u1');
  });

  it('counts a source-plus-locator unit as fully linked without a link', () => {
    const summary = buildTextEvidenceSummary(
      'x',
      't1',
      [unit('u1', { sourceIds: ['s1'], provenance: { locator: 'pp.1-2' } })],
      [source('s1')],
    );
    expect(summary.audit.fullyLinkedUnits).toBe(1);
    expect(summary.audit.evidenceLinkedUnits).toBe(0);
    expect(summary.audit.locatorOnlyUnits).toBe(0);
    expect(summary.audit.unresolvedUnits).toBe(0);
  });
});

describe('unresolved categories', () => {
  it('distinguishes no-source-record from no-unit-association', () => {
    const bare = unit('u1');
    const noRecord = buildTextEvidenceSummary('x', 't1', [bare], []);
    expect(noRecord.audit.unresolvedUnits).toBe(1);
    expect(noRecord.audit.unresolvedReasons['no-source-record']).toBe(1);
    const noAssoc = buildTextEvidenceSummary('x', 't1', [bare], [source('s1')]);
    expect(noAssoc.audit.unresolvedUnits).toBe(1);
    expect(noAssoc.audit.unresolvedReasons['no-unit-association']).toBe(1);
    expect(noAssoc.audit.unresolvedReasons['no-source-record']).toBe(0);
    expect(noAssoc.firstUnresolvedUnitId).toBe('u1');
  });

  it('classifies notes without a deterministic mapping separately', () => {
    const noted = unit('u1', { interpretiveNotes: [{ note: 'unmatched remark' }] });
    const summary = buildTextEvidenceSummary('x', 't1', [noted], [source('s1')]);
    expect(summary.audit.unresolvedUnits).toBe(1);
    expect(summary.audit.unresolvedReasons['notes-without-deterministic-mapping']).toBe(1);
  });

  it('keeps the unclassified bucket present but empty', () => {
    const summary = buildTextEvidenceSummary('x', 't1', [unit('u1')], []);
    expect(summary.audit.unresolvedReasons.unclassified).toBe(0);
  });
});

describe('registry and relation aggregation', () => {
  it('counts multiple source records and their roles', () => {
    const sources = [
      source('s1', { role: 'primary-text' }),
      source('s2', { role: 'commentary' }),
      source('s3'),
    ];
    const summary = buildTextEvidenceSummary('x', 't1', [], sources);
    expect(summary.audit.sourceRecordCount).toBe(3);
    expect(summary.sourcesWithRoles).toBe(2);
    expect(summary.sourcesWithoutRoles).toBe(1);
    expect(summary.audit.sourceRoleCounts).toEqual({
      'primary-text': 1,
      commentary: 1,
      unclassified: 1,
    });
  });

  it('aggregates multiple evidence relations from unit links', () => {
    const units = [
      unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'text')] }),
      unit('u2', { sourceIds: ['s1', 's2'], evidenceLinks: [link('s1', 'text'), link('s2', 'commentary')] }),
    ];
    const summary = buildTextEvidenceSummary('x', 't1', units, [source('s1'), source('s2')]);
    expect(summary.audit.evidenceLinkedUnits).toBe(2);
    expect(summary.audit.evidenceRelationCounts).toEqual({ text: 2, commentary: 1 });
  });

  it('keeps source role counts separate from evidence relation counts', () => {
    // Two commentary-role records, but the only link claims the text layer.
    const summary = buildTextEvidenceSummary(
      'x',
      't1',
      [unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'text')] })],
      [source('s1', { role: 'commentary' }), source('s2', { role: 'commentary' })],
    );
    expect(summary.audit.sourceRoleCounts).toEqual({ commentary: 2 });
    expect(summary.audit.evidenceRelationCounts).toEqual({ text: 1 });
  });

  it('is deterministic across runs', () => {
    const units = [unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'text')] })];
    const sources = [source('s1', { role: 'primary-text' })];
    expect(buildTextEvidenceSummary('x', 't1', units, sources)).toEqual(
      buildTextEvidenceSummary('x', 't1', units, sources),
    );
  });

  it('invents no metadata beyond counts and observed ids', () => {
    const summary = buildTextEvidenceSummary(
      'x',
      't1',
      [unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'text')] })],
      [source('s1')],
    );
    const serialised = JSON.stringify(summary);
    expect(serialised).not.toContain('Unknown');
    // Source titles stay in the registry; the summary carries ids only.
    expect(serialised).not.toContain('Title s1');
    expect(serialised).toContain('u1');
  });
});

describe('agreement with the corpus audit', () => {
  it('matches the per-text audit entry exactly', () => {
    const units = [
      unit('u1', { sourceIds: ['s1'], evidenceLinks: [link('s1', 'text')] }),
      unit('u2', { sourceIds: ['s2'], evidenceLinks: [link('s2', 'commentary')] }),
      unit('u3', { provenance: { locator: 'pp.1-2' } }),
      unit('u4'),
    ];
    const sources = [source('s1', { role: 'primary-text' }), source('s2', { role: 'commentary' })];
    const summary = buildTextEvidenceSummary('x', 't1', units, sources);
    const audit = buildEvidenceAudit(corpusWith('x', units, sources));
    expect(audit.perText).toHaveLength(1);
    expect(summary.audit).toEqual(audit.perText[0]);
  });
});

describe('text evidence interface strings', () => {
  it('exists in English and Malayalam', () => {
    const keys: UIKey[] = [
      'evidenceOverviewTitle',
      'evidenceOverviewLede',
      'metricUnits',
      'metricSources',
      'metricEvidenceLinked',
      'metricLocatorOnly',
      'evidenceCoverageTitle',
      'evidenceRelationsTitle',
      'sourcesRoleCoverage',
      'evidenceSourceOnly',
      'evidenceNotRepresented',
      'unresolvedBody',
      'reasonNoSourceRecord',
      'reasonNoUnitAssociation',
      'reasonNotesWithoutMapping',
      'reasonUnclassified',
      'openFirstEvidenceUnit',
      'openFirstLocatorUnit',
      'openFirstUnresolvedUnit',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('uses neutral language, never verification claims', () => {
    const banned = /verif|unverif|unreliab|unsupported|proven|historically/i;
    const keys: UIKey[] = [
      'evidenceOverviewTitle',
      'evidenceOverviewLede',
      'evidenceNotRepresented',
      'unresolvedBody',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key]).not.toMatch(banned);
    }
  });
});
