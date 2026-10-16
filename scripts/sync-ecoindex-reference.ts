#!/usr/bin/env bun
/**
 * Sync derived files from ecoindex_reference:
 *   - src/styles/0_grade-colors.css
 *   - src/config/ecoindex-targets.ts
 *
 * Usage:
 *   bun run reference:sync
 *   bun run reference:check
 *
 * Source (first match):
 *   1. ECOINDEX_REFERENCE_PATH env (local JSON file)
 *   2. https://raw.githubusercontent.com/cnumr/ecoindex_reference/refs/heads/main/ecoindex_reference.json
 *
 * Target mapping (reference → front):
 *   response_size (ko) → size (Mo = ko / 1000)
 *   dom_size            → nodes
 *   nb_request          → requests
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const ROOT = join(import.meta.dir, '..');
const GRADE_CSS = join(ROOT, 'src/styles/0_grade-colors.css');
const TARGETS_TS = join(ROOT, 'src/config/ecoindex-targets.ts');
const SOURCE_URL =
	'https://raw.githubusercontent.com/cnumr/ecoindex_reference/refs/heads/main/ecoindex_reference.json';

type GradeEntry = {
	grade: string;
	value: number;
	color: string;
};

type Reference = {
	grades: GradeEntry[];
	targets: {
		dom_size: number;
		nb_request: number;
		response_size: number;
	};
};

type GeneratedFiles = {
	gradeCss: string;
	targetsTs: string;
};

async function loadReference(): Promise<Reference> {
	const localPath = process.env.ECOINDEX_REFERENCE_PATH;
	if (localPath) {
		return JSON.parse(readFileSync(localPath, 'utf-8')) as Reference;
	}

	const response = await fetch(SOURCE_URL);
	if (!response.ok) {
		throw new Error(
			`Failed to fetch ecoindex_reference: ${response.status} ${response.statusText}`,
		);
	}
	return (await response.json()) as Reference;
}

function normalizeHex(color: string): string {
	const hex = color.trim();
	if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
		throw new Error(`Invalid grade color "${color}" (expected #RRGGBB)`);
	}
	return hex.toUpperCase();
}

function generateGradeCss(grades: GradeEntry[]): string {
	const ordered = [...grades].sort((a, b) => b.value - a.value);
	const expected = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	const letters = ordered.map((g) => g.grade);
	if (letters.join('') !== expected.join('')) {
		throw new Error(
			`Unexpected grades order/set: ${letters.join(', ')} (expected ${expected.join(', ')})`,
		);
	}

	const lines = ordered.map((g) => `\t--color-grade-${g.grade}: ${normalizeHex(g.color)};`);

	return `/**
 * EcoIndex grade colors — GENERATED FILE, do not edit by hand.
 * Source: ecoindex_reference (grades[].color)
 * Regenerate: bun run reference:sync
 */

:root {
${lines.join('\n')}
}
`;
}

function generateTargetsTs(targets: Reference['targets']): string {
	const { dom_size, nb_request, response_size } = targets;
	for (const [key, value] of Object.entries(targets)) {
		if (typeof value !== 'number' || !Number.isFinite(value)) {
			throw new Error(`Invalid target "${key}": ${value}`);
		}
	}

	// Front size is in Mo; reference response_size is in ko.
	const sizeTargetMo = response_size / 1000;

	return `/**
 * EcoIndex score targets — GENERATED FILE, do not edit by hand.
 * Source: ecoindex_reference.targets
 * Regenerate: bun run reference:sync
 *
 * Mapping:
 *   size     ← response_size / 1000 (ko → Mo)
 *   nodes    ← dom_size
 *   requests ← nb_request
 */
export const ecoindexTargets = {
	size: ${sizeTargetMo},
	nodes: ${dom_size},
	requests: ${nb_request},
} as const;

export type EcoindexTargetKey = keyof typeof ecoindexTargets;
`;
}

function buildGenerated(reference: Reference): GeneratedFiles {
	if (!Array.isArray(reference.grades) || reference.grades.length === 0) {
		throw new Error('ecoindex_reference.grades is missing or empty');
	}
	if (!reference.targets) {
		throw new Error('ecoindex_reference.targets is missing');
	}

	return {
		gradeCss: generateGradeCss(reference.grades),
		targetsTs: generateTargetsTs(reference.targets),
	};
}

function checkFile(
	label: string,
	expectedPath: string,
	actualContent: string,
	tmpDir: string,
): boolean {
	const tmpFile = join(tmpDir, label);
	writeFileSync(tmpFile, actualContent);
	const result = spawnSync('diff', ['-u', expectedPath, tmpFile], { encoding: 'utf-8' });
	if (result.status !== 0) {
		console.error(result.stdout || result.stderr);
		console.error('');
		console.error(`❌ ${expectedPath} is out of sync with ecoindex_reference.`);
		return false;
	}
	console.log(`✓ ${expectedPath} is up to date.`);
	return true;
}

async function main() {
	const check = process.argv.includes('--check');
	const reference = await loadReference();
	const generated = buildGenerated(reference);

	if (check) {
		const dir = mkdtempSync(join(tmpdir(), 'ecoindex-ref-'));
		try {
			const okCss = checkFile('0_grade-colors.css', GRADE_CSS, generated.gradeCss, dir);
			const okTargets = checkFile(
				'ecoindex-targets.ts',
				TARGETS_TS,
				generated.targetsTs,
				dir,
			);
			if (!okCss || !okTargets) {
				console.error('   Run: bun run reference:sync');
				console.error('   Then commit the updated files.');
				process.exit(1);
			}
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
		return;
	}

	writeFileSync(GRADE_CSS, generated.gradeCss);
	writeFileSync(TARGETS_TS, generated.targetsTs);
	console.log(`Wrote ${GRADE_CSS}`);
	for (const g of [...reference.grades].sort((a, b) => b.value - a.value)) {
		console.log(`  ${g.grade}: ${normalizeHex(g.color)}`);
	}
	console.log(`Wrote ${TARGETS_TS}`);
	console.log(
		`  size: ${reference.targets.response_size / 1000} Mo (from ${reference.targets.response_size} ko)`,
	);
	console.log(`  nodes: ${reference.targets.dom_size}`);
	console.log(`  requests: ${reference.targets.nb_request}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
