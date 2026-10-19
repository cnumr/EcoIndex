import { afterEach, describe, expect, it } from 'vitest';
import { loadI18n, setMessagesForTests, t } from './i18n';

describe('t (client)', () => {
	afterEach(() => {
		setMessagesForTests({});
	});

	it('returns key when message is missing', () => {
		expect(t('MissingKey')).toBe('MissingKey');
	});

	it('returns translated message with replacements', () => {
		setMessagesForTests({ Hello: 'Bonjour ##NAME##' });
		expect(t('Hello', { NAME: 'Alice' })).toBe('Bonjour Alice');
	});

	it('loadI18n loads fr messages by default', async () => {
		document.documentElement.lang = 'fr';
		await loadI18n();
		expect(t('Close')).toBe('Fermer');
	});

	it('loadI18n loads en messages when locale is en', async () => {
		await loadI18n('en');
		expect(t('Close')).toBe('Close');
	});
});
