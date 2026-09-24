/**
 * Tiered search artifact generation (Prompt 8).
 *
 * Usage: npm run content:index [-- --out <dir>]
 * Builds the full V2 search index from validated corpus data, then emits
 * the served tiered layout: one discovery file plus full per-text shards.
 * The canonical generation path is `npm run content:chunks`; this script
 * exists for inspecting/regenerating search artifacts on their own.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2, adaptSystemThread } from '../src/content/v2/adapters.ts';
import { buildSearchIndex, splitSearchIndex } from '../src/content/v2/search-index.ts';
import type { System } from '../src/types/content.ts';

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const outDir = outFlag >= 0 && args[outFlag + 1] ? (args[outFlag + 1] as string) : path.join('public', 'content', 'search');

const corpus = adaptSystemsToV2(systems);
const traditionThreads = (systems as System[]).flatMap((s) => adaptSystemThread(s));
const index = buildSearchIndex(corpus, traditionThreads);
const split = splitSearchIndex(index);

function writeJson(file: string, value: unknown): number {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = JSON.stringify(value);
  fs.writeFileSync(file, body, 'utf8');
  return Buffer.byteLength(body);
}

const discoveryBytes = writeJson(path.join(outDir, 'discovery.json'), split.discovery);
writeJson(path.join(outDir, 'discovery-ml.json'), split.discoveryMl);
let largest = { textId: '', bytes: 0 };
for (const [textId, entries] of split.shards) {
  const bytes = writeJson(path.join(outDir, 'texts', `${textId}.json`), {
    version: 2,
    generatedAt: index.generatedAt,
    entries,
  });
  if (bytes > largest.bytes) largest = { textId, bytes };
}

console.log(`Search tiers → ${outDir}/`);
console.log(`Discovery: ${split.discovery.entries.length} entries, ${(discoveryBytes / 1024).toFixed(0)} KB`);
console.log(`Shards: ${split.shards.size}, largest ${largest.textId} ${(largest.bytes / 1024).toFixed(0)} KB`);
