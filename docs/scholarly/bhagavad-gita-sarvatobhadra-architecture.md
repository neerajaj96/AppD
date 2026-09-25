# Bhagavad Gītā with Sarvatobhadra — Scholarly Architecture

Phase-1 source audit for making the Bhagavad Gītā with the
Sarvatobhadra / Rājānaka Rāmakaṇṭha vivaraṇa the first maximally
developed scholarly text in Darśana. Architecture and source forensics
only: no units were edited, no content was rewritten, no sources were
added, and no audit figures change in this phase.

Four categories are kept strictly separate throughout, labelled
**[FACT]**, **[CURRENT]**, **[PROPOSAL]**, and **[OPEN]**:

- **[FACT]** — observed in the source edition itself (PDF evidence).
- **[CURRENT]** — existing Darśana behaviour (code evidence).
- **[PROPOSAL]** — future architecture, not implemented.
- **[OPEN]** — unresolved question requiring further evidence.

Indian English is used throughout.

---

## 0. Source access record

**[FACT]** The edition was inspected directly from the user-supplied file:

- Google Drive file ID `10InuCi5WpCHkDWzT3_iZcybksGDs4_so`, filename
  `Gitasarvatobhadrarajanka.pdf`, 431 pages, ~37 MB, downloaded
  successfully (valid `%PDF-1.7`, PDFium producer stamp dated 2026-09-13).
- No substitution was performed: title pages confirm Kashmir Series of
  Texts and Studies No. LXIV, Bhagavadgītā with Sarvatobhadra of
  Rājānaka Rāmakaṇṭha, ed. Pandit Madhusudan Kaul Shastri, Nirnaya
  Sagar Press, Bombay, 1943 (saṃvat 2000).
- Extraction: `pypdf` text layer, one file per PDF page, analysed with
  throwaway scripts (not committed). Two pages (PDF pp. 6, 10) carry no
  text layer and are presumed blank versos; everything else extracted.

**[FACT]** Extraction caveats, recorded so later phases do not mistake
noise for data: dental conjuncts are occasionally confused (त्र read as
प्र, e.g. `प्रयोदशोऽध्यायः` for `त्रयोदशोऽध्यायः`); running-head folios
suffer digit noise (e.g. `९७७` for `२७७`); footnotes frequently merge
into body lines; Arabic-script fragments (`ور`, `رد`) and stray CJK
glyphs are scan/PDF artefacts, not edition content. All counts below
are therefore indicative at the unit level and exact only where stated.

**[FACT]** Limitation: printed introduction pp. 2–9 are absent from this
file. PDF p. 7 ends mid-sentence (printed intro p. 1) and PDF p. 8
resumes at printed intro p. 10. The main text and back matter are
continuous (folio check §1.6), so the loss is confined to front matter.

---

## 1. Facts observed in the source ([FACT])

### 1.1 Front matter (PDF pp. 1–10)

| PDF page | Content |
|---|---|
| 1 | English title page: KSTS No. LXIV, Bhagavadgītā with Sarvatobhadra by Rājānaka Ramakantha, ed. Madhusudan Kaul Shastri, Srinagar; published under Maharaja Harisinghji; Nirnaya Sagar Press, Bombay, 1943 |
| 2 | Two unattributed Sanskrit mangala verses (Somananda lineage, then Śiva; no heading, no author ascription in the file) |
| 3 | Sanskrit title page: `श्रीमद्भगवद्गीता । श्रीराजानकरामकण्ठ विरचित विवरणोपेता ।`, KSTS 64, editor credit, saṃvat 2000 / 1943, rights reservation |
| 4 | Imprint: printer, publisher, "All rights reserved" |
| 5 | PREFACE: edition based on three manuscripts — क (Deva­nāgarī transcript, 1074 leaves, "Correct"), ख (Śāradā manuscript of Pandit Nila Kantha Ganzu, 350 leaves, "Mostly incorrect"), ग (Deva­nāgarī transcript of Rājānaka Lakshmana Brahmachari, only up to 6.24, "Mostly correct") |
| 6 | No text layer (blank) |
| 7 | INTRODUCTION printed p. 1 (Sarvatobhadra's jñāna-karma-samuccaya standpoint; ends mid-sentence) |
| 8–9 | INTRODUCTION printed pp. 10–11 (Rāmakaṇṭha = Spanda-vivṛti author; colophon names Rāma/Rāma Kavi/Rājānaka Rāma/Rāmakaṇṭha; Kaṇṭha-Dhaumyāyana gotra; disciple of Rājānaka Utpaladeva; Kavīndra; Muktākaṇa kinship; Nārāyaṇa family; disambiguation from the Mātanga-vṛtti namesake) |
| 10 | No text layer (blank) |

**[FACT]** No table of contents exists in the file (no अनुक्रम/सूची/CONTENTS markers in front matter).

### 1.2 Page map (deterministic)

**[FACT]** Verified by running-head folios (150 sampled folios match
`printed = PDF − 10` with only two extraction-noise exceptions):

| PDF pages | Printed folios | Content |
|---|---|---|
| 11–415 | 1–405 | Main text: 18 chapters |
| 416–420 | 406–410 | `शुद्धिपत्रम्` (errata: page/line → अशुद्धम् → शुद्धम्) |
| 421–430 | 411–420 | `गीताया मूलश्लोकेषु पाठान्तराणि` (Rāmakaṇṭha vs Śaṅkara readings) |
| 431 | 421 | `अध्याये अधिकपद्यानि` (appendix of extra verses) |

**[FACT]** The repository's "appendix p. 431" note refers to the PDF page
number; the printed folio is 421. Future locators must cite printed
folios, with the file-specific offset recorded, never silently.

### 1.3 Chapter inventory (all 18 observed)

**[FACT]** Every chapter opens `अथ Xोऽध्यायः ।` followed by an
avatāraṇikā (untitled linking prose from the previous chapter's close)
and ends with an authorial closing verse plus a fixed colophon:

> `इति श्रीमद्राजानकरामकण्ठविरचिते वाक्यार्थान्वयमात्रे सर्वतोभद्रनाम्नि भगवद्गीताविवरणे Xोऽध्यायः ॥ N ॥`
> (minor श्रीमत्/श्री and नाम्नि/नामनि spelling variation; no chapter
> titles anywhere — the colophon names the number only.)

| Ch | PDF pp. | Printed pp. | KSTS verses | Repo units |
|---|---|---|---|---|
| 1 | 11–26 | 1–16 | 1.1–1.47 | 1.1–1.47 |
| 2 | 27–70 | 17–60 | 1–72 | 1–72 |
| 3 | 71–101 | 61–91 | 1–43 | 1–43 |
| 4 | 102–125 | 92–115 | 1–42 | 1–42 |
| 5 | 126–144 | 116–134 | 1–29 | 1–29 |
| 6 | 145–167 | 135–157 | 1–47 | 1–47 |
| 7 | 168–184 | 158–174 | 1–30 | 1–30 |
| 8 | 185–206 | 175–196 | 1–28 | 1–28 |
| 9 | 207–228 | 197–218 | 1–34 | 1–34 |
| 10 | 229–250 | 219–240 | 1–42 | 1–42 |
| 11 | 251–274 | 241–264 | 1–55 | 1–55 |
| 12 | 275–285 | 265–275 | 1–20 | 1–20 |
| 13 | 286–312 | 276–302 | 1–34 (see §1.9) | 1–35 (see §1.9) |
| 14 | 313–327 | 303–317 | 1–27 | 1–27 |
| 15 | 328–344 | 318–334 | 1–20 | 1–20 |
| 16 | 345–357 | 335–347 | 1–24 | 1–24 |
| 17 | 358–371 | 348–361 | 1–28 | 1–28 |
| 18 | 372–415 | 362–405 | 1–78 | 1–78 |

Chapter-opening verse ranges are **[OPEN]** for precise confirmation
except ch. 13 (verified) and ch. 18 (verified 1–78); the table above
uses repository numbering, which matches KSTS everywhere except ch. 13.

**[FACT]** Chapter 1 additionally opens with 7 numbered introductory
verses by Rāmakaṇṭha (first-person programme: `विधास्ये
वाक्यार्थान्वयनिषमिमं पोतमभयम्`, v. 6) plus opening prose before the
first root verse. Other chapters open directly with avatāraṇikā prose
(verified chs. 13, 18; spot-checked form is uniform).

### 1.4 Verse structure

**[FACT]** A typical unit on the page: speaker label (`धृतराष्ट्र
उवाच`, `सञ्जय उवाच`, `अर्जुन उवाच`, `श्रीभगवानुवाच —` with dash),
root verse in large type, then commentary closing with the verse number
(`…इति ॥ N ॥`, sometimes `…इति ओम् ॥`). Running heads track
`chapter.verse` on odd pages (`१३।३४]`), short title plus folio on even
pages.

**[FACT]** Commentary density varies and is explicitly marked:

- 14 verses are glossed only as `स्पष्टार्थः` ("the meaning is clear")
  with no further exposition (e.g. 18.74–75).
- 18.74–75 are commented jointly; 18.76–77 are marked
  `निगदव्याख्यातौ श्लोकौ` (both explained in one gloss). Darśana's
  one-unit-per-verse model therefore does not coincide with the
  edition's commentary spans.

### 1.5 Commentary structure (the pratīka-gloss chain)

**[FACT]** The commentary is a chain of lemma-plus-gloss cells: a root
word or phrase quoted in single quotes, followed immediately by its
exposition, e.g. on 13.2: `'इदं' सर्वप्रमातृप्रसिद्धतया व्यवस्थितं
'शरीरं' देहः क्षेत्रसाधर्म्यात् 'क्षेत्रमिति' उच्यते …`. Quotation marks
are the visual distinction between root text and gloss; no other
typographic device separates them.

**[FACT]** Recurring rhetorical moves (never forced onto every
sentence, but frequent enough to model as optional annotations):

- Objection: `ननु` opens sustained pūrvapakṣa (43 occurrences), often
  paired with `इत्याशंकां` and resolved by `…परिहर्तुमाह —` introducing
  the next verse (e.g. on 13.2).
- Question-seed: `प्रश्नबीजं हृदि कृत्वा` (on 18.1: `किं
  परस्परपर्यायत्वमुत भिन्नार्थता । तत्कीदृशोऽर्थभेदोऽनयोरिति प्रश्नबीजं`).
- Burden/point markers: `तात्पर्यम्`, `उच्यते` (74), `यदुक्तम्`,
  `तथाच`, `अत एव आह`.
- Question words `कथं/कथम्` (~80 combined, extraction-split).

**[PROPOSAL]** Model these as optional span annotations (`objection`,
`response`, `question`, `inference`, `conclusion`, …) on commentary
segments — never mandatory labels per sentence (§4 of the task).

### 1.6 Quotations and cross-references

**[FACT]** 57 parenthesised locators of the form `(N।M)` occur in the
main text (samples: `(११।४७)`, `(११।४८)`, `(२।२६)`, `(३।२१)`,
`(१३।३४)`); every sampled instance is attached to a quoted Gītā pāda,
e.g. `'नान्योऽस्ति कर्ता जगतस्त्वमेको … ।' (११।४७)`,
`'भूतप्रकृतिमोक्षं च ये विदुः .. ।' (१३।३४)`. No bare (unquoted)
parenthesised reference was found in sampling. Chapter avatāraṇikās
quote the same way (ch. 18 opening cites 16.5, 5.3, 4.19 with locators).

**[FACT]** Quotations from outside the Gītā are rare in the sampled
material: one `श्रुतौ` formula, `इतिहास` (2), `पुराण` (15, mostly
generic). The `स्पन्द` hits (7) are all the ordinary word परिस्पन्द,
not Spanda-kārikā citations (the introduction's Spanda-46 claim runs in
the other direction). `मनु`'s 156 substring hits are मनुष्य/मनस्-type
words, not authority citations — recorded here so nobody cites the raw
count.

**[PROPOSAL]** Future reference vocabulary (extends `V2Reference`,
§9G): `commentary-quotes-unit`, `commentary-refers-unit`,
`commentary-quotes-external` — three distinct relations, matching the
observed quotation habits.

### 1.7 Variants and footnotes

**[FACT]** ~185 `पाठः` footnotes. Format: footnote number, witness
sigla, variant reading, `पाठः`, e.g. `१. क. ग. पु. स्वरूपं
सर्वेशमिति पाठः ।`, `१ 'च ये' क. पाठः ।`, `१ 'सर्वथा' इति ख. अधिकः
।`. Sigla census: क (~79), ख (~83) dominate; ग is absent (`ग. पाठः`
0 — consistent with manuscript ग ending at 6.24); `पु.` occurs but is
unexplained.

**[OPEN]** `पु.` appears in footnotes (`क. ग. पु.`) yet the preface
lists only क, ख, ग. Do not expand it to "pustaka" or any manuscript
identity without evidence.

**[FACT]** Back-matter variant table (PDF pp. 421–430, printed
411–420), headed `गीताया मूलश्लोकेषु पाठान्तराणि`, columns अध्याय ।
श्लोक । रामकण्ठपाठः । शङ्करपाठः. Sampled chapters: 1, 2, 3, 4, 6, 8,
11, 13, 16, 18 — only differing verses are listed, so a chapter's
absence means "no sampled differences", pending cell-by-cell
verification. Notable Kashmir readings: 1.11 भीम/भीष्म-रक्षितम् swap,
18.61 `हृद्येष वसतेऽर्जुन` for `हृद्देशेऽर्जुन तिष्ठति`, 18.63
`मत्प्रसादात्परां सिद्धिं` for `तत्प्रसादात्परां शान्तिं`.

**[FACT]** Errata (PDF pp. 416–420, printed 406–410), headed
`शुद्धिपत्रम्`, columns पृष्ठ । पंक्तिः । अशुद्धम् । शुद्धम्. These are
the edition's own corrections and must be preserved as editorial notes,
never applied silently to the Sanskrit (§10 fidelity rules).

### 1.8 Colophons, closing verses, lineage

**[FACT]** All 18 chapters close with an authorial praśasti verse naming
its chapter (`सोऽध्याय एष विवृतो विधिवत्तृतीयः`; ch. 17:
`प्रयोगे नवे` — "in this new undertaking") followed by the fixed
colophon (§1.3). The work ends with `कविवंशवर्णनम्` (6 verses):
Rāma styles himself कवीन्द्र, younger brother (`अनुज`) of Muktākaṇa,
descendant of the Kānyakubja brahmin Nārāyaṇa, and states the Gītā's
`पदार्थप्रथा` (word-meaning exposition) is thereby composed.

### 1.9 Recension and numbering facts (load-bearing)

**[FACT]** KSTS chapter 13 has 34 numbered verses (13.1–13.34); its 13.1
is `इदं शरीरं कौन्तेय` (running head `१३।१]`, PDF p. 287). The
vulgate/Śaṅkara 13.1 (Arjuna's `प्रकृतिं पुरुषं चैव` question) occurs
nowhere as a numbered verse in this file (full ch. 13 opening read;
the only `प्रकृतिं पुरुषं` hit is 13.20 = vulgate 13.21).

**[FACT]** The appendix (`अध्याये अधिकपद्यानि`, printed p. 421, one
page) holds 13 numbered extra items, each carrying its host-verse
number (॥ ७ ॥, ॥ १८ ॥, ॥ ३८ ॥–॥ ४२ ॥ cluster, …). These are the
repository's `adhika.1–13` units; the mapping host-verse ↔ item is
printed, not inferred.

**[CURRENT]** The repository follows vulgate numbering: repo 13.1 is the
Arjuna question, repo 13.2–13.35 = KSTS 13.1–13.34. But repo 13.1's note
claims "Kashmir-only opening question; absent in Śaṅkara vulgate" —
**inverted against this file's evidence** (the question is absent from
KSTS here and present as Śaṅkara's 13.1). **[OPEN]** Re-verify repo
13.1's provenance before any later phase builds on it; the repo 13.2+
concordance notes ("Kashmir 13.N = vulgate 13.N−1") are consistent with
the file.

---

## 2. Existing Darśana behaviour ([CURRENT])

Condensed from a full implementation survey; details verified against
`src/content/vedanta/bhagavad-gita/`, `curatedSources.ts`, `curate.ts`,
adapters, tests, and `docs/PROVENANCE.md`:

- Content: 7 EN part-files + adhika file + 7 ML overlays (~1.3 MB,
  13,456 lines), 25 concepts, 18 thread steps (one per adhyāya, three
  steps embed adhika units). Legacy files carry zero
  provenance/editorial/sourceIds/evidenceLinks fields.
- Units: 714 = 701 mūla (`"1.1"`…`"18.78"`, `unitType: 'sloka'`,
  `verseTerm: 'Śloka'`) + 13 `adhika.N` (no devanāgarī/iast; "mula not
  reproduced here"; ML layer translation/commentary only). Sections are
  English titles (`Adhyāya 1 — Arjuna-viṣāda (Grief)`) with no source
  counterpart (§1.3: the edition gives numbers only).
- Registry: one record `bhagavad-gita-source-ksts-64` (title, KSTS
  LXIV edition, 1943, `role: 'primary-text'`; no author/publisher —
  honestly absent). 701 units attach with `relation: 'text'`; 13 adhika
  units are unresolved (`notes-without-deterministic-mapping`; their
  `KSTS LXIV p.431:` prefix does not match the `Kashmir Series…`
  prefix).
- Rendering: TextIndex stats (714/25/18) + TextEvidenceSection (701
  evidence-linked, 13 unresolved); reader citation prefers the KSTS
  `text`-relation source; adhika units show the no-source empty state.
- Search is generic (no Gītā branch); devanāgarī/iast paths score
  nothing since those fields are empty.
- No validation or audit special-casing for the Gītā beyond
  `adapters.ts` sloka typing and comments.

---

## 3. Current-vs-required gap ([CURRENT] → [PROPOSAL])

Task §2's 27 capabilities, rated against the file:

| # | Capability | Status |
|---|---|---|
| 1 | text title | ✅ `Bhagavad Gītā` |
| 2 | edition identity | ✅ KSTS LXIV / 1943 record |
| 3 | chapter | ✅ 18 sections (English titles, sourceless) |
| 4 | chapter heading | ❌ edition gives numbers only; headings would be editorial |
| 5 | Gītā verse | ✅ 701 units (modulo §1.9) |
| 6 | Sanskrit text | ❌ empty devanāgarī (project English only) |
| 7 | IAST | ❌ empty iast |
| 8 | commentary opening | ❌ avatāraṇikā not represented |
| 9 | commentary prose | ⚠️ project English commentary, not Rāmakaṇṭha's Sanskrit |
| 10 | commentary's Gītā quotations | ❌ no span model |
| 11 | quotations from other works | ❌ rare, unmodelled |
| 12 | cross-references to Gītā verses | ❌ 57 printed locators unmodelled |
| 13 | textual variants | ❌ 185 footnotes + 10-page table unmodelled |
| 14 | footnotes | ❌ unmodelled |
| 15 | editorial notes | ⚠️ śuddhapatra unmodelled; interpretiveNotes carry registry prose |
| 16 | chapter-level commentary | ❌ avatāraṇikā unmodelled |
| 17 | chapter conclusion | ❌ closing verses unmodelled |
| 18 | colophon | ❌ formula unmodelled |
| 19 | source-page location | ❌ no folio locators for Gītā units |
| 20 | source locator | ❌ same |
| 21 | source/evidence relationship | ✅ `text` links on 701 units |
| 22 | concepts | ✅ 25 attached (project-authored, pre-Rāmakaṇṭha) |
| 23 | related verses | ✅ sharing-based |
| 24 | philosophical arguments | ❌ no span model |
| 25 | interpretive claims | ⚠️ English commentary only |
| 26 | references | ⚠️ generic links; no commentary reference graph |
| 27 | guided-thread appearances | ✅ 18 steps (chapter granularity) |

---

## 4. Proposed schema additions ([PROPOSAL], all optional)

Nothing below is implemented. Each item names its home (generic V2 vs
Gītā-sidecar) and its source evidence:

1. `CanonicalUnit.speaker?: string` — generic V2. Evidence: speaker
   labels on units throughout (§1.4). Controlled per-text vocabulary,
   never inferred.
2. `CanonicalUnit.sourceNumber?: string` — generic V2. Evidence: KSTS
   numbering ≠ canonical numbering (ch. 13 off by one, §1.9). The
   edition's own number travels with the unit; canonical `number` stays
   stable for URLs.
3. `CanonicalUnit.variantReadings?: Array<{ sigla: string[];
   reading: string; note?: string }>` — generic V2, all optional.
   Evidence: 185 footnotes (§1.7). Sigla preserved verbatim (`क.`,
   `ख.`, `पु.`); manuscript identities never inferred.
4. Commentary segmentation as a Gītā sidecar (not core schema):
   `commentarySegments?: Array<{ pratika?: string; gloss: string;
   role?: 'gloss' | 'objection' | 'response' | 'question' |
   'quotation' | 'reference' | 'conclusion'; refs?: GitaVerseRef[] }>`.
   Evidence: pratīka chain, ननु blocks, quotation habits (§1.5–1.6).
   Roles optional per segment; unmarked prose stays unmarked.
5. Reference-kind additions on `V2Reference` (generic):
   `commentary-quotes-unit`, `commentary-refers-unit`,
   `commentary-quotes-external`. Evidence: 57 quote-attached locators
   vs. rare external formulae (§1.6).
6. Chapter sidecar `gita-chapters.json` (Gītā-specific, not core
   schema): per chapter — number, PDF/printed page range, verse range
   in both numbering systems, avatāraṇikā text, closing-verse text,
   colophon text, opening/closing unit ids. Evidence: §1.3, §1.8.
7. No new top-level `V2Thread` fields; future threads compose existing
   `unitIds`/`conceptId` steps (see §7).

This phase adds only the parsing vocabulary in
`src/content/v2/gitaDocument.ts` (document-unit kinds, verse-ref
parser, folio mapping) with corpus-free tests — the smallest useful
architectural foothold.

---

## 5. Content file architecture ([PROPOSAL])

```
src/content/vedanta/bhagavad-gita/      # existing parts untouched
src/content/v2/gitaDocument.ts          # ✅ added: kinds + parsers
public/content/bhagavad-gita/
  units/…                               # unchanged (canonical numbering)
  gita-chapters.json          # PROPOSED: §4.6 sidecar
  commentary-segments/        # PROPOSED: per-chapter pratīka chains
  variants.json               # PROPOSED: footnotes + table rows, verbatim
  xrefs.json                  # PROPOSED: quotation/reference graph edges
```

Chunk-size discipline: Sanskrit root text (~700 verses) plus segmented
commentary is the largest payload the project will have carried; keep
commentary segments in per-chapter lazy chunks behind the existing
loader cache, never in the initial bundle. Offline-first reading is
preserved because chunks are static JSON.

---

## 6. Concept architecture ([PROPOSAL], grounded in §1 census)

Unlemmatised substring counts (indicative only — sandhi and compounds
included): कर्म 1001, ज्ञान 870, ब्रह्मन्/ब्रह्म 335, पुरुष 222,
प्रकाश 148, प्रकृति 118, शक्ति 90, माया 85, मोक्ष 82, कर्तृ 75, भक्ति
50, ईश्वर 31, न्याय 22 (includes अन्याय — do not cite raw), सर्वज्ञ
20, प्रमातृ 15, स्मृति 16, श्रुति 13, प्रत्यभिज्ञा 9, वेदान्त 9, अद्वैत
4, चैतन्य 2, विमर्श 5, समावेश 1.

Seed candidates supported by recurrence *and* explanatory role
(jñāna-karma-samuccaya is the commentary's thesis, per the
introduction): कर्मन्, ज्ञान, ब्रह्मन्, पुरुष, प्रकृति, माया, शक्ति,
मोक्ष, भक्ति, कर्तृत्व, सर्वज्ञत्व, प्रमातृ, ईश्वर, अद्वैत. Each future
concept must record: source term(s) as printed, normalised label,
English and Malayalam labels, synonyms, related and contrasting
concepts, and textual occurrences (unit + segment). Existing 25
project concepts are retained but marked as pre-Rāmakaṇṭha; no mass
concept generation in any near phase.

## 7. Cross-reference architecture ([PROPOSAL])

Edges derive from printed locators only (`parseGitaVerseRef`): a
`commentary-quotes-unit` edge requires quoted text *plus* locator (the
file's universal habit); `commentary-refers-unit` is reserved for
locators without quotation should any verify; `commentary-quotes-external`
requires a named work plus quoted or clearly attributed text (none
verified yet — Manu/śruti-style formulae are nearly absent). Never
convert a reference into a quotation; never attribute quoted Gītā words
to Rāmakaṇṭha.

## 8. Thread architecture ([PROPOSAL])

Only threads with printed anchors: (a) argument threads — ननु passages
with verse resolution (e.g. 13.2); (b) cross-verse threads following
the 57 quotation edges; (c) chapter threads built on avatāraṇikās (why
this chapter follows the last); (d) concept threads for §6 seeds across
chapters; (e) recension threads pairing variant-table rows with
affected verses. The existing 18-step thread is preserved as the
entry-level path.

## 9. Reader architecture ([PROPOSAL])

Eventual hierarchy, each layer gated on source evidence: chapter →
avatāraṇikā → verse (speaker, Sanskrit, IAST) → project translation →
Rāmakaṇṭha segments (pratīka chain, objection/response styling,
quotations visually quoted with locators) → variants/errata notes →
chapter closing verse + colophon → concepts → related verses →
threads → evidence/provenance → citation. Translation of the Sanskrit
commentary, if ever added, is a separate attributed layer — never
presented as Rāmakaṇṭha.

## 10. Validation invariants ([PROPOSAL] for future enforcement)

1. Sanskrit bytes immutable except via śuddhapatra-sourced notes.
2. Variant sigla limited to the observed set (`क`, `ख`, `ग`, `पु.`);
   unknown sigla are errors, not guesses.
3. Every `commentary-quotes-unit` edge carries quoted text + locator.
4. No quotation attributed to Rāmakaṇṭha.
5. Locators (`printed folio`) never populate `evidenceLinks`.
6. `reviewed`/`verified` editorial states never render as historical
   claims (existing apparatus already separates them).
7. Repo 13.1's note must resolve (§1.9) before ch. 13 ships any
   KSTS-backed Sanskrit.
8. Chapter titles, if ever displayed, labelled editorial (the edition
   gives numbers only).
9. Unit verse text, once added, must match the numbered printed verse
   for that unit's `sourceNumber`, including joint-commentary spans
   (18.74–75, 76–77 stay addressable individually *and* as spans).

## 11. Roadmap ([PROPOSAL])

1. ✅ Source architecture audit (this document + `gitaDocument.ts`).
2. Page map: folio-verified unit↔printed-page table (helpers ready).
3. Chapter normalisation: `gita-chapters.json` (avatāraṇikā, closing
   verses, colophons, both numbering systems).
4. Resolve repo 13.1 and the `पु.` siglum; re-curate affected notes.
5. Root-verse capture (Sanskrit + IAST) keyed by `sourceNumber`, with
   joint-span units.
6. Commentary segmentation (pratīka chains, ch. 13 pilot — the ननु
   passage is the ideal first span).
7. Variant/footnote layer (185 notes + table rows, verbatim).
8. Quotation/reference graph (57 edges + avatāraṇikā quotes).
9. Concept seeding from §6 (no mass generation).
10. Cross-text links (Spanda occupational hazards noted, not assumed).
11. Reader composition per §9.
12. Search over Sanskrit + segments.
13. Citation/provenance refinement (folio locators into
    `formatCitation` via existing `locator` field).
14. Fidelity QA against this document, then phase-2 audit.

## 12. Unresolved questions ([OPEN])

1. Repo 13.1's "Kashmir-only" note vs. the file (§1.9).
2. Identity of footnote siglum `पु.`.
3. Why manuscript ग never surfaces in footnotes despite covering
   chs. 1–6.24 (collation silence or extraction loss?).
4. Contents of printed introduction pp. 2–9 (absent from this file).
5. Whether the variant table omits chapters without differences or
   merely went unsampled (chs. 5, 7, 9, 10, 12, 14, 15, 17).
6. Canonical numbering choice: keep vulgate-aligned repo ids with
   `sourceNumber`, or renumber to KSTS (decision for phase 3; URLs and
   citations favour stability — keep repo ids).
7. Authorship of the two p. 2 mangala verses (recorded unattributed).
8. Joint-commentary units (18.74–75, 76–77): one unit with spans vs.
   linked units (phase 5 decision).
9. Any second witness for readings where only `पु.` disagrees.
