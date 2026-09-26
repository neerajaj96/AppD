# Bhagavad Gītā Chapter 13 Rāmakaṇṭha Critical Scholarly Edition (Phases 7–8)

The first complete, deeply evidenced Rāmakaṇṭha scholarly chapter. Chapter 13
becomes the reference implementation for the rest of the Gītā. Categories
**[SOURCE]** / **[EDITORIAL]** / **[UNRESOLVED]** follow the earlier documents.
Indian English throughout.

## 1. Source identity

**[SOURCE]** Kashmir Series of Texts and Studies No. LXIV (1943):
Bhagavadgītā with Sarvatobhadra of Rājānaka Rāmakaṇṭha, ed. Madhusudan Kaul
Shastri. Inspected file `Gitasarvatobhadrarajanka.pdf` (Drive ID
`10InuCi5WpCHkDWzT3_iZcybksGDs4_so`), held outside the workspace at
`/tmp/opencode/`. Nothing in `src/`, `public/` or `docs/` is derived by
re-running against that file at build time — the committed passages are the
reviewed artefact, not a build output.

**[SOURCE]** The file carries a born-digital text layer (not scanned images):
extraction used page text, one file per PDF page. No OCR software was involved.
Printed introduction pp. 2–9 remain absent from the file (Phase-1 limitation,
unchanged).

**[EDITORIAL]** Source record: `bhagavad-gita-source-ksts-64`
(`src/content/v2/curatedSources.ts`), role `primary-text`.

## 2. KSTS mapping

**[SOURCE]** KSTS Chapter 13 has 34 numbered verses (13.1–13.34); its 13.1 is
`इदं शरीरं कौन्तेय` (running head `१३।१]`, PDF p. 287). The vulgate 13.1
(Arjuna's question) occurs nowhere as a numbered verse in this file.

**[SOURCE]** Repository concordance (`src/content/v2/gitaPageMap.ts`):

| Repo | KSTS | PDF | Folio | Status |
|---|---|---|---|---|
| 13.1 | — | — | — | vulgate-only (Arjuna question; absent from KSTS numbering, verified) |
| 13.2 | 13.1 | 287 | 277 | offset (KSTS numbering runs one below vulgate) |
| 13.3 | 13.2 | 288 | 278 | offset |
| 13.4 | 13.3 | 289 | 279 | offset |
| 13.5 | 13.4 | 289 | 279 | offset |
| 13.6 | 13.5 | 290 | 280 | offset |
| 13.7 | 13.6 | 290 | 280 | offset |
| 13.8 | 13.7 | 292 | 282 | offset |
| 13.9 | 13.8 | 292 | 282 | offset |
| 13.10 | 13.9 | 292 | 282 | offset |
| 13.11 | 13.10 | 292 | 282 | offset |
| 13.12 | 13.11 | 292 | 282 | offset |
| 13.13 | 13.12 | 297 | 287 | offset |
| 13.14 | 13.13 | 297 | 287 | offset |
| 13.15 | 13.14 | 297 | 287 | offset |
| 13.16 | 13.15 | 297 | 287 | offset |
| 13.17 | 13.16 | 297 | 287 | offset |
| 13.18 | 13.17 | 297 | 287 | offset |
| 13.19 | 13.18 | 300 | 290 | offset |
| 13.20 | 13.19 | 301 | 291 | offset |
| 13.21 | 13.20 | 301 | 291 | offset |
| 13.22 | 13.21 | 302 | 292 | offset |
| 13.23 | 13.22 | 302 | 292 | offset |
| 13.24 | 13.23 | 303 | 293 | offset |
| 13.25 | 13.24 | 304 | 294 | offset |
| 13.26 | 13.25 | 304 | 294 | offset |
| 13.27 | 13.26 | 305 | 295 | offset |
| 13.28 | 13.27 | 306 | 296 | offset |
| 13.29 | 13.28 | 306 | 296 | offset |
| 13.30 | 13.29 | 307 | 297 | offset |
| 13.31 | 13.30 | 308 | 298 | offset |
| 13.32 | 13.31 | 309 | 299 | offset |
| 13.33 | 13.32 | 310 | 300 | offset |
| 13.34 | 13.33 | 310 | 300 | offset |
| 13.35 | 13.34 | 311 | 301 | offset |

**[EDITORIAL]** No old “Kashmir-only” inversion returns: repo 13.1 is
vulgate-only (question absent from KSTS), never “Kashmir's extra”. Legacy
IDs and URLs remain stable (`13.N`, thread-step URLs, citations).

## 3. Folio and page mapping

**[SOURCE]** Printed folio = PDF page − 10 across pp. 11–431 (Phase-1
validated). Chapter 13 spans PDF pp. 286–312 (printed 276–302).

**[EDITORIAL]** Three systems never confused: PDF page (file position),
printed folio (citation), page-map folio (verse anchor, may differ from
passage folio where a tail runs on, e.g. KSTS 13.6 gloss tail on p. 281,
KSTS 13.11 tail on p. 286, KSTS 13.22 tail on p. 293).

## 4. Transcription policy

**[SOURCE]** Diplomatic text only, as Phase 6 with Phase-7 explicit
verification levels:

- Devanagari as extracted, spaces and variant spellings retained.
- Joined solely unambiguous end-of-line hyphens (print layout, not content);
  stripped zero-width format characters.
- Mūla verses excluded even inside gloss flow (root-text import is a separate
  future phase); footnotes, running heads and folio fragments excluded
  (apparatus lives elsewhere).
- `[?]` marks unresolvable readings inline, each documented in the record
  `note`. No `[?]` was needed for the eleven new Chapter-13 excerpts except
  where noted (ahakāra/ahaṅkāra, spaces).
- Never fixed from memory, never normalised, never translated here.
- No `normalizedText` column exists; a test fails the build if one appears.

**[UNRESOLVED]** Extraction caveats from Phase 1 persist and are not mistaken
for data: dental conjuncts occasionally confused (e.g. `प्रयोदश` for
`त्रयोदश` — avoided by selecting excerpts without that token); footnotes
frequently merge into body lines (excluded); `अहकार` for expected `अहङ्कार`
retained verbatim where printed (ṅ may be extraction loss; uncollated).

## 5. Verification states

**[SOURCE]** Phase-6 records use `verified-source`, which means
text-layer-reviewed, never page-image-collated. The claim was explicitly
recorded as “human-reviewed but not collated against page images” and is not
silently upgraded.

**[SOURCE]** Phase-7 Chapter-13 records use the explicit
`text-layer-reviewed` status. Page images were unavailable, so every new block
remains at `text-layer-reviewed`. No record claims `page-image-collated` or
`partially-collated`; tests enforce the absence.

**[EDITORIAL]** `locator-only` is not a passage status but a unit state: a
Chapter-13 unit with a KSTS locator and optional segment, but no transcribed
passage. Locator-only stays locator-only no matter how beautifully the UI
renders it (critical invariant, tested).

## 6. Commentary segmentation

**[SOURCE]** Twenty-three passage spans (eleven Phase-6 + twelve Phase-7).
Every `source` span names its boundary evidence in `note`. Roles use the
print-supported vocabulary only (`gloss`, `objection`, `response`); unmarked
prose stays unmarked (generic `commentary`).

Chapter-13 spans (new):

| Span | Units | KSTS | PDF/Folio | Anchor/Role | Passage |
|---|---|---|---|---|---|
| gita-ps-13-avat | 13.2 | — | 286/276 | avataraṇikā | gita-tx-13-avat |
| gita-seg-13.1-glosa | 13.2 | 13.1 | 287/277 | commentary/gloss | gita-tx-13.1-glosa |
| gita-ps-13.2-nanu | 13.2,13.3 | 13.1,13.2 | 287/277 | commentary-tail/objection | gita-tx-13.2-nanu |
| gita-seg-13.2-verse | 13.3 | 13.2 | 288/278 | commentary | — (verse introduction; mūla excluded) |
| gita-seg-13.2-resolution | 13.3 | 13.2 | 288/278 | commentary | gita-tx-13.2-resolution |
| gita-seg-13.3-gloss | 13.4 | 13.3 | 289/279 | commentary/gloss | gita-tx-13.3-gloss |
| gita-seg-13.5-gloss | 13.6 | 13.5 | 290/280 | commentary/gloss | gita-tx-13.5-gloss |
| gita-seg-13.6-iccha | 13.7 | 13.6 | 291/281 | commentary/gloss | gita-tx-13.6-iccha |
| gita-seg-13.11-ajnana | 13.12 | 13.11 | 296/286 | commentary/gloss | gita-tx-13.11-ajnana |
| gita-seg-13.12-jneya-resp | 13.13 | 13.12 | 297/287 | commentary/response | gita-tx-13.12-jneya-resp |
| gita-seg-13.12-anadi | 13.13 | 13.12 | 298/288 | commentary/gloss | gita-tx-13.12-anadi |
| gita-seg-13.19-prakrti | 13.20 | 13.19 | 301/291 | commentary/gloss | gita-tx-13.19-prakrti |
| gita-seg-13.20-karya | 13.21 | 13.20 | 301/291 | commentary/gloss | gita-tx-13.20-karya |
| gita-seg-13.22-mahesvara | 13.23 | 13.22 | 303/293 | commentary/gloss | gita-tx-13.22-mahesvara |
| gita-seg-13.34-synthesis | 13.35 | 13.34 | 311/301 | commentary/gloss | gita-tx-13.34-synthesis |
| gita-seg-13.34-closing | 13.35 | 13.34 | 312/302 | closing | — (locator-only closing apparatus) |

**[EDITORIAL]** No span carries transcription (enforced by test);
transcription lives only in `gitaCommentaryText.ts` passages. Unit chunks
never carry transcription (verified by test); components never import the data
module (verified by test).

## 7. Commentary sequence (Blocks A–E)

Boundaries follow the actual source (verse markers, nanu/atrāha, chapter
opening/closing). Exact boundaries are in span `note` fields; mūla verses are
never in transcription fields.

- **Block A (opening / 13.1–13.3):** chapter gateway purpose (avat) →
  śarīra-kṣetra gloss (13.1) → nanu objection (one vs many knowers) → mūla
  reference (KSTS 13.2, excluded) → vedakatvamātra distinction + māyāśakti
  ground (resolution). Strongest area; fully connected to kṣetra,
  kṣetrajña, vedaka, jñāna, puruṣa, prakṛti, māyāśakti.
- **Block B (13.4 onward, enumeration):** tat-kṣetra vikāri gloss (13.3) →
  mahābhūtādi saṅgraha (13.5) → icchā-ādi as kṣetra (13.6 tail).
- **Block C (jñeya):** ajñāna close of the virtue exposition (13.11) →
  satyam response on jñeya-upacāra (13.12) → anādimat definition (13.12).
  The full nanu question wording on ananya-saṃvedya remains untranscribed
  (noisy extraction); the response is transcribed, the objection retained as
  `unresolved` argument (see §9).
- **Block D (prakṛti–puruṣa):** anādi recall (13.19) → kārya-kāraṇa definition
  (13.20) → maheśvara consequence (13.22, tail p. 293).
- **Block E (synthesis + closing):** antara synthesis (13.34) → closing
  apparatus (authorial praśasti + colophon, p. 302, locator-only by design).

**[UNRESOLVED]** Undifferentiated gloss prose between these bounded excerpts
remains untranscribed (e.g. etat-gloss after 13.1, ṣoḍaśaka elaboration,
bhūtaprakṛtimokṣa close, jñāna-cakṣuṣā sentence). Absence of transcription is
not evidence commentary does not exist; the edition prints full commentary for
every covered verse.

## 8. Concepts

Strengthened existing concepts first; no new concepts created (mass generation
explicitly deferred).

**[SOURCE]** New exact-text occurrences (all `relation: commentary`, with
`spanId` + folio):

- Puruṣa: 13.20 (`पुरुषः`, prakṛti recall), 13.23 (`पुरुष`, maheśvara gloss).
- Prakṛti: 13.4 (`क्षेत्र`, vikāri), 13.6 (`क्षेत्र`, saṅgraha), 13.7
  (`क्षेत्र`, icchā-ādi), 13.20 (`प्रकृतिः`, anādi recall), 13.35 (`प्रकृति`,
  antara synthesis).
- Māyā: 13.23 (`माया`, svamāyodbhāvita).
- Jñāna: 13.12 (`ज्ञान`, ajñāna close), 13.13 (`ज्ञान`, jñeya response).

**[EDITORIAL]** Candidate evaluation (Phase-3 ontology rules: attested term,
philosophical engagement, recurrence or structural weight, commentary
evidence, source-locatability, concept-vs-occurrence judgement):

| Candidate | Verdict | Reason |
|---|---|---|
| kṣetra | Deferred (occurrence status) | Genuinely attested and recurrent, but functions as prakṛti's field-aspect throughout Ch. 13; retained as `क्षेत्र` source term inside Prakṛti rather than a separate concept. Revisit if cross-chapter exposition diverges. |
| kṣetrajña | Deferred (occurrence status) | Attested (13.2–13.3, 13.34–13.35) and philosophically engaged, but consistently the puruṣa-as-knower role; retained as `क्षेत्रज्ञ` term inside Puruṣa. |
| vedaka / pramātṛ | Deferred (named next, per ontology §2) | Technical and central to the 13.3 resolution (`वेदकत्वमात्र`, `प्रमाता`), twelve pages including that gloss; needs its own relation study before promotion. Vocabulary already supports Puruṣa. |
| jñeya | Deferred (occurrence status) | Attested and engaged (13.12–13.17), but structurally the object-correlate of jñāna in this chapter; retained inside Jñāna evidence (13.13 response). Promote only with cross-chapter jñeya doctrine. |
| vikāra / guṇa | Rejected this round | Enumerative categories (13.5–13.6), no independent philosophical engagement beyond the kṣetra reduction; occurrence status sufficient. |
| ahaṅkāra | Rejected this round | Appears in compounds (nānākṣetra-ahaṅkāra-avastambha, 13.35) but never expounded as a thesis; occurrence inside Prakṛti/Puruṣa evidence. |
| samuccaya (Ch. 13) | Deferred (locator-only gap) | Term `समुच्चयात्मकत्व` attested in the 13.24–13.25 karma-yoga gloss (printed p. 295), but not transcribed this phase; remains a documented gap, not a new occurrence. |
| bhakti / prapatti (Ch. 13) | Deferred (per ontology §2) | Distinctive (jñāna-taru-phala bhakti, 13.11) but folded into Jñāna/Mokṣa evidence this round. |
| īśvara / maheśvara | Deferred (named next) | Pervasive epithet (`महेश्वरः`, 13.22) with real work (upadraṣṭā etc.), needs its own relation study. |
| mokṣa (bhūtaprakṛtimokṣa) | Deferred (locator-only gap) | `भूतप्रकृतिमोक्ष` attested in the 13.34 close (printed p. 301) but not transcribed; documented gap. |

No new alias spellings were introduced; all new occurrences reuse existing
attested source terms, so no alias collisions arise (warnings unchanged at
486).

## 9. Arguments

**[SOURCE]** Fourteen Chapter-13 arguments in
`src/content/v2/gitaChapter13.ts` (`CHAPTER13_ARGUMENTS`), each pointing to an
exact segment and, where transcribed, an exact passage. Roles use the
print-supported vocabulary only.

**[UNRESOLVED]** One argument is explicitly unresolved:
`gita-arg-13.13-jneya-obj` (how an exclusive self-luminous knower is
designated knowable). The nanu is stated in print (p. 287) but its full wording
is extraction-noisy and remains untranscribed; no rhetorical role beyond
`unresolved` is claimed, and no passage is manufactured.

## 10. Threads

**[SOURCE]** Thread A (“The Knower in Every Field”, `gita-rk-kshetra`) remains
5/5 segment-grounded and is now source-text-grounded wherever the source
permits (4/5 steps with exact text):

- Step 1 (13.2 / KSTS 13.1): śarīra-kṣetra passage + locator + Prakṛti link.
- Step 2 (13.3 / KSTS 13.2): exact `ननु` objection passage + role.
- Step 3 (13.3): verse-introduction segment (`gita-seg-13.2-verse`);
  source-text absent by design (mūla excluded) — honestly segment-grounded,
  never upgraded by UI.
- Step 4 (13.3): `वेदकत्वमात्र` distinction passage + Puruṣa/Jñāna relation.
- Step 5 (13.3): māyāśakti conclusion passage; unresolved portion retained
  (`अतस्तयुदासार्थमेव[?]` in the resolution text, documented).

**[EDITORIAL]** The UI (ThreadView) visibly distinguishes Rāmakaṇṭha source
text (Devanagari block with verified badge + folio) from Darśana's explanatory
synthesis (claim/transition prose). `verified-source` (Phase 6) and
`text-layer-reviewed` (Phase 7) render with the same verified badge — both mean
text-layer-reviewed, neither means collated (see §5).

Other threads unchanged (B 3/5, C 3/5 segment-grounded); Maya-4 (13.3,
māyā-as-differentiator) remains span-less by design this phase, a documented
gap even though the resolution passage could ground it — thread edits beyond
Thread A are deferred to keep the reference stable.

## 11. Cross-references

**[SOURCE]** Explicit printed cross-references with quote + locator become
`commentary-quotes-unit` edges in `src/content/v2/gitaXrefs.ts` (four new
Chapter-13 edges, all verified):

- `gita-xref-054`: Ch.13 avat → 7.6 (`अहं कृत्नस्य…`, `(७।६)`, host null with note).
- `gita-xref-055`: 13.12 (KSTS 13.11) → 7.18 (`ज्ञानी त्वात्मैव…`, `(७।१८)`).
- `gita-xref-056`: 13.25 (KSTS 13.24) → 6.3 (`योगारूढस्य…`, `(६।३)`).
- `gita-xref-057`: 13.30 (KSTS 13.29) → 7.6 (`एतद्योनीनि…`, `(७।६)`).

Pre-existing Chapter-13 edges retained: `gita-xref-037` (13.12 → 13.13,
`(१३।१२)`), `gita-xref-038` (13.7 → 13.3, `(१३।२)`), `gita-xref-039`
(13.30 → 13.27, `(१३।२६)`).

**[UNRESOLVED]** The printed `(१३।५)` locator on the
`क्षेत्रज्ञं चापि मां विद्धि…` quotation (printed p. 290) disagrees with its
quote (KSTS 13.2, not 13.5). No edge was created — a false attribution is worse
than a gap. Recorded here as an unresolved printed disagreement, pending
page-image confirmation (Rāmakaṇṭha slip vs footnote-merge vs insertion).

Conceptual relations (prakṛti↔puruṣa contrast, jñāna→prakṛti explanation) and
editorial relations (thread transitions) are never merged into quotation edges.

## 12. Quotations

**[SOURCE]** Where Chapter-13 commentary quotes another source with a printed
locator, the quotation text, boundary and locator are preserved in the xref
edges above (§11). No new external edges were created.

**[UNRESOLVED]** Unresolved quotations (text preserved in print, attribution
uncertain — preferable to false attribution):

- Mahābhārata verse on māna (`मानाग्निहोत्रमुत…`, `(महाभा०)`, p. 283):
  work abbreviated, no verse locator.
- “As they praise” (`सर्वं हि मृत्युपदम्…`, p. 284): no work, no locator.
- “As said” (`प्रज्ञाप्रासादमारुह्य…`, p. 285; `बीजान्यम्युपदग्धानि…`, p. 293;
  `योऽन्यथा सन्तम्…`, p. 297): `यथोक्त`/`तथाचोक्त` formulae, no locator.
- “As said by some knower of Brahman” (`यथैकस्मिन्घटाकाशे…`, p. 298):
  author indefinite (`ब्रह्मविदा केनचित्`).
- “As restated by some scholar” (`यद्यत् पृथक्त्वसंदिग्धं…`, p. 299):
  author indefinite (`केनापि विपश्चिता`).
- “Thus it is said” on mortality/immortality (`अमृतं चैव…`, p. 295): no work,
  no locator.

## 13. Variants and apparatus

**[SOURCE]** The `GitaVariant` model, siglum guard (`क ख ग पु.`, `पु.`
unexplained) and erratum parser from Phase 2 stand ready; no new code rows
were imported this phase.

**[UNRESOLVED]** Chapter-13 footnotes observed but not imported to code (reasons
recorded during pilot work and re-confirmed): footnote call-marks are lost in
extraction, so row-to-verse attribution would be guesswork. Observed strings
(page-level, verbatim, `पु.` never expanded):

- p. 277 (PDF 287): `१ 'वेत्ति' ख. ।`, `२ 'संमृतानां' ख. पाठान्तरम् ।`,
  `३ 'अवगन्तव्यः' ख. पाठः ।`
- p. 278 (PDF 288): `१ 'खज्ञानस्य' ख. पाठः ।`, `२ 'दचिन्त्येश्वर्यमाया' क. पाठः ।`
- p. 279 (PDF 289): `१ 'यत् प्रभावश्व' क. पाठः ।`, `२ 'तज्ज्ञः तयोर्मन्य' ख. पाठः ।`,
  `३ 'खरूप' ख. पाठः ।` (fragment; call-mark lost)
- Further Ch.13 footnotes through p. 302 follow the same pattern (full
  inventory deferred pending page-image collation).

Variant-table row observed: `१३ 9 क्षेत्रज्ञमिति क्षेत्रज्ञ इति` (p. 417 of the
PDF batch, printed variant-table range). Table śloka numbers do not
transparently align with either numbering (KSTS 13.9 = vulgate 13.10 vs
vulgate 13.9 = KSTS 13.8), so verse attribution remains guesswork — documented
here, not imported.

Errata (śuddhapatra) rows for Chapter 13: none identified in the sampled
errata pages; the edition's own corrections are never applied silently (model
carries both readings).

## 14. Chapter-13 scholarly reader

**[EDITORIAL]** VerseDetail gains a `GitaRamakanthaArea` section
(`src/components/VerseDetail.tsx`) for `bhagavad-gita` units, rendered after
the project English commentary and before notes/citation:

Gītā verse (number + locator) → Rāmakaṇṭha commentary (Devanagari passages,
lazy-loaded, verified badge + folio) → commentary structure (segment notes +
folios, with `transcriptionAbsent` where locator-only) → cross-references
(printed locators as chips to target verses; incoming locators as text) →
concepts (existing related-concept rows) → thread appearances (existing) →
source citation (existing).

Project commentary (`commentaryLabel`) and Rāmakaṇṭha source
(`ramakanthaSource`) are separate collapsible sections with distinct titles;
the layers never appear to be the same thing. No ad-hoc styles (Guna classes
only), no new UI strings (EN/ML parity preserved), decorative icons carry
`aria-hidden`, transitions carry `motion-reduce`, entrances use
`.animate-fade-in`.

## 15. Chapter-13 search

**[EDITORIAL]** Imported Chapter-13 commentary is searchable through the
existing lazy tiered system (`src/content/v2/search-index.ts`,
`src/search/*`); no new index kind, no UI change, no initial-JS growth:

- Each Gītā unit entry's `devanagari` field folds its passages' diplomatic
  text (in addition to any root-verse Sanskrit), so Devanagari term search,
  exact source-term search and concept-linked search resolve to verses.
- Discovery keeps heads (unit snippet 80) while shards carry full entries;
  unit chunks never carry transcription (tested); the commentary corpus never
  enters the initial JS bundle (static JSON behind the loader cache).
- Latin/IAST-normalised discovery for passages runs through concept/thread
  English, never through invented IAST (no transliteration is manufactured
  for diplomatic text — a deliberate fidelity choice, documented here).
- Chapter-13 filtering works through unit numbers (`13.N`) and unit IDs.

## 16. Evidence audit

**[SOURCE]** `auditChapter13` (`src/content/v2/gitaChapter13.ts`) extends the
audit with Chapter-13-specific measurements (counts only, no scores):

```text
Chapter 13 Scholarly Audit
Units:
  total: 35
  with source locator: 34
  with commentary segment: 11
  with source text: 11
Commentary:
  verified source text: 3
  text-layer reviewed: 11
  page-image collated: 0
  locator-only: 24
Concepts:
  source-grounded: 4
  exact-text grounded: 4
  locator-only: 0
Threads:
  steps: 6
  source-text grounded: 4
  segment grounded: 1
  locator-only: 1
Cross-references:
  explicit: (see code; quotation subset in §11)
  quotation: (see code)
  editorial: 0
  unresolved: (disagreeing (१३।५) + §12 list, in docs)
```

Concepts counted are the four strengthened pilots with Chapter-13 occurrences
(Puruṣa, Prakṛti, Māyā, Jñāna); threads counted are Chapter-13 steps across
all scholarly threads (Thread A 5 + Māyā-4). The shared `auditCommentary`
now reports `textLayerReviewed`, `pageImageCollated` and `partiallyCollated`
alongside the Phase-6 fields (all zero for collated — honestly).

## 17. Critical invariant

A source-backed claim never becomes stronger because more UI was built around
it. `locator-only` remains `locator-only` in the evidence map even where the
reader renders it with full navigation; `text-layer-reviewed` never becomes
`page-image-collated` without actual collation. Tests enforce this
(`verification-states-honest`, `locator-only` rows, zero collated records).

## 18. Coverage statistics and known gaps

Total passages: 22 (11 Phase-6 `verified-source` + 11 Phase-7
`text-layer-reviewed` + 3 of which are Chapter-13 Phase-6, 11 Chapter-13
Phase-7 = 14 Chapter-13 passages). Total spans: 23 (11 + 12). Chapter-13
units with source text: 11/35; with segments: 11/35; with locators: 34/35
(13.1 honestly locator-less).

Known gaps (explicit, not hidden):

1. Mūla verses (all 34 KSTS verses): excluded by policy; root-text import is a
   separate future phase.
2. `gita-seg-13.2-verse` (verse introduction): segment-grounded, no passage
   (mūla excluded).
3. `gita-seg-13.34-closing` (authorial verse + colophon, p. 302):
   locator-only by design; transcription deferred.
4. Full nanu wording on jñeya (p. 287, noisy extraction): response
   transcribed, objection retained as unresolved argument.
5. Undifferentiated gloss prose between bounded excerpts (§7): untranscribed.
6. Footnotes + variant table (§13): observed, not imported (call-marks lost,
   numbers ambiguous).
7. Third 7.14 nanu, avataraṇikās beyond 3/4/7/13: untranscribed by design.
8. Samuccaya `समुच्चयात्मकत्व` (p. 295) and `भूतप्रकृतिमोक्ष` (p. 301):
   attested but untranscribed; locator-only gaps.
9. Maya-4 thread step (13.3, no span): could be grounded by the resolution
   passage but left span-less this phase for thread stability.
10. Karman/Mokṣa/Samuccaya Chapter-13 occurrences: none added (terms either
    absent from transcribed excerpts or deferred per §8).

## 19. Files changed

- `src/content/v2/gitaSpans.ts`: +12 Chapter-13 spans (avat, 10 glosses +
  closing; roles only where print supports).
- `src/content/v2/gitaCommentaryText.ts`: +11 passages (`text-layer-reviewed`),
  extended `PassageStatus`, policy header updated.
- `src/content/vedanta/bhagavad-gita/gita-ramakantha-concepts.ts`:
  strengthened Jñāna/Prakṛti/Puruṣa/Māyā (9 new occurrences, 0 new concepts,
  0 new links, summaries extended with Ch.13 sentences in EN/ML).
- `src/content/v2/gitaXrefs.ts`: +4 Chapter-13 quotation edges (054–057).
- `src/content/v2/gitaChapter13.ts` (new): evidence map, coverage audit,
  fourteen arguments (thirteen sourced + one unresolved), formatter.
- `src/content/v2/commentaryAudit.ts`: counts for new verification levels.
- `src/content/v2/search-index.ts`: Gītā unit `devanagari` folds passage text
  (lazy shards, no new kind).
- `src/components/ThreadView.tsx`: verified badge accepts `text-layer-reviewed`.
- `src/components/VerseDetail.tsx`: `GitaRamakanthaArea` (locator → segments →
  passages → xrefs), reusing existing UI strings.
- Tests: updated segment/source-text expectations (23 spans, 22 passages,
  5 concepts with segments); new `v2-gita-chapter13.test.ts` (30 tests).
- This document (new).

No other chapters were mass-ingested; no concepts/threads were mass-generated;
no Rāmakaṇṭha–Śaṅkara comparison was imported; no later doctrinal
interpretations were added; no missing passages were fabricated; no difficult
Sanskrit was normalised without evidence; no source text was replaced with
generated summaries.

## 20. Phase 8 — Chapter-13 commentary corpus completion

**[SOURCE]** Phase 8 continues from the eleven Phase-7 passages without
rewriting any verified record. Sixty-two new bounded passages (sixty-two new
spans) transcribe the remaining Chapter-13 commentary in sequential source
order across Blocks A–F, from the same inspected text layer of
`Gitasarvatobhadrarajanka.pdf` (KSTS No. LXIV, 1943). No other edition was
consulted; no Sanskrit was fabricated, reconstructed, normalised, translated
as source, or borrowed from another commentator.

**[SOURCE]** Coverage is complete within the available text-layer evidence:
all 34 KSTS verses (13.1–13.34) now carry transcribed commentary, and all
repository units 13.2–13.35 carry source text. Only vulgate-only 13.1
(Arjuna's question, absent from KSTS) remains locator-only — honestly, by
policy. Both Phase-7 locator-only gaps are closed as source-text evidence:
`समुच्चयात्मकत्व` (KSTS 13.25, printed p.295) and `भूतप्रकृतिमोक्ष`
(KSTS 13.34, printed p.301).

**[EDITORIAL]** Inventory methodology
(`src/content/v2/gitaChapter13Inventory.ts`): one machine-readable row per
KSTS verse records repository unit, vulgate number, PDF/printed-folio,
commentary start/end words, page-crossing, verse-boundary crossing, content
flags (gloss / objection / response / quotation / cross-reference / variant /
summary / closing), span and passage IDs, what prose remains, and unresolved
issues. `validateChapter13Inventory` reconciles inventory against spans and
passages with no orphans (chapter-opening avataraṇikā matter, which carries
no KSTS number, is chapter-level and exempt by design). Tests enforce it.

**[SOURCE]** Passage boundaries follow print markers only: pratīka openings,
verse markers, `ननु` / `अत्र आह` / `उच्यते` / `सत्यं` shifts, `इति तात्पर्यम्`
and `निर्णीतः` closes, and chapter transitions. Unmarked prose stays
unmarked (no role). Where the local mūla falls between a turn and its gloss
(KSTS 13.27: the yogī turn and the sarveṣu gloss), turn and gloss are
transcribed as one passage with the verse excluded and the boundary marked.
Mūla verses, verse-number markers, running heads, folio fragments and
footnotes never enter transcription fields.

**[SOURCE]** Verification state: all sixty-two new records use the explicit
`text-layer-reviewed` status. Page images were unavailable, so no record
claims `page-image-collated` or `partially-collated` (tests enforce the
absence). Verbatim retentions with documented uncertainty (अहकार,
साक्षाकुर्वन्ति, विद्धि, भुते and the praśasti readings) follow the Phase-7
precedent: retained, never corrected, uncollated. No `[?]` was needed beyond
the existing resolution passage.

**[UNRESOLVED]** Genuine remaining gaps, each explicit:

1. Mūla verses (all 34 KSTS verses): excluded by policy, as before.
2. `gita-seg-13.2-verse` (verse introduction): segment-only, mūla excluded.
3. `gita-seg-13.34-closing` (closing apparatus): locator-only by design;
   the praśasti and colophon are transcribed instead under the distinct
   span `gita-seg-13.34-prasasti`, whose readings stay uncollated.
4. Full nanu wording on jñeya (printed p.287): extraction-noisy, retained
   verbatim in the pratijñā passage; the objection argument
   (`gita-arg-13.13-jneya-obj`) stays unresolved.
5. The printed `(१३।५)` disagreement (printed p.290): retained unresolved,
   no edge — a false attribution is worse than a gap.
6. Eleven printed quotations without determinable work/locator stay in
   passage text as unresolved source evidence with no edges
   (Mahābhārata verse, mṛtyupada, prajñāprāsāda, bījāni, amṛta, anyathā,
   vipascit, ghaṭākāśa, jñāna-dagdha, partial ārurukṣor, and the
   `(७।१८)` locator whose extraction renders the danda as `/`).
7. Apparatus (39 items: 35 footnote variants, 3 folio marks, 1
   variant-table row): inventoried page-level with verbatim strings,
   sigla preserved (`क`, `ख`, never expanded); no `पु.` rows observed in
   Chapter 13. Row-to-verse attribution stays ambiguous throughout
   (call-marks lost in extraction); nothing is mapped to a verse.
8. Minor extraction disorders documented per passage rather than repaired:
   the `त्याह` line-misorder around KSTS 13.27 (joined as भवतीत्याह),
   the corrupt non-Devanagari fragment after `महाभूतानि` (excluded as
   noise), and bare line-break joins recorded as spaces.

**[SOURCE]** Exact coverage statistics (counts only, reconciled by test):

```text
Chapter 13 Scholarly Audit (Phase 8)
Units: total 35, with locator 34, with segment 34, with source text 34
Commentary: verified-source 11, text-layer-reviewed 73,
  page-image-collated 0, locator-only 1 (13.1), unresolved passages 1
Inventory: 34 verses, 34 transcribed, 0 untranscribed; gaps: 13.1
Concepts: 7 source-grounded pilots with Chapter-13 source-text evidence
Threads: 7 Chapter-13 steps (6 source-text grounded, 1 segment grounded, 0 locator-only)
Cross-references: 12 quotation edges touch Chapter 13 (7 hosted within it, 5 recovered from introductory/boundary matter); the disagreeing (१३।५) is recorded, not edged
Arguments: 68 total (67 source-backed, 1 unresolved)
Apparatus: 39 observed, 0 mapped, 39 unresolved
Passages: 84 total (11 verified-source + 73 text-layer-reviewed)
Spans: 85 total (all source status; spans carry no transcription)
```

**[EDITORIAL]** Concepts gained only evidence-supported occurrences (10 new,
0 new concepts, 0 new links): Karman (13.26 karma-yoga), Jñāna (13.28
jñāna-cakṣuṣ), Samuccaya (13.26 `समुच्चयात्मकत्व`, newly attested term),
Prakṛti (13.27, 13.30), Puruṣa (13.22, 13.24), Māyā (13.22, 13.30), Mokṣa
(13.35 `भूतप्रकृतिमोक्ष`, newly attested term). Deferred candidates
re-evaluated: kṣetra and kṣetrajña stay occurrence-status inside
Prakṛti/Puruṣa (field-aspect and knower-role, no independent thesis);
vedaka/pramātṛ and īśvara/maheśvara stay named-next (vocabulary supports
Puruṣa; own relation studies still needed); jñeya stays inside Jñāna
(object-correlate); vikāra/guṇa and ahaṅkāra stay rejected this round
(enumerative or compound-only); bhakti/prapatti stays folded into
Jñāna/Mokṣa; samuccaya and bhūtaprakṛtimokṣa graduate from locator-only
gaps to source-text evidence without promotion (single-chapter attestation;
promotion needs cross-chapter doctrine and concept-level distinction).

**[EDITORIAL]** Threads gained only evidence-supported steps: Thread A keeps
5 steps with steps 1 and 4 extended by the etat/tātparya and sarvakṣetra
spans (claims unchanged); Thread B gains a sixth step for the Chapter-13
ārurukṣu stage (karma-yoga as samuccayātmakatva, 13.26); Thread C grounds
the anticipated Māyā-4 differentiator step with the resolution span. No
synthesis was turned into quotation; the verse-introduction step stays
honestly segment-grounded.

**[EDITORIAL]** Search and reader reuse the existing architecture unchanged:
new passages fold into unit `devanagari` fields through the lazy tiered
index (exact-term Devanagari search resolves `समुच्चयात्मकत्व` → 13.26 and
`भूतप्रकृतिमोक्ष` → 13.35; no invented IAST; commentary stays out of the
initial bundle), and the Chapter-13 reader renders the longer commentary
sequences with the same layer separation (source / segment / apparatus /
concepts / threads / citation). Locator-only 13.1 renders its honest state.

**[EDITORIAL]** Files changed (Phase 8 only): `gitaSpans.ts` (+62 spans),
`gitaCommentaryText.ts` (+62 passages), `gitaChapter13Inventory.ts` (new:
34-row inventory, 39-row apparatus, validators), `gitaChapter13.ts`
(+53 arguments; audit extended with inventory, gaps, arguments,
apparatus), `gitaXrefs.ts` (+1 edge: `gita-xref-058`),
`gita-ramakantha-concepts.ts` (+9 occurrences, +2 attested terms, two
summary clauses in EN/ML), `gitaThreads.ts` (Māyā-4 grounding, Thread-A
span extensions, Thread-B sixth step), five test suites updated with
Phase-8 regression tests, and this document. No other Gītā chapter was
mass-modified; no architecture was redesigned; no dependency was added.
