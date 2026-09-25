import { adaptSystemsToV2 } from '../adapters';
import { applyProvenanceCuration } from '../curate';
import { systems } from '../../../content/index';
import {
  buildEvidenceAudit,
  classifyUnresolvedUnit,
  formatEvidenceHuman,
} from '../report';
import type { CanonicalUnit } from '../schema';

/**
 * Scholarly evidence audit tests (Prompt: audit layer, not a new
 * provenance system). Corpus totals come from the real shared path —
 * adapt plus the same curation the chunk builder runs — so the numbers
 * below reproduce actual generated coverage rather than hard-coded
 * assumptions. Distinction rules use small synthetic fixtures.
 */

function curatedCorpus() {
  const corpus = adaptSystemsToV2(systems);
  applyProvenanceCuration(corpus);
  return corpus;
}

const bareUnit = (id: string, extra: Partial<CanonicalUnit> = {}): CanonicalUnit => ({
  id,
  number: '1',
  section: 'S',
  unitType: 'sutra' as const,
  iast: '',
  localisations: { en: { translation: 'T' }, ml: { translation: 'T-ml' } },
  ...extra,
});

describe('evidence audit corpus totals', () => {
  it('counts 17 texts and 4,060 units from the real curated corpus', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    expect(audit.texts).toBe(17);
    expect(audit.units).toBe(4060);
    expect(audit.perText).toHaveLength(17);
    expect(audit.perText.map((t) => t.textId)).toEqual(
      curatedCorpus().texts.map((t) => t.id),
    );
  });

  it('reproduces the actual current coverage numbers', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    expect(audit.textsWithSources).toBe(6);
    expect(audit.sourceRecords).toBe(8);
    expect(audit.sourcesWithRoles).toBe(4);
    expect(audit.sourceLinkedUnits).toBe(909);
    expect(audit.evidenceLinkedUnits).toBe(909);
    expect(audit.locatorUnits).toBe(894);
    expect(audit.locatorOnlyUnits).toBe(182);
    expect(audit.fullyLinkedUnits).toBe(909);
    expect(audit.unresolvedUnits).toBe(2969);
    const byId = new Map(audit.perText.map((t) => [t.textId, t]));
    expect(byId.get('yoga-sutras')).toMatchObject({
      unitCount: 195,
      sourceLinkedUnits: 195,
      evidenceLinkedUnits: 195,
      unresolvedUnits: 0,
    });
    expect(byId.get('bhagavad-gita')).toMatchObject({
      unitCount: 714,
      sourceLinkedUnits: 714,
      evidenceLinkedUnits: 714,
      locatorUnits: 712,
      unresolvedUnits: 0,
    });
    expect(byId.get('devi-mahatmya')).toMatchObject({
      unitCount: 184,
      sourceLinkedUnits: 0,
      evidenceLinkedUnits: 0,
      locatorUnits: 182,
      locatorOnlyUnits: 182,
      fullyLinkedUnits: 0,
      unresolvedUnits: 2,
    });
  });
});

describe('evidence audit distinctions', () => {
  it('keeps locator-only units out of evidence counts', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    const devi = audit.perText.find((t) => t.textId === 'devi-mahatmya');
    expect(devi?.evidenceLinkedUnits).toBe(0);
    expect(devi?.fullyLinkedUnits).toBe(0);
    expect(devi?.locatorOnlyUnits).toBe(182);
  });

  it('keeps source-only units out of evidence and full linkage', () => {
    // Synthetic: attached source, no links, no locator.
    expect(
      classifyUnresolvedUnit(1, bareUnit('u', { sourceIds: ['s'] })),
    ).toBeNull();
  });

  it('never counts absent metadata as verified or unverified', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    const text = JSON.stringify(audit);
    expect(text).not.toContain('verified');
    expect(text).not.toContain('unverified');
    expect(audit.unresolvedReasons.unclassified).toBe(0);
  });
});

describe('evidence audit roles and relations', () => {
  it('reports the exact deployed vocabularies from curated records', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    expect(audit.sourceRoleCounts).toEqual({
      'primary-text': 2,
      commentary: 2,
      unclassified: 4,
    });
    expect(audit.evidenceRelationCounts).toEqual({ commentary: 388, text: 909 });
  });
});

describe('evidence audit unresolved reasons', () => {
  it('classifies known gaps from observable state only', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    // 4,060 − 1,655 units in the six sourced texts.
    expect(audit.unresolvedReasons['no-source-record']).toBe(2405);
    expect(audit.unresolvedReasons['notes-without-deterministic-mapping']).toBe(2);
    expect(audit.unresolvedReasons['no-unit-association']).toBe(335 + 144 + 83);
    const gita = audit.unresolved.find((r) => r.textId === 'bhagavad-gita');
    expect(gita).toBeUndefined();
    const devi = audit.unresolved.find(
      (r) => r.textId === 'devi-mahatmya' && r.reason === 'notes-without-deterministic-mapping',
    );
    expect(devi?.units).toBe(2);
  });

  it('classifies synthetic units by the documented rules', () => {
    expect(classifyUnresolvedUnit(0, bareUnit('u'))).toBe('no-source-record');
    expect(classifyUnresolvedUnit(2, bareUnit('u'))).toBe('no-unit-association');
    expect(
      classifyUnresolvedUnit(2, bareUnit('u', { interpretiveNotes: [{ note: 'n' }] })),
    ).toBe('notes-without-deterministic-mapping');
    expect(
      classifyUnresolvedUnit(2, bareUnit('u', { sourceIds: ['s'] })),
    ).toBeNull();
    expect(
      classifyUnresolvedUnit(2, bareUnit('u', { provenance: { locator: 'p.1' } })),
    ).toBeNull();
  });
});

describe('evidence audit determinism and shape', () => {
  it('produces byte-identical output on repeat runs', () => {
    const first = JSON.stringify(buildEvidenceAudit(curatedCorpus()));
    const second = JSON.stringify(buildEvidenceAudit(curatedCorpus()));
    expect(first).toBe(second);
  });

  it('renders the human sections without throwing', () => {
    const text = formatEvidenceHuman(buildEvidenceAudit(curatedCorpus()));
    for (const heading of [
      'Darśana Scholarly Evidence Audit',
      'Unit evidence',
      'Evidence relations',
      'Source roles',
      'Unresolved evidence',
      'Curation queue',
    ]) {
      expect(text).toContain(heading);
    }
  });

  it('queues texts factually without ranking or scores', () => {
    const audit = buildEvidenceAudit(curatedCorpus());
    expect(audit.curationQueue.curated).toEqual(['yoga-sutras', 'bhagavad-gita', 'devi-mahatmya']);
    expect(audit.curationQueue.notesOnly).toEqual([
      'vishnu-sahasranama',
      'lalita-sahasranama',
      'tantraloka',
    ]);
    expect(audit.curationQueue.noEvidence).toHaveLength(11);
    const flat = JSON.stringify(audit.curationQueue);
    expect(flat).not.toContain('score');
    expect(flat).not.toContain('best');
  });
});
