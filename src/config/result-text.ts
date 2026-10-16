import { ecoindexTargets } from './ecoindex-targets';

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

export const resultTextData = {
	fr: {
		verdictTitles: {
			A: 'Bravo !',
			B: 'Pas mal du tout !',
			C: 'Encore un effort !',
			D: 'Hum, pas top.',
			E: 'Hum, pas top.',
			F: 'Outch.',
			G: 'Outch.',
		},
		verdictMessages: {
			A: 'Le top. On se rapproche dangereusement de la perfection. ',
			B: 'Si toutes les pages web pouvaient être aussi légères que celle-ci, le numérique serait plus vert',
			C: 'Vous y êtes presque ! Encore quelques efforts et ce sera bon.',
			D: 'La bonne nouvelle, c’est que vous pouvez faire beaucoup mieux !',
			E: 'La bonne nouvelle, c’est que vous pouvez faire beaucoup mieux !',
			F: 'On ne va pas se le cacher : ça fait mal. Il est temps d’agir !',
			G: 'On ne va pas se le cacher : ça fait mal. Il est temps d’agir !',
		},
		verdictParameters: {
			size: ['Si légère', 'Trop lourde'],
			nodes: ['Simple', 'Trop complexe'],
			requests: ['Peu de requêtes', 'Trop de requêtes'],
		},
		resultParametersMinMaxValues,
		footprintUnitsData: {
			water: { order: ['cl', 'l'], factor: 100 },
			ges: { order: ['gCO2e', 'kgCO2e'], factor: 1000 },
		},
	},
	en: {
		verdictTitles: {
			A: 'Well done!',
			B: 'Not bad at all!',
			C: 'Almost there!',
			D: 'Hmm, not great.',
			E: 'Hmm, not great.',
			F: 'Ouch.',
			G: 'Ouch.',
		},
		verdictMessages: {
			A: "Excellent! We're getting dangerously close to perfection!.",
			B: 'If all web pages could be as light as this one, internet would be greener',
			C: "You're almost there! Just a little more effort and it's all good.",
			D: 'The good news is that you can do much better!',
			E: 'The good news is that you can do much better!',
			F: "Let's not hide it: it hurts. Time to act!",
			G: "Let's not hide it: it hurts. Time to act!",
		},
		verdictParameters: {
			size: ['So light', 'Too heavy'],
			nodes: ['Simple', 'Too complex'],
			requests: ['Few requests', 'Too many requests'],
		},
		resultParametersMinMaxValues,
		footprintUnitsData: {
			water: { order: ['cl', 'l'], factor: 100 },
			ges: { order: ['gCO2e', 'kgCO2e'], factor: 1000 },
		},
	},
} as const;
