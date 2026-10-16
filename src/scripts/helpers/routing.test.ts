import { afterEach, describe, expect, it, vi } from 'vitest';
import { redirectToResults } from './routing';

describe('redirectToResults', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('navigates to result URL with analysis id', () => {
		vi.stubGlobal('location', {
			origin: 'https://www.ecoindex.fr',
			href: '',
		});

		redirectToResults('abc-123', '/resultat');

		expect(window.location.href).toBe('https://www.ecoindex.fr/resultat?id=abc-123');
	});
});
