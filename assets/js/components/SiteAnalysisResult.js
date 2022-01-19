import ResultRangeSlider from "./ResultRangeSlider";

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

/**
 * Site analysis result for interactive dom content
 */
class SiteAnalysisResult {
	/**
	 * Create a site analysis result page with updated dom from api data
	 * @param {Object} params
	 * @param {Element} el
	 * @param {string} apiUrl
	 */
	constructor({ el, apiUrl }) {
		this.el = el;
		this.apiUrl = apiUrl;

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
		} else if (urlParams.has("id")) {
			const pageId = urlParams.get("id");
			pageResultData = await this._fetchApiResult(pageId);
		} else {
			// TODO: redirect to error page ?
			return console.warn("No url params found for page, no data to show");
		}

		// update page size from ko to mo
		pageResultData.size = Math.round(pageResultData.size) / 1000;

		// set page result title 
		pageResultData.grade_title = RESULT_TITLE_DATA[pageResultData.grade]

		// set dom content with data-attributes from api data
		this._setDomContent(pageResultData, "[data-int]", "[data-int-attr]");

		// specific components updates
		this._updateNoteChart(pageResultData.grade);
		this._updateFootprintResultFromSelect(pageResultData);
		this._updatetResultRangeSliders(pageResultData);
	}

	/**
	 * Set dom content with input data-attributes from corresponding data
	 * @param {Object} data Data object from api/params json result
	 * @param {string} contentAttrKey data-attribute param for text content update
	 * @param {string} attrValueKey data-attribute param for custom dom params
	 */
	_setDomContent(data, contentAttrKey, attrValueKey) {
		// get all interactive elements with attributes data-int
		const dataIntEls = this.el.querySelectorAll(contentAttrKey);
		const dataIntAttrEls = this.el.querySelectorAll(attrValueKey);

		// replace content from data for all elements with data-int
		dataIntEls.forEach((dataIntEl) => {
			dataIntEl.textContent = this._getDataValueFrom(data, dataIntEl.dataset.int);
		});

		// add attribute values for all elements with data-int-attr
		dataIntAttrEls.forEach((dataIntEl) => {
			const dataAttr = dataIntEl.dataset.intAttr;
			const uppercaseAttr = dataAttr.charAt(0).toUpperCase() + dataAttr.slice(1);
			dataIntEl.dataset["int" + uppercaseAttr + "Value"] = this._getDataValueFrom(data, dataAttr);
		});
	}

	/**
	 * Fetch analysis api from page id
	 * @param {string} id Site analysis id
	 * @returns {Object} Data object with analysis infos
	 */
	async _fetchApiResult(id) {
		// FIXME: workaround adding temp proxy to fetch data
		const proxyURl = API_PROXY_URL;
		const response = await fetch(proxyURl + this.apiUrl + id);
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
	 * Get hostname from string if url
	 * @param {string} value string input
	 * @returns {string} hostname
	 */
	_getValidUrlHostName(value) {
		let url;

		try {
			url = new URL(value);
		} catch (_) {
			return false;
		}

		return url.hostname;
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
		formatedValue = this._getValidDateString(elementValue);
		formatedValue = formatedValue ? formatedValue : this._getValidUrlHostName(elementValue);
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
