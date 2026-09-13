// Spanda-kārikā study layer: original word-by-word glosses and textual notes.
// Glosses are freshly written parses, not copies of Singh's per-word meanings.
// Variant notes summarize, in our own words, commentarial points Singh reports
// (Kṣemarāja's Krama reading, Kallaṭa's Vṛtti, recension differences) — not
// quotations.
export interface KarikaStudy {
  id: string;
  wordMeaning: string;
  variantNote?: string;
}

export const spandaKarikaStudyEn: Record<string, KarikaStudy> = {
  "SP-1.1": {
    id: "SP-1.1",
    wordMeaning: "yasya unmeṣa-nimeṣābhyām = by whose opening and closing (of the eyes); jagataḥ pralaya-udayau = the world's dissolution and emergence; tam … śaṅkaram stumaḥ = Him, Śaṅkara, we laud; śakti-cakra-vibhava-prabhavam = source of the glorious circle of powers.",
    variantNote: "Singh reports Kṣemarāja reading śakti-cakra-vibhava-prabhava through the Krama (Mahārtha) lens: the circle's glory as fivefold functioning through deities like Sṛṣṭi and Raktā Kālī — creation, maintenance, absorption and the indefinable state as play."
  },
  "SP-1.2": { id: "SP-1.2", wordMeaning: "yatra sthitam idaṃ sarvam = in which all this rests; kāryam = effect; yasmāt nirgatam = from which issued; tasya anāvṛta-rūpatvāt = because its form is uncovered; na nirodhaḥ kutracit = no obstruction anywhere." },
  "SP-1.3": { id: "SP-1.3", wordMeaning: "jāgrat-ādi-vibhede'pi = even amid waking and the rest's divisions; tat abhinne prasarpati = it flows on undivided; upalabdṛtaḥ = from Experient-hood; na nivartate nijāt svabhāvāt = never departs from its own nature." },
  "SP-1.4": { id: "SP-1.4", wordMeaning: "aham sukhī duḥkhī raktaḥ = I happy, suffering, attached; iti-ādi-saṃvidaḥ = such cognitions; sukha-ādi-avasthā-anusyūte = strung upon pleasure-states; anyatra vartante = rest elsewhere." },
  "SP-1.5": { id: "SP-1.5", wordMeaning: "yatra na duḥkham na sukham = where neither pain nor pleasure; na grāhyam na grāhakam = neither object nor subject; na mūḍhabhāvaḥ = nor insentience; tat paramārthataḥ asti = that exists ultimately." },
  "SP-1.6": { id: "SP-1.6", wordMeaning: "yataḥ = from which; ayam karaṇa-vargaḥ vimūḍhaḥ = this insentient sense-host; amūḍhavat svayam = as if sentient itself; sahāntareṇa cakreṇa = with the inner circle; pravṛtti-sthiti-saṃhṛtiḥ = going-forth, holding, withdrawal." },
  "SP-1.7": { id: "SP-1.7", wordMeaning: "tat-prayatnena ādarāt parīkṣyam = to be examined with zealous reverence; tat tattvam labhate = one attains that principle; tasya svatantratā = its freedom; sarvatra akṛtrimā = everywhere unfabricated." },
  "SP-1.8": { id: "SP-1.8", wordMeaning: "ayam = this (Spanda); na vartate = does not function; icchā-nodanasya prerakatvena = as mere prompter of (empirical) desire; api tu = but rather; ātma-bala-sparśāt = by contact with Self-strength; puruṣaḥ tat-samaḥ bhavet = the person becomes equal to That." },
  "SP-1.9": { id: "SP-1.9", wordMeaning: "nija-aśuddhi-asamarthasya = for one incapable through own impurity; kartavyeṣu abhilāṣiṇaḥ = yet desiring what must be done; yadā kṣobhaḥ pralīyeta = when agitation dissolves; tadā paramam padam syāt = then the supreme state." },
  "SP-1.10": { id: "SP-1.10", wordMeaning: "tadā asya akṛtrimaḥ dharmaḥ = then his unfabricated nature; jñatva-kartṛtva-lakṣaṇaḥ = marked by knowing-doing; yataḥ tat-epsitam sarvam = for whatever desired; jānāti ca karoti ca = he knows and effects." },
  "SP-1.11": { id: "SP-1.11", wordMeaning: "tam svabhāvam = that own nature; adhiṣṭhātṛ-bhāvena avalokayan = beholding as presiding principle; smayamāna iva āste = seated as if smiling; tasya iyam kusṛtiḥ kutaḥ = whence this wretched transmigration for him?" },
  "SP-1.12": { id: "SP-1.12", wordMeaning: "abhāvaḥ = non-being; na bhāvyatām eti = cannot become meditated object; na amūḍhatā = nor insentience; yataḥ abhiyoga-saṃsparśāt = for by sustained application; tat āsīt iti niścayaḥ = certainty 'it was'." },
  "SP-1.13": { id: "SP-1.13", wordMeaning: "ataḥ tat kṛtrimam jñeyam = hence that is known as fabricated; sauṣupta-pada-vat sadā = like the sleep-state, always; smaryamāṇatvam = being-remembered; na tattattvam pratipadyate = cannot be the principle." },
  "SP-1.14": { id: "SP-1.14", wordMeaning: "atra avasthā-yugalam = here the pair of states; kārya-kartṛtva-śabditam = called effect and agent; kāryatā kṣayiṇī = effect-hood perishable; kartṛtvam akṣayam = agency imperishable." },
  "SP-1.15": { id: "SP-1.15", wordMeaning: "kārya-unmukhaḥ prayatnaḥ = effort turned to effects; kevalam lupyate = alone disappears; tasmin lupte = on its lapse; viluptaḥ asmi iti = 'I am lost' — thus; abudhaḥ pratipadyate = the unawakened concludes." },
  "SP-1.16": { id: "SP-1.16", wordMeaning: "yaḥ antarmukhaḥ bhāvaḥ = the inward-turned Being; sarvajñatva-guṇa-āspadam = seat of omniscience; tasya lopaḥ kadācit na syāt = its lapse never; anyasya anupalambhanāt = since no other perceives it." },
  "SP-1.17": { id: "SP-1.17", wordMeaning: "tasya upalabdhiḥ = its perception; satatam tri-pada-avyabhicāriṇī = unbroken across three states; nityam suprabuddhasya = ever, of the fully awakened; tu parasya = but for the other; tat-ādi-ante = at their beginning and end." },
  "SP-1.18": { id: "SP-1.18", wordMeaning: "jñāna-jñeya-svarūpiṇyā paramayā śaktyā yutaḥ = joined with supreme Power of knowledge-object form; pada-dvaye vibhuḥ bhāti = in two states the All-pervading shines; tat-anyatra cinmayaḥ = elsewhere, sheer consciousness." },
  "SP-1.19": { id: "SP-1.19", wordMeaning: "guṇa-ādi-spanda-niḥṣyandāḥ = throbs from guṇas onward; sāmānya-spanda-saṃśrayāt = rooted in universal Spanda; labdha-ātma-lābhāḥ = gained as Self-gain; jñasya aparipanthinaḥ = unobstructing to the knower; satatam syuḥ = ever abide." },
  "SP-1.20": { id: "SP-1.20", wordMeaning: "aprabuddha-dhiyaḥ tu = but for unawakened minds; ete = these same; sva-sthiti-sthagana-udyatāḥ = bent on covering true station; pātayanti = hurl; duruttāre ghore saṃsāra-vartmani = onto dread hard-to-cross transmigration-path." },
  "SP-1.21": { id: "SP-1.21", wordMeaning: "ataḥ satatam udyuktaḥ = hence ever yoked; spanda-tattva-viviktaye = to discriminate Spanda-principle; jāgrat eva = while awake itself; nijam bhāvam = own Being; acireṇa adhigacchati = swiftly attains." },
  "SP-1.22": {
    id: "SP-1.22",
    wordMeaning: "ati-kruddhaḥ prahṛṣṭaḥ vā = intensely enraged or delighted; kim karomi iti mṛśan = pausing 'what shall I do'; dhāvan vā = or running; yat padam gacchet = whatever station reached; tatra spandaḥ pratiṣṭhitaḥ = there Spanda established.",
    variantNote: "Singh relays Kallaṭa's gloss treating unmeṣa and nimeṣa together as by mere will, plus the conspectus-verse definition: unmeṣa is the cessation of the prior idea that causes the next to rise — no next thought without the previous one's ending."
  },
  "SP-1.23": { id: "SP-1.23", wordMeaning: "yām avasthām samālambya = resting on whatever state; yat ayam mama vakṣyati = whatever this (Self) declares to me; tat avaśyam kariṣye aham = that I shall surely do; iti saṅkalpya tiṣṭhati = thus resolving, abides." },
  "SP-1.24": { id: "SP-1.24", wordMeaning: "tām āśritya = resting on that; ūrdhva-mārgeṇa = by the upper path; candra-sūryau ubhau api = both moon and sun; sauṣumne'dhvani astamitaḥ = set in suṣumnā's course; hitvā brahmāṇḍa-gocaram = leaving the brahmāṇḍa-realm." },
  "SP-1.25": { id: "SP-1.25", wordMeaning: "tadā tasmin mahāvyomni = then in that great void; pralīna-śaśi-bhāskare = where moon and sun dissolved; sauṣupta-pada-vat mūḍhaḥ = like sleep-state, the deluded; prabuddhaḥ anāvṛtaḥ syāt = the awakened, unveiled." },
  "SP-2.1": { id: "SP-2.1", wordMeaning: "tat balam ākramya = seizing that strength; mantrāḥ sarvajña-bala-śālinaḥ = mantras endowed with omniscience-power; pravartante adhikārāya = proceed to office; karaṇāni iva dehinām = like senses of the embodied." },
  "SP-2.2": { id: "SP-2.2", wordMeaning: "tatra eva sampralīyante = dissolve there itself; śānta-rūpāḥ nirañjanāḥ = peaceful, stainless; saha ārādhaka-cittena = with worshipper's mind; tena ete śiva-dharmiṇaḥ = hence of Śiva's nature." },
  "SP-2.3": { id: "SP-2.3", wordMeaning: "yasmāt jīvaḥ sarvamayaḥ = since the jīva is all-made; sarva-bhāva-samudbhavāt = born of all entities; tat-saṃvedana-rūpeṇa = in the form of their awareness; tādātmya-pratipattitaḥ = through identity-apprehension." },
  "SP-2.4": { id: "SP-2.4", wordMeaning: "tasmāt śabda-artha-cintāsu = hence in word-meaning reflections; na sā avasthā = no state; na yā śivaḥ = that is not Śiva; bhoktā eva = the Enjoyer itself; bhogya-bhāvena = as the enjoyed; sadā sarvatra saṃsthitaḥ = ever everywhere abides." },
  "SP-2.5": { id: "SP-2.5", wordMeaning: "yasya saṃvittiḥ = whose awareness; akhilam jagat krīḍātvena = the whole world as play; iti vā = thus indeed; saḥ paśyan = he, seeing; satatam yuktaḥ = ever yoked; jīvanmuktaḥ na saṃśayaḥ = liberated alive, no doubt." },
  "SP-2.6": { id: "SP-2.6", wordMeaning: "ayam eva udayaḥ = this itself the dawn; tasya dhyeyasya = of the meditated; dhyāyi-cetasi = in meditator's mind; yā tad-ātmatā-samāpattiḥ = which is identity-attainment; icchataḥ sādhakasya = of the desiring practitioner." },
  "SP-2.7": { id: "SP-2.7", wordMeaning: "iyam eva amṛta-prāptiḥ = this itself immortality-attainment; ayam eva ātmanaḥ grahaḥ = this itself Self-grasp; iyam nirvāṇa-dīkṣā = this the liberating initiation; ca śiva-sadbhāva-dāyinī = granting Śiva's true Being." },
  "SP-3.1": { id: "SP-3.1", wordMeaning: "yathā icchā-abhyarthitaḥ dhātā = as the Ordainer entreated by desire; jāgrataḥ dehinaḥ = for the waking embodied; hṛdi sthitān arthān = heart-resting objects; soma-sūrya-udayam kṛtvā = causing moon-sun rise; sampādayati = brings about." },
  "SP-3.2": { id: "SP-3.2", wordMeaning: "tathā svapne api = so too in dream; abhīṣṭa-arthān = desired objects; praṇayasya anatikkramāt = without transgressing affection; madhye sthitaḥ = stationed in centre; nityam sphuṭataram = ever most vividly; avaśyam prakāśayet = must reveal." },
  "SP-3.3": { id: "SP-3.3", wordMeaning: "anyathā tu = otherwise; sṛṣṭiḥ svatantrā syāt = creation would be independent; tat-dharmakatvataḥ = of that (alien) nature; laukikasya iva = like the worldling's; satatam jāgrat-svapna-pada-dvaye = constantly, in both states." },
  "SP-3.4": { id: "SP-3.4", wordMeaning: "yathā hi arthaḥ asphuṭaḥ dṛṣṭaḥ = as a dimly seen object; sāvadhāne api cetasi = even by attentive mind; bhūyaḥ sphuṭataraḥ bhāti = shines most vivid again; sva-bala-udyoga-bhāvitaḥ = contemplated with own power's exertion." },
  "SP-3.5": { id: "SP-3.5", wordMeaning: "tathā yat paramārthena = so whatever in essence; yena yatra yathā sthitam = by whom, where, how situated; tat tathā = that, exactly so; balam ākramya = seizing power; na cirāt sampravartate = before long comes about." },
  "SP-3.6": { id: "SP-3.6", wordMeaning: "durbalaḥ api = even the weak; tat ākramya = seizing That; yataḥ kārye pravartate = since prevail in task; tathā yaḥ ati-bubhukṣitaḥ = so the very hungry; bubhukṣām ācchādayet = may cover hunger." },
  "SP-3.7": { id: "SP-3.7", wordMeaning: "anena adhiṣṭhite dehe = when this presides over body; yathā sarvajñatā-ādayaḥ = as omniscience etc.; tathā sva-ātmani adhiṣṭhānāt = so by presiding in own Self; sarvatra evam bhaviṣyati = everywhere so it shall be." },
  "SP-3.8": { id: "SP-3.8", wordMeaning: "glāniḥ viluṇṭhikā = depression, the plunderer; dehe = in the body; tasyāḥ ajñānataḥ sṛtiḥ = its flow from ignorance; tat unmeṣa-viluptam cet = if wiped by unmeṣa; kutaḥ sā syāt ahetukā = whence the causeless?" },
  "SP-3.9": { id: "SP-3.9", wordMeaning: "eka-cintā-prasaktasya = for one fixed on single thought; yataḥ apara-udayaḥ syāt = whence another's rise; saḥ unmeṣaḥ vijñeyaḥ = that is known as unmeṣa; svayam tam upalakṣayet = one should mark it oneself." },
  "SP-3.10": { id: "SP-3.10", wordMeaning: "ataḥ binduḥ = hence bindu-light; ataḥ nādaḥ = hence (inner) sound; asmāt rūpam = hence form; ataḥ rasaḥ = hence taste; pravartante acireṇa eva = soon arise; kṣobhakatvena dehinaḥ = as agitators of the embodied." },
  "SP-3.11": { id: "SP-3.11", wordMeaning: "didṛkṣayā iva = as if desiring to see; sarva-arthān vyāpya avatiṣṭhate = abiding pervading all things; yadā = when; tadā kim bahunā uktena = then what need of much talk; svayam eva avabhotsyate = one shall know by oneself." },
  "SP-3.12": { id: "SP-3.12", wordMeaning: "prabuddhaḥ sarvadā tiṣṭhet = ever awake abide; jñānena ālokya gocaram = perceiving the field with knowledge; sarvam ekatra āropayet = mounting all upon the One; tataḥ anyena na pīḍyate = then by no other oppressed." },
  "SP-3.13": { id: "SP-3.13", wordMeaning: "śabda-rāśi-samutthasya śakti-vargasya = of the power-host born of word-mass; bhogyatām gataḥ san = fallen to being-enjoyed; kalā-vilupta-vibhavaḥ = glory eclipsed by kalā; saḥ paśuḥ smṛtaḥ = he is called bound soul." },
  "SP-3.14": { id: "SP-3.14", wordMeaning: "para-amṛta-rasa-apāyaḥ = robbery of supreme nectar-taste; tasya yaḥ pratyaya-udbhavaḥ = the idea-rise that is; tena asvatantratām eti = by it meets unfreedom; saḥ tanmātra-gocaraḥ = ranging only sense-objects." },
  "SP-3.15": { id: "SP-3.15", wordMeaning: "asya svarūpa-āvaraṇe = in covering his true form; śaktayaḥ satata-utthitāḥ = the powers ever risen; yataḥ śabda-anuvedhena vinā = for without word-penetration; na pratyaya-udbhavaḥ = no idea arises." },
  "SP-3.16": { id: "SP-3.16", wordMeaning: "sā iyam kriyā-ātmikā śaktiḥ = this same active Power; śivasya paśu-vartinī = of Śiva, coursing in the bound; bandhayitrī sva-mārga-sthā = binding when on own course; jñātā siddhi-upapādikā = known, perfection-granting." },
  "SP-3.17": { id: "SP-3.17", wordMeaning: "tanmātra-udaya-rūpeṇa = in form rising from sense-potentials; manaḥ-aham-buddhi-vartinā = operating in mind-ego-intellect; puryaṣṭakena saṃruddhaḥ = besieged by eightfold fortress; tat-uttham pratyaya-udbhavam (bhuṅkte) = (undergoes) its idea-births." },
  "SP-3.18": { id: "SP-3.18", wordMeaning: "bhuṅkte paravaśaḥ bhogam = subservient, undergoes enjoyment; tat-bhāvāt saṃsaret = identified with it, transmigrates; ataḥ = hence; asya saṃsṛti-pralayasya kāraṇam = cause of this transmigration's dissolution; sampracakṣmahe = we declare." },
  "SP-3.19": { id: "SP-3.19", wordMeaning: "yadā tu ekatra saṃrūḍhaḥ = but when rooted in the One; tadā tasya laya-udayau niyacchan = then controlling its dissolution-emergence; bhoktṛtām eti = attains enjoyership; tataḥ cakreśvaraḥ bhavet = thence lord of the circle." },
  "SP-4.1": { id: "SP-4.1", wordMeaning: "agādha-saṃśaya-ambhodhi-samuttaraṇa-tāriṇīm = ferrying across fathomless doubt-ocean; vicitra-artha-padām = manifold in sense and syllable; citrām = wondrous; tām guru-bhāratīm vande = that guru-Word I salute." },
  "SP-4.2": {
    id: "SP-4.2",
    wordMeaning: "labdhvā api alabhyam etat jñāna-dhanam = having obtained even this unattainable knowledge-treasure; hṛd-guhā-anta-kṛta-nihiteḥ = well secured in heart's cave; vasuguptavat = as for Vasugupta; śivāya bhavati sadā sarvalokasya = may it ever be for all the world's welfare.",
    variantNote: "Singh notes this treasure-verse is absent from the recensions of Bhaṭṭa Utpala, Kallaṭa and Rāmakaṇṭha — the very verse on which the Vasugupta-authorship claim partly rests. Kallaṭa's own Vṛtti colophon instead says the Spanda-nectar was 'strung together' (dṛbdha) by revered Vasugupta while Kallaṭa merely publicized it."
  }
};
