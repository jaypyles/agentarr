import { api } from '$lib/api';
import type { JellyfinItem, SonarrSeries } from '@repo/global-types';
import { AxiosError } from 'axios';

export function useJellyfinSeries(
	series: Pick<SonarrSeries, 'title' | 'alternateTitles'>[],
	type: 'series' | 'movie' = 'series'
) {
	let state = $state<Record<string, JellyfinItem> | undefined>(undefined);

	const get = async (series: SonarrSeries[]) => {
		const seriesList = series.map((s) => ({
			title: s.title ?? '',
			alternateTitles: s.alternateTitles?.map((alt) => alt.title ?? '') ?? []
		}));

		try {
			const response = await api.post(`/jellyfin/get-${type}`, { series: seriesList });
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
