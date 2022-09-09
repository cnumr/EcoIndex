import ApiService from "./ApiService";
import { isValidHttpUrl } from "../helpers/urlUtils";
import EcoIndexDialog from "../components/EcoIndexDialog";
import ResultCacheService from "./ResultCacheService";
import { redirectToResults } from "../helpers/routing";

class AnalysisService {
	async launchAnalysisByURL(url) {
		// If the given url parameter is only a domain name,
		// let's transform it to a full URL by prepending "https://" to it
		const domainNameRegex =
			/^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/;
		if (!url.match(/^(http|https):\/\//) && domainNameRegex.test(url)) {
			url = `https://${url}`;
		}

		// Now check if it is a valid URL
		if (!isValidHttpUrl(url)) {
			throw new Error("INVALID_URL");
		}

		// If URL is valid, launch the EcoIndex anylysis
		this.#launchAnalysis(ApiService.ANALYSIS_BY_URL, { url });
	}

	async launchAnalysisById(id) {
		this.#launchAnalysis(ApiService.ANALYSIS_BY_ID, { id });
	}

	/**
	 * Launch an analysis of a URL
	 *
	 * @param {type} type e.g. ApiService.ANALYSIS_BY_URL or ApiService.ANALYSIS_BY_ID
	 * @param {Object} options object (with url or id)
	 * @param {string} [options.url] URL The URL to analyse
	 * @param {string} [options.id] Id of a previous analysis
	 */
	async #launchAnalysis(type, options) {
		EcoIndexDialog.openPendingAnalysis(options.url);
		let apiResult;
		try {
			await ApiService.newAnalysis(type, options).then((result) => {
				apiResult = result;
				ResultCacheService.add(result);
				redirectToResults(result.id);
			});
		} catch (e) {
			if (e.code == DOMException.ABORT_ERR) {
				return;
			}
			const response = e.response;
			if (response) {
				const json = await response.json();
				EcoIndexDialog.openErrorMessage(response.status, json.detail);
			} else {
				EcoIndexDialog.openErrorMessage();
			}
		}
		return apiResult;
	}
}

const AnalysisServiceObj = new AnalysisService();
export default AnalysisServiceObj;
