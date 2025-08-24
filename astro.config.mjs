// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kotacom.id',
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }],
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    }),
    sitemap({
      serialize(item) {
        const url = item.url;
        const priority = /\/\d+\/$/.test(url) ? 0.3 : url.includes('/blog/') || url.includes('/products/') || url.includes('/services/') || url.includes('/projects/') ? 0.9 : 0.7;
        return { ...item, priority };
      }
    }),
    pagefind()
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});