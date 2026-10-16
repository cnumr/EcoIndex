import { beforeEach, describe, expect, it, vi } from 'vitest';

const openPendingAnalysis = vi.fn();
const openErrorMessage = vi.fn();
const openAnalysisRetrieval = vi.fn();
const openQuotaExceeded = vi.fn();
const close = vi.fn();
const updateQueueStatus = vi.fn();

vi.mock('../components/EcoIndexDialog', () => ({
	default: {
		openPendingAnalysis,
		openErrorMessage,
		openAnalysisRetrieval,
		openQuotaExceeded,
		close,
		updateQueueStatus,
	},
}));

const newAnalysisTaskByURL = vi.fn();
const fetchAnalysisTaskById = vi.fn();
const fetchAnalysisById = vi.fn();
const fetchAnalysisScreenshotUrlById = vi.fn();
const fetchAnalysisRequestsById = vi.fn();
const fetchAnalysisBestPracticesById = vi.fn();

vi.mock('./ApiService', () => ({
	default: {
		newAnalysisTaskByURL,
		fetchAnalysisTaskById,
		fetchAnalysisById,
		fetchAnalysisScreenshotUrlById,
		fetchAnalysisRequestsById,
		fetchAnalysisBestPracticesById,
	},
}));

vi.mock('./ResultCacheService', () => ({
	default: {
		get: vi.fn(),
		add: vi.fn(),
	},
}));

vi.mock('../helpers/routing', () => ({
	redirectToResults: vi.fn(),
}));

describe('AnalysisService', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('rejects invalid URLs', async () => {
		const { default: AnalysisService } = await import('./AnalysisService');
		await expect(AnalysisService.launchAnalysisByURL('not-a-url', '/resultat')).rejects.toThrow(
			'INVALID_URL',
		);
	});

	it('prefixes bare domains with https and starts analysis', async () => {
		newAnalysisTaskByURL.mockResolvedValue('task-1');
		fetchAnalysisTaskById.mockResolvedValue({
			status: 'SUCCESS',
			ecoindex_result: {
				status: 'SUCCESS',
				detail: { id: 'task-1', url: 'https://example.com' },
			},
		});

		const { redirectToResults } = await import('../helpers/routing');
		const { default: ResultCacheService } = await import('./ResultCacheService');
		const { default: AnalysisService } = await import('./AnalysisService');

		await AnalysisService.launchAnalysisByURL('example.com', '/resultat');

		expect(openPendingAnalysis).toHaveBeenCalledWith('https://example.com');
		expect(newAnalysisTaskByURL).toHaveBeenCalledWith('https://example.com');

		await vi.waitFor(() => {
			expect(ResultCacheService.add).toHaveBeenCalled();
			expect(redirectToResults).toHaveBeenCalledWith('task-1', '/resultat');
		});
	});

	it('delegates screenshot URL building', async () => {
		fetchAnalysisScreenshotUrlById.mockReturnValue('https://api/screenshot');
		const { default: AnalysisService } = await import('./AnalysisService');
		expect(AnalysisService.fetchAnalysisScreenshotUrlById('x')).toBe('https://api/screenshot');
	});

	it('returns cached analysis when present', async () => {
		const cached = { id: 'cached', url: 'https://example.com' };
		const { default: ResultCacheService } = await import('./ResultCacheService');
		vi.mocked(ResultCacheService.get).mockReturnValue(cached);

		const { default: AnalysisService } = await import('./AnalysisService');
		await expect(AnalysisService.fetchAnalysisById('cached', '/resultat')).resolves.toEqual(
			cached,
		);
		expect(fetchAnalysisById).not.toHaveBeenCalled();
	});
});
