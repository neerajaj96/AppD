# Bhagavad Gītā Rāmakaṇṭha Source Text (Phase 6)

What Sanskrit is actually present in the repository, how it got
there, and what remains locator-only. Categories **[FACT]** /
**[CURRENT]** / **[PROPOSAL]** / **[OPEN]** follow the earlier
documents. Indian English throughout.

## 1. Source acquisition status

**[FACT]** The source file is NOT in the repository. It was inspected
from the user-supplied `Gitasarvatobhadrarajanka.pdf` (37,353,357
bytes; Drive ID `10InuCi5WpCHkDWzT3_iZcybksGDs4_so`; valid `%PDF-1.7`,
PDFium producer stamp 2026-09-13) held outside the workspace at
`/tmp/opencode/`. Nothing in `src/`, `public/` or `docs/` is derived
by re-running against that file at build time — the committed
passages below are the reviewed artifact, not a build output.

**[FACT]** The file carries a born-digital text layer (not scanned
images): extraction used `pypdf` page text, one file per PDF page.
No OCR software was involved anywhere; the `ocr-unverified` status
exists in the model for future scanned sources and is currently
unpopulated. Printed introduction pp. 2–9 remain absent from the file
(Phase-1 limitation, unchanged).

## 2. Ingestion pipeline

`Gitasarvatobhadrarajanka.pdf` (external, documented above)
→ `pypdf` page-text extraction (procedure, not committed)
→ bounded excerpts selected for pilot thread/concept evidence
→ token-by-token human review against extraction
→ `src/content/v2/gitaCommentaryText.ts` records
→ `validatePassages` (tests + future build gate)
→ `public/content/bhagavad-gita/passages.json` (build script)
→ lazy `loadTextPassages` → repository → `useTextPassages` →
thread-reader display. Unit chunks never carry transcription
(verified by test); components never import the data module
(verified by test).

## 3. Transcription policy

- Diplomatic text only: Devanagari as extracted, spaces and variant
  spellings retained (`गुणमय`, `सेवे`-class forms untouched).
- Joined solely unambiguous end-of-line hyphens (print layout, not
  content); stripped zero-width format characters (U+200C/200D/FEFF).
- Mūla verses excluded even inside gloss flow (root-text import is a
  separate future phase); footnotes, running heads and folio
  fragments excluded (apparatus lives elsewhere).
- `[?]` marks unresolvable readings inline, each documented in the
  record `note` (e.g. `साया` for probable माया, `मदनुप्रद्दे`,
  `दृष्ट्रयः`). `लक्ष[ण]` brackets supply a single dropped akṣara
  where grammar admits exactly one reading.
- Never fixed from memory, never normalised, never translated here.
- No `normalizedText` column exists; a test fails the build if one
  appears.

## 4. OCR policy

No OCR was used. If scanned sources enter later, their text enters
only as `extraction-unreviewed`, renders behind an unverified notice,
and never feeds `verified-source` claims. The UI branch exists and is
tested; no live data exercises it yet.

## 5. Verification policy

`verified-source` means: sourced from the inspected file, bounded
explicitly, token-reviewed in session, coherent, anomalies either
resolved by unambiguous evidence or marked. It does NOT mean
collated against page images — that remains future work and is
stated wherever verification is claimed. `partially-verified`
exists for excerpts reviewed with open questions; unpopulated.

## 6. Diplomatic vs normalized text

Only diplomatic text exists. Normalization was not justified and was
not created; the model has nowhere to put it.

## 7. Variants

Footnote apparatus (185 notes) and the variant table (printed
pp. 411–420) are NOT transcribed in this phase. Reason recorded
during pilot work: table śloka numbers do not transparently align
with either numbering (e.g. मत्प्रसादात् under `६३`), and footnote
call-marks are lost in extraction, so row-to-verse attribution would
be guesswork. The `GitaVariant` model, siglum guard (`क ख ग पु.`,
पु. unexplained) and erratum parser from Phase 2 stand ready.

## 8. Quotations

Passage records carry no separate quotation sub-records in this
phase: no pilot excerpt contains a quote+locator pair (verified by
scan). The 53 `gitaXrefs` edges remain the quotation graph; wiring
edges to passages is future work.

## 9. Page/folio mapping

Printed folio = PDF page − 10 across pp. 11–431 (Phase-1 validated).
Every passage carries integer `pdf` + `folio`; tests enforce the
relation and chapter containment. Three systems that must never be
confused: PDF page (file position), printed folio (citation), and the
page-map folio (verse anchor, may differ from passage folio where a
tail runs on).

## 10. Citation precision

`formatCitation` accepts verified `segment` text; unit-only output is
byte-identical. Segment citations use `Darśana scholarly reference`
with thread-step URLs. Priority ladder: segment + folio → span +
folio → unit + KSTS locator → source record. Never finer than the
data.

## 11. Current coverage and limits

Eleven passages (all `verified-source`): 13.1 gloss, 13.2 nanu,
13.2 resolution, 2.39 tail, ch. 3/4 avataraṇikās, 5.3 sentence,
7.14 definition/objection/response, 18.61 gloss. Thread grounding:
A 5/5, B 4/5 (5.3 unit-level passage), C 4/5 steps with exact text.
Untranscribed by design: mūla verses, footnotes, undifferentiated
gloss prose, the third 7.14 nanu, avataraṇikās beyond 3/4/7.

## 12. Future full-volume ingestion

Per chapter: extract → segment against verse markers → bounded
excerpts with the §3 policy → review → records → validation →
chunks. Token-level review is slow, deliberate work: proceed chapter
by chapter, never blind import.
