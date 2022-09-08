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

	get ANALYSIS_BY_URL() {
		return 0;
	}

	get ANALYSIS_BY_ID() {
		return 1;
	}

	/**
	 * New analysis, by URL or by ID
	 *
	 * @param {int} type ANALYSIS_BY_URL or ANALYSIS_BY_ID
	 * @param {Object} options object (with url or id)
	 * @param {string} [options.url] URL The URL to analyse
	 * @param {string} [options.id] Id of a previous analysis
	 * @returns {Response} response object
	 */
	async newAnalysis(type, options) {
		this.abortAnalysis();
		const controller = (this.#controller = new AbortController());

		const { signal } = controller;

		const json = {
			width: this.#browserWidth,
			height: this.#browserHeight,
		};

		let slug = "";
		switch (type) {
			case this.ANALYSIS_BY_URL:
				slug = "ecoindexes";
				json.url = options.url;
				break;

			case this.ANALYSIS_BY_ID:
				slug = "id";
				break;

			default:
				break;
		}

		const response = await ky
			.post(slug, {
				timeout: 60000, // 60s instead of 10s default
				signal,
				prefixUrl: this.#baseURL,
				json,
				headers: {
					"content-type": "application/json",
					"X-RapidAPI-Host": this.#host,
					"X-RapidAPI-Key": this.#apiKey,
				},
				redirect: "follow",
			})
			.json();
		return response;
	}

	/**
	 * Request a new analysis by URL
	 *
	 * @param {string} url URL
	 * @returns {Response} response object
	 */
	async newAnalysisByURL(url) {
		return this.newAnalysis(this.ANALYSIS_BY_URL, { url });
	}

	/**
	 * Request a new analysis by id
	 *
	 * @param {string} id Id
	 * @returns {Response} response object
	 */
	async newAnalysisById(id) {
		return this.newAnalysis(this.ANALYSIS_BY_ID, { id });
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
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
