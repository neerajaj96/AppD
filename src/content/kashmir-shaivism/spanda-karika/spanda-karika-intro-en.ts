// Spanda-kārikā introduction digest: original paraphrase of the background
// Singh's edition supplies (importance, authorship, commentaries, spanda,
// section summaries, Kṣemarāja's frame). Fresh summaries in our own words —
// not a translation or transcription of Singh's introduction.
export interface SpandaIntroTopic {
  id: string;
  title: string;
  sanskritTag: string;
  summary: string;
  keyPoints: string[];
}

export const spandaKarikaIntroEn: SpandaIntroTopic[] = [
  {
    id: "spi-00-provenance",
    title: "Front matter: dedication and blessings",
    sanskritTag: "समर्पण — आशीर्वाद",
    summary:
      "Singh dedicates the book to Lakṣmaṇa Joo, doyen of Śaivāgama, whose living exposition he studied. The blessings page frames Spanda for a modern readership: vibration as the Absolute's throb behind cosmic expansion, a question physics leaves open at the first explosion, illustrated with Jñāneśvara's image of Śiva's universe-expanding gesture — and welcomes the work's availability in English for scientists and seekers alike. This topic records that framing in our own words; the page itself is not reproduced.",
    keyPoints: [
      "Dedication: Lakṣmaṇa Joo's living Trika exposition stands behind Singh's rendering.",
      "Blessings gist: Spanda presented as the ancient answer to expansion's first cause."
    ]
  },
  {
    id: "spi-01-importance",
    title: "A verse-commentary on the Śiva-sūtras",
    sanskritTag: "कारिका — स्पन्द — शङ्करस्तुतिः",
    summary:
      "The Spanda-kārikās are a metrical commentary on the Śiva-sūtras: kārikā means verses on a philosophical subject, spanda literally a throb — the Divine's dynamic face, creative pulsation. Singh's Preface states the two books' division of labour: the sūtras emphasize prakāśa (light), the kārikās vimarśa (reflective freedom) — together an integral view of Śaiva philosophy. Where the sūtras establish consciousness with absolute freedom, the kārikās unfold its throbbing: the Self is not bare witnessing but cognition-and-activity, and communion with this active Self alone raises one to supreme being.",
    keyPoints: [
      "Kārikā + Sūtra: aphorism states, verse unfolds.",
      "Prakāśa then vimarśa: the two books are one integral vision.",
      "Static Absolute rejected at the door: reality throbs."
    ]
  },
  {
    id: "spi-02-authorship",
    title: "Who composed the fifty-three verses?",
    sanskritTag: "कल्लट — वसुगुप्त — पञ्चाशत्",
    summary:
      "Opinion divides along clean lines. Bhāskara (in his Śiva-sūtra-vārttika) and Bhaṭṭa Utpala (in the Spanda-pradīpikā, on the 53rd verse) name Kallaṭa, Vasugupta's chief disciple, who received the secret doctrine from his guru: Bhāskara even credits Kallaṭa with a Spanda-sūtra commentary on the first three sections of the Śiva-sūtras. Kṣemarāja and Maheśvarānanda name Vasugupta, citing the treasure-verse (as the heart-cave's gain was good for Vasugupta, so for all). That verse, however, is missing from the Utpala, Kallaṭa and Rāmakaṇṭha recensions — while Kallaṭa's own Vṛtti colophon says the Spanda-nectar was strung together by revered Vasugupta and merely publicized by Kallaṭa.",
    keyPoints: [
      "Kallaṭa-party: Bhāskara, Utpala; Vasugupta-party: Kṣemarāja, Maheśvarānanda.",
      "Kallaṭa's colophon supports Vasugupta's authorship; the treasure-verse's absence weakens that verse as evidence."
    ]
  },
  {
    id: "spi-03-commentaries",
    title: "The commentarial field and Singh's base",
    sanskritTag: "निर्णय — प्रदीपिका — विवृति — वृत्ति",
    summary:
      "Several readings survive: Kallaṭa's prose Vṛtti, Bhaṭṭa Utpala's Spanda-pradīpikā, Rāmakaṇṭha's Vivṛti, Kṣemarāja's earlier Spanda-sandoha (an extended exposition of the first verse alone), and Kṣemarāja's Spanda-nirṇaya — the detailed commentary Singh translates, opening with propitiatory verses to Spanda-śakti and an introductory portion on tradition and synopsis. Singh follows the Nirṇaya throughout, as he followed the Vimarśinī for the sūtras.",
    keyPoints: [
      "Nirṇaya is Singh's base; Sandoha is Kṣemarāja's earlier single-verse study.",
      "Multiple recensions (Utpala, Kallaṭa, Rāmakaṇṭha) let variants be checked."
    ]
  },
  {
    id: "spi-04-spanda",
    title: "What spanda is — and is not",
    sanskritTag: "किञ्चिच्चलन — स्वतन्त्रशक्ति",
    summary:
      "Spanda is Svātantrya-śakti herself: the Lord's absolute freedom displaying as aham and visarga (I and creation), full of compact bliss-flash, whose essence is complete I-consciousness holding all letters. Though non-distinct from the motionless Lord, she stages manifestation and withdrawal on her own background like a city mirrored — appearing supernumerary (adhika iva) while nothing extra (anadhika). The word means slight movement (kiñcit-calana): perpetual pulsation the Lord never lacks — against views of a wholly inactive Absolute, without which nothing could appear at all.",
    keyPoints: [
      "Motionless Lord, moving Power — non-distinct, not two.",
      "Inactivity-theories fail: an inactive Absolute could manifest nothing."
    ]
  },
  {
    id: "spi-05-section1",
    title: "Section I: Svarūpaspanda in twenty-five verses",
    sanskritTag: "स्वरूपस्पन्द — निमीलनसमाधि",
    summary:
      "The opening verse lauds Śiva and states the purport; four verses establish Spanda's nature by reasoning (1.2–1.5); two give the means of recognized attainment (1.6–1.7); the eighth refutes objections to the means and the ninth its fitness; the tenth shows the goal; the eleventh ends world-delusion through adherence; 12–13 expose Nihilism against void-experience; 14–16 prove the Subject indestructible; 17–18 portion out full and partial awakening; 19 hints veil-removal for the awakened; 20–21 diagnose the unawakened and exhort exertion; 22 names dead-stop states (rage, joy, impasse, running) as Spanda-occasions; 23–25 close with the surrender-vow, breath merged into suṣumnā, and the unveiled void. Stress throughout: nimīlana (introvertive) absorption.",
    keyPoints: [
      "25 verses: definition, proof, means, polemics, awakening-portions, occasions, breath-seal.",
      "Nimīlana first: the inward way before the outward."
    ]
  },
  {
    id: "spi-06-section2",
    title: "Section II: Sahajavidyodaya in seven verses",
    sanskritTag: "सहजविद्योदय — उन्मीलनसमाधि",
    summary:
      "Section I knew Spanda as the essential Self; Section II knows it as Self and universe together — unmīlana (extrovertive) absorption through sahaja-vidyā, unity in diversity. Verses 1–2: mantras and deities borrow power from Spanda and dissolve into it. Verses 3–4: the all-made jīva's identity with all leaves no non-Śiva state. Verse 5: world-as-play is jīvanmukti. Verses 6–7: meditation dawns as identity with the meditated — immortality, Self-grasp, initiation granting Śiva-being.",
    keyPoints: [
      "From Self-only to Self-and-universe: the outward turn.",
      "Seven verses, one arc: borrowed power → all-identity → play → dawn."
    ]
  },
  {
    id: "spi-07-section3",
    title: "Section III: Vibhūtispanda in nineteen verses",
    sanskritTag: "विभूतिस्पन्द — सिद्धि — बन्धविच्छेद",
    summary:
      "Mostly supernormal powers from Spanda-hold, closing with bondage-anatomy and its cut. Verses 1–2: wish-fulfillment waking and dreaming from the centre. Verse 3: inattention's leveling. Verses 4–5: essence-knowledge commanding appearance. Verse 6: hunger covered. Verse 7: omniscience, body-scaled to everywhere. Verse 8: depression from ignorance, starved by unmeṣa. Verse 9: the junction-flash. Verse 10: four supernormal signs as agitators. Verse 11: pervasion verified by oneself. Verse 12: referring all to the One. Verses 13–15: word-powers grazing the paśu. Verse 16: one Power binding or freeing. Verses 17–18: the eightfold fortress and subservience. Verse 19: rootedness, enjoyership, lordship of the circle.",
    keyPoints: [
      "19 verses: powers (1–12), bondage (13–18), lordship (19).",
      "The section concludes what Section I began."
    ]
  },
  {
    id: "spi-08-section4",
    title: "Section IV: two verses of close",
    sanskritTag: "गुरुभारती — हृद्गुहा",
    summary:
      "Only two verses. The first salutes guru-bhāratī by double entendre — the Spanda-state's power and the guru's word together — ferry across fathomless doubt, manifold in sense and syllable. The second blesses: the unattainable knowledge-treasure, secured in the heart-cave, shall be for all the world's welfare as it was for Vasugupta. The book gives itself away at the end.",
    keyPoints: [
      "Means and end praised in one breath.",
      "Lineage closes as generosity, not property."
    ]
  },
  {
    id: "spi-09-ksemaraja-frame",
    title: "Kṣemarāja's frame: Śakti-praise, effort, invitation",
    sanskritTag: "स्पन्दशक्ति — स्पन्दसन्दोह — सूत्रसमन्वय",
    summary:
      "The Nirṇaya opens lauding Spanda-śakti of Śiva (Sāṅkarī): mantra-vitality-aware, endless flash of complete I-consciousness lettered through, goddess of knowledge mirroring earth-to-Śiva on her own free canvas. Kṣemarāja notes the Sandoha already relished Spanda-nectar in small measure; the Nirṇaya undertakes complete enjoyment. His invitation promises sūtra-interconnection, highest-Reality ascertainment, subtle reasoning, right means-application, clear exposition and secret doctrine — then the introductory portion tells the Vasugupta tradition (dream-instruction, rock-inscription, fifty-one verses) and synopsizes all three sections verse by verse.",
    keyPoints: [
      "Sandoha tasted; Nirṇaya feasts: one verse, then the whole.",
      "Tradition + synopsis before text: lineage before lesson."
    ]
  },
  {
    id: "spi-10-how-to-use",
    title: "How this app carries Singh over",
    sanskritTag: "परामर्श — नानुवाद",
    summary:
      "Copyright and philosophy agree: Singh's translation cannot be reproduced, so this app carries his edition as paraphrase-plus-structure. Each kārikā keeps its Sanskrit (Devanāgarī + IAST — Singh prints both per verse, followed by the Nirṇaya's Sanskrit, its translation and notes), our own concise translation, a Nirṇaya-line commentary, key points, a fresh word-by-word gloss, and — where recensions or commentators diverge — a textual note in our own words. The introduction digest and glossary stand in for Singh's introduction (pp. xiii–xxiii) and glossary (pp. 178–201); the Malayalam overlay restates the same line in Malayalam. Dedicated in Singh's edition to Lakṣmaṇa Joo, doyen of Śaivāgama, whose living exposition Singh studied. For the full Nirṇaya Sanskrit, notes and expositions, readers should consult Singh's printed book.",
    keyPoints: [
      "Structure preserved, wording original: 53 kārikās, 4 sections, 12 concepts, full thread.",
      "Lineage acknowledged: Singh's exposition came through Lakṣmaṇa Joo's teaching.",
      "The printed book remains indispensable for the complete commentary and apparatus."
    ]
  }
];
