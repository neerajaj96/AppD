// Ontology-diagram registry (web stub).
//
// The content schema (Verse/Concept `diagramId`) supports linking entries to
// named ontology diagrams, and the content-integrity suite requires every
// referenced id to resolve here. The legacy diagram components were removed;
// this module keeps the registry as data — id plus a human title — so links
// validate and a future diagram renderer has a single source of truth.
// Add new entries here (never ad-hoc strings in content files) when content
// references a new diagram.
export interface DiagramMeta {
  id: string;
  title: string;
}

const entries: DiagramMeta[] = [
  { id: 'abhava', title: 'Abhāva — non-existence as a category' },
  { id: 'abhinna-nimitta-upadana', title: 'Abhinna-nimitta-upādāna — non-different efficient and material cause' },
  { id: 'abhyasa-vairagya', title: 'Abhyāsa and Vairāgya — the two wings of practice' },
  { id: 'antahkarana', title: 'Antaḥkaraṇa — the inner instrument' },
  { id: 'antarayas', title: 'Antarāyas — the obstacles to yoga' },
  { id: 'ashtanga', title: 'Aṣṭāṅga — the eight limbs' },
  { id: 'asatkaryavada', title: 'Asatkāryavāda — the effect as new beginning' },
  { id: 'atman', title: 'Ātman — the self across sheaths' },
  { id: 'brahman-jiva-ishvara', title: 'Brahman–jīva–Īśvara — the threefold relation' },
  { id: 'citta-vritti', title: 'Citta-vṛtti — the turnings of the mind-stuff' },
  { id: 'dharma', title: 'Dharma — duty, law and the moral order' },
  { id: 'dravya', title: 'Dravya — the nine substances' },
  { id: 'duhkha-traya', title: 'Duḥkha-traya — the threefold suffering' },
  { id: 'fifty-dispositions', title: 'Fifty dispositions (bhāvas) of the intellect' },
  { id: 'five-klesas', title: 'Five kleśas — the afflictions' },
  { id: 'guna-karma', title: 'Guṇa and karma — quality and action' },
  { id: 'guna-lamp', title: 'Guṇa lamp — sattva, rajas, tamas' },
  { id: 'karma-wheel', title: 'Karma wheel — action and fruition' },
  { id: 'linga-sharira', title: 'Liṅga-śarīra — the subtle body' },
  { id: 'manas', title: 'Manas — the mind as inner sense' },
  { id: 'maya-powers', title: 'Māyā powers — the veiling and projecting powers' },
  { id: 'moksha', title: 'Mokṣa — release and its paths' },
  { id: 'padartha', title: 'Padārtha — the categories of reality' },
  { id: 'paramanu', title: 'Paramāṇu — the atom doctrine' },
  { id: 'parinamas', title: 'Pariṇāmas — the transformations' },
  { id: 'pramanas-diagram', title: 'Pramāṇas — the means of knowing' },
  { id: 'purusha-prakriti-union', title: 'Puruṣa–prakṛti union and release' },
  { id: 'samanya-visesa', title: 'Sāmānya and viśeṣa — universals and particulars' },
  { id: 'samavaya', title: 'Samavāya — inherence' },
  { id: 'samprajnata', title: 'Samprajñāta — cognitive absorption' },
  { id: 'samyama', title: 'Saṃyama — dhāraṇā, dhyāna, samādhi as one' },
  { id: 'satkaryavada-chain', title: 'Satkāryavāda — the effect pre-exists in the cause' },
  { id: 'tattva-tree', title: 'Tattva tree — the twenty-five principles' },
  { id: 'three-worlds', title: 'Three worlds — bhūr, bhuvaḥ, svaḥ' },
  { id: 'vivarta-vs-parinama', title: 'Vivarta vs pariṇāma — apparent vs real transformation' },
];

export const diagramRegistry: Record<string, DiagramMeta> = Object.fromEntries(
  entries.map((e) => [e.id, e]),
);
