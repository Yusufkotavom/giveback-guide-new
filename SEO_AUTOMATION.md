# SEO Automation in This Project

This codebase now automates common on‑page SEO across posts, tags, services, products, and projects.

## What’s automated
- Metadata
  - Dynamic title/description with safe fallbacks.
  - Canonical + hreflang (id, x‑default).
  - Open Graph with automatic image fallback via Cloudinary text overlay.
  - Twitter card (summary_large_image).
  - For articles: `og:type=article` + `article:published_time`, `article:modified_time`, `article:section`, and repeated `article:tag`.
  - Theme color and preconnects (Cloudinary, jsDelivr).
- Pagination signals
  - Blog index and tag pages add `<link rel=prev/next>` and set `noindex,follow` for pages > 1.
- JSON‑LD Schema
  - Article, Product, Service, Project, LocalBusiness, Website, WebPage, BreadcrumbList.
  - Posts pass word count when MDX body is present.
  - Optional FAQ/HowTo support via frontmatter arrays.
- MDX enhancements
  - GFM tables, heading anchors, autolinked headings, and external link hardening (`target=_blank` + `rel`).
- Sitemap
  - Priority is higher for detail pages, lower for deep pagination.
- RSS
  - Merged Notion and MDX feeds, sorted by date.

## Files touched
- `src/layouts/MainLayout.astro`: lang=id, head slot, forwards SEO props.
- `src/components/BaseHead.astro`: OG/Twitter/hreflang/canonical/preconnects, article meta, OG image fallback.
- `src/pages/blog/[...slug].astro`: MDX description + word count fallback.
- `src/layouts/PostLayout.astro`: passes article props to head and schema.
- `src/pages/blog/[...page].astro` and `src/pages/blog/[tag]/[...page].astro`: prev/next + robots noindex for pagination.
- `astro.config.mjs`: MDX plugins and sitemap priority.
- `src/pages/rss.xml.js`: unified feed.
- `src/utils/og.ts`: Cloudinary OG URL generator.

## Frontmatter options (MDX)
- `description`: Overrides auto‑excerpt.
- `tags: ["a", "b"]`: Used for keywords and `article:tag`.
- `faq: [{ question, answer }]`: Adds FAQPage JSON‑LD.
- `steps: [{ name, text, image? }]`: Adds HowTo JSON‑LD.

## Extending
- Add brand social handles as constants to enrich Twitter/Open Graph.
- Implement Satori/ResVG OG generation if you prefer server‑rendered images.
- Expand sitemap serialization with per‑page `lastmod` by reading content dates during build.