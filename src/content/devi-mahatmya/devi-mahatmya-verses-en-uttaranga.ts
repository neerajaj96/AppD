// Uttaranga + missing Purvanga: Vedokta Ratri Sukta, Rahasya-traya,
// Kshama-prarthana, and procedural supplements (Guru-Kilaka, Mantra-vibhaga).
//
// SOURCE (verified vs Drive PDF, 814 pp, iLovePDF, "DurgaSaptashati.pdf"):
// "दुर्गासप्तशती गुप्तवत्यादिसप्तटीकासंवलिता" — the Guptavati-adi
// sapta-tika edition. Each adhyaya carries the same seven Sanskrit
// glosses in order: (1) Guptavati, (2) Chaturdhari, (3) Shantanavi,
// (4) Nagojibhatti, (5) Jagacchandrachandrika, (6) Damshoddhara,
// plus (7) Chandraprabha in Hindi. Upodghata pp.1-30; Kavaca from
// p.31; Argala p.47; Kilaka p.55; Guru-Kilaka-patala (Rahasya-tantra)
// pp.62-64; Vedokta Ratri Sukta p.65; Tantrokta Ratri Sukta p.66
// (footnote: अर्थ for it at Adhyaya 1, shlokas 53-67); Navarna-vidhi
// p.68; Saptashati-nyasa p.71; Mantra-vibhaga (Katyayani) pp.73-83;
// Nagoji Prayoga-vidhi pp.84-115; Adhyayas 1-13 pp.116-~684;
// Uttara-nyasa p.685; Rgvedokta Devi Sukta p.687; Tantrokta Devi
// Sukta p.690 (footnote: अर्थ at Adhyaya 5, shlokas 7-36);
// Yamala mantra-vibhaga-vicara pp.693-695; Rahasya-traya from p.701
// (Pradhanika, Vaikritika, Murti); Kshama-prarthana p.723;
// Devyaparadha-kshamapana p.725; Saptashloki Durga p.729;
// Ashtottara-shata-nama p.732; Dvatrimsha-namamala p.736;
// Manasa-puja p.739; Siddha-kunjika p.745; Devi-atharvashirsha p.748;
// mantra-vibhaga/bija tables pp.795-814.
//
// COVERAGE (no loss, no duplication):
// - Kavaca/Argala/Kilaka, 13 adhyayas, Rgvedokta Devi Sukta, Navarna/
//   Saptashati-nyasa and Nagoji prayoga are already in this directory
//   (see devi-mahatmya-verses-en*.ts + chapters/). This file does NOT
//   re-transcribe them.
// - Tantrokta Ratri Sukta (Yoganidra-stuti) and Tantrokta Devi Sukta
//   ("ya devi sarvabhuteshu") are the SAME verses already carried in
//   ch01 (dm-1-53..67 zone) and ch05 (dm-5-7..36 zone); they are
//   registered here only as parayana-placement cross-reference entries
//   so the Uttara parayana frame is complete without double-counting.
// - NEW Sanskrit transcribed here: Vedokta Ratri Sukta (RV 10.127,
//   full 8 mantras, pp.65-66), Pradhanika/Vaikritika/Murti Rahasya
//   (condensed digests with opening verses verbatim, pp.701-722),
//   Kshama-prarthana (full 6 verses, p.723). Mantra-vibhaga and
//   Guru-Kilaka are procedural summaries (counts, not new mantras).
// Part of the Devi Mahatmya EN verses. Merged by
// devi-mahatmya-verses-en.ts. Do not import directly.
import type { RawVerseEn } from './devi-mahatmya-verses-en';

const PROVENANCE =
  'Guptavati-adi sapta-tika Durga-Saptashati edition (Drive PDF, 814 pp).';

export const deviMahatmyaVersesEnUttaranga: RawVerseEn[] = [
  {
    id: 'dm-ratri-vedokta-1',
    number: 'Vedokta Rātri Sūkta 1-4',
    section: 'Pūrvāṅga: Vedokta Rātri Sūkta (Ṛgveda 10.127)',
    devanagari: `ॐ रात्री व्यख्यदायती पुरुत्रा देव्यक्षभिः।
उरु क्षया उरु क्षया ॥१॥
ओर्वप्रा अमर्त्या निवतो देव्युद्वतः।
ज्योतिषा बाधते तमः ॥२॥
निरु स्वसारमस्कृतोषसं देव्यायती।
अपेदु हासते तमः ॥३॥
सा नो अद्य यस्या वयं नि ते यामन्नविक्ष्महि।
वृक्षे न वसतिं वयः ॥४॥`,
    iast: `oṃ rātrī vyakhyad āyatī purutrā devy akṣabhiḥ |
uru kṣayā uru kṣayā ||1||
orvaprā amartyā nivato devy udvataḥ |
jyotiṣā bādhate tamaḥ ||2||
nir u svasāram askṛtoṣasaṃ devy āyatī |
aped u hāsate tamaḥ ||3||
sā no adya yasyā vayaṃ ni te yāmann avikṣmahi |
vṛkṣe na vasatiṃ vayaḥ ||4||`,
    conceptIds: ['vedokta-ratri-sukta', 'mahamaya', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Vedokta Ratri Sukta at pp.65-66 (Ṛgveda 10.127.1-8; viniyoga: Kushika/Saubhara or Bharadvaja rishi, Ratri devata, Gayatri chandas, Devi-mahatmya-patha viniyoga). Hindi rendering on the same pages follows each mantra.`
      }
    ],
    translation: `Om. Night, the Goddess, approaching, has looked forth with her eyes in many places. She has overspread the vast dwelling-places. The immortal Goddess has filled the low and the high; with light she drives away the darkness. She has set aside her sister Dawn, the Goddess approaching; the darkness hastens away. Tonight, in whose course we have come to rest, as birds rest in their nests upon the trees.`,
    commentary: `**What this is:** the Vedic night-hymn (Ṛgveda 10.127) recited BEFORE the Saptashati as the Vedic root of the Ratri-tattva. The edition prints the eight mantras with viniyoga (p.65) and a Hindi rendering (pp.65-66); the Tantrokta Ratri that follows it (p.66) is explicitly cross-referred by footnote to Adhyaya 1.53-67, i.e. the Yoganidra-stuti already carried in ch01 — so no new Sanskrit is invented here.

**Seven-Commentary Digest:** this sukta carries no verse-by-verse Sanskrit tika in this edition (it is parayana frame, not adhyaya text); the Hindi Chandraprabha-style rendering treats Ratri as para-chicchakti — darkness that is not mere absence but the Mother's own all-pervading, karma-overseeing, ignorance-dispelling night-form, sister to Ushas (brahmavidya).`,
    keyPoints: [
      '**Vedic root, Tantric flower**: Vedokta Ratri (RV 10.127) opens the parayana; Tantrokta Ratri (1.53-67) is its Saptashati unfolding — same Goddess, two recensions.',
      '**Ratri as cit-shakti**: Night is the Mother overseeing karma and dispelling ignorance, not mere darkness.'
    ]
  },
  {
    id: 'dm-ratri-vedokta-2',
    number: 'Vedokta Rātri Sūkta 5-8',
    section: 'Pūrvāṅga: Vedokta Rātri Sūkta (Ṛgveda 10.127)',
    devanagari: `नि ग्रामासो अविक्षत नि पद्वन्तो नि पक्षिणः।
नि श्येनासश्चिदर्थिनः ॥५॥
यावया वृक्यं वृकं यवय स्तेनमूर्म्ये।
अथा नः सुतरा भव ॥६॥
उप मा पेपिशत्तमः कृष्णं व्यक्तमस्थित।
उष ऋणेव यातय ॥७॥
उप ते गा इवाकरं वृणीष्व दुहितर्दिवः।
रात्रि स्तोमं न जिग्युषे ॥८॥`,
    iast: `ni grāmāso avikṣata ni padvanto ni pakṣiṇaḥ |
ni śyenāsaś cid arthinaḥ ||5||
yāvayā vṛkyaṃ vṛkaṃ yavaya stenam ūrmye |
athā naḥ sutarā bhava ||6||
upa mā pepiśat tamaḥ kṛṣṇaṃ vyaktam asthita |
uṣa ṛṇeva yātaya ||7||
upa te gā ivākaraṃ vṛṇīṣva duhitar divaḥ |
rātri stomaṃ na jigyuṣe ||8||`,
    conceptIds: ['vedokta-ratri-sukta', 'mahamaya'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Vedokta Ratri Sukta concl. p.66 (mantras 5-8 with Hindi rendering; footnote: Tantrokta Ratri arth at Adhyaya 1.53-67).`
      }
    ],
    translation: `Villages have gone to rest, and the walking and the winged, even the hawks in quest of gain. Ward off the she-wolf and the wolf, ward off the thief, O Night; be easy for us to cross. The dark, manifest gloom has settled upon me; O Dawn, drive it away like a debt. I approach you as cows approach, O daughter of Heaven; O Night, accept this praise as one accepts booty won.`,
    commentary: `**Practice note (from the Hindi rendering, p.66):** verse 6 is read as inner exorcism — the she-wolf (vasana) and wolf (papa), the thief-host (kama and company) are to be set apart from the reciter; verse 7 asks Ushas-dawn (knowledge) to clear ignorance-debt as wealth clears debt; verse 8 offers the stoma as haviṣya to Ratri, daughter of paramavyoma. Recite before the Navarna-vidhi (p.68) and Saptashati-nyasa (p.71).`,
    keyPoints: [
      '**Inner exorcism**: Wolf, she-wolf and thieves are vasanas and passions to be set apart, then crossed over (sutara = moksha-giving).',
      '**Dawn clears debt**: Knowledge removes ignorance the way wealth removes debt.'
    ]
  },
  {
    id: 'dm-tantrokta-crossref',
    number: 'Parāyaṇa frame: Tantrokta Sūktas (cross-reference)',
    section: 'Parāyaṇa Vidhi: Tantrokta Ratri + Devi Sukta placement',
    devanagari: `॥ परायणक्रमे तन्त्रोक्तसूक्तनिर्देशः ॥`,
    iast: `|| parāyaṇakrame tantroktasūktanirdeśaḥ ||`,
    conceptIds: ['sadhana-samara', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Tantrokta Ratri Sukta p.66 (15 verses, Brahma-uvacha; footnote sends arth to Adhyaya 1.53-67); Tantrokta Devi Sukta pp.690-691 (27 verses "namo devyai mahadevyai" + "ya devi sarvabhuteshu"; footnote sends arth to Adhyaya 5.7-36). Both already transcribed in ch01/ch05; this entry only fixes parayana placement, adding no duplicate Sanskrit.`
      }
    ],
    translation: `Parayana-placement index only (no new mantra text): the Tantrokta Ratri Sukta stands after the Vedokta Ratri in the Purvanga and is identical in substance with the Yoganidra-stuti of Adhyaya 1 (verses 53-67); the Tantrokta Devi Sukta stands in the Uttaranga and is identical in substance with the Shakradi-stuti of Adhyaya 5 (verses 7-36).`,
    commentary: `**Why a cross-reference instead of re-transcription:** the edition itself flags the identity by footnote (p.66: "इसका अर्थ सप्तशती के प्रथम अध्याय में श्लोक ५३ से लेकर ६७ तक देखिये"; p.690: "इसके अर्थ के लिये पाँचवें अध्याय में श्लोक ७ से ३६ तक देखें"). Reprinting the same 40+ verses a second time would double-count mantra-units and break the mantra-vibhaga totals (700). The faithful A-Z move is to record WHERE each stands in parayana order while pointing at the single transcribed source (dm-1-* and dm-5-*).`,
    keyPoints: [
      '**No double-counting**: Tantrokta Suktas live once in ch01/ch05; here only their parayana seats are fixed.',
      '**Footnotes are the proof**: The edition itself sends the reader to Adhyaya 1.53-67 and 5.7-36 for arth.'
    ]
  },
  {
    id: 'dm-rahasya-pradhanika',
    number: 'Prādhānika Rahasya (digest)',
    section: 'Uttarāṅga: Rahasya-traya 1/3 (Ṣaḍaṅga 4/6)',
    devanagari: `राजोवाच।
भगवन्नवतारा मे चण्डिकायास्त्वयोदिताः।
एतेषां प्रकृतिं ब्रह्मन् प्रधानं वक्तुमर्हसि ॥१॥
आराध्यं यन्मया देव्याः स्वरूपं येन तद्विज।
विधिना ब्रूहि सकलं यथावत्प्रणतस्य मे ॥२॥
ऋषिरुवाच।
इदं रहस्यं परममनाख्येयं प्रचक्षते।
भक्तोऽसीति न मे किञ्चित्तवावाच्यं नराधिप ॥३॥
सर्वस्याद्या महालक्ष्मीस्त्रिगुणा परमेश्वरी।
लक्ष्यालक्ष्यस्वरूपा सा व्याप्य कृत्स्नं व्यवस्थिता ॥४॥`,
    iast: `rājovāca |
bhagavann avatārā me caṇḍikāyās tvayoditāḥ |
eteṣāṃ prakṛtiṃ brahman pradhānaṃ vaktum arhasi ||1||
ārādhyaṃ yan mayā devyāḥ svarūpaṃ yena tadvija |
vidhinā brūhi sakalaṃ yathāvat praṇatasya me ||2||
ṛṣir uvāca |
idaṃ rahasyaṃ paramaṃ anākhyeyaṃ pracakṣate |
bhakto'sīti na me kiñcit tavāvācyaṃ narādhipa ||3||
sarvasyādyā mahālakṣmīs triguṇā parameśvarī |
lakṣyālakṣyasvarūpā sā vyāpya kṛtsnaṃ vyavasthitā ||4||`,
    conceptIds: ['rahasya-traya', 'mahamaya', 'cit-shakti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Pradhanika Rahasya pp.701-709 (Rahasya-traya 1/3; shadanga 4/6). Viniyoga p.701: Brahma-Achyuta-Rudra rishis, Nava-Durga devata, Anushtubh chandas, Mahalakshmi bija, Shri shakti. Tika here: Guptavati + Chandraprabha (Hindi) per verse, as extracted.`
      }
    ],
    translation: `King Suratha asked: "Lord, you have told me the Goddess's descents; now tell me, O Brahmana, their primal source-nature (prakriti/pradhana), and the exact form and rule by which I should worship Her — I lie at your feet." The Rishi answered: "This supreme secret is declared unspeakable — but since you are a devotee, King, nothing is unspeakable to you. At the origin of all stands Mahalakshmi, three-stranded (triguna), the sovereign Lady; perceptible and imperceptible by turns, she abides pervading the whole."`,
    commentary: `**Condensed digest (full Rahasya pp.701-709; opening 4 verses verbatim above):** Guptavati (p.702) reads "bhakto'si" as devotee of both Devi and guru, and frames Chandika as the fourth (turiya), dharmin-rupa, beyond the three vyashti forms (Mahakali/Mahalakshmi/Mahasarasvati) yet worshipped through one of them as chief. Verses 5-8 (pp.703-704) fix Her iconography: citron (matulunga), mace, shield, wine-cup in hand; serpent, linga and yoni on the crown (Brahma-Vishnu-Rudra, male-female in one); molten-gold hue; then, seeing the void, She takes a second form of pure tamas — dark collyrium, tusked, wide-eyed (Mahakali). The Hindi Chandraprabha follows the same two-form exposition verse by verse. Remainder (creation of Mahakali/Mahalakshmi/Mahasarasvati pairs, gunas, vahanas) is summary, not fresh translation, pending full transcription.

**Seven-Commentary Digest:** only Guptavati + Chandraprabha gloss the Rahasyas in this edition (the other five tikas stop at Adhyaya 13); both agree Mahalakshmi here is the samashti (triguna whole), not one vyashti among three — Guptavati argues it vialakshya/alakshya (saguna/nirguna) with Devi-Atharvashirsha shruti.`,
    keyPoints: [
      '**Samashti, not one of three**: Pradhanika Mahalakshmi is the triguna whole pervading all, perceptible-imperceptible.',
      '**Two forms, one Lady**: Golden Mahalakshmi beholds the void, then assumes the dark Mahakali form from pure tamas.',
      '**Shadanga 4/6**: First of the three Rahasyas, recited AFTER the 13 adhyayas (Katyayani-tantra proof quoted p.701).'
    ]
  },
  {
    id: 'dm-rahasya-vaikritika',
    number: 'Vaikṛtika Rahasya (digest)',
    section: 'Uttarāṅga: Rahasya-traya 2/3 (Ṣaḍaṅga 5/6)',
    devanagari: `ऋषिरुवाच।
त्रिगुणा तामसी देवी सात्त्विकी या त्रिधोदिता।
सा शर्वा चण्डिका दुर्गा भद्रा भगवतीर्यते ॥१॥
योगनिद्रा हरेरुक्ता महाकाली तमोगुणा।
मधुकैटभनाशार्थं यां तुष्टावाम्बुजासनः ॥२॥`,
    iast: `ṛṣir uvāca |
triguṇā tāmasī devī sāttvikī yā tridhōditā |
sā śarvā caṇḍikā durgā bhadrā bhagavatīryate ||1||
yoganidrā harer uktā mahākālī tamoguṇā |
madhukaiṭabhanāśārthaṃ yāṃ tuṣṭāvāmbujāsanaḥ ||2||`,
    conceptIds: ['rahasya-traya', 'mahamaya', 'yoganidra'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Vaikritika Rahasya pp.710-717 (Rahasya-traya 2/3; shadanga 5/6). Opening 2 verses verbatim; Guptavati notes quoted (trimshhallochana = 3 eyes per each of 10 faces; ayudhas from dakshina-adhah-kara order). Hindi Chandraprabha mirrors per verse.`
      }
    ],
    translation: `The Rishi said: "She who was declared threefold — triguna, tamasi, sattviki — is called Sharva, Chandika, Durga, Bhadra, Bhagavati. As Vishnu's Yoganidra she is Mahakali of tamas-guna, whom Brahma, lotus-seated, praised for the destruction of Madhu-Kaitabha."`,
    commentary: `**Condensed digest (pp.710-717; opening verses verbatim):** verses 3-6 fix Mahakali's vikriti (ten faces/feet/arms, collyrium-dark, thirty-eye garland, sword-arrow-mace-spear-conch-discus-bhushundi-parigha-bow plus bleeding severed head); Guptavati glosses "trimshat" as three eyes per face and orders weapons from the lower-right hand round. Verses 7-13 unfold Mahalakshmi's vikriti (born of all deva-bodies, Mahisha-mardini, white face/blue arms/red middle, eighteen — really thousand — arms with rosary-to-noose series, worship of whom makes one lord of worlds). Remainder (Mahasarasvati/Gauri vikriti, Shumbha-slaying form) is summary. Chandraprabha Hindi tracks each attribute plainly (pp.711-717).`,
    keyPoints: [
      '**Vikriti = functional form**: One samashti assumes distinct battle-bodies per guna-task; names multiply, Lady stays one.',
      '**Mahakali vikriti**: Ten-faced, thirty-eyed, ten-armed Yoganidra praised by Brahma against Madhu-Kaitabha.',
      '**Mahalakshmi vikriti**: Deva-body-born, eighteen/thousand-armed Mahisha-mardini; worshippers become world-lords.'
    ]
  },
  {
    id: 'dm-rahasya-murti',
    number: 'Mūrti Rahasya (digest)',
    section: 'Uttarāṅga: Rahasya-traya 3/3 (Ṣaḍaṅga 6/6)',
    devanagari: `ऋषिरुवाच।
नन्दा भगवती नाम या भविष्यति नन्दजा।
सा स्तुता पूजिता भक्त्या वशीकुर्याज्जगत्त्रयम् ॥१॥
कनकोत्तमकान्तिः सा सुकान्तिकनकाम्बरा।
देवी कनकवर्णाभा कनकोत्तमभूषणा ॥२॥
कमलाङ्कुशपाशाब्जैरलङ्कृतचतुर्भुजा।
इन्दिरा कमला लक्ष्मीः सा श्रीरुक्माम्बुजासना ॥३॥`,
    iast: `ṛṣir uvāca |
nandā bhagavatī nāma yā bhaviṣyati nandajā |
sā stutā pūjitā bhaktyā vaśīkuryāj jagattrayam ||1||
kanakottamkāntiḥ sā sukānti kanakāmbarā |
devī kanakavarṇābhā kanakottamabhūṣaṇā ||2||
kamalāṅkuśapāśābjair alaṅkṛtacaturbhujā |
indirā kamalā lakṣmīḥ sā śrīr rukmāmbujāsanā ||3||`,
    conceptIds: ['rahasya-traya', 'future-avatars', 'phalastuti'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Murti Rahasya pp.718-722 (Rahasya-traya 3/3; shadanga 6/6). Nanda (1-3), Raktadantika (4-11), Shakambhari/Shatakshi/Durga and Bhramari forms follow; Guptavati + Chandraprabha glosses as extracted.`
      }
    ],
    translation: `The Rishi said: "The Lady named Nanda, who will be born as Nandaja — praised and worshipped with devotion, she brings the three worlds under sway. Of surpassing golden lustre, fair-garmented in gold, golden-hued and gold-bejewelled, four-armed with lotus, goad, noose and conch (or lotus), she is Indira, Kamala, Lakshmi, Shri, seated on a golden lotus."`,
    commentary: `**Condensed digest (pp.718-722):** after Nanda (1-3; Guptavati: abja = shankha-or-lotus), Raktadantika (4-11: red garments/limbs/weapons/eyes/hair/nails/teeth; "as a loving wife holds her husband, so She holds her devotee"; then vast earth-bodied, Meru-breasted, sword-cup-pestle-plough-bearing Rakta-Chamunda/Yogeshvari pervading the moving-unmoving). Then Shakambhari Neela (blue, blue-lotus-eyed, deep-navelled, hard-full breasts, fist-full-of-arrows + lotus), Shatakshi/Durga and Bhramari forms close the seven-murti cycle (Nanda, Raktadantika, Shakambhari, Durga, Bhima, Bhramari +). Chandraprabha Hindi paraphrases each icon verbatim. Full 20+ verses pending line-by-line transcription; no verse invented here.`,
    keyPoints: [
      '**Seven murtis, dated futures**: Nanda through Bhramari are the dated descents (avataras) whose prakriti Pradhanika already named.',
      '**Raktadantika vow**: Whoever studies her body-hymn daily is served by Her as a beloved wife serves — bhakti compulsion, not magic.',
      '**Shadanga closure**: With Murti the six limbs close; what follows (kshama, saptashloki) is phala-raksha, not anga.'
    ]
  },
  {
    id: 'dm-kshama-prarthana',
    number: 'Kṣamā-prārthanā 1-6',
    section: 'Uttarāṅga: Kṣamā (closing forgiveness)',
    devanagari: `अपराधसहस्राणि क्रियन्तेऽहर्निशं मया।
दासोऽयमिति मां मत्वा क्षमस्व परमेश्वरि ॥१॥
आवाहनं न जानामि न जानामि विसर्जनम्।
पूजां चैव न जानामि क्षम्यतां परमेश्वरि ॥२॥
मन्त्रहीनं क्रियाहीनं भक्तिहीनं सुरेश्वरि।
यत्पूजितं मया देवि परिपूर्णं तदस्तु मे ॥३॥
अपराधशतं कृत्वा जगदम्बेति चोच्चरेत्।
यां गतिं समवाप्नोति न तां ब्रह्मादयः सुराः ॥४॥
सापराधोऽस्मि शरणं प्राप्तस्त्वां जगदम्बिके।
इदानीमनुकम्प्योऽहं यथेच्छसि तथा कुरु ॥५॥
अज्ञानाद्विस्मृतेर्भ्रान्त्या यन्यूनमधिकं कृतम्।
तत्सर्वं क्षम्यतां देवि प्रसीद परमेश्वरि ॥६॥`,
    iast: `aparādhasahasrāṇi kriyante'harniśaṃ mayā |
dāso'yam iti māṃ matvā kṣamasva parameśvari ||1||
āvāhanaṃ na jānāmi na jānāmi visarjanam |
pūjāṃ caiva na jānāmi kṣamyatāṃ parameśvari ||2||
mantrahīnaṃ kriyāhīnaṃ bhaktihīnaṃ sureśvari |
yat pūjitaṃ mayā devi paripūrṇaṃ tad astu me ||3||
aparādhaśataṃ kṛtvā jagadambeti coccaret |
yāṃ gatiṃ samavāpnoti na tāṃ brahmādayaḥ surāḥ ||4||
sāparādho'smi śaraṇaṃ prāptas tvāṃ jagadambike |
idānīm anukampyo'haṃ yathecchasi tathā kuru ||5||
ajñānād vismṛter bhrāntyā yan nyūnam adhikaṃ kṛtam |
tat sarvaṃ kṣamyatāṃ devi prasīda parameśvari ||6||`,
    conceptIds: ['phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Kshama-prarthana p.723 (6 verses verbatim) followed by Devyaparadha-kshamapana-stotra p.725 ("na mantram no yantram") and Saptashloki Durga p.729 (Shiva-uvacha; 7 verses excerpted from adhyayas, closed "iti saptashloki durga sampurna").`
      }
    ],
    translation: `"Thousands of offences are committed by me day and night; reckoning me your servant, forgive, O Supreme Lady. I know no invocation nor dismissal, nor worship — forgive me, Supreme Lady. Whatever I have worshipped, O Goddess, devoid of mantra, rite, or devotion — let it become complete for me. Having committed a hundred offences, whoever utters 'Jagadamba' attains a goal not even Brahma and the gods attain. Offending, I have come to you for refuge, Mother of worlds; now I am to be pitied — do with me as you will. Whatever was done deficient or excessive through ignorance, forgetfulness or delusion — forgive all that, O Goddess; be gracious, Supreme Lady."`,
    commentary: `**Closing frame:** after the six limbs, the edition places kshama (p.723), then the longer Devyaparadha-kshamapana ("na mantram no yantram...", p.725) and Saptashloki Durga (p.729, seven excerpt-verses with Hindi rendering, closed as complete). Only the six-verse Kshama is transcribed here; the Kshamapana and Saptashloki reuse adhyaya verses already in ch01-ch13, so they are indexed, not duplicated — same no-double-counting rule as the Tantrokta cross-reference.`,
    keyPoints: [
      '**Mantra-hina insurance**: What lacks mantra, rite or devotion is completed by forgiveness, not by repetition.',
      '**Jagadamba single-word refuge**: One uttered name outruns even the gods’ attainment.'
    ]
  },
  {
    id: 'dm-mantra-vibhaga-note',
    number: 'Saptaśatī Mantra-vibhāga (procedural index)',
    section: 'Prayoga Vidhi: Mantra-vibhāga & Bīja tables',
    devanagari: `॥ सप्तशतीमन्त्रविभागनिर्देशः ॥`,
    iast: `|| saptaśatīmantravibhāganirdeśaḥ ||`,
    conceptIds: ['phalastuti', 'sadhana-samara'],
    interpretiveNotes: [
      {
        note: `${PROVENANCE} Mantra-vibhaga (Katyayani) pp.73-83 (sloka/ardhashloka/uvacha counts per adhyaya; 19 sangraha-karikas p.82); Yamala-vichara pp.693-695; bija/mantra tables pp.795-814 (per-adhyaya shloka-mantra/ardha/uvacha tallies closing "charitra-traye mantrah 700"). Nagoji Prayoga pp.84-115 gives homa/purashcharana counts per verse.`
      }
    ],
    translation: `Procedural index only (no new mantra text): the edition counts every half-verse, full verse and "uvacha" as mantra-units (Katyayani vs Yamala recensions compared, Kanva differences flagged p.81), tabulates bija syllables per verse (pp.795-814), and prescribes homa counts per unit (Nagoji pp.92-99: e.g. Adhyaya 1 = 17 shloka-mantras + ardha units; Adhyaya 3 = 41+3; totals close at 700 for the three caritas).`,
    commentary: `**How to use this entry:** when the app's chapter files group several shlokas per card (e.g. dm-1-16-29), the mantra-vibhaga tables are the authority for expanding any group to homa-units: each ardha and each "rishi-uvacha/marka-uvacha/devy-uvacha" line is its own ahuti with "svaha". The tables also settle the edition's famous quarrel with Kanva (p.81: Kanva takes only the latter half between two "uvacha"s as mantra; Guptavati school rejects it as nirmula). No mantra text is duplicated here; counts only.`,
    keyPoints: [
      '**700 = mantra-units, not printed lines**: Ardhas and uvachas count; group-cards expand via these tables for homa.',
      '**Katyayani vs Yamala vs Kanva**: The edition compares all three and defends the Guptavati division with nyaya.'
    ]
  }
];
