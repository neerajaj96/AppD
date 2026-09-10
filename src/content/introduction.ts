import { SupportedLanguage } from '../types/i18n';

// General introduction to Indian philosophy, organized after the classic
// pedagogical map (nine schools, common questions, means of knowledge).
// All prose below is original to this project; the Chatterjee & Datta
// textbook served only as a structural reading aid. No sentences are
// borrowed from it.

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
