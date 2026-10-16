import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'astro:content': path.join(root, 'src/test/mocks/astro-content.ts'),
		},
	},
	test: {
		environment: 'happy-dom',
		isolate: false,
		include: ['src/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: [
				'src/scripts/**/*.ts',
				'src/config/**/*.ts',
				'src/lib/**/*.ts',
				'src/i18n/**/*.ts',
			],
			exclude: [
				'src/**/*.test.ts',
				'src/test/**',
				'src/scripts/types/**',
				'src/scripts/index.ts',
				'src/scripts/components/SiteAnalysisResult.ts',
				'src/scripts/components/RequestDetails.ts',
				'src/scripts/components/BestPractices.ts',
				'src/scripts/components/EcoIndexDialog.ts',
				'src/scripts/components/ResultRangeSlider.ts',
				'src/scripts/components/BadgeIntegration.ts',
				'src/config/result-text.ts',
			],
		},
	},
});
