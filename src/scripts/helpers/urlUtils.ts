/**
 * Check if the url is valid
 */
export function isValidHttpUrl(urlString: string): boolean {
	let url: URL;

	try {
		url = new URL(urlString);
	} catch {
		return false;
	}

	// Prevents incorrect resource submission
	const pathname = url.pathname;
	// https://example.com -> pathname = /
	// https://example.com/ -> pathname = /
	// So, more than / is required if there is something behind the domain, like https://example.com/with-something-behind.ext
	if (pathname !== '/') {
		// But there may also be multiple nested directories, like...
		// https://example.com/1/2/3/file.ext (extension needs to be checked)
		// https://example.com/1/2/3/ (always valid)
		const endPathname = pathname.substring(pathname.lastIndexOf('/') + 1);
		// There is an extension after the lastest slash (presence of a dot)?
		if (
			endPathname.indexOf('.') !== -1 &&
			!endPathname.match(
				/\.(DTD|htm|html|xhtml|xht|mht|mhtml|maff|asp|aspx|adp|bml|cfm|cgi|ihtml|jsp|lass|lasso|lassoapp|pl|php|shtml|stm)$/i,
			)
		) {
			return false;
		}
	}

	return url.protocol === 'http:' || url.protocol === 'https:';
}

/**
 * Get hostname from string if url
 */
export function getUrlHostName(url: string): string | false {
	let urlObject: URL;

	try {
		urlObject = new URL(url);
	} catch {
		return false;
	}

	return urlObject.hostname;
}
