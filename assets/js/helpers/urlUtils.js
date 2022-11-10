/**
 * Check if the url is valid
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

	// Prevents incorrect resource submission
	let pathname = url.pathname;
	// https://example.com -> pathname = /
	// https://example.com/ -> pathname = /
	// So, more than / is required if there is something behind the domain, like https://example.com/with-something-behind.ext
	if(pathname !== '/') {
		// But there may also be multiple nested directories, like... 
		// https://example.com/1/2/3/file.ext (extension needs to be checked)
		// https://example.com/1/2/3/ (always valid)
		const endPathname = pathname.substring(pathname.lastIndexOf('/') + 1);
		// There is an extension after the lastest slash (presence of a dot)? 
		if(endPathname.indexOf('.') !== -1) {
			if(endPathname.match(/\.(DTD|htm|html|xhtml|xht|mht|mhtml|maff|asp|aspx|adp|bml|cfm|cgi|ihtml|jsp|lass|lasso|lassoapp|pl|php|shtml|stm)$/i)) {
				return url.protocol === "http:" || url.protocol === "https:";
			}
			return false;
		}
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