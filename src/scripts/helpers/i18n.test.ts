import { afterEach, describe, expect, it } from 'vitest';
import { t } from './i18n';

describe('t (client)', () => {
	afterEach(() => {
		delete window.__i18n;
	});

	it('returns key when message is missing', () => {
		expect(t('MissingKey')).toBe('MissingKey');
	});

	it('returns translated message with replacements', () => {
		window.__i18n = { Hello: 'Bonjour ##NAME##' };
		expect(t('Hello', { NAME: 'Alice' })).toBe('Bonjour Alice');
	});
});
