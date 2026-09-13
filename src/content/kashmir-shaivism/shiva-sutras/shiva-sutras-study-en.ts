// Śiva-sūtra study layer: original word-by-word glosses (padārtha) and
// textual notes for this app. Glosses are freshly written one-line parses,
// not copies of Singh's per-word meanings. Variant notes summarize, in our
// own words, points Singh reports from Bhāskara's Vārttika or from the
// Vimarśinī's textual discussion — they are not quotations.
export interface SutraStudy {
  id: string;
  wordMeaning: string;
  variantNote?: string;
}

export const shivaSutrasStudyEn: Record<string, SutraStudy> = {
  "SS-1.1": { id: "SS-1.1", wordMeaning: "caitanyam = consciousness as sheer knowing-and-doing freedom; ātmā = the Self, one's own true nature." },
  "SS-1.2": { id: "SS-1.2", wordMeaning: "jñānam = limited, divided knowing; bandhaḥ = bondage, captivity." },
  "SS-1.3": { id: "SS-1.3", wordMeaning: "yoni-vargaḥ = the source-group of differentiation (Māyā and her brood of principles); kalā-śarīram = the body built of limited agency." },
  "SS-1.4": { id: "SS-1.4", wordMeaning: "jñāna-adhiṣṭhānam = the ground supporting all limited knowing; mātṛkā = the Mother, the alphabet-power behind words." },
  "SS-1.5": {
    id: "SS-1.5",
    wordMeaning: "udyamaḥ = upsurge, upward flight of awareness; bhairavaḥ = Bhairava, the awesome plenitude of consciousness.",
    variantNote: "Singh stresses, after Lakshman Joo, that udyama cannot mean strained exertion here: Section I teaches Śāmbhavopāya, which has no effort or object. Earlier English renderings as 'exertion' are the mistranslation his preface warns against."
  },
  "SS-1.6": { id: "SS-1.6", wordMeaning: "śakti-cakra-sandhāne = on union with the circle of powers (senses and their goddesses); viśva-saṃhāraḥ = reabsorption of the universe into awareness." },
  "SS-1.7": { id: "SS-1.7", wordMeaning: "jāgrat-svapna-suṣupti-bhede = amid the divisions of waking, dream and deep sleep; turya-ābhoga-sambhavaḥ = the dawning of the Fourth's enjoyment." },
  "SS-1.8": { id: "SS-1.8", wordMeaning: "jñānam = (here) outer sense-based knowing; jāgrat = the waking state." },
  "SS-1.9": { id: "SS-1.9", wordMeaning: "svapnaḥ = dream; vikalpāḥ = thought-constructs, fancies." },
  "SS-1.10": { id: "SS-1.10", wordMeaning: "avivekaḥ = non-discernment of the Self; māyā-sauṣuptam = the deep sleep belonging to Māyā." },
  "SS-1.11": { id: "SS-1.11", wordMeaning: "tritaya-bhoktā = enjoyer of the three states as one savour; vīra-īśaḥ = lord of the heroes (master of the senses as powers)." },
  "SS-1.12": { id: "SS-1.12", wordMeaning: "vismayaḥ = wonder, astonished delight; yoga-bhūmikāḥ = the stages of yoga." },
  "SS-1.13": { id: "SS-1.13", wordMeaning: "icchā-śaktiḥ = the power of Will; umā kumārī = Umā the Maiden — pure, untouched creativeness." },
  "SS-1.14": { id: "SS-1.14", wordMeaning: "dṛśyam = everything seen, the perceivable; śarīram = (his) body." },
  "SS-1.15": { id: "SS-1.15", wordMeaning: "hṛdaye = in the Heart (central consciousness); citta-saṅghaṭṭāt = by the dashing together of the mind with it; dṛśya-svāpa-darśanam = seeing of phenomena and of the void as they are." },
  "SS-1.16": { id: "SS-1.16", wordMeaning: "śuddha-tattva-sandhānāt = by union with the pure Principle; vā = or (an alternative); apaśu-śaktiḥ = freedom from the binding power of animal (limited) existence." },
  "SS-1.17": { id: "SS-1.17", wordMeaning: "vitarkaḥ = ripened conclusive conviction, the one pure thought; ātma-jñānam = knowledge of the Self." },
  "SS-1.18": { id: "SS-1.18", wordMeaning: "loka-ānandaḥ = the delight beings find in the world; samādhi-sukham = the bliss of absorption." },
  "SS-1.19": { id: "SS-1.19", wordMeaning: "śakti-sandhāne = on union with Power; śarīra-utpattiḥ = production of a (desired) body." },
  "SS-1.20": { id: "SS-1.20", wordMeaning: "bhūta-sandhāna = uniting elements; bhūta-pṛthaktva = separating them; viśva-saṅghaṭṭāḥ = gatherings-together of all that is divided." },
  "SS-1.21": { id: "SS-1.21", wordMeaning: "śuddha-vidyā-udayāt = from the dawn of pure wisdom (balanced I–This); cakra-īśatva-siddhiḥ = attainment of lordship over the circle (of powers)." },
  "SS-1.22": { id: "SS-1.22", wordMeaning: "mahā-hrada-anusandhānāt = by immersion in the great lake (of consciousness); mantra-vīrya-anubhavaḥ = experience of mantra-potency." },
  "SS-2.1": { id: "SS-2.1", wordMeaning: "cittam = the mind (reflecting without break on the Real); mantraḥ = mantra, thought that protects and liberates." },
  "SS-2.2": { id: "SS-2.2", wordMeaning: "prayatnaḥ = zealous, loving effort; sādhakaḥ = the accomplisher (that which gets the work done)." },
  "SS-2.3": { id: "SS-2.3", wordMeaning: "vidyā-śarīra-sattā = the Being whose body is pure wisdom; mantra-rahasyam = the secret essence of mantra." },
  "SS-2.4": { id: "SS-2.4", wordMeaning: "garbhe = in the womb (of Māyā, gestating limited powers); citta-vikāsaḥ = delight/expansion of the mind; aviśiṣṭa-vidyā-svapnaḥ = dream born of inferior knowledge." },
  "SS-2.5": { id: "SS-2.5", wordMeaning: "vidyā-samutthāne = on the rising of (supreme) wisdom; svābhāvike = spontaneous, natural to oneself; khecarī = moving in the void; śiva-avasthā = Śiva's own condition." },
  "SS-2.6": { id: "SS-2.6", wordMeaning: "guruḥ = the teacher, the one who reveals; upāyaḥ = the means." },
  "SS-2.7": { id: "SS-2.7", wordMeaning: "mātṛkā-cakra-sambodhaḥ = enlightenment regarding the circle of the Mothers (the letter-powers). Singh's longest note: the 'a'-to-'ha' alphabet as a pantheon structuring all experience." },
  "SS-2.8": { id: "SS-2.8", wordMeaning: "śarīram = the body; haviḥ = the oblation poured into the fire." },
  "SS-2.9": {
    id: "SS-2.9",
    wordMeaning: "jñānam = (here) limited, dualistic knowing; annam = food, what is eaten up.",
    variantNote: "Singh records two readings of jñāna here: the Vimarśinī's main sense (limited knowledge devoured by awakened awareness) and Bhāskara's alternative, where jñāna is Self-knowledge and annam is the food that fully satisfies."
  },
  "SS-2.10": {
    id: "SS-2.10",
    wordMeaning: "vidyā-saṃhāre = on the withdrawal of pure wisdom; tat-uttha-svapna-darśanam = seeing of dream-like agitation rising from that lapse.",
    variantNote: "Bhāskara reads this sūtra differently, as Singh notes: when worldly common knowledge dissolves in Self-realization, the old delusive object-knowledge is remembered only as a dream is remembered."
  },
  "SS-3.1": { id: "SS-3.1", wordMeaning: "ātmā = (here, on this lower path) what counts as self; cittam = the conditioned mind-complex." },
  "SS-3.2": { id: "SS-3.2", wordMeaning: "jñānam = mind-born, object-directed knowing; bandhaḥ = bondage — the same diagnosis as 1.2, one octave lower." },
  "SS-3.3": { id: "SS-3.3", wordMeaning: "kalā-ādīnām tattvānām = of the principles beginning with Kalā; avivekaḥ = failure to discriminate (them from the Self); māyā = Māyā, the measurer." },
  "SS-3.4": { id: "SS-3.4", wordMeaning: "śarīre = within the body; saṃhāraḥ = dissolution, reabsorption; kalānām = of the parts (the tattvas)." },
  "SS-3.5": { id: "SS-3.5", wordMeaning: "nāḍī-saṃhāra = gathering of the currents in the channels; bhūta-jaya = conquest of the elements; bhūta-kaivalya = isolation from them; bhūta-pṛthaktva = standing apart from them." },
  "SS-3.6": { id: "SS-3.6", wordMeaning: "moha-āvaraṇāt = from the veil of delusion itself; siddhiḥ = (so-called) accomplishment, powers." },
  "SS-3.7": { id: "SS-3.7", wordMeaning: "moha-jayāt = by conquest of delusion; ananta-ābhogāt = through infinite, total absorption; sahaja-vidyā-jayaḥ = mastery of innate wisdom." },
  "SS-3.8": { id: "SS-3.8", wordMeaning: "jāgrat = awake; dvitīya-karaḥ = (while) the 'second' shines as (his own) radiance." },
  "SS-3.9": { id: "SS-3.9", wordMeaning: "nartakaḥ = dancer, actor; ātmā = the Self." },
  "SS-3.10": { id: "SS-3.10", wordMeaning: "raṅgaḥ = the stage; antara-ātmā = the inner self (subtle and causal frame)." },
  "SS-3.11": { id: "SS-3.11", wordMeaning: "prekṣakāṇi = spectators; indriyāṇi = the senses." },
  "SS-3.12": { id: "SS-3.12", wordMeaning: "dhī-vaśāt = through mastery of the higher intelligence; sattva-siddhiḥ = attainment of the inner luminous Being." },
  "SS-3.13": { id: "SS-3.13", wordMeaning: "siddhaḥ = established, accomplished fact; svatantra-bhāvaḥ = the state of absolute freedom." },
  "SS-3.14": { id: "SS-3.14", wordMeaning: "yathā tatra = as (it is) there, in one's own locus; tathā anyatra = so (it is) elsewhere." },
  "SS-3.15": { id: "SS-3.15", wordMeaning: "bīja-avadhānam = sustained attention upon the Seed (supreme Śakti)." },
  "SS-3.16": { id: "SS-3.16", wordMeaning: "āsana-sthaḥ = seated in the true Seat; sukham = easily, blissfully; hrade nimajjati = plunges into the lake." },
  "SS-3.17": { id: "SS-3.17", wordMeaning: "sva-mātrā-nirmāṇam = giving form according to the measure of one's own (consciousness); āpādayati = brings about, effects." },
  "SS-3.18": { id: "SS-3.18", wordMeaning: "vidyā-vināśe = on the destruction of (limited) knowledge; janma-vināśaḥ = destruction of (compulsive) rebirth." },
  "SS-3.19": { id: "SS-3.19", wordMeaning: "ka-varga-ādiṣu = in the ka-group and other letter-classes; māheśvarī-ādyāḥ = Māheśvarī and her sisters; paśu-mātaraḥ = mothers of the bound." },
  "SS-3.20": { id: "SS-3.20", wordMeaning: "triṣu = into the three (states); caturtham = the Fourth; tailavat = like oil, in an unbroken thread; āsecyam = should be poured." },
  "SS-3.21": { id: "SS-3.21", wordMeaning: "magnaḥ = immersed; sva-cittena = with one's own (thought-free) mind; praviśet = one should enter." },
  "SS-3.22": { id: "SS-3.22", wordMeaning: "prāṇa-samācāre = when the vital energy spreads evenly; sama-darśanam = equal seeing." },
  "SS-3.23": { id: "SS-3.23", wordMeaning: "madhye = in the interval (between absorptions); avara-prasavaḥ = birth of inferior (mental states)." },
  "SS-3.24": { id: "SS-3.24", wordMeaning: "mātrāsu = in each measured object; sva-pratyaya-sandhāne = on uniting with one's own subject-awareness; naṣṭasya punar-utthānam = the rising again of what was lost." },
  "SS-3.25": { id: "SS-3.25", wordMeaning: "śiva-tulyaḥ = equal to Śiva; jāyate = becomes, is born (as)." },
  "SS-3.26": { id: "SS-3.26", wordMeaning: "śarīra-vṛttiḥ = continuing to dwell in the body; vratam = sacred vow." },
  "SS-3.27": { id: "SS-3.27", wordMeaning: "kathā = ordinary talk; japaḥ = mantra-repetition." },
  "SS-3.28": { id: "SS-3.28", wordMeaning: "dānam = gift, charity; ātma-jñānam = Self-knowledge." },
  "SS-3.29": {
    id: "SS-3.29",
    wordMeaning: "yaḥ = whoever; avipasthaḥ = established (among the powers, not tossed by them); jñā-hetuḥ ca = is also a means of wisdom.",
    variantNote: "Avipastha parses as avi (the circle of powers) + pastha (stationed): establishment itself authorizes teaching. Singh notes this democratizes the guru-principle of 2.6 — standing, not office, transmits."
  },
  "SS-3.30": { id: "SS-3.30", wordMeaning: "sva-śakti-pracayaḥ = the expansion of one's own power; asya = of him; viśvam = the universe." },
  "SS-3.31": { id: "SS-3.31", wordMeaning: "sthiti-layau = maintenance and dissolution — two words completing the five cosmic acts with 3.30." },
  "SS-3.32": { id: "SS-3.32", wordMeaning: "tat-pravṛttau api = even while those (world-processes) go on; anirāsaḥ = no break, no expulsion; saṃvettṛ-bhāvāt = because of abiding as the Knower." },
  "SS-3.33": { id: "SS-3.33", wordMeaning: "sukha-duḥkhayoḥ = of pleasure and pain; bahir-mananam = contemplating as outer." },
  "SS-3.34": { id: "SS-3.34", wordMeaning: "tat-vimuktaḥ tu = but wholly free from them; kevalī = the Alone, aloneness as fullness." },
  "SS-3.35": { id: "SS-3.35", wordMeaning: "moha-pratisaṃhataḥ tu = but one compacted into a mass by delusion; karma-ātmā = identified with action (and its fruits)." },
  "SS-3.36": { id: "SS-3.36", wordMeaning: "bheda-tiraskāre = when difference is pushed aside; sarga-antara-karmatvam = the power to author an entirely other creation." },
  "SS-3.37": { id: "SS-3.37", wordMeaning: "karaṇa-śaktiḥ = the creative power of the senses; svataḥ-anubhavāt = from one's own direct experience." },
  "SS-3.38": { id: "SS-3.38", wordMeaning: "tri-padādi = the three states and the rest; anuprāṇanam = enlivening, breathing-into (by the foremost, the Fourth)." },
  "SS-3.39": { id: "SS-3.39", wordMeaning: "citta-sthitivat = as with states of mind; śarīra-karaṇa-bāhyeṣu = in body, senses and externals (likewise to be vivified)." },
  "SS-3.40": { id: "SS-3.40", wordMeaning: "abhilāṣāt = from craving born of want; bahir-gatiḥ = outward-going; saṃvāhyasya = of the one to be carried across (lives)." },
  "SS-3.41": { id: "SS-3.41", wordMeaning: "tat-ārūḍha-pramiteḥ = of awareness mounted in That; tat-kṣayāt = with the wearing away of that (craving); jīva-saṅkṣayaḥ = dissolution of limited soul-hood." },
  "SS-3.42": { id: "SS-3.42", wordMeaning: "bhūta-kañcukī = wearing the elements as a cloak; tadā vimuktaḥ = then fully freed; bhūyaḥ pati-samaḥ paraḥ = pre-eminently equal to the Lord, perfect, full." },
  "SS-3.43": { id: "SS-3.43", wordMeaning: "naisargikaḥ = natural, self-arising; prāṇa-sambandhaḥ = the link of vital energy (with the body)." },
  "SS-3.44": { id: "SS-3.44", wordMeaning: "nāsikā-antar-madhya-saṃyamāt = by sustained awareness of the centre within the breath-flow; kim atra = what more (need be said) here; savya-apasavya-sauṣumneṣu = regarding left, right and middle channels (transcended)." },
  "SS-3.45": { id: "SS-3.45", wordMeaning: "bhūyaḥ = again and again; syāt = there is; pratimīlanam = re-closing (in recognition, inner and outer united)." }
};
