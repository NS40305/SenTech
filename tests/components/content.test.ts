import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const contentRoot = resolve(__dirname, '../../src/content');

function readJson<T = any>(rel: string): T {
  return JSON.parse(readFileSync(resolve(contentRoot, rel), 'utf-8'));
}

function listFiles(dir: string, ext: string): string[] {
  return readdirSync(resolve(contentRoot, dir)).filter((f) => f.endsWith(ext));
}

describe('content collections', () => {
  it('loads home content for both locales', () => {
    const files = listFiles('home', '.json');
    expect(files).toContain('home-en.json');
    expect(files).toContain('home-zh-TW.json');
  });

  it('loads exactly 32 product entries (16 lines × 2 locales)', () => {
    const files = listFiles('products', '.md');
    expect(files.length).toBe(32);
    const enCount = files.filter((f) => f.endsWith('-en.md')).length;
    expect(enCount).toBe(16);
  });

  it('home numbers strip has exactly 5 stats per locale', () => {
    for (const file of listFiles('home', '.json')) {
      const data = readJson<{ numbers: unknown[] }>(`home/${file}`);
      expect(data.numbers.length).toBe(5);
    }
  });

  it('milestones include the 1994 founding year for both locales', () => {
    for (const file of listFiles('milestones', '.json')) {
      const data = readJson<{ items: { year: number }[] }>(`milestones/${file}`);
      expect(data.items.some((m) => m.year === 1994)).toBe(true);
    }
  });
});
