/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

const config: any = {
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**'],
  },
};

export default getViteConfig(config);
