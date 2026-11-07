#!/usr/bin/env bun
/**
 * Sync derived files from ecoindex_reference:
 *   - src/styles/0_grade-colors.css
 *
 * Usage:
 *   bun run reference:sync
 *   bun run reference:check
 *
 * Source (first match):
 *   1. ECOINDEX_REFERENCE_PATH env (local JSON file)
 *   2. ecoindex_reference.json
 *
 */
import references from 'ecoindex_reference' with { type: 'json' };
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..');
const GRADE_CSS = join(ROOT, 'src/styles/0_grade-colors.css');

function loadReference(): typeof references {
	const localPath = process.env.ECOINDEX_REFERENCE_PATH;
	if (localPath) {
		return JSON.parse(readFileSync(localPath, 'utf-8'));
	}

	return references;
}

function normalizeHex(color: string): string {
	const hex = color.trim();
	if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
		throw new Error(`Invalid grade color "${color}" (expected #RRGGBB)`);
	}
	return hex.toUpperCase();
}

function generateGradeCss(grades: typeof references.grades): string {
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

function main() {
	const check = process.argv.includes('--check');
	const reference = loadReference();
	const gradesCSS = generateGradeCss(reference.grades);

	if (check) {
		const dir = mkdtempSync(join(tmpdir(), 'ecoindex-ref-'));
		try {
			const okCss = checkFile('0_grade-colors.css', GRADE_CSS, gradesCSS, dir);
			if (!okCss) {
				console.error('   Run: bun run reference:sync');
				console.error('   Then commit the updated files.');
				process.exit(1);
			}
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
		return;
	}

	writeFileSync(GRADE_CSS, gradesCSS);
	console.log(`Wrote ${GRADE_CSS}`);
	for (const g of [...reference.grades].sort((a, b) => b.value - a.value)) {
		console.log(`  ${g.grade}: ${normalizeHex(g.color)}`);
	}
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
