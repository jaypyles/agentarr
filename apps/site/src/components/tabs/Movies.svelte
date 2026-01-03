<script lang="ts">
	import ConnectedTo from '$components/common/ConnectedTo.svelte';
	import MovieCard from '$components/common/MovieCard.svelte';
	import { apps } from '$stores/apps';
	import type { Movie } from '@repo/global-types';
	let { movies }: { movies: Movie[] } = $props();
</script>

<div
	class="flex h-full flex-col rounded-md border border-border bg-card dark:border-border/50 dark:bg-card/50"
>
	<div class="px-4 py-2">
		<ConnectedTo app={$apps.radarr} />
	</div>

	<div class="grid flex-1 auto-rows-min grid-cols-6 items-start gap-4 overflow-auto p-4">
		{#each movies as m}
			<MovieCard movie={m} />
		{/each}
	</div>
</div>
