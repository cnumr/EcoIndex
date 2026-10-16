/**
 * Camelize a string, cutting the string by multiple separators like
 * hyphens, underscores and spaces.
 */
export function camelize(str: string): string {
	return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function (_match, p1: string, p2?: string) {
		if (p2) return p2.toUpperCase();
		return p1.toLowerCase();
	});
}

/**
 * Replaces "##KEY##" pattern with the given value.
 */
export function replaceKeyIn(text: string, key: string, value: string): string {
	const re = new RegExp('##' + key + '##', 'g');
	return text.replace(re, value);
}
