import { describe, expect, it } from 'vitest';
import { getUrlHostName, isValidHttpUrl } from './urlUtils';

describe('isValidHttpUrl', () => {
	it('accepts http(s) domain URLs', () => {
		expect(isValidHttpUrl('https://example.com')).toBe(true);
		expect(isValidHttpUrl('http://example.com/')).toBe(true);
		expect(isValidHttpUrl('https://example.com/page.html')).toBe(true);
		expect(isValidHttpUrl('https://example.com/path/')).toBe(true);
	});

	it('rejects non-http protocols and invalid strings', () => {
		expect(isValidHttpUrl('ftp://example.com')).toBe(false);
		expect(isValidHttpUrl('not-a-url')).toBe(false);
		expect(isValidHttpUrl('')).toBe(false);
	});

	it('rejects non-html file extensions', () => {
		expect(isValidHttpUrl('https://example.com/file.pdf')).toBe(false);
		expect(isValidHttpUrl('https://example.com/a/b/image.png')).toBe(false);
	});
});

describe('getUrlHostName', () => {
	it('returns hostname for valid URLs', () => {
		expect(getUrlHostName('https://www.ecoindex.fr/path')).toBe('www.ecoindex.fr');
	});

	it('returns false for invalid URLs', () => {
		expect(getUrlHostName('not-a-url')).toBe(false);
	});
});
