# Inserts authored EN keyPoints into every verse of tantraloka-verses-en.ts.
# Run from repo root: python3 scripts/add-tl-keypoints.py
import io, sys

KP = {
"TL-01-01": ["Anuttara is self-luminous consciousness needing no higher witness.", "Creation is visarga: perfect outpouring that never leaves stillness."],
"TL-01-02": ["Cit-pratibhā: pre-conceptual creative intuition grounds all thought.", "Para holds knower, means, known and result as one full nature."],
"TL-01-03": ["Apara governs duality: each perception a lightning-flash in Maya's dark.", "Action-power (kriyāśakti) works suddenly, locally, then vanishes."],
"TL-01-04": ["Parapara is discerning knowledge burning the three malas.", "Short of cosmic bliss, every lesser bliss counts as opposition."],
"TL-01-05": ["One triad unfolds as freedom, will-to-emit, and succession itself.", "Both mappings agree: Anuttara needs no witness beyond itself."],
"TL-01-06": ["Gaṇeśa governs in-breath and the senses; invoked first, reinterpreted in Trika terms.", "Scattered senses harmonised first; then consciousness's ocean can stir."],
"TL-01-07": ["Macchanda's net of Maya is red with attachment and full of knots.", "The outer path itself is the trap; the text will teach the inner one."],
"TL-01-08": ["The Traiyambaka lineage steers the boat across scripture's ocean.", "Authority flows through living helmsmen, not texts alone."],
"TL-01-09": ["Salutation to Śrīkaṇṭha, Maheśvara and Bhūtirāja.", "The teaching descends through named, worshipped persons."],
"TL-01-10": ["Utpaladeva's outflow, awakened by Somānanda, spreads everywhere.", "Recognition (pratyabhijñā) lineage is the text's philosophical root."],
"TL-01-11": ["Lakṣmanagupta's intellect hums, bee-like, drunk on relish.", "True understanding tastes; commentary is savouring, not dissecting."],
"TL-01-12": ["Cukhulaka mastered every scripture's meaning and rests in bliss.", "Mastery ends in rest, and rest grants the student's longing."],
"TL-01-13": ["Śambhunātha with his Lady draws the universe out of ignorance.", "Even profound teachings become clear through the living master."],
"TL-01-14": ["No ritual manual exists for Anuttara-Trika procedure.", "This treatise fills a genuine gap; it is not one more handbook."],
"TL-01-15": ["Composed at disciples' repeated request: clear and complete in meaning.", "The text answers a community's need, not authorial ambition."],
"TL-01-16": ["Abhinavagupta's awakening came from attendance on the lineage.", "Lineage is antidote: poison of isolation cured by transmission."],
"TL-01-17": ["Nothing here untaught by the Mālinīvijayottara, expressly or by hint.", "Originality claimed only in clarification, never in invention."],
"TL-01-18": ["Scripture in tens, eighteens, sixty-fours; Trika is the essence, Mālinīmata its essence.", "A hierarchy of revelation narrows to this text's source."],
"TL-01-19": ["At the master's command, the unseen inside it is brought to light.", "The outsider-scholar misses what the insider is ordered to reveal."],
"TL-01-20": ["His name itself records accomplishment through the Three-Eyed One's feet.", "Identity as attainment: the author is his own first evidence."],
"TL-01-21": ["The reader is asked to examine the author's opened heart-lotus.", "The text offers itself for worshipful scrutiny, not blind faith."],
"TL-01-22": ["Ignorance causes transmigration; knowledge alone liberates.", "All scriptures agree on this frame; the dispute is only what each means."],
"TL-01-23": ["Impurity (mala) is ignorance: the sprout's soil, per Mālinīvijayottara.", "Bondage has a technical name and a quoted source."],
"TL-01-24": ["'Sprout' rules out merely intellectual knowledge arriving after bondage.", "Liberation-knowledge must precede and uproot, not decorate, the fettered state."],
"TL-01-25": ["Ignorance is not blank absence — else clods would transmigrate.", "A precise definition must exclude the merely insentient."],
"TL-01-26": ["Ignorance is incomplete knowledge: the knowable not disclosed in totality.", "Śiva-sūtra's verdict turns 'not-knowing' into 'mis-knowing'."],
"TL-01-27": ["'Self is consciousness' plus 'knowledge is bondage', jointly and severally.", "The two sūtras together fence the whole doctrine."],
"TL-01-28": ["Caitanya names unconditioned freedom; the second sūtra's 'knowing' means limited instruments.", "Same root, two senses: free light versus contracted act of knowing."],
"TL-01-31": ["Liberation is not a separate thing apart from the free Self.", "No second reality is manufactured; freedom is recognised, not produced."],
"TL-01-32": ["Knowledge of the knowable comes in degrees; each degree quells matching bondage.", "Partial truth liberates partially — a scale, not a switch."],
"TL-01-33": ["'I am unstained, empty, no agent' — each frees only its own measure.", "Negations liberate exactly as far as they reach, no further."],
"TL-01-34": ["Freed from one limit while others persist is still unliberated.", "Total freedom is all-or-nothing at the limit."],
"TL-01-35": ["Only limitation-free knowledge of the knowable, with nothing unknown, liberates.", "Completeness is the criterion, not intensity or sincerity."],
"TL-01-36": ["Knowledge and ignorance each divide into spiritual (puruṣa) and intellectual (bauddha).", "Two levels of bondage require two levels of remedy."],
"TL-01-37": ["Mala veils the soul's own Śiva-nature: complete consciousness, complete agency.", "Impurity is a veil over plenitude, not an original stain."],
"TL-01-38": ["Contracted perceiving and acting, unbuilt by thought.", "Spiritual ignorance precedes concepts; argument cannot reach it."],
"TL-01-39": ["Determinate judgment ('I know this thus') mirrors Self-light in the veiled soul.", "Intellectual knowing is reflected light, six veils dimmed."],
"TL-01-40": ["Undeveloped judgment is ignorance; the two ignorances feed each other.", "Spiritual and intellectual bondage form a mutual loop."],
"TL-01-41": ["Waning of the fettered trace lets expanding, construct-free awareness dawn.", "Spiritual knowledge is expansion, not acquisition."],
"TL-01-42": ["Matching insight is intellectual knowledge; the two knowledges nourish each other.", "Liberation also loops — upward this time."],
"TL-01-43": ["Initiation destroys spiritual ignorance, yet explicit knowledge waits for body's end.", "Dīkṣā plants what only death's harvest may show — unless intellect joins in."],
"TL-01-44": ["Dissolving intellectual ignorance through intellectual knowledge puts living liberation in hand.", "Jīvanmukti is the prize of the second, intellectual remedy."],
"TL-01-45": ["Initiation liberates only when clear insight leads; intellect holds first place.", "Ritual without understanding does not carry across."],
"TL-01-46": ["Teachers like Kheṭapāla already drew this twofold line on other scriptures.", "The distinction is traditional, not Abhinavagupta's invention."],
"TL-01-47": ["Scripture revealing the knowable's true nature is the chief means to firm ascertainment.", "Study is prescribed as method, not mere devotion."],
"TL-01-48": ["Thought-constructs can persist after initiation killed spiritual ignorance.", "The intellect keeps its own separate account of bondage."],
"TL-01-49": ["While body lasts, identity-sense persists in intellect; final freedom rides spiritual ignorance destroyed.", "Videhamukti explained: delayed, but secured from the deeper level."],
"TL-01-50": ["Intellectual ignorance ended uproots constructs; liberation follows at once — so the Niśāṭana declares.", "Scriptural warrant for liberation before death."],
"TL-01-51": ["Construct-bound mind reaches Śiva at body's fall; the freed attains right then.", "Two speeds of arrival, scripture holding first place in both."],
"TL-01-52": ["Śiva is consciousness-light: what is not light could never appear or exist.", "Being is appearing; appearing needs light; light is Śiva."],
"TL-01-53": ["Even 'this does not exist' is awareness at work, not a dead wall.", "Non-being is also a content of consciousness — nothing escapes the field."],
"TL-01-54": ["Consciousness-light shines always and cannot be denied — proofs are pointless.", "Self-evidence needs no evidence; argument arrives too late."],
"TL-01-55": ["Means of knowing lend things their life by revealing them; their own life is the Lord.", "Pramāṇas live only on borrowed light."],
"TL-01-56": ["Even the denier of all confesses: 'this denial appears to me.'", "Denial performs what it denies — appearance to a me."],
"TL-01-57": ["Every proof or denial presupposes the unproved Perceiver.", "The witness is argument's precondition, never its conclusion."],
"TL-01-58": ["The Supreme is beyond reasoning and depends on nothing — Kāmikāgama.", "Scripture confirms what reflection forced: independence."],
"TL-01-59": ["Everything depends on Him; He alone stands free.", "Dependence is one-way: the Absolute is never the dependent term."],
"TL-01-59-cd": ["Space, time and form do not bind the independent Master of all.", "Categories that divide the world cannot divide their source."],
"TL-01-60": ["Śiva is all-pervading, eternal, omniform — each trait argued from its meaning.", "Presence everywhere, freedom from beginning-end follow from what He is."],
"TL-01-61": ["Omniform: He manifests every variety, conscious and unconscious — so the Dīkṣottara.", "Variety needs no second principle; one light wears all colours."],
"TL-01-62": ["Sixfold scheme: World, Form, Light, Space, Sound, Mantra.", "A graded ladder of His self-presentation for practice."],
"TL-01-63": ["Steadied in any one aspect one attains it; full insight into their shared resonance liberates.", "Partial practice gains its station; total resonance gains freedom."],
"TL-01-64": ["Omniform really; the sixfold scheme is illustrative pointer to rising unconditioned.", "Maps are secondary to the rising they indicate."],
"TL-01-65": ["Omniform yet formless, like water or mirror taking images unmarked — Kāmikāgama.", "Reflection without contamination: the classic image of transcendence-in-immanence."],
"TL-01-66": ["All-pervading, eternal, omniform are not different from each other.", "Divine attributes interpenetrate; counting them divides nothing."],
"TL-01-66-cd": ["He has one single attribute encompassing all the rest.", "Unity of attributes mirrors unity of substance."],
"TL-01-67": ["He is united with the power of creative freedom alone; many powers are that one.", "Plural śaktis are inflections of single svātantrya."],
"TL-01-68": ["'Power' is a thing's own nature as labelled by perceivers; power and possessor stay one reality.", "The distinction is perspectival, not ontological."],
"TL-01-69": ["As burning versus cooking are both simply fire, divine forms differ only for perceivers.", "One fire, many uses: perceiver-relativity without relativism."],
"TL-01-70": ["Yet power-possessor difference is not nothing: nothing exists apart from its manifestation.", "Difference is fully real as the form unity takes."],
"TL-01-71": ["Whatever pours out a thing's powers by identity is itself called power — so the Goddess.", "Śakti defined functionally: the outpouring is the power."],
"TL-01-72": ["Śiva Himself, losing no fullness, manifests in the perceiver's own mirrored consciousness.", "Meditation-visions are His self-display, not subjective fancy."],
"TL-01-73": ["Every channel of His partless self-division is rightly called a power.", "Upāyas are real precisely as His chosen channels."],
"TL-01-74": ["Experience is mind's construct — so how can the unexperienced initiate into Śiva?", "The objector's challenge: no experience, no transmission."],
"TL-01-75": ["Hunger is mental yet no mere construct — so Śiva can be inwardly experienced.", "Felt immediacy without concept: hunger's analogy rescues initiation."],
"TL-01-81": ["The whole group of principles is imperishable; the Self alone is their identity.", "Triśiromata's warrant: tattvas endure because Self endures."],
"TL-01-82": ["The utterly subtle totality in Heart, body and each thing's nature is the 'group'.", "Kula located thrice: centre, frame, and every particular."],
"TL-01-85": ["Drop both breaths, enter the Middle Channel, established in the centre.", "Prāṇa-practice in one line: the middle alone matters."],
"TL-01-88": ["Impurity-free meditation on coming-and-going's plane, memory checked, reaches supreme Bhairava.", "Even mantra-repetition arrives when the field is clean."],
"TL-01-90": ["Nearer or farther means differ only as degrees of consciousness's freedom.", "Upāya hierarchy is really freedom's own self-grading."],
"TL-01-94": ["Scripture's fitting words teach this great Bhairava, supreme Śiva.", "Words can fit Him when they follow His nature."],
"TL-01-95": ["Bhairava sustains the universe screened from His nature, is sustained shining everywhere, resounds as resonance.", "Threefold rhythm: emit, pervade, reverberate — one act."],
"TL-01-116": ["The Lord's body is inner creative imagination, worshipped outwardly as consciousness's waves.", "Bahirmukha ritual mirrors antarmukha imagination; both are His body."],
}

def main():
    path = 'src/content/kashmir-shaivism/tantraloka-verses-en.ts'
    lines = io.open(path, encoding='utf-8').read().split('\n')
    opens = [i for i, l in enumerate(lines) if l == '  {']
    assert len(opens) == len(KP), f'verse count {len(opens)} != keypoints {len(KP)}'
    # map id -> open index
    import re
    id_at = {}
    for o in opens:
        m = re.match(r'    "id": "([^"]+)",', lines[o + 1])
        assert m, f'no id at line {o + 2}'
        id_at[m.group(1)] = o
    assert set(id_at) == set(KP), f'id mismatch: {set(KP) ^ set(id_at)}'
    # find each block end: next line that is '  },' or '  }' after o
    out = list(lines)
    # process from last to first so indices stay valid
    for vid, o in sorted(id_at.items(), key=lambda kv: -kv[1]):
        c = o + 1
        while out[c] not in ('  },', '  }'):
            c += 1
        assert c - o == 8, f'{vid}: block size {c - o}, expected 8'
        assert '"keyPoints"' not in '\n'.join(out[o:c]), f'{vid} already has keyPoints'
        kp_items = ',\n'.join(f'      "{k}"' for k in KP[vid])
        out[c - 1] = out[c - 1] + ','
        out.insert(c, f'    "keyPoints": [\n{kp_items}\n    ]')
    io.open(path, 'w', encoding='utf-8').write('\n'.join(out))
    print(f'inserted keyPoints into {len(KP)} verses')

if __name__ == '__main__':
    main()
