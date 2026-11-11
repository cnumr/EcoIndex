import en from './en.json' with { type: 'json' };
import fr from './fr.json' with { type: 'json' };

export type Locale = 'fr' | 'en';

// 'typeof fr' or 'typeof en' are the same types, as the keys are the same in the two languages
type LocalesCatalog = Record<Locale, typeof fr>;

const messages: LocalesCatalog = { fr: fr, en: en };
const DEFAULT_LOCALE: Locale = 'fr';

/**
 * Return the translation of the given key in the given language.
 * If not found, send back the transaltion in the default language, otherwise the translation key
 *
 * @param locale Locale
 * @param key Translation key
 * @param replacements Keys are replacement token from the translated string, values are the replacement values
 * @returns Translation
 */
export function t(
	locale: Locale,
	key: keyof LocalesCatalog[Locale],
	replacements?: Record<string, string>,
): string {
	let text = messages[locale][key] ?? messages[DEFAULT_LOCALE][key] ?? key;
	if (replacements) {
		for (const [k, v] of Object.entries(replacements)) {
			text = text.replaceAll(`##${k}##`, v);
		}
	}
	return text;
}

export default messages;
