import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const tokensCss = readFileSync(
  resolve(__dirname, '../../src/styles/tokens.css'),
  'utf-8'
);

describe('design tokens', () => {
  it('defines all 13 brand color tokens from the spec', () => {
    const expected: RegExp[] = [
      /--color-primary:\s*#0e2a47/i,
      /--color-accent:\s*#00a6c0/i,
      /--color-carbon:\s*#1b1f23/i,
      /--color-surface:\s*#f6f8fa/i,
      /--color-surface-alt:\s*#edf1f5/i,
      /--color-stroke:\s*#e4e7eb/i,
      /--color-text-muted:\s*#9aa5b1/i,
      /--color-text-body:\s*#52606d/i,
      /--color-success:\s*#1f9d55/i,
      /--color-warning:\s*#c97a0f/i,
      /--color-error:\s*#b42318/i,
      /--color-tbd-bg:\s*#fff5e6/i,
      /--color-tbd-text:\s*#c97a0f/i,
    ];
    for (const token of expected) {
      expect(tokensCss).toMatch(token);
    }
  });

  it('defines an 8pt spacing scale', () => {
    expect(tokensCss).toMatch(/--space-1:\s*4px/);
    expect(tokensCss).toMatch(/--space-8:\s*96px/);
  });

  it('defines all required token families', () => {
    const expected: RegExp[] = [
      /--font-display:\s*/,
      /--font-body:\s*/,
      /--font-mono:\s*/,
      /--font-cjk:\s*/,

      /--section-py-mobile:\s*/,
      /--section-py-tablet:\s*/,
      /--section-py-desktop:\s*/,

      /--radius-card:\s*/,
      /--radius-button:\s*/,
      /--radius-pill:\s*/,

      /--max-content:\s*1280px/i,
      /--measure-body:\s*64ch/i,

      /--duration-fast:\s*/,
      /--duration-base:\s*/,
      /--duration-slow:\s*/,

      /--easing-base:\s*/,
    ];
    for (const token of expected) {
      expect(tokensCss).toMatch(token);
    }
  });

  it('switches font family for zh locales', () => {
    expect(tokensCss).toMatch(/html\[lang\^='zh'\]/);
    expect(tokensCss).toMatch(
      /html\[lang\^='zh'\]\s*\{[\s\S]*?--font-display:\s*var\(--font-cjk\)[\s\S]*?--font-body:\s*var\(--font-cjk\)[\s\S]*?\}/
    );
  });
});
