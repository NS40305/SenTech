// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Button from '../../src/components/primitives/Button.astro';
import Eyebrow from '../../src/components/primitives/Eyebrow.astro';
import Stat from '../../src/components/primitives/Stat.astro';

describe('Button', () => {
  it('renders an <a> when href is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Button, {
      props: { href: '/contact', variant: 'primary' },
      slots: { default: 'Contact us' },
    });
    expect(html).toMatch(/<a[^>]+href="\/contact"[^>]*>/);
    expect(html).toContain('btn--primary');
    expect(html).toContain('Contact us');
  });

  it('renders a <button type="submit"> when no href', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Button, {
      props: { type: 'submit', variant: 'primary' },
      slots: { default: 'Send' },
    });
    expect(html).toMatch(/<button[^>]+type="submit"[^>]*>/);
  });

  it('renders ghost variant with arrow', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Button, {
      props: { variant: 'ghost', href: '/products' },
      slots: { default: 'View all' },
    });
    expect(html).toContain('btn--ghost');
    expect(html).toContain('→');
  });
});

describe('Eyebrow', () => {
  it('renders uppercase span with provided text', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Eyebrow, {
      slots: { default: 'Why SEN TECH' },
    });
    expect(html).toContain('class="eyebrow"');
    expect(html).toContain('Why SEN TECH');
  });
});

describe('Stat', () => {
  it('renders value and label', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Stat, {
      props: { value: '30', suffix: '+', label: 'years', animate: true },
    });
    expect(html).toContain('30');
    expect(html).toContain('+');
    expect(html).toContain('years');
    expect(html).toContain('data-animate="true"');
  });
});
