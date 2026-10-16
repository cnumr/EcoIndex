import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', '.astro/**', 'public/**', 'bun.lock'],
	},
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: {
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				console: 'readonly',
				URL: 'readonly',
				URLSearchParams: 'readonly',
				Intl: 'readonly',
				fetch: 'readonly',
				FormData: 'readonly',
				AbortController: 'readonly',
				DOMException: 'readonly',
				HTMLElement: 'readonly',
				Element: 'readonly',
				Node: 'readonly',
				Event: 'readonly',
				CustomEvent: 'readonly',
				localStorage: 'readonly',
				sessionStorage: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly',
				requestAnimationFrame: 'readonly',
				cancelAnimationFrame: 'readonly',
				getComputedStyle: 'readonly',
				MutationObserver: 'readonly',
				IntersectionObserver: 'readonly',
				ResizeObserver: 'readonly',
				structuredClone: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: ['**/*.{ts,tsx,astro}'],
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
	{
		files: ['**/*.astro'],
		rules: {
			// Astro frontmatter / template patterns
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
];
