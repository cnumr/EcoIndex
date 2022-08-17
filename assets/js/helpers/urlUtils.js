/**
 * Checl if the url is valid
 * @param {string} urlString
 * @returns {boolean} - return true if valid
 */
export function isValidHttpUrl(urlString) {
	let url;

	try {
		url = new URL(urlString);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Get hostname from string if url
 * @param {string} url string input
 * @returns {string|boolean} hostname
 */
export function getUrlHostName(url) {
	let urlObject;

	try {
		urlObject = new URL(url);
	} catch (_) {
		return false;
	}

	return urlObject.hostname;
}
