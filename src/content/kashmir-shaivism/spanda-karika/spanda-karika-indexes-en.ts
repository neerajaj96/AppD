// Spanda-kārikā indexes: original finding aids for this app, standing in for
// the function of Singh's back-matter indexes (subject p. 202, Sanskrit words
// pp. 203–209, alphabetical first-pāda index p. 210). Entries point at our own
// verse IDs; the alphabetical list quotes only first pādas of the ancient
// kārikā-text (public domain), sorted diacritic-blind. Nothing taken from
// Singh's translation, notes or expositions.
export interface KarikaIndexEntry {
  id: string;
  iast: string;
  section: string;
}

export interface KarikaTermIndexEntry {
  term: string;
  iast: string;
  verseIds: string[];
}

/** All 53 kārikās alphabetically by first pāda (cf. Singh p. 210). */
export const spandaKarikaAlphabeticalIndexEn: KarikaIndexEntry[] = [
  { id: "SP-4.1", iast: "agādhasaṃśayāmbhodhisamuttaraṇatāriṇīm", section: "Conclusion — Section IV" },
  { id: "SP-1.4", iast: "ahaṃ sukhī ca duḥkhī ca raktaś ca ityādisamvidaḥ", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.7", iast: "anenādhiṣṭhite dehe yathā sarvajñatādayaḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.3", iast: "anyathā tu svatantrā syātsṛṣṭistaddharmakatvataḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-1.20", iast: "aprabuddhadhiyastvete svasthitisthaganodyatāḥ", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.13", iast: "atastatkṛtrimaṃ jñeyaṃ sauṣuptapadavatsadā", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.21", iast: "ataḥ satatamudyuktaḥ spandatattvaviviktaye", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.22", iast: "atikruddhaḥ prahṛṣṭo vā kiṃ karomīti vā mṛśan", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.10", iast: "ato bindurato nādo rūpamasmādato rasaḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-1.14", iast: "avasthāyugalaṃ cātra kāryakartṛtvaśabditam", section: "Svarūpaspanda — Section I" },
  { id: "SP-2.6", iast: "ayamevodhayastasya dhyeyasya dhyāyicetasi", section: "Sahajavidyodaya — Section II" },
  { id: "SP-3.18", iast: "bhuṅkte paravaśo bhogaṃ tadbhāvātsaṃsared ataḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.11", iast: "didṛkṣayeva sarvārthān yadā vyāpyāvatiṣṭhate", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.6", iast: "durbalo'pi tadākramya yataḥ kārye pravartate", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.9", iast: "ekacintāprasaktasya yataḥ syādaparodayaḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.8", iast: "glānirviluṇṭhikā dehe tasyāścājñānataḥ sṛtiḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-1.19", iast: "guṇādispandaniḥṣyandāḥ sāmānyaspandasaṃśrayāt", section: "Svarūpaspanda — Section I" },
  { id: "SP-2.5", iast: "iti vā yasya saṃvittiḥ krīḍātvenākhilaṃ jagat", section: "Sahajavidyodaya — Section II" },
  { id: "SP-2.7", iast: "iyamevāmṛtaprāptiriyamevātmano grahaḥ", section: "Sahajavidyodaya — Section II" },
  { id: "SP-1.18", iast: "jñānajñeyasvarūpiṇyā śaktyā paramayā yutaḥ", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.3", iast: "jāgradādi vibhede'pi tadabhinne prasarpati", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.15", iast: "kāryonmukhaḥ prayatno yaḥ kevalaṃ so'tra lupyate", section: "Svarūpaspanda — Section I" },
  { id: "SP-4.2", iast: "labdhvāpyalabhyametajjñānadhanaṃ hṛdguhāntakṛtanihiteḥ", section: "Conclusion — Section IV" },
  { id: "SP-1.7", iast: "labhate tatprayatnena parīkṣyaṃ tattvamādarāt", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.5", iast: "na duḥkhaṃ na sukhaṃ yatra na grāhyaṃ grāhakaṃ na ca", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.8", iast: "na hīcchānodanasyāyaṃ prerakatvena vartate", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.16", iast: "na tu yo'ntarmukho bhāvaḥ sarvajñatvaguṇāspadam", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.9", iast: "nijāśuddhyāsamarthasya kartavyeṣvabhilāṣiṇaḥ", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.12", iast: "nābhāvo bhāvyatāmeti na ca tatrāstyamūḍhatā", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.14", iast: "parāmṛtarasāpāyastasya yaḥ pratyayodbhavaḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.12", iast: "prabuddhaḥ sarvadā tiṣṭhejjñānenālokya gocaram", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.16", iast: "seyaṃ kriyātmikā śaktiḥ śivasya paśuvartinī", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.15", iast: "svarūpāvaraṇe cāsya śaktayaḥ satatotthitāḥ", section: "Vibhūtispanda — Section III" },
  { id: "SP-1.25", iast: "tadā tasminmahāvyomni pralīnaśaśibhāskare", section: "Svarūpaspanda — Section I" },
  { id: "SP-2.1", iast: "tadākramya balaṃ mantrāḥ sarvajñabalaśālinaḥ", section: "Sahajavidyodaya — Section II" },
  { id: "SP-1.10", iast: "tadāsyākṛtrimo dharmo jñatvakartṛtvalakṣaṇaḥ", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.11", iast: "tamadhiṣṭhātṛbhāvena svabhāvamavalokayan", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.17", iast: "tanmātrodayarūpeṇa manohambuddhivartinā", section: "Vibhūtispanda — Section III" },
  { id: "SP-2.4", iast: "tasmācchabdārthacintāsu na sāvasthā na yā śivaḥ", section: "Sahajavidyodaya — Section II" },
  { id: "SP-1.17", iast: "tasyopalabdhiḥ satataṃ tripadāvyabhicāriṇī", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.2", iast: "tathā svapne'pyabhīṣṭārthān praṇayasyānatikramāt", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.5", iast: "tathā yatparamārthena yena yatra yathā sthitam", section: "Vibhūtispanda — Section III" },
  { id: "SP-2.2", iast: "tatraiva sampralīyante śāntarūpā nirañjanāḥ", section: "Sahajavidyodaya — Section II" },
  { id: "SP-1.24", iast: "tāmāśrityordhvamārgeṇa candrasūryāvubhāvapi", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.19", iast: "yadā tvekatra saṃrūḍhastadā tasya layodayau", section: "Vibhūtispanda — Section III" },
  { id: "SP-2.3", iast: "yasmātsarvamayo jīvaḥ sarvabhāvasamudbhavāt", section: "Sahajavidyodaya — Section II" },
  { id: "SP-1.1", iast: "yasyonmeṣanimeṣābhyāṃ jagataḥ pralayodayau", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.6", iast: "yataḥ karaṇavargo'yaṃ vimūḍho'mūḍhavatsvayam", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.1", iast: "yathechhābhyarthito dhātā jāgrato'rthān hṛdi sthitān", section: "Vibhūtispanda — Section III" },
  { id: "SP-3.4", iast: "yathā hi artho'sphuṭo dṛṣṭaḥ sāvadhāne'pi cetasi", section: "Vibhūtispanda — Section III" },
  { id: "SP-1.2", iast: "yatra sthitam idaṃ sarvaṃ kāryaṃ yasmāc ca nirgatam", section: "Svarūpaspanda — Section I" },
  { id: "SP-1.23", iast: "yāmavasthāṃ samālambya yadayaṃ mama vakṣyati", section: "Svarūpaspanda — Section I" },
  { id: "SP-3.13", iast: "śabdarāśisamutthasya śaktivargasya bhogyatām", section: "Vibhūtispanda — Section III" }
];

/** Key Sanskrit terms → kārikās using them (cf. Singh pp. 203–209; refs are our own). */
export const spandaKarikaWordIndexEn: KarikaTermIndexEntry[] = [
  { term: "Abhāva", iast: "abhāva", verseIds: ["SP-1.12"] },
  { term: "Adhiṣṭhātṛ", iast: "adhiṣṭhātṛ", verseIds: ["SP-1.11", "SP-3.7"] },
  { term: "Akṛtrima", iast: "akṛtrima", verseIds: ["SP-1.7", "SP-1.10"] },
  { term: "Amṛta", iast: "amṛta", verseIds: ["SP-2.7", "SP-3.14"] },
  { term: "Aprabuddha", iast: "aprabuddha", verseIds: ["SP-1.15", "SP-1.20"] },
  { term: "Avabodha", iast: "avabodha", verseIds: ["SP-3.11"] },
  { term: "Bala", iast: "bala", verseIds: ["SP-1.8", "SP-2.1", "SP-3.4", "SP-3.5"] },
  { term: "Bhoga / Bhoktṛ", iast: "bhoga, bhoktṛ", verseIds: ["SP-2.4", "SP-3.13", "SP-3.18", "SP-3.19"] },
  { term: "Bindu / Nāda / Rūpa / Rasa", iast: "bindu, nāda, rūpa, rasa", verseIds: ["SP-3.10"] },
  { term: "Cakreśvara", iast: "cakreśvara", verseIds: ["SP-3.19"] },
  { term: "Cintā", iast: "cintā", verseIds: ["SP-2.4", "SP-3.9"] },
  { term: "Dhātā", iast: "dhātā", verseIds: ["SP-3.1"] },
  { term: "Dhyeya", iast: "dhyeya", verseIds: ["SP-2.6"] },
  { term: "Glāni", iast: "glāni", verseIds: ["SP-3.8"] },
  { term: "Guru-bhāratī", iast: "gurubhāratī", verseIds: ["SP-4.1"] },
  { term: "Hṛd-guhā", iast: "hṛdguhā", verseIds: ["SP-4.2"] },
  { term: "Icchā", iast: "icchā", verseIds: ["SP-1.8", "SP-2.6"] },
  { term: "Jñatva / Kartṛtva", iast: "jñatva, kartṛtva", verseIds: ["SP-1.10"] },
  { term: "Kalā", iast: "kalā", verseIds: ["SP-3.13"] },
  { term: "Karaṇa", iast: "karaṇa", verseIds: ["SP-1.6"] },
  { term: "Krīḍā", iast: "krīḍā", verseIds: ["SP-2.5"] },
  { term: "Kṣobha", iast: "kṣobha", verseIds: ["SP-1.9", "SP-3.10"] },
  { term: "Madhya", iast: "madhya", verseIds: ["SP-3.2"] },
  { term: "Mantra", iast: "mantra", verseIds: ["SP-2.1", "SP-2.2"] },
  { term: "Nimeṣa", iast: "nimeṣa", verseIds: ["SP-1.1"] },
  { term: "Nirvāṇa-dīkṣā", iast: "nirvāṇadīkṣā", verseIds: ["SP-2.7"] },
  { term: "Parīkṣā", iast: "parīkṣā", verseIds: ["SP-1.7"] },
  { term: "Paśu", iast: "paśu", verseIds: ["SP-3.13", "SP-3.16"] },
  { term: "Praṇaya", iast: "praṇaya", verseIds: ["SP-3.2"] },
  { term: "Pratyaya", iast: "pratyaya", verseIds: ["SP-3.14", "SP-3.15", "SP-3.17"] },
  { term: "Prayatna", iast: "prayatna", verseIds: ["SP-1.7", "SP-1.15"] },
  { term: "Pury-aṣṭaka", iast: "puryaṣṭaka", verseIds: ["SP-3.17", "SP-3.18"] },
  { term: "Sahaja-vidyā", iast: "sahajavidyā", verseIds: ["SP-2.3", "SP-2.4", "SP-2.5", "SP-2.6", "SP-2.7"] },
  { term: "Samāpatti", iast: "samāpatti", verseIds: ["SP-2.6"] },
  { term: "Sarvajñatā", iast: "sarvajñatā", verseIds: ["SP-1.16", "SP-2.1", "SP-3.7"] },
  { term: "Smayamāna", iast: "smayamāna", verseIds: ["SP-1.11"] },
  { term: "Soma / Sūrya", iast: "soma, sūrya", verseIds: ["SP-3.1", "SP-1.24", "SP-1.25"] },
  { term: "Spanda", iast: "spanda", verseIds: ["SP-1.1", "SP-1.2", "SP-1.19", "SP-1.21", "SP-1.22"] },
  { term: "Suprabuddha", iast: "suprabuddha", verseIds: ["SP-1.17", "SP-1.18"] },
  { term: "Suṣumnā", iast: "suṣumnā", verseIds: ["SP-1.24", "SP-3.2", "SP-3.10"] },
  { term: "Tādātmya", iast: "tādātmya", verseIds: ["SP-2.3", "SP-2.6"] },
  { term: "Tanmātra", iast: "tanmātra", verseIds: ["SP-3.14", "SP-3.17"] },
  { term: "Unmeṣa", iast: "unmeṣa", verseIds: ["SP-1.1", "SP-1.22", "SP-3.8", "SP-3.9"] },
  { term: "Upalabdhi", iast: "upalabdhi", verseIds: ["SP-1.17"] },
  { term: "Vibhūti", iast: "vibhūti", verseIds: ["SP-1.1", "SP-3.13"] },
  { term: "Vivikta", iast: "vivikta", verseIds: ["SP-1.21"] }
];

/** Subjects → kārikās (cf. Singh p. 202; mapping is our own). */
export const spandaKarikaSubjectIndexEn: KarikaTermIndexEntry[] = [
  { term: "Absolute as throb (Spanda-svarūpa)", iast: "spanda-svarūpa", verseIds: ["SP-1.1", "SP-1.2", "SP-1.6", "SP-1.7", "SP-1.10"] },
  { term: "Emergence and submergence", iast: "unmeṣa-nimeṣa", verseIds: ["SP-1.1", "SP-1.22", "SP-1.24", "SP-1.25", "SP-3.8", "SP-3.9"] },
  { term: "Experient through states", iast: "anubhavitṛ", verseIds: ["SP-1.3", "SP-1.4", "SP-1.5", "SP-1.17", "SP-1.18"] },
  { term: "Refuting voidism", iast: "śūnya-khaṇḍana", verseIds: ["SP-1.12", "SP-1.13", "SP-1.14", "SP-1.15", "SP-1.16"] },
  { term: "Full and partial awakening", iast: "suprabuddha", verseIds: ["SP-1.8", "SP-1.9", "SP-1.11", "SP-1.17", "SP-1.18", "SP-1.21", "SP-1.23", "SP-1.25", "SP-3.12"] },
  { term: "Mantra-power", iast: "mantra-vīrya", verseIds: ["SP-2.1", "SP-2.2"] },
  { term: "Sahaja-vidyā and jīvanmukti", iast: "sahaja-vidyā", verseIds: ["SP-1.19", "SP-2.3", "SP-2.4", "SP-2.5", "SP-2.6", "SP-2.7"] },
  { term: "Powers (dream, hunger, omniscience)", iast: "vibhūti", verseIds: ["SP-3.1", "SP-3.2", "SP-3.3", "SP-3.4", "SP-3.5", "SP-3.6", "SP-3.7", "SP-3.10", "SP-3.11"] },
  { term: "Unmeṣa practice", iast: "unmeṣa", verseIds: ["SP-3.8", "SP-3.9", "SP-3.10", "SP-3.11", "SP-3.12"] },
  { term: "Bondage (words, fortress)", iast: "paśu-bandha", verseIds: ["SP-1.20", "SP-3.13", "SP-3.14", "SP-3.15", "SP-3.16", "SP-3.17", "SP-3.18"] },
  { term: "Lordship and close", iast: "cakreśvara", verseIds: ["SP-3.19", "SP-4.1", "SP-4.2"] },
  { term: "Breath and channels", iast: "prāṇa, nāḍī", verseIds: ["SP-1.24", "SP-1.25", "SP-3.2", "SP-3.10"] }
];
