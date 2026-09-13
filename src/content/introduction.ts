import { SupportedLanguage } from '../types/i18n';

// General introduction to Indian philosophy, organized after the classic
// pedagogical map (nine schools, common questions, means of knowledge).
// All prose below is original to this project; the Chatterjee & Datta
// textbook and Surendranath Dasgupta's _A History of Indian Philosophy_,
// Vols. I-IV (Cambridge: Vol. I Chs. I-X Vedas to Sankara Vedanta;
// Vol. II Ch. XI Sankara school continued, Ch. XII Yoga-Vasistha,
// Ch. XIII medical schools, Ch. XIV Gita; Vol. III Ch. XV Bhaskara,
// Ch. XVI Pancaratra, Ch. XVII Alvars, Chs. XVIII-XX Ramanuja school,
// Ch. XXI Nimbarka, Ch. XXII Vijnana Bhiksu, Ch. XXIII Puranas plus
// Vol. I appendix on Lokayata/Carvaka; Vol. IV Ch. XXIV Bhagavata-purana,
// Chs. XXV-XXVIII Madhva life, sutra-reading, philosophy and logic,
// Chs. XXIX-XXX dualist-monist controversy, Ch. XXXI Vallabha,
// Ch. XXXII Caitanya, Ch. XXXIII Jiva Gosvami and Baladeva) served only
// as structural reading aids. No sentences are borrowed from them.
// VARIANT RULE: where existing app content says "A is B" and Dasgupta
// records "A is C", both are preserved below as "A is B; in some sayings
// A is C, because ..." with the reason Dasgupta gives.

export interface IntroSchool {
  id: string;
  name: { en: string; ml?: string };
  stance: 'astika' | 'nastika';
  systemId?: string;
  summary: { en: string; ml?: string };
}

export interface IntroSection {
  id: string;
  title: { en: string; ml?: string };
  body: { en: string; ml?: string };
}

export const introSchools: IntroSchool[] = [
  {
    id: 'carvaka',
    name: { en: 'Cārvāka', ml: 'ചാർവാകം' },
    stance: 'nastika',
    summary: {
      en: 'The materialists: only perception counts, so there is no soul, no afterlife, no god — only the four elements combining and dissolving. Enjoyment wisely pursued is the whole of the good.',
      ml: 'ഭൗതികവാദികൾ: പ്രത്യക്ഷം മാത്രമാണ് പ്രമാണം; അതിനാൽ ആത്മാവില്ല, പരലോകമില്ല, ഈശ്വരനില്ല — നാല് ഭൂതങ്ങളുടെ കൂടിച്ചേരലും വേർപിരിയലും മാത്രം. വിവേകത്തോടെയുള്ള ഭോഗമാണ് ഏകപുരുഷാർത്ഥം.'
    }
  },
  {
    id: 'jaina',
    name: { en: 'Jaina', ml: 'ജൈനം' },
    stance: 'nastika',
    summary: {
      en: 'Reality has infinitely many faces: every judgment holds only relatively (syādvāda), in seven possible forms. Souls are real and innumerable, weighed down by karmic matter; rigorous non-harming and austerity shake it off.',
      ml: 'യാഥാർത്ഥ്യത്തിന് അനന്തമുഖങ്ങളുണ്ട്: ഓരോ വിധിയും ആപേക്ഷികം മാത്രം (സ്യാദ്വാദം), ഏഴ് രൂപങ്ങളിൽ. ആത്മാക്കൾ യഥാർത്ഥവും അസംഖ്യവുമാണ്; കർമ്മപദാർത്ഥത്താൽ ഭാരപ്പെട്ടവ; കഠിനമായ അഹിംസയും തപസ്സും അതിനെ കുടഞ്ഞുകളയുന്നു.'
    }
  },
  {
    id: 'bauddha',
    name: { en: 'Bauddha', ml: 'ബൗദ്ധം' },
    stance: 'nastika',
    summary: {
      en: 'Beginning from suffering and its twelve-linked arising, Buddhism denies a permanent self while affirming moral causation: everything composite perishes moment by moment, and craving\'s cessation is peace.',
      ml: 'ദുഃഖത്തിൽ നിന്നും അതിന്റെ ദ്വാദശാംഗപ്രതീത്യസമുത്പാദത്തിൽ നിന്നും തുടങ്ങുന്നു; സ്ഥിരാത്മാവിനെ നിഷേധിച്ച് ധാർമ്മികകാര്യകാരണത്വം സ്ഥാപിക്കുന്നു: സംസ്കൃതമായതെല്ലാം ക്ഷണംപ്രതി നശിക്കുന്നു; തൃഷ്ണാനിരോധം ശാന്തിയാണ്.'
    }
  },
  {
    id: 'nyaya',
    name: { en: 'Nyāya', ml: 'ന്യായം' },
    stance: 'astika',
    systemId: 'nyaya',
    summary: {
      en: 'The logicians: four instruments — perception, inference, comparison, testimony — tested through sixteen categories of debate. Right knowing must issue in fruitful action; liberation is true knowledge of the sixteen.',
      ml: 'താർക്കികർ: പ്രത്യക്ഷം, അനുമാനം, ഉപമാനം, ശബ്ദം എന്നീ നാല് പ്രമാണങ്ങൾ — പതിനാറ് പദാർത്ഥങ്ങളിലൂടെ പരീക്ഷിക്കുന്നു. ശരിയായ അറിവ് ഫലവത്തായ പ്രവൃത്തിയിൽ കലാശിക്കണം; പതിനാറിനെയും അറിയലാണ് മോചനം.'
    }
  },
  {
    id: 'vaisesika',
    name: { en: 'Vaiśeṣika', ml: 'വൈശേഷികം' },
    stance: 'astika',
    systemId: 'vaisesika',
    summary: {
      en: 'The atomists of categories: all that is sorts into substance, quality, motion, universal, particularity, inherence — and later, non-existence. Eternal atoms compose a moral world administered, in later thought, by God.',
      ml: 'പദാർത്ഥങ്ങളുടെ അണുവാദികൾ: ഉള്ളതെല്ലാം ദ്രവ്യം, ഗുണം, കർമ്മം, സാമാന്യം, വിശേഷം, സമവായം — പിന്നീട് അഭാവവും — എന്ന് തിരിയുന്നു. നിത്യപരമാണുക്കൾ ധാർമ്മികലോകം ചമയ്ക്കുന്നു.'
    }
  },
  {
    id: 'samkhya',
    name: { en: 'Sāṃkhya', ml: 'സാംഖ്യം' },
    stance: 'astika',
    systemId: 'samkhya',
    summary: {
      en: 'The enumerators: two ultimates — witnessing consciousness and active nature — whose proximity unfolds twenty-five principles from intellect down to earth. Suffering ends in discriminating the seer from the seen.',
      ml: 'എണ്ണുന്നവർ: സാക്ഷിയായ ബോധവും സജീവമായ പ്രകൃതിയും — രണ്ട് പരമങ്ങൾ; അവയുടെ സാമീപ്യം ബുദ്ധി മുതൽ ഭൂമി വരെ ഇരുപത്തിയഞ്ച് തത്ത്വങ്ങൾ വികസിപ്പിക്കുന്നു. ദ്രഷ്ടാവിനെ ദൃശ്യത്തിൽ നിന്ന് വേർതിരിച്ചറിയലിൽ ദുഃഖം അവസാനിക്കുന്നു.'
    }
  },
  {
    id: 'yoga',
    name: { en: 'Yoga', ml: 'യോഗം' },
    stance: 'astika',
    systemId: 'yoga',
    summary: {
      en: 'Sāṃkhya\'s method made practical: stilling the mind\'s fluctuations through practice and dispassion, uprooting the five afflictions along an eight-limbed path to the seer\'s isolation.',
      ml: 'സാംഖ്യതത്ത്വം പ്രായോഗികമാക്കുന്നു: അഭ്യാസവൈരാഗ്യങ്ങളാൽ ചിത്തവൃത്തികളുടെ നിരോധം; അഷ്ടാംഗപാതയിലൂടെ അഞ്ച് ക്ലേശങ്ങളെ പിഴുത് ദ്രഷ്ടാവിന്റെ കൈവല്യം.'
    }
  },
  {
    id: 'mimamsa',
    name: { en: 'Mīmāṃsā', ml: 'മീമാംസ' },
    stance: 'astika',
    systemId: 'mimamsa',
    summary: {
      en: 'The exegetes: the Veda is beginningless valid speech, and duty (dharma) is what it enjoins. Knowledge is intrinsically valid; ritual action, correctly understood and performed, carries its own unseen fruit.',
      ml: 'വ്യാഖ്യാതാക്കൾ: വേദം ആദിയില്ലാത്ത പ്രമാണവാക്യമാണ്; അത് വിധിക്കുന്നതാണ് ധർമ്മം. അറിവ് സ്വതഃപ്രമാണമാണ്; ശരിയായി മനസ്സിലാക്കി അനുഷ്ഠിക്കുന്ന കർമ്മം സ്വന്തം അദൃശ്യഫലം വഹിക്കുന്നു.'
    }
  },
  {
    id: 'vedanta',
    name: { en: 'Vedānta', ml: 'വേദാന്തം' },
    stance: 'astika',
    systemId: 'vedanta',
    summary: {
      en: 'The end of the Veda: Upaniṣadic sentences converge on one reality — Brahman, self-luminous awareness — apparently veiled by beginningless ignorance. Inquiry, reflection and absorption remove the veil.',
      ml: 'വേദാന്തം: ഔപനിഷദവാക്യങ്ങൾ ഒരേ യാഥാർത്ഥ്യത്തിൽ — സ്വയംപ്രകാശമായ ബോധമായ ബ്രഹ്മത്തിൽ — ഒത്തുചേരുന്നു; ആദിയില്ലാത്ത അജ്ഞാനം അതിനെ മറയ്ക്കുന്നു. ശ്രവണം, മനനം, നിദിധ്യാസനം എന്നിവ മൂടുപടം നീക്കുന്നു.'
    }
  }
];

export const introSections: IntroSection[] = [
  {
    id: 'what-is-darshana',
    title: { en: 'Why “vision,” not “theory”?', ml: 'സിദ്ധാന്തമല്ല, “ദർശനം” എന്തിന്?' },
    body: {
      en: 'India’s schools call themselves darśanas — seeings. A philosophy here is not a hypothesis to admire but an instrument to look through: it must diagnose suffering, prescribe a method, and deliver the seer to freedom. Every system below is therefore judged, by its own standard, on whether acting on it works.',
      ml: 'ഭാരതീയ ശാഖകൾ സ്വയം ദർശനങ്ങൾ — കാഴ്ചകൾ — എന്ന് വിളിക്കുന്നു. ഇവിടെ തത്ത്വചിന്ത ആരാധിക്കാനുള്ള ഊഹമല്ല, നോക്കാനുള്ള ഉപകരണമാണ്: ദുഃഖം നിർണ്ണയിക്കണം, മാർഗ്ഗം നിർദ്ദേശിക്കണം, കാണുന്നവനെ മോചനത്തിലെത്തിക്കണം. താഴെയുള്ള ഓരോ വ്യവസ്ഥയും അതിന്റെ സ്വന്തം മാനദണ്ഡത്തിൽ — പ്രവർത്തിച്ചാൽ ഫലിക്കുന്നുണ്ടോ എന്നതിൽ — പരീക്ഷിക്കപ്പെടുന്നു.'
    }
  },
  {
    id: 'common-ground',
    title: { en: 'What all the schools share', ml: 'എല്ലാ ശാഖകളും പങ്കിടുന്നത്' },
    body: {
      en: 'Beneath their quarrels the systems breathe common air: life as ordinarily lived is pervaded by unrest; actions ripen into unseen consequences that outlive the body; birth repeats until ignorance lifts; and liberation — ending the cycle by right knowing — is the highest human aim. They differ on what exactly binds and what exactly frees, never on whether the question matters.',
      ml: 'തർക്കങ്ങൾക്കടിയിൽ വ്യവസ്ഥകൾ പൊതുവായ വായു ശ്വസിക്കുന്നു: സാധാരണ ജീവിതം അസ്വസ്ഥതയാൽ വ്യാപിച്ചിരിക്കുന്നു; പ്രവൃത്തികൾ ശരീരത്തെ അതിജീവിക്കുന്ന അദൃശ്യഫലങ്ങളായി പാകമാകുന്നു; അജ്ഞാനം നീങ്ങുന്നതുവരെ ജന്മം ആവർത്തിക്കുന്നു; ശരിയായ അറിവാൽ ചക്രം അവസാനിപ്പിക്കുന്ന മോചനമാണ് പരമപുരുഷാർത്ഥം. എന്താണ് ബന്ധിക്കുന്നത്, എന്താണ് മോചിപ്പിക്കുന്നത് എന്നതിൽ അവർ ഭിന്നിക്കുന്നു; ചോദ്യത്തിന് പ്രസക്തിയുണ്ടോ എന്നതിൽ ഒരിക്കലുമില്ല.'
    }
  },
  {
    id: 'pramanas-glance',
    title: { en: 'How they claim to know', ml: 'എങ്ങനെ അറിയാമെന്ന് അവകാശപ്പെടുന്നു' },
    body: {
      en: 'Every school must answer: by what instrument is anything known? Perception convinces all except none; inference divides them (the Cārvāka trusts it nowhere, Mīmāṃsā everywhere); comparison persuades Nyāya alone among the six; testimony carries scripture for all the āstikas and experience for the Buddhists and Jainas in their own idioms; postulation and non-apprehension win recognition school by school. Counting valid instruments is thus itself a philosophical position — the map of pramāṇas is the map of the debate.',
      ml: 'ഓരോ ശാഖയും ഉത്തരം പറയണം: എന്ത് ഉപകരണം കൊണ്ട് എന്തെങ്കിലും അറിയുന്നു? പ്രത്യക്ഷം എല്ലാവരെയും ബോധ്യപ്പെടുത്തുന്നു; അനുമാനം അവരെ ഭിന്നിപ്പിക്കുന്നു (ചാർവാകർ എവിടെയും വിശ്വസിക്കുന്നില്ല, മീമാംസകർ എല്ലായിടത്തും); ഉപമാനം ആറിൽ ന്യായത്തെ മാത്രം ബോധ്യപ്പെടുത്തുന്നു; ശബ്ദം ആസ്തികർക്ക് ശാസ്ത്രവും ബൗദ്ധജൈനർക്ക് സ്വന്തം ഭാഷയിൽ അനുഭവവും വഹിക്കുന്നു; അർത്ഥാപത്തിയും അനുപലബ്ധിയും ശാഖതോറും അംഗീകാരം നേടുന്നു. സാധുവായ ഉപകരണങ്ങൾ എണ്ണുന്നത് തന്നെ തത്ത്വനിലപാടാണ് — പ്രമാണഭൂപടം വാദത്തിന്റെ ഭൂപടമാണ്.'
    }
  },
  {
    id: 'how-to-use',
    title: { en: 'How to use this app', ml: 'ഈ ആപ്പ് എങ്ങനെ ഉപയോഗിക്കാം' },
    body: {
      en: 'Pick a school above to enter its system. Inside, every text offers three doors: Verses — the root lines with translation and commentary; Thread — a guided walk through its ideas in order; Concepts — the key terms, each tied to the verses that teach them. Start anywhere; the doors reconnect inside.',
      ml: 'മുകളിൽ ഒരു ശാഖ തിരഞ്ഞെടുത്ത് അതിന്റെ ദർശനത്തിൽ പ്രവേശിക്കൂ. അകത്ത് ഓരോ ഗ്രന്ഥവും മൂന്ന് വാതിലുകൾ നൽകുന്നു: ശ്ലോകങ്ങൾ — വിവർത്തനത്തോടും വ്യാഖ്യാനത്തോടും കൂടിയ മൂലവരികൾ; ചിന്താധാര — ആശയങ്ങളിലൂടെ ക്രമത്തിൽ നയിക്കുന്ന നടത്തം; ആശയങ്ങൾ — അവയെ പഠിപ്പിക്കുന്ന ശ്ലോകങ്ങളുമായി ബന്ധിപ്പിച്ച പ്രധാന പദങ്ങൾ. എവിടെ നിന്നും തുടങ്ങാം; വാതിലുകൾ അകത്ത് വീണ്ടും ചേരുന്നു.'
    }
  },
  {
    id: 'dasgupta-source',
    title: { en: 'Source note: Dasgupta Vols. I-IV' },
    body: {
      en: 'These sections distil Surendranath Dasgupta, A History of Indian Philosophy, Vols. I-IV (Cambridge University Press): Vol. I Chs. I-X (Vedas to Sankara Vedanta); Vol. II Ch. XI Sankara school continued, Ch. XII Yoga-Vasistha, Ch. XIII medical schools (Ayurveda), Ch. XIV Bhagavad-gita; Vol. III Ch. XV Bhaskara, Ch. XVI Pancaratra, Ch. XVII Alvars, Chs. XVIII-XX Ramanuja school (with Yamuna), Ch. XXI Nimbarka, Ch. XXII Vijnana Bhiksu, Ch. XXIII Puranas, plus the Vol. I appendix on Lokayata/Carvaka; Vol. IV Ch. XXIV Bhagavata-purana, Chs. XXV-XXVIII Madhva (life and school, Brahma-sutra reading, ontology/epistemology, logic), Chs. XXIX-XXX dualist-monist controversy (Vyasa-tirtha, Madhusudana, Ramacarya), Ch. XXXI Vallabha, Ch. XXXII Caitanya, Ch. XXXIII Jiva Gosvami and Baladeva Vidyabhusana. All wording here is our own paraphrase; nothing is copied. Rule followed throughout: existing app content is never overwritten. Where this app says "A is B" and Dasgupta records "A is C", both stand, phrased as "A is B; in some sayings A is C, because ..." with his reason given.'
    }
  },
  {
    id: 'dasgupta-introductory',
    title: { en: 'Why Indian philosophy is hard to study (Dasgupta Ch. I)' },
    body: {
      en: 'Dasgupta opens by confessing imperfect knowledge: a small body of retired Sanskrit scholars and ascetics knows the systems deeply but writes neither English nor popular vernaculars, while hundreds of Sanskrit works per school remain untranslated — scarcely a hundredth rendered. Translation itself misleads, because technical terms shift sense system by system (no dictionary fixes them), expression is extremely condensed sutra-style with hidden allusions to rival doctrines, and precision explodes from the 9th century into invented terminology presupposed without explanation. Study therefore required a teacher in a lineage, restricted to fit pupils (adhikarin) devoting life and conduct to truth — not popularisation. The two Sanskrit compendia (Madhava\'s Sarva-darsana-samgraha, Haribhadra\'s Saddarsana-samuccaya with Gunaratna) are too sketchy on ontology, epistemology and psychology to guide advanced reading. Our How-to-use section says pick a school and enter through verses, thread and concepts; in some sayings entry further requires a teacher and a technical vocabulary, because Dasgupta treats terms, condensation and cross-school allusion as the three gates that translations alone cannot open.'
    }
  },
  {
    id: 'dasgupta-vedas',
    title: { en: 'Vedas, Brahmanas, and their philosophy (Dasgupta Ch. II)' },
    body: {
      en: 'Dasgupta treats the Vedas as the earliest Indo-European literary record, its date undecided in his survey: in some sayings c. 1200 BCE (Max Muller), because of linguistic stratification; in some sayings c. 2400 BCE (Haug), because of astronomical allusions; in some sayings c. 4000 BCE (Tilak), because of Vedic star-references. The literature divides into Samhitas (hymn-collections), Brahmanas (ritual exegesis), Aranyakas (forest-treatises), and Upanisads. Rig-Vedic life is pastoral and sacrificial; the gods (Agni, Indra, Varuna, Usas) are luminous powers of nature, and worship moves from polytheism through henotheism — each god praised as supreme in turn — toward monotheistic figures: Prajapati the lord of creatures, Visvakarman the all-maker, and Brahma as prayer-power grown cosmic. Sacrifice is the first rudiment of the karma law, because correctly offered oblation is held to compel unseen result; cosmogonic hymns (notably the Nasadiya) hesitate between being and non-being; eschatology already seeks a surviving Atman. Our Common-ground section says actions ripen beyond the body; in some sayings this begins as sacrificial efficacy, because Dasgupta traces karma from the Brahmana doctrine that the rite outlives the act.'
    }
  },
  {
    id: 'dasgupta-upanishads',
    title: { en: 'The earlier Upanisads (Dasgupta Ch. III)' },
    body: {
      en: 'The Upanisads sit as appendices to Aranyakas and Brahmanas, though the boundary is fluid; Dasgupta notes non-Brahmanic (especially Kshatriya) voices such as Ajatasatru instructing the Brahmin Balaki, so in some sayings the wisdom is Kshatriya-led, because kings are shown teaching Brahman. "Upanisad" is sitting-near: secret instruction dissolving ignorance. The quest after Brahman proceeds by failures — aliments, vital airs, mind — each found too narrow, until Brahman is declared unknowable by speech and grasped by the negative method, neti neti. Atman is the inner seer never seen as object; Brahman is the world-ground, bliss and self-luminous awareness. The world is its manifestation, sometimes as world-soul; causation is debated rather than settled; transmigration hardens into rebirth according to desire and deed; emancipation is recognition of identity with Brahman. Our Vedanta summary says Upanisadic sentences converge on one Brahman veiled by ignorance; in some sayings the veil is approached through successive rejections, because Dasgupta stresses the Upanisadic pattern of trial, failure, and negation.'
    }
  },
  {
    id: 'dasgupta-systems-possible',
    title: { en: 'How a history is possible; what all agree on (Dasgupta Ch. IV)' },
    body: {
      en: 'A European-style succession of named thinkers is impossible here, because the root treatises are terse sutras — lecture-hints presupposing oral exposition — and systems crystallised soon after the early Upanisads with scanty chronology. The Brahma-sutras are so terse that in some sayings they bear half a dozen rival readings, because each later teacher wrote his novelty as a "faithful commentary" on the same aphorisms. Philosophic literature thus grows as sutra, bhasya, varttika, tika. Beneath quarrels Dasgupta finds agreement: (1) karma — acts bear unseen fruit across births; (2) mukti — release ending the cycle is the highest aim; (3) soul — a persisting enjoyer is assumed by most, denied by Buddhists; plus a pessimistic diagnosis of ordinary life joined to an optimistic faith that ignorance can end, and a unity of philosophy, religion and ethics in sadhana. Our What-all-schools-share section says the same in brief; in some sayings the pessimism is medical (disease, cure, medicine, health), because Nyaya and Yoga both frame suffering, cessation, means, and goal as fourfold therapy.'
    }
  },
  {
    id: 'dasgupta-buddha',
    title: { en: 'Buddhist philosophy (Dasgupta Ch. V)' },
    body: {
      en: 'Buddhism arises amid wandering ascetic orders; systematic Samkhya-Yoga treatises in present form are later, though free Samkhya-like and Yoga practices predate the Buddha. Early literature is Pali Nikayas and Vinaya; "dhamma" means texts, quality, cause, and — philosophically decisive — soulless unsubstantial phenomena. No fixed substance is accepted: phenomena arise serially as "what being, what else is" — dependent origination (paticca-samuppada) in twelve links from ignorance through birth to decay-and-death. The person is five khandhas (form, feeling, perception, formations, consciousness); avijja (nescience) and asava (cankers) drive craving; sila (virtue) and samadhi (concentration) with wisdom break it; kamma is volitional efficacy without a permanent agent. The Upanisad-Buddhism relation is affinity with rejection: same unease with suffering, but no Atman-Brahman. Later schools diverge: Theravada pluralism of dharmas; Mahayana compassion and Bodhisattva ideal; Asvaghosa\'s Tathata (suchness); Madhyamika sunyavada — all dharmas empty; Vijnanavada — consciousness-only; Sautrantika epistemology of momentary particulars, inference of the unseen, and the doctrine that existence is causal efficiency (arthakriyakaritva): to be is to do. Our Bauddha summary says no permanent self with moral causation and momentary composites; in some sayings momentariness is proved by efficiency, because what cannot act cannot be said to exist.'
    }
  },
  {
    id: 'dasgupta-jaina',
    title: { en: 'Jaina philosophy (Dasgupta Ch. VI)' },
    body: {
      en: 'Jainism is not an offshoot of Buddhism, though both are non-Vedic mendicant orders; Digambara and Svetambara are its two sects, with its own canon and Mahavira as reformer of an older order. Being (sat) is union of permanent and changing: a gold lump turned into ring keeps gold-qualities while losing and gaining modes, so in some sayings being is permanent (dhruva), because substance persists; in some sayings being is origination-and-loss (utpada-vyaya), because modes change each moment. Hence relative pluralism (anekantavada): nothing is affirmed absolutely; the sevenfold predication (syadvada) says "in some respect it is, in some respect it is not, in some respect it is indescribable," and standpoint-doctrine (naya) disciplines partial views. Knowledge is the soul\'s omniscience veiled by karmic matter; perception and non-perceptual knowledge (including clairvoyance and omniscience) differ by veil-thinness. Jivas are innumerable; karma is subtle matter flowing in (asrava) and shed by austerity (nirjara); pudgala (matter), dharma/adharma (motion-rest media), akasa (space), kala (time) complete the ontology; rigorous non-harming, austerity and meditation are yoga; no creator God is admitted. Our Jaina summary says infinitely many faces with seven forms and karma shaken off by austerity; in some sayings the seven forms are contextual affirmations, because each holds only under its stated condition.'
    }
  },
  {
    id: 'dasgupta-samkhya-yoga',
    title: { en: 'Kapila Samkhya and Patanjala Yoga (Dasgupta Ch. VII)' },
    body: {
      en: 'Germs lie in Upanisadic dualism and Katha/Svetasvatara passages; literature runs from the Samkhya-karika through the Samkhya-sutras to Vacaspati Misra and Vijnana Bhiksu, with Patanjali\'s Yoga-sutras plus Vyasa-bhasya as the theistic twin. An early Samkhya school debated soul-plurality and evolutes before Isvarakrishna fixed the classic. Purusa is witnessing consciousness, many purusas, inactive; Prakriti is unmanifest equilibrium of three gunas — sattva (illumination), rajas (activity), tamas (inertia) — whose disturbance evolves mahat (intellect), ahamkara (ego), eleven senses with mind, five subtle essences (tanmatras) and gross atoms/elements: twenty-five principles with Purusa. Causation is satkaryavada: in some sayings the effect pre-exists in the cause, because nothing comes from nothing and the total energy is conserved — manifestation is passage from potential to actual, aided by instrumental conditions (milk into curd changes collocation, not substance). Feelings (pleasure, pain, indifference) are taken as ultimate substances revealing guna-constitution. Samkhya is atheistic, Yoga theistic with Isvara as ever-free exemplar. Buddhi assumes the object\'s form and Purusa illuminates it; citta\'s ground-stuff with five afflictions (klesas) and threefold suffering is dissolved by discrimination ("I am not, nothing is mine") through purificatory practices (maitri, karuna, mudita, upeksa; breath-regulation) and eight-limbed meditation to kaivalya. Our Samkhya/Yoga summaries say seer-versus-seen discrimination and stilling fluctuations; in some sayings stilling is graded citta-transformation, because restraint proceeds level by level to seedless absorption.'
    }
  },
  {
    id: 'dasgupta-nyaya-vaisesika',
    title: { en: 'Nyaya-Vaisesika (Dasgupta Ch. VIII)' },
    body: {
      en: 'Nyaya-Vaisesika answers Buddhism\'s momentarism and Samkhya\'s unmanifest cause from common sense: enduring substances with qualities, motions, universals, particularities, inherence (plus later non-existence) are real. The Vaisesika-sutras and Nyaya-sutras (with Vatsyayana, Uddyotakara, Vacaspati, Udayana) systematise debate; in some sayings Vaisesika began as a ritual-exegetical school, because its categories overlap Mimamsa concerns. Causation is asatkaryavada against Samkhya: the effect is new (curd was not latent as curd in milk; atoms re-collocate under heat). Creation follows dissolution (pralaya/srsti) guided by unseen desert (adrsta); a proof of Isvara as supervisor of atoms is developed. Physics resolves material action into motion and heat-light transforming colour, taste, smell. Knowledge originates from a collocation (samagri) of intelligent and non-intelligent factors yielding uncontradicted determinate cognition — this collocation is pramana. Four pramanas: perception (indeterminate then determinate), inference (five-membered: proposition, reason, example, application, conclusion; pervasion/vyapti grounded in uniformity), comparison (upamana), testimony (sabda). Negation (abhava) is a real category known by non-perception. Mastering fallacies and debate-devices is soteriologically required, because false knowledge binds and true knowledge of the sixteen categories liberates; the soul is eternal, and Isvara aids but knowledge frees. Our Nyaya/Vaisesika summaries list four instruments and sixteen topics with atoms; in some sayings instruments converge on one object (pramana-samplava), because perception, inference and testimony can confirm each other.'
    }
  },
  {
    id: 'dasgupta-mimamsa',
    title: { en: 'Mimamsa (Dasgupta Ch. IX)' },
    body: {
      en: 'Mimamsa (Jaimini-sutras, Sabara-bhasya, Kumarila Bhatta, Prabhakara Misra) defends the eternal, authorless Veda against Nyaya\'s maker-inference and Buddhist critique. Its cornerstone is intrinsic validity (svatah-pramanya): in some sayings knowledge certifies its own truth, because falsity needs an extraneous defect while truth needs none; Nyaya in some sayings says validity is extrinsic (paratah), because success in action must confirm it afterwards. Sense-organs make contact; perception is first indeterminate (bare presentment) then determinate (qualified object); ontology multiplies categories to save perceptual distinctions. Illusion is explained without false objects (Prabhakara\'s non-apprehension of difference); inference and comparison follow Nyaya in outline; postulation (arthapatti) and non-perception (anupalabdhi) are independent instruments for Prabhakara and Kumarila respectively. Verbal testimony is supreme for supersensible duty (dharma as Vedic injunction); ritual action bears unseen potency (apurva). No creator or salvific grace is required; self is eternal, liberation is cessation of embodiment through duty done without desire. Our Mimamsa summary says intrinsic validity and duty from beginningless speech; in some sayings intrinsic means "uncontradicted until a defect appears", because invalidity is traced to causal blemish, not to knowledge itself.'
    }
  },
  {
    id: 'dasgupta-sankara',
    title: { en: 'Sankara Vedanta (Dasgupta Ch. X)' },
    body: {
      en: 'Vedanta literature culminates in Badarayana\'s Brahma-sutras, Gaudapada\'s Karika (no-origination, ajativada; dream and waking alike appearance), and Sankara (788-820 CE in Dasgupta\'s dating) with Suresvara, Padmapada, Vacaspati. The main idea: Brahman alone is real — self-luminous awareness, bliss — and the world-appearance is superimposed through beginningless positive nescience (ajnana: beginningless, positive, removable by knowledge). In some sayings the world is false as illusory superimposition on Brahman, because a defectless ground can still appear otherwise through avidya as its sole defect; in some sayings it is neither real nor unreal (anirvacya), because it cannot be classed with being or non-being. Causation is apparent transformation (vivarta), not real modification. The locus and content of ajnana, the inner organ (antahkarana) and ego (ahamkara), the states of jiva and Isvara, and one-soul versus many-soul and creation-by-seeing (ekajivavada, drstisrstivada) theories, are debated to secure non-duality. Perception and inference serve within the empirical order but terminate in immediate Brahman-knowledge; illusion (rope-snake, conch-yellow) models cosmic error; ethics purifies for hearing, reflection and absorption (sravana, manana, nididhyasana); emancipation is already-accomplished identity realised, not produced. Our Vedanta summary says sentences converge on Brahman veiled by ignorance; in some sayings the veil is positive and beginningless, because mere absence of knowledge could not project a world.'
    }
  },
  {
    id: 'dasgupta-vedanta-dialectic',
    title: { en: 'Post-Sankara Vedanta dialectic (Dasgupta Vol. II, Ch. XI)' },
    body: {
      en: 'After Sankara the school defends non-duality less by new metaphysics than by dialectic. Mandana (c. 800) treats Brahman as intelligence blissfully known through Vedic sentences with avidya as its power; Suresvara sharpens the critique of ritual-knowledge combination; Padmapada (c. 820) systematises superimposition and the witness; Vacaspati (c. 840) harmonises; Sarvajnatman, Anandabodha and the Maha-vidya formalise definitions; Sriharsa (c. 1150) turns definition-refutation into method — in some sayings categories are false because indefinable, because no Nyaya definition of substance, causation or proof survives scrutiny; Dasgupta replies that refuting a definition is not refuting its object, because better definitions remain possible. Citsukha (c. 1220) analyses each Sankara concept (perception, illusion, ignorance) to show inner contradiction in every attempted formulation. The Nagarjuna parallel is explicit yet distinct: both use dilemmas, but Madhyamika ends in emptiness while Vedanta ends in self-luminous Brahman. Santaraksita and Kamalasila (c. 760) prefigure the method by refuting Samkhya evolution, Isvara, enduring soul, Mimamsa and Upanisadic selves, persistence, and Nyaya-Vaisesika categories. Later figures — Prakasatman, Vimuktatman, Ramadvaya, Vidyaranya, Nrisimhasrama, Appaya Diksita, Prakasananda, Madhusudana — extend one-soul, reflection (pratibimba) versus limitation (avaccheda), and devotion-compatible non-dualism. Our Vedanta overview keeps Brahman with positive avidya; in some sayings avidya itself becomes the dialecticians\' chief exhibit, because indescribability under every definition is taken as falsity.'
    }
  },
  {
    id: 'dasgupta-vedanta-cosmology',
    title: { en: 'Vedanta foundations: appearance, cosmology, soul (Dasgupta Vol. II, Ch. XI §§1-6, 22)' },
    body: {
      en: 'Before the dialecticians, Dasgupta lays foundations the debate section presupposes. The Upanisads contain theistic, pantheistic, self-only and creationist strands, so in some sayings one uniform system must be extracted, because pre-Sankara commentators already assumed it. Against Buddhism, Vedanta holds twofold vision: ultimate reality as pure intelligence — not cognitional acts with subject-object content but the revelatory immediacy in all seeing, hearing and remembering — changeless and self-shining, with appearances expressed only by reference to it; in some sayings objects are maya-transformations presented as ideas in mental states, because dream/illusion analogies are popular aids, not proofs. Sankara\'s defence answers Samkhya (an intelligent pure Brahman cannot cause an unintelligent impure world) with apparent transformation, and meets Bhartrprapanca, who in some sayings makes Brahman really Brahman-plus-world, because Badarayana\'s texts speak of difference as well as unity. Against Vasubandhu\'s soulless conglomerate (self as mere prajnapti-sat over skandhas), the permanent enjoyer-controller is retained as presupposed by memory and agency. Cosmology gives maya/avidya/ajnana ontological as well as psychological status: one stuff forming mind and senses subjectively and the universe objectively, with veiling (avarana) and projecting (viksepa) powers — a small cloud hiding the sun, then painting worlds on it. The anonymous Prakatartha-vivarana (c. 1200, Adyar manuscript, author unnamed) systematises this as commentary on Sankara\'s Brahma-sutra-bhasya. Our Sankara summary keeps positive beginningless avidya; in some sayings its two powers divide labour, because covering explains non-recognition and projection explains mis-creation.'
    }
  },
  {
    id: 'dasgupta-yogavasistha',
    title: { en: 'Yoga-Vasistha (Dasgupta Vol. II, Ch. XII)' },
    body: {
      en: 'The Yoga-Vasistha-Ramayana (c. 23,734 verses; placed c. 7th-8th century because Gauda Abhinanda summarised it in the 9th) teaches radical monism in story form: bondage is the perceived universe (drsya), and origination is mental projection, not creation. The ultimate entity is pure consciousness; karma, mind (manas) and categories are its vibrations; agency (kartrtva) and world-creation are illusions sustained by latent desires (vasanas). Emancipation has two faces: embodied sainthood (jivan-mukti) through vasana-exhaustion, right knowledge and mind-dissolution — passions may still appear but, like a defanged snake\'s bite, cannot bind — and disembodied release (videha-mukti). Its signature is free-will energy (paurusa): in some sayings exertion rightly advised overrules past karma, because mind rightly applied is stronger than stored desert; hence breath-control (prana), stages of progress, and right conduct are practical rather than fatalistic. Dasgupta reads it as Sankara-like monism close to Vijnanavada Buddhism, differing because it retains Brahman as ground where Vijnanavada retains only consciousness-streams. Our app treats liberation as knowledge ending misidentification; in some sayings knowledge must be willed into habit, because the text makes sustained exertion the vehicle of insight.'
    }
  },
  {
    id: 'dasgupta-ayurveda',
    title: { en: 'Medical schools (Dasgupta Vol. II, Ch. XIII)' },
    body: {
      en: 'Ayurveda (Caraka, Susruta, Atharva-Vedic roots) belongs in philosophy because it shares Samkhya-Vaisesika physics and may have seeded Nyaya logic through physicians\' debates. Anatomy counts bones, organs, channels; embryology traces foetus and subtle body month by month; physiology centres vayu, pitta and kapha — motive air, metabolic bile-fire, cohesive phlegm — governing circulation, nerves (with Tantric parallels noted), head-heart rivalry, humours (rasas) and their chemistry. Psychology lists self-qualities when conjoined with mind (pleasure, pain, desire, hatred, effort, breath-currents, eyelid-movements, decision, imagination, memory, science, energy, sense-cognitions) and triple mind-qualities (sattvika kindness and restraint; rajasa pride and anger; tamasa dullness and sleep). Logic appears as four instruments — trustworthy testimony (apta-upadesa, the desireless seer of past, present and future), perception, inference, and reasoned probability (yukti) — applied to existent versus non-existent things, with full terminology of debate (thesis, reason, example, doubt, fallacy). In some sayings logic originated among physicians, because diagnosis and disputation trained inference before the sutra-codifiers; ethics (good life, springs of action, restraint, compassion) crowns therapy. Our Common-ground says suffering is diagnosed and method prescribed; in some sayings the physician\'s fourfold (disease, cause, cure, health) is the model, because both Yoga and Nyaya borrow the medical scheme.'
    }
  },
  {
    id: 'dasgupta-gita',
    title: { en: 'Bhagavad-gita (Dasgupta Vol. II, Ch. XIV)' },
    body: {
      en: 'The Gita, commented by Sankara (earliest surviving), Abhinavagupta, Ramanuja, Madhva, Vallabha, Nimbarka and many others, synthesises Samkhya cosmology with Yoga discipline under devotion. Samkhya in the Gita gives unmanifest (avyakta), gunas and elements; in some sayings the unmanifest is Prakriti, because it evolves the world; in some sayings it borders Brahman, because Krishna identifies the supreme as its ground. Yoga means both technique (sense-control: real restraint is inner mind-control, not mere outer suspension, else conduct is false — mithyacara) and union through desireless action: sacrifice is interiorised as duty offered without fruit, caste-duty transfigured into disinterested exertion. Ethics passes beyond Vedic ritual imperatives ("do not injure" yet injurious rites enjoined) toward inner law; compared with Buddhist ethics, both stress mind-purification, but the Gita retains self and God where Buddhism retains only the stream. Action is analysed by agent, means and resolve; eschatology promises return or release according to remembrance at death; God-and-man culminates in grace — Visnu-Vasudeva-Krishna as supreme person — with Bhagavata devotion as its milieu. Our app\'s Vedanta and Yoga summaries stress knowledge and stilling; in some sayings knowledge and action combine through devotion, because the Gita makes offering itself the means of vision.'
    }
  },
  {
    id: 'dasgupta-bhaskara',
    title: { en: 'Bhaskara: difference-and-non-difference (Dasgupta Vol. III, Ch. XV)' },
    body: {
      en: 'Bhaskara (after Sankara; cited by Udayana as a tridandin commentator) writes his Brahma-sutra commentary expressly to refute Sankara\'s maya doctrine, which he calls Buddhist in tendency. His position is bhedabheda: in some sayings Brahman is non-different as cause, because the world depends wholly on Him; in some sayings Brahman is different as effect diversified, because enjoyers and objects display real distinctions. Against illusionism, Brahman undergoes real modification (parinamavada) into the world while remaining in His own nature — the energy-in-God produces multiplicity without exhausting Him. Ritual and knowledge therefore cooperate rather than exclude: obligatory duties purify and knowledge liberates. Our Vedanta summary says Brahman apparently veiled by beginningless ignorance; in some sayings the veil is rejected outright, because Bhaskara holds Brahman really transformed, not merely superimposed.'
    }
  },
  {
    id: 'dasgupta-pancaratra',
    title: { en: 'Pancaratra Samhitas (Dasgupta Vol. III, Ch. XVI)' },
    body: {
      en: 'The Pancaratra (Jayakhya, Ahirbudhnya, Visvaksena, Markandeya, Hiranyagarbha and over a hundred Samhitas, largely ritualistic) supplies Vaisnava theology with antiquity rivalling the Veda. Its philosophy centres Visnu\'s power (sakti) with gross and transcendental forms — consciousness-power, world-force, causal power, grasping-power, omniscience-omnipotence — constituting God\'s subtle body; the five sense-powers are His powers, and prakriti evolves through His activity. The Ahirbudhnya works out vyuha emanations and a six-limbed Bhagavata-yoga (with eight-limbed yoga also practised among early Sri-Vaisnavas) directing yogic method toward devotion. Souls are described as all-pervasive, a point later Sri-Vaisnavas qualify. Our app notes enjoyment-become-liberation in Tantra overviews; in some sayings ritual manuals carry the metaphysics, because here yoga-accessories exist for devotion rather than for isolation.'
    }
  },
  {
    id: 'dasgupta-alvars',
    title: { en: 'Alvars: Tamil devotion as philosophy (Dasgupta Vol. III, Ch. XVII)' },
    body: {
      en: 'The twelve Alvars (Nammalvar\'s Tiruvaymoli of 1102 stanzas, Kulasekhara on Rama, Periyalvar, Andal as a gopi seeking Krishna and wedded to Ranganatha, Tondaradippodi saved from the courtesan Deva-Devi, Tiruppanal by a low-caste panar, Tirumankai the reformed brigand) compose the Nal-ayira-divya-prabandham, regarded in the Tamil country as a vernacular Veda. Chronology is debated, but philosophy is consistent: passionate self-surrender (prapatti) to Narayana/Ranganatha/Krishna, grace rescuing the unworthy (thief, low-caste, seduced), and divine accessibility surpassing sacrifice. Controversies with later Sri-Vaisnavas concern the mechanics of grace — self-effort versus sole refuge — but agree that devotion is cognition matured into love. Our Common-ground says liberation comes by right knowing; in some sayings knowing ripens as loving surrender, because the Alvars treat meditation as uninterrupted remembrance of the Beloved.'
    }
  },
  {
    id: 'dasgupta-ramanaju',
    title: { en: 'Yamuna and Ramanuja: qualified Brahman (Dasgupta Vol. III, Chs. XVIII-XX)' },
    body: {
      en: 'From Nathamuni through Yamuna (Siddhi-traya, Agama-pramanya; preceptor of Mahapurna, Ramanuja\'s initiator; c. late 10th-early 11th century) to Ramanuja, Venkatanatha (Vedanta Desika), Lokacarya and later dialecticians, Visistadvaita holds Brahman qualified (savisesa): scriptural "one" denies a rival cause, not qualities, and denial of qualities denies only defects. Yamuna contrasts soul-theories from Carvaka (no soul beyond body) upward, establishing the self as eternal knower-agent-enjoyer; God and world relate as soul to body; primeval matter (acit/prakriti) with its modifications is real and dependent. Ramanuja refutes Sankara\'s avidya (no locus, no object, no proof), and holds all knowledge real (sat-khyati): in some sayings error is partial truth, because the "silver" in nacre is real silver elsewhere misplaced, not a non-entity. Theistic proofs by reason alone fail; scripture reveals a God of excellent qualities. Venkatanatha refines pramana (perception determinate from the start against Nirvikalpaka abstractions), doubt (genuine oscillation, not mere non-apprehension), senses, space, time, soul, and emancipation as eternal service, with ontology criticising Samkhya\'s prakriti-inference, Nyaya atoms and whole-part, satkaryavada, momentariness, and Carvaka causality. Prapatti (self-surrender expounded in Srivacana-bhusana) completes method. Our Vedanta summary says one Brahman veiled by ignorance; in some sayings Brahman is one with real attributes and a real world as His body, because qualification, not exclusion, is taken as unity.'
    }
  },
  {
    id: 'dasgupta-ramanuju-history',
    title: { en: 'Visistadvaita history and literature (Dasgupta Vol. III, Ch. XVIII)' },
    body: {
      en: 'Hagiology distinguishes Alvars (inspired singers) from Aragiyas (inspiration tempered by scholarship), the latter list beginning with Nathamuni — born at Viranarayana, pilgrim to Mathura, Brindavan, Haridvara, Bengal and Puri, said to contact Nammalvar through Madhura-kavi — though his date is disputed across Guru-parampara, Divya-suri-carita and Prapannamrita. Alvar writings divide into three mystical summaries (rahasya-traya: Tiru-mantra, Dvaya, Carama-sloka), later expounded by Venkatanatha and Raghavacarya. From Nathamuni the succession runs through Yamuna\'s teacher Rama Misra (not the later Rama-misra-desika), Mahapurna to Ramanuja, with precursors, contemporaries and pupils (Kuresa, Dasaratha, Bhatta) systematising the school. Ramanuja\'s Sri-bhasya drew successive studies: Rama-misra-desika\'s Sri-bhasya-virtti in six chapters under Ramanuja\'s direction, Sudarsana Suri\'s Sruta-prakasika with Viraraghavadasa\'s Bhava-prakasika and Sahakopacarya\'s reply, Yatsya Varada\'s Tattva-sara (Varada the nephew, son of Kamala, Ramanuja\'s sister), Vira-raghava-dasa\'s Ratna-sarini and Tatparya-dipika. Alvar influence persists in the school\'s devotional temper: our Alvars section says knowing ripens as surrender; in some sayings scholarship itself is devotion disciplined, because the Aragiya ideal joins learning to inspiration.'
    }
  },
  {
    id: 'dasgupta-ramanuju-dialectic',
    title: { en: 'Ramanuja school dialectic and grace (Dasgupta Vol. III, Ch. XX §§4, 16-24)' },
    body: {
      en: 'Two positions need separate notice. First, theistic proof fails by inference: a complete, bodiless God needing nothing cannot be established by analogy with known makers, so in some sayings God is known by scripture alone, because no observed cause resembles creation by mere wish. Ramanuja is largely indebted to Bhaskara — on most topics their doctrines coincide — differing where devotion and qualification sharpen. Second, the long anti-Sankara dialectic (§16) presses experiential diversity of selves against one-self doctrine, and culminates in a grace determinism: virtue and vice are God\'s pleasure and displeasure, and whom He raises He makes perform good, whom He throws down He makes sin — man a tool, fruits following divine adjudgment, emancipation as intellect-expansion plunged in bliss-ocean by grace. Later dialecticians continue the attack and refine epistemology: Meghanadari (Nyaya-prakasika, Nyaya-dyu-mani; self-validity as knowledge manifesting objects as they are, error from vitiating conditions), Vatsya Varada, Ramanujacarya II (Vadi-hamsa-navambu), Ramanujadasa Mahacarya, Kasturi-Rangacarya, Saila Srinivasa and Rangacarya. Our Ramanuja section says scripture reveals a qualified God and all knowledge is real; in some sayings even effort is His instrument, because grace is taken as the final cause of virtue itself.'
    }
  },
  {
    id: 'dasgupta-nimbarka',
    title: { en: 'Nimbarka: union through devotion (Dasgupta Vol. III, Ch. XXI)' },
    body: {
      en: 'Nimbarka (with Devacarya\'s Siddhanta-jahnavi, Sundara Bhatta, Purusottama, Madhava Mukunda, Vanamali Misra) inquires into Brahman only after Vedic duties are found vitiated by enjoyment and incapable of eternal bliss; the seeker then approaches a teacher for grace. Reality is bhedabheda with devotional accent: the world is different from Brahman as effect, non-different as grounded in His energies, which manifest diversely while He remains unchanged in Himself. Madhava Mukunda attacks Advaita\'s end (a characterless release no one could desire), its illusion (rope-silver analyses fail when superimposition conditions are examined), and its ajnana (neither existent nor non-existent resolves nothing); he also criticises Ramanuja and Bhaskara for insufficiently securing both unity and distinction. Pramanas follow the theistic realist pattern, and the world\'s reality is affirmed against monists. Our Samkhya/Vedanta summaries stress discrimination or identity; in some sayings discrimination serves union, because Nimbarka makes grace-led devotion the fruit of inquiry.'
    }
  },
  {
    id: 'dasgupta-vijnanabhiksu',
    title: { en: 'Vijnana Bhiksu: Samkhya-Vedanta synthesis (Dasgupta Vol. III, Ch. XXII)' },
    body: {
      en: 'Vijnana Bhiksu (Vijnanamrita-bhasya, Isvara-gita exposition) grades reality: paramatman changeless and therefore most real; prakriti, purusa and evolutes less real as changing. Emancipation is not bliss-experience — no mind remains to experience it — nor sorrow\'s abolition in the world (others still suffer), but cessation of one\'s experience of sorrow; "bliss" names sorrow-negation. Prakriti as potential power in God is non-existent until manifested, existent as evolution; the subtle body of five tanmatras dissociates at release. Self-luminosity belongs to consciousness, ignorance is a real obscuring adjunct; maya and pradhana are distinguished by function. Against classical Samkhya-Yoga he theistically re-reads them as Vedantic: purusa-plurality and godlessness are provisional, Brahman-experience completes ordinary experience rather than cancelling perception. Our Samkhya summary says isolation of seer from seen; in some sayings isolation reveals graded participation in one Brahman, because Bhiksu ranks the real by stability.'
    }
  },
  {
    id: 'dasgupta-puranas-carvaka',
    title: { en: 'Puranas and Lokayata/Carvaka (Dasgupta Vol. III, Ch. XXIII + appendix)' },
    body: {
      en: 'Selected Puranas (Visnu, Vayu, Markandeya — including the Devi-Mahatmya section — Naradiya, Kurma) popularise cosmology, genealogies and devotion already systematised elsewhere; Dasgupta treats them as compendia rather than independent proofs, valuable for how theistic metaphysics reached wider audiences. The appendix gathers Lokayata/Nastika/Carvaka (Barhaspatya): an old materialism named already beside Samkhya-Yoga in Kautilya as logical science (anviksiki), and in Pali as tricky disputation (vitanda — criticism without counter-thesis, by equivocation, false analogy and defeat-points). Its chief doctrine, noted from Svetasvatara onward, takes the elements (bhutas) as ultimate: in some sayings there is no soul, because consciousness arises from matter; in some sayings there is no afterlife or unseen fruit, because perception alone is trusted. Our Carvaka school-card says only perception counts with four elements combining; in some sayings even inference is distrusted as habit, because no necessary tie between seen mark and unseen thing is perceived.'
    }
  },
  {
    id: 'dasgupta-bhagavata',
    title: { en: 'Bhagavata-purana (Dasgupta Vol. IV, Ch. XXIV)' },
    body: {
      en: 'The Bhagavata shares the Gita\'s devotional centrality without its antiquity: Dasgupta finds no trace before the tenth century, notes Ramanuja\'s silence about it, and sees it famous only by Madhva\'s thirteenth-century Bhagavata-tatparya; its Alvar echoes suggest a southern author, and its instant prestige drew scores of commentaries (Sridhara, Vallabha\'s Subodhini, Vijayadhvaja, Visvanatha, Sanatana and Jiva among them). Dharma here is re-centred: against Jaimini\'s injunction-only good and Medhatithi\'s exclusion of Bhagavatas and Pasupatas as non-Vedic, the text makes devotion itself the law. The Godhead is named threefold — Brahman, Paramatman, Bhagavan — not three gods but one reality under aspects, with Sakti in gross and transcendent forms; Kapila\'s Samkhya is retold devotionally (prakriti evolving under divine superintendence rather than autonomously), and eschatology passes through graded realms into loving service. Our Common-ground says acts ripen beyond the body; in some sayings ripening is drawn toward grace, because here duty culminates in remembrance of the Person.'
    }
  },
  {
    id: 'dasgupta-madhva-life',
    title: { en: 'Madhva and his school (Dasgupta Vol. IV, Ch. XXV)' },
    body: {
      en: 'Madhva (Ananda-tirtha) of Udipi, near Sankara\'s Srngeri seat, is dated by Bhandarkar from Kali 4300 and Matha lists to Saka 1119 (c. 1197 CE) with a seventy-nine-year life, corroborated through his pupil Narahari\'s Srikurmam inscriptions of Saka 1186-1215; Dasgupta stresses how little is certain beyond the semi-legendary Madhva-vijaya, Mani-manjari and Trivikrama\'s hymns. Hagiography casts him as Vayu\'s incarnation raised to uproot Sankara, whose maya doctrine is caricatured as crypto-Buddhism preached by the demon Manimat. Trained under Acyutapreksa, he tours, debates, and founds the Udipi seat; some three dozen works are ascribed — Gita and Sutra commentaries, the Anuvyakhyana, the tenfold Dasa-prakarana, the Mahabharata-tatparya and Bhagavata-tatparya — carried forward by Jayatirtha, Vyasatirtha, Vadiraja and Raghavendra. Our Vedanta summary says sentences converge on Brahman veiled by ignorance; in some sayings the veil is denied and Vishnu affirmed as the sentence-meaning, because Madhva reads every text as pointing to a qualified supreme Person.'
    }
  },
  {
    id: 'dasgupta-madhva-sutras',
    title: { en: "Madhva's reading of the Brahma-sutras (Dasgupta Vol. IV, Ch. XXVI)" },
    body: {
      en: 'Dasgupta tracks Madhva through the Anuvyakhyana as glossed by Jayatirtha\'s Tattva-prakasika, Vyasa Yati\'s Tatparya-candrika and Raghavendra\'s sub-commentaries, always against Sankara\'s reading. On I.1.1 (now therefore Brahma-enquiry), "now" does not merely mark moral fitness but Vishnu\'s grace moving inquiry itself, and enquiry is needed because His greater favour comes only through right knowledge; fitness is graded in three stages from Vishnu-devotion through sixfold discipline to exclusive attachment. Brahman is Vishnu, full of auspicious qualities and eternally distinct from souls and matter. On I.1.2 (origin and the rest from Him), creation, maintenance and dissolution proceed from His wish, not from an impersonal ground. On I.1.3-4 (scripture as source, harmony of texts), all Upanisadic sentences cohere in Vishnu; rival non-qualified readings strain the words. Our How-to-use section says enter through verses, thread and concepts; in some sayings entry must begin from grace, because here even the desire to inquire is His gift.'
    }
  },
  {
    id: 'dasgupta-madhva-phil',
    title: { en: 'Madhva ontology and knowledge (Dasgupta Vol. IV, Ch. XXVII)' },
    body: {
      en: 'Reality for Madhva is twofold — independent (svatantra, Vishnu alone) and dependent — unfolded for debate into ten categories (substance, quality, action, class-character, particularity, qualified whole, power, similarity, negation) and twenty substances (paramatman, Lakshmi, souls, unmanifest space, prakriti, gunas, mahat, ego, intellect, mind, senses, elements, potentials, ignorance, sounds, darkness, tendencies, time, reflection). God and souls are manifested but never evolve; the world evolves; ignorance both evolves and is manifested. Five eternal differences (God-soul, God-matter, soul-soul, soul-matter, matter-matter) secure pluralism; souls are graded as fit for release, ever-wandering, or fit for darkness, and Lakshmi is co-eternal yet dependent. No act is morally neutral: even indifferent motion indirectly yields merit or demerit, while creation-acts abide eternally in God as essence, potential or actual. Universals perish with perishable individuals. Knowledge is true correspondence with objects; intrinsic validity is defended in theistic form. Our Nyaya/Vaisesika summaries list enduring substances and four instruments; in some sayings endurance is ranked by dependence, because here only Vishnu stands by Himself.'
    }
  },
  {
    id: 'dasgupta-madhva-logic',
    title: { en: 'Madhva logic (Dasgupta Vol. IV, Ch. XXVIII)' },
    body: {
      en: 'Intuition (kevala-pramana) is fourfold — God\'s (independent, beginningless, all-scoped), Lakshmi\'s (dependent, slightly less penetrating, still eternal and true), the yogin\'s (straight sages bound for Brahmahood know all but God partially until release; lesser gods below them), and ordinary persons\' (graded by fitness for release, rebirth, or lower states). Its instruments (anu-pramana) are three: perception, inference, scripture. Perception needs a faultless sense meeting a faultless object — remoteness, nearness, minuteness, obstruction, confusion with similars all vitiate — with mind as superintendent and the self-identical intuitive faculty perceiving self, faculties, pleasure, time and space; Jayatirtha rejects sixfold Nyaya contact, since inherence is denied and quality is non-different from substance, so contact is one event. Inference rests on concomitance grasped through natural uniformity rather than abstracted universals. Testimony is faultless scripture — Veda with Pancaratra and Bhagavata — and reasoning (tarka) clears doubts. Our How-they-claim-to-know section counts instruments as positions; in some sayings counting ends in hierarchy, because here knowers themselves are ranked.'
    }
  },
  {
    id: 'dasgupta-dualist-monist-falsity',
    title: { en: 'Dualist-monist debate: is the world false? (Dasgupta Vol. IV, Ch. XXIX)' },
    body: {
      en: 'Vyasatirtha\'s Nyayamrita attacks, Madhusudana\'s Advaita-siddhi defends, and Ramacarya\'s Tarangini rejoins over five classic definitions of falsity. That the false is "other than being and non-being" breaks the excluded middle, since separately admittable opposites cannot be jointly asserted (hare and horn exist apart, never as hare\'s horn); the reply that appearance lends a qualified being is met by insisting the school itself ties appearance to being. That the false is "denied wherever it appears at all times" either makes the denial real (so dualism) or merely conventional (so the world is true); the absolutely non-existent, it is urged, cannot appear, yet chimerical words convey notions and scripture speaks of non-being at the beginning. Successive definitions through indescribability, knowledge-sublatability and contradiction are pressed the same way: describing the indescribable describes it, and uncontradictedness in knowledge is not reality. Our Vedanta summary says the world is superimposed through positive nescience; in some sayings superimposition cannot even be stated, because every formula for falsity is shown to falsify itself.'
    }
  },
  {
    id: 'dasgupta-dualist-monist-avidya',
    title: { en: 'Dualist-monist debate: nescience, Brahman, release (Dasgupta Vol. IV, Ch. XXX)' },
    body: {
      en: 'The sequel presses avidya, defined as beginningless, positive, and removed by knowledge: temporal world-objects cannot rest on a beginningless limiter; a positive stuff cannot cause mere negation, else the real causes the unreal; veiling blocks the final intuition of Brahman, making removal and release impossible; and if knowledge removed it spontaneously, qualifications about "beginningless" or "associated conditions" would be idle, while awaiting conditions denies spontaneity. Indefinability fares no better — not-positive must be negative, and a beginningless non-negation would persist like the self. Brahman as both material and instrumental cause is refused: a changeless intelligence cannot turn into an impure world except by wish-guided power over real matter. Release is therefore not identity without remainder but graded bliss in service, with hierarchy (taratamya) among the freed, twofold dissolution, and God sustaining all dependents. Our Sankara section says emancipation is already-accomplished identity realised; in some sayings realisation admits degrees, because difference is taken as eternal rather than apparent.'
    }
  },
  {
    id: 'dasgupta-vallabha',
    title: { en: 'Vallabha: pure non-dualism of grace (Dasgupta Vol. IV, Ch. XXXI)' },
    body: {
      en: 'Vallabha (1479/81-1533 in Dasgupta\'s account; Anubhasya, Subodhini on the Bhagavata, and Pushti-marga writings, continued by Vitthala) holds suddha-advaita: Brahman is Krishna, being-consciousness-bliss with all qualities, whose power (maya/sakti) is real and inseparable like fire and its rays. The world is His real manifestation, not illusion — change touches the manifestation while the substance stays unspent, so both permanence and becoming hold. Against Sankara he rejects Brahman-plus-ignorance as omniscience and breath-analogies for the Veda\'s eternity; against bare inference (Udayana\'s nine theistic proofs rehearsed only to limit them) he holds God is known through scripture contemplated in purity, with action and knowledge as complementary purifiers disposing toward grace. Method is devotion, crowned as grace-nourished (pushti) love surpassing rule-bound (maryada) service; emancipation is participation in His play, not dissolution. Our Vedanta overview keeps positive beginningless avidya projecting the world; in some sayings projection is refused because power is affirmed, because Vallabha makes manifestation itself His glory.'
    }
  },
  {
    id: 'dasgupta-caitanya',
    title: { en: 'Caitanya and his followers (Dasgupta Vol. IV, Ch. XXXII)' },
    body: {
      en: 'Caitanya (1485-1533), born at Navadvipa on a spring full-moon eclipse to Jagannatha and Saci, junior contemporary of Vallabha and last of the great Vaisnava reformers, left no systematic work; Dasgupta reconstructs him from Murari and Vrndavana\'s Caitanya-bhagavata for the early life, Kavi Karnapura\'s play (1572) and Krishnadasa Kaviraja\'s Caitanya-caritamrita (c. 1616) for the later, with Sarvabhauma\'s conversion-episode variously told. Raised amid migrant Vaisnava households under strained Muslim rule and the longing of Advaita Acarya, the brilliant scholar turns ecstatic devotee: congregational song, dance, tears and transports are devotion\'s evidence, not its ornament. Companions — Nityananda, Advaita, Rupa, Sanatana, Svarupa Damodara — organise the movement while he embodies it. Philosophy appears only as gleanings: Krishna as supreme Person, devotion as both means and end, humility deeper than scholarship. Our How-to-use section says start anywhere since doors reconnect; in some sayings the door is song, because here knowing matures only as loving seizure.'
    }
  },
  {
    id: 'dasgupta-jiva-baladeva',
    title: { en: 'Jiva Gosvami and Baladeva: inconceivable difference (Dasgupta Vol. IV, Ch. XXXIII)' },
    body: {
      en: 'Jiva (Sat-sandarbha, with its Bhagavata-sandarbha commentary) reads Brahman, Paramatman and Bhagavan as one reality under aspects: generality without manifest powers appears as Brahman, cosmic control as Paramatman, and power-possessing bliss as Bhagavan — bliss the substance, other powers its qualities. Identity with Brahman comes not through "that art thou" instruction but through devotion-awakened grace realising consciousness-identity with Him. Powers are three — essential (svarupa), world (maya), soul (jiva) — and Vaikuntha is pure, time-transcending sattva beyond material guna-mixture. The world is real yet destructible: destructible means returning into God\'s power whence it came, so evolution (parinama) holds and illusion-analogies fail — fire\'s rays burn less than fire, poison still poisons when taken for ginger, and utility without ground is mere convention. Baladeva\'s Govinda-bhasya then reads the Brahma-sutras in this Caitanya idiom as inconceivable difference-and-non-difference (acintya-bhedabheda): dependence secures unity, distinct powers secure distinction. Our Ramanuja section says Brahman is one with real attributes as body; in some sayings unity is inconceivable, because powers are held to be neither identical nor separate.'
    }
  },
  {
    id: 'dasgupta-bhagavata-samkhya',
    title: { en: 'Bhagavata Samkhya and eschatology (Dasgupta Vol. IV, Ch. XXIV §§4-5)' },
    body: {
      en: 'The Bhagavata\'s Kapila retells Samkhya devotionally: one beginningless qualityless purusha shines as all souls, self-luminous beyond prakriti, yet playfully accepts the prakriti approaching of itself — and, beclouded by its veiling power, falsely takes the gunas\' movements for its own agency, descending into birth and karma. In truth prakriti alone acts and effects; purusha merely enjoys pleasures and pains. Evolution yields five gross elements, five subtle essences, ten senses, and an inner quartet (mind, intellect, ego, thought-stuff); commentators divide over the blinding — Subodhini making the self-blinded purusha the soul, Vijayadhvaja the transcendent Lord blinding souls through it, Sridhara distinguishing Lord from soul with veiling and projecting powers twofold. Eschatology (III.32) sends sacrificers to the lunar world and back, duty-surrenderers through the solar sphere to the world-cause, duality-obsessed souls into qualified Brahman and rebirth, and forefather-offerers down the southern smoky path into their own lines; a more inward account (XI.22) lets deed-permeated mind transmigrate with the self following, so death is absolute forgetting and birth the taking of new experience. Our Samkhya summary says proximity unfolds principles ending in discrimination; in some sayings proximity becomes play, because here bondage begins when the witness mistakes approach for identity.'
    }
  },
  {
    id: 'dasgupta-madhva-gurus',
    title: { en: 'Madhva gurus, works and the Ramanuja question (Dasgupta Vol. IV, Ch. XXV §§2-5)' },
    body: {
      en: 'Succession is contested: Bhandarkar\'s manuscript-tour list runs thirty-five pontiffs from Madhva\'s death (Saka 1198) through Padmanabha, Narahari, Madhava, Akshobhya and Jayatirtha down to a Satyavit living in 1882, consonant across Belgaum and Poona mathas; Baladeva\'s commentary-list agrees only as far as Jayatirtha before diverging wholly, and Dasgupta declines to follow it. Among some three dozen works the Mahabharata-tatparya (thirty-two verse chapters) lays down the canon — four Vedas, Pancaratra, Mahabharata, original Ramayana and Brahma-sutras, with Vaisnava Puranas as their elaboration and Manu valid where consonant — while rival scriptures, Buddhist or Saiva, are held to have been issued to delude demons; every text teaching present or liberated identity with Brahman is pronounced false, Vishnu-Narayana-Vasudeva is the Lord, and the world-process is real under fivefold difference. Notably Madhva himself says almost nothing against his predecessor Ramanuja; the quarrel is later, e.g. Parakala Yati\'s sixteenth-century Vijayindra-parajaya (from Venkatanatha\'s Tattva-mukta-kalapa) attacking Madhva\'s refusal of the substance/non-substance division and his absorption of qualities into substance — blueness is no detachable add-on to the jug but its inseparable description, met by the reply that heat-blued clay shows colour arriving apart. Our Ramanuja section says scripture reveals a qualified God; in some sayings qualification goes further into separation, because Madhva will not let qualities stand off from their bearer yet will not let bearer merge into God.'
    }
  },
  {
    id: 'dasgupta-madhva-sutra-rest',
    title: { en: 'Madhva on the remaining Brahma-sutra topics (Dasgupta Vol. IV, Ch. XXVI §4)' },
    body: {
      en: 'Beyond the opening four sutras the review proceeds topic by topic, each time turning Sankara\'s rival-school refutation into a direct Vishnu assertion. Where Sankara reads sutras 5-11 as excluding Samkhya causality — the Upanisadic "perceiving" (ikshati) needs an intelligent agent, "self" cannot mean insentient prakriti, liberation is taught to that self, and all texts converge — Madhva finds no anti-Samkhya polemic at all, only the claim that Brahman is scripture-describable precisely because scripture enjoins perceiving Him, with final dissolution into Him and even the qualityless described. Where Sankara proves the Taittiriya "bliss-sheathed" (anandamaya) to be the supreme self against rival passages, Madhva holds it names Vishnu and Vishnu alone, never any lesser deity. So it continues through the book: agreements, dissolutions and convergences all terminate in the highest Person rather than an impersonal ground. Our Sankara section says apparent transformation secures non-duality; in some sayings convergence secures personality instead, because the same harmony of texts is taken to point at One who wills.'
    }
  },
  {
    id: 'dasgupta-madhva-error',
    title: { en: 'Madhva on self-validity, illusion and doubt (Dasgupta Vol. IV, Ch. XXVII §§3-4)' },
    body: {
      en: 'Against Nyaya\'s extrinsic testing, Madhva holds validity self-certifying: awareness of validity is what launches action, and testing each cognition by another invites infinite regress, while the witnessing self knows pleasures, pains and states directly beyond doubt. Illusion is then knowing otherwise than the thing is — one entity appearing as another, existent as non-existent and vice versa — and its sublation is right knowledge exposing the false form. Defects of sense do not merely block but positively misrepresent, so error is mal-observation, not just non-observation. The puzzle — non-existent silver cannot causally produce its cognition, hence cannot be its object — is answered by Jayatirtha with determination (nirupaka) short of production: we cognise the long-past and the long-dead without their presently acting, so a non-entity may still fix what the cognition is about. Doubt, hovering between alternatives through mind\'s synthesis-and-analysis until intellect decides, is a genuine mental state rather than mere non-apprehension. Our Nyaya summary says four instruments are tested through debate; in some sayings testing ends at the witness, because certainty about one\'s own states needs no second instrument.'
    }
  },
  {
    id: 'dasgupta-knowledge-illusion',
    title: { en: 'Knowledge and the world-illusion in the debate (Dasgupta Vol. IV, Ch. XXIX §§2-3)' },
    body: {
      en: 'Vyasatirtha presses the monist\'s apparatus against itself: reasons alleged to prove falsity (cognisability and the like), applied to the inference that wields them, falsify it too — and if they are exempt, the world they condemn might be as well. Reality cannot be fixed as awareness-object (chimeras are awareness-objects too) nor as sheer awareness (then unperceiving eternals and the directly perceived world escape the net); fire burns unknown, so existence owes nothing to being known, and behaviour cannot define reality since behaviour presupposes knowing what behaves. The world must be or not be — no third subsistence — yet its non-being is provable by neither existent proofs (opposed to it) nor non-existent ones (proving nothing). On illusion\'s locus, Sankara needs Brahman known generally but unknown particularly; but Brahman, void of generic marks and specific peculiarities, admits neither clause — to which Madhusudana replies that self-luminous bliss suffices as the known generality with its degrees unknown, or else that beginningless imaginary universals escape the circle. Our Vedanta dialectic section says categories are called false because indefinable; in some sayings indefinability rebounds, because the proof of falsity cannot itself survive definition.'
    }
  },
  {
    id: 'dasgupta-ajnana-proofs',
    title: { en: 'Proving and perceiving nescience; ego and Brahman (Dasgupta Vol. IV, Ch. XXX §§2-5, 7)' },
    body: {
      en: 'The defence narrows "valid knowledge" to vrtti-cognition, excluding witness-consciousness of pleasure and the substantive "this" (never erred about, only its characters are), so veil-removal tracks characters alone — mediate knowledge too removes its veil of absence-to-the-knower, and continuous perception removes the fresh time-element each moment, time being perceptible by all instruments. Against beginninglessness-as-veil objections, Madhusudana distinguishes the veil as error-capacity (only character-bearing cognitions have it) from mere unknownness. On egohood, the monist\'s dreamless-sleep argument — self present, ego unmanifest, hence memory detaches from "I" — is met by denying the split: all memory, including "I slept," refers to the ego-associated self, and even the Vivarna lets recognition belong to the self with its inner organ, the self individuated precisely through ego-association. On Brahman, doubt demanding resolution already concedes positive character, and word-meanings reach Him through primary senses grounding secondary ones. Our Sankara summary says the veil is positive and beginningless; in some sayings even its perception is dissected, because removing is restricted to characters while the "this" was never veiled.'
    }
  },
  {
    id: 'dasgupta-vallabha-school',
    title: { en: 'Vallabha\'s categories, knowledge, followers and life (Dasgupta Vol. IV, Ch. XXXI §§3-4, 6-10)' },
    body: {
      en: 'Time itself is God\'s form: in essence being-intelligence-bliss, phenomenally tinged with being, supra-sensible and inferred from effects, eternally pervasive, first disturber of guna-equilibrium, with sun and moon as its gross forms, atoms its subtle form, God its presiding form — the transit across an atom its indivisible unit, long durations mere conglomerates. Action is universal, particularised only by manifestation and condition. Knowledge is tenfold: four eternal kinds (God\'s essence as one with beings and emancipation itself, His noble qualities, His Veda-manifestation, His verbal-knowledge presence — which is why even the dumb gesture in words), plus sense-knowledge and four mental modes (mind doubting through synthesis-analysis, intellect deciding, ego dreaming, thought-stuff perceiving the self in deep sleep); cognitions persist till superseded, lingering as impressions recoverable in memory. Vitthala\'s Vidvanmandana answers the qualityless-texts: the basis they demand is itself the upajivya of qualified texts, denial of qualities presupposes qualities, and denying both ends in nihilism. The life (Telugu Yajnarayana line, Pampakshetra near Benares, Samvat 1535/1481, seventh-month birth under a tree in flight from invasion) anchors eighty-four ascribed works — Subodhini, Anubhasya, Tattvadipa-Prakasa chief, glossed by Purushottama, Vitthala and Pitambara — with the school claiming Visnusvamin\'s lineage on evidence Dasgupta finds too thin to verify. Our Mimamsa summary says duty comes from beginningless speech; in some sayings speech is His manifestation, because here even verbal knowledge is God appearing.'
    }
  },
  {
    id: 'dasgupta-jiva-bhakti-joy',
    title: { en: 'Devotees, bhakti and joy in Jiva (Dasgupta Vol. IV, Ch. XXXIII §§4-7)' },
    body: {
      en: 'God meets devotees through the powers devotion discloses: the best devotee perceives Him in all beings, and relation runs through grace rather than fellow-feeling — sympathy in the human sense presupposes lack, while He approaches through essential power made intimate in worship. Bhakti is therefore not only the means but itself the emancipation: the path\'s end is the path intensified. Realisation is twofold — abstract as Brahman, concrete as personal God and supreme Soul — and the concrete enriches itself as diverse forms dawn, until the devotee identifies his own nature with God\'s bliss-nature; that identification felt is the emotion of devotion-joy (priti), experienced as one\'s own nature and as oneness with Him. Only through such joy does sorrow fully cease, other attributes and powers unveiling within it; ordinary seekers waste the same hunger on worldly objects, not knowing joy\'s true object. Purity (kaivalya) is thus redefined as God\'s own nature realised, and embodied release (jivan-mukti) as true self-knowledge in right relation to Him. Our Common-ground says liberation ends the cycle by right knowing; in some sayings knowing ends as joy, because here bliss is not the reward of vision but its substance.'
    }
  }
];

export function introSchoolName(s: IntroSchool, lang: SupportedLanguage): string {
  return (lang === 'ml' && s.name.ml) || s.name.en;
}

export function introText(
  v: { en: string; ml?: string },
  lang: SupportedLanguage
): string {
  return (lang === 'ml' && v.ml) || v.en;
}
