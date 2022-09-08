/**
 * Camelize a string, cutting the string by multiple separators like
 * hyphens, underscores and spaces.
 *
 * @param {string} str Text to camelize
 * @return string Camelized text
 */
export function camelize(str) {
	return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
		if (p2) return p2.toUpperCase();
		return p1.toLowerCase();
	});
}

/**
 * Replaces "##KEY##" patern with the given element and string
 *
 * @param {string} key Key to be replaced. This string must be surrounded by "##", e.g. "##KEY##"
 * @param {string} text Text to insert in place of {{ key }}
 *
 * @returns {string} the result text
 */
export function replaceKeyIn(text, key, value) {
	const re = new RegExp("##" + key + "##", "g");
	return text.replace(re, value);
}
