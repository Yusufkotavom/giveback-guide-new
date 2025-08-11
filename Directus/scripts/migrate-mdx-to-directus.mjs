import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { getDirectusClient } from './directusClient.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = process.env.MDX_POSTS_DIR || path.join(process.cwd(), 'content', 'posts');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function upsertTag(client, name) {
  const slug = toSlug(name);
  const found = await client.items('tags').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
  if (found?.data?.[0]) return found.data[0];
  return await client.items('tags').createOne({ name, slug });
}

async function migratePosts() {
  const client = getDirectusClient();
  const pattern = path.join(POSTS_DIR, '**/*.{md,mdx}').replace(/\\/g, '/');
  const files = await fg(pattern, { dot: false });

  console.log(`Found ${files.length} MD/MDX files under ${POSTS_DIR}`);

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);

    const title = data.title || path.basename(file).replace(/\.(md|mdx)$/i, '');
    const slug = data.slug ? toSlug(data.slug) : toSlug(title);
    const description = data.description || '';
    const cover = data.coverImage || data.imageUrl || '';
    const published_at = data.published || new Date().toISOString();
    const updated_at = data.lastUpdated || data.published || published_at;
    const tags = Array.isArray(data.tags) ? data.tags : [];

    // Upsert tags
    const upserted = [];
    for (const t of tags) {
      try { upserted.push(await upsertTag(client, t)); } catch (e) { console.warn('Tag upsert failed:', t, e.message); }
    }

    // Prepare m2m relation payload (adjust if your junction differs)
    // This assumes a junction collection posts_tags with field `tags` in posts.
    const m2m = upserted.map((t) => ({ tags_id: t.id }));

    // Upsert post by slug
    const existing = await client.items('posts').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
    const payload = {
      title,
      slug,
      description,
      cover_image: cover,
      published_at,
      updated_at,
      body_markdown: content,
      seo_meta_title: data.seoTitle || title,
      seo_meta_description: data.seoDescription || description,
      og_image: data.ogImage || cover,
      canonical_url: data.canonicalUrl || null,
      robots: data.robots || 'index,follow',
      status: 'published',
      tags: m2m,
    };

    if (existing?.data?.[0]) {
      const id = existing.data[0].id;
      await client.items('posts').updateOne(id, payload);
      console.log('Updated post:', slug);
    } else {
      await client.items('posts').createOne(payload);
      console.log('Created post:', slug);
    }
  }
}

migratePosts().catch((err) => {
  console.error(err);
  process.exit(1);
});