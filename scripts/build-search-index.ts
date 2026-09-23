/**
 * Build-time search-index generation (foundation).
 *
 * Usage: npm run content:index [-- --out <path>]
 * Writes a JSON search index generated from validated V2 data. The file
 * layout anticipates per-text chunks and a Web Worker consumer; this phase
 * emits a single index plus a header with entry counts.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { systems } from '../src/content/index.ts';
import { adaptSystemsToV2, adaptSystemThread } from '../src/content/v2/adapters.ts';
import { buildSearchIndex } from '../src/content/v2/search-index.ts';
import type { System } from '../src/types/content.ts';

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const outPath = outFlag >= 0 && args[outFlag + 1] ? (args[outFlag + 1] as string) : 'public/content/search-index.json';

const corpus = adaptSystemsToV2(systems);
const traditionThreads = (systems as System[]).flatMap((s) => adaptSystemThread(s));
const index = buildSearchIndex(corpus, traditionThreads);

const kinds: Record<string, number> = {};
for (const entry of index.entries) {
  kinds[entry.kind] = (kinds[entry.kind] || 0) + 1;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf8');

console.log(`Search index: ${index.entries.length} entries → ${outPath}`);
console.log(`Kinds: ${Object.entries(kinds).map(([k, v]) => `${k}=${v}`).join(' ')}`);
