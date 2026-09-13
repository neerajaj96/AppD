# Session Log — Devi-Mahatmya split, Malayalam parity, integrity fixes

Date: 2026-09-08. Branch: `main`, 21 commits ahead of `origin/main`
(`9d8766c` → HEAD). Working tree clean. NOT pushed (no GitHub
credentials in this environment). Push + Pages deploy left for next session.

## Commits (oldest → newest)

1. `535d956` refactor(devi-mahatmya): split caritas into 13 chapter files
   - New `src/content/devi-mahatmya/chapters/`:
     `devi-mahatmya-ch01.ts` … `ch13.ts` + `index.ts` barrel.
     Counts: ch01:20, ch02:9, ch03:5, ch04:6, ch05:10, ch06:2, ch07:3,
     ch08:8, ch09:4, ch10:4, ch11:5, ch12:4, ch13:3 (= 83 verses).
   - `devi-mahatmya-verses-en.ts` now merges chapters directly.
   - `carita1/2/3.ts` kept as backward-compat re-export shims.
   - Verified: 83/83 ids identical, order preserved, 0 dupes, all
     thread verseIds resolve.
2. `52f6a56` feat(devi-mahatmya): complete Malayalam verses (149/149)
   + `.opencodeignore` rewrite (was a PowerShell snippet, now clean patterns).
3. `8ebac62` chore: package-lock.json (generated via
   `npm install --package-lock-only`; full `npm install` FAILS in this
   sandbox — npm cacache `rename ENOENT`, tried fresh caches + maxsockets 1).
4. `181933d` fix(content): mimamsa ML mapper (read nonexistent
   `malayalamSutra` keys → all ML verse content was undefined; now reads
   real keys with fallbacks); retargeted 3 dangling prayoga conceptIds
   (`three-hymns-of-approach` → devi-kavaca/argala-stotra/keelaka-stotra,
   `phala-stuti` → `phalastuti`); deleted 8 orphans
   (root check*.ts, check-pdf.js, merge.ts, old_105.ts,
   root devi-mahatmya-verses-en.ts, `devi-mahatmya-verses-en (2).ts`).
5. `9b0f621` fix(content): vaisesika thread ML re-key (4/12 → 9/12);
   abhava typo (അഭാഗം → അഭാവം); nyaya book2-ml numbering-note header.
6. `426f1b2` feat(samkhya): ML verse 73 + pramanas/purusha-prakriti-union.
   Samkhya now 73/73 verses, 11/11 concepts.
7. `1b8724c` feat(yoga): 15 missing ML concepts → 19/19.
8. `f5a1dc8` feat(vaisesika): 3 remaining ML thread narratives → 12/12.
9. `c7b6b89` feat(mimamsa): 6 ML thread steps + 10 ML concepts → 37/37, 46/46.
10. `5a5ee22` feat(nyaya): book2 ML 2.1.2–2.1.7; apta-vakya→apta fix.
11. `5534484` feat(nyaya): Book 1 ML 1.1.23–41 + 1.2.1–20 → 61/61.
12. `c843ec6` feat(nyaya): Book 3 ML 145/145 (new file + merger wiring).
13. `cb1c6c0` feat(nyaya): Book 4 ML 94/94 (new file + merger wiring).
14. `f0f7973` feat(vedanta): Adhyaya 1–2 ML (290 sutras).
15. `6d4a091` feat(vedanta): Adhyaya 3–4 ML (262) → 552/552 total.
16. `bc4672b` feat(mimamsa): ML 1.1.1–23 (genuine Malayalam).
17. `7204df0` feat(mimamsa): fill Pada 1 ML 1.1.24–32 → Pada 1 complete.
18. `3279863` feat(mimamsa): fill Pada 4 ML (Namadheya).
19. `f889df7` feat(mimamsa): fill Pada 2.3 ML.
20. `ab6b3c2` feat(mimamsa): fill Pada 2.2 ML (karma-bheda proofs).
21. This log file.

## Parity / integrity status (verified with executed scripts)

- Devi-Mahatmya 149/149 verses, 21/21 concepts, 21/21 thread. No dupes,
  all verse↔concept + thread refs resolve.
- Samkhya 73/73, 11/11. Yoga verses 195/195, concepts 19/19, thread 13/13.
- Vaisesika verses 231/231, concepts 12/12, thread ML 12/12.
- Vedanta verses 552/552 ML; concepts 27/27.
- Nyaya verses EN 367 / ML 366 (book2: EN 67, ML 69 incl. ML-only 68–69;
  book2 numbering traditions diverge — documented in-file, do NOT renumber).
  Concepts 120/52. Thread 78/47.
- Mimamsa verses 224/224 ids; thread 37/37; concepts 46/46.
  ML empties remaining: 1.2 (53), 1.3 (20), 2.1 (19) = 92.
  NOTE: older ML entries are English (mislabeled); new entries are genuine ML.
- Kashmir Shaivism: verses EN-only by design (`ml: {}`); concepts/thread ML
  are placeholder stubs (~180 concepts). DECISION NEEDED: translate or keep.
- Vaisesika Adhyaya 2 has 0 sutras in both languages (file misnomer noted).
- Nyaya ML-only 2.1.68–69 (genuine vulgate sutras, no EN counterpart).

## Next session: resume here

1. Mimamsa empties: 2.1 (19) → 1.3 (20) → 1.2 (53). Fill in place
   (entries exist as shells; never append — ids must stay unique).
2. Kashmir decision (translate vs EN-only).
3. Push: `git push origin main` (needs auth — none in sandbox).
   CI runs `npm ci` + `tsc --noEmit` + `vite build`; Pages deploys via
   `.github/workflows/deploy.yml`. Local build was never verified
   (npm broken here) — watch the first CI run.
4. Scratch translation JSONs live in `/tmp/opencode/` (b3.json, b4.json,
   bs*.json, mm22.json — NOT in repo, will vanish with the sandbox).

## Conventions learned (must keep)

- RawVerseEn shape fixed (`src/types/content.ts`); factory overlays ML by id.
- Never renumber verse ids (thread/concept refs depend on them).
- ML files: match EN `devanagari`/`iast` exactly (same recension).
- `.gitignore` keeps package.json/package-lock.json/tsconfig.json committed.

## 2026-09-11 — Yoga Kashi traditional layer (verified vs source PDF)

- Source: Kashi Sanskrit Series No.83 (Yogashastra Sec.1), Dhundhiraj
  Shastri ed., Benares 1930 (Drive PDF, 246 pp.). Title page confirms the
  six tikas: Bhoja Rajamartanda, Bhava-Ganesa Pradipika, Nagoji Vrtti,
  Ramananda Maniprabha, Anantadeva Chandrika, Sadasivendra Yogasudhakar.
  Vyasa-bhasya is NOT among the six (only a mangala homage names Vyasa).
- `yoga-sutras-en`: +devanagari (195, bodies match ML `sanskrit`
  recension; Kashi press misprints like I.5 विष्टा / I.13 तन्त्र /
  I.14 दृभूमिः NOT adopted), +traditional commentary/keyPoints layer,
  +195 interpretiveNotes with corrected provenance (no false
  "pp.14-19/pp.20+" print-page claims — those were PDF indices;
  no Vyasa-bhasya claim; no circular "reads" quote).
- `yoga-sutras-ml`: +traditional പരമ്പരാഗതം layer on commentaries.
- REMOVED `bhoja-vritti` / `tikasatka-kashi` concepts (EN+ML):
  bibliography entries, not tattvas; zero inbound refs (orphans).
  Provenance lives in interpretiveNotes per data-model law.
- Verified: `tsc --noEmit` clean, `vite build` clean, 195 verses unique,
  52/52 concepts EN=ML, zero dangling/orphan refs, dev↔ML match.

## 2026-09-13 — Yoga Vivekananda enrichment (verified vs source PDF)

- Source: "Patanjali Yoga Sutras, Sanskrit text with Transliteration,
  Translation & Commentary by Swami Vivekananda" (Drive PDF, 143 pp.,
  Raja-Yoga 1895-96 New York lectures; public-domain text, downloaded
  + parsed: 194 sutra blocks I.1-51, II.1-54, III.1-56, IV.1-33).
- `yoga-sutras-en`: +1 "Vivekananda: ..." paragraph per commentary
  (195/195) +1 provenance interpretiveNote per verse. Paraphrased, no
  verbatim dumps; keyPoints untouched; ids/translations untouched.
- Recension alignment (by content, not number): app III.22-55 <->
  Viv III.23-56 (Viv counts "etena sabdady..." as its own III.22;
  folded into app III.21); app IV.17-34 <-> Viv IV.16-33 (Viv edition
  lacks "na caika-citta-tantram", noted in app IV.16); Viv skips
  II.55 (his own footnote; noted in app II.55). ML files untouched.
- Verified: `tsc --noEmit` clean, integrity suite 174/174 pass,
  `npm run build` clean.
