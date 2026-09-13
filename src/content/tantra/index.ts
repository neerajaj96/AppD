import { System, SystemId } from '../../types/content';
import { deviMahatmyaText, deviMahatmyaThread } from '../devi-mahatmya';
import { kundaliniTantraText, kundaliniTantraThread } from '../kundalini-tantra';
import { lalitaSahasranamaText, lalitaSahasranamaThread } from '../lalita-sahasranama';

// Tantra system: goddess, energy and thousand names. Text files stay
// isolated in their own directories (devi-mahatmya/, kundalini-tantra/,
// lalita-sahasranama/); only the System assembly lives here. The Trika
// texts (Śiva-sūtras, Spanda-kārikās, Vijñānabhairava, Tantrāloka) now
// belong to the separate 'kashmir-shaivism' system (see
// src/content/kashmir-shaivism/index.ts). Thread order is the learning
// path: goddess (devotion/inner war) → energy (kuṇḍalinī method, closed by
// the foundations-and-practice bridge: tantra/āgama meaning,
// nivṛtti-pravṛtti union, the four means, Kaula sublimation) → thousand
// names (Śrīvidyā's complete icon). All three texts are book-extracted
// contents, lightly touched and paraphrased into this app's own
// summaries — no self-created synthesis text.
export const tantraSystem: System = {
  id: 'tantra' as SystemId,
  title: 'Tantra',
  subtitle: 'The non-dual science of Śakti — goddess, energy and thousand names',
  texts: [deviMahatmyaText, kundaliniTantraText, lalitaSahasranamaText],
  thread: [...deviMahatmyaThread, ...kundaliniTantraThread, ...lalitaSahasranamaThread],
};
