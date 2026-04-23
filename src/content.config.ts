import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.enum(['en', 'zh-TW']);

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    locale: localized,
    siteTitle: z.string(),
    tagline: z.string(),
    contact: z.object({
      email: z.string(),
      phone: z.string(),
      address: z.string(),
    }),
    social: z.object({
      linkedin: z.string().optional(),
      whatsapp: z.string().optional(),
    }),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/home' }),
  schema: z.object({
    locale: localized,
    hero: z.object({
      headline: z.string(),
      subhead: z.string(),
      ctaPrimaryLabel: z.string(),
      ctaSecondaryLabel: z.string(),
      heroImage: z.string(),
      stats: z
        .array(z.object({ value: z.string(), suffix: z.string().optional(), label: z.string() }))
        .max(3),
    }),
    numbers: z
      .array(z.object({ value: z.string(), suffix: z.string().optional(), label: z.string() }))
      .length(5),
    reasons: z
      .array(z.object({ icon: z.string(), title: z.string(), body: z.string() }))
      .length(3),
    productsIntro: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
    oem: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
      steps: z.array(z.object({ title: z.string(), body: z.string() })).length(5),
      leadTimeNote: z.string(),
      ctaLabel: z.string(),
    }),
    applicationsIntro: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
    manufacturing: z.object({
      eyebrow: z.string(),
      title: z.string(),
      body: z.string(),
      tiles: z
        .array(z.object({ title: z.string(), body: z.string(), image: z.string() }))
        .length(3),
    }),
    about: z.object({ eyebrow: z.string(), title: z.string(), body: z.string() }),
  }),
});

const products = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/products',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    locale: localized,
    slug: z.string(),
    family: z.enum(['Standard', 'High-Precision', 'Specialty']),
    name: z.string(),
    tempMin: z.number(),
    tempMax: z.number(),
    tolerance: z.string(),
    bValue: z.string().optional(),
    dissipation: z.string().optional(),
    timeConstant: z.string().optional(),
    maxPower: z.string().optional(),
    pdfUrl: z.string().optional(),
    image: z.string(),
    summary: z.string(),
  }),
});

const applications = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/applications',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    locale: localized,
    slug: z.string(),
    industry: z.string(),
    image: z.string(),
    body: z.string(),
    recommendedProducts: z.array(z.string()),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/certifications' }),
  schema: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        scope: z.string(),
        logoFile: z.string(),
      })
    ),
  }),
});

const milestones = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/milestones' }),
  schema: z.object({
    locale: localized,
    items: z.array(
      z.object({
        year: z.number().int(),
        title: z.string(),
        body: z.string(),
      })
    ),
  }),
});

export const collections = {
  settings,
  home,
  products,
  applications,
  certifications,
  milestones,
};
