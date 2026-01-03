<script lang="ts">
	import ConnectedTo from '$components/common/ConnectedTo.svelte';
	import SeriesCard from '$components/common/SeriesCard.svelte';
	import { apps } from '$stores/apps';
	import type { SonarrSeries } from '@repo/global-types';
	let { series }: { series: SonarrSeries[] } = $props();
</script>

<div
	class="flex h-full flex-col rounded-md border border-border bg-card dark:border-border/50 dark:bg-card/50"
>
	<div class="px-4 py-2">
		<ConnectedTo app={$apps.sonarr} />
	</div>

	<div class="grid flex-1 auto-rows-min grid-cols-6 items-start gap-4 overflow-auto p-4">
		{#each series as s}
			<SeriesCard series={s} />
		{/each}
	</div>
</div>
