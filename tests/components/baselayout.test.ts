import { describe, expect, it } from 'vitest';
import { localizedPath, stripLocaleFromPath, t } from '../../src/i18n/ui';

describe('i18n helpers', () => {
  it('returns the EN string when locale is en', () => {
    expect(t('en', 'cta.requestSample')).toBe('Request a Sample');
  });

  it('returns the zh-TW string when locale is zh-TW', () => {
    expect(t('zh-TW', 'cta.requestSample')).toBe('索取樣品');
  });

  it('returns root path unchanged for en locale', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('en', '/products')).toBe('/products');
  });

  it('prefixes /zh-tw for zh-TW locale', () => {
    expect(localizedPath('zh-TW', '/')).toBe('/zh-tw');
    expect(localizedPath('zh-TW', '/products')).toBe('/zh-tw/products');
  });

  it('strips /zh-tw prefix from a localized path', () => {
    expect(stripLocaleFromPath('/zh-tw/products')).toBe('/products');
    expect(stripLocaleFromPath('/zh-tw')).toBe('/');
    expect(stripLocaleFromPath('/products')).toBe('/products');
  });

  it('does not incorrectly strip zh-tw prefix from a path that starts with zh-tw but has more letters', () => {
    expect(stripLocaleFromPath('/zh-twin')).toBe('/zh-twin');
    expect(stripLocaleFromPath('/zh-tw-extra')).toBe('/zh-tw-extra');
  });
});
