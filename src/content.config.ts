import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./data/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      // Transform string to Date object
      date: z.coerce.date(),
      thumbnail: image().optional(),
      tags: z.array(z.string()).optional().nullable(),
      categories: z.string().optional(),
      toc: z.boolean().default(false),
      updatedDate: z.coerce.date().optional(),
      description: z.string().optional(),
      summary: z.string().optional(),
    }),
});

const pages = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./data/pages", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
    }),
});

export const collections = { blog, pages };
