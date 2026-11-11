import { describe, expect, it } from 'vitest';
import { t } from './index';

describe('t (server)', () => {
	it('falls back to the translation key if translations do not exist', () => {
		expect(t('en', '___missing___' as 'fr')).toBe('___missing___');
	});

	it('returns the translated key if replacement tokens are absent from the translated message', () => {
		expect(t('fr', 'Any' as 'fr', { X: '1' })).toBe('Any');
	});

	it('returns the translated message with tokens replaced tokens if they are present', () => {
		const message = t('fr', 'Error429');

		const placeholder = message.match(/##(\w+)##/)?.[1] as string;

		expect(t('fr', 'Error429', { [placeholder]: 'VALUE' })).toContain('VALUE');
		expect(t('fr', 'Error429', { [placeholder]: 'VALUE' })).not.toContain(`##${placeholder}##`);
	});
});
