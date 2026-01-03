<script lang="ts">
	import { apps } from '$stores/apps';
	import type { JellyfinItem, SonarrSeries } from '@repo/global-types';
	import PosterCard from './PosterCard.svelte';

	let { series, jellyfinItem }: { series: SonarrSeries; jellyfinItem: JellyfinItem | undefined } =
		$props();
	const poster = $derived(series.images?.find((image) => image.coverType === 'poster'));
	const sonarrUrl = $derived($apps.sonarr);
	const jellyfinUrl = $derived($apps.jellyfin);
</script>

<PosterCard poster={poster?.remoteUrl ?? ''}>
	<a
		href={`${sonarrUrl}/series/${series.titleSlug}`}
		target="_blank"
		class="flex gap-2 rounded-md bg-black/50 p-2 hover:cursor-pointer hover:bg-black"
	>
		<img src="/images/sonarr.svg" alt="Sonarr" class="h-6 w-6 opacity-70" />
	</a>
	{#if jellyfinItem}
		<a
			href={`${jellyfinUrl}/web/#/details?id=${jellyfinItem?.Id ?? ''}`}
			target="_blank"
			class="flex gap-2 rounded-md bg-black/50 p-2 hover:cursor-pointer hover:bg-black"
		>
			<img src="/images/jellyfin.svg" alt="Jellyfin" class="h-6 w-6 opacity-70" />
		</a>
	{/if}
</PosterCard>
