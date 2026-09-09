import { SupportedLanguage } from '../types/i18n';

export interface SystemPillar {
  title: string;
  sanskritTerm?: string;
  summary: string;
  conceptId?: string;
}

export interface SystemOverviewData {
  systemId: string;
  headline: Partial<Record<SupportedLanguage, string>> & { en: string };
  summary: Partial<Record<SupportedLanguage, string>> & { en: string };
  pillars: Partial<Record<SupportedLanguage, SystemPillar[]>> & { en: SystemPillar[] };
}

export const systemOverviews: Record<string, SystemOverviewData> = {
  nyaya: {
    systemId: 'nyaya',
    headline: {
      en: 'The Architecture of Epistemic Realism, Pragmatic Efficacy, and Liberation',
      ml: 'ജ്ഞാനശാസ്ത്രപരമായ യാഥാർത്ഥ്യബോധവും മോക്ഷശാസ്ത്രവും'
    },
    summary: {
      en: "Nyāya is classical India's most rigorous school of epistemology and dialectics. Far from an abstract academic exercise, its opening Bhāṣya and Vārtika ground philosophical inquiry in fruitful human action (pravṛtti-sāmarthya): truth is validated when cognition reliably guides practical effort. Structuring itself on the ancient medical model (caturvyūha), Nyāya treats delusion as a chronic disease and applies its sixteen categories as the intellectual scalpel to permanently eradicate the twenty-one forms of suffering.",
      ml: "ഭാരതീയ തത്ത്വചിന്തയിലെ ഏറ്റവും സൂക്ഷ്മവും ശാസ്ത്രീയവുമായ ജ്ഞാനശാസ്ത്ര പദ്ധതിയാണ് ന്യായദർശനം. ശുദ്ധമായ വാദപ്രതിവാദങ്ങൾക്കപ്പുറം, പ്രമാണങ്ങളെ പ്രായോഗിക ജീവിതത്തിലെ ഫലവത്തായ പ്രവൃത്തിയിലേക്ക് (പ്രവൃത്തിസാമർത്ഥ്യം) ബന്ധിപ്പിക്കുകയാണ് ഇതിന്റെ ആദ്യ പാഠങ്ങൾ. ആയുർവേദ ചികിത്സാശാസ്ത്രത്തിന് സമാനമായി (ചതുർവ്യൂഹം), ജീവിതത്തിലെ 21 വിധത്തിലുള്ള ദുഃഖങ്ങളുടെ ശാശ്വത നിവൃത്തിക്കായി 16 പദാർത്ഥങ്ങളെ അപഗ്രഥിച്ച് സത്യം കണ്ടെത്തുകയാണ് ന്യായത്തിന്റെ ലക്ഷ്യം."
    },
    pillars: {
      en: [
        {
          title: 'Fruitful Exertion as the Benchmark of Truth',
          sanskritTerm: 'Pravṛtti-sāmarthya (प्रवृत्ति-सामर्थ्य)',
          summary: "Vātsyāyana's opening axiom: 'An instrument of valid cognition is effective because it leads to fruitful action.' Right knowledge stimulates the desire to acquire the beneficial (upādāna) or abandon the harmful (hāna). If effort succeeds, the cognition is true; if foiled (as in a mirage), it is false.",
          conceptId: 'pravritti-samarthya'
        },
        {
          title: 'The Four Cognitive Factors',
          sanskritTerm: 'Pramāṇa-Catuṣṭaya (प्रमाण-चतुष्टय)',
          summary: 'Every cognitive event requires four factors: the Knower (Pramātṛ), the Instrument of knowledge (Pramāṇa), the Object known (Prameya), and the Resultant comprehension (Pramā). Uddyotakara proves Pramāṇa is the supreme, most efficient cause (sādhakatama) because its operation directly triggers knowledge.',
          conceptId: 'pramana-catustaya'
        },
        {
          title: 'Realism of Being and Non-Being',
          sanskritTerm: 'Sat & Asat (तत्त्वम् सद्-असत्)',
          summary: 'Truth (tattva) is apprehending the existent as existing, and the non-existent as non-existing. Through the Lamp Analogy (Dīpa-dṛṣṭānta), Vātsyāyana proves that the very same light revealing present objects simultaneously proves the absence of what is not seen.',
          conceptId: 'tattva-sat-asat'
        },
        {
          title: 'The Fourfold Medical Model',
          sanskritTerm: 'Caturvyūha-Śāstra (चतुर्व्यूह-शास्त्र)',
          summary: 'Modeled after Āyurvedic medicine: (1) Heya (the disease: suffering), (2) Hāna (the cure: permanent cessation), (3) Upāya (the medicine: the 16 categories and true knowledge), and (4) Adhigantavya (the return to supreme health: Apavarga).',
          conceptId: 'caturvyuha-shastra'
        },
        {
          title: 'The Twenty-One Kinds of Suffering',
          sanskritTerm: 'Ekaviṃśati-Duḥkha (एकविंशति-दुःख)',
          summary: 'Uddyotakara catalogs the 21 roots of suffering: the physical body, the six sense organs, the six sense objects, the six forms of awareness, intrinsic pain, and mundane pleasure (which is fragile, craving-laden, and destined for loss).',
          conceptId: 'ekavimshati-duhkha'
        },
        {
          title: 'Convergence of Epistemic Instruments',
          sanskritTerm: 'Pramāṇa-Saṃplava (प्रमाण-संप्लव)',
          summary: 'Unlike the Buddhist doctrine that senses and logic never overlap (Pramāṇa-vyavasthā), Nyāya demonstrates that multiple instruments (perception, inference, testimony) can converge upon the same object, multiplying epistemic certainty.',
          conceptId: 'pramana-samplava'
        },
        {
          title: 'The Four Classical Sciences',
          sanskritTerm: 'Catasro Vidyāḥ (चतस्रो विद्याः)',
          summary: 'Human knowledge is anchored in four sovereign sciences: Trayī (Vedic science), Vārtā (economics/agriculture), Daṇḍanīti (political governance), and Ānvīkṣikī (logic). Nyāya lists all 16 categories to protect Ānvīkṣikī from collapsing into spiritual theology (Adhyātma-vidyā).',
          conceptId: 'catasro-vidyah'
        },
        {
          title: 'Examination of Reality by Proofs',
          sanskritTerm: 'Pramāṇair Artha-parīkṣaṇam (प्रमाणैरर्थपरीक्षणम्)',
          summary: "Nyāya is defined as the critical re-examination (anu-īkṣā) of things previously apprehended by perception and testimony. Any logical deduction contradicting direct perception is pseudo-reasoning (nyāyābhāsa) and discarded at the threshold.",
          conceptId: 'anviksiki-nyaya'
        },
        {
          title: 'The Syllogism as Synthesis of All Four Proofs',
          sanskritTerm: 'Pañcāvayava-Pramāṇa-Saṃplava (पञ्चावयव-प्रमाणसंप्लव)',
          summary: 'The five-member syllogism is the supreme reasoning (paramo nyāyaḥ) because each proposition embodies a pramāṇa: Pratijñā=Śabda, Hetu=Anumāna, Udāharaṇa=Pratyakṣa, Upanaya=Upamāna, and Nigamana unites them into an unassailable demonstration.',
          conceptId: 'pancavayava-samplava'
        },
        {
          title: 'The Lamp of All Sciences',
          sanskritTerm: 'Pradīpaḥ Sarvavidyānām (प्रदीपः सर्वविद्यानाम्)',
          summary: "Vātsyāyana's celebrated motto: 'Nyāya is the lamp of all sciences, the resource of all actions, and the foundation of all righteous duties.' It alone scrutinizes the instruments of knowledge that all other disciplines presuppose.",
          conceptId: 'pradipa-sarvavidyanam'
        }
      ],
      ml: [
        {
          title: 'പ്രവൃത്തിസാമർത്ഥ്യം (സത്യത്തിന്റെ പരീക്ഷണക്കല്ല്)',
          sanskritTerm: 'Pravṛtti-sāmarthya (प्रवृत्ति-सामर्थ്യ)',
          summary: 'പ്രമാണത്തിലൂടെ ലഭിക്കുന്ന ശരിയായ അറിവ് മാത്രമേ ഫലവത്തായ പ്രവൃത്തിയിലേക്ക് നയിക്കൂ. ദാഹിക്കുന്നവൻ വെള്ളം കണ്ട് അത് കുടിക്കുകയും ദാഹം മാറുകയും ചെയ്യുമ്പോൾ അറിവ് സത്യമാണെന്ന് തെളിയുന്നു. തെറ്റായ അറിവ് പ്രവൃത്തിയെ പരാജയപ്പെടുത്തുന്നു.',
          conceptId: 'pravritti-samarthya'
        },
        {
          title: 'പ്രമാണചതുഷ്ടയം (ജ്ഞാനത്തിന്റെ നാല് ഘടകങ്ങൾ)',
          sanskritTerm: 'Pramāṇa-Catuṣṭaya (प्रमाण-चतुष्टയ)',
          summary: 'അറിയുന്നവൻ (പ്രമാതാവ്), ഉപകരണം (പ്രമാണം), അറിയപ്പെടുന്ന വസ്തു (പ്രമേയം), ലഭിക്കുന്ന അറിവ് (പ്രമതി) എന്നിവയാണ് ജ്ഞാനത്തിന്റെ നാല് അടിസ്ഥാന ഘടകങ്ങൾ. ഇതിൽ പ്രമാണമാണ് ഏറ്റവും പ്രധാനപ്പെട്ട സാധകതമ കാരണം.',
          conceptId: 'pramana-catustaya'
        },
        {
          title: 'തത്ത്വം: സത്തും അസത്തും',
          sanskritTerm: 'Sat & Asat (तत्त्वम् सद्-असत्)',
          summary: 'ഉള്ളതിനെ ഉള്ളതായും ഇല്ലാത്തതിനെ ഇല്ലാത്തതായും മനസ്സിലാക്കുന്നതാണ് യാഥാർത്ഥ്യം. വിളക്കിന്റെ വെളിച്ചം അവിടെയുള്ള സാധനങ്ങളെ കാണിക്കുന്നതോടൊപ്പം അവിടെയില്ലാത്ത വസ്തുക്കളെയും വ്യക്തമാക്കുന്നു (ദീപദൃഷ്ടാന്തം).',
          conceptId: 'tattva-sat-asat'
        },
        {
          title: 'മോക്ഷത്തിന്റെ ചികിത്സാശാസ്ത്ര മാതൃക',
          sanskritTerm: 'Caturvyūha-Śāstra (ചതുർവ്യൂഹശാസ്ത്രം)',
          summary: 'രോഗം (ഹേയം), രോഗനിവൃത്തി (ഹാനം), ഔഷധം (ഉപായം - 16 പദാർത്ഥങ്ങൾ), പൂർണ്ണ ആരോഗ്യം (അധിഗന്തവ്യം/മോക്ഷം) എന്നിങ്ങനെ ആയുർവേദത്തിന് തുല്യമായാണ് ന്യായശാസ്ത്രം ചിട്ടപ്പെടുത്തിയിരിക്കുന്നത്.',
          conceptId: 'caturvyuha-shastra'
        },
        {
          title: 'ഇരുപത്തിയൊന്ന് ദുഃഖങ്ങൾ',
          sanskritTerm: 'Ekaviṃśati-Duḥkha (ഏകവിംശതി ദുഃഖം)',
          summary: 'ശരീരം, 6 ഇന്ദ്രിയങ്ങൾ, 6 വിഷയങ്ങൾ, 6 ബുദ്ധികൾ, ലൗകികസുഖം, മുഖ്യദുഃഖം എന്നിവയടക്കം മനുഷ്യൻ അനുഭവിക്കുന്ന 21 വിധത്തിലുള്ള ദുഃഖങ്ങളുടെ ശാശ്വത നിവൃത്തിയാണ് അപവർഗ്ഗം.',
          conceptId: 'ekavimshati-duhkha'
        },
        {
          title: 'പ്രമാണസംപ്ലവം (ഒന്നിലധികം വഴികളിലൂടെയുള്ള ബോധ്യം)',
          sanskritTerm: 'Pramāṇa-Saṃplava (പ്രമാണസംപ്ലവം)',
          summary: 'ഒരു വസ്തുവിനെത്തന്നെ കണ്ട് അറിയാനും, കേട്ട് അറിയാനും, അനുമാനിക്കാനും, വിശ്വസ്ത വചനത്തിലൂടെ അറിയാനും സാധിക്കും. പല പ്രമാണങ്ങൾ ഒരുമിച്ചു ചേരുമ്പോൾ സംശയങ്ങൾ നീങ്ങി സത്യം കൂടുതൽ ദൃഢമാകുന്നു.',
          conceptId: 'pramana-samplava'
        },
        {
          title: 'ചതസ്രോ വിദ്യാഃ (നാല് അടിസ്ഥാന ശാസ്ത്രങ്ങൾ)',
          sanskritTerm: 'Catasro Vidyāḥ (चतस्रो विद्याः)',
          summary: 'ത്രയീ, വാർത്ത, ദണ്ഡനീതി, ആൻവീക്ഷികീ എന്നീ നാല് ശാസ്ത്രങ്ങൾ. ന്യായം കേവലം ആത്മീയ വിദ്യയായി ചുരുങ്ങാതിരിക്കാനും സ്വതന്ത്ര യുക്തിശാസ്ത്രമായി നിലകൊള്ളാനുമാണ് 16 പദാർത്ഥങ്ങളെ വേർതിരിച്ച് പഠിപ്പിക്കുന്നത്.',
          conceptId: 'catasro-vidyah'
        },
        {
          title: 'പ്രമാണങ്ങളിലൂടെയുള്ള സത്യവിചാരം',
          sanskritTerm: 'Pramāṇair Artha-parīkṣaṇam (प्रमाणैरर्थपरीक्षणम्)',
          summary: 'പ്രമാണങ്ങളിലൂടെ വസ്തുതകളെ പരീക്ഷിച്ച് സത്യം ഉറപ്പിക്കുന്നതാണ് ന്യായം (അനു-ഈക്ഷാ). പ്രത്യക്ഷാനുഭവത്തിന് വിരുദ്ധമായ യുക്തികൾ ന്യായാഭാസമാണ് (കപട യുക്തി).',
          conceptId: 'anviksiki-nyaya'
        },
        {
          title: 'പഞ്ചാവയവങ്ങൾ: നാല് പ്രമാണങ്ങളുടെ സംയോജനം',
          sanskritTerm: 'Pañcāvayava-Pramāṇa-Saṃplava (पञ्चावयव-प्रमाणसंप्लव)',
          summary: 'അഞ്ചംഗ അനുമാനവാക്യം പരമോ ന്യായം ആകുന്നത് അത് നാല് പ്രമാണങ്ങളെയും ഒരൊറ്റ സത്യത്തിലേക്ക് സമന്വയിപ്പിക്കുന്നതിനാലാണ് (പ്രതിജ്ഞ=ശബ്ദം, ഹേതു=അനുമാനം, ഉദാഹരണം=പ്രത്യക്ഷം, ഉപനയം=ഉപമാനം, നിഗമനം=ഏകീകരണം).',
          conceptId: 'pancavayava-samplava'
        },
        {
          title: 'പ്രദീപഃ സർവ്വവിദ്യാനാം (എല്ലാ ശാസ്ത്രങ്ങളുടെയും വിളക്ക്)',
          sanskritTerm: 'Pradīpaḥ Sarvavidyānām (प्रदीपः सर्वविद्यानाम्)',
          summary: 'എല്ലാ ശാസ്ത്രങ്ങൾക്കും വെളിച്ചം നൽകുന്ന വിളക്കും, എല്ലാ കർമ്മങ്ങൾക്കും വഴികാട്ടിയും, ധർമ്മങ്ങളുടെയെല്ലാം അടിസ്ഥാനവുമാണ് ന്യായശാസ്ത്രം എന്ന് വാത്സ്യായന മഹർഷി സമർത്ഥിക്കുന്നു.',
          conceptId: 'pradipa-sarvavidyanam'
        }
      ]
    },
  },
  shakta: {
    systemId: 'shakta',
    headline: {
      en: 'The Non-Dual Metaphysics of Divine Energy and the Inner War of Consciousness',
      ml: 'പരാശക്തിയുടെ അദ്വൈത ദർശനവും സാധനാ-സമരത്തിന്റെ ആന്തരിക മനഃശാസ്ത്രവും'
    },
    summary: {
      en: "Śākta philosophy as embodied in the Devī Māhātmya establishes that Consciousness and Energy (Śiva and Śakti) are indivisibly one. Through the lens of Sādhana-Samara, the epic battles against Madhu-Kaiṭabha, Mahiṣāsura, and Śumbha-Niśumbha are revealed as the interior warfare of the human psyche: transmuting inertia into dynamism, and conquering the shapeshifting ego and self-replicating desires through transcendent witness-awareness to attain supreme liberation.",
      ml: "ദേവീമാഹാത്മ്യത്തിൽ പ്രതിപാദിച്ചിരിക്കുന്ന ശാക്തദർശനം ശുദ്ധചൈതന്യവും ശക്തിയും (ശിവനും ശക്തിയും) ഒന്നുതന്നെയാണെന്ന പരമ അദ്വൈതത്തെ സ്ഥാപിക്കുന്നു. 'സാധനാ-സമരം' എന്ന ദൃഷ്ടിയിലൂടെ മധുകൈടഭന്മാർ, മഹിഷാസുരൻ, ശുംഭനിശുംഭന്മാർ എന്നിവർക്കെതിരെയുള്ള യുദ്ധങ്ങൾ ബാഹ്യമായ കഥകളല്ല; മറിച്ച് സാധകന്റെ അന്തഃകരണത്തിൽ ജഡതയ്ക്കും കാമരൂപിയായ അഹങ്കാരത്തിനും വാസനാപ്രവാഹങ്ങൾക്കുമെതിരെ നടക്കുന്ന ആന്തരിക ആധ്യാത്മിക പോരാട്ടമാണ്."
    },
    pillars: {
      en: [
        {
          title: 'The Inner Warfare of Consciousness',
          sanskritTerm: 'Sādhana-Samara (साधना-समर)',
          summary: 'The systematic decoding of the Devī Māhātmya as the psychological and yogic battle of the aspirant against inertia (Madhu), obstinacy (Kaiṭabha), animal ego (Mahiṣāsura), and multiplicitous desires (Raktabīja).',
          conceptId: 'sadhana-samara'
        },
        {
          title: 'The Dual Sovereign Power of God',
          sanskritTerm: 'Mahāmāyā (महामाया)',
          summary: 'The transcendent power of the Divine that veils truth (Avidyā) to project cosmic multiplicity, yet when propitiated with devotion, dissolves ignorance and grants supreme liberation (Vidyā).',
          conceptId: 'mahamaya'
        },
        {
          title: 'Consciousness as the Ground of Being',
          sanskritTerm: 'Cit-Śakti (चित्-शक्ति)',
          summary: 'The recognition that every mental modification—intellect, hunger, sleep, faith, and memory—is a living vibration of the Mother of the Universe.',
          conceptId: 'cit-shakti'
        },
        {
          title: 'The Non-Dual Declaration',
          sanskritTerm: 'Advaita-Ghoṣa (एकैवाहं जगत्यत्र)',
          summary: "The ultimate climax where the Mother reveals all multiplicity and distinct divine powers as Her own emanations, leaving the Self alone in solitary, infinite majesty.",
          conceptId: 'shumbha-nishumbha'
        }
      ],
      ml: [
        {
          title: 'ആന്തരിക ആധ്യാത്മിക സമരം',
          sanskritTerm: 'സാധനാ-സമരം (Sādhana-Samara)',
          summary: 'ദേവീമാഹാത്മ്യത്തെ സാധകന്റെ അന്തഃകരണത്തിലെ യോഗികവും മനഃശാസ്ത്രപരവുമായ സമഗ്ര പോരാട്ടമായി ഗ്രഹിക്കൽ.',
          conceptId: 'sadhana-samara'
        },
        {
          title: 'മഹാമായാ തത്ത്വം',
          sanskritTerm: 'മഹാമായാ (Mahāmāyā)',
          summary: 'അവിദ്യാപൂർണ്ണമായ ബന്ധനത്തിനും അതേസമയം സമ്പൂർണ്ണ ശരണാഗതിയിലൂടെ മോക്ഷം നൽകുന്നതിനുമുള്ള പരമേശ്വരന്റെ പരമശക്തി.',
          conceptId: 'mahamaya'
        },
        {
          title: 'ചിത്-ശക്തി',
          sanskritTerm: 'ചിത്-ശക്തി (Cit-Śakti)',
          summary: 'മനസ്സിന്റെ സമസ്ത വൃത്തികളിലും (ബുദ്ധി, നിദ്ര, വിശപ്പ്, ശ്രദ്ധ) ജഗന്മാതാവിന്റെ ചൈതന്യസ്പന്ദനം ദർശിക്കൽ.',
          conceptId: 'cit-shakti'
        },
        {
          title: 'പരമ അദ്വൈത പ്രഖ്യാപനം',
          sanskritTerm: 'അദ്വൈതഘോഷം (ഏകൈവാഹം ജഗത്യത്ര)',
          summary: 'ഈ പ്രപഞ്ചത്തിൽ അമ്മയല്ലാതെ മറ്റൊന്നുമില്ലെന്നും സമസ്ത ഭേദങ്ങളും അമ്മയിൽ ലയിക്കുന്നെന്നും വ്യക്തമാക്കുന്ന പരമോന്നത സത്യം.',
          conceptId: 'shumbha-nishumbha'
        }
      ]
    },
  },
  'kundalini-tantra': {
    systemId: 'kundalini-tantra',
    headline: {
      en: 'The Dormant Serpent Power, the Chakra Ladder, and the Science of Awakening'
    },
    summary: {
      en: "Swami Satyananda Saraswati's Kundalini Tantra (Yoga Publications Trust, 1984/2016) synthesizes Tantra and Yoga into one program: a dormant force at the spine-base (kundalini-shakti) rises through the chakra-switches via sushumna to light the sleeping brain and unite with Shiva in sahasrara — then descends, returning the realised being to ordinary life as play. The book maps ten methods of awakening, the ethics of preparation (guru, twelve years, sushumna first, diet, seclusion, karma yoga), the phenomenology of the crisis, a full chakra-by-chakra and kriya-by-kriya sadhana, and a closing research dossier on nadis, chakras and cross-cultural evidence. This app encodes it as a concepts-only text: original summaries, no verbatim prose."
    },
    pillars: {
      en: [
        {
          title: 'The Dormant Force and Its Two Faces',
          sanskritTerm: 'Kuṇḍalinī-śakti (कुण्डलिनी-शक्ति)',
          summary: 'A bodily dormant energy at mooladhara whose uncontrolled irruption is Kali and whose mastered power is Durga; the serpent of three-and-a-half coils encodes time, the gunas and the states of consciousness plus transcendence.',
          conceptId: 'kundalini-shakti'
        },
        {
          title: 'Four Awakenings in Strict Order',
          sanskritTerm: 'Nāḍī-Cakra-Suṣumṇā-Kuṇḍalinī',
          summary: 'Discipline ida-pingala, awaken the chakras mildly, awaken sushumna (kumbhaka, maha mudra), then awaken kundalini. Ida yields the prophet, pingala the healer, only sushumna the jivanmukta.',
          conceptId: 'fourfold-awakening'
        },
        {
          title: 'The Chakra Ladder of Evolution',
          sanskritTerm: 'Ṣaṭ-Cakra (षट्-चक्र)',
          summary: 'From mooladhara (root, animal crown) through desire, fire, heart, throat and nectar-point to ajna (command) and sahasrara (union) — each centre a switch for body-systems and sleeping brain-territory.',
          conceptId: 'chakra-system'
        },
        {
          title: 'Kriya Yoga as the Gradual Royal Road',
          sanskritTerm: 'Kriyā-yoga (क्रिया-योग)',
          summary: 'Twenty kriyas with bandhas and breath-mantra synchrony that wake the queen by degrees — no confrontation with mind — suited to modern rajasic temperaments; the safe alternative to explosive pranayama.',
          conceptId: 'kriya-yoga-path'
        },
        {
          title: 'Ascent Completed by Descent',
          sanskritTerm: 'Ārohaṇa-Avarohaṇa (आरोहण-अवरोहण)',
          summary: 'After non-dual union in sahasrara, bindu splits and Shiva-Shakti descend together; the realised being re-inhabits duality as play (lila) — junior god, guru, avatara.',
          conceptId: 'descent-avatar'
        }
      ]
    },
  },
  tantra: {
    systemId: 'tantra',
    headline: {
      en: 'The Non-Dual Science of Śakti — Goddess, Energy and Recognition'
    },
    summary: {
      en: "Tantra is the woven scripture that saves by expanding: revelation (Āgama) for an age too thin for the outer sacrifice, teaching that enjoyment itself becomes liberation because the world is Śakti's own body. This system unites four texts on one path — the Devī Māhātmya (the goddess and the inner war), Kuṇḍalinī Tantra (the serpent power and its ascent), the Tantrāloka (Abhinavagupta's recognition metaphysics), and Tantra-Siddhānta, this app's own synthesis of Trika, Krama, Kula, Spanda, Pratyabhijñā and Śrīvidyā: thirty-six principles, three stains, four means, and the crown of living liberation."
    },
    pillars: {
      en: [
        {
          title: 'The Woven Scripture',
          sanskritTerm: 'Tantra (तन्त्र)',
          summary: 'A scripture that weaves rite, metaphysics and yoga into one fabric and saves by expanding awareness — śruti, smṛti, and then Āgama for the Kali age.',
          conceptId: 'tantra-name'
        },
        {
          title: 'Enjoyment as Liberation',
          sanskritTerm: 'Bhukti-mukti (भुक्ति-मुक्ति)',
          summary: 'The world is Śakti\'s body rather than a trap, so rightly-known experience is worship; the body is declared a temple and the householder a candidate.',
          conceptId: 'bhukti-mukti'
        },
        {
          title: 'Thirty-Six Principles',
          sanskritTerm: 'Ṣaṭ-triṃśat-tattva (षट्त्रिंशत्-तत्त्व)',
          summary: 'Five pure principles of subjectivity, māyā with her five cloaks plus puruṣa, and the twenty-four lower principles Sāṃkhya mapped as the basement.',
          conceptId: 'pure-tattvas'
        },
        {
          title: 'Four Means for Four Densities',
          sanskritTerm: 'Catur-upāya (चतुर्-उपाय)',
          summary: 'Action-means for the dense, thought-means for the subtle, will-flash for the ripe, and no-means for those grace has loosened.',
          conceptId: 'four-upayas'
        },
        {
          title: 'The Inner Warfare',
          sanskritTerm: 'Sādhana-Samara (साधना-समर)',
          summary: 'The Devī Māhātmya decoded as the aspirant\'s psychological battle: inertia, ego-power and luminous pride conquered by one awareness at three altitudes.',
          conceptId: 'sadhana-samara'
        },
        {
          title: 'Recognition, Not Attainment',
          sanskritTerm: 'Pratyabhijñā (प्रत्यभिज्ञा)',
          summary: 'The self was never bound; memory itself refutes momentariness. Practice is remembrance — "I am Śiva" — until the contracted I loosens.',
          conceptId: 'pratyabhijna'
        },
        {
          title: 'The Serpent Power',
          sanskritTerm: 'Kuṇḍalinī-śakti (कुण्डलिनी-शक्ति)',
          summary: 'The dormant bodily force rising by suṣumṇā through the chakra-switches to light the sleeping brain — terrible Kālī unhandled, beneficent Durgā mastered.',
          conceptId: 'kundalini-shakti'
        },
        {
          title: 'Chakra Iconography as Practice Manual',
          sanskritTerm: 'Cakra-cihna (चक्र-चिह्न)',
          summary: 'Petals, seed-syllables, elements, animals and guardian shaktis station by station — every picture a meditation object, from the root\'s yellow square to the crown\'s thousand petals.',
          conceptId: 'mooladhara-symbolism'
        },
        {
          title: 'The Twenty-Kriyā Ladder',
          sanskritTerm: 'Viṃśati-kriyā (विंशति-क्रिया)',
          summary: 'Nine eyes-open conductings clearing the passages, eleven eyes-closed seals culminating in the great seals — strict order, each rung opening the gate the next walks through.',
          conceptId: 'twenty-kriyas'
        }
      ]
    },
  }
};

export const getSystemOverview = (systemId: string): SystemOverviewData | undefined => {
  return systemOverviews[systemId];
};
