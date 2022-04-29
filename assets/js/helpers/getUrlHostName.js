/**
 * Get hostname from string if url
 * @param {string} url string input
 * @returns {string|boolean} hostname
 */
export default function getUrlHostName(url) {
	let urlObject;

	try {
		urlObject = new URL(url);
	} catch (_) {
		return false;
	}

	return urlObject.hostname;
}
