import type { Locale } from '../config/site';
import fr from './fr.json';
import en from './en.json';

const messages: Record<Locale, Record<string, string>> = { fr, en };

export function t(locale: Locale, key: string, replacements?: Record<string, string>): string {
	let text = messages[locale][key] ?? messages.fr[key] ?? key;
	if (replacements) {
		for (const [k, v] of Object.entries(replacements)) {
			text = text.replaceAll(`##${k}##`, v);
		}
	}
	return text;
}

export function getMessages(locale: Locale): Record<string, string> {
	return messages[locale];
}

export default messages;
