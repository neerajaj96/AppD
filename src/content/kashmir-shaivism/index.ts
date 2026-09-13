import { ClassicalText, System, SystemId } from '../../types/content';
import { buildClassicalText, buildSystemThread } from '../factory';
import { tantralokaConceptsEn, TantralokaConcept } from './tantraloka-concepts-en';
import { shivaSutrasText, shivaSutrasThread } from './shiva-sutras';
import { spandaKarikaText, spandaKarikaThread } from './spanda-karika';
import { vijnanabhairavaText, vijnanabhairavaThread } from './vijnanabhairava';
import { tantralokaConceptsMl } from './tantraloka-concepts-ml';
import { tantralokaThreadMl } from './tantraloka-thread-ml';
import { tantralokaVersesEn } from './tantraloka-verses-en';
import { tantralokaVersesMl } from './tantraloka-verses-ml';
import { mishraTrikaConceptsEn } from './mishra-trika-concepts-en';
import { mishraTrikaConceptsMl } from './mishra-trika-concepts-ml';
import { mishraTrikaThreadEn } from './mishra-trika-thread-en';
import { mishraTrikaThreadMl } from './mishra-trika-thread-ml';

const mappedConceptsEn = tantralokaConceptsEn.map((c: TantralokaConcept) => ({
  id: c.id,
  title: `${c.sanskrit} (${c.iast}) - ${c.english}`,
  category: c.category,
  summary: c.definition + "\n\nSignificance: " + c.significance + (c.forBeginners ? "\n\nFor Beginners: " + c.forBeginners : ""),
  relatedConceptIds: c.relatedConcepts
}));

const mappedConceptsMl = Object.entries({ ...tantralokaConceptsMl, ...mishraTrikaConceptsMl }).map(([id, c]) => ({
  id,
  title: (c as { title: string }).title,
  summary: (c as { summary: string }).summary,
}));

const mappedThreadEn = tantralokaConceptsEn.map((c: TantralokaConcept, index: number) => ({
  id: `ks-step-${index + 1}`,
  conceptId: c.id,
  title: c.english,
  narrative: `Part of the master ontology of Kashmir Shaivism.\n\nCategory: ${c.category}\n\n${c.definition}\n\n${c.forBeginners ? "For Beginners: " + c.forBeginners : ""}`
}));

const mappedThreadMl = Object.entries({ ...tantralokaThreadMl, ...mishraTrikaThreadMl }).map(([id, t]) => ({
  id,
  title: (t as { title: string }).title,
  narrative: (t as { narrative: string }).narrative
}));

// Text file stays isolated in this directory; the text now belongs to the
// 'kashmir-shaivism' system assembled at the bottom of this file.
// The closing synthesis (ks-step-190+) carries the metaphysical chapters of
// the former standalone Mishra study guide, merged here verbatim — its
// foundation and practice chapters live instead in the Kuṇḍalinī Tantra text
// (see ../kundalini-tantra/mishra-bridge-concepts-en.ts). The merged steps
// carry full Malayalam overlays (mishra-trika-thread-ml.ts,
// mishra-trika-concepts-ml.ts).
export const tantralokaText: ClassicalText = buildClassicalText(
  {
    id: 'tantraloka',
    title: 'Tantrāloka',
    transliteratedTitle: 'Tantrāloka',
    author: 'Abhinavagupta',
    system: 'kashmir-shaivism',
    contentDepth: 'full',
    verseTerm: 'Śloka'
  },
  {
    en: tantralokaVersesEn,
    ml: tantralokaVersesMl
  },
  {
    en: [...mappedConceptsEn, ...mishraTrikaConceptsEn],
    ml: mappedConceptsMl
  }
);

export const tantralokaThread = buildSystemThread('tantraloka', {
  en: [...mappedThreadEn, ...mishraTrikaThreadEn],
  ml: mappedThreadMl
});

export { shivaSutrasText, shivaSutrasThread } from './shiva-sutras';
export { spandaKarikaText, spandaKarikaThread } from './spanda-karika';
export { vijnanabhairavaText, vijnanabhairavaThread } from './vijnanabhairava';

// Separate Kashmir Shaivism system (Trika). Text files stay isolated in
// their own directories (shiva-sutras/, spanda-karika/, vijnanabhairava/,
// this directory for Tantrāloka); only the System assembly lives here.
// Thread order is the learning path: recognition aphorisms (Śiva-sūtras,
// the root Trika means) → dynamic pulsation (Spanda-kārikās, the sūtras'
// verse-unfolding) → 112 practice-gates (Vijñānabhairava, the method
// treasury) → recognition metaphysics (Tantrāloka, closed by the Trika
// synthesis after Mishra's "Kashmir Shaivism: The Central Philosophy of
// Tantrism" — concepts-only, original paraphrases, see
// mishra-source-provenance.ts).
export const kashmirShaivismSystem: System = {
  id: 'kashmir-shaivism' as SystemId,
  title: 'Kashmir Shaivism',
  subtitle: 'The Trika recognition — aphorisms, pulsation, 112 gates, metaphysics',
  texts: [shivaSutrasText, spandaKarikaText, vijnanabhairavaText, tantralokaText],
  thread: [...shivaSutrasThread, ...spandaKarikaThread, ...vijnanabhairavaThread, ...tantralokaThread],
};
