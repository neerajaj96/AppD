// Śiva-sūtra introduction digest: original paraphrase of the background Singh's
// edition supplies (revelation story, dating, commentaries, tattvas, malas,
// upāyas, section abstracts, Kṣemarāja's frame). Fresh summaries in our own
// words — not a translation or transcription of Singh's introduction.
export interface ShivaSutraIntroTopic {
  id: string;
  title: string;
  sanskritTag: string;
  summary: string;
  keyPoints: string[];
}

export const shivaSutrasIntroEn: ShivaSutraIntroTopic[] = [
  {
    id: "ssi-01-revelation",
    title: "A revealed book with no human author",
    sanskritTag: "शिवोपनिषत्संग्रह — महादेवगिरौ शिलायाम्",
    summary:
      "Tradition agrees on the main point and differs only on details: the aphorisms originate from Śiva and reached Vasugupta — whether taught in a dream (Kallata's account), conveyed by a perfected Siddha (Bhāskara's account), or found inscribed on the rock that turned over at Śiva's dream-command on Mahādeva mountain (Kṣemarāja's account). The stone, still called Samkaropala near Harwan behind Shalimar, survives; its inscription does not. The text is therefore received as śivopaniṣat-saṃgraha, a compendium of secret doctrine, whose purpose was to counter the effects of dualism.",
    keyPoints: [
      "Three accounts, one consensus: no human author; revealed to Vasugupta.",
      "Why it matters: authority here rests on revelation, not argument — the commentaries then supply the reasoning."
    ]
  },
  {
    id: "ssi-02-date-lineage",
    title: "Date, teachers and the four surviving commentaries",
    sanskritTag: "वसुगुप्त — कल्लट — क्षेमराज — भास्कर",
    summary:
      "Vasugupta taught Kallata, who flourished under Avantivarman of Kashmir (9th century), placing the discovery in the late 8th or early 9th century. Bhāskara learned the sūtras through a six-teacher descent (Kallata … Śrīkaṇṭha) and wrote his verse Vārttika in the 11th century. Four commentaries survive: the anonymous prose Vṛtti (so close to the Vimarśinī it reads as its draft or abstract, plausibly Kṣemarāja's own), Bhāskara's independent verse Vārttika, Kṣemarāja's detailed prose Vimarśinī (pupil of Abhinavagupta, 10th–11th century, citing lost Āgamas throughout), and Varadarāja's verse reworking of the Vimarśinī. Kṣemarāja wrote because earlier readings disagreed; his thoroughness displaced the rest.",
    keyPoints: [
      "Late-8th/early-9th century discovery; Bhāskara's Vārttika is 11th century.",
      "Singh follows Kṣemarāja throughout, noting Bhāskara's divergences where they occur (see per-sūtra textual notes)."
    ]
  },
  {
    id: "ssi-03-triads",
    title: "Why this is called Trika",
    sanskritTag: "शिव — शक्ति — नर; पर — परापर — अपर",
    summary:
      "The non-dual Śaivism of Kashmir is Trika-śāsana, the discipline of the triad: Śiva, Śakti and Nara (the bound soul) — or, from the standpoint of experience, para (highest, undifferentiated), parāpara (identity-in-difference) and apara (difference). Its literature falls into three branches: Āgama (revealed practice-principle, including the Śiva-sūtras, Mālinīvijaya, Svacchanda, Vijñāna-bhairava and others), Spanda (the throbbing dynamism of consciousness) and Pratyabhijñā (recognition). A śāsana is a way of life with rules, not thought alone.",
    keyPoints: [
      "Trika = the three read as one reality at three depths.",
      "Āgama, Spanda and Pratyabhijñā are three doors into the same house."
    ]
  },
  {
    id: "ssi-04-reality",
    title: "Ultimate Reality: light that knows itself",
    sanskritTag: "प्रकाश — विमर्श; चैतन्यमात्मा",
    summary:
      "The Absolute (Parama Śiva) is self-luminous awareness (prakāśa) inseparably united with its self-reflective freedom (vimarśa): knowing and doing are one act. Nothing is outside it; manifestation is its play (svātantrya), never a fall. Sūtra 1.1 states this whole metaphysics in two words, and everything after it is either forgetting or remembering.",
    keyPoints: [
      "Prakāśa without vimarśa would be cold light; vimarśa without prakāśa, blind — the system refuses both.",
      "Creation is art, not exile: the dancer image of 3.9 governs the cosmology."
    ]
  },
  {
    id: "ssi-05-manifestation",
    title: "Manifestation: the thirty-six principles",
    sanskritTag: "षट्त्रिंशत्तत्त्वानि — शुद्धाध्वा — अशुद्धाध्वा",
    summary:
      "From Śiva the principles unfold down to earth: the pure course (śuddhādhvā — Śiva, Śakti, Sadāśiva, Īśvara, Śuddhavidyā, where I and This stay balanced) and then, through Māyā and her five coverings (kalā, vidyā, rāga, kāla, niyati), the impure course — puruṣa and prakṛti, intellect, ego, mind, senses, subtle and gross elements. Āṇavopāya works this ladder backwards by contemplative dissolution (3.4).",
    keyPoints: [
      "Pure course: unity holding difference; impure course: difference forgetting unity.",
      "The ladder is climbed down in bondage and up in practice — same rungs."
    ]
  },
  {
    id: "ssi-06-bondage",
    title: "Bondage: three stains, one mis-knowing",
    sanskritTag: "आणव — मायीय — कार्म; ज्ञानं बन्धः",
    summary:
      "Bondage is epistemic before it is anything else. Primal incompleteness (āṇava-mala, 'I am imperfect'), difference (māyīya-mala, bodies and worlds as other) and action-impressions (kārma-mala, the compulsion to reap) are all forms of vitiated knowing (1.2; 3.1–3.3). Language itself transmits them: the un-understood Mother of letters (1.4) delivers fragmented experience through her letter-goddesses (3.19). Hence liberation is uncovering (pratyabhijñā), not acquisition.",
    keyPoints: [
      "Three malas, one root: perfection forgotten, not perfection absent.",
      "Craving (abhilāṣa, 3.40) is the engine that keeps the stains circulating across lives."
    ]
  },
  {
    id: "ssi-07-upayas",
    title: "Liberation: three means for three capacities",
    sanskritTag: "शाम्भव — शाक्त — आणव; उपाय",
    summary:
      "The system sorts seekers, not truths. Śāmbhavopāya (Section I, 22 sūtras) is choiceless awareness flashing as Bhairava (1.5) — no object, no technique. Śāktopāya (Section II, 10 sūtras) works through purified thought: mind become mantra (2.1), sustained by zeal (2.2), empowered by the wisdom-bodied Being (2.3), refusing inferior powers as dream (2.4), dawned upon as Khecarī (2.5), with the guru as the living means (2.6–2.7). Āṇavopāya (Section III, 45 sūtras) starts from mind, breath and body: dissolution-contemplation, breath operations, Seed-attention, Seat-and-lake immersion, centre-awareness within breathing. All three end in the same freedom (3.13).",
    keyPoints: [
      "Highest, middle, lowest means — one freedom at the end.",
      "The guru belongs structurally to the middle path but blesses all three (3.28–3.29)."
    ]
  },
  {
    id: "ssi-08-section-abstracts",
    title: "What each section contains, sūtra by sūtra arc",
    sanskritTag: "प्रथम — द्वितीय — तृतीय उन्मेष",
    summary:
      "Section I moves from definition (1.1) through bondage-anatomy (1.2–1.4) into the flash and its fruits (1.5–1.7), the three states redefined (1.8–1.11), wonder, will and world-as-body (1.12–1.16), the pure-thought bridge (1.17), bliss-identity (1.18), powers and their crown (1.19–1.21), and the great lake of mantra-power (1.22). Section II defines mantra-mind (2.1–2.3), warns against womb-powers (2.4), promises spontaneous Khecarī (2.5), installs the guru and the letter-circle (2.6–2.7), offers body and knowledge as oblation and food (2.8–2.9), and cautions against relapse (2.10). Section III descends to the mind (3.1–3.3), gives contemplative and breath methods (3.4–3.5), warns and heals around powers (3.6–3.8), stages the dancer theatre (3.9–3.14), prescribes Seed, Seat and lake (3.15–3.17), resolves rebirth and letters (3.18–3.19), pours the Fourth into the three and beyond (3.20–3.24), declares Śiva-equality and its conduct (3.25–3.34), contrasts the delusion-mass (3.35), grants world-authorship (3.36–3.37), vivifies all (3.38–3.39), starves craving (3.40–3.41), cloaks in elements (3.42), notes breath's nature (3.43), centres within breathing (3.44) and closes with repeated recognition (3.45).",
    keyPoints: [
      "22 + 10 + 45: the proportions themselves teach — ascent needs few words, the ground-floor path needs many.",
      "The last word (pratimīlanam) sends the reader back to the first (caitanyam)."
    ]
  },
  {
    id: "ssi-09-ksemaraja-frame",
    title: "Kṣemarāja's frame: why he wrote, how he closes",
    sanskritTag: "विमर्शिनी — आद्यन्तश्लोकाः",
    summary:
      "Kṣemarāja opens by noting discrepant readings in circulation and promising an exposition faithful to tradition, then substantiates every sūtra with parallel quotations — some from works now lost, which is part of this commentary's documentary value. He closes (as Singh renders the colophon verses) by signing as Rājanaka Kṣemarāja, dependent on the lotus feet of Abhinavagupta, offering the work for the welfare of reflective minds seeking identity with Śiva. Singh's conclusion (pp. 231–234) gathers these threads: the sūtras as radiant, guru-taught truth enlightening inner understanding.",
    keyPoints: [
      "The Vimarśinī is both commentary and archive of lost Āgamas.",
      "Lineage matters structurally: teaching passes guru-to-student, not book-to-reader (cf. 2.6)."
    ]
  },
  {
    id: "ssi-10-how-to-use",
    title: "How this app carries Singh over",
    sanskritTag: "परामर्श — नानुवाद",
    summary:
      "Copyright and philosophy agree here: Singh's translation cannot be reproduced, so this app carries his edition as paraphrase-plus-structure. Each sūtra keeps its Sanskrit (Devanāgarī + IAST), our own concise translation, a Vimarśinī-line commentary, key points, a fresh word-by-word gloss, and — where Singh reports Bhāskara's divergence — a textual note in our own words. The introduction digest (this file) and the glossary stand in for Singh's fifty-page introduction and 28-page glossary; the Malayalam overlay restates the same line in Malayalam. For the full Vimarśinī Sanskrit, notes and running expositions, readers should consult Singh's printed book.",
    keyPoints: [
      "Structure preserved, wording original: 77 sūtras, 3 sections, 12 concepts, full thread.",
      "The printed book remains indispensable for the complete commentary and apparatus."
    ]
  }
];
