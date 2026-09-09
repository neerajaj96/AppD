import { System, SystemId } from '../../types/content';
import { tantralokaText, tantralokaThread } from '../kashmir-shaivism';
import { deviMahatmyaText, deviMahatmyaThread } from '../devi-mahatmya';
import { kundaliniTantraText, kundaliniTantraThread } from '../kundalini-tantra';
import { tantraSiddhantaText, tantraSiddhantaThread } from './tantra-siddhanta';

// Unified Tantra system. Text files stay isolated in their own directories
// (devi-mahatmya/, kashmir-shaivism/, kundalini-tantra/, tantra/); only the
// System assembly lives here. Thread order is the learning path: goddess
// (devotion/inner war) → energy (kuṇḍalinī method) → recognition (Trika
// metaphysics) → our own synthesis as crown.
export const tantraSystem: System = {
  id: 'tantra' as SystemId,
  title: 'Tantra',
  subtitle: 'The non-dual science of Śakti — goddess, energy and recognition',
  texts: [deviMahatmyaText, kundaliniTantraText, tantralokaText, tantraSiddhantaText],
  thread: [...deviMahatmyaThread, ...kundaliniTantraThread, ...tantralokaThread, ...tantraSiddhantaThread],
};
