# Bhagavad Gītā Rāmakaṇṭha Commentary Segmentation (Phase 5)

Why segments exist, what they are, and what they are not. Categories
**[FACT]** / **[CURRENT]** / **[PROPOSAL]** / **[OPEN]** follow the
earlier documents. Indian English throughout.

## 1. Why segmentation is needed

**[FACT]** Canonical units address verses; Rāmakaṇṭha's evidence lives
*between and around* verses — a `nanu` staged after one commentary
close, avatāraṇikās before first verses, glosses on unnumbered halves.
Pointing only at units loses that precision; quoting full prose would
require a transcription the repository does not yet hold. Segments are
the middle path: named, bounded, located regions without imported text.

## 2. Source vs editorial segmentation

- **Source** (all eleven current spans): the print itself demarcates
  the region — `nanu`/`atrāha` markers, chapter openings, verse
  markers bounding a gloss, an unnumbered half with its numbered
  neighbour. Every `source` span names its boundary evidence in
  `note`.
- **Editorial**: Darśana groupings, explicitly marked. None exist yet;
  the status exists so future groupings cannot masquerade.
- **Unresolved**: insufficient evidence for a stronger claim. None
  exist yet; the status exists for honesty, not as a dumping ground.

## 3. Segment vocabulary

Kinds (`anchor`): `avataraṇikā`, `commentary-tail`, `commentary`,
`closing`. Roles (optional): `gloss`, `objection`, `response`,
`question`, `quotation`, `cross-reference`, `inference`,
`conclusion`. Roles are used only where print markers justify them
(11 spans carry 7 roles); unmarked prose stays unmarked. Joint spans
(`GitaCommentarySpan`) are a separate, older abstraction for shared
exposition and are left untouched.

## 4. Evidence hierarchy and locator precision

Strongest first: span + folio (nanu at f.277) → span + folio on
unnumbered matter (avataraṇikās) → unit + KSTS + folio → unit +
KSTS → source record. Citations use the strongest verified tier and
say which (`Darśana scholarly reference` vs `Darśana canonical
unit`). Precision is never manufactured: avataraṇikā spans carry no
verse number by design.

## 5. Transcribed vs locator-only

**[CURRENT]** No segment carries transcription — enforced by test, so
commentary text can never be fabricated in this layer. Every span is
locator-grounded (folio) with a bounded editorial description. The UI
states this openly on every span display.

**[FACT]** Absence of a transcription is not evidence that the
commentary does not exist. The edition prints full commentary for
every covered verse; this repository has not imported it.

## 6. Pilot coverage

Eleven passage spans: the 13.2 nanu + resolution complex (4),
avataraṇikās 3/4/7 (3), 7.14 objection/response pair (2), 2.39 tail
(1), 18.61 māyā gloss (1). Thread grounding: A 5/5, B 3/5, C 3/5
steps. Concept grounding: 4/7 pilots (samuccaya 4, prakṛti/puruṣa/
māyā 1–2 each). Unit chunks carry zero span payloads (verified);
spans resolve from the data module, threads from the lazy tradition
chunk.

## 7. Unresolved limitations

1. Undifferentiated gloss prose has no spans (karman/jñāna/mokṣa
   occurrences cite unit level — correct per the rules).
2. The 11.26–30 निगद-pentad and range-closers (`॥ ८-११ ॥`) are
   observed but unmodelled (span semantics unverified).
3. Unparenthesised cross-quotes (e.g. नानारूपैः, printed p. 279)
   remain outside the quotation-edge set.
4. Excluded reference edges (~25, Phase-2 §12) stay excluded.
5. Half-numbered ab-halves need pāda collation before span-level
   citation (no span currently depends on one).
6. Per-system (not per-thread) progress and single-row thread index
   limitations from Phase 4 persist.

## 8. Rules for future segmentation

1. Print boundary or nothing: markers, openings, closers, numbered
   halves. Prose rhythm and OCR line-breaks never delimit.
2. One span, one boundary claim, stated in `note`.
3. Sanskrit bytes are never imported here; transcription arrives only
   through a dedicated, validated import phase.
4. Status required; `editorial` must say what was grouped and why.
5. Re-run the commentary audit and report counts, never scores.
