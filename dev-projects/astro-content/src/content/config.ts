// @ts-ignore
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z
      .string()
      .or(z.date())
      // @ts-ignore
      .transform(val => new Date(val)),
    updatedDate: z
      .string()
      .optional()
      // @ts-ignore
      .transform(str => (str ? new Date(str) : undefined)),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
