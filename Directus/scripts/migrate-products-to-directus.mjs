import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { getDirectusClient } from './directusClient.mjs';

const PRODUCTS_DIR = process.env.MDX_PRODUCTS_DIR || path.join(process.cwd(), 'content', 'products');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function migrateProducts() {
  const client = getDirectusClient();
  const pattern = path.join(PRODUCTS_DIR, '**/*.{md,mdx}').replace(/\\/g, '/');
  const files = await fg(pattern, { dot: false });

  console.log(`Found ${files.length} product MD/MDX files under ${PRODUCTS_DIR}`);

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
      // affiliate
      affiliate_code: data.affiliateCode || '',
      commission_rate: data.commissionRate || '',
      affiliate_provider: data.affiliateProvider || '',
      discount_code: data.discountCode || '',
      special_offer: data.specialOffer || '',
      cta_text: data.ctaText || '',
      priority: data.priority || '',
      external_rating: data.externalRating || '',
      sold_count: data.soldCount || '',
      original_price: data.originalPrice || '',
      is_sponsored: Boolean(data.isSponsored || false),
      target_audience: Array.isArray(data.targetAudience) ? data.targetAudience : [],
      // marketplace
      tokopedia_url: data.tokopediaUrl || '',
      shopee_url: data.shopeeUrl || '',
      blibli_url: data.blibliUrl || '',
      bukalapak_url: data.bukalapakUrl || '',
      lazada_url: data.lazadaUrl || '',
      url: data.url || '',
      other_url: data.otherUrl || '',
      maps_url: data.mapsUrl || '',
      status: 'published',
    };

    const existing = await client.items('products').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
    if (existing?.data?.[0]) {
      await client.items('products').updateOne(existing.data[0].id, payload);
      console.log('Updated product:', slug);
    } else {
      await client.items('products').createOne(payload);
      console.log('Created product:', slug);
    }
  }
}

migrateProducts().catch((err) => {
  console.error(err);
  process.exit(1);
});