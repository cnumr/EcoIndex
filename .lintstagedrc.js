import { defineConfig } from 'lint-staged/config';

export default defineConfig({
	'*.{css,js,cjs,mjs,ts,astro,json,md,yml,yaml,md}': ['prettier --write', 'eslint'],
});
