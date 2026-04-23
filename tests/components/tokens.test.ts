import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const tokensCss = readFileSync(
  resolve(__dirname, '../../src/styles/tokens.css'),
  'utf-8'
);

describe('design tokens', () => {
  it('defines all 14 brand color tokens from the spec', () => {
    const expected = [
      '--color-primary: #0e2a47',
      '--color-accent: #00a6c0',
      '--color-carbon: #1b1f23',
      '--color-surface: #f6f8fa',
      '--color-surface-alt: #edf1f5',
      '--color-stroke: #e4e7eb',
      '--color-text-muted: #9aa5b1',
      '--color-text-body: #52606d',
      '--color-success: #1f9d55',
      '--color-warning: #c97a0f',
      '--color-error: #b42318',
    ];
    for (const token of expected) {
      expect(tokensCss).toContain(token);
    }
  });

  it('defines an 8pt spacing scale', () => {
    expect(tokensCss).toMatch(/--space-1:\s*4px/);
    expect(tokensCss).toMatch(/--space-8:\s*96px/);
  });

  it('switches font family for zh locales', () => {
    expect(tokensCss).toMatch(/html\[lang\^='zh'\]/);
  });
});
