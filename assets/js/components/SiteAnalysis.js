import getUrlHostName from "../helpers/getUrlHostName";

const IS_API_MOCKED = false;
const MOCK_API_RESPONSE = {
	width: 1920,
	height: 1080,
	url: "https://fr.yahoo.com/",
	grade: "A",
	score: 86,
	ges: 1.28,
	water: 1.92,
	date: "2022-03-31T19:47:34",
	page_type: null,
	id: "36a14691-5c8b-458a-afcf-6bdf47396e63",
	version: 1,
	size: 206.629,
	nodes: 63,
	requests: 11,
	host: "fr.yahoo.com",
	initial_ranking: 12,
	initial_total_results: 18,
};

class SiteAnalysis {
	/**
	 * Create a site analysis with post and fetch analysis result from api
	 * @param {Object} params
	 * @param {Element} el
	 * @param {string} apiUrl
	 */
	constructor({ el, apiUrl, apiKey }) {
		this.el = el;
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;
		this._init();
	}

	async _init() {
		// Get url param
		const urlParams = new URLSearchParams(window.location.search);
		const analysisUrl = urlParams.get("url");
		if (!analysisUrl) {
			console.error("No url param found");
		}

		// Fill dom with url
		this.el.querySelector("[data-int='url']").textContent = getUrlHostName(analysisUrl);

		// Fetch api to analyze url and get result
		const analysisResultData = await this._fetchPost(
			{ url: analysisUrl, width: 1920, height: 1080 },
			this.apiUrl,
			this.apiKey
		);

		this._redirectToResultPage(analysisResultData);
	}

	/**
	 * Redirect to result page with analysis result as params
	 * @param {Object} analysisResultData
	 */
	_redirectToResultPage(analysisResultData) {
		// - get post request and pass it to url params
		var resultUrlparams = new URLSearchParams();
		Object.keys(analysisResultData).forEach((key) => {
			resultUrlparams.append(key, analysisResultData[key]);
		});
		// TODO: get lang relative url
		window.location = `${window.location.origin}/resultat/?${resultUrlparams}`;
	}

	/**
	 * Fetch api post request
	 * @param {Object} postData - post data to send to api
	 * @param {string} postData.url - url to analyze
	 * @param {string} postData.width - page width
	 * @param {string} postData.height - page height
	 * @param {string} apiUrl - api url to fetch
	 * @param {string} apiKey - api key to fetch
	 */
	async _fetchPost(postData, apiUrl, apiKey) {
		const options = {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Host": "ecoindex.p.rapidapi.com",
				"X-RapidAPI-Key": apiKey,
			},
			body: `{"width":${postData.width},"height":${postData.height},"url": "${postData.url}"}`,
			redirect: "follow",
		};

		if (!IS_API_MOCKED) {
			const response = await fetch(apiUrl, options);
			if (!response.ok) {
				const message = `An error has occured: ${response.status}`;
				throw new Error(message);
			}

			return await response.json();
		} else {
			// Simulate api response
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(MOCK_API_RESPONSE);
				}, 3000);
			});
		}
	}
}
export default SiteAnalysis;
