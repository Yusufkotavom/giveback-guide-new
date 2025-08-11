import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { getDirectusClient } from './directusClient.mjs';

const STAYS_DIR = process.env.MDX_STAYS_DIR || path.join(process.cwd(), 'content', 'stays');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function migrateStays() {
  const client = getDirectusClient();
  const pattern = path.join(STAYS_DIR, '**/*.{md,mdx}').replace(/\\/g, '/');
  const files = await fg(pattern, { dot: false });

  console.log(`Found ${files.length} stay MD/MDX files under ${STAYS_DIR}`);

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);

    const title = data.title || path.basename(file).replace(/\.(md|mdx)$/i, '');
    const slug = data.slug ? toSlug(data.slug) : toSlug(title);
    const published_at = data.published || new Date().toISOString();

    const payload = {
      title,
      slug,
      image_url: data.imageUrl || '',
      published_at,
      country: Array.isArray(data.country) ? data.country : [],
      locale: Array.isArray(data.locale) ? data.locale : [],
      category: Array.isArray(data.category) ? data.category : [],
      price: data.price || '',
      description: data.description || '',
      status: 'published',
    };

    const existing = await client.items('stays').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
    if (existing?.data?.[0]) {
      await client.items('stays').updateOne(existing.data[0].id, payload);
      console.log('Updated stay:', slug);
    } else {
      await client.items('stays').createOne(payload);
      console.log('Created stay:', slug);
    }
  }
}

migrateStays().catch((err) => {
  console.error(err);
  process.exit(1);
});