import ky from "ky";

class ApiService {
	#controller = null;

	// TODO import data with build : https://gohugo.io/hugo-pipes/js/#:~:text=params%20%5Bmap%20or,New%20in%20v0.78.0

	// TODO: temp key, need to create specific one for app
	#apiKey = "3037e7e96fmsh12bedced9f019f8p1cd804jsn4967070f8bda";

	// TODO set from .env ?
	#baseURL = "https://ecoindex.p.rapidapi.com/v1/";
	#host = "ecoindex.p.rapidapi.com";
	#browserWidth = 1920;
	#browserHeight = 1080;

	/**
	 * Request a new analysis by URL
	 *
	 * @param {string} url URL
	 * @returns {Response} response object
	 */
	async newAnalysisByURL(url) {
		const options = {
			method: "post",
			json: {
				width: this.#browserWidth,
				height: this.#browserHeight,
				url,
			},
		};
		return this.#fetchApi("ecoindexes/", options);
	}

	/**
	 * Request a new analysis by id
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
	 * New analysis, by URL or by ID
	 *
	 * @param {string} slug Request URL slug
	 * @param {Object} options object (with url or id)
	 * @param {string} [options.method] Method: 'post' or 'get'
	 * @param {Object} [options.json] Object of properties to post in body (relevant for post method)
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
				"X-RapidAPI-Host": this.#host,
				"X-RapidAPI-Key": this.#apiKey,
			},
			redirect: "follow",
		}).json();

		return response;
	}
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
