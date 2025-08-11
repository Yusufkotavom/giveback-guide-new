import type { PartialDeep } from 'type-fest';
import { getDirectus } from './directus';

function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export async function fetchDirectusPosts() {
  const directus = getDirectus();
  const res: any = await directus.items('posts').readByQuery({
    filter: { status: { _eq: 'published' } },
    fields: ['id','title','slug','description','cover_image','published_at','updated_at','tags.tags_id.name','tags.tags_id.slug','seo_meta_title','seo_meta_description','og_image','canonical_url','robots','body_markdown'],
    sort: ['-published_at'],
    limit: -1,
  });
  const items = res?.data ?? [];
  return items.map((post: any) => ({
    source: 'directus' as const,
    data: {
      title: post.title,
      slug: post.slug,
      description: post.description || post.seo_meta_description,
      coverImage: post.cover_image,
      published: post.published_at,
      lastUpdated: post.updated_at || post.published_at,
      tags: toArray(post.tags).map((t: any) => t?.tags_id?.name).filter(Boolean),
      body: post.body_markdown || '',
    },
  }));
}

export async function fetchDirectusPostBySlug(slug: string) {
  const directus = getDirectus();
  const res: any = await directus.items('posts').readByQuery({
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['id','title','slug','description','cover_image','published_at','updated_at','tags.tags_id.name','tags.tags_id.slug','seo_meta_title','seo_meta_description','og_image','canonical_url','robots','body_markdown'],
    limit: 1,
  });
  const post = res?.data?.[0];
  if (!post) return null;
  return {
    source: 'directus' as const,
    data: {
      title: post.title,
      slug: post.slug,
      description: post.description || post.seo_meta_description,
      coverImage: post.cover_image,
      published: post.published_at,
      lastUpdated: post.updated_at || post.published_at,
      tags: toArray(post.tags).map((t: any) => t?.tags_id?.name).filter(Boolean),
      body: post.body_markdown || '',
    },
  };
}

export async function fetchDirectusProducts() {
  const directus = getDirectus();
  const res: any = await directus.items('products').readByQuery({
    filter: { status: { _eq: 'published' } },
    limit: -1,
  });
  return (res?.data ?? []);
}

export async function fetchDirectusProductBySlug(slug: string) {
  const directus = getDirectus();
  const res: any = await directus.items('products').readByQuery({ filter: { slug: { _eq: slug }, status: { _eq: 'published' } }, limit: 1 });
  return res?.data?.[0] ?? null;
}

export async function fetchDirectusProjects() {
  const directus = getDirectus();
  const res: any = await directus.items('projects').readByQuery({ filter: { status: { _eq: 'published' } }, limit: -1 });
  return (res?.data ?? []);
}
export async function fetchDirectusProjectBySlug(slug: string) {
  const directus = getDirectus();
  const res: any = await directus.items('projects').readByQuery({ filter: { slug: { _eq: slug }, status: { _eq: 'published' } }, limit: 1 });
  return res?.data?.[0] ?? null;
}

export async function fetchDirectusServices() {
  const directus = getDirectus();
  const res: any = await directus.items('services').readByQuery({ filter: { status: { _eq: 'published' } }, limit: -1 });
  return (res?.data ?? []);
}
export async function fetchDirectusServiceBySlug(slug: string) {
  const directus = getDirectus();
  const res: any = await directus.items('services').readByQuery({ filter: { slug: { _eq: slug }, status: { _eq: 'published' } }, limit: 1 });
  return res?.data?.[0] ?? null;
}

export async function fetchDirectusStays() {
  const directus = getDirectus();
  const res: any = await directus.items('stays').readByQuery({ filter: { status: { _eq: 'published' } }, limit: -1 });
  return (res?.data ?? []);
}
export async function fetchDirectusStayBySlug(slug: string) {
  const directus = getDirectus();
  const res: any = await directus.items('stays').readByQuery({ filter: { slug: { _eq: slug }, status: { _eq: 'published' } }, limit: 1 });
  return res?.data?.[0] ?? null;
}