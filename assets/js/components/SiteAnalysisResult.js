import ResultRangeSlider from "./ResultRangeSlider";

// FIXME: temp workaround for cors for dev
const API_PROXY_URL = "https://cors-anywhere.herokuapp.com/";

class SiteAnalysisResult {
	constructor({ el, apiUrl }) {
		this.el = el;
		this.apiUrl = apiUrl;

		this._init();
	}

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

		// get all interactive elements with attributes data-int
		const dataIntEls = this.el.querySelectorAll("[data-int]");
		const dataIntAttrEls = this.el.querySelectorAll("[data-int-attr]");

		// TODO: add to func
		// replace content from data for all elements with data-int
		dataIntEls.forEach((dataIntEl) => {
			dataIntEl.textContent = this._getDataValueFrom(pageResultData, dataIntEl.dataset.int);
		});

		// TODO: add to func
		// add attribute values for all elements with data-int-attr
		dataIntAttrEls.forEach((dataIntEl) => {
			const dataAttr = dataIntEl.dataset.intAttr;
			const uppercaseAttr = dataAttr.charAt(0).toUpperCase() + dataAttr.slice(1);
			dataIntEl.dataset["int" + uppercaseAttr + "Value"] = this._getDataValueFrom(pageResultData, dataAttr);
		});

		// specific components updates
		this._updateNoteChart(pageResultData.grade);
		this._updateFootprintResultFromSelect(pageResultData);
		this._updatetResultRangeSliders(pageResultData);
	}
	async _fetchApiResult(id) {
		// FIXME: workaround adding temp proxy to fetch data
		const proxyURl = "https://cors-anywhere.herokuapp.com/";
		const response = await fetch(proxyURl + this.apiUrl + id);
		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		}
		const apiResult = await response.json();
		return apiResult;
	}

	_getValidDateString(value) {
		const date = new Date(value);
		if (isNaN(date)) return;
		// Check if date is greater to current date or inferior to 2004 then invalid date
		if (date.getTime() > new Date().getTime() || date.getTime() < new Date(2004, 0)) return;
		return date.toLocaleString().split(",")[0];
	}

	_getValidUrlHostName(value) {
		let url;

		try {
			url = new URL(value);
		} catch (_) {
			return false;
		}

		return url.hostname;
	}

	_getDataValueFrom(data, key) {
		let elementValue = data[key];
		let formatedValue;
		formatedValue = this._getValidDateString(elementValue);
		formatedValue = formatedValue ? formatedValue : this._getValidUrlHostName(elementValue);
		return formatedValue ? formatedValue : elementValue;
	}

	_updateNoteChart(note) {
		this.el.querySelector(`.notation-level-chart[data-grade-result="${note}"]`).classList.add("--active");
	}

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

	_updatetResultRangeSliders(data) {
		const sliderEls = document.querySelectorAll(".js-rlr-slider");
		sliderEls.forEach((sliderEl) => new ResultRangeSlider({ sliderEl, data }));
	}
}
export default SiteAnalysisResult;
