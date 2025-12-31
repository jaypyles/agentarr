import type { Movie } from '@repo/global-types';
import { writable } from 'svelte/store';

function createMoviesStore() {
	const { subscribe, set } = writable<Movie[]>([]);

	return {
		subscribe,
		set
	};
}

export const movies = createMoviesStore();
