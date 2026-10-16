import type { AnalysisResult } from '../types/api';

export const RESULTS_LOCAL_STORAGE_KEY = 'analysisResults';

class ResultCacheService {
	results: AnalysisResult[] & Record<string, AnalysisResult>;

	constructor() {
		this.results = (this.getLocalStorage() || []) as AnalysisResult[] &
			Record<string, AnalysisResult>;
	}

	get(id: string): AnalysisResult | undefined {
		if (this.results[id]) return this.results[id];
		const results = this.getLocalStorage();
		if (!(results && results[0])) {
			console.info('No results in local storage');
			return;
		}
		const result = results.find((item) => item.id === id);
		if (!result) {
			console.info('No result found in local storage from id');
			return;
		}

		return result;
	}

	getLast(): AnalysisResult | undefined {
		return this.results[this.results.length - 1];
	}

	add(analysisResultData: AnalysisResult | null | undefined): void {
		if (!analysisResultData) {
			console.warn('Result data is empty');
			return;
		}
		let analysisResults = JSON.parse(
			localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY) ?? 'null',
		) as AnalysisResult[] | null;
		if (!analysisResults) {
			localStorage.setItem(RESULTS_LOCAL_STORAGE_KEY, JSON.stringify([analysisResultData]));
		} else {
			let analysisResultDataExist: AnalysisResult | false | undefined = false;
			try {
				analysisResultDataExist =
					analysisResults.find((analysisResult) => {
						return analysisResult.id === analysisResultData.id;
					}) ?? false;
			} catch {
				console.warn('Local storage is corrupted, reset it');
				localStorage.setItem(RESULTS_LOCAL_STORAGE_KEY, 'null');
				analysisResults = [];
			} finally {
				if (!analysisResultDataExist) {
					analysisResults.push(analysisResultData);
					localStorage.setItem(
						RESULTS_LOCAL_STORAGE_KEY,
						JSON.stringify(analysisResults),
					);
					this.results[analysisResultData.id] = analysisResultData;
				}
			}
		}
	}

	getLocalStorage(): AnalysisResult[] | null {
		return JSON.parse(localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY) ?? 'null') as
			AnalysisResult[] | null;
	}
}

const ResultCacheServiceObj = new ResultCacheService();
export default ResultCacheServiceObj;
