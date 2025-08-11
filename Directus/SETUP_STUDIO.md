# Directus Studio Setup (Fresh Instance)

Follow these steps in Directus Studio to create collections and fields matching this project.

## 1) Create `tags` collection
- Fields:
  - name: string, required
  - slug: string, required, unique (validation: lowercase-kebab-case)

## 2) Create `categories` collection (optional)
- Fields:
  - name: string, required
  - slug: string, required, unique

## 3) Create `posts` collection
- Fields (recommended interface types in parentheses):
  - title: string (input), required
  - slug: string (slug/alias) unique, required
  - description: text (textarea)
  - cover_image: string (url) or file (file) — choose one approach
  - published_at: datetime (datetime)
  - updated_at: datetime (datetime)
  - body_markdown: text (markdown)
  - seo_meta_title: string
  - seo_meta_description: text (textarea)
  - og_image: string (url) or file
  - canonical_url: string (url)
  - robots: string (default: "index,follow")
  - status: string (enum: draft, published) — set default to `published` if you prefer
- Relations:
  - tags: many-to-many to `tags` (Directus will create a junction collection)

Notes:
- Ensure `slug` has a unique constraint.
- You can add hooks/flows to auto-fill `updated_at`.

## 4) Create `services` collection
- Fields:
  - title (string), slug (string unique), image_url1 (string/file), image_url2 (string/file), image_url3 (string/file)
  - published_at (datetime)
  - wilayah (json/array of strings), provider (string), type (json/array of strings)
  - price (string), url (string), whatsapp_url (string), maps_url (string), verify (string)
  - review (text)
  - status (enum: draft/published)
- Relations:
  - category: many-to-many to `categories` (or use array of strings if you prefer)

## 5) Create `products` collection
- Fields:
  - title (string), slug (string unique), image_url (string/file), published_at (datetime)
  - country (json/array of strings), locale (json/array of strings), category (json/array of strings)
  - price (string), description (text)
  - affiliate_code, commission_rate, affiliate_provider, discount_code, special_offer, cta_text, priority, external_rating, sold_count, original_price, is_sponsored (boolean), target_audience (json/array of strings)
  - tokopedia_url, shopee_url, blibli_url, bukalapak_url, lazada_url, url, other_url, maps_url
  - status (enum: draft/published)

## 6) Create `projects` collection
- Fields:
  - title (string), slug (string unique), image_url (string/file), published_at (datetime)
  - country (array), locale (array), category (array)
  - organiser (string), cost (array of strings)
  - url, gyg_url, maps_url, verify (string)
  - review (text), get_involved (text)
  - client, client_industry, project_duration, team_size, technologies (array), challenges, solutions, results
  - beforeMetrics (json), afterMetrics (json), roiPercentage (string), clientTestimonial (text), clientName (string), clientPosition (string)
  - additional_images (array of files/urls)
  - status (enum: draft/published)

## 7) Create `stays` collection
- Fields:
  - title (string), slug (string unique), image_url (string/file), published_at (datetime)
  - country (array), locale (array), category (array)
  - price (string), description (text)
  - status (enum: draft/published)

## 8) Role & Permissions
- Create role `Build` (read-only):
  - Collections: allow `read` on posts, tags, services, products, projects, stays (filter status = published if desired)
- Editors role: create/update on content; optional delete.

## 9) Webhooks
- Create webhook to your Vercel/Netlify build hook:
  - Events: items.create, items.update, items.delete on posts/services/products/projects/stays
  - Method: POST
  - (Optional) Add filter for `status = published` transitions

## 10) Test content
- Create one post with title/slug/body_markdown and status published.
- Run Astro build with DIRECTUS_URL/TOKEN set.