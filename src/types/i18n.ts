export type SupportedLanguage = 'en' | 'ml';

export interface LocalizedContent {
  title?: string;
  translation?: string;
  commentary?: string;
  summary?: string;
  narrative?: string;
  keyPoints?: string[];
  /** Original word-by-word gloss (padārtha) written for this app; never copied verbatim. */
  wordMeaning?: string;
  /** Original textual note (e.g. where Bhāskara's Vārttika differs, as reported by Singh). */
  variantNote?: string;
}