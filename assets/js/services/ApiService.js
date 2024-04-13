import ky from "ky";

const BASE_URL = "https://api.ecoindex.fr/v1/"
const BROWSER_WIDTH = 1920
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
				width: BROWSER_WIDTH,
				height: BROWSER_HEIGHT,
				url,
			},
		};

		return this.#fetchApi("tasks/ecoindexes/", options);
	}

	/**
	 * Request a task analysis by its id
	 *
	 * @param {string} id Analysis Id
	 * @returns {Promise<import("ky").KyResponse>}
	 */
	async fetchAnalysisTaskById(id) {
		const options = {
			method: "get",
			retry: {
				limit: 30,
				statusCodes: [425],
				backoffLimit: 2000,
			},
		};

		return this.#fetchApi("tasks/ecoindexes/" + id, options);
	}

	/**
	 * Get the URL that generates the screenshot of the analyzed page
	 * @param {string} id Analysis Id
	 * @returns {string} API URL
	 */
	getAnalysisScreenshotUrlById(id) {
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
	 * @returns {Promise<import("ky").KyResponse>} response object
	 */
	async #fetchApi(slug, options) {
		this.abortAnalysis();
		const controller = (this.#controller = new AbortController());

		const { signal } = controller;

		return ky(slug, {
			...options,
			prefixUrl: BASE_URL,
			timeout: 60000, // 60s instead of 10s default
			signal,
			headers: {
				"content-type": "application/json",
			},
			redirect: "follow",
		}).json()
	}
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
