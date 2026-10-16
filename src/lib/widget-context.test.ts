import { afterEach, describe, expect, it } from 'vitest';
import {
	getWidgetLoader,
	getWidgetMdxComponents,
	setWidgetContext,
	type RenderedWidget,
} from './widget-context';

describe('widget-context', () => {
	afterEach(() => {
		setWidgetContext(() => [], {});
	});

	it('returns empty loader by default after reset', () => {
		expect(getWidgetLoader()()).toEqual([]);
		expect(getWidgetMdxComponents()).toEqual({});
	});

	it('stores loader and MDX components', () => {
		const widget: RenderedWidget = {
			entry: { data: { type: 'text' }, id: 'w1' },
			WidgetContent: null,
			fileName: 'w1.md',
		};
		const loader = () => [widget];
		const components = { Highlight: {} };

		setWidgetContext(loader, components);

		expect(getWidgetLoader()).toBe(loader);
		expect(getWidgetLoader()()).toEqual([widget]);
		expect(getWidgetMdxComponents()).toBe(components);
	});
});
