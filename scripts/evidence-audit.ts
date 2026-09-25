/**
 * V2 scholarly evidence audit CLI.
 *
 * Usage: npm run content:audit [-- --json]
 * Adapts the corpus, applies the shared provenance curation, then
 * validates before counting anything: errors fail loudly (non-zero
 * exit) so the audit can never fabricate counts after invalid data.
 * Human output by default, machine-readable matrix with --json.
 */
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2 } from '../src/content/v2/adapters.ts';
import { applyProvenanceCuration } from '../src/content/v2/curate.ts';
import { validateCorpus } from '../src/content/v2/validate.ts';
import { buildEvidenceAudit, formatEvidenceHuman } from '../src/content/v2/report.ts';

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');

const corpus = adaptSystemsToV2(systems);
applyProvenanceCuration(corpus);
const validation = validateCorpus(corpus);
if (validation.errors.length > 0) {
  console.error(`Evidence audit refused: corpus has ${validation.errors.length} validation errors:`);
  for (const issue of validation.errors.slice(0, 20)) {
    console.error(`  [${issue.code}] ${issue.textId || ''}${issue.entityId ? `/${issue.entityId}` : ''} ${issue.message}`);
  }
  process.exit(1);
}

const audit = buildEvidenceAudit(corpus);
if (jsonOnly) {
  console.log(JSON.stringify(audit, null, 2));
} else {
  console.log(formatEvidenceHuman(audit));
}
