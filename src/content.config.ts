import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { notionLoader, richTextToPlainText } from '@chlorinec-pkgs/notion-astro-loader';
import { notionPageSchema, propertySchema, transformedPropertySchema } from '@chlorinec-pkgs/notion-astro-loader/schemas';

const projectsNotionToken = import.meta.env.PROJECTS_NOTION_TOKEN;
const projectsNotionDatabaseId = import.meta.env.PROJECTS_NOTION_DATABASE_ID;

const blogNotionToken = import.meta.env.BLOG_NOTION_TOKEN;
const blogNotionDatabaseId = import.meta.env.BLOG_NOTION_DATABASE_ID;

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.coerce.date(),
		category: z.string().optional(),
		updatedDate: z.coerce.date().optional(),
		coverImage: z.string().optional(),
	}),
});

const posts = defineCollection({
	loader: notionLoader({
		auth: blogNotionToken,
		database_id: blogNotionDatabaseId,
	  // Optional: tell loader where to store downloaded aws images, relative to 'src' directory
	  // Default value is 'assets/images/notion'
	  // imageSavePath: 'assets/images/notion',
	  // Use Notion sorting and filtering with the same options like notionhq client
	  filter: {
		property: 'Status',
		select: { "equals": "Published" },
	  },
	}),
	schema: notionPageSchema({
		properties: z.object({
		  bTitle: transformedPropertySchema.title,
		  bTags: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  bSlug: transformedPropertySchema.rich_text,
		  bCoverImage: transformedPropertySchema.url,
		  bPublished: transformedPropertySchema.date,
		  bLastUpdated: transformedPropertySchema.date,
		  bDescription: transformedPropertySchema.rich_text,
		}),
	  }),
  });

  const projects = defineCollection({
	loader: notionLoader({
		auth: projectsNotionToken,
		database_id: projectsNotionDatabaseId,
	  // Optional: tell loader where to store downloaded aws images, relative to 'src' directory
	  // Default value is 'assets/images/notion'
	  // imageSavePath: 'assets/images/notion',
	  // Use Notion sorting and filtering with the same options like notionhq client
	  filter: {
		property: 'Status',
		select: { "equals": "Published" },
	  },
	}),
	schema: notionPageSchema({
		properties: z.object({
		  pTitle: transformedPropertySchema.title,
		  pCountry: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pLocale: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pCategory: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pOrganiser: transformedPropertySchema.rich_text,
		  pSlug: transformedPropertySchema.rich_text,
		  pCost: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pURL: transformedPropertySchema.url,
		  pVerify: transformedPropertySchema.select,
		  pImageURL: transformedPropertySchema.url,
		  pPublished: transformedPropertySchema.date,
		  pReview: transformedPropertySchema.rich_text,
		  pGetInvolved: transformedPropertySchema.rich_text,
		}),
	  }),
  });

export const collections = { blog, posts, projects };
