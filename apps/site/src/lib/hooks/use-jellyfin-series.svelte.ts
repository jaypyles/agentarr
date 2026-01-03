import { api } from '$lib/api';
import type { JellyfinItem, SonarrSeries } from '@repo/global-types';
import { AxiosError } from 'axios';

export function useJellyfinSeries(
	series: Pick<SonarrSeries, 'title' | 'alternateTitles'>,
	type: 'series' | 'movie' = 'series'
) {
	let state = $state<JellyfinItem | undefined>(undefined);

	const get = async (series: Pick<SonarrSeries, 'title' | 'alternateTitles'>) => {
		try {
			const response = await api.post(`/jellyfin/get-${type}`, { series });
			state = response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				state = undefined;
			} else {
				throw error;
			}
		}
	};

	$effect(() => {
		get(series);
	});

	return {
		get jellyfinItem() {
			return state;
		}
	};
}
