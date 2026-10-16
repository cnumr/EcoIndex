import { describe, expect, it } from 'vitest';
import { buildMenuItems, getPageUrl, getSectionFromSlug, mainMenu, site } from './site';

describe('site config', () => {
	it('exposes site metadata', () => {
		expect(site.baseUrl).toBe('https://www.ecoindex.fr');
		expect(site.defaultLocale).toBe('fr');
	});
});

describe('getPageUrl', () => {
	it('builds FR and EN paths', () => {
		expect(getPageUrl('fr', 'home')).toBe('/');
		expect(getPageUrl('fr', 'how-it-works')).toBe('/comment-ca-marche');
		expect(getPageUrl('en', 'home')).toBe('/en');
		expect(getPageUrl('en', 'how-it-works')).toBe('/en/how-it-works');
	});

	it('falls back for unknown section', () => {
		expect(getPageUrl('fr', 'unknown-section')).toBe('/');
		expect(getPageUrl('en', 'unknown-section')).toBe('/en');
	});
});

describe('getSectionFromSlug', () => {
	it('resolves section from localized slug', () => {
		expect(getSectionFromSlug('fr', 'comment-ca-marche')).toBe('how-it-works');
		expect(getSectionFromSlug('en', 'how-it-works')).toBe('how-it-works');
		expect(getSectionFromSlug('fr', 'nope')).toBeUndefined();
	});
});

describe('buildMenuItems', () => {
	it('maps sections to sorted menu items', () => {
		const items = buildMenuItems('fr', mainMenu.fr);
		expect(items.map((i) => i.href)).toEqual(['/', '/comment-ca-marche', '/ecoconception']);
		expect(items[0]?.label).toBe('Testez un site');
	});
});
