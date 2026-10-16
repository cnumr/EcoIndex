import { describe, expect, it } from 'vitest';
import { getContainerClass, getWidgetClass } from './content';

describe('getContainerClass', () => {
	it('returns info-container class when requested', () => {
		expect(getContainerClass('info-container')).toBe('info-container wrapper');
	});

	it('returns default stack class otherwise', () => {
		expect(getContainerClass()).toBe('stack-l --s2');
		expect(getContainerClass('other')).toBe('stack-l --s2');
	});
});

describe('getWidgetClass', () => {
	it('formats widget type and id', () => {
		expect(getWidgetClass('result.intro', '1')).toBe('wg-result-intro wgi-result-intro-1');
		expect(getWidgetClass('text', 'a', 'extra')).toBe('wg-text wgi-text-a extra');
	});
});
