export const RESULTS_LOCAL_STORAGE_KEY = "analysisResults";

class ResultCacheService {
	constructor() {
		this.results = this.getLocalStorage() || [];
	}

	get(id) {
		if (this.results[id]) return this.results[id];
		// get results list from local storage RESULTS_LOCAL_STORAGE_KEY
		const results = this.getLocalStorage();
		if (!(results && results[0])) {
			console.info("No results in local storage");
			return;
		}
		// find result from results list with id
		const result = results.find((result) => result.id === id);
		if (!result) {
			console.info("No result found in local storage from id");
			return;
		}

		return result;
	}

	getLast() {
		return this.results[this.results.length - 1];
	}

	add(analysisResultData) {
		if (!analysisResultData) {
			console.warn("Result data is empty");
			return;
		}
		// get item analysisResults from localStorage
		const analysisResults = JSON.parse(localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY));
		if (!analysisResults) {
			// if no item analysisResults in localStorage, create it
			localStorage.setItem(RESULTS_LOCAL_STORAGE_KEY, JSON.stringify([analysisResultData]));
		} else {
			// if item analysisResults in localStorage, add new analysisResultData to it
			// check if analysisResultData already exist in localStorage with id
			const analysisResultDataExist = analysisResults.find((analysisResult) => {
				return analysisResult.id === analysisResultData.id;
			});
			if (!analysisResultDataExist) {
				analysisResults.push(analysisResultData);
				localStorage.setItem(RESULTS_LOCAL_STORAGE_KEY, JSON.stringify(analysisResults));
				this.results[analysisResultData.id] = analysisResultData;
			}
		}
	}

	getLocalStorage() {
		return JSON.parse(localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY));
	}
}

const ResultCacheServiceObj = new ResultCacheService();
export default ResultCacheServiceObj;
