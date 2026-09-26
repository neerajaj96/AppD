// Bhagavad Gītā — Rāmakaṇṭha-grounded pilot concepts (Phase 3).
// Seven records with source terms, evidence-backed occurrences and typed
// relationships. Bilingual content lives inline (no overlay file); the
// factory merges by id and the adapters carry the scholarly fields to V2.
// See docs/scholarly/bhagavad-gita-rama-kantha-concept-ontology.md.
const L = (enTitle: string, enSummary: string, mlTitle: string, mlSummary: string) => ({
  en: { title: enTitle, summary: enSummary },
  ml: { title: mlTitle, summary: mlSummary },
});

// any[] matches the convention of the neighbouring content files
// (branded ids would reject plain strings); shape is enforced by the
// factory, the adapters, validation and the Phase-3 test suite.
export const gitaRamakanthaConcepts: any[] = [
  {
    id: 'gita-rk-karman',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'कर्म', kind: 'attested', language: 'sa' },
      { form: 'कर्मयोग', kind: 'attested', language: 'sa' },
      { form: 'कर्मफल', kind: 'attested', language: 'sa' },
      { form: 'कर्मन्', kind: 'normalised', language: 'sa' },
      { form: 'Karman', kind: 'normalised', language: 'sa' },
      { form: 'action', kind: 'translated', language: 'en', note: 'editorial gloss, not a source quotation' },
    ],
    relatedVerseIds: ['2.47', '3.3', '5.1', '6.1'],
    relatedConceptIds: ['gita-rk-jnana'],
    content: L(
      'Karman',
      'Enjoined action (kārya karma) performed without appropriating its fruit. Rāmakaṇṭha assigns karma-yoga and jñāna-yoga as sequential niṣṭhās for one man (3.3), reads sannyāsa itself as unclaimed action (5.1, 6.1), and grants the entitlement to act only to one established in Self-knowledge (2.47).',
      'കർമ്മം',
      'ശാസ്ത്രവിധിയായ കർമ്മം ഫലം ആഗ്രഹിക്കാതെ ചെയ്യുക. ആത്മജ്ഞാനത്തിൽ ഉറച്ചവനേ കർമ്മത്തിന് അർഹതയുള്ളൂ (2.47). ജ്ഞാനയോഗവും കർമ്മയോഗവും ഒരുവന് ക്രമത്തിലുള്ള രണ്ട് നിഷ്ഠകളാണ് (3.3); ഉപേക്ഷിക്കപ്പെട്ട കർമ്മം തന്നെയാണ് സന്നാസം (5.1, 6.1).',
    ),
    occurrences: [
      { unitId: '2.47', sourceTerm: 'कर्मन्', relation: 'commentary', context: 'pratīka gloss (tattvajñāna-upapatti grounds karma-adhikāra)', folio: 44, quote: 'कर्मण्यधिकारोऽस्तु', note: 'KSTS 2.48 gloss: the Self recognised as nondual consciousness-light acts; agency follows knowledge.' },
      { unitId: '3.3', sourceTerm: 'कर्मयोग', relation: 'commentary', context: 'verse teaching + gloss (sāṅkhya/yogin definitions; karma as kriyā-viśeṣa)', folio: 62, note: 'Two niṣṭhās for one man in sequence, not two paths for two men.' },
      { unitId: '5.1', sourceTerm: 'कर्मणा', relation: 'commentary', context: 'Arjuna question + gloss (karma-tyāga vs yoga-svīkāra opposition)', folio: 116, note: 'Question presumes the opposition samuccaya will dissolve.' },
      { unitId: '6.1', sourceTerm: 'कर्मफलम्', relation: 'commentary', context: 'pratīka gloss (kārya karma as śāstric duty; mokṣaphala-samuccaya)', folio: 135, note: 'Unclaimed prescribed action is itself sannyāsa and yoga.' },
    ],
    conceptLinks: [
      { to: 'gita-rk-jnana', type: 'presupposes', units: ['2.47'], note: 'tattvajñāna-upapatti grounds karma-adhikāra (KSTS 2.48 gloss, f.44).' },
    ],
  },
  {
    id: 'gita-rk-jnana',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'ज्ञान', kind: 'attested', language: 'sa' },
      { form: 'तत्त्वज्ञान', kind: 'attested', language: 'sa' },
      { form: 'विज्ञान', kind: 'attested', language: 'sa' },
      { form: 'Jñāna', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['13.3', '2.47', '9.1', '10.11'],
    relatedConceptIds: ['gita-rk-prakriti'],
    content: L(
      'Jñāna',
      'Discriminative knowledge of the Self. Rāmakaṇṭha defines it as knowledge of the distinction between field and knower (13.3: kṣetrakṣetrajñayor jñānaṃ matam), treats established Self-knowledge (tattvajñāna-upapatti) as the ground of entitlement to act (2.47), and presents it joined with direct realisation (vijñāna) as liberating (9.1); the lamp of knowledge destroys confusion-born darkness (10.11).',
      'ജ്ഞാനം',
      'ആത്മാവിനെക്കുറിച്ചുള്ള വിവേകജ്ഞാനം. ക്ഷേത്ര-ക്ഷേത്രജ്ഞവിവേകമാണ് ജ്ഞാനം (13.3). തത്ത്വജ്ഞാനത്തിൽ ഉറച്ചവനാണ് കർമ്മത്തിന് അർഹൻ (2.47). സാക്ഷാത്കാരത്തോടുചേർന്ന (വിജ്ഞാനം) ജ്ഞാനം മോചനം നൽകുന്നു (9.1, 10.11).',
    ),
    occurrences: [
      { unitId: '13.3', sourceTerm: 'ज्ञानम्', relation: 'commentary', context: 'definition verse + gloss (kṣetrakṣetrajñayor jñānaṃ matam)', folio: 278, note: 'KSTS 13.2. Jñāna is defined as the distinction-knowledge itself.' },
      { unitId: '2.47', sourceTerm: 'तत्त्वज्ञान', relation: 'commentary', context: 'gloss (tattvajñāna-upapatti precedes karma-adhikāra)', folio: 44, note: 'KSTS 2.48. Knowledge established first, action entitled after.' },
      { unitId: '9.1', sourceTerm: 'ज्ञानम्', relation: 'commentary', context: 'pratīka gloss (jñāna as brahmaprāpyupāya, joined with vijñāna)', folio: 197, note: 'KSTS 9.1. Vijñāna specified as svasaṃvit-sākṣātkāra culmination.' },
      { unitId: '10.11', sourceTerm: 'ज्ञानदीप', relation: 'commentary', context: 'pratīka gloss (lamp of supreme-consciousness light)', folio: 225, quote: 'ज्ञानदीपेन', note: 'Destroys ajñāna-tamas; ends in madabhedalakṣaṇa mokṣa.' },
    ],
    conceptLinks: [
      { to: 'gita-rk-prakriti', type: 'explains', units: ['13.3'], note: 'Jñāna is defined as knowledge OF the kṣetra/kṣetrajña distinction (KSTS 13.2, f.278).' },
    ],
  },
  {
    id: 'gita-rk-samuccaya',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'समुच्चय', kind: 'attested', language: 'sa' },
      { form: 'ज्ञानकर्मसमुच्चय', kind: 'attested', language: 'sa' },
      { form: 'ज्ञानक्रियासमुच्चय', kind: 'attested', language: 'sa' },
      { form: 'समुच्चयानुष्ठातृ', kind: 'attested', language: 'sa' },
      { form: 'Samuccaya', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['2.38', '3.1', '4.1', '7.1', '5.3'],
    relatedConceptIds: ['gita-rk-moksa'],
    content: L(
      'Samuccaya',
      'The conjunction of knowledge and action as one teachable content. Rāmakaṇṭha ascertains jñāna-kriyā-samuccaya as what is to be taught (on 2.38), names jñānakarmasamuccaya the abhidheya of the whole prakaraṇa with supreme Self-attainment as prayojana (ch. 4 avataraṇikā), presents Arjuna as asking precisely because he has not ascertained the samuccaya object (ch. 3 avataraṇikā), and describes the samuccaya-practitioner as ever-renounced even while acting (5.3).',
      'സമുച്ചയം',
      'അറിവും പ്രവൃത്തിയും ചേർന്ന സമുച്ചയം ഉപദേശവിഷയമാണ് (2.38). പ്രകരണത്തിന്റെ അഭിധേയവും പരമാത്മസമാപത്തി പ്രയോജനവുമാണ് (അദ്ധ്യായം 4 മുഖവുര). സമുച്ചയാർത്ഥം നിശ്ചയിക്കാത്തതിനാലാണ് അർജ്ജുനൻ ചോദിക്കുന്നത് (അദ്ധ്യായം 3 മുഖവുര). പ്രവർത്തിച്ചുകൊണ്ടും സമുച്ചയാനുഷ്ഠാതാവ് നിത്യസന്നാസിയാണ് (5.3).',
    ),
    occurrences: [
      { unitId: '2.38', sourceTerm: 'ज्ञानक्रियासमुच्चय', spanId: 'gita-seg-2.39-tail', relation: 'commentary', context: 'closing gloss (samuccaya ascertained as the teachable)', folio: 38, quote: 'ज्ञानक्रियासमुच्चयमेव', note: 'KSTS 2.39 commentary tail, printed p.48.' },
      { unitId: '3.1', sourceTerm: 'समुच्चय', spanId: 'gita-ps-3-avat', relation: 'commentary', context: 'avataraṇikā (Arjuna asks from non-ascertainment of the samuccaya object)', folio: 61, unmappedReason: 'chapter avataraṇikā (no verse number); folio of opening page' },
      { unitId: '4.1', sourceTerm: 'ज्ञानकर्मसमुच्चय', spanId: 'gita-ps-4-avat', relation: 'commentary', context: 'avataraṇikā (samuccaya as abhidheya; paramātma-samāpatti as prayojana)', folio: 92, unmappedReason: 'chapter avataraṇikā (no verse number); folio of opening page' },
      { unitId: '7.1', sourceTerm: 'ज्ञानकर्मसमुच्चयरूप', spanId: 'gita-ps-7-avat', relation: 'commentary', context: 'avataraṇikā (the unsurpassed yoga of samuccaya form)', folio: 158, unmappedReason: 'chapter avataraṇikā (no verse number); folio of opening page' },
      { unitId: '5.3', sourceTerm: 'समुच्चयानुष्ठातृ', relation: 'commentary', context: 'gloss (the practitioner ever-renounced while acting)', folio: 117, note: 'KSTS 5.3. Samuccaya as a practitioner category, not only a thesis.' },
    ],
    conceptLinks: [
      { to: 'gita-rk-moksa', type: 'leads-to', units: ['4.1', '6.1'], note: 'Abhidheya/prayojana pairing (ch.4 avataraṇikā) and mokṣaphala-samuccaya-anuṣṭhāna (6.1 gloss).' },
    ],
  },
  {
    id: 'gita-rk-prakriti',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'प्रकृति', kind: 'attested', language: 'sa' },
      { form: 'क्षेत्र', kind: 'attested', language: 'sa' },
      { form: 'परा', kind: 'attested', language: 'sa', note: 'higher nature (jīvabhūtā), 7.5' },
      { form: 'Prakṛti', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['13.2', '7.4', '7.5'],
    relatedConceptIds: ['gita-rk-purusa'],
    content: L(
      'Prakṛti',
      'The known, objective principle set against the knower. The body is the field (13.2: śarīraṃ kṣetram); nature is eightfold lower (aparā) with the living (jīva) as higher nature (parā) (7.4–7.5); what the Lord appears as, twofold, through inconceivable māyā-śakti.',
      'പ്രകൃതി',
      'ജ്ഞാതാവിൽനിന്ന് വേർതിരിച്ചറിയേണ്ട ജ്ഞേയവസ്തു. ശരീരം ക്ഷേത്രമാണ് (13.2). അഷ്ടധാ അപരാപ്രകൃതിയും ജീവഭൂതമായ പരാപ്രകൃതിയും (7.4–5).',
    ),
    occurrences: [
      { unitId: '13.2', sourceTerm: 'क्षेत्रम्', spanId: 'gita-seg-13.1-glosa', relation: 'commentary', context: 'pratīka gloss (śarīra identified as kṣetra)', folio: 277, note: 'KSTS 13.1. The field establisher for the whole adhyāya.' },
      { unitId: '7.4', sourceTerm: 'प्रकृतिः', relation: 'commentary', context: 'verse teaching + gloss (eightfold aparā nature)', folio: 159, note: 'KSTS 7.4.' },
      { unitId: '7.5', sourceTerm: 'जीवभूता', relation: 'commentary', context: 'verse teaching + gloss (parā nature; twofold self-display through māyā-śakti)', folio: 159, note: 'KSTS 7.5. Links prakṛti to māyā-śakti and krīḍā.' },
    ],
    conceptLinks: [
      { to: 'gita-rk-purusa', type: 'contrasts-with', units: ['13.3'], note: 'Manifold known bodies vs the one unfailing knower (KSTS 13.2 resolution, f.278).' },
    ],
  },
  {
    id: 'gita-rk-purusa',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'पुरुष', kind: 'attested', language: 'sa' },
      { form: 'क्षेत्रज्ञ', kind: 'attested', language: 'sa' },
      { form: 'वेदक', kind: 'attested', language: 'sa' },
      { form: 'प्रमातृ', kind: 'attested', language: 'sa' },
      { form: 'पुरुषोत्तम', kind: 'attested', language: 'sa' },
      { form: 'Puruṣa', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['13.3', '15.16', '15.17', '15.18'],
    relatedConceptIds: [],
    content: L(
      'Puruṣa',
      'The conscious principle: the single percipient present in all fields, argued from the distinction between manifold known bodies and unfailing knowership (13.3); discriminated as perishable and imperishable (15.16), with the supreme person beyond both (15.17–18: puruṣottama).',
      'പുരുഷൻ',
      'ചേതനതത്ത്വം — എല്ലാ ക്ഷേത്രങ്ങളിലുമുള്ള ഏക വേദകൻ (13.3). ക്ഷരാക്ഷരവിവേകം; ഇവയ്ക്കതീതനായ ഉത്തമപുരുഷൻ (15.16–18).',
    ),
    occurrences: [
      { unitId: '13.3', sourceTerm: 'वेदक', spanId: 'gita-seg-13.2-resolution', relation: 'commentary', context: 'nanu-objection resolution (eka vedaka vs manifold vedya; pramātṛ vocabulary)', folio: 278, note: 'KSTS 13.2 gloss. Knowership alone (vedakatvamātra) as the distinctive mark of ātman.' },
      { unitId: '15.16', sourceTerm: 'पुरुषौ', relation: 'commentary', context: 'verse teaching (kṣara/akṣara discrimination)', folio: 331, note: 'KSTS 15.16.' },
      { unitId: '15.17', sourceTerm: 'उत्तमः पुरुषः', relation: 'commentary', context: 'verse teaching (the supreme person beyond both)', folio: 332, note: 'KSTS 15.17.' },
      { unitId: '15.18', sourceTerm: 'पुरुषोत्तमः', relation: 'commentary', context: 'verse teaching ( famed as puruṣottama)', folio: 332, note: 'KSTS 15.18.' },
    ],
    conceptLinks: [],
  },
  {
    id: 'gita-rk-maya',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'माया', kind: 'attested', language: 'sa' },
      { form: 'मायाशक्ति', kind: 'attested', language: 'sa' },
      { form: 'Māyā', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['7.14', '13.3', '18.61'],
    relatedConceptIds: [],
    content: L(
      'Māyā',
      'The Lord\u2019s own power (madīyā śakti), sportive in nature (devanāt/krīḍanāt) and hard to cross (duratyayā), unreal yet appearing real (7.14); the inconceivable Īśvara-māyā-śakti whose play differentiates experience (13.3); the machine-power through which Īśvara moves beings (18.61–62). Crossed not by flight but by resort (prapatti) through knowledge ending in non-difference (7.14).',
      'മായ',
      'ഭഗവാന്റെ സ്വന്തം ശക്തി — ലീലാസ്വഭാവവും കടക്കാൻ പ്രയാസവുമുള്ളത്, അസത്യമായിട്ടും സത്യമായി തോന്നുന്നത് (7.14). അചിന്ത്യമായ ഈശ്വരമായാശക്തിയുടെ വിലാസമാണ് ഭേദാനുഭവം (13.3). ശരണം-ജ്ഞാനത്താൽ മായ കടക്കാം.',
    ),
    occurrences: [
      { unitId: '7.14', sourceTerm: 'माया', relation: 'commentary', context: 'double-nanu exposition (devanāt/krīḍanāt; duratyayā; prapatti resolution)', folio: 165, quote: 'असती अपि सत्यवदाभासयन्ती', note: 'KSTS 7.14. Māyā identified with śakti; second objection defends the apavarga teaching.' },
      { unitId: '13.3', spanId: 'gita-seg-13.2-resolution', sourceTerm: 'मायाशक्ति', relation: 'commentary', context: 'resolution gloss (per-body difference as acintyeśvara-māyāśakti play)', folio: 278, note: 'KSTS 13.2 gloss. Links māyā to the puruṣa question.' },
      { unitId: '18.61', sourceTerm: 'मायया', spanId: 'gita-ps-18.61-maya', relation: 'commentary', context: 'gloss on the unnumbered half (yantra machine-power)', folio: 396, note: 'KSTS 18.61 span. Māyā as the medium of Īśvara moving beings.' },
    ],
    conceptLinks: [],
  },
  {
    id: 'gita-rk-moksa',
    status: 'source-grounded',
    sourceTerms: [
      { form: 'मोक्ष', kind: 'attested', language: 'sa' },
      { form: 'अपवर्ग', kind: 'attested', language: 'sa' },
      { form: 'अपवर्गमार्ग', kind: 'attested', language: 'sa' },
      { form: 'Mokṣa', kind: 'normalised', language: 'sa' },
    ],
    relatedVerseIds: ['1.1', '7.14', '9.33', '9.1'],
    relatedConceptIds: [],
    content: L(
      'Mokṣa',
      'Release, termed apavarga as the highest human end (upodghāta: apavargasya parapuruṣārthatvāt). When uncrossable māyā seems to make teaching vain, the answer is resort through knowledge (7.14); seers participate in release (apavarga-bhāgitva) through Self-knowledge and devotion (9.33); liberating knowledge releases (9.1: mokṣyase).',
      'മോക്ഷം',
      'പരമപുരുഷാർത്ഥമായ അപവർഗം — മോചനം (ഉപോദ്ഘാതം). മായ കടക്കാനാവാത്തതിനാൽ ഉപദേശം വ്യർത്ഥമെന്ന ശങ്കയ്ക്ക് ശരണം-ജ്ഞാനമാണ് മറുപടി (7.14). ആത്മജ്ഞാനത്താലും ഭക്തിയാലും അപവർഗഭാഗിത്വം (9.33). ജ്ഞാനത്താൽ മോചനം (9.1).',
    ),
    occurrences: [
      { unitId: '1.1', sourceTerm: 'अपवर्ग', relation: 'commentary', context: 'upodghāta (front matter; apavarga as parapuruṣārtha; Gītā as apavarga-establishing dialogue)', folio: 2, unmappedReason: 'opening prose before numbered verses; folio of printed page' },
      { unitId: '7.14', sourceTerm: 'अपवर्गमार्ग', relation: 'commentary', context: 'second-nanu objection (would the release-path teaching be vain?) and prapatti resolution', folio: 166, note: 'Evidence sits in the extended gloss (printed p.176).' },
      { unitId: '9.33', sourceTerm: 'अपवर्गभागित्व', relation: 'commentary', context: 'closing gloss (participation in release through ātmajñāna and madbhakti)', folio: 217, note: 'Evidence sits in the commentary close (printed p.227).' },
      { unitId: '9.1', sourceTerm: 'मोक्ष', relation: 'commentary', context: 'liberating knowledge joined with vijñāna (mokṣyase)', folio: 197, note: 'KSTS 9.1.' },
    ],
    conceptLinks: [],
  },
];
