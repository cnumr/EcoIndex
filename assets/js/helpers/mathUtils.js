export function inverseLerp(a, b, v) {
	return (v - a) / (b - a);
}

export function clamp(v, minVal, maxVal) {
	return Math.min(maxVal, Math.max(minVal, v));
}

export function getPercentFromRange(value, valueMin, valueMax) {
	return inverseLerp(valueMin, valueMax, clamp(value, valueMin, valueMax)) * 100;
}