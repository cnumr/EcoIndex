import { describe, expect, it } from 'vitest';
import { clamp, getPercentFromRange, inverseLerp } from './mathUtils';

describe('inverseLerp', () => {
	it('maps value to unit interval', () => {
		expect(inverseLerp(0, 100, 50)).toBe(0.5);
		expect(inverseLerp(10, 20, 10)).toBe(0);
		expect(inverseLerp(10, 20, 20)).toBe(1);
	});
});

describe('clamp', () => {
	it('clamps below min and above max', () => {
		expect(clamp(-1, 0, 10)).toBe(0);
		expect(clamp(15, 0, 10)).toBe(10);
		expect(clamp(5, 0, 10)).toBe(5);
	});
});

describe('getPercentFromRange', () => {
	it('returns percentage within range', () => {
		expect(getPercentFromRange(50, 0, 100)).toBe(50);
		expect(getPercentFromRange(-10, 0, 100)).toBe(0);
		expect(getPercentFromRange(200, 0, 100)).toBe(100);
	});
});
