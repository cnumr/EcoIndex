// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { site } from './src/config/site';

export default defineConfig({
	site: site.baseUrl,
	integrations: [mdx()],
	vite: {
		css: {
			postcss: './postcss.config.cjs',
		},
	},
});
