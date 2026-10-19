import type { resultTextData } from '../../config/result-text';

export type ResultRelativeTextData = (typeof resultTextData)[keyof typeof resultTextData];

export {};
