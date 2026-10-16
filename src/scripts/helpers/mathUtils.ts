export function inverseLerp(a: number, b: number, v: number): number {
	return (v - a) / (b - a);
}

export function clamp(v: number, minVal: number, maxVal: number): number {
	return Math.min(maxVal, Math.max(minVal, v));
}

export function getPercentFromRange(value: number, valueMin: number, valueMax: number): number {
	return inverseLerp(valueMin, valueMax, clamp(value, valueMin, valueMax)) * 100;
}
