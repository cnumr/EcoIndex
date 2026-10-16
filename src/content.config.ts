import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const contentSchema = z.object({
	locale: z.enum(['fr', 'en']),
	section: z.string(),
	type: z.enum(['page', 'widget']).default('page'),
	title: z.string().optional(),
	slug: z.string().optional(),
	layout: z.string().optional(),
	decoType: z.string().optional(),
	custom_class: z.string().optional(),
	id: z.string().optional(),
	weight: z.number().optional(),
	widget: z.string().optional(),
	widget_class: z.string().optional(),
	draft: z.boolean().optional(),
	active: z.boolean().optional(),
	headless: z.boolean().optional(),
	footprint_intro_text: z.string().optional(),
	collapse_info: z.string().optional(),
	menu: z
		.object({
			main: z.object({ weight: z.number() }).optional(),
			extra: z.object({ weight: z.number() }).optional(),
		})
		.optional(),
});

export const collections = {
	fr: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/fr' }),
		schema: contentSchema,
	}),
	en: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/en' }),
		schema: contentSchema,
	}),
};
