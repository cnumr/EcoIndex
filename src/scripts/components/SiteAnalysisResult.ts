import { camelize } from '../helpers/stringUtils';
import AnalysisService from '../services/AnalysisService';
import BadgeIntegration from './BadgeIntegration';
import ResultRangeSlider from './ResultRangeSlider';
import RequestDetails, { type RequestsDetailData } from './RequestDetails';
import BestPractices, { type BestPracticesData } from './BestPractices';
import type { ResultRelativeTextData } from '../types/globals';
import type { AnalysisResult } from '../types/api';

type PageResultData = AnalysisResult &
	Record<string, unknown> & {
		grade_title?: string;
		grade_message?: string;
	};

/**
 * Creates a new Site analysis result for interactive dom content
 */
class SiteAnalysisResult {
	el: Element;
	locale: string;
	resultRelativeTextData: ResultRelativeTextData;

	constructor(el: Element, currentLocale: string) {
		this.el = el;
		this.locale = currentLocale;

		this.resultRelativeTextData =
			(typeof window !== 'undefined' && window.__siteData?.resultRelativeTextData) ||
			(typeof resultRelativeTextData !== 'undefined'
				? resultRelativeTextData
				: ({} as ResultRelativeTextData));

		void this._init(currentLocale);
	}

	async _init(currentLocale: string): Promise<void> {
		const urlParams = new URLSearchParams(window.location.search);
		const langSwitchersElements = document.querySelectorAll('.language-switcher a.lang');
		const screenshotImgElement = document.querySelector('.result-screenshot');

		let pageResultData: PageResultData = {} as PageResultData;
		const analysisId = urlParams.get('id');

		if (urlParams.has('url') && urlParams.has('size') && urlParams.has('ges')) {
			for (const [key, value] of urlParams.entries()) {
				pageResultData[key] = value;

				if (key === 'id' && screenshotImgElement instanceof HTMLImageElement) {
					const id = urlParams.get('id');
					if (id) {
						const screenshotUrl = AnalysisService.fetchAnalysisScreenshotUrlById(id);
						screenshotImgElement.setAttribute('src', screenshotUrl);
					}
				}
			}

			langSwitchersElements.forEach((a) => {
				if (!(a instanceof HTMLAnchorElement)) return;
				const href = a.getAttribute('href') + '?' + urlParams.toString();
				a.setAttribute('href', href);
			});
		} else if (urlParams.has('id') && analysisId) {
			pageResultData = (await AnalysisService.fetchAnalysisById(
				analysisId,
				window.location.pathname,
			)) as PageResultData;

			if (screenshotImgElement instanceof HTMLImageElement) {
				const screenshotUrl = AnalysisService.fetchAnalysisScreenshotUrlById(analysisId);
				screenshotImgElement.setAttribute('src', screenshotUrl);
			}

			langSwitchersElements.forEach((a) => {
				if (!(a instanceof HTMLAnchorElement)) return;
				const href = a.getAttribute('href') + '?id=' + analysisId;
				a.setAttribute('href', href);
			});
		} else {
			window.location.href = `${window.location.origin}/erreur/?status=404`;
			console.warn('No url params found for page, no data to show');
			return;
		}

		const sizeNum = Number(pageResultData.size);
		pageResultData.size = Math.round(sizeNum) / 1000;

		const grade = String(pageResultData.grade ?? '');
		pageResultData.grade_title =
			this.resultRelativeTextData.verdictTitles[
				grade as keyof typeof this.resultRelativeTextData.verdictTitles
			];
		pageResultData.grade_message =
			this.resultRelativeTextData.verdictMessages[
				grade as keyof typeof this.resultRelativeTextData.verdictMessages
			];

		const date = new Date(String(pageResultData.date ?? ''));
		pageResultData.date = Intl.DateTimeFormat(currentLocale, {
			dateStyle: 'full',
			timeStyle: 'medium',
		}).format(date);

		pageResultData = {
			...pageResultData,
			...this._getDataResultsParamsBinaryScores(
				pageResultData,
				this.resultRelativeTextData.verdictParameters,
			),
		};

		pageResultData = {
			...pageResultData,
			...this._getDataResultsVerdicts(
				pageResultData,
				this.resultRelativeTextData.verdictParameters,
			),
		};

		this._setDomContent(pageResultData, 'data-int', 'data-int-attr');

		this._updateUrl(String(pageResultData.url ?? ''));
		this._updateBadgeIntegration(String(pageResultData.url ?? ''));
		this._updateNoteChart(grade);
		this._updateFootprintResultsFromSelect();
		this._updatetResultRangeSliders(pageResultData);
		await this._loadRequestDetails(analysisId, String(pageResultData.host ?? ''));
		await this._loadBestPractices(analysisId);
	}

	async _loadRequestDetails(analysisId: string | null, host: string): Promise<void> {
		if (!analysisId) return;

		const requestDetails = await AnalysisService.fetchAnalysisRequestsById(analysisId);
		const data = requestDetails as RequestsDetailData | null;
		if (!data?.items?.length) return;

		const content = this._insertResultPanel(
			'request-details',
			'wg-result-requests wgi-result-requests-request-details section-theme-dark',
		);
		if (!content) return;

		new RequestDetails(content, data, { host, locale: this.locale });
	}

	async _loadBestPractices(analysisId: string | null): Promise<void> {
		if (!analysisId) return;

		const bestPractices = await AnalysisService.fetchAnalysisBestPracticesById(analysisId);
		const data = bestPractices as BestPracticesData | null;
		if (!data?.results?.length) return;

		const content = this._insertResultPanel(
			'best-practices',
			'wg-result-best-practices wgi-result-best-practices-best-practices section-theme-dark',
			'#request-details',
		);
		if (!content) return;

		new BestPractices(content, data, { locale: this.locale });
	}

	_insertResultPanel(
		id: string,
		className: string,
		preferAfterSelector?: string,
	): HTMLElement | null {
		const preferredSibling = preferAfterSelector
			? this.el.querySelector(preferAfterSelector)
			: null;
		const detailsWidget = this.el.querySelector('#details');
		const infoContainer = this.el.querySelector('.info-container');
		if (!preferredSibling && !detailsWidget && !infoContainer) return null;

		const widget = document.createElement('div');
		widget.id = id;
		widget.className = className;
		const inner = document.createElement('section');
		inner.className = 'center-l box-l --s2p0';
		const content = document.createElement('div');
		inner.appendChild(content);
		widget.appendChild(inner);

		if (preferredSibling) {
			preferredSibling.after(widget);
		} else if (detailsWidget) {
			detailsWidget.after(widget);
		} else if (infoContainer) {
			infoContainer.appendChild(widget);
		}

		return content;
	}

	_getDataResultsParamsBinaryScores(
		resultData: PageResultData,
		resultParamsVerdicts: ResultRelativeTextData['verdictParameters'],
	): Record<string, number> {
		return Object.keys(resultParamsVerdicts).reduce<Record<string, number>>(
			(resultTypeScores, key) => {
				const paramsScoreTarget =
					this.resultRelativeTextData.resultParametersMinMaxValues[
						key as keyof typeof this.resultRelativeTextData.resultParametersMinMaxValues
					].target;
				const raw = Number(resultData[key]);
				const resultParamBinaryScore = raw > paramsScoreTarget ? 1 : 0;
				return { ...resultTypeScores, [`${key}_binary_score`]: resultParamBinaryScore };
			},
			{},
		);
	}

	_getDataResultsVerdicts(
		resultData: PageResultData,
		resultParamsVerdicts: ResultRelativeTextData['verdictParameters'],
	): Record<string, string> {
		return Object.entries(resultParamsVerdicts).reduce<Record<string, string>>(
			(verdictsFromScore, [key, verdicts]) => {
				const binaryScore = Number(resultData[`${key}_binary_score`]);
				return {
					...verdictsFromScore,
					[`${key}_verdict`]: verdicts[binaryScore] ?? '',
				};
			},
			{},
		);
	}

	_setDomContent(data: PageResultData, contentAttrKey: string, attrValueKey: string): void {
		const dataIntEls = this.el.querySelectorAll(`[${contentAttrKey}]`);
		const dataIntAttrEls = this.el.querySelectorAll(`[${attrValueKey}]`);

		dataIntEls.forEach((dataIntEl) => {
			if (!(dataIntEl instanceof HTMLElement) || !dataIntEl.dataset.int) return;
			const elementDataValue = this._getDataValueFrom(data, dataIntEl.dataset.int);
			if (!elementDataValue || elementDataValue.length === 0) return;
			dataIntEl.textContent = this._getDataValueFrom(data, dataIntEl.dataset.int);
		});

		dataIntAttrEls.forEach((dataIntEl) => {
			if (!(dataIntEl instanceof HTMLElement)) return;
			const dataAttr = dataIntEl.dataset.intAttr;
			if (!dataAttr) return;
			const camelCaseDataAttr = camelize(dataAttr);
			const updatedCaseAttr =
				camelCaseDataAttr.charAt(0).toUpperCase() + camelCaseDataAttr.slice(1);
			dataIntEl.dataset['int' + updatedCaseAttr + 'Value'] = this._getDataValueFrom(
				data,
				dataAttr,
			);
		});
	}

	_getValidDateString(value: unknown): string | undefined {
		const date = new Date(String(value));
		if (isNaN(date.getTime())) return;
		if (date.getTime() > new Date().getTime() || date.getTime() < new Date(2004, 0).getTime())
			return;
		return date.toLocaleString().split(',')[0];
	}

	_getDataValueFrom(data: PageResultData, key: string): string {
		const elementValue = data[key];
		let formatedValue = this._getValidDateString(elementValue);
		formatedValue = formatedValue ? formatedValue : String(elementValue ?? '');
		return formatedValue ? formatedValue : String(elementValue ?? '');
	}

	_updateNoteChart(note: string): void {
		const chartEl = this.el.querySelector(`.notation-level-chart[data-grade-result="${note}"]`);
		chartEl?.classList.add('--active');
	}

	_updateFootprintResultsFromSelect(): void {
		const selectFactorEl = this.el.querySelector('.js-footprint-factor-select select');
		const footprintResultEls = this.el.querySelectorAll('.footprint-result');

		if (!(selectFactorEl instanceof HTMLSelectElement) || footprintResultEls.length === 0)
			return;
		const footprintResultsBaseValues = [...footprintResultEls].map((el) => +el.textContent!);
		const factor = +selectFactorEl.value;

		this._updateFootprintResultsFrom(
			[...footprintResultEls].filter((el): el is HTMLElement => el instanceof HTMLElement),
			footprintResultsBaseValues,
			factor,
		);
		selectFactorEl.addEventListener('change', (e) => {
			const target = e.target;
			if (!(target instanceof HTMLSelectElement)) return;
			this._updateFootprintResultsFrom(
				[...footprintResultEls].filter(
					(el): el is HTMLElement => el instanceof HTMLElement,
				),
				footprintResultsBaseValues,
				+target.value,
			);
		});
	}

	_updateFootprintResultsFrom(
		resultElements: HTMLElement[],
		footprintResultsBaseValues: number[],
		inputFactor: number,
	): void {
		const unitsData = this.resultRelativeTextData.footprintUnitsData;
		resultElements.forEach((el, index) => {
			const footprintType = el.dataset.int as keyof typeof unitsData;
			const rawValue = +footprintResultsBaseValues[index];
			const factorisedValue = rawValue * inputFactor;
			const unitInfo = unitsData[footprintType];
			const unitConvertedValue =
				factorisedValue / (factorisedValue >= unitInfo.factor ? unitInfo.factor : 1);
			el.textContent = (Math.round(unitConvertedValue * 100) / 100).toString();
			el.dataset.unit =
				factorisedValue >= unitInfo.factor ? unitInfo.order[1] : unitInfo.order[0];
		});
	}

	_updatetResultRangeSliders(data: PageResultData): void {
		const sliderEls = document.querySelectorAll('.js-rlr');
		sliderEls.forEach((sliderEl) => new ResultRangeSlider({ sliderEl, data }));
	}

	_updateUrl(url: string): void {
		const urlElement = this.el.querySelector('.result-url');
		if (!(urlElement instanceof HTMLElement)) return;

		urlElement.setAttribute('value', url);
	}

	_updateBadgeIntegration(url: string): void {
		const badgeEl = this.el.querySelector('.js-badge-integration');
		if (!(badgeEl instanceof HTMLElement)) return;
		new BadgeIntegration(badgeEl).setUrl(url);
	}
}

export default SiteAnalysisResult;
