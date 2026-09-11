import { lsConcepts001100 } from './concepts/ls-concepts-001-100';
import { lsConcepts101200 } from './concepts/ls-concepts-101-200';
import { lsConcepts201300 } from './concepts/ls-concepts-201-300';
import { lsConcepts301400 } from './concepts/ls-concepts-301-400';
import { lsConcepts401500 } from './concepts/ls-concepts-401-500';
import { lsConcepts501600 } from './concepts/ls-concepts-501-600';
import { lsConcepts601700 } from './concepts/ls-concepts-601-700';
import { lsConcepts701800 } from './concepts/ls-concepts-701-800';
import { lsConcepts801900 } from './concepts/ls-concepts-801-900';
import { lsConcepts9011000 } from './concepts/ls-concepts-901-1000';

export interface RawConceptLs {
  id: string;
  title: string;
  category?: string;
  summary: string;
  relatedVerseIds?: string[];
}

// All 1000 nāmas with full per-nāma commentary (own paraphrases of the
// Bhāskararāya-lineage reading; see lalita-sahasranama-source-provenance.ts).
// Concept entries live in ./concepts/ in blocks of 100; merged here directly
// so ids, order and verse links stay sequence-verified.
export const lalitaSahasranamaConceptsEn: any[] = [
  ...lsConcepts001100,
  ...lsConcepts101200,
  ...lsConcepts201300,
  ...lsConcepts301400,
  ...lsConcepts401500,
  ...lsConcepts501600,
  ...lsConcepts601700,
  ...lsConcepts701800,
  ...lsConcepts801900,
  ...lsConcepts9011000,
];
