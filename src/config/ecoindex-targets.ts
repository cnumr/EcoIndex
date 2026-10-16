/**
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
	size: 1.024,
	nodes: 600,
	requests: 40,
} as const;

export type EcoindexTargetKey = keyof typeof ecoindexTargets;
