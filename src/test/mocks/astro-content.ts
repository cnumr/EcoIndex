/** Vitest stub for the Astro content virtual module. */
export async function getCollection(_name: string): Promise<unknown[]> {
	return [];
}

export type CollectionEntry<_C extends string> = {
	id: string;
	data: Record<string, unknown>;
};
