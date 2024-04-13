import ApiService from "./ApiService";
import { isValidHttpUrl } from "../helpers/urlUtils";
import EcoIndexDialog from "../components/EcoIndexDialog";
import ResultCacheService from "./ResultCacheService";
import { redirectToResults } from "../helpers/routing";

class AnalysisService {
	async launchAnalysisByURL(url, resultUrlPrefix) {
		// If the given url parameter is only a domain name,
		// let's transform it to a full URL by prepending "https://" to it
		const domainNameRegex =
			/^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
		if (!url.match(/^(http|https):\/\//) && domainNameRegex.test(url)) {
			url = `https://${url}`;
		}

		// Now check if it is a valid URL
		if (!isValidHttpUrl(url)) {
			throw new Error("INVALID_URL");
		}

		try {
			EcoIndexDialog.openPendingAnalysis(url);

			const taskId = await ApiService.newAnalysisTaskByURL(url)

			const taskResult = await ApiService.fetchAnalysisTaskById(taskId)
			
			const ecoindex = taskResult.ecoindex_result;

			if (taskResult.status === "SUCCESS" && ecoindex.status === "SUCCESS") {
				ResultCacheService.add(ecoindex.detail);
				redirectToResults(taskId, resultUrlPrefix);
			}

			if (taskResult.status === "SUCCESS" && ecoindex.status === "FAILURE") {
				const e = taskResult.ecoindex_result.error;
				EcoIndexDialog.openErrorMessage(e.status_code, e);
			}

			if (taskResult.status === "FAILURE") {
				EcoIndexDialog.openErrorMessage(599, taskResult.task_error);
			}
		} catch (e) {
			this.#handleError(e);
		}
	}

	/**
	 * @param {string} id 
	 * @returns {string}
	 */
	getAnalysisScreenshotUrlById(id) {
		return ApiService.getAnalysisScreenshotUrlById(id)
	}

	/**
	 * 
	 * @param {string} id
	 * @param {string} resultPagePrefix
	 */
	async fetchAnalysisById(id, resultPagePrefix) {
		// Check local storage: if analysis results object exist returns it
		let apiResult = ResultCacheService.get(id);
		if (apiResult) {
			return apiResult;
		}

		// Otherwise fetch from api
		try {
			EcoIndexDialog.openAnalysisRetrieval();
			apiResult = await ApiService.fetchAnalysisById(id)
			ResultCacheService.add(apiResult);
			redirectToResults(apiResult.id, resultPagePrefix);
			EcoIndexDialog.close();
		} catch (e) {
			this.#handleError(e);
			return null;
		}
		return apiResult;
	}

	async #handleError(e) {
		// Non HTTP errors (TODO improve test)
		if (e.name !== "HTTPError" && e.name !== "TypeError" && e.name !== "TimeoutError") {
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
