<script lang="ts">
	import { useJellyfinSeries } from '$lib/hooks/use-jellyfin-series.svelte';
	import { apps } from '$stores/apps';
	import type { Movie } from '@repo/global-types';
	import PosterCard from './PosterCard.svelte';

	apps.load();

	let { movie }: { movie: Movie } = $props();
	const poster = $derived(movie.images?.find((movie) => movie.coverType === 'poster'));
	const radarrUrl = $derived($apps.radarr);
	const jellyfinUrl = $derived($apps.jellyfin);
    const state = $derived(useJellyfinSeries(movie, 'movie'));
</script>

<PosterCard poster={poster?.remoteUrl ?? ''}>
	<a
		href={`${radarrUrl}/movie/${movie.titleSlug}`}
		target="_blank"
		class="flex gap-2 rounded-md bg-black/50 p-2 hover:cursor-pointer hover:bg-black"
	>
		<img src="/images/radarr.svg" alt="Radarr" class="h-6 w-6 opacity-70" />
	</a>
    {#if state.jellyfinItem}
	<a
		href={`${jellyfinUrl}/web/#/details?id=${state.jellyfinItem?.Id ?? ''}`}
		target="_blank"
		class="flex gap-2 rounded-md bg-black/50 p-2 hover:cursor-pointer hover:bg-black"
	>
		<img src="/images/jellyfin.svg" alt="Jellyfin" class="h-6 w-6 opacity-70" />
	</a>
    {/if}
</PosterCard>