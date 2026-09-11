// Uttaranga auxiliaries, set 3: the Parishista collection (pp.760-794).
//
// SOURCE: same Guptavati-adi sapta-tika Drive PDF (814 pp) as
// devi-mahatmya-verses-en-uttaranga.ts / -uttaranga2.ts. Page map lives in
// devi-mahatmya-source-provenance.ts — each entry below cites its pages.
// (Citations give the PDF-index page; the edition's own printed foliation
// runs ~6 behind, e.g. index p760 = printed 754.)
// Nothing here duplicates ch01-ch13, Kavaca/Argala/Kilaka, Rgvedokta
// Devi Sukta, Rahasya digests, Kshama, mantra-vibhaga notes, or sets 1-2.
// Short stotras are transcribed in full; long lists (Pitha 108, Mahavidya
// samvada, Kalika-mahatmya, Laghu 18, Kali 17, Para-devi 1000-name mala,
// 30 Samputas) follow this directory's digest rule: frame + opening and
// closing verses verbatim, bodies indexed with counts, no verse invented.
// Part of the Devi Mahatmya EN verses. Merged by
// devi-mahatmya-verses-en.ts. Do not import directly.
import type { RawVerseEn } from './devi-mahatmya-verses-en';

const PROVENANCE =
  'Guptavati-adi sapta-tika Durga-Saptashati edition (Drive PDF, 814 pp).';

export const deviMahatmyaVersesEnUttaranga3: RawVerseEn[] = [
  {
    id: 'dm-pitha-rahasya',
    number: 'Pīṭha-rahasya (108 seats, digest)',
    section: 'Pariśiṣṭa: Pīṭha-rahasya (Matsya-purāṇa)',
    devanagari: `॥ सूत उवाच ॥
एकमुक्तोऽब्रवीद् दक्षः केषु केषु ममानघे ! ।
तीर्थेषु च त्वं द्रष्टव्या स्तोतव्या कैश्च नामभिः ॥१०॥
॥ देव्युवाच ॥
सर्वदा सर्वभूतेषु द्रष्टव्या सर्वतो भुवि ।
सर्वलोकेषु यत् किञ्चिद् रहितं न मया विना ॥११॥
तथापि येषु स्थानेषु द्रष्टव्या सिद्धिमीप्सुभिः ।
स्मर्तव्या भूतिकामैर्वा तानि वक्ष्यामि तत्त्वतः ॥१२॥
वाराणस्यां विशालाक्षी नैमिषे लिङ्गधारिणी ।
प्रयागे ललिता देवी कामाक्षी गन्धमादने ॥१३॥
यः स्मरेच्छृणुयाद् वापि सर्वपापैः प्रमुच्यते ।
एषु तीर्थेषु यः कृत्वा स्नानं पश्यति मां नरः ॥४२॥
सर्वपापविनिर्मुक्तः कल्पं शिवपुरे वसेत् ॥४३॥`,
    iast: `|| sūta uvāca ||
ekam ukto'bravīd dakṣaḥ keṣu keṣu mamānaghe! |
tīrtheṣu ca tvaṃ draṣṭavyā stotavyā kaiśca nāmabhiḥ ||10||
|| devyuvāca ||
sarvadā sarvabhūteṣu draṣṭavyā sarvato bhuvi |
sarvalokeṣu yat kiñcid rahitaṃ na mayā vinā ||11||
tathāpi yeṣu sthāneṣu draṣṭavyā siddhimīpsubhiḥ |
smartavyā bhūtikāmairvā tāni vakṣyāmi tattvataḥ ||12||
vārāṇasyāṃ viśālākṣī naimiṣe liṅgadhāriṇī |
prayāge lalitā devī kāmākṣī gandhamādane ||13||
yaḥ smarecchṛṇuyād vāpi sarvapāpaiḥ pramucyate |
eṣu tīrtheṣu yaḥ kṛtvā snānaṃ paśyati māṃ naraḥ ||42||
sarvapāpavinirmuktaḥ kalpaṃ śivapure vaset ||43||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Pitha-rahasya, index pp.760-762 (printed 754-756): Suta-Devi samvada, "Shrimatsya-purane trayodasho'dhyaye varnitam" colophon; Daksha's question (v.10) + Devi's sarvavyapi-uttara (vv.11-12) + 108 pitha-name verses (vv.13-40: Varanasi-Vishalakshi ... Chitta-Brahmakala) + phala (vv.41-46) verbatim above in frame and close; middle names indexed.`
      }
    ],
    translation: `Suta said: "Thus addressed, Daksha asked: 'Faultless one — in which holy seats am I to behold You, and by which names to praise You?' The Goddess answered: 'At all times, in all beings, everywhere on earth am I to be beheld; in all worlds there is nothing at all apart from Me. Yet the seats where seekers of success should behold Me, seekers of welfare remember Me — those I shall tell in truth. In Varanasi as Vishalakshi, in Naimisha as Lingadharini; in Prayaga the Goddess Lalita, on Gandhamadana as Kamakshi...' (108 seats through Bhairava-dharana, Pitha-names to Chitta-Brahmakala). 'Who remembers or hears this is freed from all sins; the man who, having bathed in these seats, beholds Me, freed of every sin dwells a kalpa in Shivapura.'"`,
    commentary: `**Condensed digest (Matsya-purana adhyaya 13; frame + close verbatim):** the theology comes before the geography — verse 11 first refuses all pitha-limitation ("nothing apart from Me"), and only then verse 12 concedes the concession-seats for siddhi/bhuti seekers. The 108 run Varanasi to Chitta, mixing tirtha (Prayaga, Pushkara, Kedara, Ganga, Prabhasa), kshetras (Vindhya-Vindhyavasini, Karavira-Mahalakshmi, Dakshina-Kamakhya implied), and inner seats (Chitta-Brahmakala, Sarvasharira-Shakti, Vedavadana-Gayatri) — outer and inner pithas in one garland, like the Ashtottara hiding antahkarana names. Phala (vv.41-46): smarana/shravana frees all papa; snana-darshana wins a kalpa in Shivapura; tritya/ashtami shravana before Shiva wins many sons; daily patha in devarchana-vidhi reaches Brahman.`,
    keyPoints: [
      '**Nothing apart from Me first**: Sarvavyapi-uttara (v.11) precedes the 108 — geography serves, never bounds.',
      '**108 outer + inner**: Tirtha-ksetras and Chitta/Brahmakala in one garland.'
    ]
  },
  {
    id: 'dm-mahavidya-rahasya',
    number: 'Mahāvidyā-rahasya (10 forms, digest)',
    section: 'Pariśiṣṭa 3: Mahāvidyā-rahasya (Mahābhāgavata)',
    devanagari: `॥ सती उवाच ॥
त्वं याहि वा महादेव ! मा वा कुरु यथारुचि ।
अहं यास्मामि तत्राज्ञां देहि मां त्वं महेश्वर ! ॥२३॥
कन्या पितृगृहे श्रुत्वा महायज्ञमहोत्सवम् ।
कथं धैर्यं समास्थाय स्थातुमुत्सहते गृहे ॥२४॥
॥ शिव उवाच ॥
असम्मानभयं येषां वर्तते न दुरात्मनाम् ।
त एव तत्र गच्छन्ति यत्रासम्मानसम्भवः ॥३४॥
मान्यः कदापि नो गच्छेदपूजकगृहे सति ! ।
अपूजकस्य या पूजा न सा पूजेति भण्यते ॥३५॥
॥ सती उवाच ॥
न पश्यसि महादेव ! सतीं मां पुरतः स्थिताम् ।
काली तारा च लोकेशी कमला भुवनेश्वरी ॥६१॥
छिन्नमस्ता षोडशी च सुन्दरी बगलामुखी ।
धूमावती च मातङ्गी नामान्यासामिमानि वै ॥६२॥
॥ देवी उवाच ॥
वामे तवेयं या देवी सा शम्भो ! भुवनेश्वरी ।
पृष्ठतस्तव या देवी बगला शत्रुसूदिनी ॥६७॥
वह्निकोणे तवेयं या विधवारूपधारिणी ।
सेयं धूमावती देवी महाविद्या महेश्वरी ॥६८॥
नैऋत्यां तव या देवी सेयं त्रिपुरसुन्दरी ।
वायौ यत्ते महाविद्या सेयं मातङ्गकन्यका ॥६९॥
ऐशान्यां षोडशी देवी महाविद्या महेश्वरी ।
अहं तु भैरवी भीमा शम्भो ! मा त्वं भयं कुरु ॥७०॥`,
    iast: `|| satī uvāca ||
tvaṃ yāhi vā mahādeva! mā vā kuru yathāruci |
ahaṃ yāsyāmi tatrājñāṃ dehi māṃ tvaṃ maheśvara! ||23||
kanyā pitṛgṛhe śrutvā mahāyajñamahotsavam |
kathaṃ dhairyaṃ samāsthāya sthātum utsahate gṛhe ||24||
|| śiva uvāca ||
asammānabhayaṃ yeṣāṃ vartate na durātmanām |
ta eva tatra gacchanti yatrāsammānasambhavaḥ ||34||
mānyaḥ kadāpi no gacched apūjakagṛhe sati! |
apūjakasya yā pūjā na sā pūjeti bhaṇyate ||35||
|| satī uvāca ||
na paśyasi mahādeva! satīṃ māṃ purataḥ sthitām |
kālī tārā ca lokeśī kamalā bhuvaneśvarī ||61||
chinnamastā ṣoḍaśī ca sundarī bagalāmukhī |
dhūmāvatī ca mātaṅgī nāmānyāsām imāni vai ||62||
|| devyuvāca ||
vāme taveyaṃ yā devī sā śambho! bhuvaneśvarī |
pṛṣṭhatas tava yā devī bagalā śatrusūdinī ||67||
vahnikoṇe taveyaṃ yā vidhavārūpadhāriṇī |
seyaṃ dhūmāvatī devī mahāvidyā maheśvarī ||68||
nairṛtyāṃ tava yā devī seyaṃ tripurasundarī |
vāyau yatte mahāvidyā seyaṃ mātaṅgakanyakā ||69||
aiśānyāṃ ṣoḍaśī devī mahāvidyā maheśvarī |
ahaṃ tu bhairavī bhīmā śambho! mā tvaṃ bhayaṃ kuru ||70||`,
    conceptIds: ['parishista-samgraha', 'mahamaya', 'cit-shakti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Mahavidya-rahasya (Mahabhagavata Upapurana, ashtama adhyaya) index pp.763-769 (printed 757-763): Daksha-yajna samvada vv.1-46 (Sati's plea 23-29, Shiva's niti 3-22 + 30-36 refusal) + Sati's bhayanaka-rupa assumption vv.44-60 (digambara, chaturbhuja, mundamala, ardha-chandra-shekhara) + ten-direction stations vv.56-60 + Sati's self-naming vv.61-62 + Shiva's prashna v.63 + Devi's per-direction mapping vv.64-70 + phala/secrecy vv.71-75; key verses verbatim above.`
      }
    ],
    translation: `Sati said: "Go or not, Mahadeva, as You please — I shall go there; give me leave, Maheshvara! A daughter who hears of a great sacrifice-festival at her father's house — how can she hold firm and stay home?" Shiva answered: "Sati — those who fear no dishonour, the ill-souled, go where dishonour awaits; the honoured never enter the house of the non-worshipper, for a non-worshipper's worship is no worship." ... Then, enraged, red-eyed, Sati assumed the terrible form — ash-smeared limbs, fearful laugh, four arms, garlanded with heads — and, as Shiva fled in fear to every quarter, stood before him in ten directions as ten supreme forms. Shiva asked, trembling: "Who are You, dark one — where is Sati, my life's beloved?" Sati answered: "Do You not see me, Mahadeva — Sati standing before You? Kali, Tara, Lokeshvari, Kamala, Bhuvaneshvari; Chhinnamasta, Shodashi, Sundari, Bagalamukhi; Dhumavati and Matangi — these are their names." The Goddess mapped them: "Dark before You is Kali; above, Tara of Mahakala-form; headless and fearful at Your side, Chhinnamasta; at Your left, Bhuvaneshvari; behind You, foe-crushing Bagala; in the fire-corner, widow-formed Dhumavati; southwest, Tripurasundari; in the wind-quarter, Matanga-maiden; northeast, Shodashi. And I am terrible Bhairavi — Shiva, fear not!"`,
    commentary: `**Condensed digest (Mahabhagavata 8; stations verbatim):** the samvada first stages dharma-niti (uninvited going = death, vv.3-22; jamata-shvashura reciprocity vv.6-10) only to overrule it by Shakti-svatantra — Sati's "ajnapaya va no va, satyam vadami" (v.32) and Shiva's own surrender ("yatharuchi kuru", v.43). The ten forms are directional guards (dig-bandha): Kali front, Tara above, Chhinnamasta at side, Bhuvaneshvari left, Bagala behind, Dhumavati agneya, Sundari nairritya, Matangi vayavya, Shodashi aishanya, Bhairavi centre — the compass itself as Her body. Close (vv.71-75): all ten grant chaturvarga to daily bhaktas and perform the shatkarmas; all are gopaniya — mantra, yantra, puja-homa-vidhi, purashcharana, stotra, kavaca, achara-niyama — "tvameva vakshyasi, vibho" (only Shiva may speak them; His agama-shastra shall be famed on earth). Operative prayogas are indexed, not reproduced.`,
    keyPoints: [
      '**Compass as body**: Ten directions, ten Vidyas — no quarter without Her face.',
      '**Bhairavi centre**: "Aham tu Bhairavi" — the terrible centre that tells even Shiva not to fear.'
    ]
  },
  {
    id: 'dm-kalika-mahatmya',
    number: 'Kālikā-sthāna-māhātmya (Śaila-kṣetra, digest)',
    section: 'Pariśiṣṭa 4: Kālikā-māhātmya (Skanda-purāṇa)',
    devanagari: `॥ व्यास उवाच ॥
शैलोद्देशे महाभागाः क्षेत्रं काल्याः प्रशस्यते ।
कालिकेति च विख्याता शैलोद्देशेऽतिशोभने ॥१॥
स्मृत्वापि कालीं कलिकल्मषघ्नीं
बालग्रहा ये ग्रहनायकाश्च ।
द्रवन्ति रक्षांसि भयप्रदानि
सिद्धिं ह्यभीष्टां मनुजाः प्रयान्ति ॥८॥
॥ इन्द्र उवाच ॥
साम्प्रतं शुम्भदैत्येन निर्जिताश्छद्मकारिणा ।
देवताः समनुप्राप्ताः शरणं ते परमेश्वरि ! ॥२५॥
॥ देव्युवाच ॥
हनिष्यामि दुराचारं सहमित्रं सबान्धवम् ।
शुम्भं चैव निशुम्भं च चण्डमुण्डावुभावपि ॥२८॥
अष्टम्यां च चतुर्दश्यां ये पठन्ति समाहिताः ।
शृण्वन्ति चैव ये भक्त्या ते यान्ति परमां गतिम् ॥४२॥`,
    iast: `|| vyāsa uvāca ||
śailoddeśe mahābhāgāḥ kṣetraṃ kālyāḥ praśasyate |
kāliketi ca vikhyātā śailoddeśe'tiśobhane ||1||
smṛtvāpi kālīṃ kalikalmaṣaghnīṃ
bālagrahā ye grahanāyakāśca |
dravanti rakṣāṃsi bhayapradāni
siddhiṃ hyabhīṣṭāṃ manujāḥ prayānti ||8||
|| indra uvāca ||
sāmprataṃ śumbhadaityena nirjitāś chadmakāriṇā |
devatāḥ samanuprāptāḥ śaraṇaṃ te parameśvari! ||25||
|| devyuvāca ||
haniṣyāmi durācāraṃ sahamitraṃ sabāndhavam |
śumbhaṃ caiva niśumbhaṃ ca caṇḍamuṇḍāvubhāvapi ||28||
aṣṭamyāṃ ca caturdaśyāṃ ye paṭhanti samāhitāḥ |
śṛṇvanti caiva ye bhaktyā te yānti paramāṃ gatim ||42||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'future-avatars'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Kalika-sthana-mahatmya-stuti, index pp.770-774 (printed 764-774+fn): Vyasa frame vv.1-12 (Shaila-kshetra praise, Kaushiki/Chanda-Munda/Raktabija past, deva-matri worship) + deva-stuti vv.14-19 (Yoganidra, Madhu-Kaitabha, Mahisha pasts) + Devi's Jahnavi-snana appearance + Indra's sharanagati vv.24-26 + Devi's pratijna vv.28-29 + sthala-phala vv.34-42 ("iti Skandapurane Manasakhande Shaila-parvata-Kalika-mahatmye saptanavatitamo'dhyayah", 97/3-44); key verses verbatim above. Edition footnote (p.774) glosses Shaila as the Pithoragarh hill and Jahnavi as its stream, and cross-refs Saptashati 5/10 and 5/84-88.`
      }
    ],
    translation: `Vyasa said: "Fortunate ones — in the Shaila region the field of Kali is praised; as Kalika She is famed in that most-beautiful Shaila land. Even by remembering Kali, destroyer of Kali-age stains — child-seizers, planet-lords flee; fear-giving demons run; men win their longed-for success." ... Indra said: "Now, cheated and conquered by the demon Shumbha, the gods have come to You for refuge, Supreme Lady!" The Goddess answered: "I shall slay the ill-conducted one with friends and kin — Shumbha and Nishumbha, Chanda and Munda both. Till I slay that vilest demon, here in the Shaila land I shall dwell — no doubt." ... "Who read collectedly on ashtami and chaturdashi, who hear with devotion — they reach the supreme goal."`,
    commentary: `**Condensed digest (Skanda-purana Manasa-khanda 97):** the tract does for place what Pitha-rahasya does for seats — fixes ONE ksetra (Shaila, glossed by the edition as the Pithoragarh hill, not "any mountain") where Kaushiki's past victories (Chanda-Munda, Raktabija-blood-drinking) make Her permanently resident with deva-shaktis and sixteen Matris. The deva-stuti (vv.14-19) recaps all three caritas as credentials before asking; Devi's pratijna (vv.28-29) mirrors the Murti-rahasya future-tense ("hanishyami... yavat... vasishyami"). Sthala-phala (vv.36-40): worshipped with bali/gandha/pushpa/akshata per Agama, devotees never see durgati, daridrya-bhaya, graha-roga or shatru-bhaya; snana in Kalika-waters + puja leads to Shivapura.`,
    keyPoints: [
      '**One hill, all victories**: Past slayings make Shaila Her permanent residence — place as condensed history.',
      '**Pratijna tense**: "I shall slay... till then I dwell" — future avatara in one ksetra.'
    ]
  },
  {
    id: 'dm-laghu-saptashati',
    number: 'Laghu-Saptaśatī (Pr̥thvīdhara, digest)',
    section: 'Pariśiṣṭa 5: Laghu-Saptaśatī-stotra (Caṇḍī-stotra)',
    devanagari: `नमोऽस्तु ते शङ्करवल्लभायै ।
नारायणवल्लभायै
श्रीचण्डिकायै शरणं प्रपद्ये ॥१॥
यत्कर्मधर्मनिलयं प्रवदन्ति तज्ज्ञा
यज्ञादिकं तदखिलं सफलं त्वयैव ।
त्वं चेतना यत इति प्रविचार्य चित्तं
नित्ये ! त्वदीयचरणौ शरणं प्रपद्ये ॥१॥
मोहान्मया कृतमिदं सकलापराधं
मातः ! क्षमस्व वरदे ! बहिरन्तरस्थे ॥१५॥
एतत्पठेदनुदिनं दनुजान्तकारि
चण्डीचरित्रमतुलं भुवि यस्त्रिकालम् ।
श्रीमान् सुखी स विजयी सुभगः क्षमः स्यात्
त्यागी चिरन्तनवपुः कविचक्रवर्ती ॥१६॥
श्री-सिद्धनाथापरनामधेयः
श्री-शम्भुनाथो भुवनैकनाथः ।
तस्य प्रसादात् सकलागमाच्च
पृथ्वीधरः स्तोत्रमिदं चकार ॥१७॥`,
    iast: `namo'stu te śaṅkaravallabhāyai |
nārāyaṇavallabhāyai
śrīcaṇḍikāyai śaraṇaṃ prapadye ||1||
yat karmadharmanilayaṃ pravadanti tajjñā
yajñādikaṃ tad akhilaṃ saphalaṃ tvayaiva |
tvaṃ cetanā yata iti pravicārya cittaṃ
nitye! tvadīyacaraṇau śaraṇaṃ prapadye ||1||
mohān mayā kṛtam idaṃ sakalāparādhaṃ
mātaḥ! kṣamasva varade! bahirantarasthē ||15||
etat paṭhed anudinaṃ danujāntakāri
caṇḍīcaritram atulaṃ bhuvi yas trikālam |
śrīmān sukhī sa vijayī subhagaḥ kṣamaḥ syāt
tyāgī cirantanavapuḥ kavicakravartī ||16||
śrī-siddhanāthāparanāmadheyaḥ
śrī-śambhunātho bhuvanaikanāthaḥ |
tasya prasādāt sakalāgamāc ca
pṛthvīdharaḥ stotram idaṃ cakāra ||17||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Laghu-Saptashati-stotra (Chandi-stotra, Prithvidhara, grace of Shambhunatha/Siddhanatha) index pp.775-778 (printed 769-772): mangala-sharanagati + karana-stotra (Brahma-adi worship, sindura-varna dhyana) + siddhanatha-bhasha verse + 15 charita-smarana verses (Varuna-bija, Vishnu-mohana, Madhu-Kaitabha, Mahisha, Dhumralochana, Chanda-Munda, Shivadvaiti, Raktabija, Shumbha-Nishumbha, pralaya-tejas, aruna-dhyana v.13, antar-bahir kshama v.15) + phala v.16 + karta colophon vv.17-18 + full viniyoga (Sadashiva rishi, Anushtubh, Trimurti devata, Aim bija, Hrim shakti, Shrilakshmi kilaka, chaturvidha-purushartha); frame and close verbatim above.`
      }
    ],
    translation: `"Salutations to Shankara's beloved, to Narayana's beloved — to Shri Chandika I go for refuge. What knowers call the home of karma and dharma — sacrifice and all — bears fruit only through You; since You are the sentience within, weighing this in mind, O Eternal — I take refuge at Your feet." (Then the whole Saptashati in fifteen breaths: Her Varuna-seed remembered daily wins kingdoms; Vishnu Himself lies enchanted in Her delusion-net; Madhu-Kaitabha, Mahisha, Dhumralochana-as-homa, Chanda-Munda under Her sword, Shiva Himself as Her messenger, Raktabija-seeds swallowed from the sky, Shumbha-Nishumbha led to heaven, demons as moths in Her world-fire.) "Whatever whole offence I did from delusion — Mother, boon-giver, dwelling within and without — forgive! Who reads this demon-ending, matchless Chandi-charita daily at three times — fortunate, happy, victorious, beloved, patient, generous, long-bodied, a king of poets he becomes. By grace of Shambhunatha, named Siddhanatha, lord of the single world, and from all Agamas — Prithvidhara made this hymn."`,
    commentary: `**Condensed digest (18 verses + viniyoga):** the Laghu earns its name — each carita-episode compressed to one shloka (vv.2-12), so the whole war fits a single sitting between two sharanagatis. Verse 13 fixes the aruna-dhyana (lightning-dark? no — aruna-hued, sudha-kalasha + matulunga + khetaka + gada in four hands); verse 14 turns inward ("antah sthita... tantu-rupa... bahir vishva-rupa") then begs avana as nishprapancha; verse 15 makes the kshama internal-external ("bahir-antar-sthe"). The karta-colophon (vv.17-18) attributes authorship to prasada + Agama, and the viniyoga seals it as mantra (Trimurti-devata, Aim-Hrim-Shrilakshmi) for all four purusharthas — a pocket Saptashati, complete with rishi-chandas-devata.`,
    keyPoints: [
      '**Whole war, one sitting**: Fifteen verses carry Madhu to Shumbha — epitome between two refuges.',
      '**Pocket mantra**: Full viniyoga for four aims; Prithvidhara claims prasada, not invention.'
    ]
  },
  {
    id: 'dm-apaduddhara',
    number: 'Durgā-āpaduddhāra-stotra 1-13',
    section: 'Pariśiṣṭa 6: Durgā-āpaduddhāra-stotra',
    devanagari: `नमस्ते शरण्ये ! शिवे ! सानुकम्पे !
नमस्ते जगद्व्यापिके ! विश्वरूपे ! ।
जगद्वन्द्यपादारविन्दे ! नमस्ते
नमस्ते जगच्चिन्त्यमानस्वरूपे !
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥१॥
अनाथस्य दीनस्य तृष्णातुरस्य
भयार्तस्य भीतस्य बद्धस्य जन्तोः ।
त्वमेका गतिर्देवि ! निस्तारक
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥३॥
अरण्ये रणे दारुणे शत्रुमध्येऽ-
नले सागरे प्रान्तरे राजगेहे ।
त्वमेका गतिर्देवि ! निस्तारनौका
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥४॥
अपारे महादुस्तरेऽत्यन्तघोरे
विपत्सागरे मज्जतां देहभाजाम् ।
त्वमेका गतिर्देवि ! निस्तारहेतु-
र्नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥५॥
नमश्चण्डिके ! चण्डदुर्दण्डलीला-
समुत्खण्डिताखण्डिताशेषशत्रो ! ।
त्वमेका गतिर्देवि ! निस्तारबीजं
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥६॥
त्वमेवाघभावाधृतासत्यवाटी
न जाताजितक्रोधनात् क्रोधनिष्ठा ।
इडा पिङ्गला त्वं सुषुम्णा च नाडी
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥७॥
नमो देवि ! दुर्गे ! शिवे ! भीमनादे !
सरस्वत्यरुन्धत्यमोघस्वरूपे ।
विभूतिः शची कालरात्री गतिस्त्वं
नमस्ते जगत्तारिणि ! त्राहि दुर्गे ! ॥८॥
शरणमसि सुराणां सिद्धविद्याधराणां
मुनिमनुजपशूनां दस्युभिस्त्रासितानाम् ।
नृपतिगृहगतानां व्याधिभिः पीडितानां
त्वमसि शरणमेका देवि ! दुर्गे ! प्रसीद ॥९॥
इदं स्तोत्रं मया प्रोक्तमापदुद्धारहेतुकम् ।
त्रिसन्ध्यमेकसन्ध्यं वा पठनाद् घोरसङ्कटात् ॥१०॥
मुच्यते नाऽत्र सन्देहो भुवि स्वर्गे रसातले ।
सर्व वा श्लोकमेकं वा यः पठेद् भक्तिमान् सदा ॥११॥
स सर्वं दुष्कृतं त्यक्त्वा प्राप्नोति परमं पदम् ।
पठनादस्य देवेशि ! किं न सिध्यति भूतले ॥१२॥
स्तवराजमिमं देवि ! संक्षेपात् कथितं मया ॥१३॥
॥ जगदम्बार्पणमस्तु ॥`,
    iast: `namas te śaraṇye! śive! sānukampe! |
namas te jagadvyāpike! viśvarūpe! |
jagadvandyapādāravinde! namas te
namas te jagaccintyamānasvarūpe! |
namas te jagattāriṇi! trāhi durge! ||1||
[+ mahāyogini/jñānarūpe/sadānandarūpe ||2||]
anāthasya dīnasya tṛṣṇāturasya
bhayārtasya bhītasya baddhasya jantoḥ |
tvam ekā gatir devi! nistāraka
namas te jagattāriṇi! trāhi durge! ||3||
araṇye raṇe dāruṇe śatrumadhye'-
nale sāgare prāntare rājagehe |
tvam ekā gatir devi! nistāranaukā
namas te jagattāriṇi! trāhi durge! ||4||
apāre mahādustare'tyantaghore
vipatsāgare majjatāṃ dehabhājām |
tvam ekā gatir devi! nistārahetur
namas te jagattāriṇi! trāhi durge! ||5||
namaścaṇḍike! caṇḍadurdaṇḍalīlā-
samutkhaṇḍitākhaṇḍitāśeṣaśatro! |
tvam ekā gatir devi! nistārabījaṃ
namas te jagattāriṇi! trāhi durge! ||6||
tvam evāghabhāvādhṛtāsatyavāṭī
na jātājitakrodhanāt krodhaniṣṭhā |
iḍā piṅgalā tvaṃ suṣumnā ca nāḍī
namas te jagattāriṇi! trāhi durge! ||7||
namo devi! durge! śive! bhīmanāde! |
sarasvatyarundhatyamoghasvarūpe! |
vibhūtiḥ śacī kālarātrī gatis tvaṃ
namas te jagattāriṇi! trāhi durge! ||8||
śaraṇam asi surāṇāṃ siddhavidyādharāṇāṃ
munimanujapaśūnāṃ dasyubhis trāsitānām |
nṛpatigṛhagatānāṃ vyādhibhiḥ pīḍitānāṃ
tvam asi śaraṇam ekā devi! durge! prasīda ||9||
idaṃ stotraṃ mayā proktam āpaduddhārahetukam |
trisandhyam ekasandhyaṃ vā paṭhanād ghorasaṅkaṭāt ||10||
mucyate nā'tra sandeho bhuvi svarge rasātale |
sarvaṃ vā ślokam ekaṃ vā yaḥ paṭhed bhaktimān sadā ||11||
sa sarvaṃ duṣkṛtaṃ tyaktvā prāpnoti paramaṃ padam |
paṭhanād asya deveśi! kiṃ na sidhyati bhūtale ||12||
stavarājam imaṃ devi! saṃkṣepāt kathitaṃ mayā ||13||
|| jagadambārpaṇam astu ||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Durga-apaduddhara-stotra complete, pp.779-780 (printed 773-774): 9 refrain-verses (vv.1-9, each closing "namaste jagattarini! trahi Durge!") + phala vv.10-13 + "jagadambarpaṇamastu"; verse 2 (Mahayogini/jnana/sadananda) summarised in brackets, all else verbatim.`
      }
    ],
    translation: `"Salutations, Refuge, Shivaa, Compassionate! All-pervading, world-formed! Worshipped-lotus-feet! Form pondered by the world! World-ferrying one — save, Durga! (To the Great Yogini, Gnosis-formed, ever-bliss-formed!) Of the orphan, the lowly, the thirst-crazed, the pain-struck, the frightened, the bound creature — You alone are the way, the crossing. In forest, in battle, in the dreadful, amid foes, in fire, in ocean, in wilderness, in the king's house — You alone are the way, the crossing-boat. For embodied ones drowning in the shoreless, most-uncrossable, most-dreadful sea of calamity — You alone are the way, the crossing-cause. Chandika — whose fierce-staff sport cuts yet leaves whole every foe — You alone are the way, the crossing-seed. You are Ida, Pingala, Sushumna; Devi Durga of dread sound, Sarasvati, Arundhati, unfailing-formed; Glory, Shachi, Kalaratri — You are the goal. Refuge of gods, siddhas, vidyadharas, sages, men, beasts, the robber-terrified, the palace-held, the disease-crushed — You alone are refuge, Devi Durga — be gracious! This hymn I have spoken for lifting from calamity; read at three twilights or one, it frees from dread crisis — no doubt — in earth, heaven or underworld. Whole or single verse, read ever with devotion — all ill done is dropped, the supreme station won. What on earth is not accomplished by its reading? This king of praises I have told in brief."`,
    commentary: `**One refrain, nine waves:** every verse lands on "trahi Durge" — the stotra is a single cry with changing addresses (Sharanye, Mahayogini, eka-gati, nistara-nauka/hetu/bija, nadi-traya, nama-vali, eka-sharana). Verse 4's disaster-list (aranya/rana/shatru/anala/sagara/prantara/rajagriha) is the Phalashruti inventory compressed to one line; verse 7 internalises Her as breath-channels; verse 9 universalises refuge across gods to beasts. Phala (vv.10-13): eka-shloka suffices; trisandhya or eka-sandhya; "kim na sidhyati bhutale". Closed with offering to Jagadamba.`,
    keyPoints: [
      '**Refrain as method**: Nine addresses, one landing — "trahi Durge" repeated into reflex.',
      '**One verse suffices**: Sarva va shlokam ekam va — crisis liturgy, not length liturgy.'
    ]
  },
  {
    id: 'dm-kali-stotra',
    number: 'Kālī-stotra 1-17 (Kālī-rahasya, digest)',
    section: 'Pariśiṣṭa 7: Kālī-stotra (Kālī-rahasya)',
    devanagari: `प्राग्देहस्थो यदाहं तव चरणयुगं नाश्रितो नार्चितोऽहं
तेनाद्या कीर्तिवर्गैर्जठरजदहनैर्बाध्यमानो बलिष्ठैः ।
क्षिप्त्वा जन्मान्तरान्न पुनरिह भविता क्वाश्रयः क्वाऽपि सेवा
क्षन्तव्यो मेऽपराधः प्रकटितवदने ! कामरूपे ! कराले ! ॥१॥
बाल्ये बालाभिलाषैर्जडितजडमतिर्बाललीलाप्रसक्तो
न त्वां जानामि मातः ! कलिकलुषहरां भोगमोक्षप्रदात्रीम् ।
नाचारो नैव पूजा न च यजनकथा न स्मृतिनैव सेवा
क्षन्तव्यो मेऽपराधः प्रकटितवदने ! कामरूपे ! कराले ! ॥२॥
त्वं काली त्वं च तारा त्वमसि गिरिसुता सुन्दरी भैरवी त्वं
त्वं दुर्गा छिन्नमस्ता त्वमसि च भुवना त्वं लक्ष्मीः शिवा त्वम् ।
धूमा मातङ्गिनी त्वं त्वमसि च बगला मङ्गलादिस्तवाख्या
क्षन्तव्यो मेऽपराधः प्रकटितवदने ! कामरूपे ! कराले ! ॥१५॥
स्तोत्रेणानेन देवीं परिणमति जनो यः सदा भक्तियुक्तो
दुष्कृत्या दुर्गसङ्गं परितरति शतं विघ्नता नाशमेति ।
ज्ञाता वक्ता कवीशो भवति धनपतिर्दानशीलो दयात्मा
निःपापी निःकलङ्की कुलपतिकुशलः सत्यवाग् धार्मिकश्च ॥१६-१७॥`,
    iast: `prāgdehastho yad ahaṃ tava caraṇayugaṃ nāśrito nārcito'haṃ
tenādyā kīrtivargair jaṭharajadahanair bādhyamāno baliṣṭhaiḥ |
kṣiptvā janmāntarān na punar iha bhavitā kvāśrayaḥ kvā'pi sevā
kṣantavyo me'parādhaḥ prakaṭitavadane! kāmarūpe! karāle! ||1||
bālye bālābhilāṣair jaḍitajaḍamatir bālālīlāprasakto
na tvāṃ jānāmi mātaḥ! kalikaluṣaharāṃ bhogamokṣapradātrīm |
nācāro naiva pūjā na ca yajanakathā na smṛtir naiva sevā
kṣantavyo me'parādhaḥ prakaṭitavadane! kāmarūpe! karāle! ||2||
[+ yauvana/indriya (3), praudha/bhiksha-chinta (4), vrddhatva/vyadhi (5),
snana-pushpa-nyasa-abhava (6-7), kalabhra-dhyana (8), Brahma-Vishnu-Isha
pada-sevana vs lobha (9), raga-dvesha/kaula-hina (10), roga-daridrya (11),
mithya-moha/daridrya-dharma (12-13), garbha-buddhi-chitta/tattva (13-14)]
tvaṃ kālī tvaṃ ca tārā tvam asi girisutā sundarī bhairavī tvaṃ
tvaṃ durgā chinnamastā tvam asi ca bhuvanā tvaṃ lakṣmīḥ śivā tvam |
dhūmā mātaṅginī tvaṃ tvam asi ca bagalā maṅgalādis tavākhyā
kṣantavyo me'parādhaḥ prakaṭitavadane! kāmarūpe! karāle! ||15||
stotreṇānena devīṃ pariṇamati jano yaḥ sadā bhaktiyukto
duṣkṛtyā durgasaṅgaṃ paritarati śataṃ vighnatā nāśam eti |
jñātā vaktā kavīśo bhavati dhanapatir dānaśīlo dayātmā
niḥpāpī niṣkalaṅkī kulapatikuśalaḥ satyavāg dhārmikaśca ||16-17||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Kali-stotra (Kalirahasyoktam) pp.781-783 (printed 775-777): 17 shardulavikridita verses, single refrain "kshantavyo me'paradhah prakatitavadane! Kamarupe! Karale!"; life-stage confessions 1-5 (past births, childhood, youth, householder-anxiety, old age), worship-failures 6-7, dhyana 8, Brahma-etc vs self 9, raga-dvesha 10, roga-daridrya 11, mithya-moha 12, garbha-tattva surrender 13-14, Mahavidya-identity 15, phala 16-17; frame and close verbatim above, middle indexed.`
      }
    ],
    translation: `"Since in former bodies I never took to Your feet nor worshipped them, today I am crushed by strong belly-fires of fame-hunger; cast through births, never to return — where is refuge, where service? Forgive my offence, open-faced, wish-formed, Terrible! In childhood, dull-minded with childish wants, sunk in child's play — I never knew You, Mother, remover of Kali-stains, giver of enjoyment and release; no conduct, no worship, no sacrifice-tale, no remembrance, no service — forgive! ... (Youth with serpent-senses looting others' women and wealth; householder begging-bowled, body broken by 'where shall I get, where go' worry; old age witless, coughing, toothless, burnt by remorse with only death to meditate; never bath-flower-offering-feeling-devotion-nyasa-worship; Brahma-Vishnu-Isha ever ripen at Your lotus while I, luckless, beg lust-driven; wrath-lust, kaula-less; sick, poor, sleep-slothful; false passions; womb-born, sense-made — all Yours.) You are Kali and Tara, mountain-daughter, Sundari, Bhairavi; Durga, Chhinnamasta, Bhuvana, Lakshmi, Shiva; Dhuma, Matangini, Bagala — and all auspicious names are Yours — forgive! Who bows to Devi with this hymn ever devoted crosses a hundred hard-pass sins; obstacles perish; he becomes knower, speaker, king of poets, wealthy, generous, merciful, sinless, stainless, house-lord, truth-voiced, righteous — and crosses the world-ocean holding Girija's feet."`,
    commentary: `**A life in fifteen confessions:** where Shankara's Kshamapana pleads theology (kuputro), the Kali-stotra pleads biography — five age-bands (past-birth, bala, yauvana, praudha, vrddha) then five failure-bands (achara, snana-pushpa, dhyana, lobha, raga-dvesha) then surrender-bands (roga, moha, garbha, tattva: "tvam bhumis... tvam akasham... atma tvam"). Verse 15 resolves identity into the ten Vidyas (Mahavidya-rahasya in one line: Kali, Tara, Girisuta, Sundari, Bhairavi, Durga, Chhinnamasta, Bhuvana, Lakshmi, Shiva, Dhuma, Matangini, Bagala). Phala (vv.16-17): putra-buddhi kshamapana ("kshamaye putrabuddhaya"), jnata-vakta-kavisha, Girija-pada-avalamba across samsara-abdhi.`,
    keyPoints: [
      '**Biography as apology**: Five ages, five failures — confession by life-stage, not doctrine.',
      '**Ten Vidyas, one forgiveness**: Verse 15 gathers Mahavidyas; refrain never varies.'
    ]
  },
  {
    id: 'dm-shanti-stotra',
    number: 'Śānti-stotra 1-9 (Yāmala)',
    section: 'Pariśiṣṭa 8: Śānti-stotra (Yāmala)',
    devanagari: `ॐ नश्यन्तु प्रेतकूष्माण्डा नश्यन्तु दूषका नराः ।
साधकानां शिवाः सन्तु आम्नायपरिपालकाः ॥१॥
जयन्ति मातरः सर्वाः जयन्ति योगिनीगणाः ।
जयन्ति सिद्धडाकिन्यो जयन्ति गुरुपतयः ॥२॥
यजन्ति साधवः सर्वे विशुद्धाः कौलिकाश्च ये ।
समयाचारसम्पन्ना जयन्ति पूजका नराः ॥३॥
यजन्तु अणिमाः सिद्धाः नन्दन्तु कुलदेवताः ।
ऐन्द्राद्याः देवताः पान्तु तृप्यन्तु वास्तुदेवताः ॥४॥
चन्द्रसूर्यादयो देवास्तुष्यन्तु मम भक्तितः ।
नक्षत्राणि ग्रहा योगाः करणा राशयश्च ये ॥५॥
सर्वे ते सुखिनो यान्तु सर्पा नद्यश्च पक्षिणः ।
पशवश्चोरगाश्चैव पर्वताः कन्दरा गुहाः ॥६॥
ऋषयो ब्राह्मणाः सर्वे शान्तिं कुर्वन्तु मे सदा ।
शुभनिवेदिताः सन्तु मित्रास्तिष्ठन्तु पूजकाः ॥७॥
ये ये पापधिया विदूषणकरा मन्निन्दकाः पूजकाः ।
दृष्ट्वा च क्रमपूर्वमन्दहृदया ये लौकिका दूषकाः
ते ते यान्तु विनाशमत्र समये श्रीभैरवस्याज्ञया ॥८॥
साधकानां च ये हिंस्राः सदेवाम्नायदूषकाः ।
डाकिनीनां मुखे यान्तु मम निन्दाकराश्च ये ।
द्वेष्टारः साधकानां च ते नश्यन्तु शिवाज्ञया ॥९॥
॥ इति यामलोक्तं शान्तिस्तोत्रं समाप्तम् ॥`,
    iast: `oṃ naśyantu pretakūṣmāṇḍā naśyantu dūṣakā narāḥ |
sādhakānāṃ śivāḥ santu āmnāyaparipālakāḥ ||1||
jayanti mātaraḥ sarvāḥ jayanti yoginīgaṇāḥ |
jayanti siddhaḍākinyo jayanti gurūpatayaḥ ||2||
yajanti sādhavaḥ sarve viśuddhāḥ kaulikāśca ye |
samayācārasampannā jayanti pūjakā narāḥ ||3||
yajantu aṇimāḥ siddhāḥ nandantu kuladevatāḥ |
aindrādyāḥ devatāḥ pāntu tṛpyantu vāstudevatāḥ ||4||
candrasūryādayo devās tuṣyantu mama bhaktitaḥ |
nakṣatrāṇi grahā yogāḥ karaṇā rāśayaśca ye ||5||
sarve te sukhino yāntu sarpā nadyaśca pakṣiṇaḥ |
paśavaścoragāścaiva parvatāḥ kandarā guhāḥ ||6||
ṛṣayo brāhmaṇāḥ sarve śāntiṃ kurvantu me sadā |
śubhaniveditāḥ santu mitrās tiṣṭhantu pūjakāḥ ||7||
ye ye pāpadhiyā vidūṣaṇakarā mannindakāḥ pūjakāḥ |
dṛṣṭvā ca kramapūrvam andahṛdayā ye laukikā dūṣakāḥ
te te yāntu vināśam atra samaye śrībhairavasyājñayā ||8||
sādhakānāṃ ca ye hiṃsrāḥ sadevāmnāyadūṣakāḥ |
ḍākinīnāṃ mukhe yāntu mama nindakārāśca ye |
dveṣṭāraḥ sādhakānāṃ ca te naśyantu śivājñayā ||9||
|| iti yāmaloktaṃ śāntistotraṃ samāptam ||`,
    conceptIds: ['parishista-samgraha', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Shanti-stotra (Yamaloktam) complete, p.784 (printed 778): 9 verses — raksho-ghna opening (v.1), jayanti benedictions (vv.2-3), deva-vastu-tushti (vv.4-5), sarva-bhuta-sukha (v.6), rishi-shanti (v.7), Bhairava-ajna curse on dushakas (v.8), Shiva-ajna close (v.9); verbatim.`
      }
    ],
    translation: `"Om. Perish the preta-kushmandas; perish the human corrupters. Auspicious be the guardians of the lineage to the seekers. Victorious all Mothers; victorious the Yogini hosts; victorious the perfected Dakinis; victorious the guru-lines. All the good sacrifice, the pure Kaulas; endowed with samaya-conduct, victorious the worshipping men. Let the Anima-perfected sacrifice; rejoice the kula-deities; guard the Indra-led gods; be satisfied the dwelling-deities. Moon, sun and gods — be pleased by my devotion; stars, planets, yogas, karanas, signs. Go all happy — serpents, rivers, birds; beasts, crawlers, mountains, valleys, caves. Rishis and brahmanas all — ever make peace for me; well-offered be the good; friends abide; worshippers stand. Who with sinful mind corrupt — mockers of me and of worshippers, blind-hearted worldly mockers who saw the order — let them go to destruction here, now, by Shri Bhairava's command. Who harm seekers, corrupt gods-and-lineage, mock me, hate seekers — into Dakini mouths they go; perish by Shiva's command."`,
    commentary: `**Two movements:** benediction (vv.1-7) then boundary (vv.8-9). The first half blesses every order — Matris to gurus, sadhus to Kaulas, Anima-siddhas to kula-devatas, grahas to guhas, snakes to caves — "sarve te sukhino yantu" extended to landscape itself. The second half draws the Kaula line: vidushana (corrupting the rite) and ninda (mocking the seeker) are the unforgivables, answered not by argument but by Bhairava/Shiva-ajna. Placed right after the Kali confessional and before the Pauranika abhishekas, it functions as raksha-bandha for the whole Uttaranga.`,
    keyPoints: [
      '**Bless all, then bound all**: Sukha for every being through caves; destruction only for rite-corrupters.',
      '**Ajna, not anger**: Both curses run by Bhairava/Shiva command — lineage authority, not personal revenge.'
    ]
  },
  {
    id: 'dm-pauranika-shanti',
    number: 'Paurāṇika-śānti-mantrāḥ 1-9',
    section: 'Pariśiṣṭa 9: Paurāṇika-śānti-mantrāḥ',
    devanagari: `ॐ सुरास्त्वामभिषिञ्चन्तु ब्रह्मविष्णुमहेश्वराः ।
वासुदेवो जगन्नाथस्तथा सङ्कर्षणः प्रभुः ॥१॥
प्रद्युम्नश्चानुरुद्धश्च भवन्तु विजयाय मे ।
आखण्डलोऽग्निर्भगवान् यमो वै निर्ऋतिस्तथा ॥२॥
वरुणः पवनश्चैव धनाध्यक्षस्तथा शिवः ।
ब्रह्मणा सहितः शेषो दिक्पालाः पान्तु ते सदा ॥३॥
कीर्तिर्लक्ष्मीर्धृतिर्मेधा पुष्टिः श्रद्धा क्षमा मतिः ।
बुद्धिर्लज्जा वपुः शान्तिः कान्तिस्तुष्टिश्च मातरः ॥४॥
एतास्त्वामभिषिञ्चन्तु देवपत्यः समागताः ।
आदित्यश्चन्द्रमा भौमो बुधजीवसितार्कजाः ॥५॥
ग्रहास्त्वामभिषिञ्चन्तु राहुः केतुश्च तर्षिताः ।
देवदानवगन्धर्वा यक्षराक्षसपन्नगाः ॥६॥
ॐ ऋषयो मुनयो गावो देवमातर एव च ।
देवपत्यो ग्रहा नागा दैत्याश्चाप्सरसो ऽङ्गनाः ॥७॥
अस्त्राणि सर्वशास्त्राणि राजानो वाहनानि च ।
ओषधानि च रत्नानि कालस्यावयवाश्च ये ॥८॥
सरितः सागराः शैलास्तीर्थानि जलदा नगाः ।
एते त्वामभिषिञ्चन्तु धर्मकामार्थसिद्धये ॥९॥`,
    iast: `oṃ surās tvām abhiṣiñcantu brahmaviṣṇumaheśvarāḥ |
vāsudevo jagannāthas tathā saṅkarṣaṇaḥ prabhuḥ ||1||
pradyumnaścānuruddhaśca bhavantu vijayāya me |
ākhaṇḍalo'gnir bhagavān yamo vai nirṛtis tathā ||2||
varuṇaḥ pavanaścaiva dhanādhyakṣas tathā śivaḥ |
brahmaṇā sahitaḥ śeṣo dikpālāḥ pāntu te sadā ||3||
kīrtir lakṣmīr dhṛtir medhā puṣṭiḥ śraddhā kṣamā matiḥ |
buddhir lajjā vapuḥ śāntiḥ kāntis tuṣṭiśca mātaraḥ ||4||
etās tvām abhiṣiñcantu devapatyaḥ samāgatāḥ |
ādityaścandramā bhaumo budhajīvasitārkajाः ||5||
grahās tvām abhiṣiñcantu rāhuḥ ketuśca tarṣitāḥ |
devadānavagandharvā yakṣarākṣasapannagāḥ ||6||
oṃ ṛṣayo munayo gāvo devamātara eva ca |
devapatyo grahā nāgā daityāścāpsaraso'ṅganāḥ ||7||
astrāṇi sarvaśāstrāṇi rājāno vāhanāni ca |
oṣadhāni ca ratnāni kālasyāvayavāśca ye ||8||
saritaḥ sāgarāḥ śailās tīrthāni jaladā nagāḥ |
ete tvām abhiṣiñcantu dharmakāmārthasiddhaye ||9||`,
    conceptIds: ['parishista-samgraha', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Pauranika-shanti-mantras complete, p.785 (printed 779): 9 abhisheka-mantras — Trimurti + Chaturvyuha (vv.1-2), Dikpalas (vv.2-3), fourteen Matris + devapatnis (v.4), navagrahas (vv.5-6), rishi-to-apsaras orders (v.7), astra-shastra-herb-jewel-kala (v.8), river-to-mountain landscape (v.9, "dharmakamarthasiddhaye"); verbatim.`
      }
    ],
    translation: `"Om. Let the gods anoint you — Brahma, Vishnu, Maheshvara; Vasudeva, Jagannatha, mighty Sankarshana; Pradyumna and Aniruddha — be for my victory. Akhandala, lord Fire, Yama, Nirriti; Varuna, Wind, the wealth-lord, Shiva; with Brahma, Shesha — the world-guardians ever guard you. Kirti, Lakshmi, Dhriti, Medha, Pushti, Shraddha, Kshama, Mati; Buddhi, Lajja, Vapus, Shanti, Kanti, Tushti — these Mothers; let these divine wives, assembled, anoint you. Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn — the planets anoint you; Rahu and Ketu, satisfied; gods, danavas, gandharvas, yakshas, rakshasas, pannagas. Om — rishis, munis, cows, divine mothers; divine wives, planets, nagas, daityas, apsaras-women; weapons, all sciences, kings, vehicles; herbs, jewels, time's limbs; rivers, oceans, hills, tirthas, clouds, trees — let these anoint you for the winning of dharma, kama, artha."`,
    commentary: `**Abhisheka, not stuti:** every verse lands on abhishinchantu/pantu — the seeker (or the Devi-image, per prayoga) is sprinkled by ranks in order: Trimurti, Chaturvyuha, Dikpalas, Matris, Grahas, all orders of beings, all instruments of power, all landscape. Where the Yamala Shanti (previous card) blesses outward ("sukhino yantu"), these pour inward ("tvam abhishinchantu") — the pair closes protection from both sides. Note the trivarga seal (v.9: dharmakamartha, moksha implied) — abhisheka for the worldly aims, consistent with parishista function.`,
    keyPoints: [
      '**Pour inward**: Abhishinchantu ranks from Trimurti to rivers — consecration by the whole cosmos.',
      '**Trivarga seal**: Dharma-kama-artha named; the fourth aim walks in unsaid.'
    ]
  },
  {
    id: 'dm-para-devi-sukta',
    number: 'Para-devī-sūkta-mālā-mantra (digest)',
    section: 'Pariśiṣṭa 10: Śrī-para-devī-sūkta (mālā-mantra)',
    devanagari: `॥ ओं नमश्चण्डिकायै ॥
विनियोगः —
ॐ अस्य श्रीपरदेवीसूक्तमालामन्त्रस्य मार्कण्डेयमेधाऋषी
गायत्र्यादिनानाविधछन्दांसि महाकालीमहालक्ष्मी-
महासरस्वतीस्वरूपा त्रिशक्तिरूपिणी पराम्बा चण्डिका देवता
ऐं बीजं ह्रीं शक्तिः क्लीं कीलकं मम चिन्तितसकलमनोरथसिद्धयर्थे
पाठे जपे विनियोगः ।
ध्यानम् —
योगाढ्यामरकायनिर्गतमहातेजः समुत्पत्तिनी
भास्वत्पूर्णशशाङ्कचारुधवला लीलोल्लसद्भूलता ।
गौरोत्तुङ्गकुचद्वयामितपरिस्फूर्जत्प्रभामण्डला
बन्धूकारुणकायकान्तिरवताच्छ्रीचण्डिका सर्वतः ॥
ओं परं देव्या इदं सूक्तं यः पठेत् प्रयतो नरः ।
सर्वसिद्धिमवाप्नोति सर्वत्र विजयी भवेत् ॥१॥
त्रिकालं यः पठेन्नित्यं देव्याः सूक्तमिदं परम् ।
तस्य विघ्नाः प्रलीयन्ते ग्रहपीडाश्च दारुणाः ॥३॥
इदं रहस्यं परमं गोपनीयं प्रयत्नतः ।
न वाच्यं कस्यचिद् देवि ! निधानमिव सुन्दरि ! ॥७॥`,
    iast: `|| oṃ namaścaṇḍikāyai ||
viniyogaḥ —
oṃ asya śrīparadevīsūktamālāmantraśya mārkaṇḍeyamedhaṛṣī
gāyatryādinānāvidhachandāṃsi mahākālīmahālakṣmī-
mahāsarasvatīsvarūpā triśaktirūpiṇī parāmbā caṇḍikā devatā
aiṃ bījaṃ hrīṃ śaktiḥ klīṃ kīlakaṃ mama cintitasakal Manorathasiddhyarthe
pāṭhe jape viniyogaḥ |
dhyānam —
yogāḍhyāmarakāyanirgatamahātejaḥ samutpattinī
bhāsvatpūrṇaśaśāṅkacārudhavalā līlol lasad bhrūlatā |
gaurattuṅgakucadvayāmitaparisphūrjatprabhāmaṇḍalā
bandhūkāruṇakāyakāntir avatāc chrīcaṇḍikā sarvataḥ ||
oṃ paraṃ devyā idaṃ sūktaṃ yaḥ paṭhet prayato naraḥ |
sarvasiddhim avāpnoti sarvatra vijayī bhavet ||1||
trikālaṃ yaḥ paṭhen nityaṃ devyāḥ sūktam idaṃ param |
tasya vighnāḥ pralīyante grahapīḍāśca dāruṇāḥ ||3||
idaṃ rahasyaṃ paramaṃ gopanīyaṃ prayatnataḥ |
na vācyaṃ kasyacid devi! nidhānam iva sundari! ||7||`,
    conceptIds: ['parishista-samgraha', 'mahamaya', 'cit-shakti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Shri-para-devi-sukta (mala-mantra) index pp.786-789 (printed 780-783): Chandika-namaskara + prithvi/adhara-shakti asana + atma/vidya/shiva/sarva-tattva-shodhana + achamana/pranayama + viniyoga (Markandeya-Medha rishis, Gayatri-adi chandas, Trishakti-Paramba devata, Aim-Hrim-Klim) + rishi-chandas-devata/anga nyasas + kara/hridaya/shikha-netra-karna-nasa-mukha-guhya + dig-nyasa + yogadhya-dhyana + manasopachara + akshamala-puja/prarthana + 108 "Om Aim Hrim Klim" samputa + 1000-name mala (hundreds 100-1000 marked in print: Jagadadyabija ... Namaste-svaha) + phala vv.1-7 ("Shrijagadambarpaṇamastu"); frame, dhyana and phala verbatim above, 1000-name body indexed.`
      }
    ],
    translation: `Ritual frame (verbatim) then thousand-name garland (indexed): viniyoga assigns the hymn to Markandeya-Medha, many metres, triple-Shakti Paramba, seed-power-pin Aim-Hrim-Klim, "for all my pondered wishes' winning, in reading and in japa." Nyasas plant rishi in head, metres in mouth, Devi in heart, seed in secret, power in feet, pin in navel; fingers, heart-to-weapon, crown-to-secret, ten directions; then the Yogadhya dhyana — born of the great fire that left the gods' bodies rich in yoga, moon-white, play-arch-browed, fair-high-breasted, halo-blazing, bandhuka-red — "let Shri Chandika guard on every side." Mala worshipped ("in you the four aims are laid — grant me success"), then 108 Aim-Hrim-Klim, then the thousand names (Jagadadyabija, dayakure, sarvadeva-tejas, Mahamaya-forms, Viriñchi-praised, Vishnu-body-clad, Madhu-Kaitabha-slayer, Indra-served, Jaya-Jayanti-Aparajita, sun-crore-fire ... Matris, Narasimhi, thirty-three-crore-praised, universe-queen, eighty-four-lakh-muni-praised, seven-crore-mantra-formed, Kala-Kashtha-time, fourteen-world-mother, Garuda-rider, bija-kuta-bodied, Sundari-host-served-feet, Mahatripurasundari, bow-arrow-sword-staff-conch-lotus-bearer, Bhairava-worshipped, Yogini-ringed, Kali-Tara-Tarala-Sutara-Jvalamukhi-Chhinnamasta-Bhuvaneshvari-Tripura, Vishnu-chest-ornament, womb-sorrow-remover, Kumari, Devi-sukta-ten-hundred-syllabled, Chandi-Chamunda, Kali-Lakshmi-Sarasvati-triple-bodied — "be gracious, fulfil all wishes, cut all obstacles, destroy planet-fever-fears, tame all worlds, show liberation's roads, light knowledge's road, kill ignorance-dark, grow grain-wealth, make all welfare, guard me, ferry all dangers, perfect my diamond-body" — sealed Chamundayai-vicche-svaha, namaste-svaha). Phala: "who reads प्रयत्न — all success, victory everywhere; lion over elephant-foes in battle; wishes tamed, kings tamed; thrice-daily reading melts obstacles and cruel planet-pains; ends hostile rites; thousandfold recitation grants wishes, two-thousand tames even queens; three lakh over three years — beholds Chandika face to face, boon-risen. This supreme secret guard strivingly, speak to none, like a treasure."`,
    commentary: `**Why an index:** the mala is a small book (tattva-shodhana, six nyasa sets, dhyana, mala-prarthana, 1000 names, 7 phala verses); transcribing 1000 names would triple this file. This entry fixes the prayoga skeleton verbatim (viniyoga-dhyana-phala) and inventories the name-body by its print-hundreds so every epithet-cluster is findable. Note the architecture: Vedic frame (tattva-shodhana) + Tantric body (bija-kuta-sharira, "nanabija-mantra-raja-virajite") + Puranic close (darshana-phala) — the whole corpus in one mala. The gopaniya seal (v.7, "nidhanam iva") matches Kunjika/Mahavidya secrecy.`,
    keyPoints: [
      '**Skeleton verbatim, body indexed**: Viniyoga, dhyana, phala exact; 1000 names inventoried by hundreds.',
      '**Bija-kuta body**: "Nanabija-mantra-raja-virajite" — seed-syllable clusters as Her limbs.'
    ]
  },
  {
    id: 'dm-siddha-samputa',
    number: 'Siddha-sampuṭa-mantrāḥ (30 purposes, index)',
    section: 'Pariśiṣṭa 11: Siddha-sampuṭa-mantrāḥ (prayoga table)',
    devanagari: `सप्तशत्याः केचन सिद्धसम्पुटमन्त्राः ।
श्रीमार्कण्डेयपुराणान्तर्गत देवीमाहात्म्यमें 'श्लोक', 'अर्ध श्लोक' और
'उवाच' आदि मिलाकर कुल ७०० मन्त्र हैं ।
१. सामूहिक कल्याण के लिये —
देव्या यया ततमिदं जगदात्मशक्त्या
निश्शेषदेवगणशक्तिसमूहमूर्त्या
तामम्बिकामखिलदेवमहर्षिपूज्यां
भक्त्या नताः स्म विदधातु शुभानि सा नः ॥
३०. स्वप्न में सिद्धि असिद्धि जानने के लिये —
दुर्गे ! देवि ! नमस्तुभ्यं सर्वकामार्थसाधिके ! ।
मम सिद्धिमसिद्धिं वा स्वप्ने सर्वं प्रदर्शय ॥`,
    iast: `saptaśatyāḥ kecana siddhasampuṭamantrāḥ |
śrīmārkaṇḍeyapurāṇāntargata devīmāhātmyameṃ 'śloka', 'ardha śloka' aura
'uvāca' ādi milākara kula 700 mantra haiṃ |
1. sāmūhika kalyāṇa ke liye —
devyā yayā tatam idaṃ jagadātmaśaktyā
niśśeṣadevagaṇaśaktisamūhamūrtyā
tām ambikām akhiladevamaharṣipūjyāṃ
bhaktyā natāḥ sma vidadhātu śubhāni sā naḥ ||
30. svapna meṃ siddhi asiddhi jānane ke liye —
durge! devi! namas tubhyaṃ sarvakāmārthasādhike! |
mama siddhim asiddhiṃ vā svapne sarvaṃ pradarśaya ||`,
    conceptIds: ['parishista-samgraha', 'phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Siddha-samputa-mantras (30 numbered purposes) index pp.790-794 (printed 784-788): Hindi prayoga introduction (700 mantra-units; shraddha-vidhi parayana; samputa method) + 30 purpose-heads each with adhyaya-excerpt verse(s): 1 samuhika-kalyana (1.57-devya-yaya) ... 30 svapna-siddhi (svapna-prarthana); first and last verbatim above, all 30 purposes inventoried in commentary; closing "***" (mantra-vibhaga tables follow p.795).`
      }
    ],
    translation: `Prayoga table (first/last verbatim, 30 purposes indexed): "In the Markandeya-Purana Devi-mahatmya, shloka + ardha-shloka + uvacha together make 700 mantras, famed as Durga-Saptashati, granting all four aims; whatever feeling and wish a man recites with faith and rule, that very fruit ripens — countless men have directly felt it. Here some chosen mantras: read the Saptashati samputa-wrapped (samputita) with them, duly, and personal-and-collective aims ripen." 1 collective welfare (devya-yaya) → 2 world-inauspiciousness/fear (yasya-prabhava) → 3 world-guardianship (ya-shrih) → 4 world-abhyudaya (vishveshvari-tvam) → 5 pervasive calamity (devi-prapannarti) → 6 papa-tapa (devi-prasida-paripalaya) → 7 vipatti (sharanagata-dina) → 8 vipatti+shubha (karotu-sa-nah) → 9 fear, triple (sarvasvarupe / etatte-vadanam / jvala-karala) → 10 papa (ghanta verse) → 11 roga (rogan-asheshan) → 12 mahamari (jayanti-mangala-kali) → 13 arogya-saubhagya (dehi-saubhagyam) → 14 sulakshana-patni (patnim-manoramam) → 15 badha-shanti (sarvabadha) → 16 sarva-abhyudaya (te-sammata) → 17 daridrya-duhkha (durge-smrita) → 18 raksha (shulena-pahi) → 19 vidya + matri-bhava (vidya-samasta) → 20 kalyana (sarvamangala) → 21 shakti (srishti-sthiti) → 22 prasannata (pranatanam) → 23 upadrava (rakshamsi-yatra) → 24 badha-mukti + dhana-putra (sarvabadha-vinirmukto) → 25 bhukti-mukti (vidhehi-devi) → 26 papa-bhakti (natebhyah) → 27 svarga-moksha (sarvabhuta-yada) → 28 svarga-mukti (sarvasya-buddhi) → 29 moksha (tvam-vaishnavi) → 30 dream-verdict (durge-devi-namas-tubhyam ... svapne sarvam pradarshaya).`,
    commentary: `**How samputa works (per the Hindi intro, p.790):** the chosen verse wraps (samputa = envelope) the Saptashati recitation — read before and after, or capping each adhyaya — so the whole 700-unit parayana is aimed at one purpose. The 30 heads run loka-scale (1-6: samuhika, ashuba-bhaya, raksha, abhyudaya, vipatti, papa-tapa) down to deha-scale (10-14: papa, roga, mahamari, arogya, patni) then up to moksha-scale (24-29: badha-mukti, bhukti-mukti, svarga, moksha), closing with the one meta-purpose: asking Her in dream whether the siddhi ripened (30). Every verse is an adhyaya excerpt already transcribed in ch01-ch13 — hence index, not duplicate, under the no-double-counting rule.`,
    keyPoints: [
      '**Envelope, not excerpt**: Samputa wraps the whole parayana toward one aim — recite the verse around the 700.',
      '**Loka to moksha ladder**: Collective welfare descends to body, ascends to release; dream-verdict closes.'
    ]
  }
];
