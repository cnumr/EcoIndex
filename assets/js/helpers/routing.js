// TODO a proper router service with history management?

/**
 * Redirects to the results page given an analysis id (retrieved from back-end)
 *
 * @param {string} analysisId EcoIndex analyis identifier
 */
export function redirectToResults(analysisId) {
	// TODO: get lang relative url
	window.location = `${window.location.origin}/resultat/?id=${analysisId}`;
}
