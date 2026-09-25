# Provenance

Provenance is explicit and conservative. The V2 `SourceProvenance` shape
(`src/content/v2/schema.ts`, mirrored in
`content/schema/provenance.json`) records source title, author, edition,
publisher, year, translator, page, section, volume, locator, source URL,
rights status (`public-domain`, `original`, `licensed`, `unknown`) and
free-form notes.

Rules:

- Unknown information remains unknown; ingestion and manifests never
  fabricate counts, dates or translators.
- URLs are validated for shape only; rights default to `unknown` unless
  the source states otherwise.
- Unit, concept and text provenance share one shape so reports can
  distinguish complete, partial and unknown coverage uniformly.

## Four distinct things (do not merge them)

- **Source record** (`V2Source`, per-text `sources.json`): a stable,
  canonical registry entry describing where content came from. Only
  carried fields render; missing author/year/translator/publisher data
  is never invented. Legacy free-form provenance statements travel
  verbatim as `notes` on one record per text
  (`src/content/v2/textSources.ts`); they are never parsed into fake
  structured fields.
- **Unit provenance** (`CanonicalUnit.provenance`): what is known about
  one specific unit (currently only Devi-Mahatmya page-range locators).
- **Evidence link** (`V2EvidenceLink` on the unit): the precise layer —
  `text | translation | commentary | interpretation | provenance` — one
  attached source supports for that unit, encoded only where unit notes
  state it. Absence of a link means: “No finer-grained relationship
  has been established” — not: “The source is unrelated.”
- **Editorial status** (`EditorialStatus`): field-level workflow state
  (`missing`/`draft`/`reviewed`/…), not a source claim.
- **Canonical citation**: a deterministic string built only from
  available metadata (text title, unit number, known author/edition/
  locator) plus the canonical unit URL
  (`src/content/v2/citation.ts`). Copy uses the clipboard API with a
  live-region announcement; no external libraries. Edition metadata
  prefers the `text`-relation source when evidence links establish one;
  output is unchanged wherever they do not.

## Runtime path

React → `V2Repository.getSources/getSource` → `text/sources.json`
(loader-cached `LoadResult`s) → `SourceList` / `Citation UI`. Units link
to records through `sourceIds`, validated per text (duplicates and
dangling references are errors, malformed URLs warnings).

## Evidence semantics (source roles)

Six concepts the system keeps strictly separate:

- **Source**: the record itself (`V2Source`) — what an external source
  IS (title, author, edition, …). Identity only, no usage claim.
- **Source role** (`V2Source.role`, controlled vocabulary
  `primary-text | translation | commentary | secondary | provenance |
  editorial`): how Darśana uses that source. Assigned only where the
  record's own evidence states it; otherwise absent, never guessed.
- **Provenance** (`CanonicalUnit.provenance`): what is known about one
  particular unit (e.g. a source page range).
- **Editorial status** (`EditorialStatus`): field-level workflow state,
  not a source claim.
- **Citation**: deterministic string from available metadata plus the
  canonical URL. Roles inform disclosure (source cards), never citation
  wording.
- **Project-original material**: translations, commentaries, summaries
  and paraphrases the legacy files explicitly mark as this project's
  own work (lalita/vishnu/mishra/gita carry-over policies). Such
  material is never attributed to an external author; unattributed
  English renderings leave author/translator absent.
- **Unknown**: anything not established above. Unknown stays unknown —
  an absent role or field is a deliberate statement, not a gap to fill.

Curated examples (all traceable to verbatim unit notes): Kashi Series
No.83 → `primary-text` (sutra-patha comes from it); Raja-Yoga and Four
Chapters on Freedom → `commentary` (both notes say so); KSTS No. LXIV →
`primary-text` ("Sanskrit-only source"). The four `*-source-notes`
records stay role-absent: each mixes edition tables with policy
statements, and no single role is evidenced.

Evidence links extend the same sentences one step further: Kashi/KSTS
notes state where the Sanskrit text comes from (`text`), the two yoga
gloss notes state consultation *in the commentary* (`commentary`).
`translation` / `interpretation` / `provenance` relations stay unused
until unit notes support them; Devi-Mahatmya units carry locators but
no links, because a page range is provenance, not a source
association.

## Pilot: Devi-Mahatmya (repeatable editorial workflow)

The first text curated end-to-end (182/184 units with source locators;
2 honestly unresolved). It was selected because its legacy table maps
app sections to source pages — the only such evidence in the corpus.

1. **Trace**: `devi-mahatmya-source-provenance.ts` (44 rows of
   `appIds → pdfPages` against an 814-page edition) plus per-unit
   `interpretiveNotes` already in the content.
2. **Text record**: the table travels verbatim as notes on one
   `V2Source` (`devi-mahatmya-source-notes`); no author/year/publisher
   fields exist in evidence, so none were created.
3. **Unit locators**: `extractLocatorStems` reduces rows to dash-boundary
   prefix stems (slash lists yield nothing); `matchUnitLocator` takes
   the longest match (`dm-1-` can never catch `dm-13-5`). Matched units
   get `provenance.locator` (the row's page range, e.g. `pp.472-523`);
   the rest stay absent. The build refuses to emit on zero matches and
   prints the coverage count.
4. **Citation**: unit locators flow into `formatCitation`, e.g.
   `Devīmāhātmyam, 8.39-42. Sage Mārkaṇḍeya / Sage Medhas. pp.472-523.
   Darśana canonical unit: <url>.`
5. **Uncertainty kept**: no editorial states asserted (review status
   unknown), 2 units unresolved, other texts untouched.

To scale to another text: supply a per-section locator table (or accept
notes-only records), add its mapping in `build-content-chunks.ts`,
extend the pilot tests, and confirm validator errors stay zero. Unit
variants, translation provenance and editorial review states follow the
same `provenance`/`sourceIds`/notes mechanisms — no new systems.

## Corpus classification (evidence already in the repository)

No external research was used; classes reflect only what the repo states.

| Class | Texts | Basis |
|---|---|---|
| A — directly curatable | devi-mahatmya (reference pilot), yoga-sutras, bhagavad-gita | per-unit edition statements mapping deterministically to units |
| B | — (none; yoga/gita exceptions are documented per-unit instead) | — |
| C — notes-only | lalita-sahasranama, vishnu-sahasranama, tantraloka (Mishra companion) | free-prose records, no safe unit mapping |
| D — no usable evidence | samkhya-karika, samkhya-sutra, nyaya-sutras, vaisesika-sutras, mimamsa-sutras, brahma-sutras, adhyatma-ramayana, kundalini-tantra, shiva-sutras, spanda-karika, vijnanabhairava | single interpretive note or nothing source-bearing |

Curated registries (`src/content/v2/curatedSources.ts`, verbatim
transcription only): yoga-sutras 3 records (Kashi Series No.83 /
1930; Raja-Yoga / Vivekananda / 1895–96 / public-domain; Four Chapters
on Freedom / Satyananda / Yoga Publications Trust, Munger),
bhagavad-gita 1 record (KSTS No. LXIV / 1943). Units attach exactly the
records their own notes invoke.

## Coverage (generated, not estimated)

- devi-mahatmya: 182/184 units with locators (2 near-misses unresolved)
- yoga-sutras: 195/195 attach sources (193 × 3 records, IV.17/IV.18 × 2)
- bhagavad-gita: 714/714 attach the KSTS record (13 adhika units through the appendix prefix); 712 carry printed-folio locators from the Phase-2 source backbone (13.1 and 11.46 are vulgate-only with no KSTS location)
- Corpus provenance-bearing units: 1091/4060 (26.9%); source records exist for 6/17 texts
- Validation: 0 errors; warnings unchanged (no new codes fired)

## Evidence Audit (`npm run content:audit`)

The audit makes coverage measurable without inventing data. It adapts
the corpus, applies the same shared curation the chunk builder runs
(`src/content/v2/curate.ts`), fails loudly on any validation error,
then counts. Human output by default, machine-readable matrix with
`--json`. No timestamps are embedded, so repeat runs are byte-identical.

- **Dimensions are independent**: a locator-only unit (Devi-Mahatmya
  page ranges) is never counted as evidence-linked; a source-linked
  unit without links stays source-linked only; `fullyLinked` requires
  a source association *plus* a link or locator.
- **Unresolved reasons are observable states, not causes**:
  `no-source-record` (registry empty), `no-unit-association`
  (records exist but the unit offered no notes to match),
  `notes-without-deterministic-mapping` (notes exist, nothing matched),
  `unclassified` (reserved; currently zero). Causal readings — the two
  devi near-misses — live in prose here and in code comments, never as
  machine claims.
- **Absence of structured evidence is not proof that no historical
  source exists** — only that none is represented in this repository.
  Likewise, unresolved does not mean incorrect.
- **Curation queue is factual, not ranked**: curated / notes-only /
  no-evidence lists in corpus order. No scores, no "best" text.

Future curators: run the audit, pick a text from the queue, supply a
locator table or notes-only record following the Devi-Mahatmya pilot
pattern, extend the audit tests with its expected counts, and confirm
validator errors stay zero.
