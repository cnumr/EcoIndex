import ApiService from './ApiService';
import { isValidHttpUrl } from '../helpers/urlUtils';
import EcoIndexDialog from '../components/EcoIndexDialog';
import ResultCacheService from './ResultCacheService';
import { redirectToResults } from '../helpers/routing';
import type { AnalysisResult } from '../types/api';

type HttpLikeError = Error & {
	response?: Response;
	code?: number;
};

class AnalysisService {
	async launchAnalysisByURL(url: string, resultUrlPrefix: string): Promise<void> {
		const domainNameRegex =
			/^(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
		if (!url.match(/^(http|https):\/\//) && domainNameRegex.test(url)) {
			url = `https://${url}`;
		}

		if (!isValidHttpUrl(url)) {
			throw new Error('INVALID_URL');
		}

		try {
			EcoIndexDialog.openPendingAnalysis(url);

			void ApiService.newAnalysisTaskByURL(url).then(
				(taskId) => {
					void ApiService.fetchAnalysisTaskById(taskId, (task) => {
						EcoIndexDialog.updateQueueStatus(task);
					}).then(
						(taskResult) => {
							const ecoindex = taskResult.ecoindex_result;

							if (taskResult.status === 'SUCCESS' && ecoindex?.status === 'SUCCESS') {
								if (ecoindex.detail) {
									ResultCacheService.add(ecoindex.detail);
								}
								redirectToResults(taskId, resultUrlPrefix);
							}

							if (taskResult.status === 'SUCCESS' && ecoindex?.status === 'FAILURE') {
								const e = ecoindex.error;
								EcoIndexDialog.openErrorMessage(e?.status_code, e);
							}

							if (taskResult.status === 'FAILURE') {
								EcoIndexDialog.openErrorMessage(599, taskResult.task_error);
							}
						},
						(e) => {
							void this.#handleError(e, resultUrlPrefix);
						},
					);
				},
				(e) => {
					void this.#handleError(e, resultUrlPrefix);
				},
			);
		} catch (e) {
			void this.#handleError(e, resultUrlPrefix);
		}
	}

	fetchAnalysisScreenshotUrlById(id: string): string {
		return ApiService.fetchAnalysisScreenshotUrlById(id);
	}

	async fetchAnalysisRequestsById(id: string): Promise<Record<string, unknown> | null> {
		try {
			return await ApiService.fetchAnalysisRequestsById(id);
		} catch {
			return null;
		}
	}

	async fetchAnalysisBestPracticesById(id: string): Promise<Record<string, unknown> | null> {
		try {
			return await ApiService.fetchAnalysisBestPracticesById(id);
		} catch {
			return null;
		}
	}

	async fetchAnalysisById(
		id: string,
		resultPagePrefix: string,
	): Promise<AnalysisResult | null | undefined> {
		let apiResult: AnalysisResult | null | undefined = ResultCacheService.get(id);
		if (apiResult) {
			return apiResult;
		}

		try {
			EcoIndexDialog.openAnalysisRetrieval();
			await ApiService.fetchAnalysisById(id).then(
				(result) => {
					apiResult = result;
					ResultCacheService.add(result);
					redirectToResults(result.id, resultPagePrefix);
					EcoIndexDialog.close();
				},
				(e) => {
					void this.#handleError(e, resultPagePrefix);
				},
			);
		} catch (e) {
			void this.#handleError(e, resultPagePrefix);
			return null;
		}
		return apiResult;
	}

	async #handleError(e: unknown, resultUrlPrefix?: string): Promise<void> {
		if (!(e instanceof Error)) {
			throw e;
		}

		if (e.name !== 'HTTPError' && e.name !== 'TypeError' && e.name !== 'TimeoutError') {
			throw e;
		}

		const err = e as HttpLikeError;
		if (err.code == DOMException.ABORT_ERR) {
			return;
		}

		const response = err.response;
		if (response) {
			const json = (await response.json()) as {
				detail?: Record<string, unknown> & { latest_result?: AnalysisResult };
			};
			const detail = json.detail;
			const latestResult = detail?.latest_result;

			if (response.status === 429 && latestResult?.id && resultUrlPrefix) {
				EcoIndexDialog.openQuotaExceeded(detail ?? {}, () => {
					ResultCacheService.add(latestResult);
					redirectToResults(latestResult.id, resultUrlPrefix);
				});
				return;
			}

			EcoIndexDialog.openErrorMessage(response.status, detail);
		} else {
			EcoIndexDialog.openErrorMessage();
		}
	}
}

const AnalysisServiceObj = new AnalysisService();
export default AnalysisServiceObj;
