import { describe, expect, it } from 'vitest';
import { api } from './api';

describe('api config', () => {
	it('exposes EcoIndex API defaults', () => {
		expect(api.baseUrl).toBe('https://api.ecoindex.fr/v1/');
		expect(api.browserWidth).toBe(1920);
		expect(api.browserHeight).toBe(1080);
	});
});
