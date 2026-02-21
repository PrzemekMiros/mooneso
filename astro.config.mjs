import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';
import robots from 'astro-robots-txt';
import sitemap from 'astro-sitemap';
import remarkBannerStatic from './src/utils/remarkBannerStatic.js';

export default defineConfig({
  site: 'https://mooneso.pl/',
  output: 'static',
  adapter: netlify(),
  integrations: [
    react(),
    sitemap(),
    robots({
      policy: [
        { userAgent: '*', allow: '/' }
      ],
      sitemap: 'https://mooneso.pl/sitemap-index.xml'
    })
  ],
  markdown: {
    remarkPlugins: [remarkBannerStatic],
  },

  vite: {
    cacheDir: "./.vite-cache-build",
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
    plugins: [tailwindcss()],
  },
});
