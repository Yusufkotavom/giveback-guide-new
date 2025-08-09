import { type CollectionEntry, getCollection } from 'astro:content';

// Types for unified content structure
export interface UnifiedPost {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    properties: {
      bTitle: string;
      bDescription: string;
      bTags: string[];
      bSlug: string;
      bCoverImage?: string;
      bPublished: { start: Date };
      bLastUpdated?: { start: Date };
    };
  };
  render: () => Promise<{ Content: any }>;
}

export interface UnifiedProject {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    properties: {
      pTitle: string;
      pCountry: string[];
      pLocale: string[];
      pCategory: string[];
      pOrganiser: string;
      pSlug: string;
      pCost: string[];
      pURL?: string;
      pGYGURL?: string;
      pMapsURL?: string;
      pVerify?: string;
      pImageURL?: string;
      pPublished: { start: Date };
      pReview?: string;
      pGetInvolved?: string;
    };
  };
  render: () => Promise<{ Content: any }>;
}

export interface UnifiedStay {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    properties: {
      sTitle: string;
      sCountry: string[];
      sLocale: string[];
      sCategory: string[];
      sFacilities: string[];
      sName: string;
      sType: string[];
      sSlug: string;
      sURL?: string;
      sOtherURL?: string;
      sBookingURL?: string;
      sHotelsURL?: string;
      sAgodaURL?: string;
      sMapsURL?: string;
      sVerify?: string;
      sImageURL1?: string;
      sImageURL2?: string;
      sImageURL3?: string;
      sPublished: { start: Date };
      sReview?: string;
    };
  };
  render: () => Promise<{ Content: any }>;
}

export interface UnifiedProduct {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    properties: {
      pTitle: string;
      pPrice?: string;
      pCountry: string[];
      pLocale: string[];
      pCategory: string[];
      pFeatures: string[];
      pName: string;
      pType: string[];
      pSlug: string;
      pURL?: string;
      pOtherURL?: string;
      pTokopediaURL?: string;
      pShopeeURL?: string;
      pBlibliURL?: string;
      pBukalapakURL?: string;
      pLazadaURL?: string;
      pMapsURL?: string;
      pVerify?: string;
      pImageURL1?: string;
      pImageURL2?: string;
      pImageURL3?: string;
      pPublished: { start: Date };
      pReview?: string;
    };
  };
  render: () => Promise<{ Content: any }>;
}

export interface UnifiedService {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: {
    properties: {
      svTitle: string;
      svCategory: string[];
      svSlug: string;
      svImageURL1?: string;
      svPublished: { start: Date };
      svWilayah?: string[];
      svProvider?: string;
      svType?: string[];
      svPrice?: string;
      svURL?: string;
      svWhatsAppURL?: string;
      svMapsURL?: string;
      svVerify?: string;
      svImageURL2?: string;
      svImageURL3?: string;
      svReview?: string;
    };
  };
  render: () => Promise<{ Content: any }>;
}

// Transform MDX posts to unified format
function transformMdxPost(post: CollectionEntry<'mdxPosts'>): UnifiedPost {
  return {
    id: post.id,
    slug: post.data.slug,
    body: post.body,
    collection: 'mdxPosts',
    data: {
      properties: {
        bTitle: post.data.title,
        bDescription: post.data.description,
        bTags: post.data.tags,
        bSlug: post.data.slug,
        bCoverImage: post.data.coverImage,
        bPublished: { start: post.data.published || new Date() },
        bLastUpdated: post.data.lastUpdated ? { start: post.data.lastUpdated } : { start: new Date() },
      }
    },
    render: post.render
  };
}

// Transform Notion posts to unified format
function transformNotionPost(post: CollectionEntry<'posts'>): UnifiedPost {
  return {
    id: post.id,
    slug: post.data.properties.bSlug,
    body: post.body,
    collection: 'posts',
    data: post.data,
    render: post.render
  };
}

// Transform MDX projects to unified format
function transformMdxProject(project: CollectionEntry<'mdxProjects'>): UnifiedProject {
  return {
    id: project.id,
    slug: project.data.slug,
    body: project.body,
    collection: 'mdxProjects',
    data: {
      properties: {
        pTitle: project.data.title,
        pCountry: project.data.country,
        pLocale: project.data.locale,
        pCategory: project.data.category,
        pOrganiser: project.data.organiser,
        pSlug: project.data.slug,
        pCost: project.data.cost,
        pURL: project.data.url,
        pGYGURL: project.data.gygUrl,
        pMapsURL: project.data.mapsUrl,
        pVerify: project.data.verify,
        pImageURL: project.data.imageUrl,
        pPublished: { start: project.data.published || new Date() },
        pReview: project.data.review,
        pGetInvolved: project.data.getInvolved,
      }
    },
    render: project.render
  };
}

// Transform Notion projects to unified format
function transformNotionProject(project: CollectionEntry<'projects'>): UnifiedProject {
  return {
    id: project.id,
    slug: project.data.properties.pSlug,
    body: project.body,
    collection: 'projects',
    data: project.data,
    render: project.render
  };
}

// Transform MDX stays to unified format
function transformMdxStay(stay: CollectionEntry<'mdxStays'>): UnifiedStay {
  return {
    id: stay.id,
    slug: stay.data.slug,
    body: stay.body,
    collection: 'mdxStays',
    data: {
      properties: {
        sTitle: stay.data.title,
        sCountry: stay.data.country,
        sLocale: stay.data.locale,
        sCategory: stay.data.category,
        sFacilities: stay.data.facilities,
        sName: stay.data.name,
        sType: stay.data.type,
        sSlug: stay.data.slug,
        sURL: stay.data.url,
        sOtherURL: stay.data.otherUrl,
        sBookingURL: stay.data.bookingUrl,
        sHotelsURL: stay.data.hotelsUrl,
        sAgodaURL: stay.data.agodaUrl,
        sMapsURL: stay.data.mapsUrl,
        sVerify: stay.data.verify,
        sImageURL1: stay.data.imageUrl1,
        sImageURL2: stay.data.imageUrl2,
        sImageURL3: stay.data.imageUrl3,
        sPublished: { start: stay.data.published || new Date() },
        sReview: stay.data.review,
      }
    },
    render: stay.render
  };
}

// Transform Notion stays to unified format
function transformNotionStay(stay: CollectionEntry<'stays'>): UnifiedStay {
  return {
    id: stay.id,
    slug: stay.data.properties.sSlug,
    body: stay.body,
    collection: 'stays',
    data: stay.data,
    render: stay.render
  };
}

// Transform MDX products to unified format
function transformMdxProduct(product: CollectionEntry<'mdxProducts'>): UnifiedProduct {
  return {
    id: product.id,
    slug: product.data.slug,
    body: product.body,
    collection: 'mdxProducts',
    data: {
      properties: {
        pTitle: product.data.title,
        pPrice: product.data.price,
        pCountry: product.data.country,
        pLocale: product.data.locale,
        pCategory: product.data.category,
        pFeatures: product.data.features,
        pName: product.data.name,
        pType: product.data.type,
        pSlug: product.data.slug,
        pURL: product.data.url,
        pOtherURL: product.data.otherUrl,
        pTokopediaURL: product.data.tokopediaUrl,
        pShopeeURL: product.data.shopeeUrl,
        pBlibliURL: product.data.blibliUrl,
        pBukalapakURL: product.data.bukalapakUrl,
        pLazadaURL: product.data.lazadaUrl,
        pMapsURL: product.data.mapsUrl,
        pVerify: product.data.verify,
        pImageURL1: product.data.imageUrl1,
        pImageURL2: product.data.imageUrl2,
        pImageURL3: product.data.imageUrl3,
        pPublished: { start: product.data.published || new Date() },
        pReview: product.data.review,
      }
    },
    render: product.render
  };
}

// Transform Notion products to unified format
function transformNotionProduct(product: CollectionEntry<'products'>): UnifiedProduct {
  return {
    id: product.id,
    slug: product.data.properties.pSlug,
    body: product.body,
    collection: 'products',
    data: product.data,
    render: product.render
  };
}

// Transform MDX services to unified format
function transformMdxService(service: CollectionEntry<'mdxServices'>): UnifiedService {
  return {
    id: service.id,
    slug: service.data.slug,
    body: service.body,
    collection: 'mdxServices',
    data: {
      properties: {
        svTitle: service.data.title,
        svCategory: service.data.category,
        svSlug: service.data.slug,
        svImageURL1: service.data.imageUrl1,
        svPublished: { start: service.data.published || new Date() },
        svWilayah: service.data.wilayah,
        svProvider: service.data.provider,
        svType: service.data.type,
        svPrice: service.data.price,
        svURL: service.data.url,
        svWhatsAppURL: service.data.whatsAppUrl,
        svMapsURL: service.data.mapsUrl,
        svVerify: service.data.verify,
        svImageURL2: service.data.imageUrl2,
        svImageURL3: service.data.imageUrl3,
        svReview: service.data.review,
      }
    },
    render: service.render
  };
}

// Transform Notion services to unified format
function transformNotionService(service: CollectionEntry<'services'>): UnifiedService {
  return {
    id: service.id,
    slug: service.data.properties.svSlug,
    body: service.body,
    collection: 'services',
    data: service.data,
    render: service.render
  };
}

// Get all posts (Notion + MDX)
export async function getAllPosts(): Promise<UnifiedPost[]> {
  const [notionPosts, mdxPosts] = await Promise.all([
    getCollection('posts'),
    getCollection('mdxPosts')
  ]);

  const transformedNotionPosts = notionPosts.map(transformNotionPost);
  const transformedMdxPosts = mdxPosts
    .filter(post => !post.data.draft)
    .map(transformMdxPost);

  return [...transformedNotionPosts, ...transformedMdxPosts]
    .sort((a, b) => {
      const dateA = a.data.properties.bPublished?.start || new Date(0);
      const dateB = b.data.properties.bPublished?.start || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// Get all projects (Notion + MDX)
export async function getAllProjects(): Promise<UnifiedProject[]> {
  const [notionProjects, mdxProjects] = await Promise.all([
    getCollection('projects'),
    getCollection('mdxProjects')
  ]);

  const transformedNotionProjects = notionProjects.map(transformNotionProject);
  const transformedMdxProjects = mdxProjects
    .filter(project => !project.data.draft)
    .map(transformMdxProject);

  return [...transformedNotionProjects, ...transformedMdxProjects]
    .sort((a, b) => {
      const dateA = a.data.properties.pPublished?.start || new Date(0);
      const dateB = b.data.properties.pPublished?.start || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// Get all stays (Notion + MDX)
export async function getAllStays(): Promise<UnifiedStay[]> {
  const [notionStays, mdxStays] = await Promise.all([
    getCollection('stays'),
    getCollection('mdxStays')
  ]);

  const transformedNotionStays = notionStays.map(transformNotionStay);
  const transformedMdxStays = mdxStays
    .filter(stay => !stay.data.draft)
    .map(transformMdxStay);

  return [...transformedNotionStays, ...transformedMdxStays]
    .sort((a, b) => {
      const dateA = a.data.properties.sPublished?.start || new Date(0);
      const dateB = b.data.properties.sPublished?.start || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// Get all products (Notion + MDX)
export async function getAllProducts(): Promise<UnifiedProduct[]> {
  const [notionProducts, mdxProducts] = await Promise.all([
    getCollection('products'),
    getCollection('mdxProducts')
  ]);

  const transformedNotionProducts = notionProducts.map(transformNotionProduct);
  const transformedMdxProducts = mdxProducts
    .filter(product => !product.data.draft)
    .map(transformMdxProduct);

  return [...transformedNotionProducts, ...transformedMdxProducts]
    .sort((a, b) => {
      const dateA = a.data.properties.pPublished?.start || new Date(0);
      const dateB = b.data.properties.pPublished?.start || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// Get all services (Notion + MDX)
export async function getAllServices(): Promise<UnifiedService[]> {
  const [notionServices, mdxServices] = await Promise.all([
    getCollection('services'),
    getCollection('mdxServices')
  ]);

  const transformedNotionServices = notionServices.map(transformNotionService);
  const transformedMdxServices = mdxServices
    .filter(service => !service.data.draft)
    .map(transformMdxService);

  return [...transformedNotionServices, ...transformedMdxServices]
    .sort((a, b) => {
      const dateA = a.data.properties.svPublished?.start || new Date(0);
      const dateB = b.data.properties.svPublished?.start || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
}

// Get unified content by slug
export async function getPostBySlug(slug: string): Promise<UnifiedPost | undefined> {
  const allPosts = await getAllPosts();
  return allPosts.find(post => post.slug === slug);
}

export async function getProjectBySlug(slug: string): Promise<UnifiedProject | undefined> {
  const allProjects = await getAllProjects();
  return allProjects.find(project => project.slug === slug);
}

export async function getStayBySlug(slug: string): Promise<UnifiedStay | undefined> {
  const allStays = await getAllStays();
  return allStays.find(stay => stay.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<UnifiedProduct | undefined> {
  const allProducts = await getAllProducts();
  return allProducts.find(product => product.slug === slug);
}

export async function getServiceBySlug(slug: string): Promise<UnifiedService | undefined> {
  const allServices = await getAllServices();
  return allServices.find(service => service.slug === slug);
}