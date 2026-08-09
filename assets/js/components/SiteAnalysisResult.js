import { camelize } from "../helpers/stringUtils";
import { getUrlHostName } from "../helpers/urlUtils";
import AnalysisService from "../services/AnalysisService";
import ResultRangeSlider from "./ResultRangeSlider";

/**
 * @typedef ResultRelativeTextData
 * @type {object}
 * @property {Object.<string, string>} verdictTitles - Verdict titles relative to grade
 * @property {Object.<string, string>} verdictMessages - Verdict messages relative to grade
 * @property {Array.<Array.<string>>} verdictParameters - Verdict parameters relative to good/bad score
 */

/**
 * Creates a new Site analysis result for interactive dom content
 * @class
 */
class SiteAnalysisResult {
	/**
	 * Create a site analysis result page with updated dom from api data
	 * @param {Element} el
	 * @param {string} currentLocale
	 */
	constructor(el, currentLocale) {
		this.el = el;

		/** @type {ResultRelativeTextData} */
		this.resultRelativeTextData = resultRelativeTextData;

		this._init(currentLocale);
	}

	/**
	 * Init
	 *
	 * Checks if an analysis results object exists. If yes, use it.
	 * Otherwise, fetches data from server.
	 * 
	 * @param {string} currentLocale
	 */
	async _init(currentLocale) {
		const urlParams = new URLSearchParams(window.location.search);
		const langSwitchersElements = document.querySelectorAll(".language-switcher a.lang")
		const screenshotImgElement = document.querySelector(".result-screenshot")

		let pageResultData = {};

		// get params from url
		// NOTE : url params example to test : "?width=1920&height=1080&url=https%3A%2F%2Fwww.leroymerlin.fr&grade=E&score=34&ges=2.32&water=3.48&date=2021-11-17T12%3A40%3A18.575464&page_type=null&id=2d43d4c9-6ad0-4dc8-a769-09b3b2249bf3&version=1&size=1119.963&nodes=1286&requests=65&host=www.leroymerlin.fr"
		if (urlParams.has("url") && urlParams.has("size") && urlParams.has("ges")) {
			for (const [key, value] of urlParams.entries()) {
				pageResultData[key] = value;

				if (key === "id") {
					const screenshotUrl = AnalysisService.getAnalysisScreenshotUrlById(urlParams.get("id"))
					screenshotImgElement.setAttribute("src", screenshotUrl)
				}
			}

			// update the link URL of every lang switcher
			langSwitchersElements.forEach((a) => {
				const href = a.getAttribute("href") + "?" + urlParams.toString()
				a.setAttribute("href", href)
			})

			// else fetch analysis result from id
			// NOTE : url params example to test : "?id=ec839aca-7c12-42e8-8541-5f7f94c36b7f
		} else if (urlParams.has("id")) {
			const analysisId = urlParams.get("id");

			// window.location.pathname is something like /resultat (in french) or /en/result (in english)
			pageResultData = await AnalysisService.fetchAnalysisById(analysisId, window.location.pathname)

			const screenshotUrl = AnalysisService.getAnalysisScreenshotUrlById(analysisId)
			screenshotImgElement.setAttribute("src", screenshotUrl)

			// update the link URL of every lang switcher
			langSwitchersElements.forEach((a) => {
				const href = a.getAttribute("href") + "?id=" + analysisId
				a.setAttribute("href", href)
			})
		} else {
			// TODO: redirect to error page or show dialog ?
			window.location = `${window.location.origin}/erreur/?status=404`;
			return console.warn("No url params found for page, no data to show");
		}

		// update page size from ko to mo
		pageResultData.size = Math.round(pageResultData.size) / 1000;

		// set page result title and message
		pageResultData.grade_title = this.resultRelativeTextData.verdictTitles[pageResultData.grade];
		pageResultData.grade_message = this.resultRelativeTextData.verdictMessages[pageResultData.grade];
		
		// convert the date from an UTC string in to a human-readable string according to the current locale
		const date = new Date(pageResultData.date)
		pageResultData.date = Intl.DateTimeFormat(currentLocale, {
			dateStyle: "full",
			timeStyle: "medium",
		}).format(date)

		// set page result params binary scores (0/1 : good/bad)
		pageResultData = {
			...pageResultData,
			...this._getDataResultsParamsBinaryScores(pageResultData, this.resultRelativeTextData.verdictParameters),
		};

		// set page result params verdicts
		pageResultData = {
			...pageResultData,
			...this._getDataResultsVerdicts(pageResultData, this.resultRelativeTextData.verdictParameters),
		};

		// set dom content with data-attributes from api data
		this._setDomContent(pageResultData, "data-int", "data-int-attr");

		// specific components updates
		this._updateUrl(pageResultData.url)
		this._updateNoteChart(pageResultData.grade);
		this._updateFootprintResultsFromSelect();
		this._updatetResultRangeSliders(pageResultData);
	}

	/**
	 *
	 * @param {Array} resultData
	 * @param {Object} resultParamsVerdicts
	 * @returns {Object}
	 */
	_getDataResultsParamsBinaryScores(resultData, resultParamsVerdicts) {
		return Object.keys(resultParamsVerdicts).reduce((resultTypeScores, key) => {
			const paramsScoreTarget = this.resultRelativeTextData.resultParametersMinMaxValues[key].target;
			const resultParamBinaryScore = resultData[key] > paramsScoreTarget ? 1 : 0;
			return { ...resultTypeScores, ...{ [`${key}_binary_score`]: resultParamBinaryScore } };
		}, {});
	}

	/**
	 *
	 * @param {Array} resultData
	 * @param {Object} resultParamsVerdicts
	 * @returns {Object}
	 */
	_getDataResultsVerdicts(resultData, resultParamsVerdicts) {
		return Object.entries(resultParamsVerdicts).reduce((verdictsFromScore, [key, verdicts]) => {
			return { ...verdictsFromScore, ...{ [`${key}_verdict`]: verdicts[+resultData[`${key}_binary_score`]] } };
		}, {});
	}

	/**
	 * Set dom content with input data-attributes from corresponding data
	 * @param {Object} data Data object from api/params json result
	 * @param {string} contentAttrKey data-attribute param for text content update
	 * @param {string} attrValueKey data-attribute param for custom dom params
	 */
	_setDomContent(data, contentAttrKey, attrValueKey) {
		// get all interactive elements with attributes data-int
		const dataIntEls = this.el.querySelectorAll(`[${contentAttrKey}]`);
		const dataIntAttrEls = this.el.querySelectorAll(`[${attrValueKey}]`);

		// replace content from data for all elements with data-int
		dataIntEls.forEach((dataIntEl) => {
			const elementDataValue = this._getDataValueFrom(data, dataIntEl.dataset.int);
			if (!elementDataValue || elementDataValue.length === 0) return;
			dataIntEl.textContent = this._getDataValueFrom(data, dataIntEl.dataset.int);
		});

		// add attribute values for all elements with data-int-attr
		dataIntAttrEls.forEach((dataIntEl) => {
			const dataAttr = dataIntEl.dataset.intAttr;
			const camelCaseDataAttr = camelize(dataAttr);
			const updatedCaseAttr = camelCaseDataAttr.charAt(0).toUpperCase() + camelCaseDataAttr.slice(1);
			dataIntEl.dataset["int" + updatedCaseAttr + "Value"] = this._getDataValueFrom(data, dataAttr);
		});
	}

	/**
	 * Check & format timestamp to date XX/XX/XXXX
	 * @param {string} value timestamp
	 * @returns {string} formated date string
	 */
	_getValidDateString(value) {
		const date = new Date(value);
		if (isNaN(date)) return;
		// Check if date is greater to current date or inferior to 2004 then invalid date
		if (date.getTime() > new Date().getTime() || date.getTime() < new Date(2004, 0)) return;
		return date.toLocaleString().split(",")[0];
	}

	/**
	 *
	 * @param {Object} data Page analysis data
	 * @param {string} key Corresponding analysis data to extract
	 * @returns {string} Formated value from data
	 */
	_getDataValueFrom(data, key) {
		let elementValue = data[key];
		let formatedValue;
		// Format date
		formatedValue = this._getValidDateString(elementValue);
		formatedValue = formatedValue ? formatedValue : elementValue;
		return formatedValue ? formatedValue : elementValue;
	}

	/**
	 *
	 * @param {string} note Site notation from data (letter from A to F)
	 */
	_updateNoteChart(note) {
		this.el.querySelector(`.notation-level-chart[data-grade-result="${note}"]`).classList.add("--active");
	}

	/**
	 * Update footprint impact infos from factor select (from 10 to 1000)
	 *
	 */
	_updateFootprintResultsFromSelect() {
		const selectFactorEl = this.el.querySelector(".js-footprint-factor-select select");
		const footprintResultEls = this.el.querySelectorAll(".footprint-result");

		if (!selectFactorEl || footprintResultEls.length === 0) return;
		const footprintResultsBaseValues = [...footprintResultEls].map((el) => +el.textContent);
		const factor = +selectFactorEl.value;

		this._updateFootprintResultsFrom(footprintResultEls, footprintResultsBaseValues, factor);
		selectFactorEl.addEventListener("change", (e) =>
			this._updateFootprintResultsFrom(footprintResultEls, footprintResultsBaseValues, +e.target.value)
		);
	}

	/**
	 * Update footprint results (water, gCo2e) from factor selected
	 * @param {HTMLElement[]} resultElements - Array of dom elements to update
	 * @param {number} footprintResultsBaseValues - Base result values
	 * @param {number} inputFactor - Factor selected for unit display change
	 */
	_updateFootprintResultsFrom(resultElements, footprintResultsBaseValues, inputFactor) {
		const unitsData = this.resultRelativeTextData.footprintUnitsData;
		resultElements.forEach((el, index) => {
			// Get footprint unit from data attribute
			const footprintType = el.dataset.int;
			// Update result calculated value from selected factor
			let rawValue = +footprintResultsBaseValues[index];
			let factorisedValue = rawValue * inputFactor;
			const unitConvertedValue =
				factorisedValue / (factorisedValue >= unitsData[footprintType].factor ? unitsData[footprintType].factor : 1);
			el.textContent = (Math.round(unitConvertedValue * 100) / 100).toString();
			// Update unit from result value
			el.dataset.unit =
				factorisedValue >= unitsData[footprintType].factor
					? unitsData[footprintType].order[1]
					: unitsData[footprintType].order[0];
		});
	}

	/**
	 * Update range sliders site infos from api data
	 * @param {Object} data Page analysis data
	 */
	_updatetResultRangeSliders(data) {
		const sliderEls = document.querySelectorAll(".js-rlr");
		sliderEls.forEach((sliderEl) => new ResultRangeSlider({ sliderEl, data }));
	}

	/**
	 * Update the href and title attribute of the element that contains the analyzed URL
	 * @param {string} url
	 */
	_updateUrl(url) {
		const urlElement = this.el.querySelector(".result-url")
		
		urlElement.setAttribute("value", url)
	}
}
export default SiteAnalysisResult;
