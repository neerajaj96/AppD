# Bhagavad Gītā Rāmakaṇṭha Thread Ontology (Phase 4)

Three scholarly pilot threads with evidence-backed transitions. The
orientation thread is preserved untouched. Categories **[FACT]** /
**[CURRENT]** / **[PROPOSAL]** / **[OPEN]** follow the earlier
documents. Indian English throughout.

## 1. What a scholarly thread is

A scholarly thread answers *why this passage leads to the next* —
never a bare verse sequence. Every non-first step carries a
transition reason; every claim carries a source-backed/editorial
status; every step resolves to canonical units with KSTS numbers and
folios. Conceptual synthesis is labelled as synthesis and never
renders as quotation. Threads that cannot meet this bar do not ship
as scholarly (they ship as orientation, or not at all).

## 2. Thread types

Closed vocabulary (`ScholarlyThreadType`): `concept`, `argument`,
`cross-verse`, `chapter`, `doctrinal`, `recensional`. Threads are
additionally `orientation` (navigation) or `scholarly` (evidence).
The pilot set uses `argument` (Thread A), `concept` (Threads B, C).
Cross-verse, chapter, doctrinal and recensional threads are modelled
but unpopulated — populating them is explicitly future work.

## 3. Step model

`V2ThreadStep` gains optional `conceptIds[]`, `role` (12 closed
roles), `evidenceKind` (`direct`, `cross-reference`, `structural`,
`synthesis`), `claimStatus` (`source-backed`, `editorial`) and
`spanIds[]`. Claims and transitions live in localisations (both
languages, one sentence each). Orientation records predate the model:
all new checks fire only on present fields or `scholarly` kind, so
legacy output is byte-identical.

## 4. Transition model

Transitions name the intellectual move in Rāmakaṇṭha's order:
definition → question → programme → practitioner → fruit (Thread B);
premise → objection → response → distinction → conclusion (Thread A).
Admissible reasons: explicit quotation, printed cross-reference,
objection→response, definition→application, premise→conclusion,
concept recurrence with changed function, avatāraṇikā transition,
explicit commentary statement. "Related topic" is never sufficient.

## 5. Evidence hierarchy

`direct` (commentary/source passage), `cross-reference` (printed
locator), `structural` (chapter opening/closing relationship),
`synthesis` (editorial assembly, labelled). All fifteen pilot steps
are `direct` except the three avataraṇikā steps (`structural`).
Synthesis display is implemented in UI and validation but unpopulated
— no pilot step needed it.

## 6. Commentary-span model

`GitaPassageSpan` names only print-demarcated regions (nanu between
verse markers, avataraṇikās, glosses on unnumbered halves). Five
records: `gita-ps-13.2-nanu`, `gita-ps-3-avat`, `gita-ps-4-avat`,
`gita-ps-7-avat`, `gita-ps-18.61-maya`. No sentence boundaries are
invented; undifferentiated prose stays unspanned.

## 7. Pilot threads and exact evidence basis

**Thread A — The Knower in Every Field** (`argument`; Puruṣa,
Prakṛti, Jñāna, Māyā). Steps: 13.2 premise (śarīra=kṣetra, KSTS
13.1, f.277) → 13.3 objection (nanu span, svasiddhānta-virodha) →
13.3 response (KSTS 13.2 verse introduced parihartum) → 13.3
distinction (vedakatvamātra; distinction-knowledge is jñāna) → 13.3
conclusion (plurality as acintyeśvara-māyāśakti play, with an
explicit unresolved tail on the individuation mechanism).

**Thread B — Samuccaya: Teaching Object and Practitioner**
(`concept`; Samuccaya primary; Karman, Jñāna, Mokṣa secondary).
Steps: 2.38 definition (upadeśyatayā, f.38) → 3.1 question
(avataraṇikā non-ascertainment, f.61) → 4.1 programme
(abhidheya/prayojana, f.92) → 5.3 example (practitioner,
f.117) → 6.1 conclusion (mokṣaphala-samuccaya, f.135).

**Thread C — Māyā: Power, Appearance, Crossing** (`concept`; Māyā
primary; Jñāna, Mokṣa, Puruṣa, Prakṛti where supported). Steps: 7.14
definition (madīyā śakti) → 7.14 objection (vain teaching) → 7.14
response (prapatti through knowledge) → 13.3 distinction (same power
as differentiator — changed function recorded, not flattened) → 18.61
consequence (yantra medium, span-anchored).

## 8. Unresolved questions

1. Thread progress is stored per system (single index) across threads
   — switching threads shares the counter; per-thread progress is
   future work.
2. ThreadsIndex still lists one row per tradition (orientation
   default); scholarly threads surface via concept pages and the
   in-reader switcher.
3. Manifest `threadSteps` counts sum all threads (vedanta 18 → 33);
   counts are honest totals, not per-thread budgets.
4. Avataraṇikā/upodghāta steps borrow their opening unit ids with
   span anchors — sub-verse precision, not verse claims.
5. Half-numbered ab-halves (ch. 11 pattern) need pāda collation before
   any thread cites them as primary evidence (none currently does).

## 9. Rules for future thread creation

1. Thesis first: state the question in one sentence before collecting steps.
2. Five-step norm (±2); each non-first step needs a transition naming
   the move, each claim a status.
3. Units resolve through the concordance (KSTS + folio checked by
   test); spans only where print demarcates.
4. Concepts from the Phase-3 registry only; links never invented for
   thread convenience.
5. One unresolved marker per thread minimum where honesty requires
   it — preferably zero where the source closes cleanly.
6. Re-run the audit helper (`auditThreads`): report steps,
   source-backed share, transitions, unresolved, coverage.
7. Never compare Rāmakaṇṭha with Śaṅkara, never import later
   Śaiva doctrine, never summarise beyond the cited passages.
