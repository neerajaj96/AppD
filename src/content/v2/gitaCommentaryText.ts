import { parseGitaVerseRef } from './gitaDocument';

/**
 * Rāmakaṇṭha commentary passages (Phase 6 pilot: eleven bounded excerpts).
 *
 * Transcription policy (see docs/scholarly/bhagavad-gita-ramakantha-source-text.md):
 * - Source: the inspected file's text layer (`Gitasarvatobhadrarajanka.pdf`,
 *   Drive ID 10InuCi5WpCHkDWzT3_iZcybksGDs4_so), human-reviewed token by
 *   token against extraction in this session. NOT collated against page
 *   images — recorded as a limitation, not hidden.
 * - Joined only unambiguous end-of-line hyphens (print layout, not
 *   content); stripped zero-width format chars (U+200C/200D/FEFF).
 * - Retained verbatim: spaces, variant spellings (गुणमय, सेवे-class),
 *   punctuation, quote glyphs, dandas. Footnotes and running heads
 *   excluded (apparatus lives elsewhere).
 * - Mūla verses excluded even inside gloss flow (root-text import is a
 *   separate future phase).
 * - `[?]` marks unresolvable readings inline, each documented in `note`.
 *   `लक्ष[ण]` brackets supply a single dropped akṣara where grammar
 *   admits exactly one reading (standard diplomatic supply).
 * - No field for normalized text exists by design: diplomatic text is
 *   never overwritten, and normalization was not justified.
 */

export type PassageStatus = 'verified-source' | 'extraction-unreviewed' | 'partially-verified';

export interface GitaCommentaryText {
  id: string;
  /** Passage span, when the evidence sits in a demarcated region. */
  spanId?: string;
  /** Canonical units the passage belongs to. */
  unitIds: string[];
  /** KSTS refs, fully qualified. */
  ksts: string[];
  pdf: number;
  folio: number;
  sourceId: string;
  /** Diplomatic transcription (Devanagari only — enforced). */
  text: string;
  status: PassageStatus;
  /** Boundaries, anomalies, [?] keys — required wherever [?] appears. */
  note?: string;
}

export const KSTS_SOURCE_ID = 'bhagavad-gita-source-ksts-64';

export const GITA_COMMENTARY_TEXTS: GitaCommentaryText[] = [
  {
    id: 'gita-tx-13.1-glosa',
    spanId: 'gita-seg-13.1-glosa',
    unitIds: ['13.2'],
    ksts: ['13.1'],
    pdf: 287,
    folio: 277,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: '‘इदं’ सर्वप्रमातृप्रसिद्धतया व्यवस्थितं ‘शरीर’ देहः क्षेत्रसाधर्म्यात् ‘क्षेत्रमिति’ उच्यते क्षेत्रसंज्ञया कथ्यते । यथा कुसूलादिगतानां धान्यादिबीजानां मूलस्तम्बशाखाशिलादिविशेषप्रसवाभिव्यक्त्यधिकरणः पृथिव्युद्देशः क्षेत्रमित्युच्यते, तथा कर्माशयसंभूतानां कर्मणां जात्यायुर्भोगलक्षणविपाकविशेषाभिव्यक्त्यधिकरणभूतं शरीरमपि इदं क्षेत्रमिति उच्यते । तेन तत्कर्मविपाकास्पदत्वेन यदनुभूयते, तत् शरीरमिति वेदितव्यम् ।',
    note: 'Bounded: gloss opening through the śarīra conclusion (excludes following etat-gloss). Hyphens joined: क्षेत्रसा-धर्म्यात्, कुसूला-दिगतानां, प्रसवा-भिव्यक्ति, कर्मा-शय, विपाका-स्पदत्वेन.',
  },
  {
    id: 'gita-tx-13.2-nanu',
    spanId: 'gita-ps-13.2-nanu',
    unitIds: ['13.2', '13.3'],
    ksts: ['13.1', '13.2'],
    pdf: 287,
    folio: 277,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'ननु परमार्थत एक एव प्रमाता प्रतिपादितः । प्रतिक्षेत्रं च पृथक्पृथक् वेदकप्रतीतिरबाधिता व्यवस्थिता, इति स्वसिद्धान्तविरोधभ्रान्तिं परिहर्तुमाह -',
    note: 'Bounded: objection through the introducing parihartum (verse excluded: mūla import is separate). Hyphen joined: स्वसिद्धान्त-विरोध.',
  },
  {
    id: 'gita-tx-13.2-resolution',
    spanId: 'gita-seg-13.2-resolution',
    unitIds: ['13.3'],
    ksts: ['13.2'],
    pdf: 288,
    folio: 278,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'इह वेदकत्वमात्रमेकमव्यभिचारि असाधारणमात्मनो लक्षणमुक्तम् । अतः परस्परभिन्नानां क्षणिकनानावस्थाजुषां वेद्यानां शरीराणामेव भिन्नरूपत्वं व्यवस्थितम् । न तु वेदकत्वमात्रतयैव तदधिष्ठायकत्वेन व्यवस्थितस्य पारमार्थिकस्य एकस्य वेदकस्य आत्मनो नानात्वमस्ति सर्वदेहगतत्वेऽपि वेदकैकलक्षणाव्यभिचारात् । या तु प्रतिशरीरं जात्यवच्छेदेन पृथक् प्रतिपत्तिः, तदचिन्त्येश्वरमायाशक्तिविलसितमेव । अतस्तयुदासार्थमेव[?] च अयमुपदेशः प्रबुद्धान्प्रति अर्जुनमुखेन उच्यते ।',
    note: 'Bounded: resolution gloss through the address close. ZWNJ stripped (तदधिष्ठायकत्वेन); hyphen joined (वेदकैकलक्षणाव्यभिचा-रात्, अचिन्त्येश्व-रमायाशक्ति). [?]: अतस्तयुदासार्थमेव retained verbatim (print possibly तदुदासार्थम्); लक्ष[ण] supplies one dropped akṣara (लक्षणमुक्तम् admits no other reading).',
  },
  {
    id: 'gita-tx-2.39-tail',
    spanId: 'gita-seg-2.39-tail',
    unitIds: ['2.38'],
    ksts: ['2.39'],
    pdf: 48,
    folio: 38,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'एवं ज्ञानक्रियासमुच्चयमेव उपदेश्यतया विनिश्चित्य, ज्ञानविषयां मतिमुक्तकल्पां[?] मत्वा, तां क्रियाविषयां वक्तमुपक्रममाणस्त एव ज्ञानकर्मणी सांख्ययोगशब्दाभ्यां व्यवहरन्नाह',
    note: 'Bounded: closing sentence before KSTS 2.40 verse (mūla excluded). Hyphen joined (उपक्रममा-णस्त). [?]: मतिमुक्तकल्पां retained verbatim (spacing uncertain).',
  },
  {
    id: 'gita-tx-3-avat',
    spanId: 'gita-ps-3-avat',
    unitIds: ['3.1'],
    ksts: [],
    pdf: 71,
    folio: 61,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'अथ तृतीयोऽध्यायः । अथ ज्ञानस्य कर्मणश्च भगवद्भाषितानि पृथक् प्रशंसावचनानि अनुविमृशन् सम्यक् समुच्चयार्थमनवधार्य किमेतयोरुपादेयतरं स्यादिति संशयानो भगवन्तमर्जुन उवाच',
    note: 'Bounded: chapter opening through the speaker label (verses excluded). Hyphen joined (प्रशंसावच-नानि).',
  },
  {
    id: 'gita-tx-4-avat',
    spanId: 'gita-ps-4-avat',
    unitIds: ['4.1'],
    ksts: [],
    pdf: 102,
    folio: 92,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'अथ चतुर्थोऽध्यायः । एवमस्य समस्ताध्यात्मशास्त्रसर्वस्वभूतार्थगर्भस्य प्रकरणस्य ज्ञानकर्मसमुच्चयलक्षणमभिधेयं परमात्मसमापत्तिलक्षणं च प्रयोजनं प्रतिपाद्य इदानीं सम्बन्धविषययोः प्रतिपादनद्वारेण अर्जुनस्य आत्मनि पुरुषत्वमात्रप्रतिपत्तिव्यामोहनिवृत्तये परमकारणतामाविष्कुर्वन् भगवानुवाच',
    note: 'Bounded: chapter opening through the speaker label (verses excluded). Hyphen joined (प्रयो-जनं, अर्जु-नस्य).',
  },
  {
    id: 'gita-tx-5.3-sent',
    unitIds: ['5.3'],
    ksts: ['5.3'],
    pdf: 127,
    folio: 117,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'समुच्चयानुष्ठाता कुर्वन्नपि कर्माणि नित्यं संन्यासी सदात्यक्तकर्मा बोद्धव्यः ।',
    note: 'Bounded: single sentence in the 5.3 gloss (no print-demarcated sub-span; unit-level evidence). Hyphen joined (सदात्यक्त-कर्मा).',
  },
  {
    id: 'gita-tx-7.14-def',
    unitIds: ['7.14'],
    ksts: ['7.14'],
    pdf: 175,
    folio: 165,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: '‘एषा हि गुणमय देवी साया[?]’ इत्थं देवनात् क्रीडनात् देवस्य सतो मम संबन्धिनी असती अपि सत्यवदाभासयन्ती मदीया शक्तिः ।',
    note: 'Bounded: definition core (excludes following parā-śakti elaboration). [?]: साया retained verbatim (print likely माया); गुणमय retained verbatim (gloss spelling against verse गुणमयी).',
  },
  {
    id: 'gita-tx-7.14-q2',
    spanId: 'gita-seg-7.14-q2',
    unitIds: ['7.14'],
    ksts: ['7.14'],
    pdf: 176,
    folio: 166,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'ननु यथेवेमेषा न केनचिदन्यथाकर्तुं पार्यते, तत् सर्वथा संसारविभ्रमानुपरमे प्रसक्ते निरर्थक एव अयमपवर्गमार्गाप्युपायोपदेश इति ।',
    note: 'Bounded: objection through its close (response excluded). Hyphen joined (संसार-विभ्रम).',
  },
  {
    id: 'gita-tx-7.14-resp',
    spanId: 'gita-seg-7.14-response',
    unitIds: ['7.14'],
    ksts: ['7.14'],
    pdf: 176,
    folio: 166,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: 'अत्र आह ‘मामेव’ एकं यथोक्तस्वरूपं परमेश्वरं परमात्मानं मदनुप्रद्देच्छाबोधिताः[?] सन्तो ‘ये प्रपद्यन्ते’ मदभेदपर्यवसायिना यथोक्तेन ज्ञानेन समाश्रयन्ते, ‘ते’ एनां ‘अतितरन्ति’ अतिक्रामन्ति ।',
    note: 'Bounded: response through the crossing close (prabhākara simile excluded). [?]: मदनुप्रद्दे retained verbatim (possibly मदनुग्रहेच्छा). Spaces retained (padaccheda may be print’s own).',
  },
  {
    id: 'gita-tx-18.61-maya',
    spanId: 'gita-ps-18.61-maya',
    unitIds: ['18.61'],
    ksts: ['18.61'],
    pdf: 406,
    folio: 396,
    sourceId: KSTS_SOURCE_ID,
    status: 'verified-source',
    text: '‘एष’ प्रबन्धतः पुनः पुनः प्रतिपादित ‘ईश्वरः’ परमात्मा सर्वभूतानां समस्तप्राणिनां ‘हृदि’ हृदये सर्वसंविद्धिकरणभूते देशे ‘वसति’ नित्यं प्रतिष्ठति । किं कुर्वन् । यत् किञ्चिदेषां सर्वभूतानां ज्ञानात्मकं क्रियात्मकं वा परिस्पन्दितं, तत् सर्व स एव एकः परमार्थतः कुर्वन्नपि मायाशक्त्यवभासित परस्पर विभिन्ननानारूपाणि तानि ‘सर्वभूतानि’ प्रत्येकमहंकरोमीति सिध्याभिमाननिवेशनेन ‘भ्रामयन्’ व्यामोहयन् ।',
    note: 'Bounded: gloss core through the bhrāmayan close (कथमिव-question excluded). Hyphens joined (प्रत्येकम-हंकरोमीति, सिध्या-भिमान); quote-glyph mix ("सर्वभूतानां’) retained as extraction noise class; spaces retained.',
  },
];

/** Devanagari source text plus print punctuation, digits, brackets and whitespace. */
const SOURCE_SCRIPT = /^[\u0900-\u097F\s\d।॥‘’'"()\[\]?.,;:\-–—]+$/;

/** True when a string is plausible diplomatic transcription (never prose). */
export function isSourceTranscription(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    /[\u0900-\u097F]/.test(value) &&
    SOURCE_SCRIPT.test(value) &&
    !/[a-zA-Z]/.test(value)
  );
}

/** Structured validation for passage records (tests + future build gate). */
export function validatePassages(records: GitaCommentaryText[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.id || !record.id.trim()) {
      errors.push('passage without id');
      continue;
    }
    if (seen.has(record.id)) errors.push(`duplicate passage id ${record.id}`);
    seen.add(record.id);
    if (!['verified-source', 'extraction-unreviewed', 'partially-verified'].includes(record.status)) {
      errors.push(`${record.id}: unknown status ${String(record.status)}`);
    }
    if (!record.sourceId || !record.sourceId.trim()) {
      errors.push(`${record.id}: missing source record`);
    }
    if (!Number.isInteger(record.pdf) || !Number.isInteger(record.folio)) {
      errors.push(`${record.id}: missing integer pdf/folio`);
    }
    if (!record.text || !isSourceTranscription(record.text)) {
      errors.push(`${record.id}: text absent or not Devanagari source transcription`);
    }
    if (record.text.includes('[?]') && !(record.note || '').trim()) {
      errors.push(`${record.id}: uncertainty markers without documenting note`);
    }
    if (!record.unitIds || record.unitIds.length === 0) {
      errors.push(`${record.id}: no canonical units`);
    }
    for (const ref of record.ksts || []) {
      if (!parseGitaVerseRef(ref)) errors.push(`${record.id}: invalid KSTS ref ${ref}`);
    }
  }
  return errors;
}

export function passageById(id: string): GitaCommentaryText | undefined {
  return GITA_COMMENTARY_TEXTS.find((p) => p.id === id);
}

/** Passages evidencing one span (a span may carry several excerpts). */
export function passagesForSpan(spanId: string): GitaCommentaryText[] {
  return GITA_COMMENTARY_TEXTS.filter((p) => p.spanId === spanId);
}
