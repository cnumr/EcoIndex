export type Locale = 'fr' | 'en';

export interface SiteConfig {
	baseUrl: string;
	defaultLocale: Locale;
	themeColor: string;
}

export const site: SiteConfig = {
	baseUrl: 'https://www.ecoindex.fr',
	defaultLocale: 'fr',
	themeColor: '#007e5f',
};

export interface MenuItem {
	label: string;
	href: string;
	weight: number;
	newtab?: boolean;
}

export interface LocaleConfig {
	code: Locale;
	name: string;
	prefix: string;
	description: string;
}

export const locales: Record<Locale, LocaleConfig> = {
	fr: {
		code: 'fr',
		name: 'Français',
		prefix: '',
		description:
			"Évaluez gratuitement la performance et l'empreinte environnementale de votre site web",
	},
	en: {
		code: 'en',
		name: 'English',
		prefix: '/en',
		description:
			'Evaluate the performance and environmental footprint of your website for free',
	},
};

/** Logical section key → URL slug per locale */
export const routes: Record<string, Record<Locale, string>> = {
	home: { fr: '', en: '' },
	'how-it-works': { fr: 'comment-ca-marche', en: 'how-it-works' },
	'eco-design': { fr: 'ecoconception', en: 'ecodesign' },
	about: { fr: 'a-propos', en: 'about' },
	'join-us': { fr: 'nous-rejoindre', en: 'join-us' },
	legal: { fr: 'mentions-legales', en: 'legal' },
	privacy: { fr: 'confidentialite', en: 'privacy' },
	result: { fr: 'resultat', en: 'result' },
	error: { fr: 'erreur', en: 'error' },
	'stop-analysis': { fr: 'stop-analyse', en: 'stop-analysis' },
	loading: { fr: 'chargement', en: 'loading' },
	'404': { fr: '404', en: '404' },
};

export function getPageUrl(locale: Locale, section: string): string {
	const slug = routes[section]?.[locale];
	if (slug === undefined) return locales[locale].prefix || '/';
	const prefix = locales[locale].prefix;
	if (!slug) return prefix || '/';
	return `${prefix}/${slug}`;
}

export function getSectionFromSlug(locale: Locale, slug: string): string | undefined {
	for (const [section, slugs] of Object.entries(routes)) {
		if (slugs[locale] === slug) return section;
	}
	return undefined;
}

export const mainMenu: Record<Locale, { section: string; weight: number }[]> = {
	fr: [
		{ section: 'home', weight: 1 },
		{ section: 'how-it-works', weight: 2 },
		{ section: 'eco-design', weight: 3 },
	],
	en: [
		{ section: 'home', weight: 1 },
		{ section: 'how-it-works', weight: 2 },
		{ section: 'eco-design', weight: 3 },
	],
};

export const extraMenu: Record<Locale, { section: string; weight: number }[]> = {
	fr: [
		{ section: 'about', weight: 1 },
		{ section: 'join-us', weight: 2 },
	],
	en: [
		{ section: 'about', weight: 1 },
		{ section: 'join-us', weight: 2 },
	],
};

export const footerMenu: Record<Locale, MenuItem[]> = {
	fr: [
		{ label: 'Nous rejoindre', href: getPageUrl('fr', 'join-us'), weight: 1 },
		{ label: 'Mentions légales', href: getPageUrl('fr', 'legal'), weight: 2 },
		{ label: 'Politique de confidentialité', href: getPageUrl('fr', 'privacy'), weight: 3 },
		{
			label: 'GitHub',
			href: 'https://github.com/cnumr/Ecoindex/',
			weight: 10,
			newtab: true,
		},
	],
	en: [
		{ label: 'Join us', href: getPageUrl('en', 'join-us'), weight: 1 },
		{ label: 'Legal notice', href: getPageUrl('en', 'legal'), weight: 2 },
		{ label: 'Privacy', href: getPageUrl('en', 'privacy'), weight: 3 },
		{
			label: 'GitHub',
			href: 'https://github.com/cnumr/Ecoindex/',
			weight: 10,
			newtab: true,
		},
	],
};

export const pageTitles: Record<string, Record<Locale, string>> = {
	home: { fr: 'Testez un site', en: 'Test a website' },
	'how-it-works': { fr: 'Comment ça marche ?', en: 'How does it work?' },
	'eco-design': { fr: "L'écoconception", en: 'Eco-design' },
	about: { fr: 'À propos', en: 'About' },
	'join-us': { fr: 'Nous rejoindre', en: 'Join us' },
	legal: { fr: 'Mentions légales', en: 'Legal notice' },
	privacy: { fr: 'Confidentialité', en: 'Privacy' },
	result: { fr: 'Résultat', en: 'Result' },
	error: { fr: 'Erreur', en: 'Error' },
	'stop-analysis': { fr: "Arrêt de l'analyse", en: 'Stop analysis' },
};

export function buildMenuItems(
	locale: Locale,
	menu: { section: string; weight: number }[],
): MenuItem[] {
	return menu
		.map(({ section, weight }) => ({
			label: pageTitles[section]?.[locale] ?? section,
			href: getPageUrl(locale, section),
			weight,
		}))
		.sort((a, b) => a.weight - b.weight);
}
