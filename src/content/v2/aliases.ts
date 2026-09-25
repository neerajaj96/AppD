import type { AliasStatus, V2Alias } from './schema';
import { SCHEMA_VERSION } from './schema';

/**
 * Authoritative editorial alias dataset (Prompt 7 — identity layer).
 *
 * Each row states that a human spelling names one canonical concept
 * (`tradition/text/concept` triple). A future content editor edits THIS
 * file: one row per claim, each with a note and a status.
 *
 * - `verified`: curated equivalence, safe for search/disambiguation.
 *   Several verified rows may share one alias — that is honest
 *   ambiguity (e.g. `ātman` in Nyāya and Vaiśeṣika), surfaced as a
 *   choice, never merged.
 * - `review`: candidate awaiting scholarship. Inert in resolution,
 *   counted and warned on by validation.
 *
 * Deliberately NOT here: lexical near-misses the normaliser already
 * unites (diacritics, case, `_`/space/`-`), and similarity-only guesses
 * such as asat/sat-kāryavāda (opposites) or sahasranāma name slugs.
 * Similarity may suggest an identity; only these rows establish one.
 */

export interface EditorialAlias extends V2Alias {
  status: AliasStatus;
  note: string;
}

export const EDITORIAL_ALIASES: EditorialAlias[] = [
  {
    alias: 'adṛṣṭa',
    canonicalId: 'mimamsa/mimamsa-sutras/adrishta',
    status: 'verified',
    note: 'Mīmāṃsā article titled अदृष्ट (adṛṣṭa), unseen spiritual result.',
  },
  {
    alias: 'adṛṣṭa',
    canonicalId: 'nyaya/nyaya-sutras/adrshta',
    status: 'verified',
    note: 'Nyāya article titled अदृष्ट (adṛṣṭa), unseen force. Distinct article, same word — ambiguous by design.',
  },
  {
    alias: 'adrsta',
    canonicalId: 'mimamsa/mimamsa-sutras/adrishta',
    status: 'verified',
    note: 'ASCII spelling without h.',
  },
  {
    alias: 'adrsta',
    canonicalId: 'nyaya/nyaya-sutras/adrshta',
    status: 'verified',
    note: 'ASCII spelling without h. Distinct article, same word — ambiguous by design.',
  },
  {
    alias: 'ātman',
    canonicalId: 'nyaya/nyaya-sutras/atman',
    status: 'verified',
    note: 'Nyāya self (ātman).',
  },
  {
    alias: 'ātman',
    canonicalId: 'vaisesika/vaisesika-sutras/atman',
    status: 'verified',
    note: 'Vaiśeṣika self. Distinct article, same word — ambiguous by design.',
  },
  {
    alias: 'duhkhatraya',
    canonicalId: 'samkhya/samkhya-karika/duhkha-traya',
    status: 'verified',
    note: 'Unhyphenated spelling of a single Sāṃkhya article.',
  },
  {
    alias: 'sat-karya-vada',
    canonicalId: 'samkhya/samkhya-karika/satkaryavada',
    status: 'verified',
    note: 'Hyphen-placement variant of the Sāṃkhya article.',
  },
  {
    alias: 'sat-karya-vada',
    canonicalId: 'yoga/yoga-sutras/satkaryavada',
    status: 'verified',
    note: 'Hyphen-placement variant of the Yoga article. Distinct article — ambiguous by design.',
  },
  {
    alias: 'māyā',
    canonicalId: 'kashmir-shaivism/tantraloka/maya-tattva',
    status: 'review',
    note: 'Candidate: bare name versus tattva article. Needs scholarship — do not resolve yet.',
  },
  {
    alias: 'purusha',
    canonicalId: 'samkhya/samkhya-karika/purusha-svarupa',
    status: 'review',
    note: 'Candidate: several purusha-* articles exist across traditions. Needs scholarship — do not resolve yet.',
  },
  // Rāmakaṇṭha-grounded Gītā pilot concepts (Phase 3). Verified
  // search spellings for the seven source-grounded records; each note
  // states the Sanskrit term so a spelling never silently equates
  // distinct notions (karma-action vs karman-result stay separate rows).
  {
    alias: 'karma',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-karman',
    status: 'verified',
    note: 'Enjoined action (karman) in Rāmakaṇṭha; result/impression senses stay unmerged.',
  },
  {
    alias: 'karman',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-karman',
    status: 'verified',
    note: 'IAST head form of the Rāmakaṇṭha karman record.',
  },
  {
    alias: 'jnana',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-jnana',
    status: 'verified',
    note: 'Discriminative Self-knowledge (jñāna) in Rāmakaṇṭha.',
  },
  {
    alias: 'samuccaya',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-samuccaya',
    status: 'verified',
    note: 'Knowledge-action conjunction (samuccaya) as Rāmakaṇṭha states it.',
  },
  {
    alias: 'jnana-karma-samuccaya',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-samuccaya',
    status: 'verified',
    note: 'Full thesis phrase converging on the samuccaya record.',
  },
  {
    alias: 'prakriti',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-prakriti',
    status: 'verified',
    note: 'Objective field-principle (prakṛti) in Rāmakaṇṭha; Sāṅkhya mūlaprakṛti stays a distinct article.',
  },
  {
    alias: 'prakrti',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-prakriti',
    status: 'verified',
    note: 'ASCII spelling without diacritic.',
  },
  {
    alias: 'purusha',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-purusa',
    status: 'verified',
    note: 'Conscious principle (puruṣa) in Rāmakaṇṭha. Distinct article — ambiguous by design with the review-row Sāṅkhya candidate.',
  },
  {
    alias: 'purusa',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-purusa',
    status: 'verified',
    note: 'ASCII spelling without diacritics.',
  },
  {
    alias: 'maya',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-maya',
    status: 'verified',
    note: 'The Lord’s own power (māyā-śakti) in Rāmakaṇṭha. Distinct article — ambiguous by design with the review-row Tantrāloka candidate.',
  },
  {
    alias: 'moksha',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-moksa',
    status: 'verified',
    note: 'Release (mokṣa/apavarga) in Rāmakaṇṭha.',
  },
  {
    alias: 'moksa',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-moksa',
    status: 'verified',
    note: 'ASCII spelling without diacritic.',
  },
  {
    alias: 'apavarga',
    canonicalId: 'vedanta/bhagavad-gita/gita-rk-moksa',
    status: 'verified',
    note: 'Highest human end (apavarga) as the upodghāta states it.',
  },
];

/** Rows safe for resolution (verified only — review rows stay inert). */
export function verifiedAliases(rows: V2Alias[] = EDITORIAL_ALIASES): V2Alias[] {
  return rows.filter((r) => (r.status || 'verified') === 'verified');
}

/** Build artifact shape for `public/content/aliases.json`. */
export interface AliasFile {
  schemaVersion: typeof SCHEMA_VERSION;
  generatedAt: string;
  aliases: V2Alias[];
}
