import { inverseLerp, clamp, getPercentFromRange } from '../helpers/mathUtils';

/**
 * Create a new result score range slider component
 * Note : dom updated from corresponding data passed to instance
 */
class ResultRangeSlider {
	sliderEl: Element;
	handleEl: HTMLElement;
	value: number;
	valueMin: number;
	valueMax: number;

	constructor({ sliderEl, data }: { sliderEl: Element; data: Record<string, unknown> }) {
		this.sliderEl = sliderEl;
		const handleEl = sliderEl.querySelector('.js-rlr-slider-handle');
		if (!(handleEl instanceof HTMLElement)) {
			throw new Error('ResultRangeSlider: missing handle element');
		}
		this.handleEl = handleEl;
		this.value = this._getValueFromDataKey(data);
		this.valueMin = +this.handleEl.getAttribute('aria-valuemin')!;
		this.valueMax = +this.handleEl.getAttribute('aria-valuemax')!;

		this.setSliderValue(this.value);
		this.setSliderTargetValue();
	}

	setSliderValue(value: number): void {
		const percentValue = getPercentFromRange(value, this.valueMin, this.valueMax);
		this.handleEl.style.setProperty('--rlr-slider-handle-position', percentValue + '%');
		this.handleEl.setAttribute('aria-valuenow', value.toString());
		this.handleEl.setAttribute('aria-valuetext', value.toString());
	}

	setSliderTargetValue(value?: number): void {
		const handleTargetEl = this.sliderEl.querySelector('.js-rlr-slider-handle-target');
		if (!(handleTargetEl instanceof HTMLElement)) return;
		const targetValue = value ?? +(handleTargetEl.dataset.value ?? 0);
		const percentTargetValue = getPercentFromRange(targetValue, this.valueMin, this.valueMax);
		handleTargetEl.style.setProperty(
			'--rlr-slider-handle-target-position',
			percentTargetValue + '%',
		);
	}

	_getScoreFromRange(value: number, min: number, max: number, rangeLength: number): number {
		const percentValue = this._getPercentValueFromRange(value, min, max);
		return clamp(Math.round((percentValue * rangeLength) / 100), 1, rangeLength);
	}

	_getValueFromDataKey(data: Record<string, unknown>): number {
		const key = this.handleEl.dataset.intValueFrom;
		return +((data[key ?? ''] as number | string | undefined) ?? 0);
	}

	_getPercentValueFromRange(value: number, valueMin: number, valueMax: number): number {
		return inverseLerp(valueMin, valueMax, clamp(value, valueMin, valueMax)) * 100;
	}
}

export default ResultRangeSlider;
