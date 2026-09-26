import type { V2Thread } from './schema';

/**
 * Rāmakaṇṭha scholarly pilot threads (Phase 4).
 *
 * Three evidence-backed intellectual paths, each step carrying role,
 * claim, transition reason, concepts, units, KSTS-resolvable evidence
 * and claim status. Claims and transitions are one sentence per
 * language, traceable to the cited passage — never free-form summary.
 * Merged into the tradition thread list by `adaptSystemThread` AFTER
 * the orientation thread, so legacy global step indices stay stable.
 */

const T = (enTitle: string, enSummary: string, mlTitle: string, mlSummary: string) => ({
  en: { title: enTitle, summary: enSummary },
  ml: { title: mlTitle, summary: mlSummary },
});

export const GITA_SCHOLARLY_THREADS: V2Thread[] = [
  {
    id: 'gita-rk-kshetra',
    traditionId: 'vedanta',
    textId: 'bhagavad-gita',
    title: 'The Knower in Every Field',
    kind: 'scholarly',
    scholarlyType: 'argument',
    localisations: T(
      'The Knower in Every Field',
      'How Rāmakaṇṭha moves from the body-as-field teaching through a one-knower objection to the single-knower resolution and its māyā-śakti ground (KSTS 13.1–13.2).',
      'എല്ലാ ക്ഷേത്രങ്ങളിലുമുള്ള ജ്ഞാതാവ്',
      'ശരീരം-ക്ഷേത്രം എന്ന ഉപദേശത്തിൽനിന്ന് ഏകജ്ഞാതൃ-ആക്ഷേപത്തിലൂടെ ഏകജ്ഞാതൃ-നിർണ്ണയത്തിലേക്കും മായാശക്തി-അടിസ്ഥാനത്തിലേക്കും രാമകണ്ഠൻ എങ്ങനെ നീങ്ങുന്നു (KSTS 13.1–13.2).',
    ),
    steps: [
      {
        id: 'gita-rk-kshetra-1',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-prakriti',
        conceptIds: ['gita-rk-prakriti'],
        unitIds: ['13.2'],
        spanIds: ['gita-seg-13.1-glosa', 'gita-seg-13.1-etat', 'gita-seg-13.1-tatparya'],
        role: 'premise',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The body is the field',
            claim: 'Rāmakaṇṭha establishes the body (śarīra) as the field (kṣetra) at KSTS 13.1.',
          },
          ml: {
            title: 'ശരീരം ക്ഷേത്രമാണ്',
            claim: 'ശരീരം ക്ഷേത്രമാണെന്ന് രാമകണ്ഠൻ സ്ഥാപിക്കുന്നു (KSTS 13.1).',
          },
        },
      },
      {
        id: 'gita-rk-kshetra-2',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-purusa',
        conceptIds: ['gita-rk-purusa', 'gita-rk-prakriti'],
        unitIds: ['13.3'],
        spanIds: ['gita-ps-13.2-nanu'],
        role: 'objection',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'One knower, many knowers?',
            claim: 'If the self is ultimately one percipient, the experienced per-field plurality of knowers looks contradictory — staged as apparent conflict with his own settled position.',
            transition:
              'The field-teaching raises the question the next verse was introduced to remove: who is the knower, if many are experienced?',
          },
          ml: {
            title: 'ഏക ജ്ഞാതാവ്, അനേക ജ്ഞാതാക്കൾ?',
            claim: 'പരമാർത്ഥത്തിൽ ഏക പ്രമാതാവെങ്കിൽ, ഓരോ ക്ഷേത്രത്തിലുമുള്ള അനേക ജ്ഞാതൃപ്രതീതി വിരുദ്ധമായി തോന്നുന്നു — സ്വസിദ്ധാന്തവിരോധമായി അവതരിപ്പിക്കുന്നു.',
            transition:
              'ക്ഷേത്രോപദേശം ചോദ്യം ഉയർത്തുന്നു: അനേകർ അനുഭവപ്പെടുമ്പോൾ ജ്ഞാതാവ് ആര്? ഇത് നീക്കാനാണ് അടുത്ത ശ്ലോകം.',
          },
        },
      },
      {
        id: 'gita-rk-kshetra-3',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-purusa',
        conceptIds: ['gita-rk-purusa', 'gita-rk-jnana'],
        unitIds: ['13.3'],
        spanIds: ['gita-seg-13.2-verse'],
        role: 'response',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Know Me as the knower',
            claim: 'KSTS 13.2 (kṣetrajñaṃ cāpi māṃ viddhi) is introduced expressly to remove the doubt.',
            transition: 'Authority answers first; Rāmakaṇṭha then gives the reason behind the verse.',
          },
          ml: {
            title: 'ക്ഷേത്രജ്ഞനായി എന്നെ അറിയുക',
            claim: 'സംശയം നീക്കാനായാണ് KSTS 13.2 (ക്ഷേത്രജ്ഞം ചാപി മാം വിദ്ധി) അവതരിപ്പിക്കുന്നത്.',
            transition: 'ആദ്യം പ്രമാണം; പിന്നെ ശ്ലോകത്തിന് പിന്നിലെ യുക്തി.',
          },
        },
      },
      {
        id: 'gita-rk-kshetra-4',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-purusa',
        conceptIds: ['gita-rk-purusa', 'gita-rk-prakriti', 'gita-rk-jnana'],
        unitIds: ['13.3'],
        spanIds: ['gita-seg-13.2-resolution', 'gita-seg-13.2-sarvaksetra'],
        role: 'distinction',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Mere knowership is the mark',
            claim: 'Unfailing knowership alone (vedakatvamātra) marks ātman; plurality belongs to known bodies, and this distinction-knowledge is jñāna itself.',
            transition: 'From authority to reason: the lakṣaṇa that dissolves the objection.',
          },
          ml: {
            title: 'വേദകത്വം മാത്രമാണ് ലക്ഷണം',
            claim: 'വ്യഭിചരിക്കാത്ത വേദകത്വം മാത്രമാണ് ആത്മാവിന്റെ ലക്ഷണം; ബഹുത്വം ജ്ഞേയശരീരങ്ങൾക്കാണ് — ഈ വിവേകം തന്നെയാണ് ജ്ഞാനം.',
            transition: 'പ്രമാണത്തിൽനിന്ന് യുക്തിയിലേക്ക്: ആക്ഷേപം തീർക്കുന്ന ലക്ഷണം.',
          },
        },
      },
      {
        id: 'gita-rk-kshetra-5',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya', 'gita-rk-purusa'],
        unitIds: ['13.3'],
        spanIds: ['gita-seg-13.2-resolution'],
        role: 'conclusion',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Plurality as māyā-śakti play',
            claim: 'Per-body difference is the play of inconceivable Īśvara-māyā-śakti, taught for setting aside — addressed, through Arjuna, to the awakened. How individuation works beyond this is not explained here.',
            transition: 'From metaphysics to address: for whom the teaching is spoken.',
          },
          ml: {
            title: 'മായാശക്തിലീലയായി ബഹുത്വം',
            claim: 'ഓരോ ശരീരത്തിലുമുള്ള ഭേദം അചിന്ത്യമായ ഈശ്വരമായാശക്തിയുടെ ലീലയാണ് — ഉപേക്ഷിക്കാൻ ഉപദേശിക്കുന്നു; ഉണർന്നവരോട് അർജ്ജുനൻമുഖേന. വ്യക്തിവൽക്കരണം എങ്ങനെയെന്ന് ഇവിടെ വിശദീകരിക്കുന്നില്ല.',
            transition: 'തത്ത്വത്തിൽനിന്ന് സംബോധനയിലേക്ക്: ആർക്കാണ് ഉപദേശം.',
          },
        },
      },
    ],
  },
  {
    id: 'gita-rk-samuccaya-marga',
    traditionId: 'vedanta',
    textId: 'bhagavad-gita',
    title: 'Samuccaya: Teaching Object and Practitioner',
    kind: 'scholarly',
    scholarlyType: 'concept',
    localisations: T(
      'Samuccaya: Teaching Object and Practitioner',
      'How Rāmakaṇṭha establishes the knowledge-action conjunction: ascertained as teachable, questioned, programmed, embodied, and fruited.',
      'സമുച്ചയം: ഉപദേശവിഷയവും അനുഷ്ഠാതാവും',
      'ജ്ഞാന-കർമ്മസമുച്ചയത്തെ രാമകണ്ഠൻ എങ്ങനെ സ്ഥാപിക്കുന്നു: നിശ്ചയിക്കപ്പെട്ടത്, ചോദിക്കപ്പെട്ടത്, പരിപാടിയാക്കപ്പെട്ടത്, മാതൃകയാക്കപ്പെട്ടത്, ഫലിച്ചത്.',
    ),
    steps: [
      {
        id: 'gita-rk-samuccaya-1',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya'],
        unitIds: ['2.38'],
        spanIds: ['gita-seg-2.39-tail'],
        role: 'definition',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The conjunction ascertained',
            claim: 'Closing 2.38–39, Rāmakaṇṭha ascertains jñāna-kriyā-samuccaya as the teachable content.',
          },
          ml: {
            title: 'സമുച്ചയം നിശ്ചയിക്കപ്പെട്ടു',
            claim: '2.38–39 സമാപിക്കുമ്പോൾ ജ്ഞാനക്രിയാസമുച്ചയത്തെ ഉപദേശവിഷയമായി രാമകണ്ഠൻ നിശ്ചയിക്കുന്നു.',
          },
        },
      },
      {
        id: 'gita-rk-samuccaya-2',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya', 'gita-rk-karman'],
        unitIds: ['3.1'],
        spanIds: ['gita-ps-3-avat'],
        role: 'question',
        evidenceKind: 'structural',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Arjuna asks from non-ascertainment',
            claim: 'The chapter-3 gateway has Arjuna ask (3.1) precisely because he has not ascertained which of separately-praised knowledge and action to take up.',
            transition: 'From definition to the question it provokes: non-ascertainment drives the dialogue.',
          },
          ml: {
            title: 'അനിശ്ചയത്തിൽനിന്നുള്ള ചോദ്യം',
            claim: 'വെവ്വേറെ പ്രശംസിക്കപ്പെട്ട ജ്ഞാന-കർമ്മങ്ങളിൽ ഏതെടുക്കണമെന്ന് നിശ്ചയിക്കാത്തതിനാലാണ് അദ്ധ്യായം 3 മുഖവുരയിൽ അർജ്ജുനൻ ചോദിക്കുന്നത് (3.1).',
            transition: 'നിർവ്വചനത്തിൽനിന്ന് അതുണർത്തുന്ന ചോദ്യത്തിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-samuccaya-3',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya', 'gita-rk-moksa'],
        unitIds: ['4.1'],
        spanIds: ['gita-ps-4-avat'],
        role: 'distinction',
        evidenceKind: 'structural',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Subject matter and fruit declared',
            claim: 'The chapter-4 gateway names samuccaya the abhidheya of the whole prakaraṇa and supreme Self-attainment its prayojana.',
            transition: 'From question to programme: what the teaching is, and what it is for.',
          },
          ml: {
            title: 'വിഷയവും ഫലവും പ്രഖ്യാപിച്ചു',
            claim: 'അദ്ധ്യായം 4 മുഖവുര സമുച്ചയത്തെ പ്രകരണത്തിന്റെ അഭിധേയവും പരമാത്മസമാപത്തിയെ പ്രയോജനവുമായി പ്രഖ്യാപിക്കുന്നു.',
            transition: 'ചോദ്യത്തിൽനിന്ന് പരിപാടിയിലേക്ക്: ഉപദേശം എന്ത്, എന്തിന്.',
          },
        },
      },
      {
        id: 'gita-rk-samuccaya-4',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya', 'gita-rk-karman'],
        unitIds: ['5.3'],
        role: 'example',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The practitioner ever-renounced',
            claim: 'The samuccaya-practitioner, even while performing actions, is to be known as perpetually renounced.',
            transition: 'From programme to practitioner: who embodies the conjunction.',
          },
          ml: {
            title: 'നിത്യസന്നാസിയായ അനുഷ്ഠാതാവ്',
            claim: 'പ്രവർത്തിച്ചുകൊണ്ടും സമുച്ചയാനുഷ്ഠാതാവ് നിത്യസന്നാസിയായി അറിയപ്പെടുന്നു.',
            transition: 'പരിപാടിയിൽനിന്ന് മാതൃകയിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-samuccaya-5',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya', 'gita-rk-karman', 'gita-rk-moksa'],
        unitIds: ['6.1'],
        role: 'conclusion',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Unclaimed action as yoga',
            claim: 'Unclaimed prescribed action is itself renunciation and yoga, under the discipline whose fruit is release.',
            transition: 'From practitioner to fruit: the discipline and what it yields.',
          },
          ml: {
            title: 'യോഗമായി ഉപേക്ഷിക്കപ്പെട്ട കർമ്മം',
            claim: 'ഫലം ആഗ്രഹിക്കാത്ത വിഹിതകർമ്മം തന്നെ സന്നാസവും യോഗവുമാണ് — മോചനം ഫലമാകുന്ന അനുഷ്ഠാനത്തിൽ.',
            transition: 'മാതൃകയിൽനിന്ന് ഫലത്തിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-samuccaya-6',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-samuccaya',
        conceptIds: ['gita-rk-samuccaya', 'gita-rk-karman'],
        unitIds: ['13.26'],
        spanIds: ['gita-seg-13.25-samuccaya'],
        role: 'example',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The ascending stage as conjunction',
            claim: 'Karma-yoga, though conjunction-formed with action predominating, is the ascending stage of the same discipline.',
            transition: 'From practitioner to stage: where action-predominance still belongs.',
          },
          ml: {
            title: 'സമുച്ചയമായി ആരുരുക്ഷുദശ',
            claim: 'കർമ്മപ്രധാനമായ സംയോഗരൂപത്തിലും കർമ്മയോഗം അതേ അനുഷ്ഠാനത്തിന്റെ ആരുരുക്ഷുദശയാണ്.',
            transition: 'സാധകനിൽനിന്ന് ദശയിലേക്ക്: കർമ്മപ്രാധാന്യത്തിന് ഇടമുള്ളത് എവിടെ.',
          },
        },
      },
    ],
  },
  {
    id: 'gita-rk-maya-marga',
    traditionId: 'vedanta',
    textId: 'bhagavad-gita',
    title: 'Māyā: Power, Appearance, Crossing',
    kind: 'scholarly',
    scholarlyType: 'concept',
    localisations: T(
      'Māyā: Power, Appearance, Crossing',
      'How one power functions three ways: the Lord\u2019s sportive nature, the differentiator of experience, and the cosmic machine-medium — crossed only by resort through knowledge.',
      'മായ: ശക്തി, തോന്നൽ, തരണം',
      'ഒരേ ശക്തി മൂന്ന് നിലകളിൽ: ഭഗവാന്റെ ലീലാസ്വഭാവം, അനുഭവഭേദകാരണം, പ്രപഞ്ചയന്ത്രമാദ്ധ്യമം — ജ്ഞാനപൂർവ്വമായ ശരണംകൊണ്ടുമാത്രം തരണം.',
    ),
    steps: [
      {
        id: 'gita-rk-maya-1',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya'],
        unitIds: ['7.14'],
        role: 'definition',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'His own power, hard to cross',
            claim: 'Māyā is the Lord\u2019s own power (madīyā śakti), sportive by nature and hard to cross, unreal yet appearing real.',
          },
          ml: {
            title: 'സ്വന്തം ശക്തി, കടക്കാൻ പ്രയാസം',
            claim: 'മായ ഭഗവാന്റെ സ്വന്തം ശക്തിയാണ് (മദീയാ ശക്തിഃ) — ലീലാസ്വഭാവം, ദുരത്യയ, അസത്യമായിട്ടും സത്യമായി തോന്നുന്നത്.',
          },
        },
      },
      {
        id: 'gita-rk-maya-2',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya', 'gita-rk-moksa'],
        unitIds: ['7.14'],
        spanIds: ['gita-seg-7.14-q2'],
        role: 'objection',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Would teaching then be vain?',
            claim: 'If māyā cannot be crossed by anyone, the entire release-path teaching would be pointless.',
            transition: 'From definition to the doubt it provokes: an uncrossable power voids instruction.',
          },
          ml: {
            title: 'ഉപദേശം വ്യർത്ഥമാകുമോ?',
            claim: 'മായയെ ആർക്കും കടക്കാനാവില്ലെങ്കിൽ മോചനമാർഗ്ഗോപദേശം മുഴുവൻ വ്യർത്ഥമാകും.',
            transition: 'നിർവ്വചനത്തിൽനിന്ന് സംശയത്തിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-maya-3',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya', 'gita-rk-jnana', 'gita-rk-moksa'],
        unitIds: ['7.14'],
        spanIds: ['gita-seg-7.14-response'],
        role: 'response',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'Resort through knowledge',
            claim: 'Resort (prapatti) through knowledge ending in non-difference crosses what effort cannot — so the teaching stands.',
            transition: 'From doubt to resolution: knowledge, not flight.',
          },
          ml: {
            title: 'ജ്ഞാനപൂർവ്വമായ ശരണം',
            claim: 'അഭേദത്തിൽ അവസാനിക്കുന്ന ജ്ഞാനത്തോടുകൂടിയ ശരണം (പ്രപത്തി) പ്രയത്നത്താൽ അസാധ്യമായത്മായത് കടക്കുന്നു.',
            transition: 'സംശയത്തിൽനിന്ന് പരിഹാരത്തിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-maya-4',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya', 'gita-rk-purusa', 'gita-rk-prakriti'],
        unitIds: ['13.3'],
        spanIds: ['gita-seg-13.2-resolution'],
        role: 'distinction',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The differentiator of experience',
            claim: 'The same power, as inconceivable Īśvara-māyā-śakti, accounts for per-body difference of experience — metaphysical function here, not obstacle.',
            transition: 'From obstacle to principle: the same power explains plurality.',
          },
          ml: {
            title: 'അനുഭവഭേദകാരണം',
            claim: 'അതേ ശക്തി, അചിന്ത്യമായ ഈശ്വരമായാശക്തിയായി, ഓരോ ശരീരത്തിലെയും അനുഭവഭേദത്തിന് കാരണം — ഇവിടെ തത്ത്വം, തടസ്സമല്ല.',
            transition: 'തടസ്സത്തിൽനിന്ന് തത്ത്വത്തിലേക്ക്.',
          },
        },
      },
      {
        id: 'gita-rk-maya-5',
        textId: 'bhagavad-gita',
        conceptId: 'gita-rk-maya',
        conceptIds: ['gita-rk-maya'],
        unitIds: ['18.61'],
        spanIds: ['gita-ps-18.61-maya'],
        role: 'consequence',
        evidenceKind: 'direct',
        claimStatus: 'source-backed',
        localisations: {
          en: {
            title: 'The machine-medium',
            claim: 'As machine-power (yantra), māyā is the medium through which Īśvara, dwelling in hearts, moves all beings.',
            transition: 'From principle to cosmos: the power that moves the machine.',
          },
          ml: {
            title: 'യന്ത്രമാദ്ധ്യമം',
            claim: 'യന്ത്രശക്തിയായി മായ ഹൃദയങ്ങളിൽ വസിക്കുന്ന ഈശ്വരൻ സർവ്വഭൂതങ്ങളെയും ചലിപ്പിക്കുന്ന മാദ്ധ്യമമാണ്.',
            transition: 'തത്ത്വത്തിൽനിന്ന് പ്രപഞ്ചത്തിലേക്ക്.',
          },
        },
      },
    ],
  },
];

/** Scholarly threads per tradition, merged after the orientation thread. */
export const EXTRA_TRADITION_THREADS: Record<string, V2Thread[]> = {
  vedanta: GITA_SCHOLARLY_THREADS,
};
