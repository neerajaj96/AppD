// Uttaranga auxiliaries, set 2: Guru-Kilaka, Kshamapana, Saptashloki,
// Dvatrimsha-namamala, Kunjika (full), plus condensed indexes for the
// long lists (Ashtottara-108, Manasa-puja, Atharvashirsha).
//
// SOURCE: same Guptavati-adi sapta-tika Drive PDF (814 pp) as
// devi-mahatmya-verses-en-uttaranga.ts. Page map lives in
// devi-mahatmya-source-provenance.ts — each entry below cites its pages.
// Nothing here duplicates ch01-ch13, Kavaca/Argala/Kilaka, Rgvedokta
// Devi Sukta, Rahasya digests, Kshama-prarthana or mantra-vibhaga notes.
// Part of the Devi Mahatmya EN verses. Merged by
// devi-mahatmya-verses-en.ts. Do not import directly.
import type { RawVerseEn } from './devi-mahatmya-verses-en';

const PROVENANCE =
  'Guptavati-adi sapta-tika Durga-Saptashati edition (Drive PDF, 814 pp).';

export const deviMahatmyaVersesEnUttaranga2: RawVerseEn[] = [
  {
    id: 'dm-guru-kilaka',
    number: 'Guru-Kīlaka-paṭala (digest)',
    section: 'Pūrvāṅga: Rahasya-tantra Guru-Kīlaka (unpinning rite)',
    devanagari: `शिव उवाच।
दत्तमेतन्मयानघ।
पुरा सनत्कुमाराय संवर्ताय ददौ तच्च स चान्यस्मै ददौ च तत् ॥१॥
सर्वत्र चण्डीस्तोत्रस्य प्राचुर्येण महीतले।
ब्रह्मकाण्डः कर्मकाण्डस्तन्त्रकाण्डश्च सर्वथा ॥२॥
अभूत्प्रतिहतोऽनेन शीघ्रसिद्धिप्रदायिना।
तदा तेषां च सार्थक्यं कर्तुकामेन भूतले ॥३॥
दानप्रतिग्रहाख्येन मन्त्रोऽयं कीलितो मया।
दानप्रतिग्रहाख्यं यत्तत्कीलकमुदाहृतम् ॥४॥
तदारभ्य च मन्त्रोऽयं कीलकेनास कीलितः।
न सर्वेषां भवेत्सिद्ध्यै ये कीलकपरामुखाः ॥५॥
ये नराः कीलकेनेमं जपन्ति परया मुदा।
तेषां देवी प्रसन्ना स्यात्ततः सर्वाः समृद्धयः ॥६॥`,
    iast: `śiva uvāca |
dattam etan mayānagha |
purā sanatkumārāya saṃvartāya dadau tac ca sa cānyasmai dadau ca tat ||1||
sarvatra caṇḍīstotrasya prācuryeṇa mahītale |
brahmakāṇḍaḥ karmakāṇḍas tantrakāṇḍaś ca sarvathā ||2||
abhūt pratihato'nena śīghrasiddhipradāyinā |
tadā teṣāṃ ca sārthakyaṃ kartukāmena bhūtale ||3||
dānapratigrahākhyena mantro'yaṃ kīlito mayā |
dānapratigrahākhyaṃ yat tat kīlakam udāhṛtam ||4||
tadārabhya ca mantro'yaṃ kīlakenāsa kīlitaḥ |
na sarveṣāṃ bhavet siddhyai ye kīlakaparāmukhāḥ ||5||
ye narāḥ kīlakenemaṃ japanti parayā mudā |
teṣāṃ devī prasannā syāt tataḥ sarvāḥ samṛddhayaḥ ||6||`,
    conceptIds: ['keelaka-stotra', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Guru-Kilaka-patala pp.62-64 (Rahasya-tantra; Shiva-uvacha; 23 verses; opening 6 verbatim above; dana-pratigraha vidhi gloss p.63).`
      }
    ],
    translation: `Shiva said: "Faultless one, this was given by me of old to Sanatkumara; he gave it to Samvarta, and he to another in turn. When the Chandi-hymn spread everywhere on earth, the Vedic, ritual and Tantric paths were all alike obstructed by this swift-success-granting (text). Then, desiring to make them fruitful on earth, I pinned this mantra under the name of giving-and-receiving (dana-pratigraha) — that giving-receiving is declared the pin (kilaka). From then this mantra stands pinned; it ripens to success for none who turn their face from the pin. But men who recite it WITH the pin, in supreme gladness — on them the Goddess is pleased, and thence all prosperities."`,
    commentary: `**Condensed digest (23 verses, pp.62-64; opening 6 verbatim):** verses 7-12 stage the inner vow ("tvatprasutas-tvadajnapta...": born of You, commanded by You, Your servant, set to Your purpose; all my earned wealth — kingdom, strength, treasury, army — I lay at Your feet) performed on Krishna-chaturdashi/ashtami, offered then received back by Her grace (the Kilaka's dadati-pratigrihnati in ritual form). Verses 13-14 divide the received wealth fivefold (three parts own use, one part deva-pitri-atithi rites, one part to the guru — "tena devi prasidati"). Verses 15-23 close with the Navakshara-jnana vow (jiva-brahma ground, "tattvamasi" essence, lifelong Saptashati-japa without pramada, Chandogya "naaham brahma nirakuryam" seal, yearly Sharada/varshika observance, gopaniya injunctions). The p.63 Hindi gloss walks the whole dana-pratigraha sankalpa step by step; no verse invented here.`,
    keyPoints: [
      '**Pin = giving-receiving**: Dana-pratigraha is the kilaka; recitation without it does not ripen.',
      '**Fivefold division**: Three parts own use, one part five-yajna dharma-expense, one part to the guru.',
      '**Lifelong vow**: Navakshara known as jiva-brahma medicine, Saptashati-japa without negligence.'
    ]
  },
  {
    id: 'dm-kshamapana-1',
    number: 'Devyaparādha-kṣamāpana 1-6 (Śaṅkara)',
    section: 'Uttarāṅga: Devyaparādha-kṣamāpana-stotra',
    devanagari: `न मन्त्रं नो यन्त्रं तदपि च न जाने स्तुतिमहो
न चाह्वानं ध्यानं तदपि च न जाने स्तुतिकथाः।
न जाने मुद्रास्ते तदपि च न जाने विलपनं
परं जाने मातस्त्वदनुसरणं क्लेशहरणम् ॥१॥
विधेरज्ञानेन द्रविणविरहेणालसतया
विधेयाशक्यत्वात्तव चरणयोर्या च्युतिरभूत्।
तदेतत् क्षन्तव्यं जननि सकलोद्धारिणि शिवे
कुपुत्रो जायेत क्वचिदपि कुमाता न भवति ॥२॥
पृथिव्यां पुत्रास्ते जननि बहवः सन्ति सरलाः
परं तेषां मध्ये विरलतरलोऽहं तव सुतः।
मदीयोऽयं त्यागः समुचितमिदं नो तव शिवे
कुपुत्रो जायेत क्वचिदपि कुमाता न भवति ॥३॥
जगन्मातर्मातस्तव चरणसेवा न रचिता
न वा दत्तं देवि द्रविणमपि भूयस्तव मया।
तथापि त्वं स्नेहं मयि निरुपमं यत्प्रकुरुषे
कुपुत्रो जायेत क्वचिदपि कुमाता न भवति ॥४॥
परित्यक्ता देवा विविधविधसेवाकुलतया
मया पञ्चाशीतेरधिकमपनीते तु वयसि।
इदानीं चेन्मातस्तव यदि कृपा नापि भविता
निरालम्बो लम्बोदरजननि कं यामि शरणम् ॥५॥
श्वपाको जल्पाको भवति मधुपाकोपमगिरा
निरातङ्को रङ्को विहरति चिरं कोटिकनकैः।
तवापर्णे कर्णे विशति मनुवर्णे फलमिदं
जनः को जानीते जननि जपनीयं जपविधौ ॥६॥`,
    iast: `na mantraṃ no yantraṃ tadapi ca na jāne stutim aho
na cāhvānaṃ dhyānaṃ tadapi ca na jāne stutikathāḥ |
na jāne mudrās te tadapi ca na jāne vilapanaṃ
paraṃ jāne mātas tvad anusaraṇaṃ kleśaharaṇam ||1||
vidher ajñānena draviṇaviraheṇālasatayā
vidheyāśakyatvāt tava caraṇayor yā cyutir abhūt |
tad etat kṣantavyaṃ janani sakaloddhāriṇi śive
kuputro jāyeta kvacidapi kumātā na bhavati ||2||
pṛthivyāṃ putrās te janani bahavaḥ santi saralāḥ
paraṃ teṣāṃ madhye viralataralo'haṃ tava sutaḥ |
madīyo'yaṃ tyāgaḥ samucitam idaṃ no tava śive
kuputro jāyeta kvacidapi kumātā na bhavati ||3||
jaganmātar mātas tava caraṇasevā na racitā
na vā dattaṃ devi draviṇam api bhūyas tava mayā |
tathāpi tvaṃ snehaṃ mayi nirupamaṃ yat prakuruṣe
kuputro jāyeta kvacidapi kumātā na bhavati ||4||
parityaktā devā vividhavidhasevākulatayā
mayā pañcāśīter adhikam apanīte tu vayasi |
idānīṃ cen mātas tava yadi kṛpā nāpi bhavitā
nirālambo lambodarajanani kaṃ yāmi śaraṇam ||5||
śvapāko jalpāko bhavati madhupākopamagirā
nirātaṅko raṅko viharati ciraṃ koṭikanakaiḥ |
tavāparṇe karṇe viśati manuvarṇe phalam idaṃ
janaḥ ko jānīte janani japanīyaṃ japavidhau ||6||`,
    conceptIds: ['phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Devyaparadha-kshamapana-stotra (Shankaracharya) pp.725-726, verses 1-6 verbatim with Hindi rendering; refrain "kuputro jayeta kvacidapi kumata na bhavati".`
      }
    ],
    translation: `"Mother, I know no mantra, no yantra, no praise; no invocation, no meditation, no hymns or legends; not your gestures, nor how to wail in longing — one thing only I know: following after You, which takes away all suffering. Whatever lapse at your feet came from not knowing the rule, from having no wealth, from sloth, from inability to perform — forgive all that, Mother, saviour of all; a bad son may sometimes be born, but never a bad mother. On earth you have many straightforward sons, Mother; among them I am your most wayward child; my abandonment of you is unworthy — but yours of me would be too, Shivaa, for a bad son may be, never a bad mother. Mother of worlds, I never served your feet nor gave you much wealth, yet the matchless love you show me has one cause only: a bad son may be, never a bad mother. Past eighty-five, tangled in serving many gods, I have now dropped them all; if even now, Mother of Lambodara, your grace does not come, supportless, to whose refuge shall I go? Aparna — when a single letter of your mantra enters the ear, even a dog-cooker becomes a honey-voiced speaker and a pauper sports fearless among crores of gold; who then can know, Mother, the fruit of those who duly practise the recitation?"`,
    commentary: `**What this is:** Shankara's 12-verse apology, placed right after the 6-verse Kshama-prarthana (p.723). Where Kshama-prarthana is terse and liturgical ("mantrahina kriyahina bhaktihina... paripurnam"), Kshamapana is autobiographical — an old man (past 85) who spent life serving many gods, owns no mantra/yantra/stuti, and pleads the one theology the whole Uttaranga has built: kuputro jayeta (refrain, vv.2-4). The Hindi rendering (pp.725-726) tracks each verse plainly. Second half (7-12) in dm-kshamapana-2.`,
    keyPoints: [
      '**One theology, thrice sealed**: Kuputro jayeta — a bad son may be, never a bad mother (vv.2-4).',
      '**Following suffices**: Tvad-anusarana alone is klesha-harana (v.1).',
      '**Single letter suffices**: One mantra-letter in the ear remakes speaker and pauper (v.6).'
    ]
  },
  {
    id: 'dm-kshamapana-2',
    number: 'Devyaparādha-kṣamāpana 7-12 (Śaṅkara)',
    section: 'Uttarāṅga: Devyaparādha-kṣamāpana-stotra',
    devanagari: `चिताभस्मालेपो गरलमशनं दिक्पटधरो
जटाधारी कण्ठे भुजगपतिहारी पशुपतिः।
कपाली भूतेशो भजति जगदीशैकपदवीं
भवानि त्वत्पाणिग्रहणपरिपाटीफलमिदम् ॥७॥
न मोक्षस्याकाङ्क्षा भवविभववाञ्छापि च न मे
न विज्ञानापेक्षा शशिमुखि सुखेच्छापि न पुनः।
अतस्त्वां संयाचे जननि जननं यातु मम वै
मृडानी रुद्राणी शिव शिव भवानीति जपतः ॥८॥
नाराधितासि विधिना विविधोपचारैः
किं रुक्षचिन्तनपरैर्न कृतं वचोभिः।
श्यामे त्वमेव यदि किञ्चन मय्यनाथे
धत्से कृपामुचितमम्ब परं तवैव ॥९॥
आपत्सु मग्नः स्मरणं त्वदीयं
करोमि दुर्गे करुणार्णवेशि।
नैतच्छठत्वं मम भावयेथाः
क्षुधातृषार्ता जननीं स्मरन्ति ॥१०॥
जगदम्ब विचित्रमत्र किं
परिपूर्णा करुणास्ति चेन्मयि।
अपराधपरम्परापरं
न हि माता समुपेक्षते सुतम् ॥११॥
मत्समः पातकी नास्ति पापघ्नी त्वत्समा न हि।
एवं ज्ञात्वा महादेवि यथायोग्यं तथा कुरु ॥१२॥`,
    iast: `citābhasmalepo garalamaśanaṃ dikpaṭadharo
jaṭādhārī kaṇṭhe bhujagapatihārī paśupatiḥ |
kapālī bhūteśo bhajati jagadīśaikapadavīṃ
bhavāni tvat pāṇigrahaṇaparipāṭīphalam idam ||7||
na mokṣasyākāṅkṣā bhavavibhavavāñchāpi ca na me
na vijñānāpekṣā śaśimukhi sukhecchāpi na punaḥ |
atas tvāṃ saṃyāce janani jananaṃ yātu mama vai
mṛḍānī rudrāṇī śiva śiva bhavānīti japataḥ ||8||
nārādhitāsi vidhinā vividhopacāraiḥ
kiṃ rūkṣacintanaparair na kṛtaṃ vacobhiḥ |
śyāme tvam eva yadi kiñcana mayy anāthe
dhatse kṛpām ucitam amba paraṃ tavaiva ||9||
āpatsu magnaḥ smaraṇaṃ tvadīyaṃ
karomi durge karuṇārṇaveśi |
naitac chaṭhatvaṃ mama bhāvayethāḥ
kṣudhātṛṣārtā jananīṃ smaranti ||10||
jagadamba vicitram atra kiṃ
paripūrṇā karuṇāsti cen mayi |
aparādhaparamparāparaṃ
na hi mātā samupekṣate sutam ||11||
matsamaḥ pātakī nāsti pāpaghnī tvatsamā na hi |
evaṃ jñātvā mahādevi yathāyogyaṃ tathā kuru ||12||`,
    conceptIds: ['phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Devyaparadha-kshamapana-stotra concl. pp.727-728, verses 7-12 verbatim; colophon "iti Shankaracharya-virachitam".`
      }
    ],
    translation: `"Smeared with pyre-ash, poison-fed, sky-clad, matted, snake-garlanded, skull-bearing Pashupati holds the sole rank of Lord of worlds — Bhavani, this is the fruit of the tradition of taking YOUR hand in marriage. Moon-faced Mother, I crave neither liberation nor worldly splendour, neither gnosis nor even happiness; this only I beg: may my life pass crying 'Mridani, Rudrani, Shiva, Shiva, Bhavani!' Shyama, never duly worshipped with many offerings, what has my harsh brooding speech not done amiss? Yet if you yourself bestow even a little grace on me, the orphan — Mother, that alone befits YOU. Durga, ocean of mercy, sunk in calamity I remember you now — count it not my cunning; hungry-thirsty children remember their mother. Jagadamba, what wonder if your mercy rests whole on me? A mother never forsakes even a son heaped with offence upon offence. No sinner equals me, no sin-destroyer equals You — knowing this, Mahadevi, do as befits."`,
    commentary: `**Close of the apology:** verse 7 turns the lens on Shiva himself — even Pashupati's Jagadisha-rank is phala of Her panigrahana. Verse 8 refuses all four purusharthas for one boon: a life spent japing Her names. Verse 10 answers the obvious charge ("you remember Her only in trouble") with hunger-thirst. Verse 12 is the signature Shankara close (matsamah pataki / tvatsama papa-ghni). Colophon attributes to Shankaracharya; Hindi rendering pp.727-728.`,
    keyPoints: [
      '**Shiva’s rank is Hers**: Even Pashupati’s lordship is Her panigrahana-phala (v.7).',
      '**One boon**: No moksha, no bhoga — only a life of name-japa (v.8).',
      '**No sinner like me, no cleanser like You** (v.12).'
    ]
  },
  {
    id: 'dm-saptashloki',
    number: 'Saptaślokī Durgā 1-7',
    section: 'Uttarāṅga: Saptaślokī Durgā (Kali-age epitome)',
    devanagari: `ॐ ज्ञानिनामपि चेतांसि देवी भगवती हि सा।
बलादाकृष्य मोहाय महामाया प्रयच्छति ॥१॥
दुर्गे स्मृता हरसि भीतिमशेषजन्तोः
स्वस्थैः स्मृता मतिमतीव शुभां ददासि।
दारिद्र्यदुःखभयहारिणि का त्वदन्या
सर्वोपकारकरणाय सदार्द्रचित्ता ॥२॥
सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥३॥
शरणागतदीनार्तपरित्राणपरायणे।
सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥४॥
सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते।
भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते ॥५॥
रोगानशेषानपहंसि तुष्टा
रुष्टा तु कामान् सकलानभीष्टान्।
त्वामाश्रितानां न विपन्नराणां
त्वामाश्रिता ह्याश्रयतां प्रयान्ति ॥६॥
सर्वाबाधाप्रशमनं त्रैलोक्यस्याखिलेश्वरि।
एवमेव त्वया कार्यमस्मद्वैरिविनाशनम् ॥७॥`,
    iast: `oṃ jñāninām api cetāṃsi devī bhagavatī hi sā |
balād ākṛṣya mohāya mahāmāyā prayacchati ||1||
durge smṛtā harasi bhītim aśeṣajantoḥ
svasthaiḥ smṛtā matim atīva śubhāṃ dadāsi |
dāridryaduḥkhabhayahāriṇi kā tvad anyā
sarvopakārakaraṇāya sadārdracittā ||2||
sarvamaṅgalamāṅgalye śive sarvārthasādhike |
śaraṇye tryambake gauri nārāyaṇi namo'stu te ||3||
śaraṇāgatadīnārtaparitrāṇaparāyaṇe |
sarvasyārtihare devi nārāyaṇi namo'stu te ||4||
sarvasvarūpe sarveśe sarvaśaktisamanvite |
bhayebhyas trāhi no devi durge devi namo'stu te ||5||
rogān aśeṣān apahaṃsi tuṣṭā
ruṣṭā tu kāmān sakalān abhīṣṭān |
tvām āśritānāṃ na vipan narāṇāṃ
tvām āśritā hy āśrayatāṃ prayānti ||6||
sarvābādhāpraśamanaṃ trailokyasyākhileśvari |
evam eva tvayā kāryam asmad vairivināśanam ||7||`,
    conceptIds: ['narayani-stuti', 'phalastuti', 'mahamaya'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Saptashloki Durga pp.729-731 complete (Shiva-Devi samvada frame: "kalau karyasiddhyartham upayam bruhi"; viniyoga: Narayana rishi, Anushtubh, Mahakali-Mahalakshmi-Mahasarasvati; 7 verses verbatim; Hindi rendering; closed "iti saptashloki durga sampurna"). Verses excerpt adhyayas (1.55, 4.17/11.12-family, 11.10-12, 4.23/5.29-family, 12/11-family).`
      }
    ],
    translation: `"Even the minds of the wise the Goddess Mahamaya forcibly drags to delusion. Durga — remembered, you take fear from every creature; pondered by the well, you grant most wholesome wisdom; remover of poverty, sorrow, fear — who but You is ever-moist-hearted to help all? O all-auspicious of auspicious things, Shivaa, accomplisher of all aims, refuge, three-eyed Gauri, Narayani, salutations! Devoted to saving the surrendered lowly anguished, remover of every pain, Narayani, salutations! All-formed, queen of all, endowed with every power, save us from fears, Durga Devi, salutations! Pleased, you destroy all diseases; angered, you destroy all longed-for desires; the sheltered never perish — the sheltered become shelters. O queen of all, as you quell every affliction of the three worlds, so destroy our foes."`,
    commentary: `**Kali-age epitome:** Shiva asks for a yatna-upaya "kalau karyasiddhyartham"; Devi answers with the Amba-stuti — seven verses excerpted from the adhyayas (hence indexed here in full as parayana text, cross-referenced to dm-1/dm-4/dm-5/dm-11/dm-12). Viniyoga names all three Mahadevis jointly (the only stotra here so assigned). The Hindi rendering (pp.729-731) is plain; no Sanskrit tika glosses these excerpts verse-by-verse in this edition.`,
    keyPoints: [
      '**Seven verses, whole text**: Mahamaya (1.55) → Durge-smrita → two Narayani salutations → Sarvasvarupa armour → tushta/rushta → Sarvabadha close.',
      '**Sheltered become shelters** (v.6): Refuge propagates refuge.'
    ]
  },
  {
    id: 'dm-dvatrimsha',
    number: 'Durgā-dvātriṃśan-nāmamālā (32 names)',
    section: 'Uttarāṅga: 32-name garland (calamity refuge)',
    devanagari: `दुर्गा दुर्गार्तिशमनी दुर्गापद्विनिवारिणी।
दुर्गमच्छेदिनी दुर्गसाधिनी दुर्गनाशिनी ॥१॥
दुर्गतोद्धारिणी दुर्गनिहन्त्री दुर्गमापहा।
दुर्गमज्ञानदा दुर्गदैत्यलोकदवानला ॥२॥
दुर्गमा दुर्गमालोका दुर्गमात्मस्वरूपिणी।
दुर्गमार्गप्रदा दुर्गमविद्या दुर्गमाश्रिता ॥३॥
दुर्गमज्ञानसंस्थाना दुर्गमध्यानभासिनी।
दुर्गमोहा दुर्गमगा दुर्गमार्थस्वरूपिणी ॥४॥
दुर्गमासुरसंहन्त्री दुर्गमायुधधारिणी।
दुर्गमाङ्गी दुर्गमता दुर्गम्या दुर्गमेश्वरी ॥५॥
दुर्गभीमा दुर्गभामा दुर्गभा दुर्गदारिणी।
नामावलिमिमां यस्तु दुर्गाया मम मानवः ॥६॥
पठेत् सर्वभयान्मुक्तो भविष्यति न संशयः ॥७॥`,
    iast: `durgā durgārtiśamanī durgāpadvinivāriṇī |
durgamacchedinī durgasādhinī durganāśinī ||1||
durgatoddhāriṇī durganihantrī durgamāpahā |
durgamajñānadā durgadaityalokadavānalā ||2||
durgamā durgamālokā durgamātmasvarūpiṇī |
durgamārgapradā durgamavidyā durgamāśritā ||3||
durgamajñānasaṃsthānā durgamadhyanabhāsinī |
durgamohā durgamagā durgamārthasvarūpiṇī ||4||
durgamāsurasaṃhantrī durgamāyudhadhāriṇī |
durgamāṅgī durgamatā durgamyā durgameśvarī ||5||
durgabhīmā durgabhāmā durgabhā durgadāriṇī |
nāmāvalim imāṃ yas tu durgāyā mama mānavaḥ ||6||
paṭhet sarvabhayān mukto bhaviṣyati na saṃśayaḥ ||7||`,
    conceptIds: ['phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Durga Dvatrimsha-namamala pp.736-738 complete (deva-prarthana frame: Brahma-adi devas ask the speedy refuge-upaya; Devi answers with the 32; Hindi enumerates 1-32; phala: 108 recitations free all fears; purashcharana 30,000; tila-homa vidhi).`
      }
    ],
    translation: `"Durga, quencher of Durga-pains, warder of Durga-falls, cutter of the hard-to-cross, accomplisher of the hard, destroyer of Durga; lifter from the hard-pass, slayer of Durga, remover of the hard-to-reach; giver of hard-to-win gnosis, wildfire to the demon-world of Durga; the Hard herself, Her hard light, Her hard Self-nature; giver of the hard path, hard to know, shelter of the hard; seat of hard gnosis, shining in hard meditation; hard delusion, hard to approach, hard-meaning-natured; slayer of hard demons, bearer of hard weapons; hard-limbed, hard to fathom, hard to reach, queen of the hard; terrible-hard, radiant-hard, light-hard, cleaver of Durga — the man who reads this garland of My names is freed from all fears, no doubt."`,
    commentary: `**Frame (p.736 Hindi):** after Mahisha's fall, Brahma-adi devas, granted a boon-choice, ask not for goods but for the quick-refuge upaya for beings in संकट; Devi answers with the 32, "rahasyarupa... trilokya-sama stuti". Phala-vidhi (p.737-738): 108 recitations free the bound, the king-condemned, the battle-ringed, the tiger-caught; 1000/10,000/100,000 recitations (self or brahmana-led) free all apatti; 100,000 madhura-tila homas in siddha-agni; purashcharana 30,000. Operative homa counts are indexed, not ritualised, per this file's header rule.`,
    keyPoints: [
      '**Dur-ga hammered 32 ways**: Every name turns "hard-to-cross" into crossing.',
      '**108 for crisis**: The bound, condemned, ringed or seized are freed by 108 readings.'
    ]
  },
  {
    id: 'dm-kunjika-1',
    number: 'Siddha-Kuñjikā 1-4 + mūla-mantra (Rudrayāmala)',
    section: 'Uttarāṅga: Siddha-Kunjika (mantra-quickener)',
    devanagari: `शिव उवाच।
शृणु देवि प्रवक्ष्यामि कुञ्जिकास्तोत्रमुत्तमम्।
येन मन्त्रप्रभावेण चण्डीजापः शुभो भवेत् ॥१॥
न कवचं नार्गलास्तोत्रं कीलकं न रहस्यकम्।
न सूक्तं नापि ध्यानं च न न्यासो न च वार्चनम् ॥२॥
कुञ्जिकापाठमात्रेण दुर्गापाठफलं लभेत्।
अति गुह्यतरं देवि देवानामपि दुर्लभम् ॥३॥
गोपनीयं प्रयत्नेन स्वयोनिरिव पार्वति।
मारणं मोहनं वश्यं स्तम्भनोच्चाटनादिकम्।
पाठमात्रेण संसिद्ध्येत् कुञ्जिकास्तोत्रमुत्तमम् ॥४॥
अथ मन्त्रः।
ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे। ॐ ग्लौं हुं क्लीं जूं सः ज्वालय ज्वालय ज्वल ज्वल प्रज्वल प्रज्वल ऐं ह्रीं क्लीं चामुण्डायै विच्चे ज्वल हं सं लं क्षं फट् स्वाहा।
इति मन्त्रः।`,
    iast: `śiva uvāca |
śṛṇu devi pravakṣyāmi kuñjikāstotram uttamam |
yena mantraprabhāveṇa caṇḍījāpaḥ śubho bhavet ||1||
na kavacaṃ nārgalāstotraṃ kīlakaṃ na rahasyakam |
na sūktaṃ nāpi dhyānaṃ ca na nyāso na ca vārcanam ||2||
kuñjikāpāṭhamātreṇa durgāpāṭhaphalaṃ labhet |
ati guhyataraṃ devi devānām api durlabham ||3||
gopanīyaṃ prayatnena svayonir iva pārvati |
māraṇaṃ mohanaṃ vaśyaṃ stambhanoccāṭanādikam |
pāṭhamātreṇa saṃsiddhyet kuñjikāstotram uttamam ||4||
atha mantraḥ |
oṃ aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce | oṃ glauṃ huṃ klīṃ jūṃ saḥ jvālaya jvālaya jvala jvala prajvala prajvala aiṃ hrīṃ klīṃ cāmuṇḍāyai vicce jvala haṃ saṃ laṃ kṣaṃ phaṭ svāhā |
iti mantraḥ |`,
    conceptIds: ['sadhana-samara', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Siddha-Kunjika (Rudrayamala/Gauri-tantra, Shiva-Parvati samvada) pp.745-746: frame verses 1-4 + mula-mantra verbatim with Hindi; shatkarmas listed as attained "pathamatrena" (indexed, not operationalised).`
      }
    ],
    translation: `Shiva said: "Hear, Devi — I shall speak the supreme Kunjika-hymn, by whose mantra-power Chandi-recitation turns out well. No Kavacha, no Argala, no Kilaka, no Rahasya, no Sukta, no dhyana, no nyasa, not even worship (is needed). By Kunjika-reading alone one wins Durga-recitation's fruit. Most secret, Devi, rare even to gods. Guard it strivingly as your own womb, Parvati. Killing, confusing, mastering, arresting, expelling and the rest succeed by mere reading of this supreme Kunjika." Then the mantra: "Om Aim Hrim Klim Chamundaayai Vicche. Om Glaum Hum Klim Jum Sah — burn, burn, blaze, blaze, burn bright, burn bright — Aim Hrim Klim Chamundaayai Vicche — blaze — Ham Sam Lam Ksham Phat Svaha."`,
    commentary: `**The bold claim (v.2) read with the file's header rule:** "na kavacham..." is the tantra's own arthavada for the time-starved — Kunjika-reading alone bearing Durga-patha-phala. This entry transcribes frame + mantra exactly (pp.745-746) with Hindi; the bija-packed verses 5-8 continue in dm-kunjika-2. The edition's closing prayoga note maps marana→kama-krodha-nasha, mohana→ishtadeva-mohana, vashikarana→manas, stambhana→indriya-uparati, ucchatana→moksha-chhatpatahati (inner, not person-targeted rites); operative shatkarma recipes are NOT reproduced.`,
    keyPoints: [
      '**Alone suffices (arthavada)**: Kunjika-patha bears Durga-patha-phala for the unable.',
      '**Guard as womb**: Ati-guhyatara, devanam-api-durlabha — secrecy injunction.'
    ]
  },
  {
    id: 'dm-kunjika-2',
    number: 'Siddha-Kuñjikā 5-8 + phala (Rudrayāmala)',
    section: 'Uttarāṅga: Siddha-Kunjika (mantra-quickener)',
    devanagari: `नमस्ते रुद्ररूपिण्यै नमस्ते मधुमर्दिनि।
नमः कैटभहारिण्यै नमस्ते महिषार्दिनि ॥१॥
नमस्ते शुम्भहन्त्र्यै च निशुम्भासुरघातिनि ॥२॥
जाग्रतं हि महादेवि जपं सिद्धं कुरुष्व मे।
ऐंकारी सृष्टिरूपायै ह्रींकारी प्रतिपालिका ॥३॥
क्लींकारी कामरूपिण्यै बीजरूपे नमोऽस्तु ते।
चामुण्डा चण्डघाती च यैकारी वरदायिनी ॥४॥
विच्चे चाभयदा नित्यं नमस्ते मन्त्ररूपिणि ॥५॥
धां धीं धूं धूर्जटेः पत्नी वां वीं वूं वागधीश्वरी।
क्रां क्रीं क्रूं कालिका देवि शां शीं शूं मे शुभं कुरु ॥६॥
हुं हुं हुंकाररूपिण्यै जं जं जं जम्भनादिनी।
भ्रां भ्रीं भ्रूं भैरवी भद्रे भवान्यै ते नमो नमः ॥७॥
अं कं चं टं तं पं यं शं वीं दुं ऐं वीं हं क्षं।
धिजाग्रं धिजाग्रं त्रोटय त्रोटय दीप्तं कुरु कुरु स्वाहा।
पां पीं पूं पार्वती पूर्णा खां खीं खूं खेचरी तथा ॥८॥
सां सीं सूं सप्तशती देव्या मन्त्रसिद्धिं कुरुष्व मे।
इदं तु कुञ्जिकास्तोत्रं मन्त्रजागर्तिहेतवे।
अभक्ते नैव दातव्यं गोपितं रक्ष पार्वति।
यस्तु कुञ्जिकया देवि हीनां सप्तशतीं पठेत्।
न तस्य जायते सिद्धिररण्ये रोदनं यथा।`,
    iast: `namas te rudrarūpiṇyai namas te madhumardini |
namaḥ kaiṭabhahāriṇyai namas te mahiṣārdini ||1||
namas te śumbhahantriyai ca niśumbhāsuraghātini ||2||
jāgrataṃ hi mahādevi japaṃ siddhaṃ kuruṣva me |
aiṃkārī sṛṣṭirūpāyai hrīṃkārī pratipālikā ||3||
klīṃkārī kāmarūpiṇyai bījarūpe namo'stu te |
cāmuṇḍā caṇḍaghātī ca yaikārī varadāyinī ||4||
vicce cābhayadā nityaṃ namas te mantrarūpiṇi ||5||
dhāṃ dhīṃ dhūṃ dhūrjaṭeḥ patnī vāṃ vīṃ vūṃ vāgadhīśvarī |
krāṃ krīṃ krūṃ kālikā devi śāṃ śīṃ śūṃ me śubhaṃ kuru ||6||
huṃ huṃ huṃkārarūpiṇyai jaṃ jaṃ jaṃ jambhanādinī |
bhrāṃ bhrīṃ bhrūṃ bhairavī bhadre bhavānyai te namo namaḥ ||7||
aṃ kaṃ caṃ ṭaṃ taṃ paṃ yaṃ śaṃ vīṃ duṃ aiṃ vīṃ haṃ kṣaṃ |
dhijāgraṃ dhijāgraṃ troṭaya troṭaya dīptaṃ kuru kuru svāhā |
pāṃ pīṃ pūṃ pārvatī pūrṇā khāṃ khīṃ khūṃ khecarī tathā ||8||
sāṃ sīṃ sūṃ saptaśatī devyā mantrasiddhiṃ kuruṣva me |
idaṃ tu kuñjikāstotraṃ mantra-jāgarti-hetave |
abhakte naiva dātavyaṃ gopitaṃ rakṣa pārvati |
yas tu kuñjikayā devi hīnāṃ saptaśatīṃ paṭhet |
na tasya jāyate siddhir araṇye rodanaṃ yathā |`,
    conceptIds: ['sadhana-samara', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Siddha-Kunjika concl. pp.746-747 (verses + bija strings verbatim; closing "iti Rudrayamale Gauri-tantre Shiva-Parvati-samvade"; daily-morning prayoga note).`
      }
    ],
    translation: `"Salutations to Rudra-formed, Madhu-crusher, Kaitabha-slayer, Mahisha-slayer; to Shumbha-slayer and Nishumbha-slayer! Mahadevi, wake my recitation and perfect it! Aim-formed as creation, Hrim-formed as sustainer; Klim-formed as desire-formed, seed-formed — salutations! As Chamunda slayer of Chanda, as 'yai' granter of boons; as 'vicce' ever fear-removing — O mantra-formed, salutations! 'Dham Dhim Dhum' — wife of Dhurjati; 'Vam Vim Vum' — queen of speech; 'Kram Krim Krum' — Kalika Devi, 'Sham Shim Shum' — do me good! 'Hum Hum' — roar-formed, 'Jam Jam Jam' — teeth-gnasher; 'Bhram Bhrim Bhrum' — Bhadra Bhairavi Bhavani, salutations again and again! 'Am Kam Cham Tam Tam Pam Yam Sham Vim Dum Aim Vim Ham Ksham — wake, wake! burst, burst! kindle, kindle! Svaha. Pam Pim Pum — Parvati the Full; Kham Khim Khum — Khechari; Sam Sim Sum — perfect for me the mantra of the Seven-hundred, O Goddess! This Kunjika-hymn exists to wake the mantra; never give it to the devotionless; keep it hidden, guard it, Parvati! Who reads the Seven-hundred bereft of Kunjika wins no success — like weeping in a forest."`,
    commentary: `**Mantra-jagarti:** the hymn's own stated purpose (mantrajagarti-hetave) — waking sleeping mantras — hence the bija volleys and the troṭaya/dipta imperatives. The closing threat ("aranye rodanam yatha") mirrors the Kilaka's jnatva/ajnatva pairing: preparation is mandatory, not decorative. Daily-morning recitation note p.747: all badha-vighna destroyed; Kunjika + Devi Sukta + Saptashati = parama-siddhi.`,
    keyPoints: [
      '**Waking, not adding**: Kunjika wakes mantras (jagarti); the Saptashati stays the body.',
      '**Never to the devotionless**: Abhakte naiva datavyam — secrecy closes the hymn.'
    ]
  },
  {
    id: 'dm-ashtottara-note',
    number: 'Durgā-aṣṭottara-śata-nāma (108, index)',
    section: 'Uttarāṅga: 108-name litany (Vishvasara-tantra)',
    devanagari: `ईश्वर उवाच।
शतनाम प्रवक्ष्यामि शृणुष्व कमलानने।
यस्य प्रसादमात्रेण दुर्गा प्रीता भवेत् सती ॥१॥
ॐ सती साध्वी भवप्रीता भवानी भवमोचनी।
आर्या दुर्गा जया चाद्या त्रिनेत्रा शूलधारिणी ॥२॥
य इदं प्रपठेन्नित्यं दुर्गानामशताष्टकम्।
नासाध्यं विद्यते देवि त्रिषु लोकेषु पार्वति ॥१६॥
धनं धान्यं सुतं जायां हयं हस्तिनमेव च।
चतुर्वर्गं तथा चान्ते लभेन्मुक्तिं च शाश्वतीम् ॥१७॥`,
    iast: `īśvara uvāca |
śatanāma pravakṣyāmi śṛṇuṣva kamalānane |
yasya prasādamātreṇa durgā prītā bhavet satī ||1||
oṃ satī sādhvī bhavaprītā bhavānī bhavamocanī |
āryā durgā jayā cādyā trinetrā śūladhāriṇī ||2||
ya idaṃ prapaṭhen nityaṃ durgānāmaśatāṣṭakam |
nāsādhyaṃ vidyate devi triṣu lokeṣu pārvati ||16||
dhanaṃ dhānyaṃ sutaṃ jāyāṃ hayaṃ hastinam eva ca |
caturvargaṃ tathā cānte labhen muktiṃ ca śāśvatīm ||17||`,
    conceptIds: ['phalastuti', 'matrikas'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Durga Ashtottara-shata-nama (Vishvasara-tantra) pp.732-735: frame v.1 + 108 names in vv.2-15 (Sati...Brahmavadini; Hindi enumerates 1-108) + phala vv.16-21 (kumari-puja vidhi, yantra-dharana, Bhauma-amavasya shatabhisha prayoga); opening/closing verses verbatim, middle names indexed.`
      }
    ],
    translation: `Ishvara said: "I shall speak the hundred names; hear, lotus-faced — by whose mere grace Sati Durga is pleased. Om: Sati, Sadhvi, Bhavaprita, Bhavani, Bhavamochani; Arya, Durga, Jaya, Adya, Trinetra, Shuladharini..." (108 names through Kumari, Ekakanya... Kalaratri, Narayani, Bhadrakali, Vishnumaya... Shivadhuti, Karali, Ananta, Parameshvari, Katyayani, Savitri, Pratyaksha, Brahmavadini). "Who daily reads this 108 of Durga's names — nothing unaccomplishable remains in three worlds. Wealth, grain, son, wife, horse, elephant, the four aims, and at the end eternal liberation. Worshipping Kumari, meditating Sureshvari, worshipping with supreme devotion, then reading the 108..."`,
    commentary: `**Index, not reprint:** all 108 names stand in Sanskrit vv.2-15 (pp.732-734) with Hindi enumeration 1-108; this entry transcribes frame + opening + phala and indexes the middle span so the nama-list is findable without a 108-line duplicate card. Yantra-dharana (gorochana/laksha/kumkuma/sindura/karpura/madhutraya, v.20) and Bhauma-amavasya midnight shatabhisha-likhana-patha (v.21) are indexed as vidhi, not ritualised. Colophon: Vishvasara-tantra.`,
    keyPoints: [
      '**108, Sati to Brahmavadini**: Antahkarana names (manas/buddhi/ahankara/chitta) sit inside the garland — inner faculties as Her names.',
      '**Kumari-puja first**: Worship the maiden, meditate Sureshvari, then read (v.18).'
    ]
  },
  {
    id: 'dm-manasa-atharva-note',
    number: 'Mānasa-pūjā + Atharvaśīrṣa (indexes)',
    section: 'Uttarāṅga: mental worship + Atharva crown (indexes)',
    devanagari: `॥ मानसपूजार्थं त्रिपुरसुन्दरीध्यानम् ॥
॥ अथ देव्यथर्वशीर्षम् ॥
ॐ सर्वे वै देवा देवीमुपतस्थुः कासि त्वं महादेवीति ॥१॥
साब्रवीत् अहं ब्रह्मस्वरूपिणी। मत्तः प्रकृतिपुरुषात्मकं जगत् शून्यं चाशून्यं च ॥२॥`,
    iast: `|| mānasapūjārthaṃ tripurasundarīdhyānam ||
|| atha devyatharvaśīrṣam ||
oṃ sarve vai devā devīm upatasthuḥ kāsi tvaṃ mahādevīti ||1||
sābravīt ahaṃ brahmasvarūpiṇī | mattaḥ prakṛtipuruṣātmakaṃ jagat śūnyaṃ cāśūnyaṃ ca ||2||`,
    conceptIds: ['cit-shakti', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Manasa-puja pp.739-744 (Tripurasundari upacharas: paduka/simhasana/gandha/vasana/keshadi, Hindi throughout; condensed index). Devi-Atharvashirsha pp.748-759+ (Atharvaveda; deva-prashna 1, brahmasvarupini-uttara 2-7 incl. Rgvedokta echoes 5-7, deva-stuti 8-14 incl. Panchadashi-vidya; EXPLICITLY non-shadanga per edition footnote p.748: "shadangon mein samavesh na hone par bhi Atharva-mahatmya se labh"; condensed index).`
      }
    ],
    translation: `Two indexes (openings verbatim, bodies summarised): (1) Manasa-puja — mental upacharas to Tripurasundari from footstool (paduka washed in sandal-kumkuma streams, jewel-pearl set, wiped by surasundaris) through lion-throne, gandha-udvartana, amalaka, kasha-samskara, kasturi, kashmira-vasana to daily alankara; each closed "grihana ambike". (2) Atharvashirsha — all gods approach ("kasi tvam mahadevi?"); She answers "aham brahmasvarupini" (void and non-void from Me; ananda/ananda, vijnana/avijnana, brahma/abrahma, pancha/apanchabhuta, all this world are I; Veda/aveda, vidya/avidya...), then Rgvedokta echoes (rudrebhir-vasubhih...), deva-stuti (namo devyai... agnivarnaam...), Vag-sukta, Kalaratri litany, Mahalakshmi-gayatri, Daksha-duhita, and the Panchadashi mula-vidya with shad-vidha artha pointer (Nityashodashikarnava/Varivasyarahasya).`,
    commentary: `**Why indexes:** both are complete parayana limbs in this edition but each is a small book in itself (Manasa-puja 6+ upachara verses with long Hindi; Atharvashirsha 20+ sections into Pitha/Kalika tracts pp.760-794). The edition's own footnote excludes Atharvashirsha from the shadanga while commending it — this entry honours that distinction instead of inflating the anga count. Full transcription is future work; no verse invented here.`,
    keyPoints: [
      '**Manasa = inner upachara**: Every outer offering rehearsed mentally to Tripurasundari first.',
      '**Atharvashirsha non-shadanga**: Commended by Atharva-mahatmya, not counted among the six — per the edition itself.'
    ]
  }
];
