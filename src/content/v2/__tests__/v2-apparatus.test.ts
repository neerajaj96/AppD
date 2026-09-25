import {
  EVIDENCE_RELATION_LABEL,
  SOURCE_ROLE_LABEL,
  evidenceRelationLabelKey,
  resolveEvidenceRows,
  sourceRoleLabelKey,
} from '../../../components/Provenance';
import { EVIDENCE_RELATIONS, SOURCE_RECORD_ROLES } from '../schema';
import { formatCitation, selectCitationSource } from '../citation';
import { uiStrings, type UIKey } from '../../../i18n/ui';
import type { V2Source } from '../schema';

const source = (id: string, extra: Partial<V2Source> = {}): V2Source => ({
  id,
  title: `Title ${id}`,
  ...extra,
});

// Scholarly apparatus presentation tests: the reader UX must keep source
// roles and evidence relations visually and semantically separate, render
// every supported relation through its localised label, and leave
// citation generation byte-identical. Pure data assertions only — no DOM,
// no CSS class coupling.
describe('evidence relation rendering data', () => {
  it('maps every supported relation to its localised label', () => {
    expect(Object.keys(EVIDENCE_RELATION_LABEL).sort()).toEqual([...EVIDENCE_RELATIONS].sort());
    for (const relation of EVIDENCE_RELATIONS) {
      const key = EVIDENCE_RELATION_LABEL[relation];
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps relation labels distinct within each language', () => {
    for (const lang of ['en', 'ml'] as const) {
      const labels = EVIDENCE_RELATIONS.map((r) => uiStrings[lang][EVIDENCE_RELATION_LABEL[r]]);
      expect(new Set(labels).size).toBe(EVIDENCE_RELATIONS.length);
    }
  });

  it('resolves known relations and ignores unknown values without throwing', () => {
    expect(evidenceRelationLabelKey('text')).toBe('relationText');
    expect(evidenceRelationLabelKey('commentary')).toBe('relationCommentary');
    expect(evidenceRelationLabelKey('oracle')).toBeUndefined();
    expect(evidenceRelationLabelKey('')).toBeUndefined();
    expect(evidenceRelationLabelKey(undefined)).toBeUndefined();
  });
});

describe('source role rendering data', () => {
  it('maps every vocabulary role to a localised label', () => {
    expect(Object.keys(SOURCE_ROLE_LABEL).sort()).toEqual([...SOURCE_RECORD_ROLES].sort());
    for (const role of SOURCE_RECORD_ROLES) {
      const key = SOURCE_ROLE_LABEL[role];
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps source roles and evidence relations as separate label sets', () => {
    const roleKeys = new Set(Object.values(SOURCE_ROLE_LABEL));
    const relationKeys = new Set(Object.values(EVIDENCE_RELATION_LABEL));
    for (const key of roleKeys) {
      expect(relationKeys.has(key)).toBe(false);
    }
  });

  it('resolves known roles and ignores unknown values without throwing', () => {
    expect(sourceRoleLabelKey('primary-text')).toBe('rolePrimaryText');
    expect(sourceRoleLabelKey('commentary')).toBe('roleCommentary');
    expect(sourceRoleLabelKey('Primary-Text')).toBeUndefined();
    expect(sourceRoleLabelKey(undefined)).toBeUndefined();
  });
});

describe('evidence row resolution', () => {
  const records = [
    source('s1', { role: 'primary-text' }),
    source('s2', { role: 'commentary' }),
    source('s3'),
  ];

  it('preserves every attached source in registry order', () => {
    const rows = resolveEvidenceRows(records);
    expect(rows.map((r) => r.source.id)).toEqual(['s1', 's2', 's3']);
  });

  it('pairs relations per source without fabricating absent ones', () => {
    const rows = resolveEvidenceRows(records, [
      { sourceId: 's1', relation: 'text' },
      { sourceId: 's2', relation: 'commentary' },
    ]);
    expect(rows[0].relation).toBe('text');
    expect(rows[1].relation).toBe('commentary');
    // A source without a link shows normally: no relation badge.
    expect(rows[2].relation).toBeUndefined();
  });

  it('ignores dangling and invalid links instead of crashing', () => {
    const rows = resolveEvidenceRows([source('s1')], [
      { sourceId: 'ghost', relation: 'text' },
      { sourceId: 's1', relation: 'oracle' as never },
    ]);
    // The dangling target matches nothing; the invalid relation is dropped.
    expect(rows).toHaveLength(1);
    expect(rows[0].relation).toBeUndefined();
  });

  it('handles empty registries and absent links', () => {
    expect(resolveEvidenceRows([])).toEqual([]);
    expect(resolveEvidenceRows([source('s1')], [])[0].relation).toBeUndefined();
    expect(resolveEvidenceRows([source('s1')], undefined)[0].relation).toBeUndefined();
  });
});

describe('apparatus empty-state and locator strings', () => {
  it('exists in English and Malayalam without placeholder drift', () => {
    const keys: UIKey[] = [
      'evidenceTitle',
      'sourceLocatorLabel',
      'noSourcesTitle',
      'noSourcesBody',
      'locatorOnlyNote',
      'editorialNote',
      'sourceDetails',
      'externalLinkNote',
    ];
    for (const key of keys) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
  });

  it('never claims absence of a historical source', () => {
    expect(uiStrings.en.noSourcesBody).not.toMatch(/no source\b/i);
    expect(uiStrings.en.noSourcesTitle).not.toMatch(/no source exists/i);
  });
});

describe('apparatus accessibility strings', () => {
  it('labels the copy action and both feedback outcomes', () => {
    for (const key of ['copyCitation', 'citationCopied', 'citationCopyFailed'] as UIKey[]) {
      expect(uiStrings.en[key].trim().length).toBeGreaterThan(0);
      expect(uiStrings.ml[key].trim().length).toBeGreaterThan(0);
    }
    expect(uiStrings.en.copyCitation).not.toBe(uiStrings.en.citationCopied);
  });

  it('identifies external links as leaving Darśana', () => {
    expect(uiStrings.en.externalLinkNote.toLowerCase()).toContain('leaves');
    expect(uiStrings.ml.externalLinkNote.trim().length).toBeGreaterThan(0);
  });
});

describe('apparatus citation stability', () => {
  it('keeps citation output unchanged for existing cases', () => {
    expect(
      formatCitation({
        textTitle: 'Yoga Sūtras',
        unitNumber: 'I.2',
        author: 'Patañjali',
        edition: 'Kashi ed.',
        publisher: 'Chowkhamba',
        year: 1930,
        locator: 'Samādhi-pāda',
        url: 'https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2',
      }),
    ).toBe(
      'Yoga Sūtras, I.2. Patañjali. Kashi ed., Chowkhamba, 1930. Samādhi-pāda. Darśana canonical unit: https://x.test/#/system/yoga/text/yoga-sutras/verse/I.2.',
    );
    expect(formatCitation({ textTitle: 'T', unitNumber: '1', url: 'https://x.test/#/u' })).toBe(
      'T, 1. Darśana canonical unit: https://x.test/#/u.',
    );
  });

  it('keeps text-relation preference and deterministic fallback', () => {
    const text = source('t1');
    const commentary = source('c1');
    expect(selectCitationSource([commentary, text], [{ sourceId: 't1', relation: 'text' }])).toBe(text);
    expect(selectCitationSource([commentary, text])).toBe(commentary);
    expect(selectCitationSource([], [{ sourceId: 't1', relation: 'text' }])).toBeUndefined();
    expect(selectCitationSource([commentary], [{ sourceId: 'ghost', relation: 'text' }])).toBe(commentary);
  });
});
