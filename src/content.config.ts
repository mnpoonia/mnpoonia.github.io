import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    description: z.string(),
    draft: z.boolean().default(false),
    // Category: broad section this post belongs to, pick one (e.g. "Databases", "Systems Design").
    categories: z.array(z.string()).default([]),
    // Tags: specific topics covered, can have several (e.g. "hbase", "caching", "interview-prep").
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
