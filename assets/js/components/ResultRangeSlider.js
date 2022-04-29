import { inverseLerp, clamp, getPercentFromRange } from "../helpers/mathUtils";

/**
 * Create a new result score range slider component
 * Note : dom updated from corresponding data passed to instance$
 * @class
 */
class ResultRangeSlider {
	constructor({ sliderEl, data }) {
		this.sliderEl = sliderEl;
		this.handleEl = sliderEl.querySelector(".js-rlr-slider-handle");
		// get value from corresponding data key
		this.value = this._getValueFromDataKey(data);
		// get min and max value
		this.valueMin = +this.handleEl.ariaValueMin;
		this.valueMax = +this.handleEl.ariaValueMax;

		// Set values to update dom
		this.setSliderValue(this.value);
		this.setSliderTargetValue();
	}

	setSliderValue(value) {
		// get percent value
		const percentValue = getPercentFromRange(value, this.valueMin, this.valueMax);
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
		const percentTargetValue = getPercentFromRange(targetValue, this.valueMin, this.valueMax);
		// set value to css
		handleTargetEl.style.setProperty("--rlr-slider-handle-target-position", percentTargetValue + "%");
	}

	_getScoreFromRange(value, min, max, rangeLength) {
		const percentValue = this._getPercentValueFromRange(value, min, max);
		return clamp(Math.round((percentValue * rangeLength) / 100), 1, rangeLength);
	}

	_getValueFromDataKey(data) {
		return +data[this.handleEl.dataset.intValueFrom];
	}

	_getPercentValueFromRange(value, valueMin, valueMax) {
		return inverseLerp(valueMin, valueMax, clamp(value, valueMin, valueMax)) * 100;
	}
}
export default ResultRangeSlider;
