import { api } from '$lib/api';
import type { JellyfinItem, SonarrSeries } from '@repo/global-types';
import { AxiosError } from 'axios';

export function useJellyfinSeries(
	series: Pick<SonarrSeries, 'title' | 'alternateTitles'>,
	type: 'series' | 'movie' = 'series'
) {
	let state = $state<JellyfinItem | undefined>(undefined);

	const tryGetJellyfinSeries = async (searchTerm: string) => {
		try {
			return await api.get(`/jellyfin/get-${type}?searchTerm=${searchTerm}`);
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return { status: 404, data: null };
			}
			throw error;
		}
	};

	const getJellyfinSeries = async () => {
		let res = await tryGetJellyfinSeries(series.title ?? '');

		if (res?.status !== 200) {
			for (const alt of series.alternateTitles ?? []) {
				res = await tryGetJellyfinSeries(alt.title ?? '');
				if (res?.status === 200) break;
				await new Promise((r) => setTimeout(r, 100));
			}
		}

		state = res?.data ?? undefined;
	};

	$effect(() => {
		getJellyfinSeries();
	});

	return {
		get jellyfinItem() {
			return state;
		}
	};
}
