import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per photo — Decap CMS creates/edits these.
const specimens = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/specimens' }),
  schema: z.object({
    no: z.string(),
    title: z.string(),
    cat: z.enum(['Birds', 'Wildlife', 'Landscapes', 'Close-ups']),
    place: z.string().default(''),
    coord: z.string().default(''),
    story: z.string().default(''),
    exif: z.string().default(''),
    image: z.string(),
    ratio: z.number().default(1.5),
  }),
});

// Site-level singleton (currently just the hero photo).
const settings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/settings' }),
  schema: z.object({
    hero: z.string(),
  }),
});

export const collections = { specimens, settings };
