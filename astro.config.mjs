// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://giangnguyen1992.github.io',
  base: '/leuchturm-online-case-study',
  integrations: [vue()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "variables" as *;
            @use "mixins" as *;
          `,
          loadPaths: [path.resolve(__dirname, 'src/styles')],
        },
      },
    },
  },
});
