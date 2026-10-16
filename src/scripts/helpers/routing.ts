// TODO a proper router service with history management?

/**
 * Redirects to the results page given an analysis id (retrieved from back-end)
 */
export function redirectToResults(analysisId: string, resultUrlPrefix: string): void {
	window.location.href = `${window.location.origin}${resultUrlPrefix}?id=${analysisId}`;
}
