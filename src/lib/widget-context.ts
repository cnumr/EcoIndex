export type RenderedWidget = {
	entry: { data: Record<string, unknown>; id: string };
	// Astro MDX/Content component factory (shape varies by Astro version)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	WidgetContent: any;
	fileName: string;
};

export type WidgetLoader = (zone?: string) => RenderedWidget[];
export type MdxComponents = Record<string, unknown>;

let widgetLoader: WidgetLoader | null = null;
let widgetMdxComponents: MdxComponents = {};

export function setWidgetContext(loader: WidgetLoader, components: MdxComponents): void {
	widgetLoader = loader;
	widgetMdxComponents = components;
}

export function getWidgetLoader(): WidgetLoader {
	if (!widgetLoader) {
		return () => [];
	}
	return widgetLoader;
}

export function getWidgetMdxComponents(): MdxComponents {
	return widgetMdxComponents;
}
