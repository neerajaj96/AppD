import { System, SystemId } from '../types/content';
import { samkhyaKarika } from './samkhya/samkhya-karika';
import { samkhyaThread } from './samkhya/samkhya-thread';
import { yogaSutras, yogaSutrasThread } from './yoga/yoga-sutras';
import { nyayaSutras, nyayaSutrasThread } from './nyaya/nyaya-sutras';
import { vaisesikaSystem } from './vaisesika';
import { mimamsaSystem } from './mimamsa';
import { vedantaSystem } from './vedanta';
import { tantraSystem } from './tantra';

export const systems: System[] = [
  {
    id: 'samkhya' as SystemId,
    title: 'Sāṃkhya',
    subtitle: 'The reckoning of principles',
    texts: [samkhyaKarika],
    thread: samkhyaThread,
  },
  {
    id: 'yoga' as SystemId,
    title: 'Yoga',
    subtitle: "The stilling of the mind's fluctuations",
    texts: [yogaSutras],
    thread: yogaSutrasThread,
  },
  {
    id: 'nyaya' as SystemId,
    title: 'Nyāya',
    subtitle: 'The architecture of logic, epistemology, and fruitful action (Pravṛtti-sāmarthya)',
    texts: [nyayaSutras],
    thread: nyayaSutrasThread,
  },
  vaisesikaSystem,
  mimamsaSystem,
  vedantaSystem,
  tantraSystem
];

export const getSystem = (id: string) => systems.find((s) => s.id === id);

export const getText = (systemId: string, textId: string) =>
  getSystem(systemId)?.texts.find((t) => t.id === textId);

export const getVerse = (systemId: string, textId: string, verseId: string) =>
  getText(systemId, textId)?.verses.find((v) => v.id === verseId);

export const getConcept = (systemId: string, textId: string, conceptId: string) =>
  getText(systemId, textId)?.concepts.find((c) => c.id === conceptId);

export const allTexts = () => systems.flatMap((s) => s.texts);

const verseIndex = new Set<string>();

systems.forEach(sys => {
  sys.texts.forEach(text => {
    text.verses.forEach(v => verseIndex.add(`${sys.id}:${text.id}:${v.id}`));
  });
});

export const hasVerse = (systemId: string, textId: string, verseId: string) =>
  verseIndex.has(`${systemId}:${textId}:${verseId}`);

const conceptIndex = new Set<string>();

systems.forEach(sys => {
  sys.texts.forEach(text => {
    text.concepts.forEach(c => conceptIndex.add(`${sys.id}:${text.id}:${c.id}`));
  });
});

export const hasConcept = (systemId: string, textId: string, conceptId: string) =>
  conceptIndex.has(`${systemId}:${textId}:${conceptId}`);
