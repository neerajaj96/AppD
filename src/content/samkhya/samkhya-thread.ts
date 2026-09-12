import { buildSystemThread } from '../factory';
import { samkhyaKarikaThread as en } from './samkhya-karika-thread';
import { samkhyaKarikaThreadMl as ml } from './samkhya-karika-thread-ml';
import { samkhyaSutraThread } from './samkhya-sutra';

// Multi-text precedent (cf. Vedanta): Karika thread (textId
// 'samkhya-karika') followed by Sutra thread (textId 'samkhya-sutra').
// The ml Karika map is currently an empty record, so the factory falls
// back to en narratives with a console warning — same as before.
const karikaThread = buildSystemThread('samkhya-karika', { en, ml });

export const samkhyaThread = [...karikaThread, ...samkhyaSutraThread];
