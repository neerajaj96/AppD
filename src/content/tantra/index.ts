import { System, SystemId } from '../../types/content';
import { tantralokaText, tantralokaThread } from '../kashmir-shaivism';
import { shivaSutrasText, shivaSutrasThread } from '../kashmir-shaivism/shiva-sutras';
import { spandaKarikaText, spandaKarikaThread } from '../kashmir-shaivism/spanda-karika';
import { deviMahatmyaText, deviMahatmyaThread } from '../devi-mahatmya';
import { kundaliniTantraText, kundaliniTantraThread } from '../kundalini-tantra';
import { lalitaSahasranamaText, lalitaSahasranamaThread } from '../lalita-sahasranama';

// Unified Tantra system. Text files stay isolated in their own directories
// (devi-mahatmya/, kashmir-shaivism/, kundalini-tantra/, lalita-sahasranama/);
// only the System assembly lives here. Thread order is the learning path:
// goddess (devotion/inner war) → energy (kuṇḍalinī method) → thousand names
// (Śrīvidyā's complete icon) → recognition aphorisms (Śiva-sūtras, the root
// Trika means) → dynamic pulsation (Spanda-kārikās, the sūtras' verse-unfolding)
// → recognition metaphysics (Tantrāloka). All six
// texts are book-extracted contents, lightly touched and paraphrased into
// this app's own summaries — no self-created synthesis text.
export const tantraSystem: System = {
  id: 'tantra' as SystemId,
  title: 'Tantra',
  subtitle: 'The non-dual science of Śakti — goddess, energy and recognition',
  texts: [deviMahatmyaText, kundaliniTantraText, lalitaSahasranamaText, shivaSutrasText, spandaKarikaText, tantralokaText],
  thread: [...deviMahatmyaThread, ...kundaliniTantraThread, ...lalitaSahasranamaThread, ...shivaSutrasThread, ...spandaKarikaThread, ...tantralokaThread],
};
