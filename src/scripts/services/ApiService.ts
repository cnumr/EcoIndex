import ky, { type Options as KyOptions, type AfterResponseHook } from 'ky';
import { api } from '../../config/api';
import type { AnalysisResult, AnalysisTaskResult, QueueTaskPayload } from '../types/api';

type FetchApiOptions = KyOptions & {
	abort?: boolean;
};

class ApiService {
	#controller: AbortController | null = null;

	async newAnalysisTaskByURL(url: string): Promise<string> {
		const options: FetchApiOptions = {
			method: 'post',
			json: {
				web_page: {
					width: api.browserWidth,
					height: api.browserHeight,
					url,
				},
				include_requests_detail: true,
				include_best_practices: true,
			},
		};

		return this.#fetchApi<string>('tasks/ecoindexes/', options);
	}

	async fetchAnalysisTaskById(
		id: string,
		onProgress?: (task: QueueTaskPayload) => void,
	): Promise<AnalysisTaskResult> {
		const afterResponse: AfterResponseHook = async ({ response }) => {
			if (response.status === 425 && typeof onProgress === 'function') {
				try {
					onProgress((await response.clone().json()) as QueueTaskPayload);
				} catch {
					// Ignore unreadable intermediate payloads
				}
			}
			return response;
		};

		const options: FetchApiOptions = {
			method: 'get',
			retry: {
				limit: 300,
				statusCodes: [425],
				backoffLimit: 2000,
			},
			hooks: {
				afterResponse: [afterResponse],
			},
		};

		return this.#fetchApi<AnalysisTaskResult>('tasks/ecoindexes/' + id, options);
	}

	fetchAnalysisScreenshotUrlById(id: string): string {
		return `${api.baseUrl}ecoindexes/${id}/screenshot`;
	}

	async fetchAnalysisById(id: string): Promise<AnalysisResult> {
		return this.#fetchApi<AnalysisResult>('ecoindexes/' + id, { method: 'get' });
	}

	async fetchAnalysisRequestsById(id: string): Promise<Record<string, unknown> | null> {
		try {
			return await this.#fetchApi<Record<string, unknown>>('ecoindexes/' + id + '/requests', {
				method: 'get',
				abort: false,
			});
		} catch {
			return null;
		}
	}

	async fetchAnalysisBestPracticesById(id: string): Promise<Record<string, unknown> | null> {
		try {
			return await this.#fetchApi<Record<string, unknown>>(
				'ecoindexes/' + id + '/best-practices',
				{
					method: 'get',
					abort: false,
				},
			);
		} catch {
			return null;
		}
	}

	async abortAnalysis(): Promise<boolean> {
		if (!this.#controller) {
			return false;
		}
		this.#controller.abort();
		return true;
	}

	async #fetchApi<T>(slug: string, options: FetchApiOptions): Promise<T> {
		const { abort = true, ...kyOptions } = options;

		let signal: AbortSignal | undefined;
		if (abort) {
			void this.abortAnalysis();
			const controller = (this.#controller = new AbortController());
			signal = controller.signal;
		}

		return ky(slug, {
			...kyOptions,
			prefix: api.baseUrl,
			timeout: false,
			...(signal ? { signal } : {}),
			headers: {
				'content-type': 'application/json',
			},
			redirect: 'follow',
		}).json<T>();
	}
}

const ApiServiceObj = new ApiService();
export default ApiServiceObj;
