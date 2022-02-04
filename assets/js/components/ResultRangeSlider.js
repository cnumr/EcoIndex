import { inverseLerp, clamp } from "../helpers/mathUtils";

const SLIDER_MAX_SCORE = 2;
// TODO : add to /data with trad
const TEMP_RESULT_VERDICT = {
	size: ["Si légère", "Trop lourde"],
	nodes: ["Simple", "Trop complexe"],
	requests: ["Peu de requêtes", "Trop de requêtes"],
};

/**
 * Result score range slider component
 * Note : dom updated from corresponding data passed to instance
 */
class ResultRangeSlider {
	constructor({ sliderEl, data }) {
		this.sliderEl = sliderEl;
		this.handleEl = sliderEl.querySelector(".js-rlr-slider-handle");
		this.dataType = this.handleEl.dataset.intValueFrom;
		// get value from corresponding data key
		this.value = this._getValueFromDataKey(data);
		// get min and max value
		this.valueMin = +this.handleEl.ariaValueMin;
		this.valueMax = +this.handleEl.ariaValueMax;
		
		this.dataTypeScore = this._getScoreFromRange(this.value, this.valueMin, this.valueMax);

		// Set values to update dom
		this.setSliderValue(this.value);
		this.setSliderTargetValue();
		this.setSliderScoreValueAttributes(this.dataTypeScore);
		this.setSliderVerdict(TEMP_RESULT_VERDICT[this.dataType], this.dataTypeScore)
	}

	setSliderValue(value) {
		// get percent value
		const percentValue = this._getPercentValueFromRange(value, this.valueMin, this.valueMax);
		// set value to css
		this.handleEl.style.setProperty("--rlr-slider-handle-position", percentValue + "%");

		// update elements params
		this.handleEl.setAttribute("aria-valuenow", value.toString());
		this.handleEl.setAttribute("aria-valuetext", value.toString());
	}

	setSliderTargetValue(value) {
		// Update target handle
		const handleTargetEl = this.sliderEl.querySelector(".js-rlr-slider-handle-target");
		const targetValue = value ? value : +handleTargetEl.dataset.value;
		// get percent value
		const percentTargetValue = this._getPercentValueFromRange(targetValue, this.valueMin, this.valueMax);
		// set value to css
		handleTargetEl.style.setProperty("--rlr-slider-handle-target-position", percentTargetValue + "%");
	}

	setSliderScoreValueAttributes(score) {
		const scoreEls = this.sliderEl.querySelectorAll("[data-int-item-score]");
		scoreEls.forEach((el) => (el.dataset.intItemScore = score));
	}

	setSliderVerdict(verdicts, score) {
		this.sliderEl.querySelector(".js-rlr-verdict-badge > span").textContent = verdicts[score - 1];
	}

	_getScoreFromRange(value, min, max) {
		const percentValue = this._getPercentValueFromRange(value, min, max);
		return clamp(Math.round((percentValue * SLIDER_MAX_SCORE) / 100), 1, SLIDER_MAX_SCORE);
	}

	_getValueFromDataKey(data) {
		return +data[this.handleEl.dataset.intValueFrom];
	}

	_getPercentValueFromRange(value, valueMin, valueMax) {
		return inverseLerp(valueMin, valueMax, clamp(value, valueMin, valueMax)) * 100;
	}
}
export default ResultRangeSlider;
