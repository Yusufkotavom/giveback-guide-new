import { type CollectionEntry, getCollection } from 'astro:content';

// Simple helpers for testing MDX-only content
export async function getAllMdxPosts() {
  const posts = await getCollection('posts');
  return posts
    .filter(post => !post.data.draft)
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export async function getMdxPostBySlug(slug: string) {
  const posts = await getAllMdxPosts();
  return posts.find(post => post.data.slug === slug);
}