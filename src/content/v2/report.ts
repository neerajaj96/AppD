import type { V2Corpus } from './schema';

/**
 * Content report — a human- and machine-friendly overview of the V2 corpus.
 * Counts systems, texts, canonical units, concepts and threads, plus
 * language coverage, provenance completeness, editorial status and
 * reference health. Problem files and entity IDs are listed explicitly so
 * editors know where to look next.
 */

export interface ContentReport {
  systems: number;
  texts: number;
  units: number;
  concepts: number;
  threads: number;
  threadSteps: number;
  languageCoverage: {
    english: { units: number; concepts: number };
    malayalam: { units: number; concepts: number };
  };
  sourceCoverage: { provenanceComplete: number; provenancePartial: number; unknown: number };
  editorial: Record<string, number>;
  referenceHealth: { valid: number; broken: number; ambiguous: number };
  problems: Array<{ textId: string; entityId?: string; detail: string }>;
}

export function buildContentReport(corpus: V2Corpus): ContentReport {
  let units = 0;
  let concepts = 0;
  let threads = 0;
  let threadSteps = 0;
  let enUnits = 0;
  let mlUnits = 0;
  let enConcepts = 0;
  let mlConcepts = 0;
  let provenanceComplete = 0;
  let provenancePartial = 0;
  let unknown = 0;
  let valid = 0;
  let broken = 0;
  const problems: ContentReport['problems'] = [];
  const editorial: Record<string, number> = {};

  const bumpEditorial = (state?: string) => {
    const key = state || 'missing';
    editorial[key] = (editorial[key] || 0) + 1;
  };

  for (const text of corpus.texts) {
    const unitIds = new Set(text.units.map((u) => u.id));
    const conceptIds = new Set(text.concepts.map((c) => c.id));
    units += text.units.length;
    concepts += text.concepts.length;
    threads += (text.threads || []).length;
    for (const thread of text.threads || []) threadSteps += thread.steps.length;

    for (const unit of text.units) {
      if (unit.localisations.en?.translation || unit.localisations.en?.commentary) enUnits += 1;
      else problems.push({ textId: text.id, entityId: unit.id, detail: 'missing English localisation' });
      if (unit.localisations.ml?.translation || unit.localisations.ml?.commentary) mlUnits += 1;
      if (unit.provenance?.sourceTitle) provenanceComplete += 1;
      else if (unit.provenance) provenancePartial += 1;
      else unknown += 1;
      bumpEditorial(unit.editorial?.englishTranslation);
      for (const cid of unit.conceptIds || []) {
        if (conceptIds.has(cid)) valid += 1;
        else {
          broken += 1;
          problems.push({ textId: text.id, entityId: unit.id, detail: `dangling concept ${cid}` });
        }
      }
    }
    for (const concept of text.concepts) {
      if (concept.localisations.en?.title) enConcepts += 1;
      if (concept.localisations.ml?.title) mlConcepts += 1;
      for (const uid of concept.relatedUnitIds || []) {
        if (unitIds.has(uid)) valid += 1;
        else {
          broken += 1;
          problems.push({ textId: text.id, entityId: concept.id, detail: `dangling unit ${uid}` });
        }
      }
    }
  }

  return {
    systems: corpus.traditions.length,
    texts: corpus.texts.length,
    units,
    concepts,
    threads,
    threadSteps,
    languageCoverage: {
      english: { units: enUnits, concepts: enConcepts },
      malayalam: { units: mlUnits, concepts: mlConcepts },
    },
    sourceCoverage: { provenanceComplete, provenancePartial, unknown },
    editorial,
    referenceHealth: { valid, broken, ambiguous: 0 },
    problems,
  };
}

export function formatReportHuman(report: ContentReport): string {
  const lines = [
    'SYSTEMS                 ' + report.systems,
    'TEXTS                   ' + report.texts,
    'CANONICAL UNITS         ' + report.units,
    'CONCEPTS                ' + report.concepts,
    'THREADS                 ' + report.threads,
    'THREAD STEPS            ' + report.threadSteps,
    'LANGUAGE COVERAGE',
    `  ENGLISH units         ${report.languageCoverage.english.units}`,
    `  ENGLISH concepts      ${report.languageCoverage.english.concepts}`,
    `  MALAYALAM units       ${report.languageCoverage.malayalam.units}`,
    `  MALAYALAM concepts    ${report.languageCoverage.malayalam.concepts}`,
    'SOURCE COVERAGE',
    `  PROVENANCE COMPLETE   ${report.sourceCoverage.provenanceComplete}`,
    `  PROVENANCE PARTIAL    ${report.sourceCoverage.provenancePartial}`,
    `  UNKNOWN               ${report.sourceCoverage.unknown}`,
    'REFERENCE HEALTH',
    `  VALID                 ${report.referenceHealth.valid}`,
    `  BROKEN                ${report.referenceHealth.broken}`,
    `  AMBIGUOUS             ${report.referenceHealth.ambiguous}`,
  ];
  if (report.problems.length > 0) {
    lines.push(`PROBLEMS (${report.problems.length})`);
    for (const p of report.problems.slice(0, 50)) {
      lines.push(`  - ${p.textId}${p.entityId ? `/${p.entityId}` : ''}: ${p.detail}`);
    }
    if (report.problems.length > 50) lines.push(`  … and ${report.problems.length - 50} more`);
  }
  return lines.join('\n');
}
