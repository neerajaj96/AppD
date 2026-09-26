import { GITA_PASSAGE_SPANS } from './gitaSpans';
import { GITA_COMMENTARY_TEXTS } from './gitaCommentaryText';
import { parseGitaVerseRef } from './gitaDocument';

/**
 * Bhagavad Gītā Chapter 13 Rāmakaṇṭha commentary inventory (Phase 8).
 *
 * A deterministic, machine-readable record of the Chapter-13 source: one
 * row per KSTS verse (13.1–13.34) describing what commentary the printed
 * edition carries, where it sits, what it contains, what Darśana has
 * transcribed, what remains, and why. The print side (commentaryStart /
 * commentaryEnd / crossesPage / contains) is fixed source description;
 * the transcription side (spanIds / passageIds) references the span and
 * passage tables, never recopies them. `validateChapter13Inventory`
 * keeps the three layers reconciled; tests enforce it.
 *
 * Verification honesty: every row keeps the print (`commentary exists in
 * the edition`) separate from the transcription (`transcribed into
 * Darśana`). `remaining` says honestly what prose between the bounded
 * excerpts stays untranscribed.
 */

export interface Chapter13InventoryContains {
  gloss: boolean;
  objection: boolean;
  response: boolean;
  quotation: boolean;
  crossReference: boolean;
  variant: boolean;
  summary: boolean;
  closing: boolean;
}

export interface Chapter13InventoryRow {
  /** KSTS verse number within Chapter 13 (1–34). */
  ksts: string;
  /** Repository unit (vulgate numbering; KSTS runs one below). */
  repoUnit: string;
  /** Vulgate verse number (same as the repository unit number). */
  vulgate: string;
  /** PDF page where the commentary region starts. */
  pdf: number;
  /** Printed folio where the commentary region starts. */
  folio: number;
  /** First words of the commentary region in print. */
  commentaryStart: string;
  /** Last words of the commentary region in print. */
  commentaryEnd: string;
  /** Whether the commentary region crosses a PDF page boundary. */
  crossesPage: boolean;
  /** Whether the region shares material across a verse boundary. */
  crossesVerseBoundary: boolean;
  contains: Chapter13InventoryContains;
  /** Span records evidencing this region (never transcription). */
  spanIds: string[];
  /** Transcribed passages evidencing this region (diplomatic text). */
  passageIds: string[];
  /** Prose between the bounded excerpts that stays untranscribed, and why. */
  remaining: string;
  /** Unresolved extraction or attribution issues in this region. */
  unresolved: string[];
}

const C = (
  partial: Partial<Chapter13InventoryContains>,
): Chapter13InventoryContains => ({
  gloss: false,
  objection: false,
  response: false,
  quotation: false,
  crossReference: false,
  variant: false,
  summary: false,
  closing: false,
  ...partial,
});

export const CHAPTER13_COMMENTARY_INVENTORY: Chapter13InventoryRow[] = [
  {
    ksts: '13.1', repoUnit: '13.2', vulgate: '13.2', pdf: 287, folio: 277,
    commentaryStart: '‘इदं’ सर्वप्रमातृप्रसिद्धतया',
    commentaryEnd: 'केनैव योगिनस्तं विदुरिति (with the nanu shared into 13.2)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true, objection: true, summary: true, variant: true }),
    spanIds: ['gita-seg-13.1-glosa', 'gita-seg-13.1-etat', 'gita-seg-13.1-tatparya', 'gita-ps-13.2-nanu'],
    passageIds: ['gita-tx-13.1-glosa', 'gita-tx-13.1-etat', 'gita-tx-13.1-tatparya', 'gita-tx-13.2-nanu'],
    remaining: 'Gloss core fully covered in four bounded excerpts; no structural prose remains.',
    unresolved: [],
  },
  {
    ksts: '13.2', repoUnit: '13.3', vulgate: '13.3', pdf: 288, folio: 278,
    commentaryStart: 'परिहर्तुमाह (verse introduction)',
    commentaryEnd: 'विवेकज्ञानमात्रं तात्त्विकं ज्ञानमिति तात्पर्यम्',
    crossesPage: false, crossesVerseBoundary: true,
    contains: C({ gloss: true, summary: true, variant: true }),
    spanIds: ['gita-ps-13.2-nanu', 'gita-seg-13.2-verse', 'gita-seg-13.2-resolution', 'gita-seg-13.2-sarvaksetra'],
    passageIds: ['gita-tx-13.2-nanu', 'gita-tx-13.2-resolution', 'gita-tx-13.2-sarvaksetra'],
    remaining: 'Resolution and sarvakṣetra covered; the verse-introduction span stays segment-only (mūla excluded by policy).',
    unresolved: [],
  },
  {
    ksts: '13.3', repoUnit: '13.4', vulgate: '13.4', pdf: 288, folio: 278,
    commentaryStart: 'इदानीं नानादर्शनभेदेन',
    commentaryEnd: 'तत्सवै संग्रहेण उच्यमानमवधारय',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.3-intro', 'gita-seg-13.3-tat', 'gita-seg-13.3-gloss'],
    passageIds: ['gita-tx-13.3-intro', 'gita-tx-13.3-tat', 'gita-tx-13.3-gloss'],
    remaining: 'Question-word exposition fully covered in three bounded excerpts.',
    unresolved: [],
  },
  {
    ksts: '13.4', repoUnit: '13.5', vulgate: '13.5', pdf: 289, folio: 279,
    commentaryStart: 'अस्य वस्तुनः स्मृतिश्रुतिप्रसिद्धत्वप्रतिपादनार्थमाह',
    commentaryEnd: 'यादृगित्यादिना शिष्टं वक्तुमाह',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.4-rsibhi', 'gita-seg-13.4-upasamhara'],
    passageIds: ['gita-tx-13.4-rsibhi', 'gita-tx-13.4-upasamhara'],
    remaining: 'Smṛti-śruti gloss and prasiddhatva bridge fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.5', repoUnit: '13.6', vulgate: '13.6', pdf: 290, folio: 280,
    commentaryStart: 'तत्र महाभूतशब्देन',
    commentaryEnd: 'क्षेत्रमिति उक्ता',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true, variant: true }),
    spanIds: ['gita-seg-13.5-gloss', 'gita-seg-13.5-tattva', 'gita-seg-13.5-karana', 'gita-seg-13.5-karya'],
    passageIds: ['gita-tx-13.5-gloss', 'gita-tx-13.5-tattva', 'gita-tx-13.5-karana', 'gita-tx-13.5-karya'],
    remaining: 'Tattva definitions, kāraṇa analysis and kārya-saṅgraha fully covered in four excerpts.',
    unresolved: [],
  },
  {
    ksts: '13.6', repoUnit: '13.7', vulgate: '13.7', pdf: 290, folio: 280,
    commentaryStart: 'इदानीं तु दर्शनान्तरेषु (transition on printed p.281)',
    commentaryEnd: 'यथोपक्रान्तं क्षेत्रलक्षणं तावत् निर्णीतम्',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.6-darsanantara', 'gita-seg-13.6-iccha', 'gita-seg-13.6-upasamhara', 'gita-seg-13.6-siddhanta'],
    passageIds: ['gita-tx-13.6-darsanantara', 'gita-tx-13.6-iccha', 'gita-tx-13.6-upasamhara', 'gita-tx-13.6-siddhanta'],
    remaining: 'Darśanāntara turn, icchā-ādi definitions, pramātṛ puzzle and siddhānta-kathā fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.7', repoUnit: '13.8', vulgate: '13.8', pdf: 292, folio: 282,
    commentaryStart: 'इदानी ‘स च यो यत्स्वभावश्च’ (bridge shared with 13.6)',
    commentaryEnd: 'तपःस्वाध्यायध्यानादीनां गुणान्तराणामुपलक्षणं वेदितव्यम्',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true, objection: true, response: true, quotation: true, crossReference: true, variant: true }),
    spanIds: ['gita-seg-13.7-intro', 'gita-seg-13.7-mana', 'gita-seg-13.7-adambha', 'gita-seg-13.7-arjava', 'gita-seg-13.7-acarya'],
    passageIds: ['gita-tx-13.7-intro', 'gita-tx-13.7-mana', 'gita-tx-13.7-adambha', 'gita-tx-13.7-arjava', 'gita-tx-13.7-acarya'],
    remaining: 'Virtue-section bridge, māna, adambhitva/ahiṃsā/kṣānti with objection-response, ārjava and ācārya-skandha fully covered.',
    unresolved: [
      'xref: Mahābhārata verse quotation (महाभा०) without verse locator: retained in text as unresolved source evidence, no edge.',
      'xref: Mṛtyupada quotation (प्रशंसन्ति) without work or locator: retained in text as unresolved source evidence, no edge.',
    ],
  },
  {
    ksts: '13.8', repoUnit: '13.9', vulgate: '13.9', pdf: 295, folio: 285,
    commentaryStart: 'अथ ‘स्थैर्य’',
    commentaryEnd: 'सर्वान प्राज्ञोऽनुपश्यति (prajñāprāsāda close)',
    crossesPage: false, crossesVerseBoundary: true,
    contains: C({ gloss: true, quotation: true }),
    spanIds: ['gita-seg-13.8-sthairya'],
    passageIds: ['gita-tx-13.8-sthairya'],
    remaining: 'Sthairya-to-janma-doṣa gloss fully covered in one bounded excerpt (shared with the 13.7 close).',
    unresolved: ['xref: Prajñāprāsāda quotation (यथोक्तं) without locator: retained in text as unresolved source evidence, no edge.'],
  },
  {
    ksts: '13.9', repoUnit: '13.10', vulgate: '13.10', pdf: 295, folio: 285,
    commentaryStart: 'तथाविधस्य च स्वर्गादिफलेषु',
    commentaryEnd: 'चतुर्थी ज्ञानित्वरूपा भक्त्यवस्था (with the (७।१८) close)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true, crossReference: true }),
    spanIds: ['gita-seg-13.9-asakti'],
    passageIds: ['gita-tx-13.9-asakti'],
    remaining: 'Asakti-to-bhakti gloss fully covered (shared with the 13.10 exposition).',
    unresolved: ['xref: Printed (७।१८) extraction renders its danda as `/`; locator excluded from transcription, preserved in gita-xref-055.'],
  },
  {
    ksts: '13.10', repoUnit: '13.11', vulgate: '13.11', pdf: 295, folio: 285,
    commentaryStart: 'तस्यां च सत्यां ‘विविक्तदेश सेवित्वं’',
    commentaryEnd: 'ज्ञानाज्ञानलक्षणं वक्ष्यति (shared into the 13.11 close)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.9-asakti', 'gita-seg-13.10-vivikta', 'gita-seg-13.11-ajnana'],
    passageIds: ['gita-tx-13.9-asakti', 'gita-tx-13.10-vivikta', 'gita-tx-13.11-ajnana'],
    remaining: 'Vivikta-to-tattvajñānārtha gloss fully covered (shared with the 13.11 close).',
    unresolved: [],
  },
  {
    ksts: '13.11', repoUnit: '13.12', vulgate: '13.12', pdf: 296, folio: 286,
    commentaryStart: 'तस्यां च सत्यां (shared with the 13.10 exposition)',
    commentaryEnd: 'पुनरपि ज्ञानाज्ञानलक्षणं वक्ष्यति',
    crossesPage: false, crossesVerseBoundary: true,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.10-vivikta', 'gita-seg-13.11-ajnana'],
    passageIds: ['gita-tx-13.10-vivikta', 'gita-tx-13.11-ajnana'],
    remaining: 'Tattvajñānārtha turn and ajñāna close fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.12', repoUnit: '13.13', vulgate: '13.13', pdf: 296, folio: 286,
    commentaryStart: 'एवंविधेन च ज्ञानेन (pratijñā shared from printed p.286)',
    commentaryEnd: 'व्याप्य वर्तत इति (sarvataḥ close)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true, objection: true, response: true, variant: true }),
    spanIds: ['gita-seg-13.12-pratijna', 'gita-seg-13.12-jneya-resp', 'gita-seg-13.12-pratyavamarsa', 'gita-seg-13.12-samjna', 'gita-seg-13.12-nasat', 'gita-seg-13.12-anadi'],
    passageIds: ['gita-tx-13.12-pratijna', 'gita-tx-13.12-jneya-resp', 'gita-tx-13.12-pratyavamarsa', 'gita-tx-13.12-samjna', 'gita-tx-13.12-nasat', 'gita-tx-13.12-anadi'],
    remaining: 'Pratijñā, response, pratyavamarśa, saṃjñā-ādimat, na-sat and anādimat fully covered; only the nanu wording stays unresolved.',
    unresolved: ['Full nanu wording on ananya-saṃvedya extraction-noisy; response transcribed, objection stays an unresolved argument (gita-arg-13.13-jneya-obj).'],
  },
  {
    ksts: '13.13', repoUnit: '13.14', vulgate: '13.14', pdf: 298, folio: 288,
    commentaryStart: 'अत एव आह ‘सर्वेन्द्रियगुणाभास’',
    commentaryEnd: 'नियतेन्द्रियाधीनं ज्ञानमित्यर्थः',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.12-nasat', 'gita-seg-13.13-sarvendriya'],
    passageIds: ['gita-tx-13.12-nasat', 'gita-tx-13.13-sarvendriya'],
    remaining: 'Na-sat turn (shared) and sarvendriya gloss fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.14', repoUnit: '13.15', vulgate: '13.15', pdf: 299, folio: 289,
    commentaryStart: 'तथा ‘असक्त’',
    commentaryEnd: 'नतु तैस्तत्स्वरूपमात्रियते',
    crossesPage: false, crossesVerseBoundary: true,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.14-asakta', 'gita-seg-13.15-bahiranta'],
    passageIds: ['gita-tx-13.14-asakta', 'gita-tx-13.15-bahiranta'],
    remaining: 'Asakta-to-guṇabhoktṛ gloss fully covered (bahir-antaḥ shared into 13.15).',
    unresolved: [],
  },
  {
    ksts: '13.15', repoUnit: '13.16', vulgate: '13.16', pdf: 299, folio: 289,
    commentaryStart: 'अत एव अनवच्छिन्ननिजमाहात्म्य (shared bahir-antaḥ)',
    commentaryEnd: 'अभिन्नैकस्वरूपम् (avibhakta close)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.15-bahiranta', 'gita-seg-13.15-avibhakta'],
    passageIds: ['gita-tx-13.15-bahiranta', 'gita-tx-13.15-avibhakta'],
    remaining: 'Bahir-antaḥ, acara-cara, sūkṣma, dūra/antika and avibhakta fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.16', repoUnit: '13.17', vulgate: '13.17', pdf: 299, folio: 289,
    commentaryStart: 'अथच ‘विभक्तवञ्च संस्थितम्’ (shared from printed p.289)',
    commentaryEnd: 'प्रकृष्टं व्यतिरिक्त वा (tamas close)',
    crossesPage: true, crossesVerseBoundary: true,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.15-avibhakta', 'gita-seg-13.16-bhutabhartr'],
    passageIds: ['gita-tx-13.15-avibhakta', 'gita-tx-13.16-bhutabhartr'],
    remaining: 'Vibhakta turn (shared) with bhūtabhartṛ triad and jyotiṣ/tamas fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.17', repoUnit: '13.18', vulgate: '13.18', pdf: 300, folio: 290,
    commentaryStart: 'तथा ‘ज्ञानज्ञेय’',
    commentaryEnd: 'स्वसंवेदनसंवेद्यत्वात् (joint-verse close)',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.17-jnanagamya'],
    passageIds: ['gita-tx-13.17-jnanagamya'],
    remaining: 'Jñāna-jñeya, jñāna-gamya and hṛdi close fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.18', repoUnit: '13.19', vulgate: '13.19', pdf: 300, folio: 290,
    commentaryStart: '‘इति’ एतावता अन्थेन ‘क्षेत्र’',
    commentaryEnd: 'उपपन्नः समर्थो भवति',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true, crossReference: true, variant: true }),
    spanIds: ['gita-seg-13.18-upasamhara'],
    passageIds: ['gita-tx-13.18-upasamhara'],
    remaining: 'Kṣetra-jñāna-jñeya upasaṃhāra with madbhakta fully covered.',
    unresolved: [
      'xref: Printed (१३।५) disagrees with its quotation (KSTS 13.2, not 13.5): retained unresolved, no edge.',
      'Corrupt non-Devanagari extraction fragment after ‘महाभूतानि excluded as apparatus noise, never reconstructed.',
    ],
  },
  {
    ksts: '13.19', repoUnit: '13.20', vulgate: '13.20', pdf: 301, folio: 291,
    commentaryStart: 'यैषा ‘प्रकृतिः’ सप्तमेऽध्याये',
    commentaryEnd: 'तथा प्रतिपादयितुमाह (sāmānya bridge)',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.19-prakrti', 'gita-seg-13.19-anaditva', 'gita-seg-13.19-samanya'],
    passageIds: ['gita-tx-13.19-prakrti', 'gita-tx-13.19-anaditva', 'gita-tx-13.19-samanya'],
    remaining: 'Prakṛti-puruṣa recall, anāditva-tātparya and the prati-puruṣa bridge fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.20', repoUnit: '13.21', vulgate: '13.21', pdf: 301, folio: 291,
    commentaryStart: 'कार्य महाभूताद्यात्मकं',
    commentaryEnd: 'पुरुषस्य च विषयित्वव्यपदेशः',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.20-karya', 'gita-seg-13.20-prakrtihetu'],
    passageIds: ['gita-tx-13.20-karya', 'gita-tx-13.20-prakrtihetu'],
    remaining: 'Kārya-kāraṇa definition with prakṛti-hetu and puruṣa-bhoktṛ fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.21', repoUnit: '13.22', vulgate: '13.22', pdf: 302, folio: 292,
    commentaryStart: 'यस्मात् प्रकृतौ नानाकार्यकारणात्मकशरीरभावेन',
    commentaryEnd: 'संसारिता पुरुषस्येत्यर्थः',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, variant: true }),
    spanIds: ['gita-seg-13.21-gunasanga-a', 'gita-seg-13.21-gunasanga-b'],
    passageIds: ['gita-tx-13.21-gunasanga-a', 'gita-tx-13.21-gunasanga-b'],
    remaining: 'Prakṛti-stha/bhuṅkte with avivekaja sambandha and guṇasaṅga fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.22', repoUnit: '13.23', vulgate: '13.23', pdf: 302, folio: 292,
    commentaryStart: 'यतः परस्य तत्त्वस्य देहेऽस्मिन् (dvividhā transition)',
    commentaryEnd: 'ब्रह्मस्वरूपतया उच्यते (paramātman close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.22-dvividha', 'gita-seg-13.22-mahesvara', 'gita-seg-13.22-upadrastra', 'gita-seg-13.22-viveka'],
    passageIds: ['gita-tx-13.22-dvividha', 'gita-tx-13.22-mahesvara', 'gita-tx-13.22-upadrastra', 'gita-tx-13.22-viveka'],
    remaining: 'Dvividhā bridge, maheśvara sentence, upadraṣṭṛ triad and viveka-paramātman close fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.23', repoUnit: '13.24', vulgate: '13.24', pdf: 303, folio: 293,
    commentaryStart: 'एवं प्रकृतिपुरुषेश्वरविवेकलक्षणस्य ज्ञानस्य फलमाह',
    commentaryEnd: 'स्पष्टोऽर्थः (jñāna-dagdha close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, quotation: true }),
    spanIds: ['gita-seg-13.23-phala-intro', 'gita-seg-13.23-yogi'],
    passageIds: ['gita-tx-13.23-phala-intro', 'gita-tx-13.23-yogi'],
    remaining: 'Phala introduction and yaḥ-yogī gloss with the jñāna-dagdha quotation fully covered.',
    unresolved: ['xref: Jñāna-dagdha verse quotation (यथोक्त) without locator: retained in text as unresolved source evidence, no edge.'],
  },
  {
    ksts: '13.24', repoUnit: '13.25', vulgate: '13.25', pdf: 304, folio: 294,
    commentaryStart: 'केचित् सहजसिद्धतत्त्वज्ञाना',
    commentaryEnd: 'शमः कारणमुच्यते । (६।३)',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, crossReference: true, variant: true }),
    spanIds: ['gita-seg-13.24-dhyana', 'gita-seg-13.24-sankhya'],
    passageIds: ['gita-tx-13.24-dhyana', 'gita-tx-13.24-sankhya'],
    remaining: 'Sahaja-dhyāna parā-kāṣṭhā with sāṅkhya/yoga/karma-yoga stages fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.25', repoUnit: '13.26', vulgate: '13.26', pdf: 304, folio: 294,
    commentaryStart: 'कर्मयोगेनेति समुच्चयात्मकत्वेऽपि (gloss on printed p.295)',
    commentaryEnd: 'सत्यत्वेऽमृतमाहितम् (amṛta close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, quotation: true }),
    spanIds: ['gita-seg-13.25-samuccaya', 'gita-seg-13.25-sruta'],
    passageIds: ['gita-tx-13.25-samuccaya', 'gita-tx-13.25-sruta'],
    remaining: 'Samuccayātmakatva turn and śruta-upāsaka with satya/asatya fully covered; the Phase-7 समुच्चयात्मकत्व gap is closed.',
    unresolved: [
      'xref: Partial ārurukṣor quotation without printed locator: retained in text as unresolved source evidence, no edge.',
      'xref: Amṛta quotation (तथाचोक्तम्) without locator: retained in text as unresolved source evidence, no edge.',
    ],
  },
  {
    ksts: '13.26', repoUnit: '13.27', vulgate: '13.27', pdf: 305, folio: 295,
    commentaryStart: 'उक्तमेव अर्थ स्फुटतरं प्रतिपादयितुमा',
    commentaryEnd: 'सर्वक्षेत्रज्ञप्रतिपत्ति भ्रमनिवृत्तेरिति',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true }),
    spanIds: ['gita-seg-13.26-samyoga'],
    passageIds: ['gita-tx-13.26-samyoga'],
    remaining: 'Parisamāpti turn with the kṣetra-saṃyoga gloss fully covered in one bounded excerpt.',
    unresolved: [],
  },
  {
    ksts: '13.27', repoUnit: '13.28', vulgate: '13.28', pdf: 306, folio: 296,
    commentaryStart: 'योगी परमात्मनः स्वाभाविकैक्यदर्शनात्',
    commentaryEnd: 'स एवच आत्मवानिति',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true }),
    spanIds: ['gita-seg-13.27-sama', 'gita-seg-13.27-samapasya'],
    passageIds: ['gita-tx-13.27-sama', 'gita-tx-13.27-samapasya'],
    remaining: 'Sama introduction (local mūla between turn and gloss excluded) with the jñāna-cakṣuṣ close fully covered.',
    unresolved: ['त्याह extracted on its own line before योगी while भवती- ends the next line: joined as भवतीत्याह (extraction line-misorder, uncollated).'],
  },
  {
    ksts: '13.28', repoUnit: '13.29', vulgate: '13.29', pdf: 307, folio: 297,
    commentaryStart: 'यस्मात् यथोक्तेन प्रकारेण ‘सर्वत्र’ (gloss shared from printed p.296)',
    commentaryEnd: 'चौरेणात्मापहारिणा (anyathā close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, quotation: true, variant: true }),
    spanIds: ['gita-seg-13.28-atmahimsa'],
    passageIds: ['gita-tx-13.28-atmahimsa'],
    remaining: 'Ātma-ahiṃsā gloss with the anyathā quotation fully covered in one bounded excerpt.',
    unresolved: ['xref: Anyathā verse quotation (यथोक्त) without locator: retained in text as unresolved source evidence, no edge.'],
  },
  {
    ksts: '13.29', repoUnit: '13.30', vulgate: '13.30', pdf: 307, folio: 297,
    commentaryStart: 'प्रकृतिश्चेतनाचेतन विभागेन',
    commentaryEnd: 'कर्तृत्वं न वास्तवमिति तात्पर्यम्',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, crossReference: true, variant: true }),
    spanIds: ['gita-seg-13.29-prakrtya', 'gita-seg-13.29-akartra'],
    passageIds: ['gita-tx-13.29-prakrtya', 'gita-tx-13.29-akartra'],
    remaining: 'Prakṛti-dviprakārā with quotations and the akartṛ/māyā-mātra close fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.30', repoUnit: '13.31', vulgate: '13.31', pdf: 308, folio: 298,
    commentaryStart: 'इत्थंच स्थिते प्रकृतिपुरुषविवेकज्ञानादनन्तरं',
    commentaryEnd: 'तत्पृथक्त्वान्न भिद्यते (vipascit close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, quotation: true, variant: true }),
    spanIds: ['gita-seg-13.30-ekatva', 'gita-seg-13.30-vistara'],
    passageIds: ['gita-tx-13.30-ekatva', 'gita-tx-13.30-vistara'],
    remaining: 'Bhūta-ekastha with tata-eva-vistāra and the vipascit quotation fully covered.',
    unresolved: ['xref: Vipascit quotation (केनापि विपश्चिता) without locator: retained in text as unresolved source evidence, no edge.'],
  },
  {
    ksts: '13.31', repoUnit: '13.32', vulgate: '13.32', pdf: 309, folio: 299,
    commentaryStart: 'तदेवंविधस्य परमात्मनो बहुशोऽपि उक्तं लक्षणं',
    commentaryEnd: 'न कर्मफलसंयोग इति',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true, variant: true }),
    spanIds: ['gita-seg-13.31-avyaya-a', 'gita-seg-13.31-avyaya-b'],
    passageIds: ['gita-tx-13.31-avyaya-a', 'gita-tx-13.31-avyaya-b'],
    remaining: 'Ayaṃ-paramātmā with anāditva/nirguṇatva and the kṣetrajña contrast fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.32', repoUnit: '13.33', vulgate: '13.33', pdf: 310, folio: 300,
    commentaryStart: 'यथाच एतस्य सर्वशरीरस्थत्वेऽपि',
    commentaryEnd: 'तथा जीवाः सुखादिभिः (ghaṭākāśa close)',
    crossesPage: false, crossesVerseBoundary: false,
    contains: C({ gloss: true, quotation: true, variant: true }),
    spanIds: ['gita-seg-13.32-akasa'],
    passageIds: ['gita-tx-13.32-akasa'],
    remaining: 'Ākāśa-dṛṣṭānta with the ghaṭākāśa quotation fully covered in one bounded excerpt.',
    unresolved: ['xref: Ghaṭākāśa quotation (ब्रह्मविदा केनचित्) without locator: retained in text as unresolved source evidence, no edge.'],
  },
  {
    ksts: '13.33', repoUnit: '13.34', vulgate: '13.34', pdf: 311, folio: 301,
    commentaryStart: 'एवं सर्वात्मना कर्मफलसंपर्काभावेऽपि (gloss shared from printed p.300)',
    commentaryEnd: 'प्राक् प्रतिपादित्तमेव (janaka close)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true, variant: true }),
    spanIds: ['gita-seg-13.33-ravi', 'gita-seg-13.33-janaka'],
    passageIds: ['gita-tx-13.33-ravi', 'gita-tx-13.33-janaka'],
    remaining: 'Ravi-dṛṣṭānta with the kṣetrī-janakatva close fully covered.',
    unresolved: [],
  },
  {
    ksts: '13.34', repoUnit: '13.35', vulgate: '13.35', pdf: 311, folio: 301,
    commentaryStart: '‘ये’ योगिनः ‘एवं’ उक्तेन प्रकारेण',
    commentaryEnd: 'त्रयोदशोऽध्यायः ॥ १३ ॥ (colophon)',
    crossesPage: true, crossesVerseBoundary: false,
    contains: C({ gloss: true, summary: true, closing: true }),
    spanIds: ['gita-seg-13.34-synthesis', 'gita-seg-13.34-moksa', 'gita-seg-13.34-para', 'gita-seg-13.34-prasasti', 'gita-seg-13.34-closing'],
    passageIds: ['gita-tx-13.34-synthesis', 'gita-tx-13.34-moksa', 'gita-tx-13.34-para', 'gita-tx-13.34-prasasti'],
    remaining: 'Antara, bhūtaprakṛtimokṣa, para-gati and praśasti-colophon fully covered; the closing-apparatus span stays locator-only by design.',
    unresolved: ['Praśasti readings (भविभिरखि, प्रयोदशतः, सुतेवैचन) uncollated against page images; retained verbatim, never corrected.'],
  },
];

/** Row lookup by KSTS verse number (`13.1`–`13.34`). */
export function inventoryForKsts(ksts: string): Chapter13InventoryRow | undefined {
  return CHAPTER13_COMMENTARY_INVENTORY.find((r) => r.ksts === ksts);
}

export type Chapter13ApparatusKind = 'variant' | 'table-row' | 'folio-mark';

export interface Chapter13ApparatusItem {
  id: string;
  pdf: number;
  folio: number;
  /** Raw extracted string, verbatim (पु. never expanded; none observed in Chapter 13). */
  raw: string;
  /** Siglum as printed (`ख`, `क`, `क. ख.`, or null for fragments/marks). */
  siglum: string | null;
  kind: Chapter13ApparatusKind;
  /** Row-to-verse attribution: always ambiguous (call-marks lost in extraction). */
  attribution: 'ambiguous';
  status: 'mapped' | 'unresolved';
  note?: string;
}

/**
 * Chapter-13 apparatus inventory (Phase 8): every observed footnote,
 * variant-table row and folio fragment across printed pp.276–302,
 * recorded at page level with verbatim strings. Nothing is attached to
 * a verse: attribution stays ambiguous until page-image collation.
 */
export const CHAPTER13_APPARATUS: Chapter13ApparatusItem[] = [
  { id: 'gita-app-13-286-1', pdf: 286, folio: 276, raw: '१ ‘प्रतिपादित’ क. पाठः ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-287-1', pdf: 287, folio: 277, raw: '१ ‘वेत्ति’ ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-287-2', pdf: 287, folio: 277, raw: '२ ‘संमृतानां’ ख. पाठान्तरम् ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-287-3', pdf: 287, folio: 277, raw: '३ ‘अवगन्तव्यः’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-288-1', pdf: 288, folio: 278, raw: '१ ‘खज्ञानस्य’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-288-2', pdf: 288, folio: 278, raw: '२ ‘दचिन्त्येश्वर्यमाया’ क. पाठः ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-289-1', pdf: 289, folio: 279, raw: '१ ‘यत् प्रभावश्व’ क. पाठः ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-289-2', pdf: 289, folio: 279, raw: '२ ‘तज्ज्ञः तयोर्मन्य’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-289-3', pdf: 289, folio: 279, raw: 'ख. पाठः । ३ ‘खरूप', siglum: null, kind: 'variant', attribution: 'ambiguous', status: 'unresolved', note: 'Truncated fragment; item number and reading incomplete in extraction.' },
  { id: 'gita-app-13-290-1', pdf: 290, folio: 280, raw: '१ ‘विकृति’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-290-2', pdf: 290, folio: 280, raw: '२ ‘त्वात्’ ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-291-1', pdf: 291, folio: 281, raw: '३६ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-13-292-1', pdf: 292, folio: 282, raw: '१ ‘निष्ठत्वं’ क. ख. ।', siglum: 'क. ख.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-293-1', pdf: 293, folio: 283, raw: '१ ‘मित्यर्थः’ क. पाठः ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-293-2', pdf: 293, folio: 283, raw: '२ ‘प्रयुक्तस्य’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-294-1', pdf: 294, folio: 284, raw: '१ ‘मित्रं समस्तवादिना’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-295-1', pdf: 295, folio: 285, raw: '१ ‘ समासादनात्स’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-295-2', pdf: 295, folio: 285, raw: '२ ‘ष’ ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-296-1', pdf: 296, folio: 286, raw: '१ ‘गुहादिदेशस्य’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-297-1', pdf: 297, folio: 287, raw: '१ ‘न एतन्नास’ क. पाठः ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-297-2', pdf: 297, folio: 287, raw: '२ ‘चस्थितम्’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-298-1', pdf: 298, folio: 288, raw: '१ ‘यत् तत्’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-298-2', pdf: 298, folio: 288, raw: '२ ‘तच ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-298-3', pdf: 298, folio: 288, raw: '३ ‘तस्यैव’ ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-299-1', pdf: 299, folio: 289, raw: '१ ‘कं तत्त्वं ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-299-2', pdf: 299, folio: 289, raw: '३७ भग०', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-13-300-1', pdf: 300, folio: 290, raw: '१ ‘प्रकाशरूपत्वात्’ क. ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-300-2', pdf: 300, folio: 290, raw: '२ ‘तत्त्वं’ ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-302-1', pdf: 302, folio: 292, raw: '१. संभूतान्’ ख. पाठः', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-303-1', pdf: 303, folio: 293, raw: '१ ‘वा’ क. ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-304-1', pdf: 304, folio: 294, raw: '१ ‘चैव’ ख. पाठः ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-307-1', pdf: 307, folio: 297, raw: '१ ‘सन्तमेवाभासम्’ क.', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-307-2', pdf: 307, folio: 297, raw: '२ ‘शात् क्षेत्र’ क. ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-307-3', pdf: 307, folio: 297, raw: '३८ भग', siglum: null, kind: 'folio-mark', attribution: 'ambiguous', status: 'unresolved', note: 'Folio/signature fragment, not a reading.' },
  { id: 'gita-app-13-308-1', pdf: 308, folio: 298, raw: '१ ‘आत्मनस्तत्त्व’ क.', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-309-1', pdf: 309, folio: 299, raw: '१ ‘तीत्यर्थः’ क. ख.', siglum: 'क. ख.', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-310-1', pdf: 310, folio: 300, raw: '१ ‘व्यवस्थितः ख. ।', siglum: 'ख', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-310-2', pdf: 310, folio: 300, raw: '२ ‘कधर्म’ क. ।', siglum: 'क', kind: 'variant', attribution: 'ambiguous', status: 'unresolved' },
  { id: 'gita-app-13-table-1', pdf: 417, folio: 407, raw: '१३ 9 क्षेत्रज्ञमिति क्षेत्रज्ञ इति', siglum: null, kind: 'table-row', attribution: 'ambiguous', status: 'unresolved', note: 'Variant-table row (PDF batch p.417): śloka numbers do not transparently align with either numbering, so verse attribution stays guesswork.' },
];

/** Apparatus counts (no scores): observed, mapped, unresolved. */
export function apparatusCounts(items: Chapter13ApparatusItem[] = CHAPTER13_APPARATUS): {
  observed: number;
  mapped: number;
  unresolved: number;
} {
  return {
    observed: items.length,
    mapped: items.filter((i) => i.status === 'mapped').length,
    unresolved: items.filter((i) => i.status === 'unresolved').length,
  };
}

/** Coverage gaps: repository units without transcribed source text. */
export function chapter13CoverageGaps(
  rows: Chapter13InventoryRow[] = CHAPTER13_COMMENTARY_INVENTORY,
): string[] {
  return rows.filter((r) => r.passageIds.length === 0).map((r) => r.repoUnit);
}

/** Structured validation for the inventory (tests + future build gate). */
export function validateChapter13Inventory(
  rows: Chapter13InventoryRow[] = CHAPTER13_COMMENTARY_INVENTORY,
  apparatus: Chapter13ApparatusItem[] = CHAPTER13_APPARATUS,
): string[] {
  const errors: string[] = [];
  const knownSpans = new Set(GITA_PASSAGE_SPANS.map((s) => s.id));
  const knownPassages = new Map(GITA_COMMENTARY_TEXTS.map((p) => [p.id, p]));
  if (rows.length !== 34) errors.push(`inventory must cover 34 KSTS verses, found ${rows.length}`);
  const seenKsts = new Set<string>();
  for (const row of rows) {
    if (seenKsts.has(row.ksts)) errors.push(`duplicate inventory KSTS ${row.ksts}`);
    seenKsts.add(row.ksts);
    if (!parseGitaVerseRef(row.ksts)) errors.push(`${row.ksts}: invalid KSTS ref`);
    if (row.folio !== row.pdf - 10) errors.push(`${row.ksts}: folio ${row.folio} is not pdf ${row.pdf} minus 10`);
    for (const sid of row.spanIds) {
      if (!knownSpans.has(sid)) errors.push(`${row.ksts}: dangling span ${sid}`);
    }
    for (const pid of row.passageIds) {
      const passage = knownPassages.get(pid);
      if (!passage) {
        errors.push(`${row.ksts}: dangling passage ${pid}`);
        continue;
      }
      if (passage.spanId !== undefined && !row.spanIds.includes(passage.spanId)) {
        errors.push(`${row.ksts}: passage ${pid} span ${passage.spanId} not in row spans`);
      }
      for (const ref of passage.ksts || []) {
        if (!parseGitaVerseRef(ref)) errors.push(`${row.ksts}: passage ${pid} invalid KSTS ref ${ref}`);
      }
    }
  }
  // No orphan Chapter-13 spans or passages: every record must be claimed.
  // Chapter-opening avataraṇikā matter carries no KSTS number by nature
  // (gita-ps-13-avat / gita-tx-13-avat) and is exempt: it is chapter-level,
  // not verse-level, evidence (covered by the span/passage tables’ own tests).
  const claimedSpans = new Set(rows.flatMap((r) => r.spanIds));
  const claimedPassages = new Set(rows.flatMap((r) => r.passageIds));
  for (const span of GITA_PASSAGE_SPANS) {
    if (!span.unitIds.some((u) => u.startsWith('13.'))) continue;
    if (span.ksts.length === 0) continue;
    if (!claimedSpans.has(span.id)) errors.push(`orphan Chapter-13 span ${span.id}`);
  }
  for (const passage of GITA_COMMENTARY_TEXTS) {
    if (!passage.unitIds.some((u) => u.startsWith('13.'))) continue;
    if ((passage.ksts || []).length === 0) continue;
    if (!claimedPassages.has(passage.id)) errors.push(`orphan Chapter-13 passage ${passage.id}`);
  }
  const seenApp = new Set<string>();
  for (const item of apparatus) {
    if (seenApp.has(item.id)) errors.push(`duplicate apparatus id ${item.id}`);
    seenApp.add(item.id);
    // Attribution is typed `ambiguous`: an apparatus item can never
    // silently acquire determinate verse attribution (tested below).
    if (item.attribution !== 'ambiguous') {
      errors.push(`${item.id}: apparatus attribution must stay ambiguous without collation`);
    }
    if (item.status !== 'mapped' && item.status !== 'unresolved') {
      errors.push(`${item.id}: unknown apparatus status`);
    }
  }
  return errors;
}
