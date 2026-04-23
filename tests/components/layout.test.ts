import { describe, expect, it } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Container from '../../src/components/layout/Container.astro';
import Section from '../../src/components/layout/Section.astro';
import LangSwitcher from '../../src/components/layout/LangSwitcher.astro';

describe('Container', () => {
  it('renders default tag div with content', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Container, { slots: { default: 'inner' } });
    expect(html).toMatch(/<div[^>]+class[^>]+container[^>]*>/);
    expect(html).toContain('inner');
  });
  it('honors `as` prop', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Container, {
      props: { as: 'main' },
      slots: { default: 'x' },
    });
    expect(html).toMatch(/<main[^>]+class[^>]+container/);
  });
});

describe('Section', () => {
  it('applies the surface variant class', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Section, {
      props: { surface: 'navy' },
      slots: { default: 'x' },
    });
    expect(html).toContain('section--navy');
  });
  it('defaults to white surface', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Section, { slots: { default: 'x' } });
    expect(html).toContain('section--white');
  });
});

describe('LangSwitcher', () => {
  it('points to /zh-tw when on EN homepage', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(LangSwitcher, {
      props: { currentLocale: 'en', currentPath: '/' },
    });
    expect(html).toMatch(/href="\/zh-tw"/);
    expect(html).toContain('繁中');
  });
  it('points to / when on zh-TW homepage', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(LangSwitcher, {
      props: { currentLocale: 'zh-TW', currentPath: '/zh-tw' },
    });
    expect(html).toMatch(/href="\/"/);
    expect(html).toContain('EN');
  });
  it('preserves a deeper EN path when switching to zh-TW', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(LangSwitcher, {
      props: { currentLocale: 'en', currentPath: '/products' },
    });
    expect(html).toMatch(/href="\/zh-tw\/products"/);
  });
});
