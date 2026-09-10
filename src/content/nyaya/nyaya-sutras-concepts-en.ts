/**
 * ============================================================================
 * NYĀYA SŪTRAS: MASTER ONTOLOGY & CONCEPTS DIRECTORY
 * ============================================================================
 * 
 * This file is the complete, canonical representation of all philosophical 
 * concepts (Padārthas, Pramāṇas, Siddhāntas, etc.) across the ENTIRE Nyāya system.
 * 
 * ARCHITECTURAL LAW:
 * As new Books (e.g., Book 5) or new commentaries (e.g., Vātsyāyana Bhāṣya) 
 * are integrated into the app, ANY new `conceptIds` referenced in those sutra 
 * files MUST be defined here. 
 * 
 * FUTURE INTEGRATION PROTOCOL:
 * 1. When adding a new Book (e.g. `nyaya-sutras-book5-en.ts`), run the 
 *    `identify-missing-concepts.js` script located in this directory.
 * 2. The script will statically analyze the new sutra payloads and output a 
 *    list of `conceptIds` that are referenced but missing from this file.
 * 3. Append the missing concepts to this array, ensuring they conform strictly 
 *    to the `NyayaConcept` interface, with accurate Devanagari, IAST, and 
 *    semantic `relatedConcepts` linkages.
 * 
 * This ensures the `nyaya-graph-data.ts` Knowledge Graph never encounters 
 * orphaned nodes and remains a perfectly mapped, high-dimensional web.
 * ============================================================================
 */
export interface NyayaConcept {
  id: string;
  sanskrit: string;
  iast: string;
  english: string;
  forBeginners: string; // Plain-English explanation with analogies, for a total beginner
  category: 'Epistemology' | 'Metaphysics' | 'Dialectics' | 'Hermeneutics' | 'Cognition';
  definition: string;
  significance: string;
  relatedConcepts?: string[];
}

export const nyayaConceptsEn: NyayaConcept[] = [
  {
    id: "ns-intro",
    sanskrit: "न्याय-दर्शनम्",
    iast: "Nyāya-darśanam",
    english: "Overview of the Nyāya System",
    forBeginners: "Nyāya is one of the six classical Indian philosophies, focusing heavily on logic and the rules of valid knowledge. The foundational text, the Nyāya-Sūtras, is ascribed to Akṣapāda Gotama (or Gautama). Dating is fiercely debated: Bhandarkar placed Gotama in 6th-century BCE Mithila as a contemporary of the Buddha (even identifying him with the authors of the Dharma- and Pitṛmedha-sūtras), while Jacobi and others argue the sūtras passed through several redactions down to the early centuries CE. What is certain is the age was one of polemics — early Nyāya forged its doctrines in live combat with Buddhist and Jain thinkers, so its history cannot be read apart from theirs. The Jha translation rendered into English for the first time all three strata together: Gotama's sūtras, Vātsyāyana's Bhāṣya, and Uddyotakara's Vārtika in full, drawing notes from Vācaspati's Tātparyaṭīkā, Udayana's Pariśuddhi, and Raghuttama's Bhāṣyachandra.",
    category: "Epistemology",
    definition: "The orthodox Hindu philosophical system that emphasizes logical realism, asserting that valid knowledge (pramāṇa) is the sole means to accurately apprehend reality and attain liberation. Its textual corpus in this edition comprises (a) Gotama's Nyāya-sūtras, (b) Vātsyāyana's Bhāṣya, and (c) Uddyotakara's Vārtika, with the Tātparyaṭīkā, Pariśuddhi, and Bhāṣyachandra used for notes.",
    significance: "The system provides the fundamental methodological and logical framework for all later Indian philosophical debates, making epistemology the prerequisite for metaphysics. Because its formative centuries were an age of inter-school polemic, Nyāya doctrines — from the four pramāṇas to the Book-4 refutations of extremist world-theories (ultra-theism, chance, nihilism, universal flux or permanence) — are best read as answers to named rivals rather than isolated dogmas.",
    relatedConcepts: []
  },
  {
    id: "ns-chronology",
    sanskrit: "भाष्य-तथा-वार्तिक",
    iast: "Bhāṣya tathā Vārtika",
    english: "The Commentarial Tradition",
    forBeginners: "Because the original aphorisms (sūtras) were so brief, later thinkers wrote massive commentaries to explain them and defend them against rival schools (like the Buddhists). Vātsyāyana wrote the first major commentary (Bhāṣya) — assigned dates sprawl from 200 BCE to 700 CE, with Jacobi's school favouring around the 4th-5th century CE; Suali objected that a single generation between sūtras and Bhāṣya is too short, pointing to a longer redaction interval. Later, when Buddhist logic under Dignāga surged, Uddyotakara (around the 6th century CE) wrote the Vārtika to defend the orthodox position. His date is fixed from both sides: after Dignāga, whom he refutes (terminus a quo), and before Subandhu's Vāsavadattā, which already celebrates his work at the height of its glory — after which Buddhist logicians like Dharmakīrti turned their polemics against it and overthrew its reputation for a time.",
    category: "Hermeneutics",
    definition: "The primary layer of commentaries on the Nyāya-Sūtras: Vātsyāyana's Bhāṣya (edited from the Vizianagaram Sanskrit Series collated with palm-leaf manuscripts lent by the Govardhanamaṭha Śaṅkarācārya of Puri, plus paper manuscripts of the sūtras) and Uddyotakara's Vārtika (Bibliotheca Indica edition, aided after Adhyāya I by the Benares reprint, with Adhyāya V palm-leaf manuscripts styled C and D).",
    significance: "They expanded the terse aphorisms into a full-fledged philosophical system, explicitly responding to contemporary challenges from Buddhist idealism and logic. The Vārtika's own announcement of purpose — removing the blemish of error cast by inferior logicians on Akṣapāda's doctrine of peace and welfare — names Dignāga's school as its target, making Nyaya-Vārtika the orthodox counter-memorial of the 6th-century logic wars.",
    relatedConcepts: []
  },
  {
    id: "ns-commentators",
    sanskrit: "तात्पर्यटीका",
    iast: "Tātparyaṭīkā",
    english: "The Later Guardians",
    forBeginners: "As centuries passed, even the earlier commentaries became obscure — the Vārtika's reputation had been overthrown by Buddhist critics after its days of glory. Vācaspati Miśra (mid-9th century CE; his Nyāyasūcīnibandha date is read as 841 CE rather than 976 CE on Jha's reckoning) wrote the Tātparyaṭīkā (Vizianagaram Series) to restore Uddyotakara's work. Later still, the brilliant Udayana (10th century CE) wrote the Tātparyapariśuddhi, and much later Raghuttama composed the Bhāṣyachandra — surviving only in a single autograph manuscript reaching the middle of Adhyāya III, its deficiency supplied in this edition from the Chakhambā print plus the translator's own gloss. These men are the definitive guardians of the old Nyāya tradition before a completely new wave of logic (Navya-Nyāya) emerged later.",
    category: "Hermeneutics",
    definition: "The secondary layer of Nyāya commentaries aimed at restoring and defending the earlier tradition: Vācaspati Miśra's Tātparyaṭīkā, Udayana's Pariśuddhi, and Raghuttama's Bhāṣyachandra (fragmentary autograph to mid-Adhyāya III, completed here from the Chakhambā edition and fresh gloss).",
    significance: "These texts represent the mature phase of 'Old Nyāya', solidifying its doctrines before the medieval shift towards the hyper-formal Navya-Nyāya system. Their notes — on the tasi affix, the karaka doctrine, pramāṇa-saṃplava, and the beginninglessness reply — are cited throughout this edition wherever the Bhāṣya-Vārtika dialectic turns technical.",
    relatedConcepts: []
  },
  {
    id: "pravritti-samarthya",
    sanskrit: "प्रवृत्ति-सामर्थ्य",
    iast: "pravṛtti-sāmarthya",
    english: "Fruitful Exertion / Pragmatic Efficacy",
    forBeginners: "Why do we care about having reliable ways of knowing things? Nyāya gives a remarkably practical answer right on page 1 of its commentary: because otherwise, your actions won't work in the real world. When you truly know something (like knowing where real water is), your effort to drink actually succeeds. If your belief was wrong (like running after a desert mirage), your effort fails. Valid knowledge is proven by whether acting on it produces the real-world result you intended.",
    category: "Epistemology",
    definition: "The practical effectiveness and fruitfulness of human exertion that follows upon valid cognition (pramāṇato 'rthapratipattau pravṛttisāmarthyād arthavat pramāṇam). Right cognition stimulates the desire either to acquire the beneficial (upādāna) or to abandon the harmful (hāna), culminating in fruitful action.",
    significance: "The bedrock thesis of the Nyāya-Bhāṣya. It grounds Nyāya in an experiential realism: logic is verified by its capacity to guide successful human action in the world. Uddyotakara defends this against circularity objections by demonstrating that the cosmic sequence of cognitive agents and actions is beginningless (anādi).",
    relatedConcepts: ["pramana", "pramana-catustaya", "arthavat"]
  },
  {
    id: "pramana-catustaya",
    sanskrit: "प्रमाण-चतुष्टय",
    iast: "pramāṇa-catuṣṭaya",
    english: "The Four Factors of Cognition",
    forBeginners: "Think of every act of knowing as a four-part team: (1) The Knower (you, the conscious subject), (2) The Tool (your eyes or your reasoning), (3) The Object (the tree or fire in front of you), and (4) The Result (the clear comprehension 'that is an oak tree'). Nyāya points out that while you need all four, the Tool (Pramāṇa) is the MVP: the moment the right instrument engages, true knowledge instantly dawns.",
    category: "Epistemology",
    definition: "The four organic factors necessary for any valid cognitive event: (1) Pramātṛ (the cognising subject/agent), (2) Pramāṇa (the instrument or means of knowing), (3) Prameya (the object to be known), and (4) Pramā or Pramiti (the resultant right comprehension).",
    significance: "Vātsyāyana and Uddyotakara establish that all apprehension of truth depends on these four factors (catuṣv evaiteṣu tattvaṃ parisamāpyate). Pramāṇa is demonstrated to be the most efficient cause (sādhakatama) because its operation directly and immediately brings about the cognition.",
    relatedConcepts: ["pramana", "prameya", "atman", "sadhakatama-karana"]
  },
  {
    id: "tattva-sat-asat",
    sanskrit: "तत्त्वम् (सद्-असत्)",
    iast: "tattva (sat-asat)",
    english: "The Nature of Reality (Being & Non-Being)",
    forBeginners: "What is 'truth' or 'reality'? Nyāya's answer is beautifully straightforward: truth means seeing what exists as existing, and seeing what doesn't exist as NOT existing. If there is a cup on the desk, truth is seeing the cup. If there is NO snake under the bed, truth is knowing there is no snake. Both presence and absence are real facts about the universe.",
    category: "Metaphysics",
    definition: "The essential nature of reality (tattva), defined by Vātsyāyana as 'being' (sat) in the case of an existent entity, and 'non-being' (asat) in the case of a non-entity. Apprehending that which is as existing, and that which is not as non-existing, constitutes the apprehension of reality.",
    significance: "Establishes Nyāya's uncompromising metaphysical realism against Buddhist nominalism and nihilism. Non-existence (abhāva) is not an imaginary mental void, but an objective ontological state that is cognized indirectly through the non-cognition of what is absent.",
    relatedConcepts: ["dipa-drishtanta", "abhava", "prameya"]
  },
  {
    id: "dipa-drishtanta",
    sanskrit: "दीप-दृष्टान्त",
    iast: "dīpa-dṛṣṭānta",
    english: "The Analogy of the Lamp (Illuminating Absence)",
    forBeginners: "Imagine shining a flashlight into a dark room: the beam illuminates the table, the chairs, and the bookshelf. But in that exact same instant, the flashlight also proves there is NO elephant in the room — because if one were there, the beam would have revealed it. Nyāya uses this famous lamp metaphor to explain how the very same tools of knowledge that show us what is present also prove what is absent.",
    category: "Epistemology",
    definition: "The classic analogy formulated by Vātsyāyana: when a lamp illuminates the visible objects in a room, it simultaneously makes known the non-existence of what is not seen ('if it existed here, it would be visible; as it is not visible, it does not exist').",
    significance: "Resolves the objection of how an instrument of positive cognition can apprehend non-existence (abhāva). The same Pramāṇa that manifests the existent thing manifests the non-existent thing through non-apprehension (anupalabdhi) of the perceptible.",
    relatedConcepts: ["tattva-sat-asat", "abhava", "pratyaksha"]
  },
  {
    id: "caturvyuha-shastra",
    sanskrit: "चतुर्व्यूह-शास्त्र",
    iast: "caturvyūha-śāstra",
    english: "The Fourfold Soteriological Architecture",
    forBeginners: "Nyāya structures philosophy exactly like a master physician treating an illness: (1) Diagnose the disease (the suffering of existence), (2) Identify what needs to be removed (ignorance and false attachments), (3) Prescribe the medicine (the 16 logical categories and epistemological training), and (4) Attain perfect health (permanent liberation). Logic in Nyāya is not a sterile intellectual sport; it is the ultimate medicine for life.",
    category: "Hermeneutics",
    definition: "The overarching structure of the Nyāya-Śāstra modeled after the medical art: (1) Heya (that which is to be avoided, i.e., pain and tainted pleasure), (2) Hāna (the cessation of suffering through true knowledge), (3) Upāya (the means of cessation, namely the treatise and its 16 categories), and (4) Adhigantavya (the ultimate end to be attained, Apavarga/Release).",
    significance: "Elevates Nyāya logic into an explicit soteriology, demonstrating that Gautama's 16 categories are exclusively selected for their power to dismantle ignorance and lead the qualified seeker (adhikārin) to liberation.",
    relatedConcepts: ["apavarga", "duhkha", "shodasha-padartha", "ekavimshati-duhkha"]
  },
  {
    id: "ekavimshati-duhkha",
    sanskrit: "एकविंशति-दुःख",
    iast: "ekaviṃśati-duḥkha",
    english: "The Twenty-One Kinds of Suffering",
    forBeginners: "In the Introductory Vārtika, Uddyotakara creates an exact inventory of 21 things that cause suffering in human life: our physical body, our 6 sense organs, the 6 kinds of things we sense, the 6 ways our mind registers them, pain itself, and — surprisingly — even ordinary pleasure! Why pleasure? Because worldly pleasure is always haunted by anxiety, fear of losing it, and grief when it fades. True liberation means putting all 21 sources of turmoil permanently to rest.",
    category: "Metaphysics",
    definition: "The exhaustive classification of pain detailed by Uddyotakara: (1) the body (abode of pain), (2-7) the six sense-organs (instruments of pain), (8-13) the six sensory objects, (14-19) the six cognitive awarenesses, (20) pleasure (treated as pain because it is inseparable from craving and anxiety), and (21) intrinsic pain.",
    significance: "Delineates the absolute cessation (ātyantika-nivṛtti) required for Apavarga. Unlike temporary relief (such as pulling out a thorn), philosophical liberation demands the irreversible exhaustion of all 21 sources of suffering through the cessation of dharma and adharma.",
    relatedConcepts: ["caturvyuha-shastra", "apavarga", "duhkha-chain-nyaya"]
  },
  {
    id: "sadhakatama-karana",
    sanskrit: "साधकतम-कारण",
    iast: "sādhakatama-kāraṇa",
    english: "The Most Efficient Cause of Knowledge",
    forBeginners: "Why do Indian philosophers spend so much time obsessing over 'instruments of knowledge' instead of just focusing on the person thinking? Because having a knower and having an object in the room achieves nothing until the connection works. The instrument (Pramāṇa) is the final, decisive spark: the moment it fires, knowledge is born.",
    category: "Epistemology",
    definition: "The designation of Pramāṇa as the supreme, most efficient cause (sādhakatamam kāraṇam) of cognition, defined by Uddyotakara through seven unique causal characteristics: invariant concomitance, necessary presence, latency of other factors without it, immediate sequence to cognition (carama-kāraṇa), specific individual causation, individualization of mind-soul contact, and direct efficacy.",
    significance: "Provides the technical philosophical justification for why Gautama begins the Nyāya-Sūtras with Pramāṇa rather than the soul (Pramātṛ) or the world (Prameya): the instrument is the operative pivot of all experience.",
    relatedConcepts: ["pramana", "pramana-catustaya", "pravritti-samarthya"]
  },
  {
    id: "karaka-tasi-vartika",
    sanskrit: "कारक-तसि-वादः",
    iast: "kāraka-tasi-vādaḥ",
    english: "Kāraka Words, the tasi Affix, and the Dialectic of the Sovereign Instrument",
    forBeginners: "How can the knower and the known exist BEFORE knowledge itself is born — don't the words 'knower' and 'known' only make sense once knowing happens? Uddyotakara answers with the cook: we call a man a 'cooker' (pachaka) even when he cooked two days ago or will cook two days hence, because words carry an expressive potency present at all three times, not just while the action burns. So pramātṛ and prameya may pre-exist the pramāṇa that links them. A second grammatical battle concerns the affix 'tasi' in 'pramāṇatas': Pāṇini 5.3.7 restricts it to the pure ablative, yet the Bhāṣya uses it for all numbers and for both ablative (causality — cognition proceeds FROM the instrument) and instrumental (instrumentality — cognition is accomplished BY it). The reply invokes Pāṇini 5.3.14, extending the affix across declensions: the usage is at once comprehensive (one, two, or many instruments) and restrictive (instruments of cognition only). From this grammar the Vārtika derives its cascade of formulations of why pramāṇa is the most efficient cause — presence-absence regulation with must-follow, equipped-only cognition, latency of knower-and-object until the instrument stirs, and last-to-operate priority like the final straw-contact that completes a substance (detailed in our sādhakatama entry). The same dialectic answers the Buddhist who allows only perception and inference with distinct objects: Nyāya counts four instruments and three object-kinds (universal, particular, and qualified particular) with genuine convergence (saṃplava), and dissolves the mutual-dependence charge (valid cognition needs fruitful action, fruitful action needs valid cognition) by the beginninglessness of the world, proved in Book 4.",
    category: "Epistemology",
    definition: "The Introductory Vārtika's grammatical-ontological foundation of pramāṇa's sovereignty: (1) the kāraka doctrine that agent-words denote across past, present, and future through expressive potency; (2) the tasi-affix justification (Pāṇini 5.3.14 over 5.3.7) yielding comprehensive-yet-restrictive reference with ablative-instrumental double sense; (3) the fourfold classification of 'artha' (to-be-avoided, cause of avoiding, accomplisher-treatise, ultimate deliverance) plus the pramāṇa-pramā-prameya-pramātṛ tetrad with pramāṇa sovereign in both; and (4) the anāditva (beginninglessness) reply to interdependence objections.",
    significance: "Without this dialectic the opening sentence of the Bhāṣya — 'an instrument of right cognition must be regarded as rightly effective' — collapses under circularity and grammatical censure. It secures, before any sūtra is examined, that instruments can be spoken of collectively, that knowers pre-exist their knowings, and that convergence of instruments on one object is legitimate — the three pillars on which Books 1-5 stand.",
    relatedConcepts: ["pramana-catustaya", "sadhakatama-karana", "pramana-samplava", "pravritti-samarthya"]
  },
  {
    id: "pramana-samplava",
    sanskrit: "प्रमाण-संप्लव",
    iast: "pramāṇa-saṃplava",
    english: "Convergence of Epistemic Instruments",
    forBeginners: "Can you both SEE a fire, HEAR it roar, SMELL the smoke, and be TOLD by a trustworthy friend that it's burning? Buddhist logicians claimed that different ways of knowing can never overlap. Nyāya argues the opposite: different senses and logical clues can converge on the very same object from different angles, strengthening your certainty without being wasteful or redundant.",
    category: "Epistemology",
    definition: "The Nyāya doctrine that multiple distinct instruments of knowledge (perception, inference, comparison, testimony) can operate concurrently upon the same object of knowledge, as opposed to Pramāṇa-vyavasthā (the rigid separation of instruments defended by the Buddhist school).",
    significance: "A central controversy in classical Indian epistemology. Uddyotakara proves that convergence does not render secondary instruments useless, because each instrument grasps a distinct aspect and modality of the object, culminating in comprehensive apprehension.",
    relatedConcepts: ["pramana", "pratyaksha", "anumana", "shabda"]
  },
  {
    id: "catasro-vidyah",
    sanskrit: "चतस्रो विद्याः",
    iast: "catasro vidyāḥ",
    english: "The Four Classical Sciences",
    forBeginners: "Why does Nyāya insist on listing sixteen distinct categories in its first rule instead of stopping at 'how we know' and 'what exists'? Vātsyāyana and Uddyotakara explain that civilization is anchored in four great branches of knowledge: (1) Trayī (Vedic science for spiritual sacrifices), (2) Vārtā (Agriculture and trade for bodily sustenance), (3) Daṇḍanīti (Politics and statecraft for law and order), and (4) Ānvīkṣikī (Logic and critical reasoning). If Nyāya only spoke of the soul and perception, it would collapse into just another theological text of the Upaniṣads, reducing the four sciences to three! By explicitly naming Doubt, Purpose, Syllogisms, and Debate, Nyāya stakes out its irreplaceable territory as the science of rational inquiry.",
    category: "Epistemology",
    definition: "The classical taxonomy of human knowledge into four sovereign sciences: Trayī (sacred tradition), Vārtā (agriculture and economics), Daṇḍanīti (political governance), and Ānvīkṣikī (logico-metaphysical investigation).",
    significance: "Provides the foundational institutional justification for Sūtra 1.1.1. Gautama explicitly enumerates dialectical categories (Doubt, Motive, Example, etc.) to establish Ānvīkṣikī's unique scientific domain (adhikāra).",
    relatedConcepts: ["anviksiki-nyaya", "pramana", "shodasha-padartha", "pradipa-sarvavidyanam"]
  },
  {
    id: "anviksiki-nyaya",
    sanskrit: "आन्वीक्षिकी (प्रमाणैरर्थपरीक्षणम्)",
    iast: "ānvīkṣikī (pramāṇair artha-parīkṣaṇam)",
    english: "Ānvīkṣikī: The Examination of Things by Proofs",
    forBeginners: "What does the word 'Nyāya' actually mean? Vātsyāyana defines it with razor precision: 'Nyāya is the examination of things using the instruments of valid cognition' (pramāṇair artha-parīkṣaṇam). It is called 'Ānvīkṣikī' because of 'anu-īkṣā' — the critical re-viewing or scrutinizing of something that was first merely seen or heard. Crucially, any clever deduction that contradicts what your senses plainly observe (like arguing 'fire is cold because it is created') or what reliable testimony proves is not true logic, but 'nyāyābhāsa' — bogus reasoning.",
    category: "Epistemology",
    definition: "The formal definition of Nyāya/Ānvīkṣikī as the disciplined investigation of reality through the joint operation of perception, inference, analogy, and testimony. It consists of the critical review (anu-īkṣaṇa) of data previously apprehended.",
    significance: "Differentiates authentic rational inquiry from hollow sophistry. Uddyotakara proves that an inference contradicted by direct perception is instantly discarded (bādhita) because perception is epistemically more authoritative.",
    relatedConcepts: ["catasro-vidyah", "pramana", "anumana", "pratyaksha"]
  },
  {
    id: "pancavayava-samplava",
    sanskrit: "पञ्चावयव-प्रमाणसंप्लव",
    iast: "pañcāvayava-pramāṇa-saṃplava",
    english: "The Syllogism as the Synthesis of All Four Pramāṇas",
    forBeginners: "Why is the Nyāya five-part syllogism celebrated as the 'supreme reasoning' (paramo nyāyaḥ)? Because it is not an abstract mechanical formula — each of its five sentences directly marshals one of the four ways of knowing: (1) Proposition ('There is fire on the mountain') = Verbal Testimony, (2) Reason ('Because there is smoke') = Inference, (3) Example ('Just as seen in a kitchen hearth') = Direct Perception, (4) Application ('Just like the hearth, so on this mountain') = Analogy/Comparison, and (5) Conclusion = The binding synthesis proving that all four ways of knowing bear upon the exact same truth! Only when this fivefold choir speaks together is a stubborn opponent convinced.",
    category: "Dialectics",
    definition: "The classical doctrine that the five members of the Nyāya syllogism (Pratijñā, Hetu, Udāharaṇa, Upanaya, Nigamana) embody and synthesize all four Pramāṇas (Śabda, Anumāna, Pratyakṣa, Upamāna) into a single, syntactically unified statement (eka-vākyatā).",
    significance: "Vātsyāyana and Uddyotakara establish that the fivefold declaration is the highest form of reasoning (paramo nyāyaḥ) because it presents an airtight, multi-modal demonstration capable of convincing any rational inquirer.",
    relatedConcepts: ["pramana", "pramana-samplava", "anumana", "anviksiki-nyaya"]
  },
  {
    id: "tarka-anugrahaka",
    sanskrit: "तर्क (अनुग्राहक)",
    iast: "tarka (anugrāhaka)",
    english: "Tarka: The Dialectical Auxiliary to Proof",
    forBeginners: "Suppose someone asks: 'Is human suffering caused by past karma, or did life just arise by random accident?' You cannot put karma under a microscope. Here, Nyāya deploys 'Tarka' (hypothetical reasoning / reductio ad absurdum): 'If life had no cause, then because an uncaused thing has no beginning and no conditions, it could never be brought to an end — which would mean human suffering could never be cured! But we know suffering CAN be removed; therefore, the claim that life is uncaused is logically absurd.' Tarka is not a fifth instrument of knowledge on its own; it is the master assistant that incinerates impossible rival theories so the truth can stand tall.",
    category: "Dialectics",
    definition: "Hypothetical reasoning (tarka) that does not produce direct knowledge independently, but serves as an indispensable auxiliary (anugrāhaka) to the Pramāṇas by demonstrating the absurd consequences (prasaṅga) of rival hypotheses.",
    significance: "Together with Nirṇaya (Demonstrated Truth), Tarka is declared by Vātsyāyana to govern all worldly affairs, cognitive judgments, and scientific determinations (sarva-loka-vyavahāraḥ).",
    relatedConcepts: ["nirnaya", "pramana", "anviksiki-nyaya"]
  },
  {
    id: "katha-traya",
    sanskrit: "कथा-त्रय (वाद-जल्प-वितण्डा)",
    iast: "kathā-traya (vāda-jalpa-vitaṇḍā)",
    english: "The Three Modes of Philosophical Debate",
    forBeginners: "Not all philosophical debates have the same purpose. Nyāya divides all debate into three distinct forms based on who is speaking and why: (1) Vāda (Discussion): Between a teacher and student or two sincere seekers of truth. There are no ego games, no tricky misdirections, and only genuine fallacies can be pointed out. (2) Jalpa (Disputation): When an aggressive or stubborn opponent attacks your school simply to win. Here, you are permitted to use debate maneuvers, quibbles, and clinchers — like putting up a barbed-wire fence to keep stray cattle from trampling a tender sapling of truth. (3) Vitaṇḍā (Wrangling): The opponent doesn't even have a theory of their own; they simply attack and dismantle whatever you say.",
    category: "Dialectics",
    definition: "The classical Nyāya taxonomy of philosophical colloquy: (1) Vāda (honest debate aimed at establishing truth), (2) Jalpa (polemical disputation aimed at victory using defensive counter-tactics), and (3) Vitaṇḍā (destructive wrangling where no counter-thesis is maintained).",
    significance: "Uddyotakara demonstrates that even the wrangler has a motive (prayojana), and that Jalpa and Vitaṇḍā serve as the protective dialectical armor shielding philosophical realization until truth can be firmly received.",
    relatedConcepts: ["shodasha-padartha", "prayojana", "anviksiki-nyaya"]
  },
  {
    id: "pradipa-sarvavidyanam",
    sanskrit: "प्रदीपः सर्वविद्यानाम्",
    iast: "pradīpaḥ sarva-vidyānām",
    english: "The Lamp of All Sciences (The Sovereign Motto)",
    forBeginners: "At the conclusion of explaining the very first aphorism, Vātsyāyana quotes a famous ancient verse that every Indian philosopher knows: 'Nyāya is the lamp of all sciences, the resource of all practical enterprises, and the foundation of all righteous duties.' Why call it a lamp? Because medicine, astronomy, economics, and ethics all make assertions based on evidence — but none of those sciences pause to examine what 'evidence' actually is! Nyāya is the universal lamp that illuminates the cognitive instruments that every other discipline takes for granted.",
    category: "Hermeneutics",
    definition: "The celebrated concluding verse of Vātsyāyana's commentary on Sūtra 1.1.1: 'pradīpaḥ sarvavidyānām upāyaḥ sarvakarmaṇām / āśrayaḥ sarvadharmāṇāṃ śaśvad ānvīkṣikī matā //'.",
    significance: "The definitive historical declaration of Nyāya's centrality in classical Indian intellectual life, establishing epistemology as the foundational precondition for all sciences, moral duties, and practical accomplishments.",
    relatedConcepts: ["catasro-vidyah", "anviksiki-nyaya", "pravritti-samarthya"]
  },
  {
    id: "apavarga-hetu-parampara",
    sanskrit: "अपवर्ग-हेतु-परम्परा (उत्तरोत्तरापाय)",
    iast: "apavarga-hetu-paramparā (uttarottarāpāya)",
    english: "The Reverse Causal Chain of Liberation",
    forBeginners: "Does enlightenment strike all at once the moment you read a profound book? Gautama and Vātsyāyana say no: release follows an exact, five-link reverse domino effect described in Sūtra 1.1.2. Bondage is an upside-down tower: False Ideas breed Emotional Defects (attachment and aversion), which trigger Karmic Actions, which force Rebirth, which generates Pain. The moment True Knowledge shatters False Ideas, the defects evaporate. Without defects, no new karma is created. Without karma, rebirth stops. And without rebirth, the 21 kinds of pain vanish forever. This complete, permanent extinguishing of suffering is Apavarga.",
    category: "Metaphysics",
    definition: "The five-member causal sequence of bondage and emancipation formulated in Nyāya-Sūtra 1.1.2: Mithyājñāna (delusion) -> Doṣa (defects of passion/aversion) -> Pravṛtti (karmic activity) -> Janma (embodied rebirth) -> Duḥkha (suffering). The destruction of each successive factor brings about the eradication of the preceding one, culminating in Apavarga.",
    significance: "Establishes Nyāya's medical soteriological model in precise psychological and metaphysical terms, proving that logical mastery is the direct antidote to the cycle of reincarnation.",
    relatedConcepts: ["caturvyuha-shastra", "ekavimshati-duhkha", "apavarga", "tattva-sat-asat"]
  },
  {
    id: "apara-para-apavarga",
    sanskrit: "अपर-अपवर्ग एवं पर-अपवर्ग",
    iast: "apara-apavarga evam para-apavarga",
    english: "Lower and Higher Release (Preserving the Lineage of Science)",
    forBeginners: "If realizing the absolute truth caused your body to drop dead on the spot, how could the Buddha, Shankara, or Gautama ever teach their disciples? In the Introductory Vārtika to Sūtra 1.1.2, Uddyotakara solves this problem by distinguishing two tiers of freedom: Lower Release (Apara-Apavarga) and Higher Release (Para-Apavarga). The moment true knowledge dawns, mental defects dissolve, no new karma is accumulated, and the sage lives on in deep peace as an enlightened teacher — keeping the scientific tradition alive from generation to generation. Only later, when the physical body's past fuel runs out, does Higher Release (ultimate emancipation) occur.",
    category: "Metaphysics",
    definition: "Uddyotakara's two-tier formulation of liberation: (1) Apara-Apavarga (Lower Release), occurring immediately upon True Knowledge, where passion/defects cease and no further karma is forged, enabling the teacher to transmit the science; and (2) Para-Apavarga (Higher Release / Videhamukti), occurring upon the physical exhaustion of existing prārabdha karma faculties.",
    significance: "Protects the continuity of philosophical education (śāstra-sampradāya-paramparā). Without Apara-Apavarga, the enlightened would cease to exist instantaneously, reducing scientific treatises to baseless 'castles in the air' without trustworthy sponsors.",
    relatedConcepts: ["apavarga-hetu-parampara", "apavarga", "caturvyuha-shastra"]
  },
  {
    id: "madhu-visha-nyaya",
    sanskrit: "मधुविषसम्पृक्तान्न-न्याय",
    iast: "madhu-viṣa-saṃpṛktānna-nyāya",
    english: "Honey Mixed with Poison (Inseparability of Pleasure and Pain)",
    forBeginners: "Why can't we simply ask to keep life's pleasant pleasures while throwing away its painful miseries? Vātsyāyana and Uddyotakara explain with a striking metaphor: worldly pleasure is like delicious honey smeared over deadly poison. The very senses and body that feel sweetness are the ones that hurt; craving pleasure is haunted by fear of loss and jealousy; and you cannot swallow one half of a poisoned sweet while discarding the other. Because worldly pleasure is invariably contaminated by pain, the wise seeker renounces both to attain untainted peace.",
    category: "Metaphysics",
    definition: "The classical philosophical principle that worldly pleasure is inextricably bound up with suffering through four bonds: invariable concomitance (avinābhāva), shared causes (samāna-kāraṇa), shared physical substratum (samāna-āśraya), and identical experiencing agency (samāna-upalabdhi). Hence, pleasure is renounced alongside pain like food mixed with honey and poison.",
    significance: "Foundational to the Nyāya definition of Duḥkha in Sūtra 1.1.2 and Sūtra 1.1.21, proving that hedonistic compromise is impossible in authentic soteriology.",
    relatedConcepts: ["ekavimsati-duhkha", "apavarga-hetu-parampara", "duhkha-chain-nyaya"]
  },
  {
    id: "trividha-shastra-pravritti",
    sanskrit: "त्रिविध-शास्त्र-प्रवृत्ति (उद्देश-लक्षण-परीक्षा)",
    iast: "trividha-śāstra-pravṛtti (uddeśa-lakṣaṇa-parīkṣā)",
    english: "The Threefold Scientific Procedure: Enunciation, Definition, Examination",
    forBeginners: "How does a rigorous science explore anything without descending into chaos? Vātsyāyana establishes that rational inquiry proceeds in three strict, non-negotiable steps: (1) Uddeśa (Enunciation) — naming the category (like introducing a player onto the field); (2) Lakṣaṇa (Definition) — pinpointing the unique, essential property that distinguishes it from everything else; and (3) Parīkṣā (Critical Examination) — putting the definition through rigorous dialectical testing to see if it actually holds up. Sūtra 1.1.1 named the 16 categories; now the text moves into defining and examining them.",
    category: "Epistemology",
    definition: "The canonical Nyāya methodological architecture: (1) Uddeśa (nominal enunciation of categories), (2) Lakṣaṇa (formulation of invariant differentiating characteristics), and (3) Parīkṣā (critical dialectical scrutiny investigating whether the definition validly applies).",
    significance: "The definitive scientific methodology of classical Indian philosophy, guaranteeing that no metaphysical category is accepted on authority without distinct definition and argumentative verification.",
    relatedConcepts: ["pramana-vibhaga-parisamkhya", "anviksiki-nyaya", "lakshana-dosha"]
  },
  {
    id: "pramana-vibhaga-parisamkhya",
    sanskrit: "प्रमाण-विभाग एवं परिसंख्या",
    iast: "pramāṇa-vibhāga evam parisaṅkhyā",
    english: "The Fourfold Restriction and Purpose of Enumeration",
    forBeginners: "If Sūtra 1 already named 'Pramāṇa', why did Gautama write a whole separate rule (Sūtra 3) just saying 'Perception, Inference, Analogy, and Word are the Pramāṇas'? An opponent asks: 'Isn't that redundant?' Uddyotakara delivers a sharp logical answer: a definition only tells you what a thing is like; it CANNOT tell you how many of them exist in the universe. If Gautama hadn't written Sūtra 3, you would never know whether there were 4, 6, or 10 valid ways of knowing! Sūtra 3 acts as an explicit boundary fence ('parisaṅkhyā'): these four, and only these four.",
    category: "Epistemology",
    definition: "The epistemological rule that nominal definition (lakṣaṇa) merely differentiates an object from homogeneous and heterogeneous entities, but cannot establish numerical restriction (saṅkhyā-niyama). Sūtra 1.1.3 provides specific enumeration (vibhāga / parisaṅkhyā) to definitively establish that Pramāṇas are four only.",
    significance: "Refutes rival epistemologies (Cārvāka's 1, Buddhist/Vaiśeṣika's 2, Sāṃkhya's 3, Mīmāṃsā's 6) by proving that four instruments are both necessary and exhaustive.",
    relatedConcepts: ["trividha-shastra-pravritti", "pramana", "pratyaksha", "anumana"]
  },
  {
    id: "pramana-phala-bhava",
    sanskrit: "प्रमाण-फल-भाव (प्रमिति एवं हान-उपादान-उपेक्षा)",
    iast: "pramāṇa-phala-bhāva (pramiti evam hāna-upādāna-upekṣā)",
    english: "Instrument and Practical Result: Valid Cognition and Action Dispositions",
    forBeginners: "What is the relationship between an instrument of knowledge and what it produces? In Nyāya, it works on two levels: If you treat the eye's contact with an apple as the instrument (Pramāṇa), the immediate result is the clear thought 'this is a ripe red apple' (Pramiti). But if you treat that thought itself as the instrument, the ultimate practical result is what you DO next: Rejection (Hāna — putting down a rotten fruit), Acquisition (Upādāna — biting into the ripe apple), or Indifference (Upekṣā — ignoring a pebble). Knowledge is never an idle abstraction; it directly commands practical human life.",
    category: "Epistemology",
    definition: "The dynamic relationship between epistemic instrument (pramāṇa) and cognitive/behavioral fruit (phala). When pramāṇa is the operative contact (sannikarṣa), the fruit is valid cognition (pramiti); when pramāṇa is the cognition itself, the practical fruit is the threefold active response: avoidance (hāna), acceptance (upādāna), or indifference (upekṣā).",
    significance: "Demonstrates that Nyāya epistemology is pragmatically grounded in purposeful human action (pravṛtti-sāmarthya) rather than detached intellectualism.",
    relatedConcepts: ["pravritti-samarthya", "artha-kriya", "pramana"]
  },
  {
    id: "pratyaksha-jyaishthya",
    sanskrit: "प्रत्यक्ष-ज्यैष्ठ्य (जिज्ञासा-निवृत्ति)",
    iast: "pratyakṣa-jyaiṣṭhya (jijñāsā-nivṛtti)",
    english: "The Primacy of Perception and the Quenching of Inquiry",
    forBeginners: "Why is Perception placed first among the four instruments of knowledge? Vātsyāyana gives two brilliant reasons: First, all other proofs depend on it — you can't infer fire without having seen smoke in the past, you can't understand an analogy without seeing the cow, and you can't hear words without auditory perception. Second, and most beautifully: Perception alone puts human intellectual restlessness to rest (jijñāsā-nivṛtti). If a friend tells you fire is in the next room, you want to deduce it; when you deduce it, you still want to peek inside and look; but once you see the flames with your own eyes, your curiosity is completely satisfied.",
    category: "Epistemology",
    definition: "The supreme primacy (jyaiṣṭhya / prādhānya) of direct perception among all epistemic instruments, based on: (1) its status as the causal prerequisite for inference, analogy, and verbal hearing; and (2) its psychological power to bring intellectual inquiry and restless desire for confirmation (jijñāsā) to complete rest (nivṛtti).",
    significance: "Anchor of Nyāya realism. Regardless of dialectical sophistication, direct perceptual contact remains the supreme court of empirical and metaphysical verification.",
    relatedConcepts: ["pratyaksha", "pramana-samplava", "jijnasa"]
  },
  {
    id: "pramana-vyavastha",
    sanskrit: "प्रमाण-व्यवस्था",
    iast: "pramāṇa-vyavasthā",
    english: "Epistemic Partition (Exclusive Epistemic Domains)",
    forBeginners: "While Nyāya champions convergence (that fire or the soul can be known through perception, inference, and testimony), it also acknowledges that certain things can ONLY ever be known by one specific instrument. For instance, the bliss of Heaven or metaphysical rituals can only be learned through Sacred Words; the unseen source of thunder can only be inferred through its sound; and the sensation of your own palm can only be known by direct perception. Nyāya balances convergence with strict domain-partition where necessary.",
    category: "Epistemology",
    definition: "The epistemic condition wherein a particular object of cognition is amenable exclusively to one specific instrument of knowledge, complementing the general rule of Pramāṇa-saṃplava.",
    significance: "Shows that Nyāya realism does not naively demand sensory confirmation for transcendent duties, nor inferential over-complication for immediate bodily awareness.",
    relatedConcepts: ["pramana-samplava", "pramana", "shabda", "pratyaksha"]
  },
  {
    id: "sadvidha-sannikarsha",
    sanskrit: "षड्विध-सन्निकर्ष",
    iast: "ṣaḍvidha-sannikarṣa",
    english: "The Sixfold Perceptual Contact",
    forBeginners: "How exactly do your physical senses connect to reality without making philosophical mistakes? Nyāya explains that you don't just 'see things' in one generic way; your senses connect through six distinct metaphysical bridges: (1) Conjunction (eye touching the physical pot); (2) Inherence in the conjoined (eye seeing the red color living in that pot); (3) Inherence in that which inheres in the conjoined (eye recognizing the universal concept of 'redness' living inside that red color); (4) Direct Inherence (the ear-drum cavity, which is pure space, directly housing sound waves); (5) Inherence in the inherent (hearing 'soundhood' living inside that sound); and (6) Qualifier-Qualified relation (seeing an absence or void, such as seeing that a pot is missing from an empty table). This six-step taxonomy grounds every sensory perception in precise ontological reality.",
    category: "Epistemology",
    definition: "Uddyotakara’s canonical sixfold taxonomy of sense-object contact: (1) Saṃyoga (conjunction between two substances, e.g. eye and pot); (2) Saṃyukta-samavāya (inherence in the conjoined, e.g. eye perceiving color/action in the pot); (3) Saṃyukta-samaveta-samavāya (inherence in what inheres in the conjoined, e.g. eye perceiving generic colorhood / rūpatva); (4) Samavāya (inherence, e.g. ear cavity ākāśa perceiving sound); (5) Samaveta-samavāya (inherence in the inherent, e.g. ear perceiving generic soundhood / śabdatva); and (6) Viśeṣaṇa-viśeṣya-bhāva (qualifier-qualified relation, e.g. perceiving the absence of a pot on the floor).",
    significance: "Provides the ontological bridge between Nyāya realism and sensory perception, demonstrating that qualities, universals, and even objective absences (abhāva) are genuinely perceived through rigorous metaphysical relations.",
    relatedConcepts: ["pratyaksha", "sannikarsha", "samavaya", "abhava"]
  },
  {
    id: "prapyakaritva",
    sanskrit: "प्राप्यकारित्व (इन्द्रियाणां प्राप्यकारित्व-वाद)",
    iast: "prāpyakāritva (indriyāṇāṃ prāpyakāritva-vāda)",
    english: "Physical Contact of Sense Organs & Visual Ray Emission",
    forBeginners: "Does your eye see things by sitting back passively and letting images enter, or by sending out something to reach the object? Buddhist thinkers argued that the eye acts without ever physically touching things ('aprāpyakāri') because we see distant stars and massive mountains that couldn't possibly fit inside our pupils. Uddyotakara fiercely refutes this: the true visual organ is not the fleshy eyeball, but subtle light-energy (taijasa) that shoots outward from the eye, expanding in conical beams like a lamp. Decisive proof: if the eye didn't have to physically reach its object, why would wooden walls, stone screens, or doors stop you from seeing what's on the other side? The fact that opaque obstacles block your vision proves that visual light is physically blocked from reaching the object.",
    category: "Epistemology",
    definition: "The orthodox Nyāya-Vaiśeṣika doctrine that all cognitive sense organs, without exception, function solely by physically reaching and establishing direct contact with their objects (prāpya kārīṇi indriyāṇi). Specifically establishes that the visual organ (cakṣus) is composed of radiant light (taijasa) whose ocular rays (nayana-raśmi) emit outward to envelop external objects.",
    significance: "Defends realism against Buddhist phenomenalism and representationalism. Guarantees that perception is direct contact with external objects rather than an internal projection of mental consciousness.",
    relatedConcepts: ["pratyaksha", "sadvidha-sannikarsha", "shata-patra-bhedana-nyaya", "sannikarsha", "sharira-indriya-bhuta"]
  },
  {
    id: "shata-patra-bhedana-nyaya",
    sanskrit: "शतपत्रभेदन-न्याय",
    iast: "śata-patra-bhedana-nyāya",
    english: "The Needle Piercing 100 Lotus Petals (Illusion of Temporal Simultaneity)",
    forBeginners: "When you look out the window, you seem to see the tree branch right next to you and the moon in outer space at the very same split second. An opponent argues: 'If your eye has to physically travel to the moon, how can you see both at the exact same instant?' Uddyotakara responds with a famous Indian analogy: imagine stacking 100 lotus petals on top of each other and driving a sharp needle straight through them. To your eye, all 100 petals seem pierced at the exact same moment. But in reality, the needle pierces petal 1, then petal 2, then petal 3, one after another in microscopic intervals! Your mind simply cannot notice such lightning-fast micro-succession. Likewise, visual light travels to the branch and then to the moon sequentially, creating an illusion of simultaneity.",
    category: "Epistemology",
    definition: "The classical philosophical maxim demonstrating that apparent temporal simultaneity (yugapat-pratyaya) is often an illusion caused by the non-apprehension of micro-temporal intervals (kāla-bheda-anupalabdhi), exemplified by a needle piercing a stack of one hundred lotus petals sequentially.",
    significance: "Crucial dialectical weapon used by Uddyotakara to defend the Prāpyakāritva of the visual organ and the atomic, serial processing nature of the Mind (Manas).",
    relatedConcepts: ["prapyakaritva", "manas", "pratyaksha"]
  },
  {
    id: "manas-antarindriya-tantrayukti",
    sanskrit: "मनसः आन्तरिन्द्रियत्वं तन्त्रयुक्तिश्च",
    iast: "manasaḥ antarindriyatvaṃ tantrayuktiśca",
    english: "Mind as Internal Sense Organ & The Rule of Uncontradicted Doctrine",
    forBeginners: "If Sūtra 1.1.4 says perception must come from sense-organs, how do you perceive your own soul, joy, or sadness? The Mind isn't listed in Sūtra 1.1.12 with the eyes and ears! Does that mean self-knowledge isn't perception? Vātsyāyana and Uddyotakara explain: the Mind IS an internal sense-organ. It wasn't grouped with the outer five because outer senses are made of physical elements and only perceive one thing (the eye only sees color), whereas the Mind is non-elemental, eternal, and supervises everything. Furthermore, they cite an ancient rule of scholarly debate (Tantrayukti): 'What is firmly established in an allied system (like Vaiśeṣika) and left uncontradicted is formally accepted as one's own.'",
    category: "Epistemology",
    definition: "The Nyāya demonstration that the Mind (Manas) is an internal sense-organ (antarindriya) despite not being enumerated among the five physical organs in Sūtra 1.1.12. Outer organs are elemental (bhautika) and domain-specific (niyata-viṣaya), whereas Mind is non-elemental (abhautika) and omni-domain (sarva-viṣaya). Methodologically grounded on the hermeneutic canon (Tantra-yukti): 'Para-matam apratiṣiddham anumatam bhavati' (doctrines established in allied systems and not refuted are authoritative).",
    significance: "Validates introspection, psychological self-awareness, and the direct perception of the Soul (Ātman) and affective states (Sukha/Duḥkha) as genuine empirical perception.",
    relatedConcepts: ["pratyaksha", "manas", "atman", "trividha-shastra-pravritti"]
  },
  {
    id: "ekatrimshad-vikalpa",
    sanskrit: "एकत्रिंशद्-विकल्प (पञ्चाङ्ग-लक्षण-परिसंख्या)",
    iast: "ekatriṃśad-vikalpa (pañcāṅga-lakṣaṇa-parisaṅkhyā)",
    english: "The 31 Combinatorial Permutations of the Definition of Perception",
    forBeginners: "Does Gautama's definition of perception consist of five separate definitions jumbled together, or must all five words work together as one team? Uddyotakara performs a brilliant mathematical calculation: if you combine 5 words in every possible combination (singles, pairs, triplets, quads), you get exactly 31 possibilities (2^5 - 1 = 31). He methodically tests and rejects all 30 partial combinations! For example, if you leave out 'cognition', pleasure and pain get wrongly counted as perception; if you leave out 'non-erroneous', mirages get counted; if you leave out 'determinate', doubts get counted. Only the 31st alternative — all five words operating together — forms a complete, leak-proof definition.",
    category: "Epistemology",
    definition: "Uddyotakara’s mathematical-dialectical proof that Sūtra 1.1.4 is a collective composite definition (samudāya-pakṣa) rather than a set of disjoint definitions (pratyeka-pakṣa). From the 31 combinatorial permutations of five terms (5 single + 10 pairs + 10 triplets + 5 quadruplets + 1 quintuplet), all 30 partial definitions are rejected due to over-extension (ativyāpti), leaving the 31st unified formulation as the sole faultless definition.",
    significance: "Showcases the pinnacle of classical Indian analytical philosophy and formal combinatorial methodology applied to linguistic definition (lakṣaṇa-parīkṣā).",
    relatedConcepts: ["pratyaksha", "trividha-shastra-pravritti", "lakshana-dosha"]
  },
  {
    id: "nirvikalpaka-savikalpaka-vada",
    sanskrit: "निर्विकल्पक-सविकल्पक-प्रत्यक्ष (अव्यपदेश्यं व्यवसायात्मकं च)",
    iast: "nirvikalpaka-savikalpaka-pratyakṣa (avyapadeśyaṃ vyavasāyātmakaṃ ca)",
    english: "Indeterminate and Determinate Perception",
    forBeginners: "When you first see something completely strange in the dark or as a newborn baby, your senses grasp its raw shape and color BEFORE you can think of a word or label for it. Grammarian philosophers argued: 'Nothing can be perceived without words; words and thoughts are permanently glued together!' Nyāya fiercely disagrees: Sūtra 1.1.4 includes 'avyapadeśya' (unnamable) precisely to prove that raw, non-verbal perception (Nirvikalpaka) is genuine and comes first. Then, once your mind connects the object with its name, class, and qualities, it becomes clear and determinate perception (Savikalpaka, 'vyavasāyātmakam'). Both stages are real, but perception starts purely in the senses without language.",
    category: "Epistemology",
    definition: "The Nyāya two-stage perceptual architecture derived from Sūtra 1.1.4: (1) Nirvikalpaka-pratyakṣa (indicated by 'avyapadeśya'), the direct, indeterminate, non-relational apprehension of pure substance and universal devoid of linguistic labels or syntactic structure; and (2) Savikalpaka-pratyakṣa (indicated by 'vyavasāyātmaka'), the structured, determinate cognition articulating the object together with its qualifiers, names, and generic classes.",
    significance: "Decisive refutation of Bhartṛhari's Śabdādvaita (linguistic monism) and preservation of pure empirical realism independent of semantic convention.",
    relatedConcepts: ["pratyaksha", "sadvidha-sannikarsha", "vyavasayatmaka"]
  },
  {
    id: "kalpanapodha-khandana",
    sanskrit: "कल्पनापोढ-लक्षण-खण्डन (दिङ्नाग-वसुबन्धु-मत-निरास)",
    iast: "kalpanāpoḍha-lakṣaṇa-khaṇḍana (diṅnāga-vasubandhu-mata-nirāsa)",
    english: "Refutation of Buddhist Epistemology of Perception",
    forBeginners: "Buddhist logician Dignāga famously defined perception as 'that which is free from conceptual construction' (kalpanāpoḍham), arguing that real perception only touches isolated momentary particulars (svalakṣaṇa) and that all words and concepts are false fictions. Uddyotakara exposes a devastating logical trap: if perception is genuinely beyond words and cannot be expressed by any name, then defining it with the words 'free from conceptual construction' is a direct self-contradiction (vyāghāta)! If Dignāga's words succeed in explaining perception, then perception is NOT beyond words; if his words fail, his definition is meaningless babble, like 'the dream of a mute person' (mūka-svapna-vat). Nyāya proves that both the raw sensory object AND its real universal structure are directly perceived.",
    category: "Epistemology",
    definition: "Uddyotakara’s systematic refutation of Buddhist perceptual definitions in Nyāya-Vārtika 1.1.4, specifically targeting Vasubandhu’s 'tato 'rthād utpannaṃ jñānam' (vitiated by the momentariness doctrine wherein the causal object perishes before cognition arises) and Dignāga’s 'kalpanāpoḍhaṃ pratyakṣam' (vitiated by inescapable self-contradiction, vyāghāta, and the reduction of epistemic definition to meaningless nonsense).",
    significance: "The cornerstone dialectical encounter between Nyāya realism and Buddhist apoha-vāda / phenomenalism, defending the reality of macroscopic composite substances, universals, and structured perception.",
    relatedConcepts: ["pratyaksha", "nirvikalpaka-savikalpaka-vada", "prapyakaritva"]
  },
  {
    id: "purvavat-seshavat-samanyatodrsta",
    sanskrit: "पूर्ववत्-शेषवत्-सामान्यतोदृष्ट-त्रिविध-अनुमान",
    iast: "pūrvavat-śeṣavat-sāmānyatodṛṣṭa-trividha-anumāna",
    english: "The Threefold Classical Inference (Causal and Correlative)",
    forBeginners: "How do humans infer unseeable things? Gautama gives three distinct channels: (1) Pūrvavat (from cause to future effect): looking up and seeing dense black thunderclouds with lightning and flying crane formations, and knowing rain is about to fall; (2) Śeṣavat (from effect to past cause): seeing a swollen river roaring down the valley packed with mud and driftwood, and knowing heavy rain already poured on the distant mountaintop; and (3) Sāmānyatodṛṣṭa (from general spatial patterns): seeing the sun in the East at dawn and in the West at sunset, and inferring that the sun must have traveled/moved, just like you know a person who moved from one town to another must have walked or ridden, even if you never directly saw them taking steps.",
    category: "Epistemology",
    definition: "Vātsyāyana’s causal classification of inference in Sūtra 1.1.5: (1) Pūrvavat, inferring unperceived future effect from perceived prior cause; (2) Śeṣavat, inferring unperceived past cause from perceived posterior effect; and (3) Sāmānyatodṛṣṭa, inferring an imperceptible fact (such as solar locomotion, ādityasya gatimatvam) based on an established universal pattern of spatial translocation observed across empirical instances.",
    significance: "Establishes that scientific inference extends beyond static deductive syllogisms to natural causality, meteorological prediction, historical trace analysis, and astronomical calculation.",
    relatedConcepts: ["anumana", "linga-paramarsha", "traikalya-gocara-anumana"]
  },
  {
    id: "linga-paramarsha",
    sanskrit: "लिङ्ग-परामर्श (व्याप्तिविशिष्टपक्षधर्मताज्ञान)",
    iast: "liṅga-parāmarśa (vyāpti-viśiṣṭa-pakṣadharmatā-jñāna)",
    english: "The Synthetic Consideration of the Sign (The Direct Instrument of Inference)",
    forBeginners: "When you deduce that there's fire on a mountain, what actually triggers that 'aha!' moment? Is it seeing smoke? No, you've seen smoke before without thinking of a mountain. Is it remembering 'smoke means fire'? No, you could remember that while cooking indoors. Uddyotakara proves that the true trigger (the direct instrument or Pramāṇa) is a synthesized third realization happening right in your mind: 'Aha! That smoke rising on that exact mountain is the very kind of smoke that never exists without fire!' This instant fusion of memory and current perception is called Liṅga-parāmarśa. The moment it clicks, valid conclusion (anumiti) follows instantly.",
    category: "Epistemology",
    definition: "The operative instrument (karaṇa) of inferential cognition: the synthetic cognition apprehending the presence of the probans in the subject as qualified by its invariable concomitance with the probandum (vyāpti-viśiṣṭa-pakṣadharmatā-jñāna). In Nyāya epistemology, anumiti arises immediately and necessarily from this parāmarśa, making it the proximate Pramāṇa rather than isolated memory or raw sensory perception.",
    significance: "Constitutes the core epistemological engine of Nyāya logic, explaining the cognitive transition from observation to deduction and justifying the fourth member (Upanaya) of the five-limbed syllogism.",
    relatedConcepts: ["anumana", "purvavat-seshavat-samanyatodrsta", "vyapti"]
  },
  {
    id: "parisesha-pramana",
    sanskrit: "पारिशेष्य-प्रमाण (शेषवत्-अनुमान)",
    iast: "pāriśeṣya-pramāṇa (śeṣavat-anumāna)",
    english: "Inference by Elimination / Residue",
    forBeginners: "If a detective knows a crime was committed by one of four suspects, and three of them have airtight alibis, the fourth suspect MUST be guilty — even without an eyewitness. That is Pariśeṣa (Inference by Elimination). Nyāya uses this brilliant scientific method to prove deep philosophical truths. For example, what is Sound? Sound is created and perishes (so it's not an eternal category like Universals). It cannot be a physical substance (because it lives only in space, Ākāśa). It cannot be an action (because one sound creates another sound wave, whereas actions don't create actions). With everything else eliminated, by residue (pariśeṣāt), Sound must be a Quality (Guṇa)! Nyāya also uses this to prove the existence of the non-physical Soul.",
    category: "Epistemology",
    definition: "The second interpretation of Śeṣavat inference in Bhāṣya and Vārtika 1.1.5: cognition of the true nature of an object by dialectically negating and eliminating all alternative hypotheses until only the unrefuted remainder (śeṣa) stands verified. Exemplified by the classical proofs establishing that Sound is a Quality (Śabdasya guṇatva-sādhana) and that introspective states inhere in the Soul (Ātman).",
    significance: "Pioneered deductive elimination and disjunctive syllogism in Indian philosophy, demonstrating that truth can be decisively established through rigorous negation of all possible alternatives.",
    relatedConcepts: ["anumana", "purvavat-seshavat-samanyatodrsta", "trividha-shastra-pravritti"]
  },
  {
    id: "anvaya-vyatireki-trividha",
    sanskrit: "अन्वय-व्यतिरेकि-त्रिविध-अनुमान (केवलान्वयि-केवलव्यतिरेकि-सहितम्)",
    iast: "anvaya-vyatireki-trividha-anumāna (kevalānvayi-kevalavyatireki-sahitam)",
    english: "The Threefold Logical Universal Taxonomy (Affirmative-Negative, Affirmative, Negative)",
    forBeginners: "In Nyāya logic, how do reasons prove things? Uddyotakara classifies every inference in the world into three universal types: (1) Anvaya-Vyatirekī: standard reasoning where you have both positive examples and negative counter-examples (e.g. 'pots are made, so they break; space is not made, so it doesn't break'); (2) Kevalānvayī (Purely Affirmative): where literally everything in existence possesses the trait, so no counter-example is even possible (e.g. 'everything you can know can be named'); and (3) Kevalavyatirekī (Purely Negative): where there are NO positive examples outside the subject itself, so you prove it entirely by showing that denying it leads to absurdity (e.g. 'a living body has a soul, because if it didn't, it would be dead and lifeless').",
    category: "Epistemology",
    definition: "Uddyotakara’s threefold classification of inference in Nyāya-Vārtika 1.1.5 based on the scope of concomitance: (1) Anvaya-Vyatirekī (having both similar instances / sapakṣa and dissimilar instances / vipakṣa); (2) Kevalānvayī (purely affirmative, where vipakṣa is absent because the probandum is omnipresent across all knowables); and (3) Kevalavyatirekī (purely negative, where sapakṣa is absent because the probandum is unique to the subject, proved via counter-factual negation / vyatireka-vyāpti).",
    significance: "A monumental advancement in formal logic that expanded Indian epistemology beyond bilateral inductive models, accommodating universal categories and unique metaphysical proofs.",
    relatedConcepts: ["anumana", "trairupya-khandana", "vyapti"]
  },
  {
    id: "traikalya-gocara-anumana",
    sanskrit: "त्रैकाल्य-गोचरत्व (अनुमानस्य त्रैकालिक-विषयत्वम्)",
    iast: "traikālya-gocaratva (anumānasya traikālika-viṣayatvam)",
    english: "The Threefold Temporal Horizon of Inference",
    forBeginners: "Your eyes and ears can ONLY perceive what is happening right now in the present second. They cannot see yesterday's rainstorm or tomorrow's sunrise. But Inference has the superhuman ability to travel through time! Through inference, the mind looks at footprints in the sand and knows a traveler passed by yesterday (past); looks at smoke and knows fire is burning right now (present); looks at storm clouds and knows crops will be watered tomorrow (future). Inference breaks the prison of the present moment.",
    category: "Epistemology",
    definition: "The doctrine established by Vātsyāyana in Bhāṣya 1.1.5 distinguishing perception from inference by temporal scope: while Perception is strictly confined to the present (vartamāna-kāla-vyavasthita), Inference ranges across all three divisions of time (traikālya-viṣaya) — past (atīta), present (vartamāna), and future (anāgata).",
    significance: "Foundational distinction that elevates inference into the indispensable instrument for history, cosmology, scientific foresight, and metaphysical inquiry into past actions (karma) and future liberation (apavarga).",
    relatedConcepts: ["anumana", "pratyaksha", "purvavat-seshavat-samanyatodrsta"]
  },
  {
    id: "trairupya-khandana",
    sanskrit: "त्रैरूप्य-हेतु-लक्षण-खण्डन (दिङ्नाग-मत-निरास)",
    iast: "trairūpya-hetu-lakṣaṇa-khaṇḍana (diṅnāga-mata-nirāsa)",
    english: "Refutation of Buddhist Trairūpya-Hetu & Nāntarīyaka Epistemology",
    forBeginners: "Buddhist logician Dignāga claimed that every valid logical reason must strictly satisfy three rules: it must exist in the subject, exist in similar cases, and NEVER exist in dissimilar cases. Uddyotakara exposes that this formula breaks down completely! In Kevalānvayī (where everything is knowable), there ARE no dissimilar cases; under Dignāga's rule, a true universal would be declared invalid! In Kevalavyatirekī (proving the living soul), there are no other positive cases outside living bodies; Dignāga's rule would destroy it too. Furthermore, Uddyotakara deconstructs the Buddhist phrase 'nāntarīyakārtha-darśana' (seeing an inseparable thing), proving that rigid Buddhist formulas collapse into self-contradiction.",
    category: "Dialectics",
    definition: "Uddyotakara’s comprehensive dialectical refutation of Dignāga’s definition of the valid logical sign (trairūpya-hetu) in Nyāya-Vārtika 1.1.5. Demonstrates that enforcing three rigid conditions excludes Kevalānvayī and Kevalavyatirekī inferences, that restrictive particles (eva) create contradictory requirements between pakṣa and sapakṣa, and that the Buddhist formula 'nāntarīyakārtha-darśana' is grammatically untenable and redundant.",
    significance: "The defining debate between classical Nyāya and Buddhist Pramāṇavāda on the formal criteria of logical validity, securing the autonomy of inductive-deductive realism.",
    relatedConcepts: ["anvaya-vyatireki-trividha", "linga-paramarsha", "anumana"]
  },
  {
    id: "samavaya-svatah-siddhatva",
    sanskrit: "समवायस्य स्वतःसिद्धत्व (अनवस्था-दोष-निरास)",
    iast: "samavāyasya svataḥ-siddhatva (anavasthā-doṣa-nirāsa)",
    english: "The Self-Sufficient Inherence Doctrine (Immunity to Infinite Regress)",
    forBeginners: "When glue sticks two pieces of paper together, do you need a second layer of glue to stick the first glue to the paper, and a third layer of glue for that glue? If you did, you would need infinite glue and nothing would ever stick! That is called Infinite Regress (Anavasthā). When skeptics attacked Nyāya's relation of Inherence (Samavāya) — which connects qualities to substances and causes to effects — asking 'What connects Inherence to the things it connects?', Uddyotakara delivered an immortal answer: Inherence is self-connecting and self-sufficient (svataḥ-siddha). It connects relata by its very presence without needing an endless ladder of secondary relations.",
    category: "Metaphysics",
    definition: "The Nyāya-Vaiśeṣika doctrine formulated by Uddyotakara in Vārtika 1.1.5 proving that the ontological relation of Inherence (Samavāya) is singular, eternal, and inherently self-connecting (svataḥ-siddha). Rejects the opponent's demand for a mediating relation by demonstrating that postulating a relation for a relation generates a fatal infinite regress (anavasthā-prasaṅga).",
    significance: "A cornerstone ontological defense of realism, grounding the reality of composite wholes, inhering qualities, and the objective validity of inferential concomitance (vyāpti).",
    relatedConcepts: ["sadvidha-sannikarsha", "parisesha-pramana", "trividha-shastra-pravritti"]
  },
  {
    id: "pramana",
    sanskrit: "प्रमाण",
    iast: "pramāṇa",
    english: "Means of Valid Knowledge",
    forBeginners: "This is just the philosophical word for 'a reliable way of knowing something is true.' Nyāya says there are exactly four: actually seeing/hearing it yourself, figuring it out logically from clues, learning it by comparison, and being told by someone trustworthy. Before arguing about God, the soul, or anything else, Nyāya insists you first nail down HOW you'd even know you were right.",
    category: "Epistemology",
    definition: "The fundamental instruments or sources through which accurate, valid knowledge (pramā) of the world is acquired. Nyaya accepts four: Perception, Inference, Analogy, and Verbal Testimony.",
    significance: "Pramana is the foundational bedrock of Nyaya philosophy. Before any metaphysical claims about the soul, universe, or liberation can be made, the means of knowing must be rigorously tested and established.",
    relatedConcepts: ["pratyaksha", "anumana", "upamana", "shabda"]
  },
  {
    id: "pratyaksha",
    sanskrit: "प्रत्यक्ष",
    iast: "pratyakṣa",
    english: "Perception",
    forBeginners: "This is simply direct perception — seeing the red apple in front of you, hearing the door slam, feeling the cold. Nyāya's rule is strict: it only counts as real perception if your sense organ actually makes contact with the thing, and your resulting impression is clear and correct, not a confused guess.",
    category: "Epistemology",
    definition: "Direct, unmediated knowledge arising from the contact (sannikarsha) of a sense organ with its object. It must be non-erroneous, determinate, and not dependent on verbal cognition.",
    significance: "As the primary and most undeniable means of knowledge, Perception is the anchor for all other pramanas. Inference and Analogy ultimately depend on prior sensory data.",
    relatedConcepts: ["sannikarsha", "manas", "atman", "jnana"]
  },
  {
    id: "anumana",
    sanskrit: "अनुमान",
    iast: "anumāna",
    english: "Inference",
    forBeginners: "This is figuring something out you can't directly see, based on a clue you can see — like knowing there's fire on a distant hill because you can see smoke rising from it, even though the fire itself is hidden. It works because you've learned, from past experience, that smoke and fire reliably go together.",
    category: "Epistemology",
    definition: "Cognition that follows a prior perception. It is the logical deduction of an unperceived object (like fire) based on the perception of a logical sign or mark (like smoke), relying on the memory of their invariable concomitance (vyapti).",
    significance: "Inference is the cornerstone of Nyaya logic, allowing human beings to expand their knowledge beyond the immediate reach of the senses, enabling science, philosophy, and rational inquiry.",
    relatedConcepts: ["pratyaksha", "vyabhicara", "hetvabhasa", "drishtanta"]
  },
  
  {
    id: "upamana",
    sanskrit: "उपमान",
    iast: "upamāna",
    english: "Analogy / Comparison",
    forBeginners: "Imagine someone tells you 'a gavaya is an animal that looks like a cow,' and then, months later, you spot one in the wild and instantly recognize it: 'oh, that's a gavaya!' That flash of recognition — matching a new thing to its name using a description of similarity — is what this category of knowledge covers.",
    category: "Epistemology",
    definition: "Knowledge of the relationship between a name and the object it denotes, based on a recognized similarity to a familiar object (e.g., identifying a wild gavaya because one was told it looks like a cow).",
    significance: "It validates the practical acquisition of new vocabulary and taxonomy in unknown environments, acting as a bridge between linguistic instruction and direct sensory experience.",
    relatedConcepts: ["shabda", "pratyaksha"]
  },
  {
    id: "shabda",
    sanskrit: "शब्द",
    iast: "śabda",
    english: "Verbal Testimony / Word",
    forBeginners: "This is simply learning something because a trustworthy person told you — like trusting a doctor's diagnosis or a history teacher's facts, rather than personally verifying everything yourself from scratch. Nyāya treats this as a genuine, valid way of gaining knowledge, not a lesser substitute for 'real' proof.",
    category: "Epistemology",
    definition: "The instructive assertion of a reliable, trustworthy authority (Apta). It provides valid knowledge regarding both perceptible things (worldly facts) and imperceptible things (spiritual realms).",
    significance: "Acknowledges that humans cannot personally verify everything. Civilizational knowledge, history, and spiritual truths are transmitted through the valid testimony of reliable witnesses.",
    relatedConcepts: ["apta", "samaya", "veda"]
  },

  {
    id: "apta",
    sanskrit: "आप्त",
    iast: "āpta",
    english: "Trustworthy Authority",
    forBeginners: "This is the technical term for 'someone actually worth trusting' — a person who genuinely knows what they're talking about, has no ulterior motive to lie to you, and is communicating clearly and honestly. The whole reason 'someone told me so' can count as real knowledge is that the SPEAKER meets this high bar, not because words themselves are magically true.",
    category: "Hermeneutics",
    definition: "A person who has direct, accurate knowledge of a subject, is devoid of prejudices or motives to deceive, and communicates clearly out of compassion or a sense of duty.",
    significance: "The validity of Shabda (Testimony) rests entirely on the Apta. Trust is placed not in the magical nature of words, but in the epistemic and moral integrity of the speaker.",
    relatedConcepts: ["shabda", "veda"]
  },
  {
    id: "samaya",
    sanskrit: "समय",
    iast: "samaya",
    english: "Linguistic Convention",
    forBeginners: "This is just the plain fact that word meanings are agreed-upon by a community, not built into the sounds themselves — there's no natural reason 'dog' means a dog rather than a cat, it's simply what everyone in a language has agreed to call it. This shows that language is a social custom, unlike, say, smoke reliably signaling fire, which is a fact about the world, not an agreement.",
    category: "Hermeneutics",
    definition: "The established, historical agreement within a community that a specific word denotes a specific object or meaning.",
    significance: "Refutes the idea that words have an inherent, physical connection to objects. Language is shown to be a social, arbitrary construct, separating it from natural logical signs used in Inference.",
    relatedConcepts: ["shabda", "vakya"]
  },
  {
    id: "veda",
    sanskrit: "वेद",
    iast: "veda",
    english: "Scripture / Sacred Texts",
    forBeginners: "This refers to the most authoritative scriptures in the tradition, treated as trustworthy testimony passed down from highly reliable ancient sages (or God). Nyāya's argument for taking them seriously isn't 'because they're sacred' — it argues these texts earn trust using the very same standards you'd use to trust a modern medical textbook: track record and reliability of the source.",
    category: "Hermeneutics",
    definition: "The ultimate corpus of spiritual and ritual knowledge in Indian philosophy, considered valid because they are the testimony of supreme Aptas (ancient seers or God).",
    significance: "Nyaya defends the authority of the Vedas using the same logical framework applied to medical science (Ayurveda), insisting that scriptural authority is based on empirical reliability.",
    relatedConcepts: ["shabda", "vidhi", "arthavada", "anuvada"]
  },

  {
    id: "vidhi",
    sanskrit: "विधि",
    iast: "vidhi",
    english: "Injunction / Command",
    forBeginners: "This is a direct instruction telling you to do something to get a specific result — like a recipe step, or a rule saying 'do this ritual to achieve that outcome.' In analyzing any instructional text, Nyāya treats these command-sentences as the actual 'load-bearing' core that everything else in the text supports or explains.",
    category: "Hermeneutics",
    definition: "A direct prescriptive statement or command in a text urging the listener to perform a specific action to achieve a specific result.",
    significance: "Considered the operational core of the Veda or any instructional manual, around which all other sentences revolve.",
    relatedConcepts: ["veda", "arthavada", "anuvada"]
  },
  {
    id: "arthavada",
    sanskrit: "अर्थवाद",
    iast: "arthavāda",
    english: "Explanatory Assertion",
    forBeginners: "These are the surrounding sentences in a text that praise, explain, or tell a supporting story around a main instruction — think of the little motivational blurb next to a rule, explaining why it matters or what happened to people who followed (or ignored) it. Their job is to persuade and motivate, not to state literal, separately-checkable facts.",
    category: "Hermeneutics",
    definition: "Sentences that provide praise, blame, historical context, or mythological backing to support and motivate the performance of a primary Injunction (Vidhi).",
    significance: "Helps resolve apparent absurdities in scripture by categorizing them not as empirical facts, but as rhetorical tools designed for psychological motivation.",
    relatedConcepts: ["vidhi", "veda"]
  },
  {
    id: "anuvada",
    sanskrit: "अनुवाद",
    iast: "anuvāda",
    english: "Re-inculcation / Purposeful Repetition",
    forBeginners: "This is simply repeating something already said, on purpose — like a teacher repeating a key point for emphasis, or a textbook restating a rule in a summary section. Nyāya points this out to defend scripture against the charge of being pointlessly repetitive: repetition, done well, is a genuine teaching tool.",
    category: "Hermeneutics",
    definition: "The repetition of a previously stated command or concept for the sake of emphasis, clarification, or instructional continuity.",
    significance: "Defends scriptural texts against charges of tautology (pointless repetition), proving that repetition in pedagogy serves a vital, functional role.",
    relatedConcepts: ["vidhi", "arthavada"]
  },

  {
    id: "purvapaksha",
    sanskrit: "पूर्वपक्ष",
    iast: "pūrvapakṣa",
    english: "Prima Facie View / Opponent's Objection",
    forBeginners: "This is simply 'the other side's argument' — the objection, or the position you disagree with, stated as strongly and fairly as possible before you respond to it. Indian philosophy has a strong habit of doing this seriously: you don't get to just dismiss an opposing view, you have to state it at its best first.",
    category: "Dialectics",
    definition: "The initial argument, counter-claim, or skeptical objection presented against an established doctrine.",
    significance: "The engine of Indian philosophical discourse. Truth is not handed down rigidly; it is dynamically forged by anticipating, presenting, and dismantling the strongest possible counter-arguments.",
    relatedConcepts: ["siddhanta"]
  },
  {
    id: "siddhanta",
    sanskrit: "सिद्धान्त",
    iast: "siddhānta",
    english: "Established Tenet / Conclusion",
    forBeginners: "This is the conclusion left standing after a debate — the position that survived every objection and counter-argument thrown at it (the Pūrvapakṣa) and came out intact. It's not just 'what someone believes'; it's specifically a claim that has already been tested against its strongest rivals.",
    category: "Dialectics",
    definition: "The final, proven doctrinal truth established after thoroughly refuting the opponent's view (Purvapaksha) using valid means of knowledge.",
    significance: "Represents the intellectual destination of the debate—a stable, defensible philosophical truth.",
    relatedConcepts: ["purvapaksha", "pramana"]
  },

  {
    id: "atman",
    sanskrit: "आत्मन्",
    iast: "ātman",
    english: "Soul / Self",
    forBeginners: "This is the Nyāya word for 'soul' or 'true self' — an unchanging, non-physical something that is the 'owner' of all your experiences: your thoughts, desires, likes, and dislikes. One interesting Nyāya twist: they don't think the soul is automatically conscious all by itself — consciousness only shows up once the soul links up with the mind and senses, like a lightbulb that only lights up once it's actually wired into a circuit.",
    category: "Metaphysics",
    definition: "The eternal, immaterial substance that is the substratum of consciousness, desire, aversion, effort, pleasure, and pain.",
    significance: "In Nyaya, the soul is not inherently conscious but acquires consciousness as an attribute when it comes into contact with the mind and senses.",
    relatedConcepts: ["manas", "jnana"]
  },
  {
    id: "manas",
    sanskrit: "मनस्",
    iast: "manas",
    english: "Mind / Internal Organ",
    forBeginners: "This is the 'inner sense organ' — not your soul, and not your brain exactly, but a go-between that connects your eternal soul to your physical senses. Nyāya says it's so tiny and focused that it can only handle one single thought or perception at a time — which is exactly why you can't fully pay attention to a sight, a sound, and a smell all at the very same instant.",
    category: "Cognition",
    definition: "The atomic, internal sense organ that mediates between the eternal soul and the external senses. It can only process one cognition at a time.",
    significance: "Explains why we do not experience all sensory inputs simultaneously. The mind acts as a highly focused, serial processor of reality.",
    relatedConcepts: ["atman", "sannikarsha", "pratyaksha"]
  },
  {
    id: "sannikarsha",
    sanskrit: "सन्निकर्ष",
    iast: "sannikarṣa",
    english: "Sense-Object Contact",
    forBeginners: "This is simply the actual physical/sensory 'contact' between, say, your eye and the color you're looking at, which is what triggers you to actually perceive it. It's Nyāya's way of insisting that real perception has to be grounded in an actual connection to the world — not just imagination or guesswork.",
    category: "Cognition",
    definition: "The physical and cognitive connection between a sense organ (like the eye) and its corresponding object (like color) that triggers direct perception.",
    significance: "The indispensable physical trigger for all empirical knowledge, proving that human knowledge is grounded in objective reality.",
    relatedConcepts: ["pratyaksha"]
  },
  {
    id: "avayavin",
    sanskrit: "अवयविन्",
    iast: "avayavin",
    english: "The Whole",
    forBeginners: "Think of a clay pot: is it 'real,' or is it secretly just a bunch of clay specks arranged to look like a pot? Nyāya insists the pot itself is a genuinely real, distinct thing — 'the Whole' — not just an illusion created by its tiny parts. Proof offered: if you nudge one edge of the pot, the WHOLE pot moves together, which loose grains of clay dust would never do.",
    category: "Metaphysics",
    definition: "A distinct, unified substance that comes into existence when its parts (avayava) combine. A pot is not just a pile of clay atoms; it is a new entity: 'The Whole'.",
    significance: "Defends common-sense realism against Buddhist and Atomist reductionism. It proves that macroscopic objects are real, cohesive entities with their own properties, not just illusions created by microscopic parts.",
    relatedConcepts: ["pratyaksha"]
  },
  {
    id: "kala",
    sanskrit: "काल",
    iast: "kāla",
    english: "Time",
    forBeginners: "This is Nyāya's answer to 'why do we experience past, present, and future at all?' — they treat Time itself as a real, permanent, everywhere-present thing, sort of like an invisible container that all events and actions happen inside of, rather than dismissing time as just a mental trick or illusion.",
    category: "Metaphysics",
    definition: "The eternal, all-pervading substance that causes our cognitions of past, present, and future, and acts as the universal container for all actions.",
    significance: "Gautama staunchly defends the reality of the 'Present' moment as the continuous duration of action, countering skeptical claims that time is merely an illusion of past and future.",
    relatedConcepts: ["pratyaksha"]
  },
  {
    id: "samsaya",
    sanskrit: "संशयः",
    iast: "saṃśayaḥ",
    english: "Doubt",
    forBeginners: "This is simple, everyday doubt — like glimpsing a shape in the dusk and not being sure if it's a person or a fence post. Nyāya treats this feeling of 'hmm, which is it?' as hugely important: it's literally the starting spark for all philosophical investigation — if you're never unsure about anything, you never bother to investigate.",
    category: "Dialectics",
    definition: "A conflicting judgment regarding the exact character of an object, arising from the perception of properties common to many objects.",
    significance: "Doubt is the starting point of all philosophical inquiry and debate in Nyaya. Without doubt, there is no need for investigation or the application of Pramanas."
  },
  {
    id: "shodasha-padartha",
    sanskrit: "षोडश पदार्थाः",
    iast: "ṣoḍaśa padārthāḥ",
    english: "The Sixteen Categories",
    forBeginners: "This is the master table of contents for the entire Nyāya system: sixteen specific topics — from 'how do we know things' all the way down to 'how do you tell when someone's lost a debate.' Nyāya's opening claim is bold: really understanding these sixteen topics, in full, is what leads a person all the way to spiritual liberation.",
    category: "Epistemology",
    definition: "The sixteen topics of inquiry outlined by Gautama: means of knowledge, objects of knowledge, doubt, purpose, familiar instance, established tenet, members of a syllogism, confutation, ascertainment, discussion, wrangling, cavil, fallacies, quibbling, futile rejoinders, and clinchers.",
    significance: "Nyaya states that true knowledge of these sixteen categories leads to the attainment of the highest good (liberation)."
  },
  {
    id: "pariksha",
    sanskrit: "परीक्षा",
    iast: "parīkṣā",
    english: "Examination",
    forBeginners: "This is simply the process of putting a claim or a definition under a microscope — testing it rigorously with logic and counter-examples to see if it actually holds up, rather than just accepting it because it sounds reasonable at first glance.",
    category: "Dialectics",
    definition: "The critical investigation and testing of a subject that has been defined.",
    significance: "Once a concept is defined (lakshana), it must undergo rigorous logical examination to ascertain its validity."
  },
  {
    id: "duhkha-chain-nyaya",
    sanskrit: "दुःखजन्मप्रवृत्तिदोषमिथ्याज्ञानानाम्",
    iast: "duḥkhajanmapravṛttidoṣamithyājñānānām",
    english: "The Chain of Suffering",
    forBeginners: "This describes a domino-effect chain of causes: mistaken beliefs cause psychological flaws, which cause you to act, which causes rebirth, which causes suffering — one domino knocking down the next. The good news built into this chain: if you can knock out that very FIRST domino (the mistaken belief), the entire rest of the chain never gets triggered.",
    category: "Metaphysics",
    definition: "The causal chain leading from false knowledge to suffering, and its reversal leading to liberation.",
    significance: "Gautama posits that false knowledge causes defects, which cause activity, which cause birth, which causes suffering. Destroying false knowledge unravels the whole chain."
  },
  {
    id: "jnana",
    sanskrit: "ज्ञानम्",
    iast: "jñānam",
    english: "Knowledge / Cognition",
    forBeginners: "This is simply the Nyāya word for 'a piece of knowledge' or 'an act of knowing something.' Importantly, Nyāya doesn't think knowledge is some permanent built-in feature of your soul — it says knowledge is more like a temporary event that happens when your soul, mind, senses, and an object all connect at once, the way a spark only happens when the right parts touch.",
    category: "Cognition",
    definition: "The apprehension or apprehension-producing activity that illuminates objects.",
    significance: "In Nyaya, cognition is not the essence of the soul, but an adventitious quality that arises when the soul, mind, sense-organ, and object come into contact."
  },
  {
    id: "vipratipatti",
    sanskrit: "विप्रतिपत्तिः",
    iast: "vipratipattiḥ",
    english: "Contradiction / Conflicting Opinion",
    forBeginners: "This is simply hearing two experts flatly contradict each other about the same thing — one says 'it's alive,' another says 'it's not' — leaving you stuck in the middle, unsure who to believe. Nyāya lists this conflicting-testimony situation as one of the specific triggers that produces genuine doubt.",
    category: "Dialectics",
    definition: "Mutually exclusive statements about the same object, leading to doubt.",
    significance: "It is one of the causes of doubt, forcing the need for critical examination."
  },
  {
    id: "avyavastha",
    sanskrit: "अव्यवस्था",
    iast: "avyavasthā",
    english: "Irregularity / Lack of Uniformity",
    forBeginners: "This is when there's no consistent pattern to rely on — sometimes you perceive a certain kind of thing, sometimes you don't, with no clear rule explaining why. That inconsistency itself is enough to make you unsure and doubtful about what's really going on.",
    category: "Dialectics",
    definition: "Irregularity in apprehension or non-apprehension, leading to doubt.",
    significance: "Another cause of doubt in the Nyaya system. When there is no uniform rule about whether something should be perceived or not, doubt arises."
  },
  {
    id: "vada",
    sanskrit: "वादः",
    iast: "vādaḥ",
    english: "Discussion",
    forBeginners: "This is honest, good-faith discussion — both people genuinely trying to figure out what's actually true, using solid evidence and reasoning, rather than trying to simply 'win.' Nyāya holds this up as the gold-standard, most respectable form of debate.",
    category: "Dialectics",
    definition: "A debate where both parties sincerely aim to discover the truth, establishing their own position using pramāṇas and logic.",
    significance: "Unlike wrangling (jalpa) or cavil (vitaṇḍa) which aim only at defeating an opponent, vāda aims at ascertaining the truth."
  },
  {
    id: "prameya",
    sanskrit: "प्रमेयम्",
    iast: "prameyam",
    english: "Object of Valid Knowledge",
    forBeginners: "This is simply 'anything that can be known' — any object of knowledge at all. Technically that could be almost anything in the universe, but Nyāya narrows its serious focus down to a specific short list of things (like the soul, the body, and pleasure/pain) whose understanding actually helps you toward liberation.",
    category: "Epistemology",
    definition: "That which is to be known through pramāṇas. The objects of knowledge.",
    significance: "While everything is technically knowable, Nyaya restricts prameya to the specific objects (soul, body, senses, etc.) whose knowledge leads to liberation."
  },
  {
    id: "dvadasha-prameya",
    sanskrit: "द्वादश प्रमेयाणि",
    iast: "dvādaśa prameyāṇi",
    english: "The Twelve Objects of Knowledge",
    forBeginners: "This is Nyāya's specific 'need-to-know' checklist: twelve particular things — including the soul, the body, the senses, the mind, actions, and liberation itself — that this tradition considers the essential curriculum for anyone seriously pursuing spiritual freedom, cutting out everything else as beside the point.",
    category: "Metaphysics",
    definition: "The twelve specific objects of knowledge: Soul, Body, Senses, Objects of Senses, Intellect, Mind, Activity, Fault, Transmigration, Fruit, Pain, and Liberation.",
    significance: "These twelve constitute the essential reality that must be rightly understood to break the chain of suffering and achieve liberation."
  },
  {
    id: "buddhi",
    sanskrit: "बुद्धिः",
    iast: "buddhiḥ",
    english: "Intellect / Apprehension",
    forBeginners: "In Nyāya's specific vocabulary, this word is basically a synonym for 'knowledge' or 'cognition' itself — not a separate cosmic faculty like it is in some other Indian philosophies, but simply another name for the same temporary event of knowing something.",
    category: "Cognition",
    definition: "Synonymous with knowledge and apprehension in the Nyaya system.",
    significance: "Nyaya distinguishes buddhi (knowledge) from the eternal soul, viewing it as a transitory property."
  },
  {
    id: "tarka",
    sanskrit: "तर्कः",
    iast: "tarkaḥ",
    english: "Confutation / Hypothetical Reasoning",
    forBeginners: "Think of this as a kind of 'stress test' for an idea: rather than proving something is true directly, you show that its opposite leads to an absurd or impossible conclusion, which indirectly supports the original claim. It's not itself one of the four official 'ways of knowing,' but it's a very useful tool for clearing away confusion so real knowledge can get through.",
    category: "Dialectics",
    definition: "A process of reasoning that assists in knowing the true nature of a thing by revealing the absurdities of contrary suppositions.",
    significance: "While not a pramāṇa itself, tarka acts as an essential auxiliary to pramāṇas by clearing away doubts."
  },
  {
    id: "sharira-indriya-bhuta",
    sanskrit: "शरीरेन्द्रियभूतानि",
    iast: "śarīrendriyabhūtāni",
    english: "Body, Senses, and Elements",
    forBeginners: "This is a simple three-part map of how you interact with the physical world: your body is where experience happens, your senses (eyes, ears, etc.) are the tools you experience with, and the physical elements (like light or sound waves) are what those tools actually pick up on.",
    category: "Metaphysics",
    definition: "The physical architecture of interaction: the body is the site of experience, the senses are the instruments, and the material elements are their objects.",
    significance: "Nyaya provides a rigorous physicalist mapping of how consciousness interacts with the material world."
  },
  {
    id: "drishtanta",
    sanskrit: "दृष्टान्तः",
    iast: "dṛṣṭāntaḥ",
    english: "Familiar Instance / Example",
    forBeginners: "This is a real-world example so obvious and uncontroversial that literally everyone — expert and non-expert alike — agrees on it, like 'a kitchen has both fire and smoke.' A good logical argument needs one of these to anchor its claim in something concrete and familiar, rather than floating in pure abstraction.",
    category: "Dialectics",
    definition: "An undisputed example that both ordinary people and experts agree upon.",
    significance: "Crucial for inference. A logical argument (syllogism) must point to a real-world example (like a kitchen with fire and smoke) to ground its logic in reality."
  },
  {
    id: "anavastha",
    sanskrit: "अनवस्था",
    iast: "anavasthā",
    english: "Infinite Regress",
    forBeginners: "This is the classic 'turtles all the way down' problem: if every single claim needs ANOTHER claim to justify it, and that one needs yet another, and so on forever, you never actually reach solid ground. Nyāya frequently points out this exact flaw in rival theories to argue that, eventually, knowledge has to rest on something self-evident, like direct perception, rather than needing infinite backup.",
    category: "Dialectics",
    definition: "A logical fallacy where a proposition requires an infinite series of justifications, without ever reaching a foundational grounding.",
    significance: "Nyaya frequently uses the threat of infinite regress to disprove opposing theories, arguing that valid knowledge must eventually rest on self-evident perception."
  },
  {
    id: "pravritti-dosha-phala",
    sanskrit: "प्रवृत्तिदोषफलम्",
    iast: "pravṛttidoṣaphalam",
    english: "Activity, Fault, and Fruit",
    forBeginners: "This is the three-step engine of karma: your inner psychological flaws (like craving or aversion) push you into action (with your words, mind, or body), and that action inevitably produces a consequence, good or bad, that you experience later. Break the first link — the underlying flaw — and the whole chain grinds to a halt.",
    category: "Metaphysics",
    definition: "The core components of the karmic cycle: Faults (attachment, aversion) drive Activity (speech, mind, body), which inevitably produce a Fruit (experience of pleasure or pain).",
    significance: "This explains the mechanism of rebirth. By eliminating faults through right knowledge, activity ceases to bind the soul, preventing future fruits (rebirth)."
  },
  {
    id: "hetvabhasa",
    sanskrit: "हेत्वाभासाः",
    iast: "hetvābhāsāḥ",
    english: "Fallacy of the Reason",
    forBeginners: "This is a 'reason' in an argument that looks solid at first glance but actually falls apart under scrutiny — a fake or broken clue. Nyāya carefully catalogs different specific ways a 'reason' can secretly fail, precisely so people can be trained to spot bad arguments rather than get fooled by them.",
    category: "Dialectics",
    definition: "A 'pseudo-probans'. A reason (hetu) that appears to be valid but is actually defective and fails to establish the conclusion.",
    significance: "Nyaya rigorously classifies logical fallacies to ensure that inference remains a reliable means of knowledge."
  },
  {
    id: "apavarga",
    sanskrit: "अपवर्गः",
    iast: "apavargaḥ",
    english: "Liberation / Final Release",
    forBeginners: "This is Nyāya's specific term for full, final liberation: the complete, permanent end of all suffering. Notably, it's described here in a fairly stark, minimal way — not as blissful ecstasy, but simply as total freedom from pain (and, in fact, from experience altogether), once the soul is fully disentangled from body, mind, and senses.",
    category: "Metaphysics",
    definition: "Absolute deliverance from pain. The state of the soul freed from the cycle of birth, activity, and fault.",
    significance: "In Nyaya, liberation is not a state of blissful joy, but an absolutely negative state of total cessation of suffering and consciousness."
  },
  {
    id: "vyabhicara",
    sanskrit: "व्यभिचारः",
    iast: "vyabhicāraḥ",
    english: "Inconstancy / Deviation",
    forBeginners: "This is a specific way an inference can go wrong: your supposed 'clue' actually shows up both in cases where the thing you're inferring is true AND in cases where it's false — like if smoke also showed up over lakes with no fire at all. If your clue isn't reliably tied to only one outcome, it can't be used to prove anything.",
    category: "Dialectics",
    definition: "A logical fallacy where the reason (hetu) exists both where the probandum (sadhya) exists and where it does not.",
    significance: "If smoke existed in both kitchens (where there is fire) and lakes (where there is no fire), smoke would be an inconstant reason for inferring fire."
  },
  {
    id: "prayojana",
    sanskrit: "प्रयोजनम्",
    iast: "prayojanam",
    english: "Purpose / Motive",
    forBeginners: "This is simply your motive — the reason WHY you're doing something or investigating something in the first place, whether that's chasing a benefit or avoiding a harm. Nyāya notes that without some kind of purpose behind it, nobody would ever bother debating or investigating anything at all.",
    category: "Dialectics",
    definition: "The objective or motive that induces someone to act or engage in a discussion.",
    significance: "Without a purpose (either to attain good or avoid evil), no philosophical inquiry or action occurs."
  },
  {
    id: "vakya",
    sanskrit: "वाक्यम्",
    iast: "vākyam",
    english: "Sentence / Statement",
    forBeginners: "This is just a meaningful sentence — a coherent string of words that actually says something — specifically here referring to the statements made by a trustworthy speaker, which is what makes testimony (hearing something from someone reliable) work as a real source of knowledge.",
    category: "Hermeneutics",
    definition: "A meaningful arrangement of words. In Nyaya, it refers specifically to the statements of an authoritative person (apta).",
    significance: "Crucial for understanding how verbal testimony (shabda) conveys valid knowledge."
  },
  {
    id: "avayava",
    sanskrit: "अवयवाः",
    iast: "avayavāḥ",
    english: "Members of a Syllogism / Parts",
    forBeginners: "This is the required 5-step format for laying out a formal argument so it actually convinces someone else, rather than just satisfying yourself internally: state your claim, give your reason, give a supporting example, apply it to the case at hand, then restate your conclusion as now proven.",
    category: "Dialectics",
    definition: "The five members of a formal inference used to convince others: Proposition, Reason, Example, Application, and Conclusion.",
    significance: "While one can infer something internally in three steps, convincing another person in debate strictly requires these five members to avoid rhetorical flaws."
  },
  {
    id: "chhala",
    sanskrit: "छलम्",
    iast: "chalam",
    english: "Quibble / Casuistry",
    forBeginners: "This is a sneaky, unfair debate trick: deliberately twisting an ambiguous word or phrase in someone's statement to mean something they clearly didn't intend, just so you can 'win' by arguing against that distorted meaning instead of their real point. Nyāya names this tactic specifically so people can learn to recognize and call it out.",
    category: "Dialectics",
    definition: "The opposition to a statement by assigning to it an unintended meaning.",
    significance: "A common tactic in wrangling (jalpa). Nyaya identifies it to protect truth-seekers from falling prey to verbal tricks."
  },
  {
    id: "jati",
    sanskrit: "जातिः",
    iast: "jātiḥ",
    english: "Futile Rejoinder",
    forBeginners: "This is a weak, unconvincing objection that only points out some surface-level similarity or difference between two things, without actually engaging with the real logical substance of the argument — the debate equivalent of saying 'well THAT'S basically the same as this OTHER unrelated thing' and stopping there.",
    category: "Dialectics",
    definition: "An objection based on mere similarity or dissimilarity, without addressing the underlying logical connection.",
    significance: "A sophistical rebuttal that fails to actually counter the opponent's argument."
  },
  {
    id: "nigrahasthana",
    sanskrit: "निग्रहस्थानम्",
    iast: "nigrahasthānam",
    english: "Ground of Defeat",
    forBeginners: "This is simply the specific moment a debate is officially considered 'lost' — for instance, when someone contradicts their own earlier statement, dodges a direct question, or clearly fails to understand the point being made to them. It's the formal 'game over' condition of philosophical debate.",
    category: "Dialectics",
    definition: "The point in a debate where a participant is defeated due to a contradiction, evasion, or inability to grasp the opponent's point.",
    significance: "The formal conclusion of a philosophical dispute, marking the failure of one party's reasoning."
  },
  {
    id: "pradipa-prakasha",
    sanskrit: "प्रदीपप्रकाशः",
    iast: "pradīpaprakāśaḥ",
    english: "Illumination of a Lamp",
    forBeginners: "Think about how a lit lamp doesn't need a second lamp shining on it to prove it's actually lit — it reveals other things AND reveals itself, both at the same time, all on its own. This comparison is used to solve a tricky puzzle: if every fact needs 'proof' from somewhere else, wouldn't you need infinite proofs forever? The answer given here is that some things — like a lamp's own light, or a valid act of knowing — can validate themselves directly, no external backup needed.",
    category: "Epistemology",
    definition: "An analogy explaining how a means of knowledge (pramāṇa) validates itself while validating an object, just as a lamp illuminates itself while illuminating a room.",
    significance: "Used to solve the paradox of infinite regress in epistemology, showing that not everything requires an external validator."
  }
,
  {
    id: "atma-pariksha",
    sanskrit: "आत्मपरीक्षा",
    iast: "ātma-parīkṣā",
    english: "Examination of the Soul",
    forBeginners: "This is simply the deep-dive investigation into whether there really IS a 'soul' or 'true self,' separate from your body, senses, and passing thoughts — and if so, what it's actually like. It's Nyāya's rebuttal to more skeptical views (like certain Buddhist positions) that deny there's any such continuous 'self' at all.",
    category: "Metaphysics",
    definition: "The critical investigation into the existence, nature, and eternal status of the self (ātman) as distinct from the body, senses, and mind.",
    significance: "Establishes that the self is the permanent substratum of consciousness, memory, and agency, refuting materialist and Buddhist views of no-self.",
    relatedConcepts: ["atman", "buddhi", "manas"]
  },
  {
    id: "atma-nityatva",
    sanskrit: "आत्मनित्यत्व",
    iast: "ātma-nityatva",
    english: "Eternality of the Soul",
    forBeginners: "This is the specific claim that the soul never gets created and never gets destroyed — it just moves from body to body over countless lifetimes, sort of like changing clothes while remaining the same person underneath. This matters a lot for justifying karma: if the soul just vanished at death, there'd be no one left around to actually experience the consequences of anything they did.",
    category: "Metaphysics",
    definition: "The doctrine that the soul (ātman) is uncreated and indestructible, existing continuously across different bodies through transmigration.",
    significance: "A crucial tenet for justifying the laws of karma and moral responsibility; if the soul were destroyed at death, actions would bear no fruit.",
    relatedConcepts: ["atman", "pretyabhava", "karma"]
  },
  {
    id: "buddhi-pariksha",
    sanskrit: "बुद्धिपरीक्षा",
    iast: "buddhi-parīkṣā",
    english: "Examination of Intellect",
    forBeginners: "This is a deep-dive investigation specifically into 'what IS thinking/cognition, really?' Nyāya's answer, after scrutiny: it's just a temporary event that happens TO the soul, not some separate, permanent cosmic thing floating out there on its own (which is what a rival school, Sāṃkhya, claimed).",
    category: "Cognition",
    definition: "The critical investigation of cognition or intellect (buddhi), establishing it as a temporary quality of the soul rather than an eternal substance.",
    significance: "Refutes the Sāmkhya view that intellect is an eternal, independent cosmic principle, reinforcing Nyāya's substance-attribute ontology.",
    relatedConcepts: ["buddhi", "jnana", "atman"]
  },
  {
    id: "kshanabhangavada",
    sanskrit: "क्षणभङ्गवाद",
    iast: "kṣaṇabhaṅgavāda",
    english: "Theory of Momentariness",
    forBeginners: "This is a rival (Buddhist) theory claiming that literally everything — including you — is completely brand-new every single instant, with the previous version totally gone, replaced moment by moment, like a flip-book where each page is a totally separate drawing. Nyāya pushes back hard on this, arguing you need SOME lasting continuity — otherwise, how could you remember yesterday, or be held responsible for something you did a moment ago?",
    category: "Dialectics",
    definition: "The Buddhist doctrine that all entities exist only for a single instant before ceasing to be, completely replaced by a new entity in the next instant.",
    significance: "Nyāya fiercely refutes this theory to defend the enduring nature of substances (like the soul and material objects) necessary for memory and karma.",
    relatedConcepts: ["vada", "atman", "purvapaksha"]
  },
  {
    id: "adrshta",
    sanskrit: "अदृष्ट",
    iast: "adṛṣṭa",
    english: "The Unseen Force",
    forBeginners: "This is the literal 'invisible force' left behind by your past actions — you can't see it or measure it directly, but Nyāya says it's real, and it's what eventually delivers the appropriate consequences (good or bad) back to you later, sometimes much later, even in a future life.",
    category: "Metaphysics",
    definition: "The invisible moral force or latent potential generated by past actions (karma) that determines future experiences and the initial formation of the universe.",
    significance: "Provides the mechanical link between moral actions and their eventual, often delayed, physical or psychological consequences.",
    relatedConcepts: ["karma", "phala", "apūrva", "pretyabhava"]
  },
  {
    id: "pravrtti",
    sanskrit: "प्रवृत्ति",
    iast: "pravṛtti",
    english: "Activity / Volition",
    forBeginners: "This is simply 'taking action' — anything you do with your body, speech, or mind — specifically when it's driven by an underlying want or aversion. This is treated as the actual trigger point where karma gets generated; stop acting out of craving and aversion, and you stop generating new karma.",
    category: "Metaphysics",
    definition: "The operation of speech, mind, and body, driven by desire or aversion, which initiates the cycle of karma and rebirth.",
    significance: "Activity is the direct cause of merit and demerit. Stopping ego-driven activity is a prerequisite for liberation.",
    relatedConcepts: ["dosha", "karma", "pravritti-dosha-phala"]
  },
  {
    id: "dosha",
    sanskrit: "दोष",
    iast: "doṣa",
    english: "Psychological Defects",
    forBeginners: "These are the three basic psychological 'glitches' — craving, aversion, and confusion — that Nyāya identifies as the root cause of why people act (and therefore why they suffer and get reborn). Get rid of these three, the theory goes, and the entire engine driving rebirth simply runs out of fuel.",
    category: "Cognition",
    definition: "The underlying psychological flaws—attachment (rāga), aversion (dveṣa), and delusion (moha)—that compel a person to act.",
    significance: "They are the root cause of worldly activity and suffering. Liberation (apavarga) is attained only upon their complete eradication.",
    relatedConcepts: ["raga", "dvesha", "moha", "pravrtti"]
  },
  {
    id: "raga",
    sanskrit: "राग",
    iast: "rāga",
    english: "Attachment / Desire",
    forBeginners: "This is simply craving or attachment — really wanting something because you think it'll bring you pleasure. It sounds harmless, even nice, but Nyāya treats it as one of the core things that keeps pulling you back into more action, and therefore more karma and more rebirth.",
    category: "Cognition",
    definition: "The strong attraction or desire for objects that yield pleasure, leading to continued bondage and repeated activity.",
    significance: "One of the three primary doshas; it binds the soul to the cycle of samsara by generating future-oriented desires.",
    relatedConcepts: ["dosha", "pravrtti"]
  },
  {
    id: "dvesha",
    sanskrit: "द्वेष",
    iast: "dveṣa",
    english: "Aversion / Hatred",
    forBeginners: "This is the flip side of craving: aversion, or wanting to avoid/get away from something because it seems painful or unpleasant. It might feel like the opposite of desire, but Nyāya groups it right alongside craving as an equally binding force pushing you into reactive behavior.",
    category: "Cognition",
    definition: "The strong repulsion or hatred toward objects or situations that yield pain, driving aggressive or avoidance behaviors.",
    significance: "One of the three primary doshas; equally as binding as attachment, as it forces the soul into reactive karma.",
    relatedConcepts: ["dosha", "pravrtti"]
  },
  {
    id: "moha",
    sanskrit: "मोह",
    iast: "moha",
    english: "Delusion / Ignorance",
    forBeginners: "This is basic confusion or delusion about how things really are — most importantly, mistaking your body or mind for your true self. Nyāya treats this specific mix-up as the deepest root of the problem: craving and aversion are really just symptoms that grow out of this more fundamental confusion.",
    category: "Cognition",
    definition: "The fundamental ignorance or misconception of reality, primarily mistaking the non-self (body/mind) for the self.",
    significance: "The root of all other defects (rāga and dveṣa). Eradicating moha through true knowledge (tattvajñāna) is the ultimate goal of Nyāya.",
    relatedConcepts: ["dosha", "tatva-jnana", "apavarga"]
  },
  {
    id: "pretyabhava",
    sanskrit: "प्रेत्यभाव",
    iast: "pretyabhāva",
    english: "Transmigration / Rebirth",
    forBeginners: "This is simply what most people call reincarnation or rebirth: dying and then being born again in a new body, based on the leftover 'credit and debt' (merit and demerit) built up from your past actions. This entire cycle is treated as the core problem that the whole Nyāya path is ultimately trying to help you escape.",
    category: "Metaphysics",
    definition: "The cycle of dying and being born again in a new physical body, driven by the accumulated merit and demerit of past actions.",
    significance: "Explains the continuity of existence and the disparities in human birth; it is the fundamental problem that Nyāya seeks to escape.",
    relatedConcepts: ["atman", "karma", "phala"]
  },
  {
    id: "karma",
    sanskrit: "कर्म",
    iast: "karma",
    english: "Action / Moral Causation",
    forBeginners: "This is any action — physical, verbal, or even just a thought — understood as something that leaves behind an invisible consequence affecting your future. Think of it as an extremely reliable, cosmic-scale bookkeeping system, ensuring that every experience of pleasure or pain you go through was, in some sense, actually earned.",
    category: "Metaphysics",
    definition: "Any physical, verbal, or mental action that generates an unseen moral consequence (adṛṣṭa) affecting the agent's future.",
    significance: "The mechanism of cosmic justice in Nyāya, ensuring that all experiences of pleasure and pain are earned.",
    relatedConcepts: ["pravrtti", "adrshta", "phala"]
  },
  {
    id: "shunyavada",
    sanskrit: "शून्यवाद",
    iast: "śūnyavāda",
    english: "Doctrine of Emptiness",
    forBeginners: "This is a rival Buddhist position claiming that literally nothing has any solid, independent nature of its own — everything is 'empty' in a deep philosophical sense, like a hologram with no real substance behind it. Nyāya firmly disagrees, insisting that real objects, real categories, and a real self genuinely do exist, backed up by ordinary perception and logic.",
    category: "Dialectics",
    definition: "The Buddhist Madhyamaka theory that all things are fundamentally empty (śūnya) of intrinsic nature or independent existence.",
    significance: "Nyāya opposes this by arguing for the absolute reality of objects, categories, and the self, grounded in direct perception and logic.",
    relatedConcepts: ["purvapaksha", "kshanabhangavada", "prameya"]
  },
  {
    id: "ishvara",
    sanskrit: "ईश्वर",
    iast: "īśvara",
    english: "God / Supreme Lord",
    forBeginners: "This is Nyāya's word for God — a supreme, eternal soul responsible for creating, maintaining, destroying the universe, and fairly handing out the results of everyone's karma. Interestingly, the earliest Nyāya texts focused mostly on logic and barely mentioned God at all; the detailed philosophical arguments FOR God's existence came later, as the tradition developed.",
    category: "Metaphysics",
    definition: "The supreme, eternal soul who creates, sustains, and destroys the universe, and who dispenses the fruits of karma to individual souls.",
    significance: "While early Nyāya focused on logic, later Nyāya developed sophisticated cosmological arguments to prove the existence of an intelligent creator.",
    relatedConcepts: ["atman", "adrshta", "phala"]
  },
  {
    id: "yadrccha-vada",
    sanskrit: "यदृच्छावाद",
    iast: "yadṛcchā-vāda",
    english: "Doctrine of Chance",
    forBeginners: "This is the rival, no-design view that the universe and all living things just happened by pure random chance, with no guiding intelligence behind any of it — nobody planned it, it just sort of fell into place. Nyāya rejects this, arguing that something as intricately organized as the universe practically requires an intelligent creator to explain it.",
    category: "Dialectics",
    definition: "The materialist view that the universe and living beings emerge purely by random chance without any intelligent cause or moral design.",
    significance: "Nyāya refutes this to defend the necessity of karma and Īśvara, arguing that complex order requires an intelligent agent.",
    relatedConcepts: ["purvapaksha", "ishvara"]
  },
  {
    id: "sarva-anityatva",
    sanskrit: "सर्वानित्यत्व",
    iast: "sarva-anityatva",
    english: "Doctrine of Universal Impermanence",
    forBeginners: "This is the extreme claim that absolutely everything, without exception, is temporary and will eventually be destroyed. Nyāya pushes back, arguing you need at least SOME permanent things — like atoms, space, or the soul — to serve as the stable foundation everything temporary is built on top of; otherwise nothing would ever hold together at all.",
    category: "Dialectics",
    definition: "The assertion that absolutely everything in existence is temporary and subject to destruction.",
    significance: "Nyāya refutes this by pointing out that certain things, like atoms, space, and the soul, must be eternal to serve as the foundation for the temporary.",
    relatedConcepts: ["nitya", "anitya"]
  },
  {
    id: "nitya",
    sanskrit: "नित्य",
    iast: "nitya",
    english: "Eternal",
    forBeginners: "This is simply the word for 'eternal' — things that were never created and can never be destroyed, like atoms, empty space, or the soul, according to Nyāya's list. These act as the fixed, unchanging bedrock underneath the constantly shifting, temporary world we experience.",
    category: "Metaphysics",
    definition: "That which is uncreated, indestructible, and exists forever without modification (e.g., souls, atoms, ether).",
    significance: "Provides the stable ontological ground in Nyāya-Vaiśeṣika upon which the transient universe is built.",
    relatedConcepts: ["anitya", "atman", "paramanu"]
  },
  {
    id: "anitya",
    sanskrit: "अनित्य",
    iast: "anitya",
    english: "Impermanent",
    forBeginners: "This is simply the opposite of eternal: 'temporary' or 'impermanent' — anything made up of parts that got assembled at some point, and can be taken apart or destroyed later, like a clay pot, a table, or your physical body.",
    category: "Metaphysics",
    definition: "That which is produced and eventually destroyed; any composite object made of parts.",
    significance: "Distinguishing between the eternal and impermanent is vital for overcoming attachment to worldly objects.",
    relatedConcepts: ["nitya", "kshanabhangavada"]
  },
  {
    id: "sarva-nityatva",
    sanskrit: "सर्वनित्यत्व",
    iast: "sarva-nityatva",
    english: "Doctrine of Universal Eternality",
    forBeginners: "This is the opposite extreme claim: that literally everything is actually permanent, and all the 'change' we seem to observe is just an illusion or a different way the same eternal thing is showing up. Nyāya rejects this too — they think real change, real creation, and real destruction genuinely happen in the physical world, not just as an appearance.",
    category: "Dialectics",
    definition: "The view that everything that exists is permanent, and change is merely an illusion or a shift in manifestation (often associated with strict Advaita or Sāmkhya).",
    significance: "Nyāya rejects this, affirming the reality of change, creation, and destruction in the physical world.",
    relatedConcepts: ["nitya", "sarva-anityatva"]
  },
  {
    id: "sarva-prthaktva",
    sanskrit: "सर्वपृथक्त्व",
    iast: "sarva-pṛthaktva",
    english: "Doctrine of Universal Separateness",
    forBeginners: "This is the extreme position that every single thing that exists is totally separate and isolated from everything else, with no real shared categories or connections linking anything together — basically denying that 'similarities' between things mean anything real. Nyāya rejects this, defending the idea that shared categories (like 'all cows have cow-ness in common') are genuinely real, not just a trick of language.",
    category: "Dialectics",
    definition: "The extreme pluralist view that every entity is entirely isolated and distinct, denying any real unifying categories or universals.",
    significance: "Nyāya argues against this to defend the reality of universals (sāmānya) and inherence (samavāya), which link diverse objects.",
    relatedConcepts: ["prameya", "shodasha-padartha"]
  },
  {
    id: "sarva-abhava",
    sanskrit: "सर्वाभाव",
    iast: "sarva-abhāva",
    english: "Doctrine of Universal Non-existence",
    forBeginners: "This is the most extreme skeptical position imaginable: total nihilism, the claim that literally nothing exists at all, not even you. Nyāya has a clever, almost gotcha-style rebuttal: the very act of seriously CLAIMING that nothing exists requires that the person making the claim, and the claim itself, both exist — which instantly contradicts the claim.",
    category: "Dialectics",
    definition: "The extreme nihilist view that nothing truly exists at all.",
    significance: "Nyāya dismisses this as self-contradictory, as the very act of asserting non-existence requires the existence of the assertor and the assertion.",
    relatedConcepts: ["shunyavada", "pramana"]
  },
  {
    id: "phala",
    sanskrit: "फल",
    iast: "phala",
    english: "Fruit / Result",
    forBeginners: "This is simply the 'payoff' — the actual experience of pleasure or pain you get as a direct result of your past actions (karma) finally ripening. Realizing that literally every worldly 'reward' eventually comes bundled with some kind of downside is what pushes a person to look for something more lasting than these ordinary payoffs.",
    category: "Metaphysics",
    definition: "The experiential result (pleasure or pain) of one's past actions, representing the fruition of karma.",
    significance: "It is the ultimate driver of the cycle of rebirth. Understanding that all worldly 'fruits' are ultimately tied to suffering motivates the pursuit of liberation.",
    relatedConcepts: ["karma", "adrshta", "duhkha"]
  },
  {
    id: "apūrva",
    sanskrit: "अपूर्व",
    iast: "apūrva",
    english: "The Unprecedented Force",
    forBeginners: "This term (borrowed from a related tradition, Mīmāṃsā) names an invisible 'stored-up force' created by performing a ritual, which sits dormant and then delivers its results at a later time — kind of like a check that's been written but hasn't cleared yet. Nyāya often blends this concept together with Adṛṣṭa to explain how a brief action can have effects that show up much, much later.",
    category: "Hermeneutics",
    definition: "A concept primarily from Mīmāṃsā, representing the unseen intermediary force generated by a ritual that brings about a future result.",
    significance: "In Nyāya, it is often synthesized with adṛṣṭa to explain how fleeting actions can cause effects long after the action has ceased.",
    relatedConcepts: ["adrshta", "karma"]
  },
  {
    id: "duhkha",
    sanskrit: "दुःख",
    iast: "duḥkha",
    english: "Suffering / Pain",
    forBeginners: "This is simply suffering or pain, understood as the basic, unavoidable texture of ordinary life — tied up with being born, growing attached to things, and eventually losing them. This is the uncomfortable starting realization of the whole path: even things that look like 'pleasure' are ultimately tangled up with pain, which is exactly what motivates someone to seek real, lasting release.",
    category: "Metaphysics",
    definition: "The fundamental nature of worldly existence; the physical and psychological pain inevitably linked to birth and attachment.",
    significance: "The starting point of the Nyāya path. The realization that even worldly pleasure is tainted by pain drives the seeker toward ultimate release.",
    relatedConcepts: ["duhkha-chain-nyaya", "apavarga"]
  },
  {
    id: "moksha",
    sanskrit: "मोक्ष",
    iast: "mokṣa",
    english: "Liberation",
    forBeginners: "This is simply the more commonly known word for the same goal as Apavarga: total liberation from the endless cycle of rebirth and suffering. It's described as the single highest goal of a human life in this tradition — a state where the soul is finally free of every quality, including, notably, both pain AND pleasure.",
    category: "Metaphysics",
    definition: "The ultimate release from the cycle of rebirth and suffering, synonymous with Apavarga.",
    significance: "The highest goal of human life in Nyāya, achieved when the soul is completely freed from all qualities, including pain, pleasure, and cognition.",
    relatedConcepts: ["apavarga", "tatva-jnana"]
  },
  {
    id: "tatva-jnana",
    sanskrit: "तत्त्वज्ञान",
    iast: "tattva-jñāna",
    english: "Knowledge of Truth",
    forBeginners: "This means genuinely, accurately understanding the fundamental categories of reality — most importantly, clearly telling apart your true self (soul) from everything that ISN'T your true self (body, mind, possessions). This specific kind of clear-eyed understanding is treated as the ONE thing capable of dissolving the basic confusion that keeps the whole chain of suffering running.",
    category: "Epistemology",
    definition: "The accurate, direct realization of the true nature of the sixteen categories (padārthas) and the distinction between the soul and non-soul.",
    significance: "The sole mechanism that destroys delusion (moha), subsequently eliminating faults, activity, rebirth, and suffering.",
    relatedConcepts: ["apavarga", "duhkha-chain-nyaya", "moha"]
  },
  {
    id: "ahankara",
    sanskrit: "अहङ्कार",
    iast: "ahaṅkāra",
    english: "Ego / I-maker",
    forBeginners: "This is your basic sense of 'I' getting mistakenly glued onto things that aren't really 'you' — like identifying yourself as 'my body,' 'my job,' or 'my possessions' rather than recognizing your deeper, unchanging soul underneath all of that. It's treated as one of confusion's most common, everyday disguises.",
    category: "Cognition",
    definition: "The false identification of the true self (ātman) with the physical body, mind, or senses.",
    significance: "A primary manifestation of delusion (moha) that binds the soul to samsara.",
    relatedConcepts: ["moha", "atman"]
  },
  {
    id: "sankalpa",
    sanskrit: "सङ्कल्प",
    iast: "saṅkalpa",
    english: "Volition / Intention",
    forBeginners: "This is simply your inner intention or resolve — the mental decision that happens right before you actually do or say something, like deciding 'I'm going to say this' a split second before you say it. Because it's the actual psychological starting point of every action, cleaning up your intentions is treated as key to stopping the generation of new karma.",
    category: "Cognition",
    definition: "The mental resolve or intentionality that precedes physical or verbal action.",
    significance: "It is the psychological origin of karma; purifying intentions is necessary to stop the generation of adṛṣṭa.",
    relatedConcepts: ["pravrtti", "manas"]
  },
  {
    id: "paramanu",
    sanskrit: "परमाणु",
    iast: "paramāṇu",
    english: "Atom",
    forBeginners: "This is Nyāya's word for 'atom' — an eternal, indestructible, impossibly tiny building block that everything physical in the universe is ultimately made of. It's their way of explaining how material objects can be built up and later fall apart, without ever having to say that something popped into existence out of literally nothing.",
    category: "Metaphysics",
    definition: "The eternal, indivisible, infinitesimal building block of the physical universe in Nyāya-Vaiśeṣika ontology.",
    significance: "Explains the composition and eventual destruction of all material objects without violating the principle that something cannot come from nothing.",
    relatedConcepts: ["nitya", "anitya"]
  },
  {
    id: "samadhi",
    sanskrit: "समाधि",
    iast: "samādhi",
    english: "Meditative Absorption",
    forBeginners: "This is a state of deep, completely undistracted concentration, focused specifically on directly experiencing your own true, soul-nature — borrowed here from the Yoga tradition. Nyāya recommends it as the practical, hands-on method for actually internalizing all the abstract philosophical truths you've reasoned your way to, rather than just believing them intellectually.",
    category: "Cognition",
    definition: "The state of deep, undisturbed concentration on the true nature of the soul.",
    significance: "Adopted from Yoga, Nyāya prescribes it as the practical method to internalize philosophical truth and achieve direct realization (tattvajñāna).",
    relatedConcepts: ["yoga", "abhyasa"]
  },
  {
    id: "abhyasa",
    sanskrit: "अभ्यास",
    iast: "abhyāsa",
    english: "Practice / Repetition",
    forBeginners: "This is simply consistent, repeated practice — doing your philosophical reflection and meditation over and over, the way you'd practice scales on an instrument. It's considered necessary because old habits of misidentifying yourself with your body and mind don't just disappear the first time you understand the theory; you have to wear the new understanding in through repetition.",
    category: "Cognition",
    definition: "The continuous, disciplined repetition of philosophical reflection and meditation.",
    significance: "Necessary to overcome ingrained habits of false identification and stabilize true knowledge.",
    relatedConcepts: ["samadhi", "yoga"]
  },
  {
    id: "yoga",
    sanskrit: "योग",
    iast: "yoga",
    english: "Spiritual Discipline",
    forBeginners: "This is the general term for hands-on mental and physical training techniques — meditation, breathing, posture, and so on — used to actually focus and steady the mind. Nyāya explicitly says pure logical argument alone isn't enough; you also need this kind of practical discipline to genuinely reach liberation.",
    category: "Cognition",
    definition: "The practical methods of mental and physical control used to focus the mind.",
    significance: "Nyāya explicitly endorses Yogic practices as the necessary complement to logical analysis for achieving liberation.",
    relatedConcepts: ["samadhi", "yama", "niyama"]
  },
  {
    id: "yama",
    sanskrit: "यम",
    iast: "yama",
    english: "Moral Restraints",
    forBeginners: "These are the foundational ethical ground rules — things like not harming others and being truthful — treated as an essential first step for cleaning up your mind before deeper meditation can really work. Skipping straight to meditation without this ethical foundation is seen as building on sand.",
    category: "Cognition",
    definition: "The foundational ethical disciplines (like non-violence and truthfulness) required to purify the mind.",
    significance: "A prerequisite for effective meditation and the cessation of negative karma.",
    relatedConcepts: ["yoga", "niyama"]
  },
  {
    id: "niyama",
    sanskrit: "नियम",
    iast: "niyama",
    english: "Positive Observances",
    forBeginners: "These are the positive personal habits that go alongside the ethical restraints above — things like ongoing study and maintaining cleanliness/purity — which actively support your spiritual growth, rather than just preventing bad behavior the way the restraints do.",
    category: "Cognition",
    definition: "The constructive personal disciplines (like study and purity) that support spiritual growth.",
    significance: "Works alongside Yama to create the mental environment necessary for Tattvajñāna.",
    relatedConcepts: ["yoga", "yama"]
  },
  {
    id: "samvada",
    sanskrit: "संवाद",
    iast: "saṃvāda",
    english: "Constructive Dialogue",
    forBeginners: "This is simply a genuinely friendly, honest conversation with a teacher or fellow student, aimed purely at clearing up confusion and understanding the truth together — with nobody trying to 'win' or embarrass the other person. It's the preferred, most wholesome version of philosophical discussion.",
    category: "Dialectics",
    definition: "A sincere discussion with teachers or peers aimed purely at discovering the truth, without the desire to defeat the other.",
    significance: "The preferred mode of philosophical inquiry (Vāda), essential for clarifying doubts and solidifying knowledge.",
    relatedConcepts: ["vada", "tarka"]
  },
  {
    id: "jalpa",
    sanskrit: "जल्प",
    iast: "jalpa",
    english: "Wrangling / Competitive Debate",
    forBeginners: "This is a more combative style of debate where the main goal shifts from 'finding the truth' to simply 'beating the other person,' using any clever trick that's technically allowed. Nyāya doesn't love this style, but it does permit it — specifically as a defensive tool, for standing your ground against a hostile opponent who refuses to engage honestly.",
    category: "Dialectics",
    definition: "A debate where the primary goal is victory over the opponent rather than the discovery of truth, using any logical means necessary.",
    significance: "While risky, Nyāya permits it for defending the truth against hostile opponents who refuse constructive dialogue.",
    relatedConcepts: ["vada", "vitanda", "chhala"]
  },
  {
    id: "vitanda",
    sanskrit: "वितण्डा",
    iast: "vitaṇḍā",
    english: "Destructive Debate",
    forBeginners: "This is the most extreme, least respectable style of debate: someone who only tears down the other person's position without ever offering or defending any position of their own — pure attack, no substance. Nyāya studies this mainly so people know how to recognize and effectively counter it when they run into it.",
    category: "Dialectics",
    definition: "A form of debate where the participant only attacks the opponent's thesis without establishing any thesis of their own.",
    significance: "Viewed as the lowest form of debate, often associated with skeptics or nihilists. Nyāya studies it primarily to know how to counter it.",
    relatedConcepts: ["vada", "jalpa", "shunyavada"]
  },
  {
    id: "mithyajnana",
    sanskrit: "मिथ्याज्ञान",
    iast: "mithyājñāna",
    english: "False Apprehension",
    forBeginners: "Getting reality wrong at the root level — mistaking the body, the world, or the non-self for the true self. Think of it as the master-error from which every other error grows.",
    category: "Epistemology",
    definition: "False or erroneous cognition regarding the true nature of reality — the soul, the body, and the world — also called avidyā in its practical role.",
    significance: "The primary cause of all suffering and the first link of the duḥkha-chain (1.1.2): only when false apprehension is removed by true knowledge (tattvajñāna) does the road to release open.",
    relatedConcepts: ["moha", "samsaya", "tatva-jnana", "duhkha-chain-nyaya"]
  },
  {
    id: "vartamana-kala",
    sanskrit: "वर्तमानकाल",
    iast: "vartamāna-kāla",
    english: "Present Time",
    forBeginners: "The 'now' in which everything we directly perceive happens. Some opponents argued the present is unreal (only past traces and future hopes exist); Gautama shows that without a real present, past and future — which depend on it — collapse too.",
    category: "Metaphysics",
    definition: "Time as presently occurring — the ongoing duration in which all direct perception takes place, defended by Gautama as fully real against deniers.",
    significance: "Anchors Nyāya's temporal realism: past and future exist only relative to a real present, and every pratyakṣa occurs now.",
    relatedConcepts: ["kala", "nitya", "pratyaksha"]
  },
  {
    id: "apta-vakya",
    sanskrit: "आप्तवाक्य",
    iast: "āpta-vākya",
    english: "Testimony of the Trustworthy",
    forBeginners: "The words of someone who truly knows a thing and wants to tell you exactly as it is — no deceit, no agenda. An āpta is not a caste or creed but a reliable knower; mantras and Āyurveda are valid for exactly this reason, and so are the Vedas.",
    category: "Epistemology",
    definition: "Verbal testimony issuing from a trustworthy authority (āpta) — one who knows truly and communicates faithfully — the operative form of śabda-pramāṇa.",
    significance: "The bridge from human trust to scriptural authority: Āyurveda's cures prove its ṛṣi-authors reliable, and the same authors' Vedas inherit that trust.",
    relatedConcepts: ["apta", "shabda", "veda"]
  },
  {
    id: "avayavi",
    sanskrit: "अवयवी",
    iast: "avayavī",
    english: "The Whole (Variant Form)",
    forBeginners: "The complete thing that parts make together — not merely the pile of parts but a new reality in its own right. Atoms are beyond the senses, yet the wholes they compose can be directly seen and held.",
    category: "Metaphysics",
    definition: "The unified whole arising from assembled parts (avayava), a distinct existent over and above their mere aggregate.",
    significance: "Companion entry to avayavin: anti-Buddhist realism — because the whole is real, objects can be perceived and handled.",
    relatedConcepts: ["avayavin", "avayava", "paramanu"]
  }
];
