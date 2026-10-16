import { beforeEach, describe, expect, it, vi } from 'vitest';
import ResultCacheService, { RESULTS_LOCAL_STORAGE_KEY } from './ResultCacheService';
import type { AnalysisResult } from '../types/api';

function sampleResult(id: string, url = 'https://example.com'): AnalysisResult {
	return { id, url, score: 80, grade: 'A' };
}

describe('ResultCacheService', () => {
	beforeEach(() => {
		localStorage.clear();
		ResultCacheService.results.length = 0;
		for (const key of Object.keys(ResultCacheService.results)) {
			delete ResultCacheService.results[key as keyof typeof ResultCacheService.results];
		}
		vi.restoreAllMocks();
	});

	it('returns undefined when cache is empty', () => {
		expect(ResultCacheService.get('missing')).toBeUndefined();
		expect(ResultCacheService.getLast()).toBeUndefined();
	});

	it('adds a result and retrieves it by id', () => {
		const result = sampleResult('id-1');
		ResultCacheService.add(result);

		const stored = JSON.parse(
			localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY)!,
		) as AnalysisResult[];
		expect(stored).toHaveLength(1);
		expect(stored[0]?.id).toBe('id-1');

		// Reload in-memory from storage path used by get()
		ResultCacheService.results.length = 0;
		expect(ResultCacheService.get('id-1')).toEqual(result);
	});

	it('does not duplicate the same id', () => {
		const result = sampleResult('id-1');
		ResultCacheService.add(result);
		ResultCacheService.add({ ...result, score: 10 });

		const stored = JSON.parse(
			localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY)!,
		) as AnalysisResult[];
		expect(stored).toHaveLength(1);
		expect(stored[0]?.score).toBe(80);
	});

	it('ignores empty payloads', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		ResultCacheService.add(null);
		ResultCacheService.add(undefined);
		expect(localStorage.getItem(RESULTS_LOCAL_STORAGE_KEY)).toBeNull();
		expect(warn).toHaveBeenCalled();
	});

	it('returns last result from in-memory list when populated', () => {
		const a = sampleResult('a');
		const b = sampleResult('b');
		ResultCacheService.results.push(a, b);
		expect(ResultCacheService.getLast()).toEqual(b);
	});
});
