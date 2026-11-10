import { type Locale, t } from '../i18n';

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
		name: t('fr', 'fr'),
		prefix: '',
		description: t('fr', 'MetaDescription'),
	},
	en: {
		code: 'en',
		name: t('en', 'en'),
		prefix: '/en',
		description: t('en', 'MetaDescription'),
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
		if (slugs[locale as Locale] === slug) return section;
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

export const pageTitles: Record<string, Record<Locale, string>> = {
	home: { fr: t('fr', 'PageTitleHome'), en: t('en', 'PageTitleHome') },
	'how-it-works': {
		fr: t('fr', 'PageTitleHowItWorks'),
		en: t('en', 'PageTitleHowItWorks'),
	},
	'eco-design': {
		fr: t('fr', 'PageTitleEcoDesign'),
		en: t('en', 'PageTitleEcoDesign'),
	},
	about: { fr: t('fr', 'PageTitleAbout'), en: t('en', 'PageTitleAbout') },
	'join-us': { fr: t('fr', 'PageTitleJoinUs'), en: t('en', 'PageTitleJoinUs') },
	legal: { fr: t('fr', 'PageTitleLegal'), en: t('en', 'PageTitleLegal') },
	privacy: { fr: t('fr', 'PageTitlePrivacy'), en: t('en', 'PageTitlePrivacy') },
	result: { fr: t('fr', 'PageTitleResult'), en: t('en', 'PageTitleResult') },
	error: { fr: t('fr', 'PageTitleError'), en: t('en', 'PageTitleError') },
	'stop-analysis': {
		fr: t('fr', 'PageTitleStopAnalysis'),
		en: t('en', 'PageTitleStopAnalysis'),
	},
};

export const footerMenu: Record<Locale, MenuItem[]> = {
	fr: [
		{
			label: t('fr', 'FooterMenuJoinUs'),
			href: getPageUrl('fr', 'join-us'),
			weight: 1,
		},
		{
			label: t('fr', 'FooterMenuLegalNotice'),
			href: getPageUrl('fr', 'legal'),
			weight: 2,
		},
		{
			label: t('fr', 'FooterMenuPrivacy'),
			href: getPageUrl('fr', 'privacy'),
			weight: 3,
		},
		{
			label: t('fr', 'FooterMenuGitHub'),
			href: 'https://github.com/cnumr/Ecoindex/',
			weight: 10,
			newtab: true,
		},
	],
	en: [
		{
			label: t('en', 'FooterMenuJoinUs'),
			href: getPageUrl('en', 'join-us'),
			weight: 1,
		},
		{
			label: t('en', 'FooterMenuLegalNotice'),
			href: getPageUrl('en', 'legal'),
			weight: 2,
		},
		{
			label: t('en', 'FooterMenuPrivacy'),
			href: getPageUrl('en', 'privacy'),
			weight: 3,
		},
		{
			label: t('en', 'FooterMenuGitHub'),
			href: 'https://github.com/cnumr/Ecoindex/',
			weight: 10,
			newtab: true,
		},
	],
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
