/**
 * @file devi-mahatmya-intro-guptavati.ts
 * 
 * Substantive 16-topic analytical presentation of Mahāgnicit Bhāskararāya Dīkṣita's
 * 18th-century introductory treatise (Upoddhāta) to his Guptavatī commentary
 * on the Durgā Saptaśatī (Devī Māhātmya).
 * 
 * Each entry substantively paraphrases Bhāskararāya's arguments, hermeneutics,
 * and ritual instructions in order, citing only a short tagged phrase from the
 * original Sanskrit text.
 */

import { guptavatiUpodghataEn } from './devi-mahatmya-upodghata-en';
import type { UpodghataTopicEn } from './devi-mahatmya-upodghata-en';
export { guptavatiUpodghataEn };
export type { UpodghataTopicEn };

export interface RawConceptEn {
  id: string;
  title: string;
  category: string;
  summary: string;
  relatedVerseIds?: string[];
  relatedConceptIds?: string[];
}

export interface RawConceptMl {
  id: string;
  title: string;
  category: string;
  summary: string;
  relatedVerseIds?: string[];
  relatedConceptIds?: string[];
}

export interface GuptavatiIntroTopic {
  id: string;
  topicNumber: number;
  title: string;
  sanskritPhrase: string;
  content: string;
  relatedVerseIds?: string[];
}

export const guptavatiIntroTopics: GuptavatiIntroTopic[] = [
  {
    id: 'guptavati-1-provenance',
    topicNumber: 1,
    title: 'Provenance: Bhāskararāya Dīkṣita’s Authentic 18th-Century Upoddhāta',
    sanskritPhrase: 'भारत्युपाह्वयगम्भीररायदीक्षितसूरिसूनुना भास्कररायदीक्षितमहाग्निचिता',
    content: `This introductory treatise (Upoddhāta-prakaraṇa) is not a modern scholarly preface or an anonymous editorial compilation. It is the authentic, historic 18th-century masterwork composed directly by the polymath Mahāgnicit Bhāskararāya Dīkṣita (initiatory name Bhāsurānandanātha), the foremost luminary of the late Śrīvidyā and Śākta Advaita traditions. 

Writing from the scholarly lineage of Gambhīrarāya Dīkṣita and Konambā, Bhāskararāya composed this rigorous prelude at the sacred confluence of the Ganges and Yamuna (Prayāga) to introduce his celebrated commentary, the Guptavatī. He opens by tracing his spiritual transmission directly through the non-dual Guru-lineage descending from Ādi Śaṅkarācārya and Ānandabhairava. 

Rather than treating the Devī Māhātmya as a popular mythological narrative from the Mārkaṇḍeya Purāṇa, Bhāskararāya approaches it through the technical disciplines of classical Sanskrit learning: Pāṇinian grammar (Vyākaraṇa), ritual hermeneutics (Pūrva Mīmāṃsā), non-dual ontology (Uttara Mīmāṃsā / Vedānta), and esoteric Śākta Āgama (Tantra). He demonstrates that the text is an integrated, self-contained Vedic-Tantric Mahā-mantra whose surface narration conceals a profound sonic and contemplative architecture.`,
    relatedVerseIds: ['dm-1-1']
  },
  {
    id: 'guptavati-2-purpose-naming',
    topicNumber: 2,
    title: 'Stated Purpose in Naming the Commentary "Guptavatī"',
    sanskritPhrase: 'सप्तशती लुप्तसृतीराप्तवती',
    content: `Bhāskararāya explicitly explains his choice of the title Guptavatī ("The Concealer / Possessor of Hidden Secrets"). Over many centuries, uninitiated or superficial commentators had reduced the Saptaśatī to literal storytelling, obscuring its esoteric seed-syllables (mantroddhāra), miscounting its sacrificial units, and failing to harmonize its ritual directives across authoritative Tantras.

He declares that the true esoteric path (sṛti) of the Saptaśatī had become virtually lost (lupta) due to negligent transmissions and contradictory interpretations found in circulating manuscripts. His commentary is named Guptavatī because it serves as the definitive custodian of that which was hidden (gupta). 

Its purpose is twofold: first, to conceal the most sacred esoteric mysteries from unqualified and casual dabblers who might misuse the occult energies; and second, to reveal and clarify these exact secrets—the hidden bījas, the unsealing algorithms, the correct homa enumerations, and the underlying non-dual metaphysics—to genuine initiates and discerning scholars equipped with traditional training.`,
    relatedVerseIds: ['dm-1-1', 'dm-kavacha-1', 'dm-keelaka-0']
  },
  {
    id: 'guptavati-3-fourteen-verse-toc',
    topicNumber: 3,
    title: 'The 14-Verse Structural Table of Contents (Anukramaṇikā)',
    sanskritPhrase: 'चतुर्दशभिर्विभज्य श्लोकैः प्रतिज्ञानीते',
    content: `In fourteen programmatic verses, Bhāskararāya establishes the formal architectural table of contents for the entire treatise, methodically outlining each section before commencing detailed exposition:

1. Invocation of the supreme non-dual Guru-lineage, revering Śiva, Śakti, and Śaṅkara.
2. The nested lineage of transmission: from Lord Brahmā down to sage Mārkaṇḍeya, from Mārkaṇḍeya to his disciple Krauṣṭuki Bhāguri, and from the celestial birds (Dharma-pakṣins) to Jaimini.
3. The authoritative canonical sources relied upon, establishing the paramount status of the Kātyāyanī Tantra, Dāmara Tantra, and Mārīci Kalpa.
4. The extraction of the sovereign nine-syllabled formula (Navārṇa Mantra) encoded within the narrative.
5. The definitive resolution of the title "Saptaśatī" and its exact 700-unit ritual parsing.
6. The dual preparatory requirements: curse-removal (Śāpoddhāra) and sonic unsealing (Utkīlana).
7. The exposition of the three preliminary armor-hymns: Kavaca, Argalā, and Kīlaka.
8. The esoteric Guru-Kīlaka preserved in the Rahasya-tantras.
9. Exposition of the First Episode (Prathama Carita) and its 100-verse condensation.
10. Exposition of the Middle Episode (Madhyama Carita) slaying Mahiṣāsura.
11. Exposition of the Final Episode (Uttama Carita) across its six battle chapters.
12. The supreme theology of the hymns in Chapter 11 (Nārāyaṇī Stuti) and Chapter 12 (Phalaśruti).
13. Harmonization of conflicting traditions from the Yāmala, Vārāhī, and Bhrigu-saṃhitā.
14. Exposition of the three closing philosophical secrets: Prādhānika, Vaikṛtika, and Mūrti Rahasyas.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-1', 'dm-5-1', 'dm-11-1', 'dm-12-1']
  },
  {
    id: 'guptavati-4-philosophical-case-candi',
    topicNumber: 4,
    title: 'The Philosophical Case for "Caṇḍī" and Śakti as Brahman’s Inherent Nature',
    sanskritPhrase: 'परब्रह्मणः पट्टमहिषी देवता',
    content: `Bhāskararāya provides an uncompromising Advaitic defense of the supreme deity Caṇḍī, defining her as the sovereign crowned Empress (paṭṭamahiṣī) of Non-Dual Parabrahman. Etymologically grounding the name in the verbal root caḍi kope (to blaze with righteous fury or transcend all empirical limitations), he refutes the objection that wrath is a psychological defect unworthy of the Absolute. 

Drawing upon the Kaṭha Upaniṣad verse "mahad bhayaṃ vajram udyatam", he demonstrates that this divine anger is nothing other than the cosmic dread before which the wind blows, the sun rises, and fire burns. It represents the irresistible, unconditioned transcendence of Brahman that annihilates the egoistic pretensions of ignorance.

Synthesizing his own treatise Ratnatraya-parīkṣā with Kashmir Shaiva Spanda metaphysics, he argues that Ultimate Reality is one undivided Brahman (the substance/dharmī) whose intrinsic nature (dharma) is dynamic awareness (cit) and omnipotent capacity (Śakti). Just as luminosity cannot be separated from the sun or heat from fire, Śakti is not an external instrument created by God; she is Brahman's own innate capability of perception, volition, and action (svābhāvikī jñāna-bala-kriyā ca). 

He reinterprets the opening aphorism of the Kaulopaniṣad, "athāto dharmajijñāsā", to signify inquiry into this dynamic Cit-Śakti, proving that worship of Caṇḍī is direct realization of Supreme Brahman.`,
    relatedVerseIds: ['dm-1-54', 'dm-1-66', 'dm-5-14']
  },
  {
    id: 'guptavati-5-navarna-derivation',
    topicNumber: 5,
    title: 'Letter-by-Letter Derivation of the Navārṇa Mantra from the Opening Verse',
    sanskritPhrase: 'सावर्णिः सूर्यतनयो यो मनुः कथ्यतेऽष्टमः',
    content: `In a brilliant display of classical mantroddhāra (alphabetic mantra extraction), Bhāskararāya demonstrates how the celebrated nine-syllabled mantra—Aiṃ Hrīṃ Klīṃ Cāmuṇḍāyai Vicce—is cryptically encoded within the opening verse of the Devī Māhātmya: "sāvarṇiḥ sūryatanayo yo manuḥ kathyate 'ṣṭamaḥ".

Citing the Devy Atharvaśīrṣa and Śrīvidyā tantric codices:
- The name "Sāvarṇiḥ" indicates the primordial Prakṛti (savarṇā) and yields the primary seed Hrīṃ through the combination of the eighth vowel, the aspiration (h), and the solar ray (repha).
- "Sūrya-tanaya" (son of the Sun, Fire / r) supplies the fiery consonant, which when united with the lunar seed and bindu manifests the Vāgbhava seed Aiṃ (representing Mahāsarasvatī) and the Kāmarāja seed Klīṃ (representing Mahākālī).
- The syllable "Cā" is extracted from the sixth consonant after ka (ca) combined with the long vowel ā.
- "Muṃ" is generated from the fifth vowel joined with the nasal resonance.
- "Ḍā" is derived from the third consonant of the cerebral series (ḍa) fused with the Nārāyaṇa-vowel.
- "Yai" is formed through the semi-vowel ya united with the diphthong ai.
- "Vicce" forms the concluding terminal invocation of spiritual liberation.

Bhāskararāya thus proves that the text does not begin with an arbitrary historical chronicle, but immediately conceals the master seed-syllables of the three supreme Goddesses.`,
    relatedVerseIds: ['dm-1-1']
  },
  {
    id: 'guptavati-6-etymology-camunda-vicce',
    topicNumber: 6,
    title: 'Esoteric Etymologies of "Cāmuṇḍā" and "Vicce"',
    sanskritPhrase: 'चमूं डाति इति चामुण्डा',
    content: `Bhāskararāya conducts a profound grammatical and semantic analysis of the two defining terms in the Navārṇa formula:

1. Cāmuṇḍā: While the outer story states that the Goddess was named Cāmuṇḍā because she decapitated the demons Caṇḍa and Muṇḍa (Chapter 7), Bhāskararāya reveals the inner yogic etymology: camūṃ dāti / lāti iti cāmuṇḍā. Here, camū denotes the vast collective army of objective appearances—the multi-layered sensory illusion and mental modifications of the empirical universe. The root dā (or lā) signifies to consume, absorb, and dissolve entirely into the non-dual Self (svātmasāt-karaṇena nāśayati). Cāmuṇḍā is therefore the blazing unconditioned awareness that swallows the entire manifestation of duality back into pure consciousness.

2. Vicce: Addressing the unusual form vicce, Bhāskararāya rejects the simplistic view that it is meaningless gibberish. Drawing on his grammatical work Bhāṭṭa-candrodaya and the Pikanemādhikaraṇa of Pūrva Mīmāṃsā, he shows that sacred non-classical or dialectical formations in tantric mantras hold concentrated technical significance. Deconstructing it into vit + ca + e, or rooting it in the verbal root vicc (to sever or loosen), vicce functions as an imperative spiritual prayer: "Sever the knots of my heart! Untie the cords of ignorance!" (avidyā-pāśa-hṛdaya-granthiṃ visraṃsya muñca mām). It is the soul's direct cry for instantaneous liberation (mokṣa).`,
    relatedVerseIds: ['dm-7-19', 'dm-1-1']
  },
  {
    id: 'guptavati-7-naming-saptasati',
    topicNumber: 7,
    title: 'Why the Text is Called "Saptaśatī" Despite Lacking 700 Metrical Verses',
    sanskritPhrase: 'न श्लोकसंख्यया तेषां षट्शतीतोऽपि न्यूनत्वात्',
    content: `A central textual dilemma addressed by Bhāskararāya is why the work is universally revered as the Saptaśatī ("The Seven Hundred") when its actual metrical verses (ślokas) count fewer than 600 across all authentic manuscripts—varying between 578 in the Kātyāyanī Tantra, 579 in the Yāmala, and 588 in the Vārāhī Tantra. Even if one artificially bundles the preliminary hymns (Kavaca, Argalā, Kīlaka) and the three Rahasyas, the total exceeds 700, making a literal verse-count unsustainable.

Bhāskararāya surveys traditional explanations:
- Some suggest the name refers to seven hundred spiritual paths or seven foundational forms of the Mother.
- Others attempt complex artificial verse aggregations.

His definitive Mīmāṃsaka resolution rests on the liturgical reality of the sacrificial oblation count (homa-mantra-saṅkhyā). Just as the Vedic Śatarudrīya is designated not by verse lines but by its distinct ritual utterances, the entire Devī Māhātmya is treated as a continuous, indivisible Garland Mantra (Mālā-mantra). 

When parsed for ritual offering, every half-verse carrying an independent syntactic injunction, every prose speaker-indication (such as "ṛṣir uvāca" or "rājovāca"), and every full stanza is assigned an individual sacrificial terminus (svāhā for fire oblations, namaḥ for worship, and tarpayāmi for libations). Enumerated in this precise liturgical manner, the text yields exactly 700 sacred mantra-units.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-1', 'dm-13-13']
  },
  {
    id: 'guptavati-8-dhyana-yantra-japa',
    topicNumber: 8,
    title: 'The Three Dhyāna Iconographies, the Yantra, and Japa-Homa Metrics',
    sanskritPhrase: 'अष्टदलं पद्मं षट्कोणं चण्डिकामयम्',
    content: `Bhāskararāya provides exact liturgical specifications for the contemplative visualization, mystical diagram, and recitation quotas:

1. The Three Dhyānas:
- Mahākālī (First Episode): Ten-faced, ten-armed, radiant as deep blue sapphire (nīlāśmadyuti). She bears the sword, discus, mace, arrow, bow, iron club, trident, slingshot, severed human head, and conch. Meditated upon as the cosmic night of sleep (Yoganidrā) who awakens Hari to destroy Madhu and Kaiṭabha.
- Mahālakṣmī (Middle Episode): Eighteen-armed, brilliant coral-red (pravāla-prabhā), seated upon a red lotus. She holds the rosary, battle-axe, mace, arrow, thunderbolt, lotus, bow, water-pot, staff, lance, sword, shield, bell, wine-cup, trident, noose, and discus. The glorious slayer of Mahiṣāsura.
- Mahāsarasvatī (Final Episode): Eight-armed, luminously fair like the autumn moon (ghanānta-vilasac-chītāṃśu-tulyaprabhā). Born from the body of Gaurī, she bears the bell, trident, plowshare, conch, pestle, discus, bow, and arrows, destroying Śumbha and Niśumbha.

2. The Yantra: An eight-petaled lotus inscribed with vermilion, agaru, and sandalwood paste, containing within its center a hexagram (ṣaṭkoṇa). The three primary seed-syllables are placed in the central core, and the remaining letters are inscribed in the six outer angles in clockwise order.

3. Puraścaraṇa Requirements: A standard mastery-cycle requires 400,000 repetitions of the Navārṇa mantra, accompanied by a tenth-part (daśāṃśa, 40,000) burnt offerings of sweet milk-rice (pāyasa) in consecrated fire. Alternatively, during the bright fortnight of the month of Āśvina (Navarātri), 100,000 japa repetitions are completed between the first lunar day (Pratipad) and the eighth (Aṣṭamī), followed by homa on Navamī.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-19', 'dm-5-1']
  },
  {
    id: 'guptavati-9-further-hidden-bijas',
    topicNumber: 9,
    title: 'Further Hidden Bījas Extracted from Later Verses',
    sanskritPhrase: 'सर्वमिदं स्तोत्रं मन्त्रोद्धारगर्भितम्',
    content: `Bhāskararāya demonstrates that the cryptic encoding of mantras does not stop with the opening verse, but permeates the entire poem. He provides numerous concrete examples of hidden seed-syllables embedded within specific verses:

- The Tripura-kandā / Cetanī Vidyā: Extracted from the phonetic sequence of the opening chapter, yielding the tri-syllabic foundation of Śrīvidyā.
- The Ramā-bīja (Śrīṃ): Extracted through euphonic combination in the description of Mahālakṣmī, linking the text directly to the Śrī Sūkta.
- The Vārāhī-bīja and Vāgbhava-bīja: Discovered in the battle sequences where specific consonant-vowel clusters assemble the fierce transformative seeds of the Boar-faced Mother.
- The Kāmakalā and Ganapati-bījas: Extracted from subtle phonetic elisions in verses describing the weapons and manifestations of the Goddess.
- The 24-Syllable Formula: Encoded in verse 2.19 ("vamatulam..."), containing an entire integrated mantra-body.
- The Nectar Seed (Vaṃ) and Praṇava (Oṃ): Concealed within the hymns of praise through the suppression of explicit consonants, signifying the nectar of non-dual consciousness and the transcendent half-mora (ardhamātrā).

Bhāskararāya insists that every chapter contains both saviśeṣa (attributed) and nirviśeṣa (unconditioned) formulas, visible only to those possessing the initiated eye of inner vision (cakṣuṣmanto 'nupaśyanti).`,
    relatedVerseIds: ['dm-2-19', 'dm-4-1', 'dm-11-1']
  },
  {
    id: 'guptavati-10-sapoddhara-utkilana',
    topicNumber: 10,
    title: 'Śāpoddhāra and Utkīlana: The Two Preparatory Recitation-Reorderings',
    sanskritPhrase: 'शापोद्धारे मनोः क्रमः उत्कीलने चरित्राणाम्',
    content: `According to the Tantric tradition, the tremendous occult power of the Saptaśatī was cursed and pinned (kīlita) by sages Vasiṣṭha and Viśvāmitra, and sealed by Lord Śiva, to prevent its immense destructive potency from being wielded for egoistic or harmful ends by unpurified individuals. To release its full spiritual efficacy, two specific technical procedures must be undertaken:

1. Śāpoddhāra (Neutralization of the Curse): This requires reciting the 13 chapters in a specific paired-inverse sequence encoded in the mnemonic verse "antyādyā... aśvo 'śva iti":
- Chapter 13 paired with Chapter 1
- Chapter 12 paired with Chapter 2
- Chapter 11 paired with Chapter 3
- Chapter 10 paired with Chapter 4
- Chapter 9 paired with Chapter 5
- Chapter 8 paired with Chapter 6
- Concluding by reciting the pivotal 7th Chapter twice.

2. Utkīlana (Unsealing): This involves reordering the three overarching episodes (Caritas). Instead of the normal historical sequence (1, then 2-4, then 5-13), the unsealing order requires reciting the Middle Episode (Madhyama Carita) first, followed by the First Episode (Prathama Carita), and culminating in the Final Episode (Uttama Carita).

Additionally, Bhāskararāya references the supreme internal unsealing (Mahotkīlana) based on selfless giving and receiving (dadāti pratigṛhṇāti), which transforms outer chanting into pure non-dual offering.`,
    relatedVerseIds: ['dm-keelaka-0', 'dm-1-1', 'dm-7-1']
  },
  {
    id: 'guptavati-11-recitation-etiquette',
    topicNumber: 11,
    title: 'Recitation Etiquette, Phonetic Discipline, and Manuscript Handling',
    sanskritPhrase: 'यावन्न पूर्यतेऽध्यायस्तावन्न विरमेत्पठन्',
    content: `Bhāskararāya codifies the precise physical, vocal, and procedural discipline required during the recitation of the Saptaśatī, quoting authoritative verses from the Vārāhī Tantra:

- No Mid-Chapter Pauses: One must never interrupt recitation in the middle of an ongoing chapter. If a pause occurs inadvertently due to distraction, coughing, or worldly speech, the entire chapter must be restarted from the beginning.
- Vocal Over Mental: Unlike meditative japa which benefits from mental interiority, the recitation of the Saptaśatī stotra must be vocalized clearly (vācika). The sound must be produced with distinct articulation of each syllable, avoiding sing-song cadences, rushed pronunciation, or nodding of the head (śiraḥ-kampa).
- Manuscript Handling: The physical scripture must never be held directly in bare hands during recitation; it must rest reverently upon a sacred book-stand (pustaka-pīṭha) or a clean silken cloth. If chanting entirely from memory without a manuscript, the hands must be kept continuously folded in the gesture of reverence (kṛtāñjali).
- Remuneration of Priests: When a householder sponsors brāhmaṇas to chant on their behalf, strict traditional compensation scales (dakṣiṇā in gold coins) are laid down to ensure the priests are honored properly according to the number of recitations performed (1, 3, 5, 15, or 100 rounds).`,
    relatedVerseIds: ['dm-1-1', 'dm-12-1']
  },
  {
    id: 'guptavati-12-rsi-chandas-devata',
    topicNumber: 12,
    title: 'Ṛṣi, Chandas, Devatā, and Bīja Assignments per Episode',
    sanskritPhrase: 'सप्तशत्याश्चरित्रे तु प्रथमे पद्मभूर्मुनिः',
    content: `Adhering to the Vedic principle that reciting any sacred text without knowing its seer (ṛṣi), poetic meter (chandas), presiding deity (devatā), seed-sound (bīja), energy (śakti), and primary intent (viniyoga) is spiritually sterile, Bhāskararāya systemizes the formal attributions across the three episodes:

1. Prathama Carita (Chapter 1):
- Ṛṣi: Brahmā (Padmabhū)
- Meter: Gāyatrī
- Presiding Deity: Mahākālī
- Seed Syllable: Vāgbhava (Aiṃ)
- Cosmic Element: Fire (Pāvaka)
- Spiritual Goal: Cultivation of Dharma and destruction of spiritual lethargy.

2. Madhyama Carita (Chapters 2–4):
- Ṛṣi: Viṣṇu
- Meter: Uṣṇik
- Presiding Deity: Mahālakṣmī
- Seed Syllable: Hṛllekhā (Hrīṃ)
- Cosmic Element: Wind (Vāyu)
- Spiritual Goal: Acquisition of spiritual wealth (Artha) and annihilation of egotism.

3. Uttama Carita (Chapters 5–13):
- Ṛṣi: Śaṅkara (Rudra)
- Meter: Triṣṭup
- Presiding Deity: Mahāsarasvatī
- Seed Syllable: Kāmarāja (Klīṃ)
- Cosmic Element: Sun (Sūrya)
- Spiritual Goal: Fulfillment of divine yearning (Kāma) and ultimate liberation (Mokṣa).

Following these attributions, the practitioner must perform the six-limb nyāsa (ṣaḍaṅga-nyāsa) across the heart, head, crown, armor, eyes, and hands using the components of the Navārṇa mantra.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-1', 'dm-5-1']
  },
  {
    id: 'guptavati-13-vedic-suktas-samputikarana',
    topicNumber: 13,
    title: 'Sampuṭīkaraṇa: Framing the Text with the Authentic Vedic Sūktas',
    sanskritPhrase: 'रात्रिसूक्तं जपेदादौ प्रान्ते तु देवीसूक्तम्',
    content: `Bhāskararāya examines the mandatory requirement from the Mārīci Kalpa that the recitation of the Saptaśatī must be encased (sampuṭīkṛta) between two ancient Vedic hymns from the Ṛgveda Saṃhitā (10th Maṇḍala): the Rātri Sūkta before beginning, and the Devī Sūkta at the conclusion.

He undertakes an extensive Mīmāṃsā polemic to refute certain lax regional customs that substitute later Purāṇic verses from within the Devī Māhātmya itself (such as claiming Brahmā's praise of Yoganidrā in Chapter 1 is the "Rātri Sūkta" and the gods' hymn in Chapter 5 is the "Devī Sūkta"). 

Bhāskararāya demonstrates that:
1. The technical terms ṛc and sūkta in traditional ritual manuals apply strictly to revealed Vedic mantras with their Vedic accents (svara) and ṛṣis (Kuśika for Rātri Sūkta; Vāgāmbhṛṇī for Devī Sūkta).
2. The Purāṇic verses are stutis, not Vedic sūktas.
3. The spiritual authority of the Devī Māhātmya as a transcendent scripture relies precisely upon being cradled within the timeless authority of the Ṛgveda—beginning with cosmic absorption into the transcendent night of unmanifest Brahman (Rātri) and culminating in the triumphant self-proclamation of the all-pervading Supreme Divine Consciousness (Devī / Vāk).`,
    relatedVerseIds: ['dm-1-54', 'dm-5-14', 'dm-11-1']
  },
  {
    id: 'guptavati-14-purascarana-reading-cycles',
    topicNumber: 14,
    title: 'Puraścaraṇa Schedules, Navarātri Cycles, and Directional Sequences',
    sanskritPhrase: 'पाठोऽयं विप्रकारः इति सप्ताक्षर्या',
    content: `Bhāskararāya outlines the various liturgical schedules, daily chapter breakdowns, and directional orders for reciting the thirteen chapters:

1. The Three-Day Kerala Cycle: Designed around the three primary Caritas:
- Day 1: Chapter 1 (Prathama Carita)
- Day 2: Chapters 2–4 (Madhyama Carita)
- Day 3: Chapters 5–13 (Uttama Carita).

2. The Seven-Day Navarātri Cycle (Kaṭapayādi Code): Encoded in the famous seven-syllabled mnemonic phrase "Pā-ṭho-'yaṃ vi-pra-kā-raḥ", mapping each syllable via the classical Kaṭapayādi cipher to the number of chapters to be read daily:
- Day 1: 1 chapter (Ch. 1) [pa = 1]
- Day 2: 2 chapters (Ch. 2–3) [ṭha = 2]
- Day 3: 1 chapter (Ch. 4) [ya = 1]
- Day 4: 4 chapters (Ch. 5–8) [va = 4]
- Day 5: 2 chapters (Ch. 9–10) [ra = 2]
- Day 6: 1 chapter (Ch. 11) [ka = 1]
- Day 7: 2 chapters (Ch. 12–13) [ra = 2].

3. The Three Sequences of Direction (from Haragaurī Tantra):
- Sṛṣṭi-krama (Creation Order): Chanting Ch. 4–10 first, then 1–3, then 11–13, practiced for generative aspirations and spiritual progress.
- Sthiti-krama (Preservation Order): Chanting Ch. 1 through 13 in normal sequential order, practiced for general welfare, peace, and stability.
- Saṃhāra-krama (Dissolution Order): Chanting in reverse from Ch. 13 down to Ch. 1, reserved strictly for extreme crises, severe adversity, and complete spiritual ego-dissolution.`,
    relatedVerseIds: ['dm-1-1', 'dm-4-1', 'dm-11-1', 'dm-13-13']
  },
  {
    id: 'guptavati-15-animal-sacrifice-substitutes',
    topicNumber: 15,
    title: 'Animal Sacrifice Substitutes and Universal Ahimsa for Brāhmaṇas',
    sanskritPhrase: 'न हिंस्यादिति निषेधस्य सङ्कोचमन्तरेणैव',
    content: `Addressing the controversial Tantric directives regarding blood sacrifice (bali) and liquor (madya), Bhāskararāya takes an uncompromising ethical and Mīmāṃsaka position harmonizing Tantra with Vedic Dharmaśāstra:

1. Non-Violence (Ahiṃsā) is Paramount: The foundational Vedic injunction "na hiṃsyāt sarvā bhūtāni" (never cause injury to any living creature) must never be compromised or relaxed by Brāhmaṇas under any circumstances. Animal slaughter during Devī worship is flatly forbidden for Brāhmaṇas.

2. Authentic Purāṇic Substitutes: Drawing upon the Kālikā Purāṇa, Bhāskararāya demonstrates that bloodless vegetarian substitutes generate equal or superior divine satisfaction (tṛpti):
- White gourd melon (kūṣmāṇḍa / ash gourd) and sugarcane stalks (ikṣu-daṇḍa) are officially designated as the supreme substitutes, producing the exact 25-year spiritual satisfaction attributed to animal offerings.
- A thick paste of flour, turmeric, and vermilion formed into symbolic shapes satisfies the fierce retinue without harming any sentient creature.

3. Substitutes for Liquor: Citing the Bṛhat-Saṅgama Tantra, he warns that any brāhmaṇa who touches or offers real alcoholic liquor falls immediately and irreversibly from his spiritual status (brāhmaṇyād eva hīyate). In its place, the Kālikā Purāṇa prescribes pure fresh coconut water (nārikela-jala) served in a bell-metal vessel (kāṃsya-pātra) or wild honey in a copper cup (tāmre madhu) as the divine nectar offering.`,
    relatedVerseIds: ['dm-12-1', 'dm-13-13']
  },
  {
    id: 'guptavati-16-closing-appendix-applications',
    topicNumber: 16,
    title: 'Closing Appendix: Verse-by-Verse Specific Ritual Applications (Prayogāntarāṇi)',
    sanskritPhrase: 'इति गुप्तवतीस्थसप्तशतीप्रयोगविधिः',
    content: `Concluding his introductory treatise, Bhāskararāya provides an extensive technical appendix of specific ritual applications (Prayogāntarāṇi) derived from the Kātyāyanī Tantra and Durgā-pradīpa, designating individual verses of the Saptaśatī as targeted master formulas:

- Universal Encasement (Sampuṭa): Surrounding each verse of the text with the Praṇava (Oṃ) and the seven Vyāhṛtis in direct and reverse order accelerates all spiritual achievements.
- Overcoming Untimely Death: Encasement of each verse with the Tryambaka Mṛtyuñjaya mantra grants longevity and dispels terminal danger.
- Overcoming Grave Crisis and Poverty: Verse 4.17 ("durge smṛtā harasi bhītim...") is singled out as the sovereign jewel; chanted 100, 1,000, or 10,000 times, or used to encase every verse, it eradicates fear, destitution, and existential dread.
- Quelling All Afflictions: Verse 11.35 ("sarvābādhā-praśamanaṃ...") chanted 100,000 times dispels all physical, mental, and spiritual tribulations.
- Epidemics and Pestilence: Verse 11.54 ("yadā yadā hi bādhā...") recited during community hardship quells plagues, famines, and contagious diseases.
- Dispelling Childhood Afflictions and Seizures: Verse 11.27 ("hinasti daitya-tejāṃsi...") recited while ringing bronze bells and offering waved lights counteracts childhood seizures and negative astrological influences (bāla-graha).
- Total Healing: Verse 11.29 ("rogān aśeṣān apahaṃsi tuṣṭā...") chanted systematically grants relief from chronic and incurable diseases.
- Divine Attraction and Wisdom: Verse 1.55 ("jñāninām api cetāṃsi...") chanted with concentration brings spiritual attraction and purification of intellect.
- The 112-Syllable Sovereign Formula: A master incantation derived from the text combined with Māyā, Lakṣmī, and Kāma seed-syllables, practiced over 41, 21, or 7 days to attain unshakeable wisdom, worldly prosperity, and spiritual liberation.`,
    relatedVerseIds: ['dm-1-55', 'dm-4-14', 'dm-11-23', 'dm-11-37']
  }
];

export const guptavatiConceptsEn: RawConceptEn[] = [
  ...guptavatiIntroTopics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    category: 'Guptavatī Upoddhāta (Bhāskararāya)',
    summary: `${topic.sanskritPhrase} — ${topic.content}`,
    relatedVerseIds: topic.relatedVerseIds,
    relatedConceptIds: ['sadhana-samara', 'three-caritas', 'cit-shakti']
  })),
  ...guptavatiUpodghataEn.map((topic) => ({
    id: topic.id,
    title: topic.title,
    category: 'Guptavatī Upodghāta (Bhāskararāya)',
    summary: `${topic.sanskritTag}\n\n${topic.summary}\n\nKey Points:\n${topic.keyPoints.join('\n')}`,
    relatedConceptIds: ['sadhana-samara', 'three-caritas', 'cit-shakti']
  }))
];

export const guptavatiConceptsMl: RawConceptMl[] = [
  {
    id: 'guptavati-1-provenance',
    title: 'ഉത്ഭവം: ഭാസ്കരരായ ദീക്ഷിതരുടെ 18-ാം നൂറ്റാണ്ടിലെ ആധികാരിക ഉപോദ്ഘാതം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ഭാരത്യുപാഹ്വയഗംഭീരരായദീക്ഷിതസൂരിസൂനുനാ ഭാസ്കരരായദീക്ഷിതമഹാഗ്നിച്ചിതാ — ഈ പ്രാരംഭ ഗ്രന്ഥം ഒരു ആധുനിക പീഠികയോ അജ്ഞാത വ്യാഖ്യാനമോ അല്ല. ശ്രീവിദ്യാ ശാക്ത അദ്വൈത പാരമ്പര്യത്തിലെ സമുന്നതനായ ഭാസ്കരരായ ദീക്ഷിതർ നേരിട്ട് രചിച്ച ആധികാരിക ഗ്രന്ഥമാണിത്. ദേവീമാഹാത്മ്യത്തെ ഒരു കേവല പുരാണ കഥയായി കാണാതെ, വേദാന്തം, മീമാംസ, വ്യാകരണം, ശാക്ത തന്ത്രം എന്നിവയിലൂടെ ഒരു മഹത്തായ മാലാമന്ത്രമായി അദ്ദേഹം ഇവിടെ സ്ഥാപിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-1'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-2-purpose-naming',
    title: 'വ്യാഖ്യാനത്തിന് "ഗുപ്തവതി" എന്ന് പേരിട്ടതിന്റെ ഉദ്ദേശ്യം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സപ്തശതീ ലുപ്തസൃതീരാപ്തവതീ — നൂറ്റാണ്ടുകളായി നഷ്ടപ്പെട്ടുപോയ സപ്തശതിയുടെ രഹസ്യ മാർഗ്ഗത്തെ പുനരുജ്ജീവിപ്പിക്കുകയാണ് ഈ വ്യാഖ്യാനത്തിന്റെ ലക്ഷ്യം. ആഴത്തിലുള്ള തന്ത്ര രഹസ്യങ്ങളെയും ബീജാക്ഷരങ്ങളെയും അർഹതയില്ലാത്തവരിൽ നിന്ന് മറച്ചുവെക്കാനും (ഗുപ്ത), യഥാർത്ഥ സാധകർക്ക് അത് വ്യക്തമാക്കാനും വേണ്ടിയാണ് ഈ വ്യാഖ്യാനത്തിന് "ഗുപ്തവതി" എന്ന് പേരിട്ടത്.`,
    relatedVerseIds: ['dm-1-1', 'dm-kavacha-1'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-3-fourteen-verse-toc',
    title: '14 ശ്ലോകങ്ങളിലുള്ള ഉള്ളടക്ക സൂചിക (അനുക്രമണിക)',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ചതുർദ്ദശഭിർവിഭജ്യ ശ്ലോകൈഃ പ്രതിജ്ഞാനീതേ — 14 ശ്ലോകങ്ങളിലൂടെ ഭാസ്കരരായർ തന്റെ മുഴുവൻ കൃതിയുടെയും ഘടന വിശദീകരിക്കുന്നു: ഗുരു പരമ്പര, മാർക്കണ്ഡേയ-ഭാഗുരി സംവാദം, കാത്യായനീ-ഡാമര തന്ത്രങ്ങൾ, നവാർണ്ണ മന്ത്രോദ്ധാരം, സപ്തശതീ ശബ്ദാർത്ഥം, ശാപോദ്ധാര-ഉത്കീലനങ്ങൾ, കവച-അർഗലാ-കീലകങ്ങൾ, മൂന്ന് ചരിതങ്ങൾ, രഹസ്യത്രയങ്ങൾ എന്നിവയുടെ സംഗ്രഹം.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-1', 'dm-5-1'],
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'guptavati-4-philosophical-case-candi',
    title: '"ചണ്ഡി" എന്ന പേരിന്റെ തത്ത്വചിന്തയും ബ്രഹ്മസ്വരൂപമായ ശക്തിയും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `പരബ്രഹ്മണഃ പട്ടമഹിഷീ ദേവതാ — പരബ്രഹ്മത്തിന്റെ പരമാധികാര ശക്തിയാണ് ചണ്ഡികാ ദേവി. "ചഡി കോപേ" എന്ന ധാതുവിൽ നിന്ന് ഉദ്ഭവിച്ച ഈ കോപം ലൗകിക ദേഷ്യമല്ല, മറിച്ച് അവിദ്യയെ ഭസ്മീകരിക്കുന്ന പരബ്രഹ്മത്തിന്റെ അപ്രതിരോധ്യമായ തേജസ്സാണ്. അഗ്നിയും അതിന്റെ ചൂടും പോലെ ബ്രഹ്മവും ശക്തിയും അഭിന്നമാണ്.`,
    relatedVerseIds: ['dm-1-54', 'dm-1-66'],
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'guptavati-5-navarna-derivation',
    title: 'ആദ്യ ശ്ലോകത്തിൽ നിന്നുള്ള നവാർണ്ണ മന്ത്രത്തിന്റെ അക്ഷര ക്രമത്തിലുള്ള ഉദ്ധാരണം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സാവർണ്ണിഃ സൂര്യതനയോ യോ മനുഃ കഥ്യതേഽഷ്ടമഃ — ദേവീമാഹാത്മ്യത്തിന്റെ ആദ്യ ശ്ലോകത്തിൽ തന്നെ ഒമ്പതക്ഷര നവാർണ്ണ മന്ത്രം (ഐം ഹ്രീം ക്ലീം ചാമുണ്ഡായൈ വിച്ചേ) നിഗൂഢമായി രേഖപ്പെടുത്തിയിരിക്കുന്നു എന്ന് ഭാസ്കരരായർ വ്യാകരണ-മീമാംസാ നിയമങ്ങളിലൂടെ തെളിയിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-1'],
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'guptavati-6-etymology-camunda-vicce',
    title: '"ചാമുണ്ഡാ", "വിച്ചേ" എന്നീ പദങ്ങളുടെ നിഗൂഢ വ്യാകരണാർത്ഥം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ചമൂം ഡാതി ഇതി ചാമുണ്ഡാ — ഇന്ദ്രിയ പ്രപഞ്ചത്തിന്റെ സൈന്യത്തെ (ചമൂ) സ്വന്തം ആത്മാവിൽ ലയിപ്പിച്ചു ഇല്ലാതാക്കുന്ന ചിത്-ശക്തിയാണ് ചാമുണ്ഡ. "വിച്ചേ" എന്നാൽ ഹൃദയത്തിലെ അവിദ്യാ ബന്ധനങ്ങളെ അറുത്തുമാറ്റി മോക്ഷം നൽകുക എന്ന പ്രാർത്ഥനയാണ്.`,
    relatedVerseIds: ['dm-7-19'],
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'guptavati-7-naming-saptasati',
    title: '700 ശ്ലോകങ്ങൾ ഇല്ലാതിരുന്നിട്ടും എന്തുകൊണ്ട് ഈ ഗ്രന്ഥം "സപ്തശതി" എന്ന് വിളിക്കപ്പെടുന്നു',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ന ശ്ലോകസംഖ്യയാ തേഷാം ഷട്ശതീതോഽപി ന്യൂനത്വാത് — ഗ്രന്ഥത്തിലെ യഥാർത്ഥ ശ്ലോകങ്ങൾ 600-ൽ താഴെയാണെങ്കിലും, ഹോമത്തിലും പൂജയിലും അർപ്പിക്കുന്ന ഓരോ മന്ത്ര ഭാഗങ്ങളെയും (അർദ്ധ ശ്ലോകങ്ങൾ, ഉവാച പദങ്ങൾ എന്നിവ) വ്യക്തിഗത മന്ത്രങ്ങളായി കണക്കാക്കുമ്പോൾ കൃത്യം 700 മന്ത്ര യൂണിറ്റുകൾ ലഭിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-1', 'dm-13-13'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-8-dhyana-yantra-japa',
    title: 'മൂന്ന് ധ്യാന രൂപങ്ങൾ, യന്ത്രം, ജപ-ഹോമ സംഖ്യകൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `അഷ്ടദലം പദ്മം ഷട്കോണം ചണ്ഡികാമയം — മഹാകാളി, മഹാലക്ഷ്മി, മഹാസരസ്വതി എന്നിവരുടെ മൂന്ന് ധ്യാന രൂപങ്ങൾ, അഷ്ടദള പത്മത്തിൽ ഷട്കോണമുള്ള യന്ത്ര നിർമ്മിതി, 4 ലക്ഷം നവാർണ്ണ ജപവും 40,000 പായസ ഹോമവും അടങ്ങിയ പുരശ്ചരണ വിധികൾ എന്നിവ ഇവിടെ പ്രതിപാദിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-19'],
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'guptavati-9-further-hidden-bijas',
    title: 'തുടർന്നുള്ള ശ്ലോകങ്ങളിൽ മറഞ്ഞിരിക്കുന്ന മറ്റ് ബീജാക്ഷരങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സർവ്വമിദം സ്തോത്രം മന്ത്രോദ്ധാരഗർഭിതം — തൃപുരകന്ദാ വിദ്യ, രമാബീജം (ശ്രീം), വാരാഹീ ബീജം, കാമകലാ ബീജം, ഗണപതി ബീജം, 24 അക്ഷര മന്ത്രങ്ങൾ എന്നിവ സപ്തശതിയുടെ വിവിധ ശ്ലോകങ്ങളിൽ രഹസ്യമായി ഉൾച്ചേർത്തിരിക്കുന്നു.`,
    relatedVerseIds: ['dm-2-19', 'dm-4-1'],
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'guptavati-10-sapoddhara-utkilana',
    title: 'ശാപോദ്ധാരവും ഉത്കീലനവും: വായന ക്രമത്തിലെ രണ്ട് പ്രധാന തന്ത്ര മാറ്റങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ശാപോദ്ധാരേ മനോഃ ക്രമഃ ഉത്കീലനേ ചരിത്രാണാം — വസിഷ്ഠ-വിശ്വാമിത്ര-ശിവ ശാപങ്ങളെ നീക്കാൻ അധ്യായങ്ങളെ വിപരീത ജോടികളായി വായിക്കുന്ന ക്രമമാണ് ശാപോദ്ധാരം (13-1, 12-2, 11-3, 10-4, 9-5, 8-6, ഒടുവിൽ 7-ാം അധ്യായം രണ്ടുതവണ). മധ്യമ ചരിതം ആദ്യം വായിക്കുന്ന ക്രമമാണ് ഉത്കീലനം.`,
    relatedVerseIds: ['dm-keelaka-0', 'dm-1-1'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-11-recitation-etiquette',
    title: 'പാരായണ മര്യാദകളും ഉച്ചാരണ ശുദ്ധിയും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `യാവന്ന പൂർയ്യതേഽധ്യായസ്താവന്ന വിരമേത്പഠൻ — ഒരു അധ്യായം പൂർത്തിയാകാതെ പാരായണം നിർത്തുവാൻ പാടില്ല. അബദ്ധത്തിൽ നിർത്തിയാൽ ആ അധ്യായം ആദ്യം മുതൽ വീണ്ടും വായിക്കണം. സ്തോത്രം മനസ്സിൽ വായിക്കാതെ സ്പഷ്ടമായി ഉച്ചരിച്ചു വേണം വായിക്കാൻ. ഗ്രന്ഥം കൈകളിൽ വെക്കാതെ പീഠത്തിൽ വെച്ച് പൂജിച്ചു വേണം വായിക്കാൻ.`,
    relatedVerseIds: ['dm-1-1'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-12-rsi-chandas-devata',
    title: 'ഓരോ ചരിതത്തിന്റെയും ഋഷി, ഛന്ദസ്സ്, ദേവതാ വിന്യാസങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സപ്തശത്യാശ്ചരിത്രേ തു പ്രഥമേ പദ്മഭൂർമുനിഃ — പ്രഥമ ചരിതത്തിന് ബ്രഹ്മാവ് ഋഷിയും ഗായത്രി ഛന്ദസ്സും മഹാകാളി ദേവതയുമാണ്. മധ്യമ ചരിതത്തിന് വിഷ്ണു ഋഷിയും ഉഷ്ണിക് ഛന്ദസ്സും മഹാലക്ഷ്മി ദേവതയുമാണ്. ഉത്തമ ചരിതത്തിന് രുദ്രൻ ഋഷിയും ത്രിഷ്ടുപ് ഛന്ദസ്സും മഹാസരസ്വതി ദേവതയുമാണ്.`,
    relatedVerseIds: ['dm-1-1', 'dm-2-1', 'dm-5-1'],
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'guptavati-13-vedic-suktas-samputikarana',
    title: 'സംപുടീകരണം: രണ്ട് വൈദിക സൂക്തങ്ങളാൽ സപ്തശതിയെ ബന്ധിക്കൽ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `രാത്രിസൂക്തം ജപേദാദൗ പ്രാന്തേ തു ദേവീസൂക്തം — സപ്തശതീ പാരായണത്തിന് മുൻപ് ഋഗ്വേദത്തിലെ രാത്രിസൂക്തവും അവസാനം ദേവീസൂക്തവും ജപിക്കണം. പുരാണത്തിലെ ശ്ലോകങ്ങൾക്ക് പകരം ആധികാരിക വൈദിക സൂക്തങ്ങൾ തന്നെ ഉപയോഗിക്കണമെന്ന് ഭാസ്കരരായർ ശാഠ്യപൂർവ്വം തെളിയിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-54', 'dm-5-14'],
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'guptavati-14-purascarana-reading-cycles',
    title: 'പുരശ്ചരണ ക്രമങ്ങൾ, നവരാത്രി ദിനങ്ങൾ, വായന ദിശകൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `പാഠോഽയം വിപ്രകാരഃ ഇതി സപ്താക്ഷര്യാ — കേരളീയരുടെ 3 ദിവസ ക്രമം, കടപയാദി സംഖ്യയനുസരിച്ചുള്ള 7 ദിവസത്തെ നവരാത്രി പാരായണ ക്രമം (പാഠോഽയം വിപ്രകാരഃ), ഹരഗൗരീ തന്ത്രത്തിലെ സൃഷ്ടി-സ്ഥിതി-സംഹാര ക്രമങ്ങൾ എന്നിവ ഇവിടെ വിശദീകരിക്കുന്നു.`,
    relatedVerseIds: ['dm-1-1', 'dm-13-13'],
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'guptavati-15-animal-sacrifice-substitutes',
    title: 'ബലി പ്രതിനിധികളും ബ്രാഹ്മണർക്കുള്ള അഹിംസാ നിഷ്ഠയും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ന ഹിംസ്യാദിതി നിഷേധസ്യ സങ്കോചമന്തരൈണൈവ — "ന ഹിംസ്യാത് സർവ്വാ ഭൂതാനി" എന്ന വൈദിക വിധി ബ്രാഹ്മണർക്ക് സർവ്വഥാ ബാധകമാണ്. രക്തബലിക്ക് പകരം കുമ്പളങ്ങ (കൂഷ്മാണ്ഡം), കരിമ്പ് (ഇക്ഷുദണ്ഡം) എന്നിവയും, മദ്യത്തിന് പകരം ഓട്ടുപാത്രത്തിലെ ഇളനീർ വെള്ളവും തേനും സമർപ്പിക്കണമെന്ന് കാളികാ പുരാണത്തെ ഉദ്ധരിച്ചു തെളിയിക്കുന്നു.`,
    relatedVerseIds: ['dm-12-1'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'guptavati-16-closing-appendix-applications',
    title: 'അനുബന്ധം: ഓരോ ശ്ലോകത്തിന്റെയും നിർദ്ദിഷ്ട താന്ത്രിക പ്രയോഗങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ഇതി ഗുപ്തവതീസ്ഥസപ്തശതീപ്രയോഗവിധിഃ — കാത്യായനീ തന്ത്രത്തിൽ നിന്നുള്ള ശ്ലോക പ്രയോഗങ്ങൾ: ഭയ-ദാരിദ്ര്യ നാശത്തിന് "ദുർഗ്ഗേ സ്മൃതാ" (4.17), സർവ്വ ബാധാ ശമനത്തിന് "സർവ്വാബാധാ പ്രശമനം" (11.35), രോഗ നിവാരണത്തിന് "രോഗാനശേഷാൻ" (11.29), ബാധകളും ഗ്രഹദോഷങ്ങളും അകറ്റാൻ "ഹിനസ്തി ദൈത്യതേജാംസി" (11.27) തുടങ്ങിയ നിർദ്ദിഷ്ട സിദ്ധി പ്രയോഗങ്ങൾ.`,
    relatedVerseIds: ['dm-4-14', 'dm-11-23'],
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-00-provenance',
    title: 'ഉത്ഭവം: ഭാസ്കരരായ ദീക്ഷിതരുടെ 18-ാം നൂറ്റാണ്ടിലെ ആധികാരിക ഉപോദ്ഘാതം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ഭാസ്കരരായ ദീക്ഷിതരുടെ (18-ാം നൂറ്റാണ്ട്) സ്വന്തം ആമുഖ ഗ്രന്ഥമാണിത്. ഒരു ആധുനിക പീഠികയല്ല.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-01-title-purpose',
    title: 'വ്യാഖ്യാനത്തിന് "ഗുപ്തവതി" എന്ന് പേരിട്ടതിന്റെ ഉദ്ദേശ്യം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `നഷ്ടപ്പെട്ടുപോയ ആന്തരിക അർത്ഥങ്ങളെ വീണ്ടെടുക്കാനും സാധകർക്ക് കർമ്മാനുഷ്ഠാന മാർഗ്ഗം വ്യക്തമാക്കാനും വേണ്ടിയാണ് ഈ വ്യാഖ്യാനം.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-02-toc-fourteen-verses',
    title: 'പതിനാല് ശ്ലോകങ്ങളിലുള്ള ഗ്രന്ഥ സൂചിക',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ഉപോദ്ഘാതത്തിൽ പ്രതിപാദിക്കുന്ന സകല വിഷയങ്ങളുടെയും 14 ശ്ലോകങ്ങളിലുള്ള കൃത്യമായ രൂപരേഖ.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-03-meaning-of-chandi',
    title: '"ചണ്ഡീ" എന്ന പദത്തിന്റെ താത്വിക നിർവ്വചനം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ചണ്ഡീ പരബ്രഹ്മത്തിന്റെ പട്ടമഹിഷിയാണ്. ദൈവിക കോപം എന്നത് പരമമായ അദ്വൈത ശക്തിയുടെ ലക്ഷണമാണ്.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-04-shakti-as-brahman',
    title: 'ശക്തിയും ബ്രഹ്മവും തമ്മിലുള്ള അഭേദ്യ ബന്ധം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ബ്രഹ്മത്തിന്റെ സ്വാഭാവിക ധർമ്മമാണ് ശക്തി. ഒരൊറ്റ ചിത്-ശക്തിയാണ് മഹാകാളി, മഹാലക്ഷ്മി, മഹാസരസ്വതി എന്നിവരായി വികസിക്കുന്നത്.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-05-navarna-mantra-uddhara',
    title: 'പ്രഥമ ശ്ലോകത്തിൽ നിന്നുള്ള നവാർണ്ണ മന്ത്രോദ്ധാരം',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `"സാവർണ്ണിഃ സൂര്യതനയോ..." എന്ന ആദ്യ ശ്ലോകത്തിൽ രഹസ്യമായി ഉൾച്ചേർത്തിരിക്കുന്ന ഐം ഹ്രീം ക്ലീം ചാമുണ്ഡായൈ വിച്ചേ എന്ന നവാർണ്ണ മന്ത്രം.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-06-chamunda-etymology',
    title: '"ചാമുണ്ഡാ" പദത്തിന്റെ വ്യുൽപ്പത്തി',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സ്ഥൂല-സൂക്ഷ്മ അവിദ്യകളെ (ചണ്ഡ-മുണ്ഡന്മാരെ) ഇല്ലാതാക്കുന്ന ബ്രഹ്മജ്ഞാന സ്വരൂപിണിയാണ് ചാമുണ്ഡ.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-07-vichche-and-navarna-meaning',
    title: '"വിച്ചേ" എന്ന പദവും നവാർണ്ണ മന്ത്രത്തിന്റെ പൂർണ്ണാർത്ഥവും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `സച്ചിദാനന്ദ സ്വരൂപിണിയായ പരാശക്തിയോട് ഹൃദയത്തിലെ അവിദ്യാ ബന്ധനങ്ങൾ അറുത്തുമാറ്റാൻ നടത്തുന്ന പരമ പ്രാർത്ഥന.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-08-why-called-seven-hundred',
    title: 'എന്തുകൊണ്ട് "സപ്തശതി" എന്ന് വിളിക്കപ്പെടുന്നു',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ശ്ലോക സംഖ്യ 700 അല്ലാതിരുന്നിട്ടും, സപ്ത സതീ ദേവിമാരുടെ പ്രതിപാദനത്താലും 700 ഹോമ-മന്ത്ര യൂണിറ്റുകളാലും ഇത് സപ്തശതിയാകുന്നു.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-09-dhyana-verses-three-forms',
    title: 'മൂന്ന് ധ്യാന ശ്ലോകങ്ങൾ: മഹാകാളി, മഹാലക്ഷ്മി, മഹാസരസ്വതി',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `മൂന്ന് ചരിതങ്ങളിലെയും ആന്തരിക ധ്യാന രൂപങ്ങൾ, ആയുധങ്ങൾ, വിഗ്രഹ ലക്ഷണങ്ങൾ.`,
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'gv-10-yantra-and-purashcharana',
    title: 'യന്ത്ര നിർമ്മാണവും പുരശ്ചരണ വിധികളും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `അഷ്ടദള പത്മത്തിൽ ഷട്കോണ യന്ത്രം, അക്ഷര വിന്യാസം, 4 ലക്ഷം ജപവും ദശാംശ ഹോമവും അടങ്ങിയ സാധന.`,
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'gv-11-further-bija-extractions',
    title: 'മറ്റ് ശ്ലോകങ്ങളിലെ നിഗൂഢ ബീജാക്ഷരങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `"മേധാസി ദേവി...", "ദുർഗ്ഗാസി ദുർഗ്ഗഭവസാഗര..." തുടങ്ങിയ ശ്ലോകങ്ങളിലെല്ലാം മന്ത്ര ബീജങ്ങൾ ഗൂഢമായി നിക്ഷേപിക്കപ്പെട്ടിരിക്കുന്നു.`,
    relatedConceptIds: ['cit-shakti']
  },
  {
    id: 'gv-12-shapoddhara-utkilana',
    title: 'ശാപോദ്ധാരവും ഉത്കീലനവും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `അധ്യായങ്ങളെ വിപരീത ജോടികളായി വായിക്കുന്ന ശാപോദ്ധാര ക്രമവും ചരിതങ്ങളുടെ വായനാക്രമം മാറ്റുന്ന ഉത്കീലനവും.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-13-recitation-etiquette',
    title: 'പാരായണ മര്യാദകളും നിബന്ധനകളും',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `അധ്യായം പൂർത്തിയാക്കാതെ നിർത്താതിരിക്കുക, ഉച്ചത്തിൽ ചൊല്ലുക, പീഠത്തിൽ വെച്ച് ആദരവോടെ വായിക്കുക തുടങ്ങിയ ശാസ്ത്രീയ ചിട്ടകൾ.`,
    relatedConceptIds: ['sadhana-samara']
  },
  {
    id: 'gv-14-rishi-chandas-devata-nyasa',
    title: 'ഋഷി, ഛന്ദസ്സ്, ദേവതാ ന്യാസങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ഓരോ ചരിതത്തിന്റെയും ഋഷി, ഛന്ദസ്സ്, ദേവത, ബീജം, തത്വം, ധർമ്മാർത്ഥകാമ ലക്ഷ്യങ്ങൾ എന്നിവയുടെ വിന്യാസം.`,
    relatedConceptIds: ['three-caritas']
  },
  {
    id: 'gv-15-appendix-purashcharana-prayoga',
    title: 'അനുബന്ധം: നിർദ്ദിഷ്ട സിദ്ധി പ്രയോഗങ്ങൾ',
    category: 'ഗുപ്തവതീ ഉപോദ്ഘാതം (ഭാസ്കരരായർ)',
    summary: `ആപത്തുനിവാരണത്തിനും രോഗശമനത്തിനും സകല ബാധകൾ അകറ്റാനുമുള്ള ഓരോ ശ്ലോകത്തിന്റെയും താന്ത്രിക പ്രയോഗങ്ങൾ.`,
    relatedConceptIds: ['sadhana-samara']
  }
];
