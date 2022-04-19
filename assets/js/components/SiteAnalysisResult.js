import ResultRangeSlider from "./ResultRangeSlider";
import getUrlHostName from "../helpers/getUrlHostName";

// FIXME: temp workaround for cors for dev
const API_PROXY_URL = "https://cors-anywhere.herokuapp.com/";
// FIXME : temp data for result title
const RESULT_TITLE_DATA = {
	'A' : 'Bravo !',
	'B' : 'Pas mal du tout !',
	'C' : 'Encore un effort !',
	'D' : 'Hum, pas top.',
	'E' : 'Hum, pas top.',
	'F' : 'Outch.',
	'G' : 'Outch.',
}

import { clamp, getPercentFromRange } from "../helpers/mathUtils";
import { camelize } from "../helpers/stringUtils";

/**
 * Creates a new Site analysis result for interactive dom content
 * @class
 */
class SiteAnalysisResult {
	/**
	 * @typedef ResultRelativeTextData
	 * @type {object}
	 * @property {Object.<string, string>} verdictTitles - Verdict titles relative to grade
	 * @property {Object.<string, string>} verdictMessages - Verdict messages relative to grade
	 * @property {Array.<Array.<string>>} verdictParameters - Verdict parameters relative to good/bad score
	 */

	/**
	 * Create a site analysis result page with updated dom from api data
	 * @param {Object} params
	 * @param {Element} el
	 * @param {string} apiUrl
	 * @param {string} apiKey
	 */
	constructor({ el, apiUrl, apiKey }) {
		this.el = el;
		this.apiUrl = apiUrl;
		this.apiKey = apiKey;

		/** @type {ResultRelativeTextData} */
		this.resultRelativeTextData = resultRelativeTextData;

		this._init();
	}

	/**
	 * Init site analysis from api id fetch or url param
	 *
	 */
	async _init() {
		const urlParams = new URLSearchParams(window.location.search);

		let pageResultData = {};

		// get params from url
		// NOTE : url params example to test : "?width=1920&height=1080&url=https%3A%2F%2Fwww.leroymerlin.fr&grade=E&score=34&ges=2.32&water=3.48&date=2021-11-17T12%3A40%3A18.575464&page_type=null&id=2d43d4c9-6ad0-4dc8-a769-09b3b2249bf3&version=1&size=1119.963&nodes=1286&requests=65&host=www.leroymerlin.fr"
		if (urlParams.has("url") && urlParams.has("size") && urlParams.has("ges")) {
			for (const [key, value] of urlParams.entries()) {
				pageResultData[key] = value;
			}

			// else fetch analysis result from id
			// NOTE : url params example to test : "?id=ec839aca-7c12-42e8-8541-5f7f94c36b7f
		} else if (urlParams.has("id")) {
			const pageId = urlParams.get("id");
			pageResultData = await this._fetchApiResult(pageId, this.apiKey);
		} else {
			// TODO: redirect to error page ?
			return console.warn("No url params found for page, no data to show");
		}

		// update page size from ko to mo
		pageResultData.size = Math.round(pageResultData.size) / 1000;

		// set page result title
		pageResultData.grade_title = this.resultRelativeTextData.verdictTitles[pageResultData.grade];

		pageResultData.grade_message = this.resultRelativeTextData.verdictMessages[pageResultData.grade];

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
		this._updateNoteChart(pageResultData.grade);
		this._updateFootprintResultFromSelect(pageResultData);
		this._updatetResultRangeSliders(pageResultData);
	}

	// TODO: add inside data with results method (unique)
	/**
	 * Get array key for params verdicts list from score
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @param {number} arrayLength
	 * @returns {number}
	 */
	_getResultParamBinaryScore(value, min, max) {
		const percentValue = getPercentFromRange(value, min, max);
		return clamp(Math.round((percentValue * 2) / 100), 1, 2) - 1;
	}

	/**
	 * 
	 * @param {Array} resultData 
	 * @param {Object} resultParamsVerdicts 
	 * @returns {Object}
	 */
	_getDataResultsParamsBinaryScores(resultData, resultParamsVerdicts) {
		return Object.keys(resultParamsVerdicts).reduce((resultTypeScores, key) => {
			const paramScoreMin = this.resultRelativeTextData.resultParametersMinMaxValues[key].min;
			const paramScoreMax = this.resultRelativeTextData.resultParametersMinMaxValues[key].max;
			const resultParamBinaryScore = this._getResultParamBinaryScore(resultData[key], paramScoreMin, paramScoreMax);
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
	 * Fetch analysis api from page id
	 * @param {string} id Site analysis id
	 * @param {string} apiKey 
	 * @returns {Object} Data object with analysis infos
	 */
	async _fetchApiResult(id, apiKey) {
		// FIXME: workaround adding temp proxy to fetch data
		const proxyURl = API_PROXY_URL;
		const response = await fetch(proxyURl + this.apiUrl + '/' + id, {
			headers: {
				// NOTE : temp headers for rapidapi
				'x-rapidapi-host': 'ecoindex.p.rapidapi.com',
				'x-rapidapi-key': apiKey
			  }
		});
		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}
		const apiResult = await response.json();
		return apiResult;
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
		formatedValue = formatedValue ? formatedValue : getUrlHostName(elementValue);
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
	_updateFootprintResultFromSelect() {
		// TODO: move outside
		const unitsData = {
			water: { order: ["cl", "l"], factor: 100 },
			ges: {
				order: ["gCO2e", "kgCO2e"],
				factor: 1000,
			},
		};
		const selectFactorEl = this.el.querySelector(".js-footprint-factor-select select");
		const footprintResultEls = this.el.querySelectorAll(".footprint-result");

		if (!selectFactorEl || footprintResultEls.length === 0) return;
		const footprintResultsBaseValues = [...footprintResultEls].map((el) => +el.textContent);
		const factor = +selectFactorEl.value;

		function updateFootprintResultsFrom(factor) {
			footprintResultEls.forEach((el, index) => {
				const footprintType = el.dataset.int;
				const roundedValue = Math.round(footprintResultsBaseValues[index] * factor * 100) / 100;
				// update value
				el.textContent = roundedValue / (factor >= 1000 ? unitsData[footprintType].factor : 1);
				// update unit
				el.dataset.unit = factor >= 1000 ? unitsData[footprintType].order[1] : unitsData[footprintType].order[0];
			});
		}
		updateFootprintResultsFrom(factor);
		selectFactorEl.addEventListener("change", (e) => updateFootprintResultsFrom(+e.target.value));
	}

	/**
	 * Update range sliders site infos from api data
	 * @param {Object} data Page analysis data
	 */
	_updatetResultRangeSliders(data) {
		const sliderEls = document.querySelectorAll(".js-rlr");
		sliderEls.forEach((sliderEl) => new ResultRangeSlider({ sliderEl, data }));
	}
}
export default SiteAnalysisResult;
