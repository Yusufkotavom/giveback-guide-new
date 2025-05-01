// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://giveback.guide',
  integrations: [mdx(), sitemap(), pagefind()],

  vite: {
    server: {
      fs: {
        allow: ['.'], // Ensure the `_pagefind` directory is accessible
      },
    },
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});