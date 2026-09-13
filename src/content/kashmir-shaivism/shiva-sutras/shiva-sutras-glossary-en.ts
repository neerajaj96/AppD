// Śiva-sūtra glossary: original concise definitions for this app, standing in
// for the function of Singh's 28-page glossary (pp. 235–263). Fresh wording —
// not copied entries. Only terms load-bearing for reading the 77 sūtras.
export interface ShivaSutraGlossaryEntry {
  id: string;
  term: string;
  iast: string;
  summary: string;
}

export const shivaSutrasGlossaryEn: ShivaSutraGlossaryEntry[] = [
  { id: "sg-abhilasa", term: "Abhilāṣa", iast: "abhilāṣā", summary: "Craving born of felt want (3.40): desire confessing lack, the engine of outward-going transmigration. Starved by awareness mounted in That (3.41)." },
  { id: "sg-adhva", term: "Adhvā", iast: "adhvā", summary: "Course of manifestation: śuddhādhvā (Śiva to Śuddhavidyā, extra-mundane) and aśuddhādhvā (Māyā to earth). The ladder Āṇavopāya climbs back up (3.4)." },
  { id: "sg-anava", term: "Āṇava-mala", iast: "āṇavamala", summary: "Stain of incompleteness: the universal's sense 'I am imperfect, incomplete' (1.2; 3.3). Removed by union with the pure Principle (1.16)." },
  { id: "sg-anavopaya", term: "Āṇavopāya", iast: "āṇavopāya", summary: "Means of the limited soul (Section III): mind, breath and body as instruments — dissolution-contemplation, breath operations, Seed-attention, Seat-and-lake." },
  { id: "sg-anuttara", term: "Anuttara", iast: "anuttara", summary: "The Unsurpassable: letter 'a' as Absolute, nothing higher. Governs the Mātṛkā-circle's head (cf. 2.7)." },
  { id: "sg-avrana", term: "Āvaraṇa", iast: "āvaraṇa", summary: "Veiling: delusion's covering function. Powers grown from the veil (3.6) re-bind." },
  { id: "sg-bhairava", term: "Bhairava", iast: "bhairava", summary: "The awesome plenitude of consciousness; the 1.5 flash itself, not a later deity-goal. Also the identity proclaimed as mantra's source-lake (1.22)." },
  { id: "sg-bhoga", term: "Bhoga / Ābhoga", iast: "bhoga, ābhoga", summary: "Enjoyment, savour: turya enjoyed across states (1.7), the vīreśa's single savour (1.11), infinite absorption digesting all experience (3.7)." },
  { id: "sg-bhuta", term: "Bhūta", iast: "bhūta", summary: "Element (earth to ether): united, separated and gathered by the established yogi (1.20); worn finally as a mere cloak (3.42)." },
  { id: "sg-caitanya", term: "Caitanya", iast: "caitanya", summary: "Consciousness as knowing-plus-doing freedom (1.1): prakāśa inseparable from vimarśa. The Self's definition and the text's first word." },
  { id: "sg-cakra", term: "Cakra", iast: "cakra", summary: "Circle: of powers (śakti-cakra, 1.6, 1.21), of letters (mātṛkā-cakra, 2.7). To join the circle rightly is method; to stand established in it is mastery (3.29)." },
  { id: "sg-camatkara", term: "Camatkāra", iast: "camatkāra", summary: "Aesthetic astonishment: each station of Śāmbhavopāya arrives as wonder (1.12). Progress feels like amazement, not achievement." },
  { id: "sg-citta", term: "Citta", iast: "citta", summary: "Mind-complex (intellect, ego, inner sense): bondage's instrument turned into ascent's instrument (3.1); ceaselessly reflecting, it becomes mantra (2.1)." },
  { id: "sg-dhih", term: "Dhī", iast: "dhī", summary: "Higher intelligence: purified buddhi become mirror (3.12). Brought under control, it reveals the throbbing I-ness (sattva)." },
  { id: "sg-guru", term: "Guru", iast: "guru", summary: "The revealer: himself the means (2.6), channel of śaktipāta, discloser of the letter-circle (2.7). Establishment authorizes (3.29)." },
  { id: "sg-hrada", term: "Mahāhrada", iast: "mahāhrada", summary: "Great lake: consciousness clear, deep, uncovered (1.22; 3.16). Mantras borrow virility from it; immersion owns the source." },
  { id: "sg-hrdaya", term: "Hṛdaya", iast: "hṛdaya", summary: "Heart: central consciousness, not the organ (1.15). Colliding the mind with it reveals each thing's essence." },
  { id: "sg-iccha", term: "Icchā-śakti", iast: "icchāśakti", summary: "Power of Will: virgin Umā in the established yogi (1.13), matured into body-projection (1.19). Creates without craving." },
  { id: "sg-jiva", term: "Jīva", iast: "jīva", summary: "Contracted soul-construct: maintained by craving, dissolved when awareness mounts in That (3.41). Carried across lives while craving lasts (3.40)." },
  { id: "sg-jnana", term: "Jñāna", iast: "jñāna", summary: "Knowing: bondage when divided and object-terminated (1.2; 3.2); food when offered to awareness (2.9); destroyed as limitation, it ends rebirth-compulsion (3.18)." },
  { id: "sg-kaivalya", term: "Kaivalya / Kevalī", iast: "kaivalya, kevalī", summary: "Aloneness as fullness (3.34): freedom from pleasure-pain's pull, not from appearance. Also the breath-operation of isolating awareness (3.5)." },
  { id: "sg-kala", term: "Kalā", iast: "kalā", summary: "Limited agency: first covering under Māyā, head of the discriminandum list (3.3); also the 'parts' dissolved contemplatively (3.4)." },
  { id: "sg-kancuka", term: "Kañcuka", iast: "kañcuka", summary: "Covering: Māyā's five (kalā, vidyā, rāga, kāla, niyati) plus the elemental cloak worn lightly at the end (3.42)." },
  { id: "sg-karma-mala", term: "Kārma-mala", iast: "kārmamala", summary: "Stain of action-impressions driving rebirth (1.3; 3.35). The karma-ātman outsources selfhood to deeds." },
  { id: "sg-kechari", term: "Khecarī", iast: "khecarī", summary: "Moving in the void (kha): consciousness unobstructed in limitlessness; Śiva's own state dawning spontaneously (2.5)." },
  { id: "sg-madhya", term: "Madhya", iast: "madhya", summary: "Centre: within breath-flow, beyond channels (3.44); also the gap between absorptions where inferior states breed (3.23). Context decides." },
  { id: "sg-mantra", term: "Mantra", iast: "mantra", summary: "Thought that protects: reflection on the Supreme (man) saving from transmigration (tra). Mind become mantra (2.1); talk become japa (3.27)." },
  { id: "sg-matrka", term: "Mātṛkā", iast: "mātṛkā", summary: "Mother of letters (1.4): alphabet-power underlying words and hence limited knowing. Her circle revealed by the guru (2.7); her letter-Mothers bind or free (3.19)." },
  { id: "sg-maya", term: "Māyā", iast: "māyā", summary: "Measurer: finitising power making the immeasurable seem finite; source of difference (1.3, 1.10, 3.3). Also the womb gestating limited powers (2.4)." },
  { id: "sg-mayi-mala", term: "Māyīya-mala", iast: "māyīyamala", summary: "Stain of difference: bodies and worlds as other (1.3). Suppressed in samāveśa, non-difference turns cosmically creative (3.36)." },
  { id: "sg-moha", term: "Moha", iast: "moha", summary: "Delusion: the veil powers grow from (3.6), conquered through total absorption (3.7). Test every siddhi against it." },
  { id: "sg-nartaka", term: "Nartaka", iast: "nartaka", summary: "Dancer-actor: the Self playing roles without loss (3.9), on the inner stage (3.10) before sense-spectators (3.11). Manifestation as play." },
  { id: "sg-pasu", term: "Paśu / Pati", iast: "paśu, pati", summary: "Bound creature vs Lord: paśu-hood is removable power, not essence (1.16); the end is pati-equality (3.25, 3.42). The letter-Mothers mother paśus (3.19)." },
  { id: "sg-prana", term: "Prāṇa", iast: "prāṇa", summary: "Vital energy: Āṇavopāya's lever (3.5); evenly spread, it yields equal vision (3.22); its body-link is natural even for the liberated (3.43)." },
  { id: "sg-pratyabhijna", term: "Pratyabhijñā", iast: "pratyabhijñā", summary: "Recognition: 'I am Śiva' as lived certainty (1.17), re-closed again and again (3.45). The system's name for liberation." },
  { id: "sg-sahaja", term: "Sahaja-vidyā", iast: "sahajavidyā", summary: "Innate wisdom: one's nature, never manufactured (3.7). Stabilized until natural, it ends the relapse warned of in 2.10." },
  { id: "sg-sakti", term: "Śakti", iast: "śakti", summary: "Power: Śiva's freedom-face; the circle joined (1.6), the Seed attended (3.15), the Seat stationed (3.16). Śāktopāya is her path." },
  { id: "sg-sama", term: "Sama-darśana", iast: "samadarśana", summary: "Equal seeing (3.22): sameness of Self in all, not sameness of appearances. Fruit of even breath rooted in turya." },
  { id: "sg-samavesa", term: "Samāveśa", iast: "samāveśa", summary: "Absorption-immersion: unbroken Knower-abiding amid activity (3.32). Gaps between absorptions are normal terrain (3.23–3.24)." },
  { id: "sg-sambhava", term: "Śāmbhavopāya", iast: "śāmbhavopāya", summary: "Means of Śiva (Section I): choiceless awareness, no object or technique (1.5–1.16). Alert passivity until vikalpas subside of themselves." },
  { id: "sg-sakta", term: "Śāktopāya", iast: "śāktopāya", summary: "Means of Śakti (Section II): pure thought cultivated until mind is mantra (2.1–2.5), guru-given (2.6–2.7), offered and eaten (2.8–2.9), guarded from relapse (2.10)." },
  { id: "sg-sattva-yogi", term: "Sattva (yogic)", iast: "sattva", summary: "Inner luminous Being: the throbbing of pure I-ness revealed in purified intellect (3.12). Not the guṇa of the same name." },
  { id: "sg-suddha", term: "Śuddha-vidyā / Śuddha-vikalpa", iast: "śuddhavidyā, śuddhavikalpa", summary: "Pure wisdom (balanced I–This, 1.21) and the pure thought that ripens into certainty (1.17). One destroys impure thoughts, then dissolves." },
  { id: "sg-svapna", term: "Svapna", iast: "svapna", summary: "Dream: private thought-constructs (1.9); inferior powers as dream (2.4); relapse-dream rising from lapsed wisdom (2.10)." },
  { id: "sg-svatantrya", term: "Svātantrya", iast: "svātantrya", summary: "Absolute freedom: the five cosmic acts as Self-rhythm (3.30–3.32), attained as settled state (3.13), non-local (3.14)." },
  { id: "sg-turya", term: "Turya", iast: "turya", summary: "The Fourth: witnessing continuity through waking, dream, sleep (1.7–1.11); poured like oil (3.20), entered immersed (3.21), vivifying all (3.38–3.39), re-closed (3.45)." },
  { id: "sg-udyama", term: "Udyama", iast: "udyama", summary: "Upsurge (1.5): spontaneous upward flight of awareness. Not exertion — the preface's key philological warning." },
  { id: "sg-upaya", term: "Upāya", iast: "upāya", summary: "Means: graded to capacity — Śāmbhava (no support), Śākta (thought-support), Āṇava (body-breath-mind supports). All terminate in svātantrya." },
  { id: "sg-vikalpa", term: "Vikalpa", iast: "vikalpa", summary: "Thought-construct: binds when impure and divided (1.9), liberates when pure and Śiva-directed (1.17; 2.1), starves the returning dream (2.10; 3.24)." },
  { id: "sg-vimarsa", term: "Vimarśa", iast: "vimarśa", summary: "Reflective freedom: the Self-knowing pulse inseparable from light (prakāśa). Kṣemarāja's lens on 1.1; title-word of his Vimarśinī." },
  { id: "sg-viresa", term: "Vīreśa", iast: "vīreśa", summary: "Lord of heroes: master of the senses-as-powers, enjoyer of the three as one savour (1.11). Establishment authorizes (3.29)." },
  { id: "sg-vismaya", term: "Vismaya", iast: "vismaya", summary: "Wonder (1.12): sign and substance of Śāmbhava stations. Guards recognition against technique-reduction." },
  { id: "sg-yoni", term: "Yoni", iast: "yoni", summary: "Womb-source: Māyā as source of differentiation (1.3); also Māyā's interior gestating limited powers (2.4, garbha)." }
];
