import { ecoindexTargets } from './ecoindex-targets';
import { type Locale, t } from '../i18n';

/** Display min/max for result sliders (not sourced from ecoindex_reference). */
const resultParametersDisplayBounds = {
	size: { min: 0, max: 4.82 },
	nodes: { min: 0, max: 1386 },
	requests: { min: 0, max: 156 },
} as const;

const resultParametersMinMaxValues = {
	size: { ...resultParametersDisplayBounds.size, target: ecoindexTargets.size },
	nodes: { ...resultParametersDisplayBounds.nodes, target: ecoindexTargets.nodes },
	requests: { ...resultParametersDisplayBounds.requests, target: ecoindexTargets.requests },
} as const;

function getVerdictTitles(locale: Locale): Record<string, string> {
	return {
		A: t(locale, 'ResultVerdictTitleA'),
		B: t(locale, 'ResultVerdictTitleB'),
		C: t(locale, 'ResultVerdictTitleC'),
		D: t(locale, 'ResultVerdictTitleD'),
		E: t(locale, 'ResultVerdictTitleE'),
		F: t(locale, 'ResultVerdictTitleF'),
		G: t(locale, 'ResultVerdictTitleG'),
	};
}

function getVerdictMessages(locale: Locale): Record<string, string> {
	return {
		A: t(locale, 'ResultVerdictMessageA'),
		B: t(locale, 'ResultVerdictMessageB'),
		C: t(locale, 'ResultVerdictMessageC'),
		D: t(locale, 'ResultVerdictMessageD'),
		E: t(locale, 'ResultVerdictMessageE'),
		F: t(locale, 'ResultVerdictMessageF'),
		G: t(locale, 'ResultVerdictMessageG'),
	};
}

function getVerdictParameters(locale: Locale): Record<string, [string, string]> {
	return {
		size: [
			t(locale, 'ResultVerdictParameterSizeMin'),
			t(locale, 'ResultVerdictParameterSizeMax'),
		],
		nodes: [
			t(locale, 'ResultVerdictParameterNodesMin'),
			t(locale, 'ResultVerdictParameterNodesMax'),
		],
		requests: [
			t(locale, 'ResultVerdictParameterRequestsMin'),
			t(locale, 'ResultVerdictParameterRequestsMax'),
		],
	};
}

function getFootprintUnitsData() {
	return {
		water: { order: ['cl', 'l'] as const, factor: 100 },
		ges: { order: ['gCO2e', 'kgCO2e'] as const, factor: 1000 },
	};
}

export const resultTextData = {
	fr: {
		verdictTitles: getVerdictTitles('fr'),
		verdictMessages: getVerdictMessages('fr'),
		verdictParameters: getVerdictParameters('fr'),
		resultParametersMinMaxValues,
		footprintUnitsData: getFootprintUnitsData(),
	},
	en: {
		verdictTitles: getVerdictTitles('en'),
		verdictMessages: getVerdictMessages('en'),
		verdictParameters: getVerdictParameters('en'),
		resultParametersMinMaxValues,
		footprintUnitsData: getFootprintUnitsData(),
	},
} as const;
