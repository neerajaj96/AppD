// Śiva-sūtra concepts: abstract nodes for the pedagogical thread.
// Summaries are this app's own paraphrase of the Vimarśinī line.
export const shivaSutrasConceptsEn: any[] = [
  {
    id: "caitanya-atman",
    title: "Caitanya — consciousness as the Self",
    category: "Absolute Reality",
    summary: "The Self is self-luminous awareness endowed with absolute freedom of knowledge and action (1.1). It is neither body, breath, mind nor void: every candidate for selfhood shines only by its light, and difference cannot be fastened onto what illuminates difference itself.",
    relatedVerseIds: ["SS-1.1", "SS-1.2", "SS-3.9"],
    relatedConceptIds: ["svatantrya", "jnana-bandha"]
  },
  {
    id: "jnana-bandha",
    title: "Jñāna-bandha — contracted knowledge as bondage",
    category: "Bondage",
    summary: "Bondage is epistemic: taking the non-self for the Self and splitting one awareness into knower, means and known (1.2; 3.1-3.2). Primal ignorance (āṇava-mala) is not absence of knowledge but vitiated, limited knowledge — perfection forgotten, not perfection absent.",
    relatedVerseIds: ["SS-1.2", "SS-1.3", "SS-2.9", "SS-3.1", "SS-3.2"],
    relatedConceptIds: ["caitanya-atman", "malas", "matrka"]
  },
  {
    id: "malas",
    title: "The three malas — stains of limitation",
    category: "Bondage",
    summary: "Āṇava (incompleteness, 'I am imperfect'), māyīya (difference, bodies and worlds as other), and kārma (action-impressions driving rebirth). Sūtras 1.2-1.3, 1.10, 3.3 and 3.35 map them; the whole of Section III is their systematic removal.",
    relatedVerseIds: ["SS-1.2", "SS-1.3", "SS-1.10", "SS-1.16", "SS-3.3", "SS-3.18", "SS-3.23", "SS-3.35", "SS-3.40", "SS-3.41"],
    relatedConceptIds: ["jnana-bandha", "pratyabhijna"]
  },
  {
    id: "matrka",
    title: "Mātṛkā — the Mother of letters",
    category: "Philosophy of Language",
    summary: "The alphabet-power underlying all words and hence all limited knowledge (1.4). Unknown, she mothers bondage through the ka-group Mothers (3.19); revealed by the guru (2.7), the same letter-circle becomes mantra and liberation. Language is thus the hinge of both fall and rise.",
    relatedVerseIds: ["SS-1.4", "SS-1.22", "SS-2.3", "SS-2.7", "SS-3.15", "SS-3.19", "SS-3.27"],
    relatedConceptIds: ["saktopaya", "guru-upaya"]
  },
  {
    id: "sambhavopaya",
    title: "Śāmbhavopāya — the path of Śiva",
    category: "Soteriology",
    summary: "The highest means: choiceless awareness in which vikalpas subside unopposed and consciousness flashes upward as Bhairava himself (1.5). No object, no technique — union with the śakti-circle (1.6), wonder at each stage (1.12), and will as the virgin Umā (1.13) mark its stations.",
    relatedVerseIds: ["SS-1.5", "SS-1.6", "SS-1.7", "SS-1.11", "SS-1.12", "SS-1.13", "SS-1.15", "SS-1.16"],
    relatedConceptIds: ["turya", "svatantrya", "caitanya-atman"]
  },
  {
    id: "turya",
    title: "Turya — the Fourth, poured into the three",
    category: "Soteriology",
    summary: "The witnessing Fourth underlying waking (outer sense-knowledge, 1.8), dream (private vikalpas, 1.9) and deep sleep (non-discernment, 1.10). Practice is retaining its enjoyment across all three (1.7, 1.11), pouring it like oil (3.20), entering it immersed (3.21), and vivifying mind, body and world with it (3.38-3.39).",
    relatedVerseIds: ["SS-1.7", "SS-1.8", "SS-1.9", "SS-1.10", "SS-1.11", "SS-1.18", "SS-3.8", "SS-3.20", "SS-3.21", "SS-3.22", "SS-3.24", "SS-3.38", "SS-3.39", "SS-3.44", "SS-3.45"],
    relatedConceptIds: ["sambhavopaya", "anavopaya", "pratyabhijna"]
  },
  {
    id: "saktopaya",
    title: "Śāktopāya — the path of Śakti",
    category: "Soteriology",
    summary: "The middle means, for minds that need a support: purifying thought until citta itself becomes mantra (2.1) through zealous persistence (2.2), discovering the wisdom-bodied Being behind syllables (2.3), refusing inferior powers as dream (2.4), and rising spontaneously into Khecarī, Śiva's own state (2.5).",
    relatedVerseIds: ["SS-1.17", "SS-2.1", "SS-2.2", "SS-2.3", "SS-2.4", "SS-2.5", "SS-2.8", "SS-2.9", "SS-2.10"],
    relatedConceptIds: ["matrka", "guru-upaya", "siddhi-moha"]
  },
  {
    id: "guru-upaya",
    title: "Guru — the living means",
    category: "Soteriology",
    summary: "The teacher who has crossed is himself the bridge (2.6): his grace (śaktipāta) awakens pure thought and reveals the Mātṛkā-circle (2.7). Whoever stands established among the powers likewise becomes a means of wisdom to others (3.29); the highest gift such a one gives is Self-knowledge itself (3.28).",
    relatedVerseIds: ["SS-2.6", "SS-2.7", "SS-3.28", "SS-3.29"],
    relatedConceptIds: ["saktopaya", "matrka", "pratyabhijna"]
  },
  {
    id: "anavopaya",
    title: "Āṇavopāya — the path of the limited soul",
    category: "Soteriology",
    summary: "The lowest means, for those who must start from mind, breath and body: the bound self taken as citta (3.1), tattva-dissolution by contemplation (3.4), breath-channel operations (3.5), Seed-attention (3.15), seat-and-lake immersion (3.16), and centre-awareness within breathing beyond all channels (3.44) — ascending until it hands over to Śākta and Śāmbhava.",
    relatedVerseIds: ["SS-3.1", "SS-3.2", "SS-3.3", "SS-3.4", "SS-3.5", "SS-3.12", "SS-3.15", "SS-3.16", "SS-3.20", "SS-3.21", "SS-3.22", "SS-3.43", "SS-3.44"],
    relatedConceptIds: ["turya", "malas", "saktopaya"]
  },
  {
    id: "siddhi-moha",
    title: "Siddhis and moha — powers versus delusion",
    category: "Subtle Physiology",
    summary: "Body-creation (1.19), element-mastery (1.20), other-world authorship (3.36) and sense-creativity (3.37) are real — but powers grown from moha's veil (3.6) re-bind unless delusion is conquered into sahaja-vidyā (3.7) and crowned by pure wisdom's lordship (1.21). The text repeatedly subordinates wonder-working to recognition.",
    relatedVerseIds: ["SS-1.19", "SS-1.20", "SS-1.21", "SS-2.4", "SS-3.6", "SS-3.7", "SS-3.17", "SS-3.36", "SS-3.37"],
    relatedConceptIds: ["saktopaya", "pratyabhijna", "svatantrya"]
  },
  {
    id: "svatantrya",
    title: "Svātantrya — absolute freedom",
    category: "Absolute Reality",
    summary: "Śiva's unimpeded will to create, maintain, dissolve, conceal and reveal — mirrored in the yogi as dancer (3.9) on the inner stage (3.10) before sense-spectators (3.11), attaining freedom as settled state (3.13) extending everywhere alike (3.14), with the universe as his power's expansion (3.30-3.31).",
    relatedVerseIds: ["SS-1.1", "SS-1.5", "SS-1.13", "SS-1.21", "SS-3.9", "SS-3.10", "SS-3.11", "SS-3.13", "SS-3.14", "SS-3.30", "SS-3.31", "SS-3.37"],
    relatedConceptIds: ["caitanya-atman", "pratyabhijna"]
  },
  {
    id: "pratyabhijna",
    title: "Pratyabhijñā — recognition as Śiva",
    category: "Soteriology",
    summary: "The culmination: unwavering 'I am Śiva' (1.17), world-bliss as samādhi-bliss (1.18), mantra-potency from the great lake (1.22), spontaneous Khecarī (2.5), Śiva-equality (3.25), Knower-unbroken amid world-processes (3.32), affect seen as outer (3.33-3.34), craving starved and soul-limitation dissolved (3.41), elements worn as a cloak in full lordship (3.42), and recognition re-closed again and again (3.45).",
    relatedVerseIds: ["SS-1.6", "SS-1.11", "SS-1.14", "SS-1.15", "SS-1.17", "SS-1.18", "SS-1.22", "SS-2.5", "SS-3.7", "SS-3.8", "SS-3.25", "SS-3.26", "SS-3.27", "SS-3.32", "SS-3.33", "SS-3.34", "SS-3.41", "SS-3.42", "SS-3.45"],
    relatedConceptIds: ["turya", "svatantrya", "sambhavopaya"]
  }
];
