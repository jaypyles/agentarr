import type { SonarrSeries } from '@repo/global-types';
import { writable } from 'svelte/store';

function createSeriesStore() {
	const { subscribe, set } = writable<SonarrSeries[]>([]);

	return {
		subscribe,
		set
	};
}

export const series = createSeriesStore();
