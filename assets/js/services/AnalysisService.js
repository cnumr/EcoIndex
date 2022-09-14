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
		let apiResult;
		try {
			EcoIndexDialog.openPendingAnalysis(url);
			await ApiService.newAnalysisByURL(url).then((result) => {
				apiResult = result;
				ResultCacheService.add(result);
				redirectToResults(result.id);
				EcoIndexDialog.close();
			});
		} catch (e) {
			this.#handleError(e);
		}
		return apiResult;
	}

	async fetchAnalysisById(id) {
		// Check local storage: if analysis results object exist returns it
		let apiResult = ResultCacheService.get(id);
		if (apiResult) {
			return apiResult;
		}

		// Otherwise fetch from api
		try {
			EcoIndexDialog.openAnalysisRetrieval();
			await ApiService.fetchAnalysisById(id).then((result) => {
				apiResult = result;
				ResultCacheService.add(result);
				redirectToResults(result.id);
				EcoIndexDialog.close();
			});
		} catch (e) {
			this.#handleError(e);
			return null;
		}
		return apiResult;
	}

	async #handleError(e) {
		// Non HTTP errors (TODO improve test)
		if (e.name !== "HTTPError") {
			throw e;
		}
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
}

const AnalysisServiceObj = new AnalysisService();
export default AnalysisServiceObj;
