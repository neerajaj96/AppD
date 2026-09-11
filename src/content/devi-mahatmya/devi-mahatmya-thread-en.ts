export interface RawThreadStepEn {
  id: string;
  conceptId?: string;
  verseIds?: string[];
  title?: string;
  narrative?: string;
  summary?: string;
  keyPoints?: string[];
}

export const deviMahatmyaThreadEn: RawThreadStepEn[] = [
  {
    id: 'dm-step-0',
    conceptId: 'devisukta',
    verseIds: ['dm-devisukta-1', 'dm-devisukta-6', 'dm-devisukta-8'],
    title: 'Prologue: The Root Hymn (Devī Sūkta)',
    narrative: `Older than the battle-narrative by more than two thousand years, eight Rigvedic verses stand at the head of this telling - and Brahmarsi Satyadev insists they are not decoration but the seed. The seer Vak speaks as the Self itself: moving with the senses and the mind, upholding resolve and nourishment, reigning as Queen and as the Knowledge before all worship, carrying out every act, elevating whom She loves, stringing the bow of Om against the mind, birthing even the world-Father, and blowing through all worlds like the wind.

Two lines in particular govern everything that follows. "I wage war for the people" (verse 6) is the charter of the entire inner reading: the war about to be narrated across thirteen chapters is Hers, fought on the aspirant's behalf at the auspicious crisis when the life-breaths resolve to enthrone the Self and the mind refuses. And "from which all this is born, in which it abides, into which it dissolves" needs no commentary - it is the Vedanta Sutra's definition of Brahman, packed into a wind-image, spoken here in the feminine.

Read the hymn first, then watch for its echoes: the bow of Om restrung in every meditation instruction, the Queen of verse 3 returning as the sovereign who must be entreated before every battle, the wind of verse 8 moving through every liberation scene.`,
    summary: 'Eight Rigvedic verses in which the Self introduces Herself - the seed-charter of the whole inner war, naming the bow, the battle, and the Queen before a single demon appears.',
    keyPoints: [
      '**Seed, not preface**: Satyadev reads the seven hundred verses as analysis of these eight.',
      '**"I wage war for the people"**: The charter line - every later battle is Hers, fought for the aspirant.',
    ],
  },
  {
    id: 'dm-step-1',
    conceptId: 'three-caritas',
    verseIds: ['dm-1-1', 'dm-2-1', 'dm-5-1'],
    title: 'Prologue: The Threefold Architecture (Tri-Carita)',
    narrative: `Before a single demon is named, it is worth knowing how the whole text is built, because the architecture itself is part of the teaching. The seven hundred verses (*Saptaśatī*) are not one battle but three, and tradition reads each of the three sections as the untying of a distinct psychic knot (*granthi*).

The *Prathama Carita* — the shortest section — dissolves the *Brahma-granthi*, the knot of primordial inertia and doubt, through the defeat of Madhu and Kaiṭabha. The *Madhyama Carita* dissolves the *Viṣṇu-granthi*, the knot of the animalistic, shapeshifting ego, through the defeat of Mahiṣāsura. The *Uttama Carita* — by far the longest, spanning nine full chapters — dissolves the *Rudra-granthi*, the knot of subtle selfhood itself (*Asmitā-Mamakāra*), through the long campaign against Śumbha and Niśumbha.

Each carita, notably, culminates in the Goddess emerging by a *subtler* method than the last: from Viṣṇu's own awakening in the first, from the pooled radiance (*tejas*) of many gods in the second, and from Pārvatī's own body-sheath (*śarīra-kośa*) in the third. The mechanism of manifestation refines precisely as the obstacle refines. The seeker should expect the same of their own practice: what dissolves gross lethargy will not be subtle enough to dissolve the sense of "I am the one doing this work."`,
    summary: 'The Devī Māhātmya unfolds in three progressively subtler campaigns — against inertia, against ego, and against the pride of selfhood — each resolved by an increasingly refined mode of divine emergence.',
    keyPoints: [
      '**Three Knots, Not One**: Brahma-granthi (inertia), Viṣṇu-granthi (ego), Rudra-granthi (pride) are dissolved in turn, never simultaneously.',
      '**Subtler Method for Subtler Foe**: Divine emergence moves from Viṣṇu\u2019s awakening, to pooled tejas, to self-differentiation — mirroring the refinement demanded of the obstacle it meets.'
    ]
  },
  {
    id: 'dm-step-2',
    conceptId: 'devi-kavaca',
    verseIds: ['dm-kavacha-1', 'dm-kavacha-2', 'dm-kavacha-5', 'dm-kavacha-3', 'dm-kavacha-4'],
    title: 'Prologue: The Armor of Remembrance (Devī Kavaca)',
    narrative: `Tradition does not send the aspirant into the *Saptaśatī* unguarded. Before the narrative proper begins, three auxiliary hymns (*Aṅga-Stotra*) are prescribed: the Kavaca, the Argala, and the Kīlaka. The first of these, the *Devī Kavaca*, is armor in the most literal sense — the protective plating a warrior secures before ever stepping onto a field of battle.

Sage Brahmā reveals to Mārkaṇḍeya that this Kavaca must be donned *before* the Caṇḍī-japa begins, so that the *siddhi* born of recitation arrives *nirvighnam* — free of obstruction. The hymn then proceeds limb by limb: the nine forms of Durgā (*Navadurgā*) are invoked to guard the practitioner in fire, in the thick of battle, in every uneven and perilous fort of circumstance. Head, brow, eyes, ears, nose, tongue, throat, arms, heart, navel, hips, knees, feet — each bodily seat is consecrated as an altar of the Mother's living presence, until no threshold of the body remains unguarded.

Read as psychological instruction rather than literal magic, the Kavaca insists on a sequencing that any sound practice honors: establish safety and groundedness first, and only then walk toward what is difficult. The armor precedes the sword; stabilization precedes confrontation.`,
    summary: 'Before the inner battle is joined, the practitioner first cultivates a felt, embodied sense of protection — the Kavaca establishes safety as the necessary precondition for the work that follows.',
    keyPoints: [
      '**Nirvighnam Siddhiḥ**: The Kavaca is prescribed before Caṇḍī-japa precisely so that the fruit of recitation arrives unobstructed.',
      '**Somatic Consecration**: Each limb, from crown to sole, is placed under a named guardian form — the whole body becomes sanctified ground before the war begins.'
    ]
  },
  {
    id: 'dm-step-3',
    conceptId: 'argala-stotra',
    verseIds: ['dm-argala-1', 'dm-argala-2', 'dm-argala-3', 'dm-argala-4', 'dm-argala-5'],
    title: 'Prologue: The Bolt of Aspiration (Argala Stotra)',
    narrative: `The second auxiliary hymn takes its name, *argala*, from the bolt or latch that must be drawn back before a door will open. Where the Kavaca armors the body, the Argala unlatches the will — and it does so through an almost startlingly direct refrain, repeated verse after verse: *rūpaṃ dehi, jayaṃ dehi, yaśo dehi, dviṣo jahi* — "give me beauty, give me victory, give me fame, destroy my enemies."

Each verse first names one of the great victories still to come — the destruction of Madhu-Kaiṭabha, of Mahiṣāsura, of Dhūmralocana, of Raktabīja, of Śumbha-Niśumbha — previewing the entire epic to follow, then closes on the same four-part petition. Nothing here disguises itself as detachment. The tradition holds that the ordinary human wants — health, standing, the defeat of what opposes one's flourishing — are legitimate objects of prayer, to be asked for plainly rather than suppressed in a performance of renunciation one does not yet feel.

And the same refrain is understood to ripen: *rūpaṃ* moves from bodily beauty toward the vision of the Goddess's own form, and finally toward *That which alone deserves to be called Form* — the Absolute itself. *Jayaḥ* moves from worldly triumph to victory in the inner battle (*Sādhana-Samara*) to abiding in Truth. The petition does not have to abandon its beginner's register to eventually reach the deepest one; it simply keeps being prayed, and its meaning deepens with the one who prays it.`,
    summary: 'The Argala Stotra grants full permission to ask directly and honestly for beauty, victory, fame, and the destruction of one\u2019s enemies — and trusts the same four words to mature in meaning as the practitioner matures.',
    keyPoints: [
      '**Dehi = Fill the Lack**: The refrain does not shame desire; it invites the aspirant to bring whatever lack they feel honestly before the Mother.',
      '**One Refrain, Many Depths**: \u201cVictory\u201d can begin as worldly success and ripen into victory over one\u2019s own worst impulses — the words do not change, the practitioner does.'
    ]
  },
  {
    id: 'dm-step-4',
    conceptId: 'keelaka-stotra',
    verseIds: ['dm-keelaka-0', 'dm-keelaka-1', 'dm-keelaka-2', 'dm-keelaka-3'],
    title: 'Prologue: The Lock and Its Key (Kīlaka Stotra / Adhikāra-Nirṇaya)',
    narrative: `The third auxiliary hymn is the strangest of the three, because its subject is the danger of the very text it introduces. *Kīlaka* means a peg, pin, or bolt driven in to seal a mechanism shut — and tradition holds that Mahādeva himself deliberately "pinned" the *Saptaśatī*, concealing its true purpose, because a scripture built from violent imagery, recited mechanically by one who has not grasped what it points toward, yields little and may even entrench the very afflictions it was meant to dissolve.

The hymn's technical name for its subject is *Adhikāra-Nirṇaya* — the determination of one's spiritual eligibility or readiness. It correlates lunar phases with degrees of inward dissolution: the eighth day of the waning moon (*Aṣṭamī*) as the mind half-absorbed, the fourteenth (*Caturdaśī*) as only a single subtle ray of mind remaining, the new moon (*Amāvasyā*) as total dissolution where the distinction of knower and known itself ceases. *Jñātvā prārabhya kurvīta* — "having known, one should begin" — the text warns that ritual attempted without this knowing simply perishes (*vinaśyati*) unfulfilled.

The lesson generalizes far beyond this one text: any practice borrowed from a tradition whose meaning has not yet been understood tends to remain theater rather than transformation, however faithfully its outer form is repeated. Know the key before you turn it in the lock.`,
    summary: 'The Kīlaka Stotra names the precondition for the entire practice: genuine understanding and inward readiness must precede recitation, or the words remain locked, however precisely they are pronounced.',
    keyPoints: [
      '**A Scripture That Warns About Itself**: The hymn openly states that mechanical recitation without comprehension fails to bear fruit — and may reinforce what it was meant to dissolve.',
      '**Adhikāra Before Action**: \u201cHaving known, one should begin\u201d — readiness and understanding are the actual key; the ritual form is only the lock.'
    ]
  },
  {
    id: 'dm-step-5',
    conceptId: 'suratha-samadhi',
    verseIds: ['dm-1-1', 'dm-1-4', 'dm-1-33', 'dm-1-35'],
    title: 'Stage I: Disillusionment and the Hermitage of Wisdom',
    narrative: `Every authentic spiritual pilgrimage begins not in comfortable speculation, but in profound existential crisis. 
King Suratha, betrayed by his ministers and stripped of his beloved kingdom, wanders into the dense forest on horseback. There he encounters the merchant Samādhi, cast out and disinherited by his wife and sons who craved his wealth.

Sitting by the serene hermitage of Sage Medhas, both men discover a tormenting paradox: despite having intellectual discrimination (*Viveka*), knowing fully that their kingdoms and kin were deceitful, their hearts remain uncontrollably scorched by the agony of attachment (*Moha*). 
Suratha weeps for the royal elephants and state treasury he left behind; Samādhi grieves with tender love for the ungrateful kin who drove him out. 

Together, they approach Sage Medhas (Intuitive Wisdom) to ask: *Why does the human mind remain chained to delusion even when it knows the truth?*`,
    summary: 'The seeker recognizes the bankruptcy of external security and encounters the painful limit of intellectual reasoning in eradicating attachment.',
    keyPoints: [
      'Intellectual knowledge cannot untie the emotional knot of "I" (Ahaṅkāra) and "Mine" (Mamakāra).',
      'The forest hermitage represents the inward sanctuary where worldly suffering is transformed into sacred philosophical enquiry.'
    ]
  },
  {
    id: 'dm-step-6',
    conceptId: 'mahamaya',
    verseIds: ['dm-1-41', 'dm-1-43', 'dm-1-54'],
    title: 'Stage II: The Cosmic Mystery of Mahāmāyā',
    narrative: `Sage Medhas looks upon the suffering king and merchant with deep compassion and unveils the core mystery of the universe:
*"She, the blessed Goddess Mahāmāyā, forcibly draws even the minds of the wise into delusion!"*

The delusion they suffer is neither an accidental character defect nor an individual failing; it is the operation of the sovereign power of the Supreme Divine—*Mahāmāyā*. 
She manifests in two inextricably linked modes:
1. **Avidyā-Rūpa**: The cosmic centrifugal force that veils the non-dual Self and projects the multiplicity of names, forms, pleasures, and terrors.
2. **Vidyā-Rūpa**: The centripetal grace that, when propitiated with humble self-surrender (*Śaraṇāgati*), dissolves worldly enchantment and becomes the direct giver of liberation (*Muktir-bhavati muktaye*).

The seeker learns that Nature is not an enemy to be conquered with violence, but the living Mother whose grace alone can unlock the gates of immortality.`,
    summary: 'The aspirant understands that Maya is the conscious sovereign power of God, holding both the bonds of ignorance and the keys to freedom.',
    keyPoints: [
      'Delusion is a cosmic law (*Balādākṛṣya*), impossible to defeat through isolated human willpower.',
      'Transformation requires shifting from fighting nature to surrendering to the Supreme Mother.'
    ]
  },
  {
    id: 'dm-step-7',
    conceptId: 'madhu-kaitabha',
    verseIds: ['dm-1-66'],
    title: 'Stage III: Dissolving Lethargy & Obstinacy (Prathama Carita)',
    narrative: `Sage Medhas narrates the first great battle (*Prathama Carita*). During the cosmic dissolution (*Pralaya*), Lord Viṣṇu lies asleep in *Yoga-Nidrā* upon the waters of the infinite. Out of the ear-wax of the sleeping Lord emerge two formidable demons: *Madhu* and *Kaiṭabha*.

In the psychology of *Sādhana-Samara*, Madhu represents *Tamas*—the sweet, narcotic lethargy of sensory complacency and spiritual procrastination. Kaiṭabha represents *Rajas*—the stubborn, crooked argumentative agitation of the intellect that doubts all sacred truths.
Together, they threaten to devour Lord Brahmā (the creative spiritual impulse striving to awaken). 

Brahmā realizes he cannot awaken the slumbering Divine Consciousness by his own effort; he must pray to *Yoga-Nidrā*—the Goddess who holds the Divine in contemplation. Moved by his hymn, the Mother departs from Viṣṇu\'s eyes, breath, and heart. The awakened Lord battles the demons and crushes them upon His thighs—representing the bedrock of ethical tapas and spiritual discipline.`,
    summary: 'The awakening of dormant higher consciousness through prayer to conquer spiritual lethargy (Madhu) and aggressive doubt (Kaiṭabha).',
    keyPoints: [
      'Spiritual sleepiness and mental obstinacy arise from the lowest sensory impurities.',
      'Higher divine awareness awakens only when the veil of inward absorption is lifted through sincere prayer.'
    ]
  },
  {
    id: 'dm-step-8',
    conceptId: 'mahishasura',
    verseIds: ['dm-2-9', 'dm-2-15', 'dm-2-19', 'dm-2-25', 'dm-2-35', 'dm-3-38', 'dm-4-3'],
    title: 'Stage IV: Total Surrender & Slaying the Animal Ego (Madhyama Carita)',
    narrative: `In the second episode (*Madhyama Carita*), the spiritual crisis deepens. The buffalo-demon *Mahiṣāsura* drives the gods out of heaven, usurping their thrones and reducing their celestial functions to servitude.

The gods represent our segregated faculties: sight, hearing, speech, breath, and discursive thinking. They fought Mahiṣāsura individually and suffered total defeat. So long as the seeker relies on fragmented discipline—a little meditation here, some charity there, isolated willpower elsewhere—the brute animalistic ego easily triumphs.

Only when the gods gather in utter helplessness and pour out their collective wrath and sorrow does a miracle occur: from their unified bodies bursts forth a blinding mountain of cosmic light (*Tejas*). That unified luminescence condenses into the glorious multi-armed Goddess *Durgā*. 
Mounted upon Her lion (courage and royal sovereignty), She drinks the wine of transcendental bliss (*Madhupāna*) and steps with Her divine foot upon the throat of the beast, severing the shapeshifting animal with Her trident.`,
    summary: 'The fragmented human faculties surrender their separate claims, uniting into an indivisible spiritual force (Durgā) that slays the animalistic ego.',
    keyPoints: [
      'Fragmented spiritual techniques cannot conquer the deeply rooted animalistic ego.',
      'The emergence of Durgā signifies total integration of all prāṇic and mental energies.'
    ]
  },
  {
    id: 'dm-step-9',
    conceptId: 'aparajita-stuti',
    verseIds: ['dm-5-14'],
    title: 'Stage V: The All-Pervading Mother in Every Vṛtti (Uttama Carita Opens)',
    narrative: `Purified by the destruction of the gross animal ego, the gods ascend to the snow-covered peaks of the Himalayas to sing the immortal *Aparājitā Stuti*:
*"Yā devī sarvabhūteṣu cetanetyabhidhīyate | Namastasyai namastasyai namastasyai namo namaḥ ||"*

Here the seeker reaches a profound spiritual plateau. God is no longer an external deity fought for in temples, but the living conscious presence pulsing through every modification of the mind (*Vṛtti*). 
The Mother is recognized as:
- *Cetanā* (the witnessing consciousness behind every thought)
- *Buddhi* (clarity of spiritual discrimination)
- *Nidrā* (the restful withdrawal of the senses)
- *Kṣudhā* (the sacred spiritual hunger for truth)
- *Śraddhā* (unwavering faith that braves all storms)
- *Mātṛ-rūpa* (the all-encompassing maternal love that forgives and embraces).

By bowing three times to Her presence in all beings (*Namastasyai x3*), the seeker surrenders physical body, emotional mind, and intellect to the singular living Divine Mother.`,
    summary: 'The realization that Divine Consciousness is the very substance of all human experience, transforming all psychological states into worship.',
    keyPoints: [
      'Every mental state, when dedicated with reverent awareness, becomes a vehicle of divine communion.',
      'The Goddess is not an object outside; She is the Subject illuminating all objects.'
    ]
  },
  {
    id: 'dm-step-10',
    conceptId: 'cit-shakti',
    verseIds: ['dm-1-54', 'dm-5-14'],
    title: 'Interlude: Awareness Itself as Living Power (Cit-Śakti)',
    narrative: `It is worth pausing on the Aparājitā Stuti's underlying claim, because the whole remainder of the *Uttama Carita* depends on it. The ordinary assumption is that mind and matter, awareness and energy, are two different kinds of thing — one inward and inert, the other outward and dynamic. The *Devī Māhātmya* denies this at the root: *Cit* (consciousness) and *Śakti* (power) are named as a single compound, *Cit-Śakti*, because they were never actually two.

Awareness, on this account, is not a passive witness sitting behind experience like a spectator in a darkened theater. It is itself the active, dynamic force that shows up, moment to moment, as hunger, as memory, as patience, as sleep, as the capacity to be aware of anything whatsoever. What the hymn just sung called *cetanā* is not a possession the Goddess grants from outside; it is Her very substance, wearing the shape of this instant's experience.

This is the philosophical hinge the text turns on. Everything that follows — Kālī's devouring witness, the Mātṛkās as unified faculties, the final cry "I alone exist" — only makes sense once consciousness and energy have already stopped being two things in the aspirant's understanding.`,
    summary: 'Consciousness and dynamic power are revealed as a single reality (Cit-Śakti), not two — the philosophical ground beneath everything the Uttama Carita is about to enact.',
    keyPoints: [
      '**Not Controlled By, Made Of**: Ordinary experience — hunger, memory, patience — is not ruled by awareness from a distance; it is awareness, differently shaped.',
      '**The Hinge of the Text**: Kālī\u2019s totality, the Mātṛkās\u2019 unity, and the final non-dual declaration all presuppose that Cit and Śakti were never separate.'
    ]
  },
  {
    id: 'dm-step-11',
    conceptId: 'shumbha-nishumbha',
    verseIds: ['dm-5-1', 'dm-5-37'],
    title: 'Stage VI: The Subtlest Foe Arises — Śumbha & Niśumbha',
    narrative: `The *Uttama Carita* proper begins where the previous two did not need to: with an enemy so refined it does not even present as vice. Śumbha and Niśumbha, having seized the offices of sun, moon, fire, wind, and wealth, have not merely conquered the gods — they have made the gods' own faculties perform their errands. Sight still sees, speech still speaks, but for the wrong owner.

Where Madhu-Kaiṭabha were raw inertia-doubt and Mahiṣāsura was the shapeshifting animal ego, Śumbha and Niśumbha stand for something almost impossible to point to directly: *Asmitā*, the load-bearing, unexamined sense "I am the one running this show," and *Mamakāra*, its constant partner, "this is mine." These do not announce themselves as flaws. They can feel, from the inside, exactly like ordinary competence and ordinary care.

Fittingly, the Goddess who will meet them does not emerge from pooled divine radiance this time, but from Pārvatī's own body — Kauśikī steps forth from the sheath (*kośa*) of the meditating Mother while She bathes in the Ganges, and Pārvatī Herself darkens into Kālikā the instant Śakti differentiates outward. The subtlest foe requires not an assembled weapon, but a self dividing from itself.`,
    summary: 'The final and longest campaign opens against an enemy that does not look like an enemy — the polished, ordinary-feeling sense of "I" and "mine" — met by the Goddess\u2019s subtlest mode of self-emergence yet.',
    keyPoints: [
      '**Entitlement, Not Villainy**: Śumbha-Niśumbha colonize the gods\u2019 own faculties rather than destroying them — the deepest obstacle wears the shape of ordinary function.',
      '**Self-Differentiation**: Kauśikī issues from Pārvatī\u2019s own body-sheath — the Rudra-granthi can only be met by consciousness dividing from itself, not by borrowed force.'
    ]
  },
  {
    id: 'dm-step-12',
    conceptId: 'shumbha-envoy',
    verseIds: ['dm-5-57', 'dm-5-70'],
    title: 'Stage VII: The Envoy\u2019s Proposal and the Vow of Battle',
    narrative: `Before a single soldier marches, Śumbha tries persuasion. His envoy Sugrīva finds Kauśikī radiant upon the Himalayan peak and delivers what is dressed as flattery: come rule as consort to the lord of the three worlds; every jewel and elephant in creation is already, in effect, hers. The offer names its own logic plainly — surrender your standing, and gain the world.

Her reply is unhurried and total: she made a vow before any of this, that she would marry only whoever defeats her in battle. If Śumbha wants her, let him come and win her honestly. There is no anger in the refusal, only an immovable prior commitment. When the envoy returns with this answer, the same voice that had just offered every treasure in the world turns, almost instantly, to threat — drag her by the hair if she will not come freely.

Read as more than court drama, the scene names a recurring pattern: the offer that promises to resolve every difficulty at once, if only the deepest form of one's own judgment is handed over first. And the swiftness with which flattery becomes coercion the moment it is declined is itself a diagnostic — a true gift does not curdle into threat when it is turned down.`,
    summary: 'Śumbha attempts to win the Goddess through flattery and offer before ever attempting force — and her calm, vow-bound refusal converts his courtship into open threat within moments.',
    keyPoints: [
      '**The Vow as Armor**: Bound by a prior commitment to truthfulness, she is moved by neither bribe nor menace — helplessness before one\u2019s own vow becomes, paradoxically, strength.',
      '**Flattery\u2019s Tell**: The instant the offer is declined, the same voice turns to threat — revealing that persuasion was never separate from coercion, only its first phase.'
    ]
  },
  {
    id: 'dm-step-13',
    conceptId: 'dhumralochana',
    verseIds: ['dm-6-1', 'dm-6-10'],
    title: 'Stage VIII: Ash by a Single Syllable — Dhūmralocana',
    narrative: `Rebuffed, Śumbha dispatches his first general, Dhūmralocana — "smoke-eyed" — with sixty thousand soldiers and a crude order: drag her back by the hair, and kill any rescuer, divine or otherwise, who intervenes. He finds her seated at ease on the golden peak and repeats the ultimatum. Her answer is a question, not a plea: "If you drag me by force, what then shall I do to you?"

He charges. She destroys him with nothing more than a single exhaled *Huṃ* — a wrathful seed-syllable, no weapon required — and her lion vehicle disposes of the remaining army almost as an afterthought, in a matter of moments.

The name is precise: *dhūmra* (smoke) plus *locana* (eye) — perception fogged by resentment and grasping, unable to see what it is actually looking at even while staring directly at it. That such a fully-mobilized force collapses this quickly, compared to what is still to come, is itself an instructive detail: not every inner obstacle demands years of hard-won struggle. Some resistance is only smoke, all fume and no substance, and dissolves the instant it meets an awareness too settled to be provoked by it.`,
    summary: 'The first general sent to seize the Goddess by force — reactive, smoke-blinded aggression — is destroyed instantly by a single sound, demonstrating that not every obstacle requires prolonged struggle.',
    keyPoints: [
      '**Smoke, Not Sight**: Dhūmralocana perceives only an object to seize even while staring at unmistakable ease and strength — perception fogged by grievance sees nothing accurately.',
      '**Economy of Force**: Established awareness needs no duel with mere reactivity; a single syllable suffices where deeper obstacles will require sustained campaigns.'
    ]
  },
  {
    id: 'dm-step-14',
    conceptId: 'chanda-munda',
    verseIds: ['dm-7-1', 'dm-7-19'],
    title: 'Stage IX: The Birth of Kālī from the Frown — Caṇḍa & Muṇḍa',
    narrative: `Furious at Dhūmralocana's easy defeat, Śumbha sends two more generals, Caṇḍa and Muṇḍa, with instructions blunter still: seize her, and if she resists, let every demon present strike her down with every weapon they carry. This time the response is not a syllable but a birth. Seeing the approaching host, the Goddess's rage concentrates until her face turns wholly black — and from that furrowed, darkened brow, Kālī bursts forth already armed, already famished, already terrible to behold.

Kālī does not merely rout the army; she devours it — soldiers, mounts, and weapons alike — before personally beheading Caṇḍa and Muṇḍa and laying their heads before Caṇḍikā as an offering, calling the whole encounter a *yuddha-yajña*, a battle-sacrifice, with the demons as its oblation. Because she is the one who returned bearing Caṇḍa and Muṇḍa, she receives, on the spot, the name by which she will be known ever after: *Cāmuṇḍā*.

The episode inverts the usual moral instinct about anger. Fury here, fully expressed rather than moderated or suppressed, is shown as exactly proportionate — even necessary — to an order this severe. The text does not apologize for it; it names an entire fierce capability in gratitude for what it accomplished.`,
    summary: 'Concentrated, unmodulated wrath at an escalating threat gives birth to Kālī herself — and the deed of returning with the two generals\u2019 heads earns her the name Cāmuṇḍā.',
    keyPoints: [
      '**Fury Focused Births the Dark Mother**: Kālī issues from the frown when rage reaches total concentration — not suppressed anger, but anger fully arrived.',
      '**A Name Earned, Not Given**: \u201cCāmuṇḍā\u201d is conferred only after the deed — identity, in this text, follows action rather than preceding it.'
    ]
  },
  {
    id: 'dm-step-15',
    conceptId: 'kali-chamunda',
    verseIds: ['dm-7-1', 'dm-8-39'],
    title: 'Stage X: The Unfiltered Form — Kālī / Cāmuṇḍā',
    narrative: `It is worth dwelling a moment longer on the form Kālī takes, since nothing about it is decorative. Dark, almost black-complexioned; garlanded with fifty severed heads corresponding to the fifty letters of the Sanskrit alphabet; vast-mouthed, lolling-tongued, deliberately terrifying — every feature encodes a claim about the nature of unfiltered awareness itself.

Her darkness stands for the vast unknown preceding any thought, image, or word — the ground into which every formed thing eventually dissolves. Her garland of fifty heads stands for the totality of what can possibly be said or thought — meaning she precedes and exceeds every concept that could attempt to capture her, language included. She is not comforting on first encounter because raw awareness, stripped of the comfortable narratives usually laid over experience, rarely is comforting on first encounter either — it can feel destabilizing the way any sudden, unfiltered truth about oneself can feel.

This is the same Kālī who will shortly catch Raktabīja's endlessly multiplying blood on her tongue before it touches the ground: only a level of awareness this total, this unwilling to look away from anything, is capable of meeting a habit at the exact moment of its arising rather than cleaning up after it has already multiplied.`,
    summary: 'Kālī\u2019s frightening iconography is not narrative decoration but a precise encoding of what raw, unfiltered awareness actually is — vast, prior to language, and only reassuring once fully met.',
    keyPoints: [
      '**Darkness as the Unformed**: Her black complexion is the space before thought or image has arisen — everything eventually returns to it.',
      '**The Garland of Fifty**: Corresponding to the Sanskrit alphabet, it marks her as prior to and beyond every possible word or concept.'
    ]
  },
  {
    id: 'dm-step-16',
    conceptId: 'raktabija',
    verseIds: ['dm-8-39', 'dm-8-39b'],
    title: 'Stage XI: Devouring Desire at Its Root — Raktabīja',
    narrative: `The final war (*Uttama Carita*) now confronts the subtlest and most dangerous adversary yet encountered: *Raktabīja*, "blood-seed." Every drop of his blood that reaches the ground instantly germinates into a thousand fresh demons identical to him — so that ordinary combat, striking him down by force, only multiplies the very problem it aims to solve.

In yogic terms, blood here represents latent subconscious impressions (*vāsanās*). Direct suppression of a craving after it has already flared into action does not extinguish it; it tends to seed a dozen new rationalizations and repeat behaviors in its place — the exact shape of trying to white-knuckle one's way past a habit and finding it simply multiplies elsewhere.

The Goddess does not meet force with more force. She summons Kālī — the all-devouring transcendental Void of pure witness-consciousness introduced moments before — who stretches her tongue across the entire field of battle and catches every drop before it ever touches the earth, halting the multiplication at its very source rather than after the fact. The lesson translates directly: lasting change rarely comes from fighting a craving once it has already taken hold; it comes from an attention sharp enough to meet the craving at the moment of its arising.`,
    summary: 'Raktabīja, whose spilled blood multiplies into endless new demons, cannot be defeated by force — only by Kālī\u2019s total, anticipatory awareness, which catches the root impulse before it can multiply at all.',
    keyPoints: [
      '**Suppression Multiplies**: Every blow struck in ordinary combat only breeds a thousand more demons — direct force against an already-arisen craving compounds it.',
      '**Catch It at the Source**: Kālī\u2019s tongue intercepts each drop before it touches ground — real change meets the impulse at its arising, not after it has already taken root.'
    ]
  },
  {
    id: 'dm-step-17',
    conceptId: 'matrikas',
    verseIds: ['dm-10-5'],
    title: 'Stage XII: The Sevenfold Retinue — The Mātṛkās',
    narrative: `As the final confrontation with Śumbha and Niśumbha approaches, the Goddess does not fight entirely alone. Seven additional goddesses — the Mātṛkās — spring directly from the bodies of the male gods to join her, each bearing a different weapon, riding a different mount, each unmistakably built for a different function: one disciplined, one nurturing, one fierce and protective, one steady and grounding, and so on through all seven.

No single one of them, alone, would be sufficient against an enemy this entrenched. What proves decisive is all seven acting in concert, aimed at one purpose, under the Goddess's single directing intention. Later, in the Nārāyaṇī Stuti, these same battle-forms return not as weapons but as names of praise — Brāhmī, Māheśvarī, Kaumārī, Vaiṣṇavī, Vārāhī, Nārasiṃhī, Aindrī — the war-goddesses becoming grace-goddesses once their work is complete.

The practical principle disguised as mythology: durable change rarely comes from a single trait or a single burst of willpower. It comes from bringing several distinct capacities — discipline, patience, courage, focus — into alignment at once, rather than expecting any single one of them to carry the whole task alone.`,
    summary: 'Seven goddesses spring from the gods\u2019 bodies to fight beside Devī, each a distinct faculty — the sevenfold unity of discipline, courage, and focus succeeds where no single faculty alone could.',
    keyPoints: [
      '**Unified Aim, Not Single Trait**: No one Mātṛkā suffices alone; what wins is seven distinct capacities acting together under one directing intention.',
      '**Weapons Become Names**: The same battle-forms return later in the Nārāyaṇī Stuti as names of grace — the war-function and the praise-function are, finally, the same power.'
    ]
  },
  {
    id: 'dm-step-18',
    conceptId: 'shumbha-nishumbha',
    verseIds: ['dm-10-5', 'dm-10-7'],
    title: 'Stage XIII: The Non-Dual Declaration and the Final Blow',
    narrative: `Niśumbha falls first, and Śumbha, watching his brother die, turns on the Goddess with a final taunt: she is not truly powerful, he says, only propped up by the crowd of other goddesses fighting at her side. It is at this exact moment — mockery aimed precisely at what looks like her dependence on help — that the text delivers its philosophical climax.

*"Ekaivāhaṃ jagatyatra dvitīyā kā mamāparā | Paśyaitā duṣṭa mayyeva viśantyo mad-vibhūtayaḥ ||"*
*"I alone exist in this universe; who is there second to Me? Behold, O wicked one, these are but My own powers, dissolving back into Me!"*

As she speaks, every one of the Mātṛkās around her dissolves back into her single form before Śumbha's eyes, and she alone strikes the final blow. What looked, from the outside, like a team of separate helpers was never actually separate — it was one power wearing different costumes for different tasks. The deepest form of victory over the *Rudra-granthi*, the text suggests, is not defeating one last bad habit and feeling proud of the accomplishment; it is the recognition that there was never a separate self fighting a separate problem to begin with — only ever one awareness, playing every part.`,
    summary: 'Taunted for needing help, the Goddess reveals that every apparent helper was always her own single power — the Mātṛkās dissolve back into her as she delivers the text\u2019s definitive non-dual declaration.',
    keyPoints: [
      '**Mockery Meets Its Match**: Śumbha\u2019s taunt about her dependence is answered not with denial but with a demonstration — the \u201chelpers\u201d were never separate to begin with.',
      '**Beyond Winning a Battle**: The deepest victory is not defeating a final obstacle but recognizing there was never a separate self and a separate problem — only ever one power.'
    ]
  },
  {
    id: 'dm-step-19',
    conceptId: 'narayani-stuti',
    verseIds: ['dm-11-10', 'dm-13-13'],
    title: 'Stage XIV: Universal Auspiciousness & The Dual Fulfilment',
    narrative: `With all demons slain and cosmic balance restored, the heavens open with celestial blossoms and the gods chant the sublime *Nārāyaṇī Stuti*:
*"Sarvamaṅgalamāṅgalye śive sarvārthasādhike | Śaraṇye tryambake gauri nārāyaṇi namo\'stu te ||"*

The Mother stands revealed as *Nārāyaṇī*—the eternal dynamic power of the Supreme Self, both the transcendent ground of the Gunas (*Guṇāśrayā*) and the manifest beauty of creation (*Guṇamayī*). 

Returning to the forest hermitage where King Suratha and Samādhi have practiced rigorous penance (*Tapas*) on the riverbank for three years, the Mother appears directly before them and asks what boons they desire:
- **King Suratha**, representing *Pravṛtti Mārga* (righteous engagement in the world), asks to regain his kingdom freed from enemies, and an imperishable realm as the future Manu *Sāvarṇi*.
- **The Merchant Samādhi**, representing *Nivṛtti Mārga* (pure renunciation), asks only for transcendental Self-Knowledge (*Jñāna*) that severs all knots of "I" and "Mine".

The All-Compassionate Mother lovingly grants both: to the active soul She gives righteous cosmic sovereignty; to the contemplative seeker She grants immediate *Kaivalya-Mokṣa*. The spiritual warfare (*Sādhana-Samara*) is crowned with eternal peace.`,
    summary: 'The culmination of the journey: the praise of universal auspiciousness and the harmonious granting of righteous worldly mastery and transcendental liberation.',
    keyPoints: [
      'Sanātana Dharma honors both righteous action in the world (Suratha) and absolute renunciation (Samādhi).',
      'The grace of the Divine Mother fulfills all four aims of human life: Dharma, Artha, Kāma, and Mokṣa.'
    ]
  },
  {
    id: 'dm-step-20',
    conceptId: 'future-avatars',
    verseIds: ['dm-11-37'],
    title: 'Epilogue: Her Promise of Return',
    narrative: `Before the narrative closes, the Goddess makes an unusual promise about ages yet to come. Demons of this kind, she says, will rise again — and when they do, she will return. But she does not promise to return wearing the same face twice.

Sometimes it will be ferocity again — born, as before, of a fierce great goddess devouring what threatens the three worlds. But sometimes it will be something entirely unlike a warrior: during a hundred-year drought, she will nourish the starving world with vegetables and grain grown from her own body until the rains return, and be known thereafter as *Śākambharī*, "she who bears plants." At other times a hundred watchful eyes (*Śatākṣī*), or an innumerable swarm of bees (*Bhrāmarī*) bringing down a threat too vast for any single combatant.

The promise is not "I will look a certain way when I come." It is: whatever the specific crisis actually requires, that is the form grace will take — ferocity in one age, patient nourishment in another, countless small coordinated efforts in a third. It is a fitting close to the *Uttama Carita*'s deepest lesson: the same power that fought as Kālī can, without contradiction, nourish as Śākambharī.`,
    summary: 'The Goddess vows to return whenever demonic disturbance recurs — not in one fixed form, but in whatever shape the specific crisis actually calls for, from fierce warrior to patient nourisher to countless small allies.',
    keyPoints: [
      '**No Single Heroic Shape**: Ferocity, nourishment, vigilance, and multitude are named as equally legitimate forms of the same grace.',
      '**Śākambharī**: Ending a famine by feeding the world from her own body stands beside Her fiercest battle-forms as an equally complete act of power.'
    ]
  },
  {
    id: 'dm-step-21',
    conceptId: 'phalastuti',
    verseIds: ['dm-12-1', 'dm-12-23'],
    title: 'Epilogue: Why the Story Asks to Be Retold',
    narrative: `The text closes with a chapter that steps outside the narrative entirely to address the reader directly: what is reciting or hearing this account actually good for, and when should one turn to it? An almost exhaustive catalogue of genuine human disaster follows — wildfire, robbers, imprisonment, a lion's or tiger's pursuit, shipwreck, the weapon-rain of battle, wracking illness, an enraged authority's death-sentence — and the promise that whoever remembers this account in the midst of such peril will be delivered from it.

The instruction to recite regularly, on specific recurring days, rather than only once, is not an accident of ritual habit. Genuine crises rarely arrive when a person is composed enough to reconstruct an entire teaching from first principles in the moment. If the text's core lesson — do not fight the confusing feeling alone, take refuge, remember what is already known — is to be genuinely available in the actual middle of panic, it must already be familiar: rehearsed calmly in advance, not looked up under duress.

That is the real argument for repetition, and it is not superstitious. It is the same reasoning behind a fire drill practiced long before any fire, or a soldier's reflexes trained until they no longer require thought: the story is not memorized for its own sake, but pre-loaded as a response to panic, so that it is already present the one time it will actually be needed.`,
    summary: 'The closing chapter turns to the reader directly, cataloguing real disasters and prescribing regular recitation — not as superstition, but as rehearsing in calm what must be reflexive in crisis.',
    keyPoints: [
      '**A Disaster Inventory, Still Ours**: Fire, imprisonment, shipwreck, illness — replace the particulars and the list remains a complete catalogue of what people still fear today.',
      '**Rehearsal, Not Ritual for Its Own Sake**: Repetition trains a reflex reachable under real panic, the same logic behind fire drills practiced long before any fire.'
    ]
  },
  {
    id: 'dm-step-22',
    conceptId: 'vedokta-ratri-sukta',
    verseIds: ['dm-ratri-vedokta-1', 'dm-ratri-vedokta-2', 'dm-tantrokta-crossref'],
    title: 'Parayana frame: the Vedic Night before the battles',
    narrative: `The Guptavati-adi edition (Drive PDF, 814 pp) opens the parayana with Rigveda 10.127 — eight verses to Night as Goddess (pp.65-66) — before the Navarna-vidhi and Saptashati-nyasa. Villages, cattle, birds rest in her lap; she is asked to set apart wolf and she-wolf, thieves, and to make the crossing easy. The Tantrokta Ratri standing next to it is the same substance as Adhyaya 1.53-67, and the Tantrokta Devi Sukta in the Uttaranga the same as Adhyaya 5.7-36 — recorded here as placement, not duplicated, so the 700 mantra-unit count stands.`,
    summary: 'Vedic Ratri (RV 10.127) opens the recitation; Tantrokta Suktas are placed, not duplicated, against their Adhyaya sources.',
    keyPoints: [
      '**Vedic root first**: Night as cit-shakti oversees karma and dispels ignorance.',
      '**No double-counting**: Tantrokta verses live once in ch01/ch05.'
    ]
  },
  {
    id: 'dm-step-23',
    conceptId: 'rahasya-traya',
    verseIds: ['dm-rahasya-pradhanika', 'dm-rahasya-vaikritika', 'dm-rahasya-murti', 'dm-kshama-prarthana', 'dm-mantra-vibhaga-note'],
    title: 'Uttaranga: the three Secrets and the closing forgiveness',
    narrative: `Kavaca, Argala, Kilaka and the three Rahasyas are the six limbs (Katyayani-tantra proof, p.701): the first three before the 13 adhyayas, the Rahasya-traya after. Pradhanika names the triguna Mahalakshmi whole; Vaikritika unfolds Her battle-bodies; Murti dates the seven descents from Nanda to Bhramari. Only Guptavati and the Hindi Chandraprabha gloss the Rahasyas here. Kshama-prarthana (p.723) then completes what lacks mantra, rite or devotion, and the mantra-vibhaga tables (pp.73-83, 795-814) fix every half-verse and uvacha as its own homa-unit toward the 700 total.`,
    summary: 'After the battles: samashti source, battle-bodies, dated descents, forgiveness completing all lack, and the 700-unit homa index.',
    keyPoints: [
      '**Six limbs close**: Three before, three Rahasyas after — Ravana is the warning.',
      '**Kshama completes**: Mantra-hina, kriya-hina, bhakti-hina made whole by forgiveness.'
    ]
  },
  {
    id: 'dm-step-24',
    conceptId: 'phalastuti',
    verseIds: ['dm-guru-kilaka', 'dm-kshamapana-1', 'dm-kshamapana-2', 'dm-saptashloki'],
    title: 'Uttaranga: the pin, the apology, and the seven-verse epitome',
    narrative: `Three closers stand after the six limbs. The Rahasya-tantra Guru-Kilaka (pp.62-64) stages the unpinning as giving-and-receiving: kingdom, strength, treasury and army laid at Her feet on Krishna-chaturdashi/ashtami, received back by Her grace, divided fivefold with a share to the guru. Shankara's 12-verse Devyaparadha-kshamapana (pp.725-728) pleads the one theology — kuputro jayeta, never kumata — from an eighty-five-year-old who served many gods and owns no mantra. And the Saptashloki Durga (pp.729-731) answers Shiva's Kali-age question with seven excerpt-verses: Mahamaya dragging even the wise, Durge-smrita, two Narayani salutations, the all-formed armour, tushta/rushta, and the all-affliction close.`,
    summary: 'Unpin by giving-receiving, apologise as a bad son to a never-bad mother, and carry the seven-verse epitome for the Kali age.',
    keyPoints: [
      '**Dana-pratigraha unpins**: Offer all, receive back, share with the guru.',
      '**Seven verses carry the whole**: The sheltered become shelters.'
    ]
  },
  {
    id: 'dm-step-25',
    conceptId: 'phalastuti',
    verseIds: ['dm-dvatrimsha', 'dm-kunjika-1', 'dm-kunjika-2', 'dm-ashtottara-note', 'dm-manasa-atharva-note'],
    title: 'Uttaranga: garlands, the quickener, and the commended crowns',
    narrative: `The edition closes the parayana with garlands and quickeners. The 32-name Dvatrimsha-mala (pp.736-738) — every name turning "hard-to-cross" into crossing — frees the bound, condemned, ringed or seized by 108 readings. The Rudrayamala Kunjika (pp.745-747) wakes sleeping mantras (mantra-jagarti) with bija volleys; without it, recitation is weeping in a forest. The 108-name Ashtottara (pp.732-735, Vishvasara-tantra) hides the inner faculties among its names and prescribes Kumari-puja first. Manasa-puja rehearses every offering inwardly to Tripurasundari (pp.739-744), and the Devi-Atharvashirsha (pp.748+) — explicitly non-shadanga per the edition's own footnote — crowns the corpus by Atharva-mahatmya, opening "kasi tvam mahadevi? ... aham brahmasvarupini."`,
    summary: 'Thirty-two names for crisis, Kunjika to wake mantras, 108 names with Kumari first, mental worship, and the Atharva crown.',
    keyPoints: [
      '**Kunjika wakes**: Mantra-jagarti; never to the devotionless.',
      '**Atharvashirsha crowns, not counts**: Commended, explicitly non-shadanga.'
    ]
  }
];
