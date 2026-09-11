// Source provenance for the Devi Mahatmya corpus.
//
// Verified against the Drive PDF (814 pp, iLovePDF, "DurgaSaptashati.pdf"):
// "दुर्गासप्तशती गुप्तवत्यादिसप्तटीकासंवलिता" — Guptavati-adi sapta-tika
// edition. Per-adhyaya glosses in fixed order: (1) Guptavati,
// (2) Chaturdhari, (3) Shantanavi, (4) Nagojibhatti,
// (5) Jagacchandrachandrika, (6) Damshoddhara, plus (7) Chandraprabha
// in Hindi. The Rahasyas carry only Guptavati + Chandraprabha; the
// Vedokta Ratri, Nyasa-vidhi, Mantra-vibhaga tables and most Uttaranga
// stotras carry the Hindi rendering without verse-by-verse Sanskrit tika.
//
// This table is the per-section provenance for every verse entry
// (pre-existing Sadhana-Samara + Seven-Digest commentary untouched):
// it fixes WHERE each app section lives in the source so no source
// section is silently dropped and no existing id is renumbered.
// New entries in devi-mahatmya-verses-en-uttaranga*.ts carry their own
// per-verse interpretiveNotes citing these pages directly. With the
// Parishista set (uttaranga3) the table covers the full 814 pages.

export interface SourceSection {
  appIds: string;
  pdfPages: string;
  note: string;
}

export const deviMahatmyaSourceProvenance: SourceSection[] = [
  { appIds: 'Upodghata (Guptavati)', pdfPages: 'pp.1-30', note: 'Bhaskararaya Upodghata already paraphrased in devi-mahatmya-upodghata-en.ts (16 topics); Harikrishna Jyotirnava invocation pp.1-6 is a separate later work bound in the same file, not Devi tika.' },
  { appIds: 'dm-kavacha-* (51)', pdfPages: 'pp.31-46', note: 'Devi Kavaca with all seven glosses; viniyoga: Brahma rishi, Anushtubh, Chamunda devata.' },
  { appIds: 'dm-argala-* (5 groups, 1-27)', pdfPages: 'pp.47-54', note: 'Argala Stotra; two sampradaya-asammata verses flagged pp.50-51 and excluded from mula, as recorded in dm-argala-2 commentary.' },
  { appIds: 'dm-keelaka-* (4 groups, 1-14)', pdfPages: 'pp.55-61', note: 'Kilaka Stotra; both vulgate and edition wordings of 8-9 preserved as dm-keelaka-1/dm-keelaka-3 with recension note.' },
  { appIds: 'dm-guru-kilaka-* (new)', pdfPages: 'pp.62-64', note: 'Rahasya-tantra Guru-Kilaka-patala: dana-pratigraha unpinning rite; Hindi vidhi gloss p.63.' },
  { appIds: 'dm-ratri-vedokta-* (new)', pdfPages: 'pp.65-67', note: 'Vedokta Ratri Sukta RV 10.127.1-8 with viniyoga + Hindi; Tantrokta Ratri pp.66-67 footnoted to Adhyaya 1.53-67.' },
  { appIds: 'dm-prayoga-navarna/dhyana/mala/nyasa', pdfPages: 'pp.68-72', note: 'Navarna-vidhi (p.68), Saptashati-nyasa with three dhyana verses (p.71); already in prayoga file.' },
  { appIds: 'dm-mantra-vibhaga-note (new)', pdfPages: 'pp.73-83 + pp.693-695 + pp.795-814', note: 'Katyayani mantra-vibhaga + 19 sangraha-karikas (p.82) + Yamala-vichara + per-verse bija tables; Kanva dispute p.81.' },
  { appIds: 'dm-prayoga-* (6)', pdfPages: 'pp.84-115', note: 'Nagoji Prayoga-vidhi (purashcharana, homa counts, shatkarmas summarised not operationalised); carita rishi/chandas assignments p.115.' },
  { appIds: 'dm-1-* (20 groups)', pdfPages: 'pp.116-215', note: 'Adhyaya 1 (Prathama Carita).' },
  { appIds: 'dm-2-* (9 groups)', pdfPages: 'pp.216-275', note: 'Adhyaya 2.' },
  { appIds: 'dm-3-* (5 groups)', pdfPages: 'pp.276-306', note: 'Adhyaya 3.' },
  { appIds: 'dm-4-* (6 groups)', pdfPages: 'pp.307-349', note: 'Adhyaya 4.' },
  { appIds: 'dm-5-* (10 groups)', pdfPages: 'pp.350-430', note: 'Adhyaya 5 (Tantrokta Devi Sukta arth 5.7-36 per p.690 footnote).' },
  { appIds: 'dm-6-* (2 groups)', pdfPages: 'pp.431-450', note: 'Adhyaya 6.' },
  { appIds: 'dm-7-* (3 groups)', pdfPages: 'pp.451-471', note: 'Adhyaya 7.' },
  { appIds: 'dm-8-* (8 groups)', pdfPages: 'pp.472-523', note: 'Adhyaya 8.' },
  { appIds: 'dm-9-* (4 groups)', pdfPages: 'pp.524-552', note: 'Adhyaya 9.' },
  { appIds: 'dm-10-* (4 groups)', pdfPages: 'pp.553-576', note: 'Adhyaya 10.' },
  { appIds: 'dm-11-* (5 groups)', pdfPages: 'pp.577-634', note: 'Adhyaya 11 (Narayani Stuti).' },
  { appIds: 'dm-12-* (4 groups)', pdfPages: 'pp.635-664', note: 'Adhyaya 12 (Phalashruti).' },
  { appIds: 'dm-13-* (3 groups)', pdfPages: 'pp.665-684', note: 'Adhyaya 13.' },
  { appIds: 'dm-devisukta-* (8, Rgvedokta)', pdfPages: 'pp.687-689', note: 'Rgvedokta Devi Sukta RV 10.125 (mula-upadana); Uttara-nyasa pp.685-686 precedes it (mala-mantra + Sarvasvarupe-astra + vidyud-dama dhyana; short nyasa-vidhi of the same class as the p.71 nyasa already in the prayoga file, placed not duplicated).' },
  { appIds: 'dm-tantrokta-crossref (new)', pdfPages: 'pp.690-692', note: 'Tantrokta Devi Sukta 27 verses; arth footnoted to Adhyaya 5.7-36, placed not duplicated.' },
  { appIds: 'Tantra chatuhshloki (indexed)', pdfPages: 'pp.696-700', note: 'Mantra-count chatuhshloki ("brahmaiko bhagavan eko..."); counted in mantra-vibhaga totals, no separate verses.' },
  { appIds: 'dm-rahasya-* (3 digests, new)', pdfPages: 'pp.701-722', note: 'Rahasya-traya: Pradhanika 701-709, Vaikritika 710-717, Murti 718-722; Guptavati + Chandraprabha only.' },
  { appIds: 'dm-kshama-prarthana (new)', pdfPages: 'pp.723-724', note: 'Kshama-prarthana 6 verses.' },
  { appIds: 'dm-kshamapana-* (new)', pdfPages: 'pp.725-728', note: 'Shankaracharya Devyaparadha-kshamapana 12 verses, Hindi rendering.' },
  { appIds: 'dm-saptashloki (new)', pdfPages: 'pp.729-731', note: 'Saptashloki Durga: Shiva-Devi samvada frame + 7 excerpt verses + viniyoga (Narayana rishi).' },
  { appIds: 'dm-ashtottara-note (new)', pdfPages: 'pp.732-735', note: 'Durga Ashtottara-shata-nama (Vishvasara-tantra): 108 names in vv.2-15 + phala 16-21.' },
  { appIds: 'dm-dvatrimsha (new)', pdfPages: 'pp.736-738', note: 'Durga Dvatrimsha-namamala: 32 names + deva-prarthana frame + phala/vidhi.' },
  { appIds: 'dm-manasa-puja-note (new)', pdfPages: 'pp.739-744', note: 'Durga Manasa-puja (Tripurasundari): upachara verses with Hindi; condensed index.' },
  { appIds: 'dm-kunjika-* (new)', pdfPages: 'pp.745-747', note: 'Siddha-Kunjika (Rudrayamala/Gauri-tantra): Shiva-uvacha frame + mula-mantra + 8 verses + phala; Hindi.' },
  { appIds: 'dm-atharvashirsha-note (new)', pdfPages: 'pp.748-759', note: 'Devi-Atharvashirsha: explicitly non-shadanga per edition footnote, included for Atharva-mahatmya; condensed index.' },
  { appIds: 'dm-pitha-rahasya (new)', pdfPages: 'pp.760-762', note: 'Pitha-rahasya (Matsya-purana adhyaya 13): Suta-Devi samvada; Daksha question + sarvavyapi-uttara + 108 pitha-names + phala; frame/close verbatim, middle indexed.' },
  { appIds: 'dm-mahavidya-rahasya (new)', pdfPages: 'pp.763-769', note: 'Mahavidya-rahasya (Mahabhagavata Upapurana, ashtama adhyaya): Sati-Shiva Daksha-yajna samvada + bhayanaka-rupa + ten-direction stations + per-direction mapping + gopaniya close; key verses verbatim.' },
  { appIds: 'dm-kalika-mahatmya (new)', pdfPages: 'pp.770-774', note: 'Kalika-sthana-mahatmya-stuti (Skanda-purana Manasa-khanda 97/3-44): Shaila-kshetra praise + deva-stuti + Indra-sharanagati + Devi-pratijna + sthala-phala; edition footnote glosses Shaila/Jahnavi, cross-refs Saptashati 5/10, 5/84-88.' },
  { appIds: 'dm-laghu-saptashati (new)', pdfPages: 'pp.775-778', note: 'Laghu-Saptashati-stotra (Chandi-stotra, Prithvidhara via Shambhunatha/Siddhanatha): 18 verses + full viniyoga (Sadashiva rishi, Trimurti devata, chaturvidha-purushartha); frame/close verbatim, charita-smaranas digested.' },
  { appIds: 'dm-apaduddhara (new)', pdfPages: 'pp.779-780', note: 'Durga-apaduddhara-stotra complete: 9 refrain-verses ("trahi Durge") + phala 10-13 + jagadambarpaṇam; v.2 summarised, all else verbatim.' },
  { appIds: 'dm-kali-stotra (new)', pdfPages: 'pp.781-783', note: 'Kali-stotra (Kalirahasyoktam): 17 shardulavikridita verses, single kshamapana refrain; life-stage + failure bands digested, Mahavidya-identity + phala verbatim.' },
  { appIds: 'dm-shanti-stotra (new)', pdfPages: 'p.784', note: 'Shanti-stotra (Yamaloktam) complete: 9 verses, benediction then Bhairava/Shiva-ajna boundary; verbatim.' },
  { appIds: 'dm-pauranika-shanti (new)', pdfPages: 'p.785', note: 'Pauranika-shanti-mantras complete: 9 abhisheka-mantras (Trimurti/Chaturvyuha/Dikpala/Matri/graha/beings/astra/landscape, trivarga seal); verbatim.' },
  { appIds: 'dm-para-devi-sukta (new)', pdfPages: 'pp.786-789', note: 'Shri-para-devi-sukta-mala-mantra: viniyoga + six nyasa sets + Yogadhya-dhyana + mala-prarthana + 1000-name mala + phala 1-7; skeleton verbatim, name-body indexed by print-hundreds.' },
  { appIds: 'dm-siddha-samputa (new)', pdfPages: 'pp.790-794', note: 'Siddha-samputa-mantras: Hindi 700-unit intro + 30 numbered purpose-heads with adhyaya-excerpt verses; first/last verbatim, all 30 inventoried.' },
];
