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
      en: 'The Dormant Serpent Power, the Chakra Ladder, and the Science of Awakening',
      ml: 'ഉറങ്ങുന്ന സർപ്പശക്തിയും ചക്രഗോവണിയും ഉണർവ്വിന്റെ ശാസ്ത്രവും'
    },
    summary: {
      en: "Kundalini Tantra synthesizes Tantra and Yoga into one program: a dormant force at the spine-base (kundalini-shakti) rises through the chakra-switches via sushumna to light the sleeping brain and unite with Shiva in sahasrara — then descends, returning the realised being to ordinary life as play. The teaching maps ten methods of awakening, the ethics of preparation (guru, twelve years, sushumna first, diet, seclusion, karma yoga), the phenomenology of the crisis, a full chakra-by-chakra and kriya-by-kriya sadhana, and a closing research dossier on nadis, chakras and cross-cultural evidence. This app encodes it as a concepts-only text: original summaries in our own words, no borrowed prose.",
      ml: "തന്ത്രത്തെയും യോഗത്തെയും ഒരൊറ്റ പരിപാടിയായി സമന്വയിപ്പിക്കുന്നു കുണ്ഡലിനീതന്ത്രം: നട്ടെല്ലിന്റെ അടിയിലെ ഉറങ്ങുന്ന ശക്തി (കുണ്ഡലിനീശക്തി) സുഷുമ്നയിലൂടെ ചക്രസ്വിച്ചുകളിലൂടെ ഉയർന്ന് ഉറങ്ങുന്ന മസ്തിഷ്കത്തെ പ്രകാശിപ്പിച്ച് സഹസ്രാരത്തിൽ ശിവനുമായി യോഗം ചെയ്യുന്നു — പിന്നെ ഇറങ്ങിവന്ന്, സാക്ഷാത്കരിച്ചവൻ സാധാരണ ജീവിതത്തിലേക്ക് ലീലയായി മടങ്ങുന്നു. ഉണർവ്വിന്റെ പത്ത് മാർഗ്ഗങ്ങൾ, ഒരുക്കത്തിന്റെ നൈതികത (ഗുരു, പന്ത്രണ്ട് വർഷം, ആദ്യം സുഷുമ്ന, ആഹാരം, ഏകാന്തവാസം, കർമ്മയോഗം), പ്രതിസന്ധിയുടെ പ്രതിഭാസശാസ്ത്രം, ചക്രംതോറും ക്രിയതോറുമുള്ള പൂർണ്ണ സാധന, നാഡീ-ചക്ര ഗവേഷണരേഖ എന്നിവയെല്ലാം ഇവിടെ മാപ്പ് ചെയ്യപ്പെടുന്നു."
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
      ],
      ml: [
        {
          title: 'ഉറങ്ങുന്ന ശക്തിയും അതിന്റെ രണ്ട് മുഖങ്ങളും',
          sanskritTerm: 'കുണ്ഡലിനീശക്തി (Kuṇḍalinī-śakti)',
          summary: 'മൂലാധാരത്തിലെ ശാരീരികമായ ഉറങ്ങുന്ന ഊർജ്ജം; നിയന്ത്രണമില്ലാത്ത പൊട്ടിത്തെറി കാളിയും, സാധനയാൽ വരുതിയിലാക്കിയ ശക്തി ദുർഗ്ഗയുമാണ്. മൂന്നര ചുറ്റുള്ള സർപ്പം കാലത്തെയും ഗുണങ്ങളെയും ബോധാവസ്ഥകളെയും അതീതത്തെയും സൂചിപ്പിക്കുന്നു.',
          conceptId: 'kundalini-shakti'
        },
        {
          title: 'കർശനമായ ക്രമത്തിൽ നാല് ഉണർവ്വുകൾ',
          sanskritTerm: 'നാഡീ-ചക്ര-സുഷുമ്നാ-കുണ്ഡലിനി',
          summary: 'ഇഡാപിംഗലകളെ അച്ചടക്കപ്പെടുത്തൂ, ചക്രങ്ങളെ മിതമായി ഉണർത്തൂ, സുഷുമ്നയെ ഉണർത്തൂ (കുംഭകം, മഹാമുദ്ര), പിന്നെ കുണ്ഡലിനിയെ ഉണർത്തൂ. ഇഡ പ്രവാചകനെയും പിംഗല രോഗശാന്തിക്കാരനെയും, സുഷുമ്ന മാത്രം ജീവന്മുക്തനെയും നൽകുന്നു.',
          conceptId: 'fourfold-awakening'
        },
        {
          title: 'പരിണാമത്തിന്റെ ചക്രഗോവണി',
          sanskritTerm: 'ഷട്ചക്രം (Ṣaṭ-Cakra)',
          summary: 'മൂലാധാരം (മൂലം, മൃഗകിരീടം) മുതൽ ആഗ്രഹം, അഗ്നി, ഹൃദയം, കണ്ഠം, അമൃതബിന്ദു വഴി ആജ്ഞ (ആജ്ഞ) യിലേക്കും സഹസ്രാര (യോഗം) ത്തിലേക്കും — ഓരോ കേന്ദ്രവും ശരീരവ്യവസ്ഥകൾക്കും ഉറങ്ങുന്ന മസ്തിഷ്കപ്രദേശങ്ങൾക്കുമുള്ള സ്വിച്ച്.',
          conceptId: 'chakra-system'
        },
        {
          title: 'ക്രിയായോഗം — ക്രമാനുഗതമായ രാജപാത',
          sanskritTerm: 'ക്രിയായോഗം (Kriyā-yoga)',
          summary: 'ബന്ധങ്ങളോടെയും ശ്വാസ-മന്ത്ര സമന്വയത്തോടെയും ഇരുപത് ക്രിയകൾ റാണിയെ പടിപടിയായി ഉണർത്തുന്നു — മനസ്സിനോട് ഏറ്റുമുട്ടലില്ല — ആധുനിക രാജസിക മനസ്സിന് അനുയോജ്യം; സ്ഫോടനാത്മകമായ പ്രാണായാമത്തിന് സുരക്ഷിതമായ ബദൽ.',
          conceptId: 'kriya-yoga-path'
        },
        {
          title: 'അവരോഹണത്താൽ പൂർത്തിയാകുന്ന ആരോഹണം',
          sanskritTerm: 'ആരോഹണ-അവരോഹണം (Ārohaṇa-Avarohaṇa)',
          summary: 'സഹസ്രാരത്തിലെ അദ്വൈതയോഗത്തിന് ശേഷം ബിന്ദു വിഭജിക്കുകയും ശിവശക്തിമാർ ഒരുമിച്ച് ഇറങ്ങിവരികയും ചെയ്യുന്നു; സാക്ഷാത്കരിച്ചവൻ ദ്വൈതത്തെ ലീലയായി പുനർവാസം ചെയ്യുന്നു — ഗുരു, അവതാരം.',
          conceptId: 'descent-avatar'
        }
      ]
    },
  },
  tantra: {
    systemId: 'tantra',
    headline: {
      en: 'The Non-Dual Science of Śakti — Goddess, Energy and Recognition',
      ml: 'ശക്തിയുടെ അദ്വൈതശാസ്ത്രം — ദേവി, ഊർജ്ജം, പ്രത്യഭിജ്ഞ'
    },
    summary: {
      en: "Tantra is the woven scripture that saves by expanding: revelation (Āgama) for an age too thin for the outer sacrifice, teaching that enjoyment itself becomes liberation because the world is Śakti's own body. This system unites six book-extracted root texts on one path — the Devī Māhātmya (the goddess and the inner war, via Sādhana-Samara), Kuṇḍalinī Tantra (the serpent power and its ascent), the Lalitā Sahasranāma (Śrīvidyā's complete icon), the Śiva-sūtras (recognition aphorisms), the Spanda-kārikās (dynamic pulsation) and the Tantrāloka (Abhinavagupta's recognition metaphysics) — closed by a study companion synthesising Kamalakar Mishra's Kashmir Shaivism: The Central Philosophy of Tantrism (abhasavada, evil and karma, the four means, Kaula sublimation), each lightly touched and paraphrased into this app's own summaries.",
      ml: "വികസിപ്പിച്ച് രക്ഷിക്കുന്ന നെയ്ത ശാസ്ത്രമാണ് തന്ത്രം: ബാഹ്യയാഗത്തിന് ശേഷിയില്ലാത്ത കലിയുഗത്തിനുള്ള വെളിപാട് (ആഗമം), ലോകം ശക്തിയുടെ സ്വന്തം ശരീരമായതിനാൽ ഭോഗം തന്നെ മോക്ഷമാകുന്നു എന്ന് പഠിപ്പിക്കുന്നു. ഈ വ്യവസ്ഥ മൂന്ന് ഗ്രന്ഥങ്ങളെ ഒരൊറ്റ പാതയിൽ യോജിപ്പിക്കുന്നു — ദേവീമാഹാത്മ്യം (ദേവിയും ആന്തരിക സമരവും, സാധനാ-സമരത്തിലൂടെ), കുണ്ഡലിനീതന്ത്രം (സർപ്പശക്തിയും ഉയർച്ചയും), തന്ത്രാലോകം (അഭിനവഗുപ്തന്റെ പ്രത്യഭിജ്ഞാ തത്ത്വശാസ്ത്രം)."
    },
    pillars: {
      en: [
        {
          title: 'The Woven Scripture',
          sanskritTerm: 'Tantra (तन्त्र)',
          summary: 'A scripture that weaves rite, metaphysics and yoga into one fabric and saves by expanding awareness — śruti, smṛti, and then Āgama for the Kali age.',
          conceptId: 'tantra-darshana'
        },
        {
          title: 'Enjoyment as Liberation',
          sanskritTerm: 'Bhukti-mukti (भुक्ति-मुक्ति)',
          summary: 'The world is Śakti\'s body rather than a trap, so rightly-known experience is worship; the body is declared a temple and the householder a candidate.',
          conceptId: 'jivanmukti'
        },
        {
          title: 'Thirty-Six Principles',
          sanskritTerm: 'Ṣaṭ-triṃśat-tattva (षट्त्रिंशत्-तत्त्व)',
          summary: 'Five pure principles of subjectivity, māyā with her five cloaks plus puruṣa, and the twenty-four lower principles Sāṃkhya mapped as the basement.',
          conceptId: 'sadasiva-tattva'
        },
        {
          title: 'Four Means for Four Densities',
          sanskritTerm: 'Catur-upāya (चतुर्-उपाय)',
          summary: 'Action-means for the dense, thought-means for the subtle, will-flash for the ripe, and no-means for those grace has loosened.',
          conceptId: 'upaya-upeya-bhava'
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
        },
        {
          title: 'Appearance Is Real',
          sanskritTerm: 'Ābhāsavāda (आभासवाद)',
          summary: 'The world as consciousness extended into form — ideal yet real, dreamed by the cosmic mind and therefore objective for us; appearance-theory is freedom-theory, since appearing is what free consciousness does.',
          conceptId: 'mishra-abhasavada'
        },
        {
          title: 'Sublimation Through Holiness',
          sanskritTerm: 'Kaula-sādhanā (कौलसाधना)',
          summary: 'Sexual power sublimated works wonders and suppressed merely ferments; met as holy offering between perceived divinities, instinct is redirected by love into illumination rather than indulgence or repression.',
          conceptId: 'mishra-kaula-sadhana'
        }
      ],
      ml: [
        {
          title: 'നെയ്ത ശാസ്ത്രം',
          sanskritTerm: 'തന്ത്രം (Tantra)',
          summary: 'കർമ്മം, തത്ത്വശാസ്ത്രം, യോഗം എന്നിവ ഒരൊറ്റ തുണിയായി നെയ്യുന്ന ശാസ്ത്രം, അവബോധം വികസിപ്പിച്ച് രക്ഷിക്കുന്നു — ശ്രുതി, സ്മൃതി, പിന്നെ കലിയുഗത്തിന് ആഗമം.',
          conceptId: 'tantra-darshana'
        },
        {
          title: 'മോചനമായി ഭോഗം',
          sanskritTerm: 'ഭുക്തി-മുക്തി (Bhukti-mukti)',
          summary: 'ലോകം കെണിയല്ല, ശക്തിയുടെ ശരീരമാണ്; അതിനാൽ ശരിയായി അറിയപ്പെട്ട അനുഭവം ആരാധനയാണ്. ശരീരം ക്ഷേത്രമായും ഗൃഹസ്ഥൻ അർഹനായും പ്രഖ്യാപിക്കപ്പെടുന്നു.',
          conceptId: 'jivanmukti'
        },
        {
          title: 'മുപ്പത്തിയാറ് തത്ത്വങ്ങൾ',
          sanskritTerm: 'ഷട്ത്രിംശത്തത്ത്വം (Ṣaṭ-triṃśat-tattva)',
          summary: 'വിഷയിത്വത്തിന്റെ അഞ്ച് ശുദ്ധതത്ത്വങ്ങൾ, അഞ്ച് മറകളോടെയുള്ള മായയും പുരുഷനും, സാംഖ്യം മാപ്പ് ചെയ്ത ഇരുപത്തിനാല് താഴ്ന്ന തത്ത്വങ്ങൾ അടിത്തറയായി.',
          conceptId: 'sadasiva-tattva'
        },
        {
          title: 'നാല് സാന്ദ്രതകൾക്ക് നാല് ഉപായങ്ങൾ',
          sanskritTerm: 'ചതുരുപായം (Catur-upāya)',
          summary: 'സ്ഥൂലർക്ക് കർമ്മോപായം, സൂക്ഷ്മർക്ക് ജ്ഞാനോപായം, പാകമായവർക്ക് ഇച്ഛാസ്ഫുരണം, കൃപ അയച്ചവർക്ക് ഉപായരഹിതം.',
          conceptId: 'upaya-upeya-bhava'
        },
        {
          title: 'ആന്തരിക സമരം',
          sanskritTerm: 'സാധനാ-സമരം (Sādhana-Samara)',
          summary: 'ദേവീമാഹാത്മ്യം സാധകന്റെ മനഃശാസ്ത്രപരമായ യുദ്ധമായി വ്യാഖ്യാനിക്കപ്പെടുന്നു: ജഡത്വം, അഹങ്കാരശക്തി, പ്രകാശമായ അഭിമാനം എന്നിവ മൂന്ന് തലങ്ങളിൽ ഒരേ അവബോധത്താൽ ജയിക്കപ്പെടുന്നു.',
          conceptId: 'sadhana-samara'
        },
        {
          title: 'പ്രാപ്തിയല്ല, പ്രത്യഭിജ്ഞ',
          sanskritTerm: 'പ്രത്യഭിജ്ഞ (Pratyabhijñā)',
          summary: "ആത്മാവ് ഒരിക്കലും ബന്ധിക്കപ്പെട്ടിരുന്നില്ല; ഓർമ്മ തന്നെ ക്ഷണികത്വത്തെ ഖണ്ഡിക്കുന്നു. ചുരുങ്ങിയ ഞാൻ അയയുന്നതുവരെ അഭ്യാസം ഓർമ്മയാണ് — 'ഞാൻ ശിവനാണ്'.",
          conceptId: 'pratyabhijna'
        },
        {
          title: 'സർപ്പശക്തി',
          sanskritTerm: 'കുണ്ഡലിനീശക്തി (Kuṇḍalinī-śakti)',
          summary: 'സുഷുമ്നയിലൂടെ ചക്രസ്വിച്ചുകളിലൂടെ ഉയർന്ന് ഉറങ്ങുന്ന മസ്തിഷ്കത്തെ പ്രകാശിപ്പിക്കുന്ന ശാരീരിക ശക്തി — കൈകാര്യം ചെയ്തില്ലെങ്കിൽ ഭയങ്കരയായ കാളി, വരുതിയിലാക്കിയാൽ ഉപകാരിയായ ദുർഗ്ഗ.',
          conceptId: 'kundalini-shakti'
        },
        {
          title: 'അഭ്യാസഗ്രന്ഥമായി ചക്രപ്രതീകങ്ങൾ',
          sanskritTerm: 'ചക്രചിഹ്നം (Cakra-cihna)',
          summary: 'ഇതളുകൾ, ബീജാക്ഷരങ്ങൾ, ഭൂതങ്ങൾ, മൃഗങ്ങൾ, കാവൽ ശക്തിമാർ നിലയംതോറും — ഓരോ ചിത്രവും ഒരു ധ്യാനവസ്തു, മൂലത്തിന്റെ മഞ്ഞ ചതുരം മുതൽ കിരീടത്തിന്റെ ആയിരം ഇതളുകൾ വരെ.',
          conceptId: 'mooladhara-symbolism'
        },
        {
          title: 'ഇരുപത് ക്രിയകളുടെ ഗോവണി',
          sanskritTerm: 'വിംശതിക്രിയ (Viṃśati-kriyā)',
          summary: 'പാതകൾ ശുദ്ധീകരിക്കുന്ന ഒമ്പത് കണ്ണുതുറന്ന വഹനങ്ങൾ, മഹാമുദ്രകളിൽ കലാശിക്കുന്ന പതിനൊന്ന് കണ്ണടച്ച മുദ്രകൾ — കർശനമായ ക്രമം, ഓരോ പടിയും അടുത്തത് കടക്കുന്ന കവാടം തുറക്കുന്നു.',
          conceptId: 'twenty-kriyas'
        }
      ]
    },
  },
  samkhya: {
    systemId: 'samkhya',
    headline: {
      en: 'Discrimination Between Spirit and Matter — the Twenty-Five Principles',
      ml: 'പുരുഷ-പ്രകൃതി വിവേകം — ഇരുപത്തിയഞ്ച് തത്ത്വങ്ങൾ'
    },
    summary: {
      en: "Sāṃkhya is India's oldest systematic dualism: two ultimate realities — conscious Puruṣa (the witness) and unconscious Prakṛti (nature) — whose proximity starts the evolution of twenty-five tattvas, from intellect and ego down to the five gross elements. Suffering (the threefold duḥkha) exists because Puruṣa misidentifies with Prakṛti's transformations; liberation (kaivalya) is the discriminative knowledge that separates the seer from the seen.",
      ml: "ഭാരതത്തിലെ ഏറ്റവും പുരാതനമായ വ്യവസ്ഥാപിത ദ്വൈതമാണ് സാംഖ്യം: രണ്ട് പരമ യാഥാർത്ഥ്യങ്ങൾ — ബോധമായ പുരുഷൻ (സാക്ഷി), അചേതനമായ പ്രകൃതി — അവയുടെ സാമീപ്യം ബുദ്ധിയും അഹങ്കാരവും മുതൽ അഞ്ച് സ്ഥൂലഭൂതങ്ങൾ വരെ ഇരുപത്തിയഞ്ച് തത്ത്വങ്ങളുടെ പരിണാമം തുടങ്ങുന്നു. പ്രകൃതിയുടെ പരിണാമങ്ങളുമായി പുരുഷൻ തെറ്റായി തിരിച്ചറിയുന്നതിനാലാണ് ദുഃഖം (ത്രിവിധ ദുഃഖം); ദ്രഷ്ടാവിനെ ദൃശ്യത്തിൽ നിന്ന് വേർതിരിക്കുന്ന വിവേകജ്ഞാനമാണ് മോചനം (കൈവല്യം)."
    },
    pillars: {
      en: [
        {
          title: 'The Threefold Suffering',
          sanskritTerm: 'Duḥkha-traya (दुःख-त्रय)',
          summary: 'Suffering from one\'s own body-mind, from other beings, and from forces beyond control — naming this is the very reason to inquire.',
          conceptId: 'duhkha-traya'
        },
        {
          title: 'The Effect Pre-Exists in the Cause',
          sanskritTerm: 'Satkāryavāda (सत्कार्यवाद)',
          summary: 'Nothing comes from nothing: the effect already exists latently in its material cause; manifestation only makes it visible.',
          conceptId: 'satkaryavada'
        },
        {
          title: 'The Twenty-Five Tattvas',
          sanskritTerm: 'Pañcaviṃśati-tattva (पञ्चविंशति-तत्त्व)',
          summary: 'Root-nature, seven principles that are both product and producer, sixteen that are only product, and Puruṣa which is neither.',
          conceptId: 'twenty-five-tattvas'
        },
        {
          title: 'The Three Strands of Nature',
          sanskritTerm: 'Triguṇa (त्रिगुण)',
          summary: 'Sattva, rajas and tamas — illumination, movement and restraint — cooperate like wick, oil and flame in one lamp.',
          conceptId: 'three-gunas'
        },
        {
          title: 'Five Proofs of the Witness',
          sanskritTerm: 'Puruṣa-siddhi (पुरुष-सिद्धि)',
          summary: 'Assemblages serve another; something must reverse the three-guṇa world; experience needs a supervisor and an enjoyer; and the drive toward release cannot belong to insentient Buddhi.',
          conceptId: 'purusha-proofs'
        },
        {
          title: 'The Thirteen Instruments',
          sanskritTerm: 'Trayodaśa-karaṇa (त्रयोदश-करण)',
          summary: 'Ten external organs plus three internal ones move by mutual impulse alone toward enjoyment and release; senses are doors, the inner triad the door-keeper, the five vital airs the common function.',
          conceptId: 'karana-trayodasa'
        },
        {
          title: 'The Fiftyfold Intellectual Creation',
          sanskritTerm: 'Pratyaya-sarga (प्रत्यय-सर्ग)',
          summary: 'Five false knowledges, twenty-eight incapacities, nine complacencies and eight attainments — fifty dispositions churned from the guṇas’ disturbance of equilibrium.',
          conceptId: 'pratyaya-sarga'
        },
        {
          title: 'Discrimination as “I Am Not”',
          sanskritTerm: 'Viveka-khyāti (विवेक-ख्याति)',
          summary: 'Seven of Buddhi’s eight forms bind; jñāna alone releases — “I am not this, nothing is mine, I do not exist as this” — after which delicate Prakṛti, like a seen dancer, withdraws forever.',
          conceptId: 'viveka-khyati'
        },
        {
          title: 'Living Release and Final Release',
          sanskritTerm: 'Jīvanmukti–Videhamukti (जीवन्मुक्ति–विदेहमुक्ति)',
          summary: 'The body persists a while on saṃskāra-momentum like a potter’s wheel after the hand is lifted; when it falls, kaivalya certain and irreversible follows.',
          conceptId: 'jivan-videha-mukti'
        },
        {
          title: 'Isolation as Freedom',
          sanskritTerm: 'Kaivalya (कैवल्य)',
          summary: 'Liberation is Puruṣa resting alone in its own nature, forever disentangled from Prakṛti\'s dance.',
          conceptId: 'kaivalya-samkhya'
        }
      ],
      ml: [
        {
          title: 'ത്രിവിധ ദുഃഖം',
          sanskritTerm: 'ദുഃഖത്രയം (Duḥkha-traya)',
          summary: 'സ്വന്തം ശരീര-മനസ്സിൽ നിന്നും, മറ്റ് ജീവികളിൽ നിന്നും, നിയന്ത്രണാതീതമായ ശക്തികളിൽ നിന്നുമുള്ള ദുഃഖം — ഇതിനെ പേര് വിളിക്കുന്നതാണ് അന്വേഷണത്തിന്റെ കാരണം.',
          conceptId: 'duhkha-traya'
        },
        {
          title: 'കാരണത്തിൽ ഫലം മുൻകൂട്ടിയുണ്ട്',
          sanskritTerm: 'സത്കാര്യവാദം (Satkāryavāda)',
          summary: 'ഇല്ലായ്മയിൽ നിന്ന് ഒന്നും ഉണ്ടാകുന്നില്ല: ഫലം അതിന്റെ ഭൗതികകാരണത്തിൽ അന്തർലീനമായി മുൻകൂട്ടിയുണ്ട്; പ്രകടനം അതിനെ ദൃശ്യമാക്കുക മാത്രം.',
          conceptId: 'satkaryavada'
        },
        {
          title: 'ഇരുപത്തിയഞ്ച് തത്ത്വങ്ങൾ',
          sanskritTerm: 'പഞ്ചവിംശതിതത്ത്വം (Pañcaviṃśati-tattva)',
          summary: 'മൂലപ്രകൃതി, ഉത്പന്നവും ഉത്പാദകവുമായ ഏഴ് തത്ത്വങ്ങൾ, ഉത്പന്നം മാത്രമായ പതിനാറ്, ഒന്നുമല്ലാത്ത പുരുഷൻ.',
          conceptId: 'twenty-five-tattvas'
        },
        {
          title: 'പ്രകൃതിയുടെ മൂന്ന് ഗുണങ്ങൾ',
          sanskritTerm: 'ത്രിഗുണം (Triguṇa)',
          summary: 'സത്ത്വം, രജസ്സ്, തമസ്സ് — പ്രകാശം, ചലനം, നിയന്ത്രണം — ഒരു വിളക്കിൽ തിരിയും എണ്ണയും ജ്വാലയും പോലെ സഹകരിക്കുന്നു.',
          conceptId: 'three-gunas'
        },
        {
          title: 'പുരുഷന് അഞ്ച് തെളിവുകൾ',
          sanskritTerm: 'പുരുഷസിദ്ധി (Puruṣa-siddhi)',
          summary: 'കൂട്ടിച്ചേർക്കപ്പെട്ടതെല്ലാം മറ്റൊന്നിനുവേണ്ടി; ത്രിഗുണലോകത്തിന് വിപരീതമായി ഒന്ന് വേണം; അധിഷ്ഠാനവും ഭോക്താവും വേണം; മോക്ഷാഭിലാഷം ബുദ്ധിയുടേതാകില്ല.',
          conceptId: 'purusha-proofs'
        },
        {
          title: 'പതിമൂന്ന് കരണങ്ങൾ',
          sanskritTerm: 'ത്രയോദശകരണം (Trayodaśa-karaṇa)',
          summary: 'പത്ത് ബാഹ്യവും മൂന്ന് ആന്തരികവുമായ കരണങ്ങൾ പരസ്പരപ്രേരണയാൽ ഭോഗമോക്ഷങ്ങൾക്കായി പ്രവർത്തിക്കുന്നു; ഇന്ദ്രിയങ്ങൾ വാതിലുകൾ, അന്തഃകരണം കാവൽക്കാരൻ.',
          conceptId: 'karana-trayodasa'
        },
        {
          title: 'അമ്പത് വിധം ബുദ്ധിസർഗ്ഗം',
          sanskritTerm: 'പ്രത്യയസർഗ്ഗം (Pratyaya-sarga)',
          summary: 'അഞ്ച് വിപര്യയങ്ങൾ, ഇരുപത്തിയെട്ട് അശക്തികൾ, ഒമ്പത് തുഷ്ടികൾ, എട്ട് സിദ്ധികൾ — ഗുണവൈഷമ്യത്തിൽ നിന്നുള്ള അമ്പത് ഭാവങ്ങൾ.',
          conceptId: 'pratyaya-sarga'
        },
        {
          title: "'ഞാനല്ല' എന്ന വിവേകം",
          sanskritTerm: 'വിവേകഖ്യാതി (Viveka-khyāti)',
          summary: 'ബുദ്ധിയുടെ എട്ടിൽ ഏഴെണ്ണം ബന്ധിക്കുന്നു; ജ്ഞാനം മാത്രം മോചിപ്പിക്കുന്നു — “ഞാനല്ല, എന്റേതല്ല” — പിന്നീട് കാണപ്പെട്ട നർത്തകിയെപ്പോലെ പ്രകൃതി പിന്മാറുന്നു.',
          conceptId: 'viveka-khyati'
        },
        {
          title: 'ജീവന്മുക്തിയും വിദേഹമുക്തിയും',
          sanskritTerm: 'ജീവന്മുക്തി–വിദേഹമുക്തി (Jīvanmukti–Videhamukti)',
          summary: 'സംസ്കാരശക്തിയാൽ ശരീരം കുശവചക്രം പോലെ കുറച്ചുകാലം നിലനിൽക്കുന്നു; അത് വീഴുമ്പോൾ ഉറപ്പുള്ളതും തിരിച്ചുവരവില്ലാത്തതുമായ കൈവല്യം.',
          conceptId: 'jivan-videha-mukti'
        },
        {
          title: 'കൈവല്യം — ഒറ്റപ്പെടലായി മോചനം',
          sanskritTerm: 'കൈവല്യം (Kaivalya)',
          summary: 'പ്രകൃതിയുടെ നൃത്തത്തിൽ നിന്ന് എന്നെന്നേക്കുമായി വേർപെട്ട് പുരുഷൻ സ്വന്തം സ്വഭാവത്തിൽ ഒറ്റയ്ക്ക് വിശ്രമിക്കുന്നതാണ് മോചനം.',
          conceptId: 'kaivalya-samkhya'
        }
      ]
    },
  },
  yoga: {
    systemId: 'yoga',
    headline: {
      en: 'Stilling the Mind — the Eight-Limbed Path to Isolation',
      ml: 'ചിത്തവൃത്തിനിരോധം — കൈവല്യത്തിലേക്കുള്ള അഷ്ടാംഗപാത'
    },
    summary: {
      en: "Yoga accepts Sāṃkhya's dualism and builds the method on it: yoga is the stilling of the mind's fluctuations (citta-vṛtti-nirodha) through practice and dispassion. The five afflictions (kleśas) rooted in ignorance drive karma and rebirth; the eight limbs — from ethical restraints through posture and breath to absorption — dismantle them, culminating in kaivalya, the seer's rest in its own nature.",
      ml: "സാംഖ്യത്തിന്റെ ദ്വൈതം അംഗീകരിച്ച് അതിൽ മാർഗ്ഗം കെട്ടിപ്പടുക്കുന്നു യോഗം: അഭ്യാസ-വൈരാഗ്യങ്ങളിലൂടെ ചിത്തവൃത്തികളുടെ നിരോധമാണ് യോഗം. അജ്ഞാനത്തിൽ വേരൂന്നിയ അഞ്ച് ക്ലേശങ്ങൾ കർമ്മത്തെയും പുനർജന്മത്തെയും നയിക്കുന്നു; യമം മുതൽ സമാധി വരെയുള്ള എട്ട് അംഗങ്ങൾ അവയെ ഇല്ലാതാക്കി കൈവല്യത്തിൽ — ദ്രഷ്ടാവ് സ്വസ്വരൂപത്തിൽ വിശ്രമിക്കുന്നതിൽ — കലാശിക്കുന്നു."
    },
    pillars: {
      en: [
        {
          title: 'Stilling the Fluctuations',
          sanskritTerm: 'Citta-vṛtti-nirodha (चित्तवृत्ति-निरोध)',
          summary: 'Yoga itself defined: when the mind\'s fluctuations cease, the seer rests in its own true nature.',
          conceptId: 'citta-vritti-nirodha'
        },
        {
          title: 'The Five Root Afflictions',
          sanskritTerm: 'Pañca-kleśa (पञ्च-क्लेश)',
          summary: 'Ignorance, ego, attachment, aversion and fear of death — with ignorance as the soil the other four grow from.',
          conceptId: 'five-klesas'
        },
        {
          title: 'The Eight Limbs',
          sanskritTerm: 'Aṣṭāṅga (अष्टाङ्ग)',
          summary: 'Restraints, observances, posture, breath-regulation, sense-withdrawal, concentration, meditation and absorption — outer to inner.',
          conceptId: 'eight-limbs'
        },
        {
          title: 'Devotion to Īśvara',
          sanskritTerm: 'Īśvara-praṇidhāna (ईश्वर-प्रणिधान)',
          summary: 'Surrender to the special Puruṣa untouched by afflictions — a shortcut to samādhi through the syllable Oṃ.',
          conceptId: 'ishvara'
        },
        {
          title: 'The Yoga of Action',
          sanskritTerm: 'Kriyā-yoga (क्रिया-योग)',
          summary: 'Austerity, study and surrender — an accessible, action-shaped path that thins the afflictions for minds still ruled by rajas and tamas.',
          conceptId: 'kriya-yoga'
        },
        {
          title: 'Coalescence and the Truth-Bearing Wisdom',
          sanskritTerm: 'Samāpatti–Ṛtambharā (समापत्ति–ऋतम्भरा)',
          summary: 'Mind crystallizes on its object through gross and subtle coalescence, then truth-bearing wisdom dawns and even its impression ceases into seedlessness.',
          conceptId: 'ritambhara-nirbija'
        },
        {
          title: 'Combined Constraint and Its Refusal',
          sanskritTerm: 'Saṃyama–Vairāgya (संयम–वैराग्य)',
          summary: 'Concentration, meditation and absorption fused into one instrument yield past, future, minds and masteries — then even mastery is renounced toward kaivalya.',
          conceptId: 'bhuta-jaya'
        },
        {
          title: 'The Star-Crossing Discernment',
          sanskritTerm: 'Vivekaja–Tārakam (विवेकज–तारकम्)',
          summary: 'Discernment born of moment-and-sequence tells apart the indistinguishable — the all-objected, non-sequential intuition that ferries across.',
          conceptId: 'tarakam-vivekajam'
        },
        {
          title: 'The Cloud of Dharma',
          sanskritTerm: 'Dharma-megha (धर्म-मेघ)',
          summary: 'Mind dips toward discernment until even exaltation is declined — the cloud raining dharma ends affliction and karma, and the knowable thins away.',
          conceptId: 'dharma-megha'
        },
        {
          title: 'Aloneness as Freedom',
          sanskritTerm: 'Kaivalya (कैवल्य)',
          summary: 'When mind becomes as pure as Puruṣa, the guṇas dissolve back and the witness abides forever free.',
          conceptId: 'kaivalya-yoga'
        }
      ],
      ml: [
        {
          title: 'വൃത്തികളുടെ നിരോധം',
          sanskritTerm: 'ചിത്തവൃത്തിനിരോധം (Citta-vṛtti-nirodha)',
          summary: 'യോഗത്തിന്റെ നിർവ്വചനം: മനസ്സിന്റെ ചലനങ്ങൾ നിലയ്ക്കുമ്പോൾ ദ്രഷ്ടാവ് സ്വന്തം യഥാർത്ഥ സ്വഭാവത്തിൽ വിശ്രമിക്കുന്നു.',
          conceptId: 'citta-vritti-nirodha'
        },
        {
          title: 'അഞ്ച് മൂലക്ലേശങ്ങൾ',
          sanskritTerm: 'പഞ്ചക്ലേശം (Pañca-kleśa)',
          summary: 'അവിദ്യ, അസ്മിത, രാഗം, ദ്വേഷം, അഭിനിവേശം — അവിദ്യ മറ്റ് നാലിനും വളക്കൂറുള്ള മണ്ണായി.',
          conceptId: 'five-klesas'
        },
        {
          title: 'അഷ്ടാംഗങ്ങൾ',
          sanskritTerm: 'അഷ്ടാംഗം (Aṣṭāṅga)',
          summary: 'യമം, നിയമം, ആസനം, പ്രാണായാമം, പ്രത്യാഹാരം, ധാരണ, ധ്യാനം, സമാധി — ബാഹ്യത്തിൽ നിന്ന് ആന്തരികത്തിലേക്ക്.',
          conceptId: 'eight-limbs'
        },
        {
          title: 'ഈശ്വരപ്രണിധാനം',
          sanskritTerm: 'ഈശ്വരപ്രണിധാനം (Īśvara-praṇidhāna)',
          summary: 'ക്ലേശങ്ങളാൽ സ്പർശിക്കപ്പെടാത്ത വിശേഷപുരുഷനിലുള്ള ശരണാഗതി — പ്രണവത്തിലൂടെ സമാധിയിലേക്കുള്ള എളുപ്പവഴി.',
          conceptId: 'ishvara'
        },
        {
          title: 'ക്രിയായോഗം',
          sanskritTerm: 'ക്രിയായോഗം (Kriyā-yoga)',
          summary: 'തപസ്സ്, സ്വാധ്യായം, ഈശ്വരപ്രണിധാനം — രജസ്തമസ്സുകൾ ആധിപത്യം പുലർത്തുന്ന മനസ്സിന് പ്രാപ്യമായ കർമ്മമാർഗ്ഗം; ക്ലേശങ്ങളെ നേർപ്പിക്കുന്നു.',
          conceptId: 'kriya-yoga'
        },
        {
          title: 'സമാപത്തിയും ഋതംഭരാപ്രജ്ഞയും',
          sanskritTerm: 'സമാപത്തി–ഋതംഭര (Samāpatti–Ṛtambharā)',
          summary: 'വിഷയത്തിൽ സ്ഫടികം പോലെ ലയിച്ച് സ്ഥൂലസൂക്ഷ്മങ്ങളിലൂടെ സത്യം ചുമക്കുന്ന ജ്ഞാനം ഉദിക്കുന്നു; അതിന്റെ മുദ്രയും നിലയ്ക്കുമ്പോൾ നിർബീജം.',
          conceptId: 'ritambhara-nirbija'
        },
        {
          title: 'സംയമവും ത്യാഗവും',
          sanskritTerm: 'സംയമം–വൈരാഗ്യം (Saṃyama–Vairāgya)',
          summary: 'ധാരണാധ്യാനസമാധികൾ ഒന്നിച്ച് ഭൂതഭാവികളെയും പരചിത്തങ്ങളെയും സിദ്ധികളെയും നൽകുന്നു — പ്രഭുത്വം ത്യജിച്ചാൽ കൈവല്യം.',
          conceptId: 'bhuta-jaya'
        },
        {
          title: 'താരകമായ വിവേകം',
          sanskritTerm: 'വിവേകജം–താരകം (Vivekaja–Tārakam)',
          summary: 'ക്ഷണക്രമങ്ങളിലുള്ള സംയമം വേർതിരിക്കാനാവാത്തവയെ വേർതിരിക്കുന്നു — കടത്തിവിടുന്ന സർവവിഷയമായ അക്രമജ്ഞാനം.',
          conceptId: 'tarakam-vivekajam'
        },
        {
          title: 'ധർമ്മമേഘം',
          sanskritTerm: 'ധർമ്മമേഘം (Dharma-megha)',
          summary: 'ചിത്തം വിവേകത്തിൽ മുങ്ങി ഉന്നതിയെപ്പോലും നിരസിക്കുമ്പോൾ ധർമ്മം പെയ്യിക്കുന്ന മേഘമായ സമാധി — ക്ലേശകർമ്മങ്ങൾ അവസാനിക്കുന്നു.',
          conceptId: 'dharma-megha'
        },
        {
          title: 'കൈവല്യം — സമ്പൂർണ്ണ സ്വാതന്ത്ര്യം',
          sanskritTerm: 'കൈവല്യം (Kaivalya)',
          summary: 'മനസ്സ് പുരുഷനെപ്പോലെ ശുദ്ധമാകുമ്പോൾ ഗുണങ്ങൾ ലയിക്കുകയും സാക്ഷി എന്നെന്നേക്കുമായി സ്വതന്ത്രനായി നിലകൊള്ളുകയും ചെയ്യുന്നു.',
          conceptId: 'kaivalya-yoga'
        }
      ]
    },
  },
  vaisesika: {
    systemId: 'vaisesika',
    headline: {
      en: 'Categories of Reality — Substance, Atom and Inherence',
      ml: 'യാഥാർത്ഥ്യത്തിന്റെ പദാർത്ഥങ്ങൾ — ദ്രവ്യം, അണു, സമവായം'
    },
    summary: {
      en: "Vaiśeṣika maps everything that exists into padārthas (categories): substances, qualities, actions, universals, particularities, inherence and non-existence. Eternal indivisible atoms (paramāṇu) combine into the material world, while the self (ātman) is proven through cognition itself. Dharma — explained in the opening sūtra — leads to both prosperity and the ultimate good, liberation (mokṣa).",
      ml: "നിലനിൽക്കുന്നതെല്ലാം പദാർത്ഥങ്ങളായി (വിഭാഗങ്ങൾ) വൈശേഷികം മാപ്പ് ചെയ്യുന്നു: ദ്രവ്യം, ഗുണം, കർമ്മം, സാമാന്യം, വിശേഷം, സമവായം, അഭാവം. ശാശ്വതവും അവിഭാജ്യവുമായ പരമാണുക്കൾ ചേർന്ന് ഭൗതികലോകമാകുന്നു; ആത്മാവ് അറിവിലൂടെത്തന്നെ തെളിയിക്കപ്പെടുന്നു. ആദ്യസൂത്രത്തിൽ വിവരിക്കുന്ന ധർമ്മം അഭ്യുദയത്തിലേക്കും പരമമായ ശ്രേയസ്സായ മോക്ഷത്തിലേക്കും നയിക്കുന്നു."
    },
    pillars: {
      en: [
        {
          title: 'The Categories of Reality',
          sanskritTerm: 'Padārtha (पदार्थ)',
          summary: 'Every existent classifies into substance, quality, action, universal, particularity, inherence — and non-existence.',
          conceptId: 'padartha'
        },
        {
          title: 'The Indivisible Atom',
          sanskritTerm: 'Paramāṇu (परमाणु)',
          summary: 'Eternal, partless, infinitesimal atoms are the building blocks whose conjunctions make dimensioned things.',
          conceptId: 'paramanu'
        },
        {
          title: 'Inherence Binding Part to Whole',
          sanskritTerm: 'Samavāya (समवाय)',
          summary: 'The intimate, inseparable relation — quality in substance, whole in parts — that holds the world together.',
          conceptId: 'samavaya'
        },
        {
          title: 'The Self Proved by Knowing',
          sanskritTerm: 'Ātman (आत्मन्)',
          summary: 'Desire, aversion, effort, pleasure, pain and cognition prove a conscious self beyond the body and senses.',
          conceptId: 'atman'
        },
        {
          title: 'Dharma Toward Liberation',
          sanskritTerm: 'Mokṣa (मोक्ष)',
          summary: 'True knowledge of the categories stops false identification; the self rests free — the ultimate good.',
          conceptId: 'moksha'
        }
      ],
      ml: [
        {
          title: 'യാഥാർത്ഥ്യത്തിന്റെ വിഭാഗങ്ങൾ',
          sanskritTerm: 'പദാർത്ഥം (Padārtha)',
          summary: 'നിലനിൽക്കുന്നതെല്ലാം ദ്രവ്യം, ഗുണം, കർമ്മം, സാമാന്യം, വിശേഷം, സമവായം — അഭാവം എന്നിവയായി തരംതിരിക്കുന്നു.',
          conceptId: 'padartha'
        },
        {
          title: 'അവിഭാജ്യമായ അണു',
          sanskritTerm: 'പരമാണു (Paramāṇu)',
          summary: 'ശാശ്വതവും ഭാഗരഹിതവും അണുവുമായ പരമാണുക്കളാണ് നിർമ്മാണക്കല്ലുകൾ; അവയുടെ സംയോഗം വലുപ്പമുള്ള വസ്തുക്കളെ ഉണ്ടാക്കുന്നു.',
          conceptId: 'paramanu'
        },
        {
          title: 'ഭാഗത്തെ മുഴുവനുമായി ബന്ധിക്കുന്ന സമവായം',
          sanskritTerm: 'സമവായം (Samavāya)',
          summary: 'ദ്രവ്യത്തിലെ ഗുണം, ഭാഗങ്ങളിലെ മുഴുവൻ എന്നിങ്ങനെയുള്ള അടുത്തതും വേർപെടുത്താനാവാത്തതുമായ ബന്ധം — ലോകത്തെ കോർത്തുനിർത്തുന്നു.',
          conceptId: 'samavaya'
        },
        {
          title: 'അറിവിലൂടെ തെളിയിക്കപ്പെടുന്ന ആത്മാവ്',
          sanskritTerm: 'ആത്മാവ് (Ātman)',
          summary: 'ഇച്ഛ, ദ്വേഷം, പ്രയത്നം, സുഖം, ദുഃഖം, അറിവ് എന്നിവ ശരീരേന്ദ്രിയങ്ങൾക്ക് അപ്പുറമുള്ള ബോധമായ ആത്മാവിനെ തെളിയിക്കുന്നു.',
          conceptId: 'atman'
        },
        {
          title: 'മോക്ഷത്തിലേക്കുള്ള ധർമ്മം',
          sanskritTerm: 'മോക്ഷം (Mokṣa)',
          summary: 'പദാർത്ഥങ്ങളുടെ യഥാർത്ഥ അറിവ് തെറ്റായ തിരിച്ചറിയൽ നിർത്തുന്നു; ആത്മാവ് സ്വതന്ത്രമായി വിശ്രമിക്കുന്നു — പരമശ്രേയസ്സ്.',
          conceptId: 'moksha'
        }
      ]
    },
  },
  mimamsa: {
    systemId: 'mimamsa',
    headline: {
      en: 'The Exegesis of Duty — Injunction, Mantra and Unseen Potency',
      ml: 'കടമയുടെ വ്യാഖ്യാനം — വിധി, മന്ത്രം, അദൃഷ്ടം'
    },
    summary: {
      en: "Pūrva Mīmāṃsā is the science of reading the Veda as duty: dharma is known only through injunction (codanā), not perception. Stories and praises (arthavāda) rouse us to act; mantras must be exact because their precise sound produces an unseen potency (adṛṣṭa/apūrva); human law-books (smṛti) carry authority as remembered Veda. Every syllable serves the sacrifice.",
      ml: "വേദത്തെ കടമയായി വായിക്കുന്ന ശാസ്ത്രമാണ് പൂർവ്വമീമാംസ: ധർമ്മം വിധിയിലൂടെ (ചോദന) മാത്രം അറിയപ്പെടുന്നു, പ്രത്യക്ഷത്തിലൂടെയല്ല. കഥകളും സ്തുതികളും (അർത്ഥവാദം) പ്രവർത്തിക്കാൻ പ്രേരിപ്പിക്കുന്നു; മന്ത്രങ്ങൾ കൃത്യമായിരിക്കണം, കാരണം അവയുടെ കൃത്യമായ ശബ്ദം കാണാത്ത ശക്തിയെ (അദൃഷ്ടം/അപൂർവ്വം) ഉണ്ടാക്കുന്നു; മാനവധർമ്മശാസ്ത്രങ്ങൾ (സ്മൃതി) ഓർമ്മിക്കപ്പെട്ട വേദമായി പ്രാമാണ്യം വഹിക്കുന്നു. ഓരോ അക്ഷരവും യാഗത്തെ സേവിക്കുന്നു."
    },
    pillars: {
      en: [
        {
          title: 'Stories as Single Sentences with Injunctions',
          sanskritTerm: 'Ekavākyatā (एकवाक्यता)',
          summary: 'Descriptive passages are not idle: joined with an injunction they form one sentence that moves us to act.',
          conceptId: 'ekavakyata'
        },
        {
          title: 'The Creative Potency of Duty',
          sanskritTerm: 'Bhāvanā (भावना)',
          summary: 'Injunction carries a productive force — bringing into being what ought to be done — analysed into word-born and act-born aspects.',
          conceptId: 'bhavana'
        },
        {
          title: 'Mantras Are Meaningful Sentences',
          sanskritTerm: 'Mantra (मन्त्र)',
          summary: 'Against the charge of meaninglessness: mantras recall deity, substance and act at the moment of rite — and must keep exact sound.',
          conceptId: 'mantra'
        },
        {
          title: 'Human Law Remembers Lost Veda',
          sanskritTerm: 'Smṛti (स्मृति)',
          summary: 'Manu and others bind because they rest on a lost Vedic branch; conduct of the good confirms it.',
          conceptId: 'smriti'
        },
        {
          title: 'The Unseen Result',
          sanskritTerm: 'Adṛṣṭa (अदृष्ट)',
          summary: 'Exact utterance and exact performance generate an invisible potency that later delivers heaven and duty\'s fruit.',
          conceptId: 'adrishta'
        }
      ],
      ml: [
        {
          title: 'വിധിയോടെ ഏകവാക്യമാകുന്ന കഥകൾ',
          sanskritTerm: 'ഏകവാക്യത (Ekavākyatā)',
          summary: 'വിവരണഭാഗങ്ങൾ വെറുതെയല്ല: ഒരു വിധിയുമായി ചേർന്ന് അവ പ്രവർത്തിക്കാൻ നമ്മെ ചലിപ്പിക്കുന്ന ഒറ്റവാക്യമാകുന്നു.',
          conceptId: 'ekavakyata'
        },
        {
          title: 'കടമയുടെ സർഗ്ഗശക്തി',
          sanskritTerm: 'ഭാവന (Bhāvanā)',
          summary: 'വിധി ഉത്പാദകമായ ശക്തി വഹിക്കുന്നു — ചെയ്യേണ്ടതിനെ ഉണ്ടാക്കുന്നത് — ശാബ്ദീഭാവനയും ആർത്ഥീഭാവനയുമായി വിശകലനം ചെയ്യപ്പെടുന്നു.',
          conceptId: 'bhavana'
        },
        {
          title: 'മന്ത്രങ്ങൾ അർത്ഥമുള്ള വാക്യങ്ങൾ',
          sanskritTerm: 'മന്ത്രം (Mantra)',
          summary: 'അർത്ഥശൂന്യതാ ആരോപണത്തിന് എതിരെ: മന്ത്രങ്ങൾ കർമ്മനിമിഷത്തിൽ ദേവതയെയും ദ്രവ്യത്തെയും പ്രവൃത്തിയെയും ഓർമ്മിപ്പിക്കുന്നു — കൃത്യമായ ശബ്ദം നിലനിർത്തണം.',
          conceptId: 'mantra'
        },
        {
          title: 'നഷ്ടവേദത്തെ ഓർമ്മിക്കുന്ന മാനവനിയമം',
          sanskritTerm: 'സ്മൃതി (Smṛti)',
          summary: 'മനു തുടങ്ങിയവർ ബന്ധിപ്പിക്കുന്നത് നഷ്ടപ്പെട്ട വേദശാഖയിൽ നിലകൊള്ളുന്നതിനാലാണ്; ശിഷ്ടാചാരം ഇതിനെ ഉറപ്പിക്കുന്നു.',
          conceptId: 'smriti'
        },
        {
          title: 'കാണാത്ത ഫലം',
          sanskritTerm: 'അദൃഷ്ടം (Adṛṣṭa)',
          summary: 'കൃത്യമായ ഉച്ചാരണവും കൃത്യമായ അനുഷ്ഠാനവും അദൃശ്യമായ ശക്തിയെ ഉണ്ടാക്കുന്നു, അത് പിന്നീട് സ്വർഗ്ഗവും കർമ്മഫലവും നൽകുന്നു.',
          conceptId: 'adrishta'
        }
      ]
    },
  },
  vedanta: {
    systemId: 'vedanta',
    headline: {
      en: 'Non-Dualism — Brahman Alone Is Real',
      ml: 'അദ്വൈതം — ബ്രഹ്മം മാത്രം സത്യം'
    },
    summary: {
      en: "Advaita Vedānta analyses the analyser: before grasping the infinite, the mind must be purified through the fourfold qualifications. Bādarāyaṇa's Brahma Sūtras inquire into Brahman — the uncaused, infinite reality — knowable only through scripture, veiled by Māyā, superimposed by the individual (adhyāsa), refuting rival systems, and realised through hearing, reflection and meditation until karma burns away and freedom dawns.",
      ml: "അന്വേഷകനെത്തന്നെ വിശകലനം ചെയ്യുന്നു അദ്വൈതവേദാന്തം: അനന്തത്തെ ഗ്രഹിക്കുന്നതിന് മുൻപേ സാധനാചതുഷ്ടയത്തിലൂടെ മനസ്സ് ശുദ്ധീകരിക്കപ്പെടണം. ബാദരായണന്റെ ബ്രഹ്മസൂത്രങ്ങൾ ബ്രഹ്മത്തെക്കുറിച്ച് അന്വേഷിക്കുന്നു — കാരണരഹിതവും അനന്തവുമായ യാഥാർത്ഥ്യം — ശ്രുതിയിലൂടെ മാത്രം അറിയാവുന്നത്, മായയാൽ മറയ്ക്കപ്പെട്ടത്, വ്യക്തിയാൽ അധ്യസിക്കപ്പെട്ടത്, എതിർദർശനങ്ങളെ ഖണ്ഡിച്ചത്, ശ്രവണ-മനന-നിദിദ്ധ്യാസനങ്ങളിലൂടെ സാക്ഷാത്കരിക്കപ്പെട്ട് കർമ്മം എരിഞ്ഞ് മോചനം ഉദിക്കുന്നത്."
    },
    pillars: {
      en: [
        {
          title: 'The Fourfold Qualifications',
          sanskritTerm: 'Sādhana-catuṣṭaya (साधन-चतुष्टय)',
          summary: 'Discrimination, dispassion, sense-mastery and burning desire for liberation — without these, study stays intellectual gymnastics.',
          conceptId: 'concept_sadhana_chatushtaya'
        },
        {
          title: 'The Supreme Absolute',
          sanskritTerm: 'Brahman (ब्रह्मन्)',
          summary: 'The uncaused cause — infinite, unchanging existence-consciousness-bliss from which the cosmos comes, in which it rests, into which it dissolves.',
          conceptId: 'concept_brahman'
        },
        {
          title: 'The Veiling Power',
          sanskritTerm: 'Māyā (माया)',
          summary: 'Concealing the non-dual (āvaraṇa) and projecting plurality (vikṣepa) — neither fully real nor fully unreal.',
          conceptId: 'concept_maya'
        },
        {
          title: 'Superimposition, Root of Suffering',
          sanskritTerm: 'Adhyāsa (अध्यास)',
          summary: 'Mixing the eternal witness with the temporary body-mind — saying "I am fat, I am sad, I die" — the sole root of suffering.',
          conceptId: 'concept_adhyasa'
        },
        {
          title: 'Freedom While Living',
          sanskritTerm: 'Jīvanmukti (जीवन्मुक्ति)',
          summary: 'For the knower of attributeless Brahman there is no journey: prāṇas merge here and now; at death, seamless merger like a drop into the ocean.',
          conceptId: 'concept_jivanmukti'
        }
      ],
      ml: [
        {
          title: 'സാധനാചതുഷ്ടയം',
          sanskritTerm: 'സാധനാചതുഷ്ടയം (Sādhana-catuṣṭaya)',
          summary: 'വിവേകം, വൈരാഗ്യം, ഇന്ദ്രിയനിയന്ത്രണം, മോക്ഷത്തിനായുള്ള തീവ്രമായ ആഗ്രഹം — ഇവയില്ലാതെ പഠനം ബുദ്ധിപരമായ വ്യായാമമായി അവശേഷിക്കുന്നു.',
          conceptId: 'concept_sadhana_chatushtaya'
        },
        {
          title: 'പരമമായ ബ്രഹ്മം',
          sanskritTerm: 'ബ്രഹ്മം (Brahman)',
          summary: 'കാരണമില്ലാത്ത കാരണം — അനന്തവും മാറ്റമില്ലാത്തതുമായ സത്-ചിത്-ആനന്ദം, അതിൽ നിന്ന് പ്രപഞ്ചം ഉണ്ടാകുന്നു, അതിൽ നിലനിൽക്കുന്നു, അതിൽ ലയിക്കുന്നു.',
          conceptId: 'concept_brahman'
        },
        {
          title: 'മറയ്ക്കുന്ന ശക്തി',
          sanskritTerm: 'മായ (Māyā)',
          summary: 'അദ്വൈതത്തെ മറയ്ക്കുകയും (ആവരണം) നാനാത്വത്തെ പ്രതിഫലിപ്പിക്കുകയും (വിക്ഷേപം) ചെയ്യുന്നു — പൂർണ്ണമായും സത്യവുമല്ല, മിഥ്യയുമല്ല.',
          conceptId: 'concept_maya'
        },
        {
          title: 'ദുഃഖമൂലമായ അധ്യാസം',
          sanskritTerm: 'അധ്യാസം (Adhyāsa)',
          summary: "ശാശ്വത സാക്ഷിയെ നശ്വര ശരീര-മനസ്സുമായി കൂട്ടിക്കലർത്തൽ — 'ഞാൻ തടിയൻ, ഞാൻ ദുഃഖി, ഞാൻ മരിക്കുന്നു' — ദുഃഖത്തിന്റെ ഏകമൂലം.",
          conceptId: 'concept_adhyasa'
        },
        {
          title: 'ജീവിച്ചിരിക്കെയുള്ള മോചനം',
          sanskritTerm: 'ജീവന്മുക്തി (Jīvanmukti)',
          summary: 'നിർഗുണബ്രഹ്മത്തെ അറിഞ്ഞവന് യാത്രയില്ല: പ്രാണങ്ങൾ ഇവിടെ വെച്ചുതന്നെ ലയിക്കുന്നു; മരണത്തിൽ സമുദ്രത്തിലെ തുള്ളിപോലെ തടസ്സമില്ലാത്ത ലയം.',
          conceptId: 'concept_jivanmukti'
        }
      ]
    },
  }
};

export const getSystemOverview = (systemId: string): SystemOverviewData | undefined => {
  return systemOverviews[systemId];
};
