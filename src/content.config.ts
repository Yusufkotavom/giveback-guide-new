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

// MDX Schema for posts
const postMdxSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).default([]),
  slug: z.string(),
  coverImage: z.string().optional(),
  published: z.coerce.date(),
  lastUpdated: z.coerce.date().optional(),
  description: z.string(),
});

// MDX Schema for projects  
const projectMdxSchema = z.object({
  title: z.string(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  organiser: z.string().optional(),
  slug: z.string(),
  cost: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  gygUrl: z.string().url().optional(),
  mapsUrl: z.string().url().optional(),
  verify: z.string().optional(),
  imageUrl: z.string().url().optional(),
  published: z.coerce.date(),
  review: z.string().optional(),
  getInvolved: z.string().optional(),
  // Case Study Fields
  client: z.string().optional(),
  clientIndustry: z.string().optional(),
  projectDuration: z.string().optional(),
  teamSize: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  results: z.string().optional(),
  // Before/After Metrics
  beforeMetrics: z.object({
    traffic: z.string().optional(),
    conversions: z.string().optional(),
    revenue: z.string().optional(),
    performance: z.string().optional(),
    other: z.string().optional(),
  }).optional(),
  afterMetrics: z.object({
    traffic: z.string().optional(),
    conversions: z.string().optional(),
    revenue: z.string().optional(),
    performance: z.string().optional(),
    other: z.string().optional(),
  }).optional(),
  // ROI & Testimonial
  roiPercentage: z.string().optional(),
  clientTestimonial: z.string().optional(),
  clientName: z.string().optional(),
  clientPosition: z.string().optional(),
  // Additional Images
  beforeImage: z.string().url().optional(),
  afterImage: z.string().url().optional(),
  additionalImages: z.array(z.string().url()).default([]),
});

// MDX Schema for stays
const stayMdxSchema = z.object({
  title: z.string(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  slug: z.string(),
  imageUrl: z.string().url().optional(),
  published: z.coerce.date(),
  price: z.string().optional(),
  description: z.string().optional(),
});

// MDX Schema for products
const productMdxSchema = z.object({
  title: z.string(),
  country: z.array(z.string()).default([]),
  locale: z.array(z.string()).default([]),
  category: z.array(z.string()).default([]),
  slug: z.string(),
  imageUrl: z.string().url().optional(),
  published: z.coerce.date(),
  price: z.string().optional(),
  description: z.string().optional(),
});

// MDX Schema for services
const serviceMdxSchema = z.object({
  title: z.string(),
  category: z.array(z.string()).default([]),
  slug: z.string(),
  imageUrl1: z.string().url().optional(),
  published: z.coerce.date(),
  wilayah: z.array(z.string()).default([]),
  provider: z.string().optional(),
  type: z.array(z.string()).default([]),
  price: z.string().optional(),
  url: z.string().url().optional(),
  whatsappUrl: z.string().url().optional(),
  mapsUrl: z.string().url().optional(),
  verify: z.string().optional(),
  imageUrl2: z.string().url().optional(),
  imageUrl3: z.string().url().optional(),
  review: z.string().optional(),
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
const postsMdx = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/posts' }),
  schema: postMdxSchema,
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
const projectsMdx = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects' }),
  schema: projectMdxSchema,
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
			  sSlug: transformedPropertySchema.rich_text,
			  sImageURL: transformedPropertySchema.url.optional(),
			  sPublished: transformedPropertySchema.date,
			  sPrice: transformedPropertySchema.rich_text.optional(),
			  sDescription: transformedPropertySchema.rich_text.optional(),
			}),
		  }),
  });

// MDX Stays collection - Handle empty directories gracefully
const staysMdx = defineCollection({
  loader: glob({ 
    pattern: '**/*.{md,mdx}', 
    base: './content/stays',
    // Ignore .gitkeep and other non-content files
    ignore: ['**/.gitkeep', '**/.*']
  }),
  schema: stayMdxSchema,
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
		  // Core Product Information
		  pTitle: transformedPropertySchema.title,
		  pPrice: transformedPropertySchema.rich_text.optional(),
		  pCountry: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pLocale: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pCategory: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]),
		  pFeatures: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]).optional(),
		  pName: transformedPropertySchema.rich_text.optional(), // Brand/Store name
		  pType: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]).optional(),
		  pSlug: transformedPropertySchema.rich_text,
		  pPublished: transformedPropertySchema.date,
		  pDescription: transformedPropertySchema.rich_text.optional(),
		  pReview: transformedPropertySchema.rich_text.optional(),
		  pVerify: transformedPropertySchema.select.optional(),

		  // Image URLs
		  pImageURL1: transformedPropertySchema.url.optional(),
		  pImageURL2: transformedPropertySchema.url.optional(),
		  pImageURL3: transformedPropertySchema.url.optional(),

		  // Website & Contact URLs
		  pURL: transformedPropertySchema.url.optional(), // Official website
		  pOtherURL: transformedPropertySchema.url.optional(), // Alternative URL (social media, etc.)
		  pMapsURL: transformedPropertySchema.url.optional(), // Google Maps location

		  // Marketplace URLs for Affiliate Links
		  pTokopediaURL: transformedPropertySchema.url.optional(),
		  pShopeeURL: transformedPropertySchema.url.optional(),
		  pBlibliURL: transformedPropertySchema.url.optional(),
		  pBukalapakURL: transformedPropertySchema.url.optional(),
		  pLazadaURL: transformedPropertySchema.url.optional(),

		  // Affiliate Enhancement Fields (New)
		  pAffiliateCode: transformedPropertySchema.rich_text.optional(), // Unique affiliate code
		  pCommissionRate: transformedPropertySchema.rich_text.optional(), // Commission percentage
		  pAffiliateProvider: transformedPropertySchema.select.optional(), // Primary affiliate provider
		  pDiscountCode: transformedPropertySchema.rich_text.optional(), // Special discount code
		  pSpecialOffer: transformedPropertySchema.rich_text.optional(), // Special offer text
		  pCTAText: transformedPropertySchema.rich_text.optional(), // Custom CTA button text
		  pPriority: transformedPropertySchema.select.optional(), // Featured/Priority level
		  pExternalRating: transformedPropertySchema.rich_text.optional(), // External rating (e.g., 4.5/5)
		  pSoldCount: transformedPropertySchema.rich_text.optional(), // Number of items sold
		  pOriginalPrice: transformedPropertySchema.rich_text.optional(), // Original price for discount display
		  pIsSponsored: transformedPropertySchema.checkbox.optional(), // Sponsored product flag
		  pTargetAudience: transformedPropertySchema.multi_select.transform((value) => Array.isArray(value) ? value : [value]).optional(), // Target audience
		}),
	  }),
  });

// MDX Products collection - Handle empty directories gracefully  
const productsMdx = defineCollection({
  loader: glob({ 
    pattern: '**/*.{md,mdx}', 
    base: './content/products',
    // Ignore .gitkeep and other non-content files
    ignore: ['**/.gitkeep', '**/.*']
  }),
  schema: productMdxSchema,
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
        svImageURL1: transformedPropertySchema.url.optional(),
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
const servicesMdx = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/services' }),
  schema: serviceMdxSchema,
});

// Create an alias for 'blog' collection to maintain backward compatibility
const blog = posts; // Use Notion posts as primary blog source

export const collections = { 
  posts, 
  postsMdx,
  projects, 
  projectsMdx,
  stays, 
  staysMdx,
  products, 
  productsMdx,
  services,
  servicesMdx,
  // Add blog alias for RSS compatibility
  blog
};
