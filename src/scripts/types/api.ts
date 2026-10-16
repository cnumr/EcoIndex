/** Loose API shapes used by the client (EcoIndex API / BFF). */

export type AnalysisResult = {
	id: string;
	url: string;
	grade?: string;
	score?: number;
	size?: number;
	nodes?: number;
	requests?: number;
	ges?: number;
	water?: number;
	date?: string;
	host?: string;
	width?: number;
	height?: number;
	page_type?: string | null;
	version?: number;
	initial_ranking?: number | string;
	initial_total_results?: number | string;
	[key: string]: unknown;
};

export type AnalysisTaskResult = {
	status: string;
	ecoindex_result?: {
		status: string;
		detail?: AnalysisResult;
		error?: {
			status_code?: number;
			[key: string]: unknown;
		};
	};
	task_error?: unknown;
	[key: string]: unknown;
};

export type QueueTaskPayload = {
	id?: string;
	status?: string;
	[key: string]: unknown;
};
