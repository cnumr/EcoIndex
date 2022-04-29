import getUrlHostName from "../helpers/getUrlHostName";

/**
 * Create a new site analysis
 * @class
 */
class SiteAnalysis {
	/**
	 * Create a site analysis with post and fetch analysis result from api
	 * @param {Object} params
	 * @param {Element} params.el
	 * @param {string} params.apiUrl
	 * @param {string} params.apiKey
	 */
	async constructor({ el, apiUrl, apiKey }) {
		this.el = el;
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;
		await this._init();
	}

	async _init() {
		// Get "url" param from url
		const urlParams = new URLSearchParams(window.location.search);
		const analysisUrl = urlParams.get("url");
		if (!analysisUrl) {
			console.error("No url param found");
			// TODO : redirect to error page
			//window.location = `${window.location.origin}/`;
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
		const resultUrlParams = new URLSearchParams();
		Object.keys(analysisResultData).forEach((key) => {
			resultUrlParams.append(key, analysisResultData[key]);
		});

		// TODO: get lang relative url
		window.location = `${window.location.origin}/resultat/?${resultUrlParams}`;
	}

	/**
	 * Fetch api post request
	 * @param {{width: number, url: string, height: number}} postData - post data to send to api
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

		const response = await fetch(apiUrl, options);
		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}

		return await response.json();
	}
}
export default SiteAnalysis;
