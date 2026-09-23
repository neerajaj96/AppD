/**
 * V2 content validator CLI.
 *
 * Usage: npm run content:validate [-- --json]
 * Exit status is non-zero when errors are found. Warnings never fail
 * the build but are always reported beside errors.
 */
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2 } from '../src/content/v2/adapters.ts';
import { validateCorpus } from '../src/content/v2/validate.ts';

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');

const corpus = adaptSystemsToV2(systems);
const result = validateCorpus(corpus);

if (jsonOnly) {
  console.log(JSON.stringify({ errors: result.errors, warnings: result.warnings }, null, 2));
} else {
  console.log(`V2 content validation (schemaVersion ${corpus.schemaVersion})`);
  console.log(`Texts: ${corpus.texts.length} · Traditions: ${corpus.traditions.length}`);
  console.log(`Errors: ${result.errors.length} · Warnings: ${result.warnings.length}`);
  for (const issue of result.errors) {
    console.log(`ERROR [${issue.code}] ${issue.textId || ''}${issue.entityId ? `/${issue.entityId}` : ''} ${issue.message}`);
  }
  for (const issue of result.warnings.slice(0, 100)) {
    console.log(`WARN  [${issue.code}] ${issue.textId || ''}${issue.entityId ? `/${issue.entityId}` : ''} ${issue.message}`);
  }
  if (result.warnings.length > 100) {
    console.log(`… and ${result.warnings.length - 100} further warnings`);
  }
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log('Content validates cleanly.');
  }
}

if (result.errors.length > 0) {
  process.exit(1);
}
