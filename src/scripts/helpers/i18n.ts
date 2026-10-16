/**
 * Client-side i18n helper.
 * Messages are injected at build time via window.__i18n in BaseLayout.
 */
export function t(key: string, replacements?: Record<string, string>): string {
	const messages = window.__i18n ?? {};
	let text = messages[key] ?? key;
	if (replacements) {
		for (const [k, v] of Object.entries(replacements)) {
			text = text.replaceAll(`##${k}##`, v);
		}
	}
	return text;
}
