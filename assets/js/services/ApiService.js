import ky from "ky";

class ApiService {
	#controller = null;

	// TODO import data with build : https://gohugo.io/hugo-pipes/js/#:~:text=params%20%5Bmap%20or,New%20in%20v0.78.0

	// TODO set from .env ?
	#baseURL = "https://api.ecoindex.fr/v1/";
	#browserWidth = 1920;
	#browserHeight = 1080;

	/**
	 * Create a new analysis task by URL
	 *
	 * @param {string} url URL
	 * @returns {Response} response object
	 */
	async newAnalysisTaskByURL(url) {
		const options = {
			method: "post",
			json: {
				width: this.#browserWidth,
				height: this.#browserHeight,
				url,
			},
		};
		return this.#fetchApi("tasks/ecoindexes", options);
	}

	/**
	 * Request a task analysis by its id
	 *
	 * @param {string} id Id
	 * @returns {Response} response object
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
	 * Request an analysis by its id
	 *
	 * @param {string} id Id
	 * @returns {Response} response object
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
	 * @param {Object} [Options.retry] Retry object to override default Ky retry request property
	 * @returns {Response} response object
	 */
	async #fetchApi(slug, options) {
		this.abortAnalysis();
		const controller = (this.#controller = new AbortController());

		const { signal } = controller;

		const response = await ky(slug, {
			...options,
			prefixUrl: this.#baseURL,
			timeout: 60000, // 60s instead of 10s default
			signal,
			headers: {
				"content-type": "application/json",
			},
			redirect: "follow",
		}).json();

		return response;
	}
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
