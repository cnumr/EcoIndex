import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/site';

type ContentEntry = CollectionEntry<'fr'> | CollectionEntry<'en'>;

function collectionName(locale: Locale): 'fr' | 'en' {
	return locale;
}

function isSectionPage(entry: ContentEntry, section: string): boolean {
	// Pages are uniquely identified by section + type.
	// Do not match on entry.id: FR pages use the localized slug as id (e.g. "resultat").
	return entry.data.type === 'page' && entry.data.section === section;
}

export async function getSectionPage(
	locale: Locale,
	section: string,
): Promise<ContentEntry | undefined> {
	const entries = await getCollection(collectionName(locale));
	return entries.find((entry) => isSectionPage(entry, section));
}

export function getContainerClass(containerType?: string): string {
	if (containerType === 'info-container') return 'info-container wrapper';
	return 'stack-l --s2';
}

export function getWidgetClass(widgetType: string, id: string, customClass?: string): string {
	const formatted = widgetType.replaceAll(/[._]/g, '-');
	return `wg-${formatted} wgi-${formatted}-${id} ${customClass ?? ''}`.trim();
}
