import { System, SystemId } from '../../types/content';
import { tantralokaText, tantralokaThread } from '../kashmir-shaivism';
import { deviMahatmyaText, deviMahatmyaThread } from '../devi-mahatmya';
import { kundaliniTantraText, kundaliniTantraThread } from '../kundalini-tantra';

// Unified Tantra system. Text files stay isolated in their own directories
// (devi-mahatmya/, kashmir-shaivism/, kundalini-tantra/); only the
// System assembly lives here. Thread order is the learning path: goddess
// (devotion/inner war) → energy (kuṇḍalinī method) → recognition (Trika
// metaphysics). All three texts are book-extracted contents, lightly touched
// and paraphrased into this app's own summaries — no self-created synthesis text.
export const tantraSystem: System = {
  id: 'tantra' as SystemId,
  title: 'Tantra',
  subtitle: 'The non-dual science of Śakti — goddess, energy and recognition',
  texts: [deviMahatmyaText, kundaliniTantraText, tantralokaText],
  thread: [...deviMahatmyaThread, ...kundaliniTantraThread, ...tantralokaThread],
};
