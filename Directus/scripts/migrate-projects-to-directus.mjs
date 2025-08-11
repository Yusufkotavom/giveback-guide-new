import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { getDirectusClient } from './directusClient.mjs';

const PROJECTS_DIR = process.env.MDX_PROJECTS_DIR || path.join(process.cwd(), 'content', 'projects');

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function migrateProjects() {
  const client = getDirectusClient();
  const pattern = path.join(PROJECTS_DIR, '**/*.{md,mdx}').replace(/\\/g, '/');
  const files = await fg(pattern, { dot: false });

  console.log(`Found ${files.length} project MD/MDX files under ${PROJECTS_DIR}`);

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
      organiser: data.organiser || '',
      cost: Array.isArray(data.cost) ? data.cost : [],
      url: data.url || '',
      gyg_url: data.gygUrl || '',
      maps_url: data.mapsUrl || '',
      verify: data.verify || '',
      review: data.review || '',
      get_involved: data.getInvolved || '',
      // Case study/extra fields
      client: data.client || '',
      client_industry: data.clientIndustry || '',
      project_duration: data.projectDuration || '',
      team_size: data.teamSize || '',
      technologies: Array.isArray(data.technologies) ? data.technologies : [],
      challenges: data.challenges || '',
      solutions: data.solutions || '',
      results: data.results || '',
      beforeMetrics: data.beforeMetrics || null,
      afterMetrics: data.afterMetrics || null,
      roiPercentage: data.roiPercentage || '',
      clientTestimonial: data.clientTestimonial || '',
      clientName: data.clientName || '',
      clientPosition: data.clientPosition || '',
      additional_images: Array.isArray(data.additionalImages) ? data.additionalImages : [],
      status: 'published',
    };

    const existing = await client.items('projects').readByQuery({ filter: { slug: { _eq: slug } }, limit: 1 });
    if (existing?.data?.[0]) {
      await client.items('projects').updateOne(existing.data[0].id, payload);
      console.log('Updated project:', slug);
    } else {
      await client.items('projects').createOne(payload);
      console.log('Created project:', slug);
    }
  }
}

migrateProjects().catch((err) => {
  console.error(err);
  process.exit(1);
});