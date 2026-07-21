import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.codequest.ai',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.9,
    }),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
