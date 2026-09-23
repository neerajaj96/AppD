/**
 * V2 content report CLI.
 *
 * Usage: npm run content:report [-- --json]
 * Always exits zero; it describes the corpus rather than gating it.
 */
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2 } from '../src/content/v2/adapters.ts';
import { buildContentReport, formatReportHuman } from '../src/content/v2/report.ts';

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');

const corpus = adaptSystemsToV2(systems);
const report = buildContentReport(corpus);

if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(formatReportHuman(report));
}
