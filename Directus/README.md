# Directus Integration for Astro Project

This folder contains everything you need to make Directus the single source of truth (SSoT) for content and SEO.

## What you get
- Content model blueprint for all collections
- Webhook + CI/CD guidance to trigger rebuilds
- Migration script to import MD/MDX content into Directus
- Ready-to-use Directus client utility

## Prerequisites
- A running Directus instance (Docker/managed)
- A read-only static token for builds (role: Build)
- Optional: Cloudinary for OG images/transforms (we already use a fallback generator)

## Environment variables
Provide these when running scripts locally.

```
DIRECTUS_URL=https://cms.example.com
DIRECTUS_TOKEN=YOUR_STATIC_TOKEN
# Optional overrides for migration
MDX_POSTS_DIR=content/posts
```

## Content model blueprint
You can create these in Directus Studio or import via snapshot/flows (not included). Keep slugs unique.

- tags
  - name (string), slug (string, unique)
- categories (optional per type)
  - name (string), slug (string, unique)
- posts
  - title (string, required)
  - slug (string, unique, required)
  - description (text)
  - cover_image (file or string url)
  - published_at (datetime)
  - updated_at (datetime)
  - tags (m2m → tags)
  - body_markdown (text)
  - excerpt (text)
  - seo_meta_title (string)
  - seo_meta_description (string)
  - og_image (file/url)
  - canonical_url (string)
  - robots (string, default "index,follow")
  - status (enum: draft/published)
- services
  - title, slug, image_url1, published_at
  - category (m2m → categories or array string)
  - wilayah (array string), provider (string), type (array string)
  - price (string), url, whatsapp_url, maps_url, verify
  - image_url2, image_url3, review (text)
  - SEO fields, status
- products
  - title, slug, image_url, published_at
  - country, locale (array), category (array)
  - price (string), description (text)
  - affiliate_* fields (see project), marketplace urls, SEO fields, status
- projects
  - title, slug, image_url, published_at
  - country, locale (array), category (array)
  - organiser, cost (array), url, gyg_url, maps_url, verify
  - review, get_involved
  - case study fields (client, technologies, metrics, testimonial, etc.)
  - additional_images (array files/urls), SEO fields, status
- stays
  - title, slug, image_url, published_at
  - country, locale, category (array)
  - price (string), description (text), SEO fields, status

Notes
- Prefer m2m for tags/categories to keep taxonomy clean.
- Use lowercase-kebab-case for slugs.

## Webhook → CI/CD
Create webhooks in Directus to notify Vercel on content changes:
- Events: items.create, items.update, items.delete on posts, services, products, projects, stays
- Target URL: your Vercel build hook URL
- Method: POST
- (Optional) Filter: Only when status transitions to published

## Astro integration
- Set `DIRECTUS_URL` and `DIRECTUS_TOKEN` in your deployment environment
- Replace current data sources (Notion/MDX) gradually by querying Directus in `getStaticPaths` and page loaders
- Map SEO fields from Directus to `MainLayout`/`BaseHead`/`SchemaMarkup`

## Migration: MD/MDX → Directus
Use the provided script to import MDX posts. Adjust mapping for services/products/projects/stays similarly.

Run:
```
node Directus/scripts/migrate-mdx-to-directus.mjs
```
Environment required: `DIRECTUS_URL`, `DIRECTUS_TOKEN`. Optionally set `MDX_POSTS_DIR` (default `content/posts`).

What it does
- Parses frontmatter (title, slug, description, tags, coverImage, published, lastUpdated)
- Upserts tags in `tags`
- Creates posts with `body_markdown` = MDX content
- Sets status to `published`

If your m2m junction is named differently, edit the mapping section in the script.

## Roadmap (optional)
- Provide a Directus snapshot file for one-click schema import
- Add migration for services/products/projects/stays
- Add Directus Flow to schedule publish by `published_at`
- Add route-level cache invalidation webhook