# Bhagavad Gītā Rāmakaṇṭha Concept Ontology (Phase 3)

Pilot layer: seven source-grounded concepts with evidence-backed
occurrences and typed relationships. Nothing here replaces the
twenty-five legacy project concepts, which are retained and explicitly
marked. Categories **[FACT]** / **[CURRENT]** / **[PROPOSAL]** /
**[OPEN]** follow the architecture document. Indian English throughout.

## 1. Ontology rules

1. **Frequency is not ontology.** Raw counts (कर्म 1001, ज्ञान 870)
   motivated investigation only; every pilot below earned its place
   through explanatory role, distinctions, and argument participation.
   Counter-example applied in this phase: अद्वैत (4 hits, compounds
   only) was rejected as a pilot despite its modern prestige.
2. **Three layers never collapse.** Layer A (source term, e.g. `कर्म`)
   → Layer B (normalised label, e.g. `Karman`) → Layer C
   (interpretation, always inside an occurrence/link note with
   evidence). `V2SourceTerm.kind` records which layer each form
   belongs to: `attested`, `normalised`, `translated`, `inferred`.
3. **Occurrences, not id lists.** Each occurrence carries canonical
   unit, source term, commentary context, folio (evidence page), and
   notes; KSTS numbers resolve through `gitaPageMap`. Opening-matter
   evidence (avataraṇikā, upodghāta) carries an explicit folio plus an
   `unmappedReason` instead of borrowing a verse number.
4. **Relationships need reasons.** Every `conceptLinks` entry carries
   supporting units and/or a note. Co-occurrence never justifies a
   link. All pilot links are in-text; cross-tradition links stay
   forbidden until source evidence exists.
5. **Project English is not Rāmakaṇṭha.** Legacy summaries, however
   learned, are `legacy-project`. English/Malayalam pilot labels are
   editorial (normalised transliteration, standard Malayalam scholarly
   terms); only Devanagari `attested` forms and brief verbatim
   pratīka quotes count as source voice.
6. **Unresolved stays visible.** Null speaker labels, missing halves,
   disagreeing reference numbers, and the `पु.` siglum are recorded,
   never smoothed over.

## 2. Pilot selection (evidence, not prestige)

| Concept | Why it qualifies |
|---|---|
| Karman | Thesis axis: niṣṭhā assignment (3.3), sannyāsa-as-action (5.1, 6.1), knowledge-grounded agency (2.47). Four chapters. |
| Jñāna | Paired axis: defined at 13.3, grounds action (2.47), liberates with vijñāna (9.1, 10.11). Four chapters. |
| Samuccaya | Attested technical term (not an editorial summary): intro matter + ch. 3/4/7 avatāraṇikās + 2.38 gloss + practitioner category at 5.3. Answers the §6 investigation below. |
| Prakṛti | kṣetra doctrine (13.2), aparā/parā analysis (7.4–7.5), māyā-śakti link. Two chapters, explicit distinctions. |
| Puruṣa | Single-percipient argument (13.3), kṣara/akṣara/puruṣottama arc (15.16–18). Two chapters. |
| Māyā | Śaiva exposition with double objection (7.14), technical identification with śakti, machine-power (18.61–62). Three chapters. |
| Mokṣa | Stated prayojana (upodghāta apavarga), defended teaching (7.14), participation doctrine (9.33), liberating knowledge (9.1). |

Rejected or deferred with reason: Advaita (compounds only, no
 freestanding exposition); Bhakti/Prapatti (distinctive but folded
into Māyā/Mokṣa evidence this round — named next); Īśvara/Maheśvara
(pervasive epithet, needs its own relation study — named next);
Sarvajñatva (sharp 13.1-upodghāta evidence, narrow range — named
next); Pramātṛ (technical, twelve pages including the 13.3
resolution — named next; its vocabulary already supports Puruṣa).

### The samuccaya investigation (§6 of the task)

1. **Where**: intro discussion + ch. 3 avataraṇikā
   (`समुच्चयार्थमनवधार्य`), ch. 4 avataraṇikā
   (`ज्ञानकर्मसमुच्चयलक्षणमभिधेयं`), ch. 7 avataraṇikā
   (`ज्ञानकर्मसमुच्चयरूपस्य`), 2.39 close
   (`ज्ञानक्रियासमुच्चयमेव उपदेश्यतया`), 5.3
   (`समुच्चयानुष्ठाता`), 6.1 (`मोक्षफलसमुच्चयानुष्ठान`).
2. **How explained**: as the single teachable content and the
   practitioner's standing (acting yet ever-renounced).
3. **Verses connected**: 2.38–40, 3.1, 4.1 (gateway), 5.3, 6.1, 7.1 (gateway).
4. **Contrast**: Arjuna's non-ascertainment (ch. 3 gateway) and the
   karma-tyāga opposition (5.1); no named rival school refuted here.
5. **Exact expression**: yes — `समुच्चय`, `ज्ञानकर्मसमुच्चय`,
   `ज्ञानक्रियासमुच्चय` all printed verbatim.
6. **Intro vs commentary**: consistent — gateway prose and verse
   glosses use it identically.
Conclusion: samuccaya is Rāmakaṇṭha's attested thesis-term, scoped to
the evidenced occurrences — not a universal doctrine label.

## 3. Pilot records and evidence chains

Each record (`src/content/vedanta/bhagavad-gita/gita-ramakantha-concepts.ts`,
flowing through factory → adapters → chunks) answers the §7
questions; three complete chains are worked here, the rest are
structurally identical in the data.

**Chain 1 — Karman at 2.47.** Concept `gita-rk-karman` → source term
`कर्मन्` (normalised; attested `कर्मण्यधिकारोऽस्तु` quoted) →
canonical `2.47` → KSTS `2.48` → printed folio 44 → pratīka gloss
(tattvajñāna-upapatti grounds karma-adhikāra) → relation
`commentary`. The gloss makes agency follow Self-recognition
(`अद्वैतचिन्मयज्योतीरूपं परं तत्त्वमहम्`), which is also the
presupposition evidence for the Karman→Jñāna link.

**Chain 2 — Māyā at 7.14.** Concept `gita-rk-maya` → `माया`
(attested; `असती अपि सत्यवदाभासयन्ती` quoted) → canonical `7.14` →
KSTS `7.14` → folio 165 → double-nanu exposition → relation
`commentary`. First objection (whose guṇas?) answered by
śakti-identification (`मदीया शक्तिः`, devanāt/krīḍanāt, duratyayā);
second objection (vain teaching) answered by prapatti-through-jñāna.

**Chain 3 — Puruṣa at 13.3.** Concept `gita-rk-purusa` → `वेदक`
(attested) → canonical `13.3` → KSTS `13.2` (concordance offset) →
folio 278 → nanu-resolution gloss → relation `commentary`. One
unfailing knowership against manifold known bodies; plurality
reassigned to `अचिन्त्येश्वरमायाशक्ति` play — the same passage that
evidences the Prakṛti↔Puruṣa contrast and the Jñāna→Prakṛti
explanation links.

**Relationships (4, all evidenced):** Karman —presupposes→ Jñāna
[2.47]; Samuccaya —leads-to→ Mokṣa [4.1, 6.1]; Prakṛti
—contrasts-with→ Puruṣa [13.3]; Jñāna —explains→ Prakṛti [13.3].

## 4. Legacy audit (all twenty-five, §12 of the task)

Verdict classes: **keep-useful** (navigation/entry value, marked
legacy), **flagged** (contains a claim Phase-1/2 evidence contradicts
or fails to support — content untouched, correction deferred with the
note below).

| Concept | Verdict |
|---|---|
| gita-samuccaya | keep-useful; overlaps pilot `gita-rk-samuccaya` without its evidence discipline. Flag: "Against Abhinava's lean" is an unattributed comparative claim. |
| gita-atmaivedam | keep-useful; verse-anchored (6.29–30, 9.4, 15.15) but pratyabhijñā framing is editorial. |
| gita-shaiva-maya | keep-useful. Flag: Spanda-Kārikā-46 cross-quotation runs opposite to sampled evidence (no Spanda quotations found in commentary). |
| gita-mangala-upodghata | keep-useful. Flag: "eight maṅgala stanzas" vs seven numbered verses found (§1.3). |
| gita-prastavana | keep-useful; gateway/closing structure confirmed (§1.3, §1.8). |
| gita-recension | keep-useful. Flags: "13.1's extra question (Kashmir Ch.13 = 35)" contradicts Phase-2 (34, no question); "prefixed half-verse at 2.11" understates a full six-pāda extra verse; appendix page "431" is the PDF number (printed 421). |
| gita-lineage | keep-useful. Flag: "Avantivarman court" appears in no inspected evidence (Utpaladeva pupilship and Nārāyaṇa family do). |
| gita-visada … gita-moksa (15 adhyāya labels: visada, sankhya, karma, jnana, sannyasa, dhyana, vijnana, aksara, rajaguhya, vibhuti, vishvarupa, bhakti, guna, purusottama, daivasura, shraddha + moksa) | keep-useful chapter-navigation labels, several usefully pointing at adhika units. |
| gita-ksetra | keep-useful. Flag: "Kashmir's extra opening question" repeats the inverted 13.1 claim corrected in Phase 2. |
| gita-jnana, gita-karma, gita-bhakti, gita-purusottama | keep-useful; topical neighbours of pilots `gita-rk-jnana`, `gita-rk-karman`, `gita-rk-purusa` without shared ids (no merge). |

No legacy record was edited, split, or deleted. All carry
`status: legacy-project` (backfilled in curation, files untouched) and
render a quiet licence line in ConceptDetail.

## 5. Unresolved issues

1. Avataraṇikā/upodghāta occurrences have folios but no verse
   numbers by design (`unmappedReason`); commentary-span precision is
   pending segmentation (§9 of the task).
2. Half-numbered ab-halves (ch. 11 pattern) need pāda-level collation
   before any occurrence cites them.
3. The `स.` siglum glimpsed on printed p. 332 (15.16 footnote) may be
   extraction noise for ख./क. — unconfirmed, set untouched.
4. Excluded quotation edges (~25, §12 of Phase 2) stay excluded;
   several could become occurrence-supporting quotes later.
5. Occurrence context/note strings are English-only (precedent:
   interpretiveNotes); Malayalam evidence prose is future work.
6. Cross-tradition links: none created (notably no Sāṅkhya/Pratyabhijñā
   edges despite tempting terminology) — awaiting explicit source
   references.

## 6. Scaling rules for future concepts
1. Attested term first: no Devanagari form found in print, no concept.
2. Three occurrences minimum across at least two chapters, each with
   commentary engagement verified (verse-presence alone insufficient).
3. Every occurrence resolves: unit exists, KSTS number in the
   concordance (or explicit folio + reason).
4. Every link carries units and/or a note naming the passage.
5. New alias spellings must not collide with another pilot's alias.
6. Definitions stay inside the evidence: each sentence traceable to an
   occurrence; Layer-C claims carry attribution in notes.
7. Re-audit against this document's §4 table before widening any pilot.

## 7. Implementation notes (Phase 3 commit)

- Pilot records live in the content pipeline
  (`gita-ramakantha-concepts.ts` → factory → adapters → chunks), not
  in curation: alias validation runs against adapted corpora, so
  targets must exist before curation. Curation only backfills
  `legacy-project` status onto the twenty-five legacy records.
- Global schema updated explicitly (`src/types/content.ts` Concept
  gains `status`, `sourceTerms`, `occurrences`, `conceptLinks`;
  factory `RawConcept` and `adaptConcept` carry them to V2).
- Validation warnings 484 → 486: two new `alias-ambiguous` warnings
  (`maya`, `purusha` now name a verified Gītā pilot plus an inert
  review-row candidate elsewhere) — honest ambiguity by design, not
  errors. All other figures unchanged (evidence audit identical).
- Malayalam titles/summaries are editorial scholarly terms; occurrence
  context/note strings stay English (precedent: interpretiveNotes).
- The `relatedUnitIds`/`relatedConceptIds` arrays are derived from
  occurrences/links at curation time and verified equal by test, so
  the graph, search and defining-verse sections work unchanged.
