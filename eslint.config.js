import { defineConfig } from "eslint/config";
import globals from "globals";
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

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
			}
		}
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
]);
