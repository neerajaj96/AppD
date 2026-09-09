import { SupportedLanguage } from '../types/i18n';

/**
 * Central UI chrome localizations (Guna-law compliant: no ad-hoc strings
 * scattered in components). Content translations (verses/concepts/threads)
 * stay in src/content/*; this file covers only screen labels, buttons,
 * placeholders and section headings so every screen is fully readable in
 * Malayalam mode.
 */

const en = {
  appTagline:
    'An exploration of classical Indian philosophical systems (Darśanas), their foundational texts, and core concepts.',
  textsLabel: 'Texts',
  conceptsCount: 'concepts',
  systemNotFound: 'System not found',
  textNotFound: 'Text not found',
  threadNotFound: 'Thread not found',
  loading: 'Loading...',
  primaryTexts: 'Primary Texts',
  authorLabel: 'Author',
  conceptsLabel: 'Concepts',
  philosophicalConcepts: 'philosophical concepts',
  coreThread: 'Core Philosophy Thread',
  exploreNarrative: 'Explore the {title} Narrative',
  exploreNarrativeDesc:
    'A structured, step-by-step thread tracing the foundational metaphysics and epistemology of {title} from initial commentary to supreme release.',
  startThread: 'Start Thread ({count} Steps)',
  foundationalConcepts: 'Foundational Concepts ({count})',
  filterConcepts: 'Filter concepts...',
  allLabel: 'All ({count})',
  allVerses: 'All ({count})',
  exploreConcept: 'Explore Concept',
  openConceptArticle: 'Open full concept article →',
  openConceptArticleShort: 'Open concept article →',
  crossRefVerses: 'Cross-Referenced Verses',
  relatedConcepts: 'Related Concepts',
  relatedVerses: 'Related Verses',
  exploredInThread: 'Explored In Thread',
  alsoInOtherDarshanas: 'Also In Other Darshanas',
  previous: 'Previous',
  next: 'Next',
  backToSystem: 'Back to System',
  backToIndex: 'Back to Index',
  threadLabel: 'Thread',
  stepOf: 'Step {current} of {total}',
  coreConcept: 'Core Concept',
  summaryLabel: 'Summary',
  keyInsights: 'Key Insights',
  keyPoints: 'Key Points',
  translationLabel: 'Translation',
  commentaryLabel: 'Commentary',
  definingLabel: 'Defining {term} ({count})',
  conceptLabel: 'Concept',
  shareLabel: 'Share',
  copiedLabel: 'Copied',
  copyShareTitle: 'Copy or share verse text',
  englishTranslationTitle: 'English translation',
  malayalamTranslationTitle: 'മലയാളം വിവർത്തനം',
  mlFallbackVerse: 'Malayalam translation for this verse is pending. Displaying English version.',
  mlFallbackThread: 'Malayalam translation for this thread step is pending. Displaying English version.',
  searchVersesPlaceholder: 'Search {term} by term, number, or Sanskrit...',
  searchConceptsPlaceholder: 'Search concepts, categories, or Sanskrit terms...',
  browseBySection: 'Browse by section',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  noConceptsFound: 'No concepts found matching "{query}"',
  noVersesFound: 'No {term} found matching "{query}"',
  linkedVerses: '{count} linked {term}',
  relatedConceptsCount: '{count} related concepts',
  systemOverview: 'System Overview & Epistemic Foundations',
  corePillars: 'Core Philosophical Pillars',
  viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
  conceptNotFound: 'Concept not found',
  verseNotFoundFallback: '{term} not found',
} as const;

const ml: Record<keyof typeof en, string> = {
  appTagline:
    'ഭാരതീയ ദർശനങ്ങളുടെയും അവയുടെ മൂലഗ്രന്ഥങ്ങളുടെയും അടിസ്ഥാന തത്ത്വങ്ങളുടെയും പരിചയം.',
  textsLabel: 'ഗ്രന്ഥങ്ങൾ',
  conceptsCount: 'ആശയങ്ങൾ',
  systemNotFound: 'ദർശനം കണ്ടെത്താനായില്ല',
  textNotFound: 'ഗ്രന്ഥം കണ്ടെത്താനായില്ല',
  threadNotFound: 'ചിന്താധാര കണ്ടെത്താനായില്ല',
  loading: 'ലോഡ് ചെയ്യുന്നു...',
  primaryTexts: 'മൂലഗ്രന്ഥങ്ങൾ',
  authorLabel: 'കർത്താവ്',
  conceptsLabel: 'ആശയങ്ങൾ',
  philosophicalConcepts: 'ദാർശനിക ആശയങ്ങൾ',
  coreThread: 'അടിസ്ഥാന ചിന്താധാര',
  exploreNarrative: '{title} ആഖ്യാനം പര്യവേക്ഷണം ചെയ്യുക',
  exploreNarrativeDesc:
    '{title} ദർശനത്തിന്റെ അടിസ്ഥാന തത്ത്വങ്ങളെയും ജ്ഞാനശാസ്ത്രത്തെയും ഘട്ടംഘട്ടമായി വിവരിക്കുന്ന ചിന്താധാര.',
  startThread: 'ധാര തുടങ്ങുക ({count} ഘട്ടങ്ങൾ)',
  foundationalConcepts: 'അടിസ്ഥാന ആശയങ്ങൾ ({count})',
  filterConcepts: 'ആശയങ്ങൾ തിരയുക...',
  allLabel: 'എല്ലാം ({count})',
  allVerses: 'എല്ലാം ({count})',
  exploreConcept: 'ആശയം പര്യവേക്ഷണം ചെയ്യുക',
  openConceptArticle: 'പൂർണ്ണ ആശയലേഖനം തുറക്കുക →',
  openConceptArticleShort: 'ആശയലേഖനം തുറക്കുക →',
  crossRefVerses: 'ബന്ധപ്പെട്ട ശ്ലോകങ്ങൾ/സൂത്രങ്ങൾ',
  relatedConcepts: 'ബന്ധപ്പെട്ട ആശയങ്ങൾ',
  relatedVerses: 'ബന്ധപ്പെട്ട ശ്ലോകങ്ങൾ',
  exploredInThread: 'ചിന്താധാരയിൽ പരാമർശിച്ചിരിക്കുന്നു',
  alsoInOtherDarshanas: 'മറ്റ് ദർശനങ്ങളിലും',
  previous: 'മുമ്പത്തേത്',
  next: 'അടുത്തത്',
  backToSystem: 'ദർശനത്തിലേക്ക് മടങ്ങുക',
  backToIndex: 'സൂചികയിലേക്ക് മടങ്ങുക',
  threadLabel: 'ചിന്താധാര',
  stepOf: '{current} / {total} ഘട്ടം',
  coreConcept: 'മുഖ്യ ആശയം',
  summaryLabel: 'സംഗ്രഹം',
  keyInsights: 'മുഖ്യ ഉൾക്കാഴ്ചകൾ',
  keyPoints: 'പ്രധാന തത്ത്വങ്ങൾ',
  translationLabel: 'വിവർത്തനം',
  commentaryLabel: 'ഭാഷ്യം / വ്യാഖ്യാനം',
  definingLabel: '{term} നിർവ്വചിക്കുന്നത് ({count})',
  conceptLabel: 'ആശയം',
  shareLabel: 'പങ്കിടുക',
  copiedLabel: 'പകർത്തി',
  copyShareTitle: 'ശ്ലോകം പകർത്തുക അല്ലെങ്കിൽ പങ്കിടുക',
  englishTranslationTitle: 'English translation',
  malayalamTranslationTitle: 'മലയാളം വിവർത്തനം',
  mlFallbackVerse: 'ഈ ശ്ലോകത്തിന്റെ മലയാള വിവർത്തനം തയ്യാറായിട്ടില്ല. ഇംഗ്ലീഷ് പതിപ്പ് കാണിക്കുന്നു.',
  mlFallbackThread: 'ഈ ഘട്ടത്തിന്റെ മലയാള വിവർത്തനം തയ്യാറായിട്ടില്ല. ഇംഗ്ലീഷ് പതിപ്പ് കാണിക്കുന്നു.',
  searchVersesPlaceholder: 'പദം, നമ്പർ അല്ലെങ്കിൽ സംസ്കൃതം ഉപയോഗിച്ച് തിരയുക...',
  searchConceptsPlaceholder: 'ആശയങ്ങൾ, വിഭാഗങ്ങൾ അല്ലെങ്കിൽ സംസ്കൃത പദങ്ങൾ തിരയുക...',
  browseBySection: 'വിഭാഗം തിരഞ്ഞെടുക്കുക',
  expandAll: 'എല്ലാം തുറക്കുക',
  collapseAll: 'എല്ലാം അടയ്ക്കുക',
  noConceptsFound: '"{query}" എന്നതുമായി പൊരുത്തപ്പെടുന്ന ആശയങ്ങളില്ല',
  noVersesFound: '"{query}" എന്നതുമായി പൊരുത്തപ്പെടുന്നവയില്ല',
  linkedVerses: '{count} ബന്ധപ്പെട്ട {term}',
  relatedConceptsCount: '{count} ബന്ധപ്പെട്ട ആശയങ്ങൾ',
  systemOverview: 'ദർശന ആമുഖവും അടിസ്ഥാന തത്ത്വങ്ങളും',
  corePillars: 'മുഖ്യ തത്ത്വങ്ങൾ',
  viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
  conceptNotFound: 'ആശയം കണ്ടെത്താനായില്ല',
  verseNotFoundFallback: '{term} കണ്ടെത്താനായില്ല',
};

export type UIKey = keyof typeof en;

export const uiStrings: Record<SupportedLanguage, Record<UIKey, string>> = { en, ml };

/** Translate a UI key, with {placeholders} interpolation. */
export function t(lang: SupportedLanguage, key: UIKey, vars?: Record<string, string | number>): string {
  let s: string = uiStrings[lang]?.[key] ?? uiStrings.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}
