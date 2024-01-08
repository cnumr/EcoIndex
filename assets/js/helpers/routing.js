// TODO a proper router service with history management?

/**
 * Redirects to the results page given an analysis id (retrieved from back-end)
 *
 * @param {string} analysisId EcoIndex analyis identifier
 * @param {string} resultUrlPrefix Results page prefix URL
 */
export function redirectToResults(analysisId, resultUrlPrefix) {
	window.location = `${window.location.origin}${resultUrlPrefix}?id=${analysisId}`;
}
