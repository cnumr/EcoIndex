import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../config/api';

const jsonMock = vi.fn();
const kyMock = vi.fn((_input?: unknown, _options?: unknown) => ({ json: jsonMock }));

vi.mock('ky', () => ({
	default: Object.assign((input: unknown, options?: unknown) => kyMock(input, options), {
		create: vi.fn(),
		extend: vi.fn(),
	}),
}));

describe('ApiService', () => {
	beforeEach(() => {
		vi.resetModules();
		jsonMock.mockReset();
		kyMock.mockReset();
		kyMock.mockImplementation(() => ({ json: jsonMock }));
	});

	it('creates an analysis task with browser viewport', async () => {
		jsonMock.mockResolvedValue('task-1');
		const { default: ApiService } = await import('./ApiService');

		await expect(ApiService.newAnalysisTaskByURL('https://example.com')).resolves.toBe(
			'task-1',
		);

		expect(kyMock).toHaveBeenCalledWith(
			'tasks/ecoindexes/',
			expect.objectContaining({
				method: 'post',
				prefix: api.baseUrl,
				json: {
					web_page: {
						width: api.browserWidth,
						height: api.browserHeight,
						url: 'https://example.com',
					},
				},
			}),
		);
	});

	it('builds screenshot URL', async () => {
		const { default: ApiService } = await import('./ApiService');
		expect(ApiService.fetchAnalysisScreenshotUrlById('abc')).toBe(
			`${api.baseUrl}ecoindexes/abc/screenshot`,
		);
	});

	it('fetches analysis by id', async () => {
		jsonMock.mockResolvedValue({ id: 'abc', url: 'https://example.com' });
		const { default: ApiService } = await import('./ApiService');

		await expect(ApiService.fetchAnalysisById('abc')).resolves.toEqual({
			id: 'abc',
			url: 'https://example.com',
		});
		expect(kyMock).toHaveBeenCalledWith(
			'ecoindexes/abc',
			expect.objectContaining({ method: 'get', prefix: api.baseUrl }),
		);
	});

	it('returns null when requests endpoint fails', async () => {
		jsonMock.mockRejectedValue(new Error('network'));
		const { default: ApiService } = await import('./ApiService');
		await expect(ApiService.fetchAnalysisRequestsById('abc')).resolves.toBeNull();
	});

	it('returns null when best-practices endpoint fails', async () => {
		jsonMock.mockRejectedValue(new Error('network'));
		const { default: ApiService } = await import('./ApiService');
		await expect(ApiService.fetchAnalysisBestPracticesById('abc')).resolves.toBeNull();
	});

	it('aborts only when a controller exists', async () => {
		const { default: ApiService } = await import('./ApiService');
		await expect(ApiService.abortAnalysis()).resolves.toBe(false);

		jsonMock.mockResolvedValue('task-1');
		await ApiService.newAnalysisTaskByURL('https://example.com');
		await expect(ApiService.abortAnalysis()).resolves.toBe(true);
	});
});
