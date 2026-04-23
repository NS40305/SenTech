#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const exts = ['.json', '.md', '.astro', '.ts'];
const skipDirs = ['node_modules', 'dist', '.astro', '.git', 'tests', 'tools', 'docs'];
const re = /\[TBD[^\]]*\]/g;

let count = 0;
const findings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.includes(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (exts.includes(extname(name))) {
      const txt = readFileSync(p, 'utf-8');
      const matches = txt.match(re);
      if (matches) {
        count += matches.length;
        for (const m of matches) findings.push({ file: p.replace(root, ''), match: m });
      }
    }
  }
}

walk(join(root, 'src'));
console.log(`\nTBD markers: ${count}`);
for (const f of findings.slice(0, 50)) {
  console.log(`  ${f.file} :: ${f.match}`);
}
if (findings.length > 50) console.log(`  ...and ${findings.length - 50} more`);
process.exit(0);
