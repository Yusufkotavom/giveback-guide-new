import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { getDirectusClient } from './directusClient.mjs';

const SERVICES_DIR = process.env.MDX_SERVICES_DIR || path.join(process.cwd(), 'content', 'services');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function upsertCategory(client, name) {
  const slug = toSlug(name);
  const found = await client.items('categories').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
  if (found?.data?.[0]) return found.data[0];
  return await client.items('categories').createOne({ name, slug });
}

async function migrateServices() {
  const client = getDirectusClient();
  const pattern = path.join(SERVICES_DIR, '**/*.{md,mdx}').replace(/\\/g, '/');
  const files = await fg(pattern, { dot: false });

  console.log(`Found ${files.length} service MD/MDX files under ${SERVICES_DIR}`);

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);

    const title = data.title || path.basename(file).replace(/\.(md|mdx)$/i, '');
    const slug = data.slug ? toSlug(data.slug) : toSlug(title);
    const published_at = data.published || new Date().toISOString();

    const categories = Array.isArray(data.category) ? data.category : [];
    const wilayah = Array.isArray(data.wilayah) ? data.wilayah : [];
    const type = Array.isArray(data.type) ? data.type : [];

    // Upsert categories
    const upsertedCats = [];
    for (const c of categories) {
      try { upsertedCats.push(await upsertCategory(client, c)); } catch (e) { console.warn('Category upsert failed:', c, e.message); }
    }
    const m2mCategories = upsertedCats.map((c) => ({ categories_id: c.id }));

    const payload = {
      title,
      slug,
      image_url1: data.imageUrl1 || '',
      image_url2: data.imageUrl2 || '',
      image_url3: data.imageUrl3 || '',
      published_at,
      wilayah,
      provider: data.provider || '',
      type,
      price: data.price || '',
      url: data.url || '',
      whatsapp_url: data.whatsappUrl || '',
      maps_url: data.mapsUrl || '',
      verify: data.verify || '',
      review: data.review || '',
      status: 'published',
      category: m2mCategories,
    };

    const existing = await client.items('services').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
    if (existing?.data?.[0]) {
      await client.items('services').updateOne(existing.data[0].id, payload);
      console.log('Updated service:', slug);
    } else {
      await client.items('services').createOne(payload);
      console.log('Created service:', slug);
    }
  }
}

migrateServices().catch((err) => {
  console.error(err);
  process.exit(1);
});