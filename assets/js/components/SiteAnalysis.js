import { getUrlHostName } from "../helpers/urlUtils";
import resultCacheService from "../services/resultCacheService";
import loaderLayoutService from "../services/loaderLayoutService";

/**
 * Create a new site analysis
 * @class
 */
class SiteAnalysis {
	/**
	 * Create a site analysis with post and fetch analysis result from api
	 * @param {Object} params
	 * @param {string} params.analysisUrl
	 * @param {Element} params.loadingContainer
	 * @param {string} params.apiUrl
	 * @param {string} params.apiKey
	 */
	constructor({ analysisUrl, loadingContainer, apiUrl, apiKey }) {
		this.analysisUrl = analysisUrl;
		this.loadingContainer = loadingContainer;
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;
		this._init();
	}

	async _init() {
		// Get "url" param from url
		//const urlParams = new URLSearchParams(window.location.search);
		//this.analysisUrl = urlParams.get("url");
		if (!this.analysisUrl) {
			console.error("No url");
			// TODO : redirect to error page
			//window.location = `${window.location.origin}/`;
		}

		// Fill dom with url
		loaderLayoutService.url = this.analysisUrl;
		loaderLayoutService.visible = true;

		// Fetch api to analyze url and get result
		const analysisResultData = await this._fetchPost(
			{ url: this.analysisUrl, width: 1920, height: 1080 },
			this.apiUrl,
			this.apiKey
		);

		//this._registerResultLocalStorage(analysisResultData);
		resultCacheService.add(analysisResultData);

		this._redirectToResultPage(analysisResultData.id);
	}

	/**
	 * Redirect to result page with analysis result as params
	 * @param {string} analysisId - result analysis id
	 */
	_redirectToResultPage(analysisId) {
		// TODO: old url params
		// - get post request and pass it to url params
		// const resultUrlParams = new URLSearchParams();
		// Object.keys(analysisResultData).forEach((key) => {
		// 	resultUrlParams.append(key, analysisResultData[key]);
		// });

		// TODO: get lang relative url
		window.location = `${window.location.origin}/resultat/?id=${analysisId}`;
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
			// TODO: redirect to error page

			// redirect to error page with response status
			//window.location = `${window.location.origin}/erreur/?status=${response.status}`;

			throw new Error(message);
		}

		return await response.json();
	}

	set isLoaderVisible(value) {
		this.loadingContainer.style.visibility = value ? "visible" : "hidden";
		this.loadingContainer.style.opacity = value ? "1" : "0";
	}
}
export default SiteAnalysis;
