// @ts-check
import { defineConfig } from 'astro/config';

// Static output — Netlify serves the built `dist/` folder. No adapter needed.
export default defineConfig({
  // `site` is used for absolute URLs; update to the real Netlify/custom domain
  // after the first deploy. Not required for the site to function.
  site: 'https://betweenthebranches.netlify.app',
});
