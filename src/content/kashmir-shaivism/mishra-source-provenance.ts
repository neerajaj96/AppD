// Source provenance for the merged Trika companion material.
//
// Verified against the Drive PDF (499 pp, PDFium, "Kashmir Shaivism —
// The Central Philosophy of Tantrism" by Kamalakar Mishra, First Indian
// Edition Delhi 1999, originally Rudra Press 1993).
//
// CARRY-OVER POLICY (copyright + architecture): Mishra's sentences are
// NOT reproduced anywhere in this app. What is carried over is structure
// (the 11-chapter arc below), our own concise paraphrases of each
// doctrine in EN (see mishra-trika-concepts-en.ts + mishra-trika-thread-en.ts
// here, and ../kundalini-tantra/mishra-bridge-concepts-en.ts for the
// foundation/practice chapters now housed in the Kuṇḍalinī Tantra text),
// and this per-chapter provenance table so no source chapter is silently
// dropped. Readers who want Mishra's full arguments, Sanskrit citations
// and notes (pp. 383-464) should consult the printed book.

export interface SourceSection {
  appIds: string;
  pdfPages: string;
  note: string;
}

export const mishraSourceProvenance: SourceSection[] = [
  { appIds: 'Preface + Acknowledgments + Abbreviations (framing only)', pdfPages: 'pp.14-20', note: 'Mishra states his program: a full exposition of Trika as the central philosophy of Tantrism, read mainly through Abhinavagupta\'s Tantraloka, making implicit logic explicit. App carries the program, not the prose.' },
  { appIds: 'mishra-tantra-agama (Ch.1: Introduction, etymology + textual history)', pdfPages: 'pp.25-70', note: 'General significance of Tantra; nivrtti-pravrtti amalgamation; denominations (Saiva/Sakta/Vaisnava/Bauddha); five Ms and Kaula; breaking false barriers (caste); Kashmir Shaivism as culmination; tantra/agama etymology (tantrana as systematic stretching; nigama-deduction vs agama-experience); Tryambaka legend; Abhinavagupta\'s significance.' },
  { appIds: 'mishra-epistemology, mishra-agama-pramana, mishra-error-theory (Ch.2: Epistemology)', pdfPages: 'pp.71-110', note: 'Consciousness as problem, nature and activity; self-illumined knowledge; consciousness as means; agama as scientific/valid knowledge with objections answered; limits of knowledge; higher experience and its self-guarantee; svatah-pramanya with the infinite-regress critique of paratah; Trika theory of error.' },
  { appIds: 'mishra-shiva-absolute (Ch.3 Part I: Siva)', pdfPages: 'pp.111-150', note: 'Siva as first person, Absolute, indeterminate, subject-consciousness, self-consciousness, absolute person, perfection (purna/infinite/free/bliss as one meaning), spiritual goodness; Knowledge-Will Absolute vs Advaita (Knowledge) and Madhyamika readings.' },
  { appIds: 'mishra-shakti-vak (Ch.3 Part II: Sakti)', pdfPages: 'pp.151-175', note: 'Nature of Sakti; compatibility of kriya with jnana; Siva-Sakti relation; kinds and two levels; synonyms/symbols (mother/Durga/Kali imagery); Sakti as Vak with the four levels (para/pasyanti/madhyama/vaikhari) and the mother-pregnancy analogy.' },
  { appIds: 'mishra-creation-tattvas (Ch.4-5: Creation + categories)', pdfPages: 'pp.176-215', note: 'Causation theory; fivefold cosmic functions (pancakrtya); creation as Vak; pure categories (suddhadhva) with the abheda criterion; maya; five sheaths (kancukas); purusa; twenty-four material categories; thirty-six-tattva pluralism objection answered.' },
  { appIds: 'mishra-abhasavada (Ch.5: Abhasavada)', pdfPages: 'pp.216-245', note: 'Meaning of abhasa; epistemology and ontology of appearance; abhasa called real (dream/mirror analogies); abhasavada as svatantryavada (theory of freedom); illusion theory contrasted (idealism vs mayavada).' },
  { appIds: 'mishra-evil-karma-lila (Ch.6: Problem of Evil)', pdfPages: 'pp.246-275', note: 'Presence of evil; theistic problem stated; free will and moral evil; God as real doer; ignorance as cause; suffering and karma law (with vice/virtue judgment fallibility); place of evil in lilavada.' },
  { appIds: 'mishra-pratyabhijna (Ch.7: Pratyabhijna)', pdfPages: 'pp.276-310', note: 'Centrality claim; meaning; intellectual vs existential knowledge; why called knowledge; mode and content (deeper Self, purnahanta); ego dissolution; Siva-pasu unity ground; levels; ground of all upayas; bhakti relevance; pratyabhijna vs aparoksanubhuti.' },
  { appIds: 'mishra-mala-moksa, mishra-spiritual-evolution (Ch.8: Bondage and Liberation)', pdfPages: 'pp.311-350', note: 'Meaning of bondage; mala (anava two readings, mayiya, karma); dream-king analogy; soul-hierarchy across Vaisesika/Samkhya/Vedanta/Tantra moksa; moksa as highest value synthesising dharma and kama; stages of the soul (pralayakala/sakala/vijnanakala + mantra/mant resvara/mahesvara/Siva-pramata) with the guna parallel; mantra as ideation (manana).' },
  { appIds: 'mishra-upayas (Ch.9: The Means of Moksa)', pdfPages: 'pp.351-385', note: 'Effort and grace; unity of means and end; anupaya/sambhavopaya/saktopaya/anavopaya with the willing-knowing-acting table; sattarka; general evaluation; place of negation; relaxed way of life; rational worship (idol/guru/kumari as ego-dissolving surrender); direct goodness/purity practice; pratibha (initiative) as fruit of attunement.' },
  { appIds: 'mishra-kaula-sadhana (Ch.10: Kaula sadhana + sex sublimation); conclusion formula carried in mishra-tantra-agama / mishra-kaula-sadhana summaries', pdfPages: 'pp.386-410', note: 'Rationale of Kaula; necessity of sex sublimation; holiness attitude toward sex and partner (Siva/Sakti regard); offering vs gratification (Kularnava warning verse paraphrased); phallic/devi worship meaning; stages of Kaula sadhana; appraisal.' },
  { appIds: 'Conclusion (framing + complementarity formula, paraphrased in-concept)', pdfPages: 'pp.411-499', note: 'Agamic kriya complements Vedic jnana (positive/negative, immanent/transcendent, yoga/sannyasa, left/right); Kaula seeds traced to Brhadaranyaka/Chandogya; scholarly notes/bibliography apparatus. Consult print for citations.' },
];
