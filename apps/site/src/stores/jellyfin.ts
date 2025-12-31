import type { JellyfinItem } from '@repo/global-types';
import { writable } from 'svelte/store';

interface JellyfinStore {
	series: Record<string, JellyfinItem>;
	movies: Record<string, JellyfinItem>;
}

function createJellyfinStore() {
	const { subscribe, set } = writable<JellyfinStore>({ series: {}, movies: {} });

	return {
		subscribe,
		set
	};
}

export const jellyfin = createJellyfinStore();
