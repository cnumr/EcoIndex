#!/usr/bin/env bun
/**
 * @deprecated Use scripts/sync-ecoindex-reference.ts (bun run reference:sync).
 * Kept as a thin wrapper for backwards-compatible npm script names.
 */
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const script = join(import.meta.dir, 'sync-ecoindex-reference.ts');
const args = process.argv.slice(2);
const result = spawnSync('bun', ['run', script, ...args], { stdio: 'inherit' });
process.exit(result.status ?? 1);
