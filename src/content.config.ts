import { defineCollection, z } from 'astro:content';
import { notionLoader, richTextToPlainText } from '@chlorinec-pkgs/notion-astro-loader';
import { notionPageSchema, propertySchema, transformedPropertySchema } from '@chlorinec-pkgs/notion-astro-loader/schemas';
import { glob } from 'astro/loaders';

// Safely access environment variables with fallbacks for type generation
function getEnvVar(name: string): string {
	try {
	  return import.meta.env[name] || 'placeholder-during-type-generation';
	} catch (e) {
	  return 'placeholder-during-type-generation';
	}
}

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

const posts = defineCollection({
	loader: notionLoader({
		auth: getEnvVar('BLOG_NOTION_TOKEN'),
    database_id: getEnvVar('BLOG_NOTION_DATABASE_ID'),
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

// MDX Posts collection
const mdxPosts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/posts" }),
  schema: mdxPostSchema,
});

  const projects = defineCollection({
	loader: notionLoader({
		auth: getEnvVar('PROJECTS_NOTION_TOKEN'),
    database_id: getEnvVar('PROJECTS_NOTION_DATABASE_ID'),
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
		  pGYGURL: transformedPropertySchema.url,
		  pMapsURL: transformedPropertySchema.url,
		  pVerify: transformedPropertySchema.select,
		  pImageURL: transformedPropertySchema.url,
		  pPublished: transformedPropertySchema.date,
		  pReview: transformedPropertySchema.rich_text,
		  pGetInvolved: transformedPropertySchema.rich_text,
		}),
	  }),
  });

// MDX Projects collection
const mdxProjects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/projects" }),
  schema: mdxProjectSchema,
});

  const stays = defineCollection({
	loader: notionLoader({
		auth: getEnvVar('STAYS_NOTION_TOKEN'),
    database_id: getEnvVar('STAYS_NOTION_DATABASE_ID'),
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
		  sTitle: transformedPropertySchema.title,
		  sCountry: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  sLocale: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  sCategory: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  sFacilities: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  sName: transformedPropertySchema.rich_text,
		  sType: transformedPropertySchema.multi_select,
		  sSlug: transformedPropertySchema.rich_text,
		  sURL: transformedPropertySchema.url,
		  sOtherURL: transformedPropertySchema.url,
		  sBookingURL: transformedPropertySchema.url,
		  sHotelsURL: transformedPropertySchema.url,
		  sAgodaURL: transformedPropertySchema.url,
		  sMapsURL: transformedPropertySchema.url,
		  sVerify: transformedPropertySchema.select,
		  sImageURL1: transformedPropertySchema.url,
		  sImageURL2: transformedPropertySchema.url,
		  sImageURL3: transformedPropertySchema.url,
		  sPublished: transformedPropertySchema.date,
		  sReview: transformedPropertySchema.rich_text,
		}),
	  }),
  });

// MDX Stays collection
const mdxStays = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/stays" }),
  schema: mdxStaySchema,
});

  const products = defineCollection({
	loader: notionLoader({
		auth: getEnvVar('PRODUCTS_NOTION_TOKEN'),
    database_id: getEnvVar('PRODUCTS_NOTION_DATABASE_ID'),
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
			  pPrice: transformedPropertySchema.rich_text,
			  pCountry: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
			  pLocale: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
			  pCategory: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
			  pFeatures: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
			  pName: transformedPropertySchema.rich_text,
			  pType: transformedPropertySchema.multi_select,
			  pSlug: transformedPropertySchema.rich_text,
			  pURL: transformedPropertySchema.url,
			  pOtherURL: transformedPropertySchema.url,
			  pTokopediaURL: transformedPropertySchema.url,
			  pShopeeURL: transformedPropertySchema.url,
			  pBlibliURL: transformedPropertySchema.url,
			  pBukalapakURL: transformedPropertySchema.url,
			  pLazadaURL: transformedPropertySchema.url,
			  pMapsURL: transformedPropertySchema.url,
			  pVerify: transformedPropertySchema.select,
			  pImageURL1: transformedPropertySchema.url,
			  pImageURL2: transformedPropertySchema.url,
			  pImageURL3: transformedPropertySchema.url,
			  pPublished: transformedPropertySchema.date,
			  pReview: transformedPropertySchema.rich_text,
			}),
		  }),
  });

// MDX Products collection
const mdxProducts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/products" }),
  schema: mdxProductSchema,
});

  const services = defineCollection({
    loader: notionLoader({
      auth: getEnvVar('SERVICES_NOTION_TOKEN'),
      database_id: getEnvVar('SERVICES_NOTION_DATABASE_ID'),
      filter: { property: 'Status', select: { "equals": "Published" } },
    }),
    schema: notionPageSchema({
      properties: z.object({
        svTitle: transformedPropertySchema.title,
        svCategory: transformedPropertySchema.multi_select.transform((v) => Array.isArray(v) ? v : [v]),
        svSlug: transformedPropertySchema.rich_text,
        svImageURL1: transformedPropertySchema.url,
        svPublished: transformedPropertySchema.date,

        svWilayah: transformedPropertySchema.multi_select.transform((v) => Array.isArray(v) ? v : [v]).optional(),
        svProvider: transformedPropertySchema.rich_text.optional(),
        svType: transformedPropertySchema.multi_select.optional(),
        svPrice: transformedPropertySchema.rich_text.optional(),
        svURL: transformedPropertySchema.url.optional(),
        svWhatsAppURL: transformedPropertySchema.url.optional(),
        svMapsURL: transformedPropertySchema.url.optional(),
        svVerify: transformedPropertySchema.select.optional(),
        svImageURL2: transformedPropertySchema.url.optional(),
        svImageURL3: transformedPropertySchema.url.optional(),
        svReview: transformedPropertySchema.rich_text.optional(),
      }),
    }),
  });

// MDX Services collection
const mdxServices = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/services" }),
  schema: mdxServiceSchema,
});

export const collections = { 
  posts, 
  projects, 
  stays, 
  products, 
  services,
  mdxPosts,
  mdxProjects,
  mdxStays,
  mdxProducts,
  mdxServices
};
