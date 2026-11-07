import { defineConfig } from 'eslint/config';
import globals from 'globals';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	{
		ignores: ['dist/**', 'node_modules/**', '.astro/**', 'public/**', 'bun.lock'],
	},
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ['**/*.{ts,tsx,astro}'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
		},
	},
	eslintPluginPrettierRecommended,
]);
