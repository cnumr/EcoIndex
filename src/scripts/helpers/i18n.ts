/**
 * Client-side i18n helper.
 * Messages are loaded from the locale JSON chunk (see loadI18n).
 */

let messages: Record<string, string> = {};

export async function loadI18n(locale?: string): Promise<void> {
	const lang =
		locale ??
		(typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'fr');
	const mod =
		lang === 'en' ? await import('../../i18n/en.json') : await import('../../i18n/fr.json');
	messages = mod.default;
}

export function t(key: string, replacements?: Record<string, string>): string {
	let text = messages[key] ?? key;
	if (replacements) {
		for (const [k, v] of Object.entries(replacements)) {
			text = text.replaceAll(`##${k}##`, v);
		}
	}
	return text;
}

/** Test helper: inject messages without loading JSON. */
export function setMessagesForTests(next: Record<string, string>): void {
	messages = next;
}
