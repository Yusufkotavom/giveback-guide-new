import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// MDX schema for posts
const mdxPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  slug: z.string(),
  coverImage: z.string().optional(),
  published: z.date(),
  lastUpdated: z.date().optional(),
  draft: z.boolean().default(false),
});

// MDX schema for projects
const mdxProjectSchema = z.object({
  title: z.string(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  organiser: z.string(),
  slug: z.string(),
  cost: z.array(z.string()).default([]),
  url: z.string().optional(),
  gygUrl: z.string().optional(),
  mapsUrl: z.string().optional(),
  verify: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.date(),
  review: z.string().optional(),
  getInvolved: z.string().optional(),
  draft: z.boolean().default(false),
});

// MDX schema for stays
const mdxStaySchema = z.object({
  title: z.string(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  facilities: z.array(z.string()).default([]),
  name: z.string(),
  type: z.array(z.string()).default([]),
  slug: z.string(),
  url: z.string().optional(),
  otherUrl: z.string().optional(),
  bookingUrl: z.string().optional(),
  hotelsUrl: z.string().optional(),
  agodaUrl: z.string().optional(),
  mapsUrl: z.string().optional(),
  verify: z.string().optional(),
  imageUrl1: z.string().optional(),
  imageUrl2: z.string().optional(),
  imageUrl3: z.string().optional(),
  published: z.date(),
  review: z.string().optional(),
  draft: z.boolean().default(false),
});

// MDX schema for products
const mdxProductSchema = z.object({
  title: z.string(),
  price: z.string().optional(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  name: z.string(),
  type: z.array(z.string()).default([]),
  slug: z.string(),
  url: z.string().optional(),
  otherUrl: z.string().optional(),
  tokopediaUrl: z.string().optional(),
  shopeeUrl: z.string().optional(),
  blibliUrl: z.string().optional(),
  bukalapakUrl: z.string().optional(),
  lazadaUrl: z.string().optional(),
  mapsUrl: z.string().optional(),
  verify: z.string().optional(),
  imageUrl1: z.string().optional(),
  imageUrl2: z.string().optional(),
  imageUrl3: z.string().optional(),
  published: z.date(),
  review: z.string().optional(),
  draft: z.boolean().default(false),
});

// MDX schema for services
const mdxServiceSchema = z.object({
  title: z.string(),
  category: z.array(z.string()).default([]),
  slug: z.string(),
  imageUrl1: z.string().optional(),
  published: z.date(),
  wilayah: z.array(z.string()).default([]),
  provider: z.string().optional(),
  type: z.array(z.string()).default([]),
  price: z.string().optional(),
  url: z.string().optional(),
  whatsAppUrl: z.string().optional(),
  mapsUrl: z.string().optional(),
  verify: z.string().optional(),
  imageUrl2: z.string().optional(),
  imageUrl3: z.string().optional(),
  review: z.string().optional(),
  draft: z.boolean().default(false),
});

// MDX-only collections for testing
const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/posts" }),
  schema: mdxPostSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/projects" }),
  schema: mdxProjectSchema,
});

const stays = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/stays" }),
  schema: mdxStaySchema,
});

const products = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/products" }),
  schema: mdxProductSchema,
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/services" }),
  schema: mdxServiceSchema,
});

export const collections = { 
  posts, 
  projects, 
  stays, 
  products, 
  services
};