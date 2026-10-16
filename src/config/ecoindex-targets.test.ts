import { describe, expect, it } from 'vitest';
import { ecoindexTargets } from './ecoindex-targets';

describe('ecoindexTargets', () => {
	it('exposes generated score targets', () => {
		expect(ecoindexTargets.size).toBeGreaterThan(0);
		expect(ecoindexTargets.nodes).toBeGreaterThan(0);
		expect(ecoindexTargets.requests).toBeGreaterThan(0);
	});
});
