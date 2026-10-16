import { describe, expect, it } from 'vitest';
import { getMessages, t } from './index';

describe('t (server)', () => {
	it('returns FR message', () => {
		const messages = getMessages('fr');
		const key = Object.keys(messages)[0];
		expect(key).toBeTruthy();
		expect(t('fr', key!)).toBe(messages[key!]);
	});

	it('falls back to FR then key', () => {
		expect(t('en', '___missing___')).toBe('___missing___');
	});

	it('applies replacements', () => {
		const messages = getMessages('fr');
		const keyWithPlaceholder = Object.entries(messages).find(([, v]) => v.includes('##'))?.[0];
		if (!keyWithPlaceholder) {
			expect(t('fr', 'Any', { X: '1' })).toBe('Any');
			return;
		}
		const raw = messages[keyWithPlaceholder]!;
		const placeholder = raw.match(/##(\w+)##/)?.[1];
		if (!placeholder) return;
		expect(t('fr', keyWithPlaceholder, { [placeholder]: 'VALUE' })).toContain('VALUE');
		expect(t('fr', keyWithPlaceholder, { [placeholder]: 'VALUE' })).not.toContain(
			`##${placeholder}##`,
		);
	});
});
