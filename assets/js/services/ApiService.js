import ky from "ky";

const BASE_URL = "https://api.ecoindex.fr/v1/";
const BROWSER_WIDTH = 1920;
const BROWSER_HEIGHT = 1080;

class ApiService {
	#controller = null;

	/**
	 * Create a new analysis task by URL
	 *
	 * @param {string} url URL
	 * @returns {Promise<import("ky").KyResponse>}
	 */
	async newAnalysisTaskByURL(url) {
		const options = {
			method: "post",
			json: {
				web_page: {
					width: BROWSER_WIDTH,
					height: BROWSER_HEIGHT,
					url,
				},
				include_requests_detail: true,
			},
		};

		return this.#fetchApi("tasks/ecoindexes/", options);
	}

	/**
	 * Request a task analysis by its id
	 *
	 * @param {string} id Analysis Id
	 * @param {function} [onProgress] Called on each 425 (too early) response with the task payload
	 * @returns {Promise<import("ky").KyResponse>}
	 */
	async fetchAnalysisTaskById(id, onProgress) {
		const options = {
			method: "get",
			retry: {
				limit: 300,
				statusCodes: [425],
				backoffLimit: 2000,
			},
			hooks: {
				afterResponse: [
					async (_request, _options, response) => {
						if (response.status === 425 && typeof onProgress === "function") {
							try {
								onProgress(await response.clone().json());
							} catch {
								// Ignore unreadable intermediate payloads
							}
						}
						return response;
					},
				],
			},
		};

		return this.#fetchApi("tasks/ecoindexes/" + id, options);
	}

	/**
	 * Get the URL that generates the screenshot of the analyzed page
	 * @param {string} id Analysis Id
	 * @returns {string} API URL
	 */
	fetchAnalysisScreenshotUrlById(id) {
		return `${BASE_URL}ecoindexes/${id}/screenshot`;
	}

	/**
	 * Request an analysis by its id
	 *
	 * @param {string} id Id
	 * @returns {Promise<import("ky").KyResponse>}
	 */
	async fetchAnalysisById(id) {
		const options = {
			method: "get",
		};

		return this.#fetchApi("ecoindexes/" + id, options);
	}

	/**
	 * Request the HTTP request details of an analysis by its id.
	 * Returns `null` when the analysis exists but details were not collected.
	 *
	 * @param {string} id Analysis Id
	 * @returns {Promise<object|null>}
	 */
	async fetchAnalysisRequestsById(id) {
		try {
			return await this.#fetchApi("ecoindexes/" + id + "/requests", {
				method: "get",
				abort: false,
			});
		} catch {
			return null;
		}
	}

	/**
	 * Aborts analysis request
	 *
	 * @returns {boolean} true for success else false
	 */
	async abortAnalysis() {
		if (!this.#controller) {
			return false;
		}
		this.#controller.abort();
	}

	/**
	 * New ecoindex API Wrapper
	 *
	 * @param {string} slug Request URL slug
	 * @param {Object} options object (with url or id)
	 * @param {string} [options.method] Method: 'post' or 'get'
	 * @param {Object} [options.json] Object of properties to post in body (relevant for post method)
	 * @param {Object} [options.retry] Retry object to override default Ky retry request property
	 * @param {boolean} [options.abort=true] Abort any in-flight analysis request before fetching
	 * @returns {Promise<import("ky").KyResponse>} response object
	 */
	async #fetchApi(slug, options) {
		const { abort = true, ...kyOptions } = options;

		let signal;
		if (abort) {
			this.abortAnalysis();
			const controller = (this.#controller = new AbortController());
			signal = controller.signal;
		}

		return ky(slug, {
			...kyOptions,
			prefixUrl: BASE_URL,
			timeout: false, // Set to no timeout
			...(signal ? { signal } : {}),
			headers: {
				"content-type": "application/json",
			},
			redirect: "follow",
		}).json();
	}
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
