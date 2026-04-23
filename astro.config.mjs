import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sentech-redesign.pages.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-TW'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    domains: [],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
});
