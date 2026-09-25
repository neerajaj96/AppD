import type { V2EvidenceRelation, V2Source } from './schema';

/**
 * Curated edition/source records (evidence-backed provenance scaling).
 *
 * Each record transcribes ONLY facts stated verbatim in per-unit
 * interpretive notes already present in the legacy content files. No
 * field is inferred: publisher appears only where the note names one,
 * years only where printed, rights only where stated (`public-domain`
 * for the Vivekananda lectures). Records carry the full note text so
 * every structured field stays traceable to its sentence.
 *
 * Texts NOT listed here have no per-unit edition statements in the
 * repository and must not receive records. See docs/PROVENANCE.md
 * (pilot + scaling) for the classification.
 */

export interface CuratedSource extends V2Source {
  id: string;
  title: string;
}

export const YOGA_SOURCES: CuratedSource[] = [
  {
    id: 'yoga-sutras-source-kashi-83',
    title: 'Kashi Sanskrit Series No.83',
    edition: 'Yogashastra Section No.1',
    year: 1930,
    // Role evidence: the note states the sutra-patha comes from this
    // edition's opening gathering — it is the primary Sanskrit text.
    role: 'primary-text',
    notes:
      'Kashi Sanskrit Series No.83 (Yogashastra Section No.1), Dhundhiraj Shastri ed. (Benares, 1930): sutra-patha in the opening gathering; tika section opens with Bhoja’s Rajamartanda, followed by Bhava-Ganesa’s Pradipika, Nagoji Bhatta’s Vrtti, Ramananda’s Maniprabha, Anantadeva’s Chandrika and Sadasivendra’s Yogasudhakar.',
  },
  {
    id: 'yoga-sutras-source-vivekananda-raja-yoga',
    title: 'Raja-Yoga',
    author: 'Swami Vivekananda',
    year: '1895-96',
    rights: 'public-domain',
    // Role evidence: the note twice calls this a commentary consulted
    // for glosses — not a source of the Sanskrit text.
    role: 'commentary',
    notes:
      'Swami Vivekananda, Raja-Yoga commentary on the Patanjali Yoga Sutras (1895-96 New York lectures; public-domain edition): consulted for the Vivekananda gloss in the commentary; where his edition numbers or omits a sutra differently, the commentary notes it.',
  },
  {
    id: 'yoga-sutras-source-satyananda-four-chapters',
    title: 'Four Chapters on Freedom',
    author: 'Swami Satyananda Saraswati',
    publisher: 'Yoga Publications Trust, Munger',
    // Role evidence: the note names it a commentary consulted for
    // glosses. Its practice orientation describes emphasis, not a
    // separate role, so no second label is invented.
    role: 'commentary',
    notes:
      'Swami Satyananda Saraswati, Four Chapters on Freedom: Commentary on the Yoga Sutras of Patanjali (Yoga Publications Trust, Munger): consulted for the practice-orientated gloss — sutras as complete instructions and map for sadhana, verified by experience rather than debate.',
  },
];

export const GITA_SOURCES: CuratedSource[] = [
  {
    id: 'bhagavad-gita-source-ksts-64',
    title: 'Bhagavadgītā with Sarvatobhadra of Rājānaka Rāmakantha',
    edition: 'Kashmir Series of Texts and Studies No. LXIV',
    year: 1943,
    // Role evidence: the note calls this the Sanskrit-only source from
    // which the rendering was made — the primary text, not a translation
    // (the English is the project's own, unattributed, so no author or
    // translator field is filled).
    role: 'primary-text',
    notes:
      'Kashmir Series of Texts and Studies No. LXIV (1943): Bhagavadgītā with Sarvatobhadra of Rājānaka Rāmakantha, ed. Madhusudan Kaul Shastri; Sanskrit-only source, English rendering original to this project.',
  },
];

/** Per-text curated registries, keyed by text id. */
export const CURATED_SOURCES_BY_TEXT: Record<string, CuratedSource[]> = {
  'yoga-sutras': YOGA_SOURCES,
  'bhagavad-gita': GITA_SOURCES,
};

/**
 * Note prefixes identifying which curated source a unit's interpretive
 * note invokes, in stable registry order. A unit attaches exactly the
 * records whose notes it carries — 193 yoga units attach all three,
 * IV.17/IV.18 attach two, gita adhika units attach the KSTS record
 * through their appendix prefix.
 */
export interface SourceNotePrefix {
  textId: string;
  sourceId: string;
  prefix: string;
  /**
   * Precise layer this source supports for matching units, stated only
   * where the unit notes say so explicitly:
   * - Kashi/KSTS notes name the edition the Sanskrit text comes from.
   * - The adhika `KSTS LXIV p.431:` prefix names the same edition's
   *   appendix as the source of the extra verses — hence `text`, the
   *   same layer as the mūla links, not a weaker association.
   * - Vivekananda/Satyananda notes say the work was consulted for a
   *   gloss *in the commentary* — hence commentary, not interpretation.
   */
  relation: V2EvidenceRelation;
}

export const SOURCE_NOTE_PREFIXES: Array<SourceNotePrefix> = [
  { textId: 'yoga-sutras', sourceId: 'yoga-sutras-source-kashi-83', prefix: 'Kashi Sanskrit Series No.83', relation: 'text' },
  { textId: 'yoga-sutras', sourceId: 'yoga-sutras-source-vivekananda-raja-yoga', prefix: 'Swami Vivekananda, Raja-Yoga', relation: 'commentary' },
  { textId: 'yoga-sutras', sourceId: 'yoga-sutras-source-satyananda-four-chapters', prefix: 'Swami Satyananda Saraswati, Four Chapters on Freedom', relation: 'commentary' },
  { textId: 'bhagavad-gita', sourceId: 'bhagavad-gita-source-ksts-64', prefix: 'Kashmir Series of Texts and Studies No. LXIV', relation: 'text' },
  { textId: 'bhagavad-gita', sourceId: 'bhagavad-gita-source-ksts-64', prefix: 'KSTS LXIV p.431:', relation: 'text' },
];
