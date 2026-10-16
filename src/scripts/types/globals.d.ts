import type { resultTextData } from '../../config/result-text';

export type ResultRelativeTextData = (typeof resultTextData)['fr'];

declare global {
	interface Window {
		__i18n?: Record<string, string>;
		__locale?: string;
		__siteData?: {
			resultRelativeTextData?: ResultRelativeTextData;
		};
	}

	/** Injected on the result page via window.__siteData / legacy global. */
	var resultRelativeTextData: ResultRelativeTextData | undefined;
}

export {};
