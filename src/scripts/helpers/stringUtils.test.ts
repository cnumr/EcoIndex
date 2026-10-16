import { describe, expect, it } from 'vitest';
import { camelize, replaceKeyIn } from './stringUtils';

describe('camelize', () => {
	it('converts separators to camelCase', () => {
		expect(camelize('foo-bar')).toBe('fooBar');
		expect(camelize('foo_bar baz')).toBe('fooBarBaz');
		expect(camelize('Foo')).toBe('foo');
	});
});

describe('replaceKeyIn', () => {
	it('replaces ##KEY## placeholders', () => {
		expect(replaceKeyIn('Hello ##NAME##!', 'NAME', 'EcoIndex')).toBe('Hello EcoIndex!');
		expect(replaceKeyIn('##A## ##A##', 'A', 'x')).toBe('x x');
	});
});
