<script lang="ts">
	import Agents from '$components/common/Agents.svelte';
	import Header from '$components/common/Header.svelte';
	import SeriesCard from '$components/common/SeriesCard.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { SonarrSeries } from '@repo/global-types';
	let { series }: { series: SonarrSeries[] } = $props();
	let active = $state('series');

  const changeActive = (type: string) => {
    active = type;
  }
</script>

<div class="flex h-screen bg-zinc-800">
	<Sidebar.Provider class="w-[unset]">
		<Sidebar.Root>
			<Sidebar.Header>Cockpit</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group />
				<Sidebar.Group />
			</Sidebar.Content>
			<Sidebar.Footer />
		</Sidebar.Root>
	</Sidebar.Provider>

	<main class="flex w-full flex-col gap-2 bg-zinc-900 p-4 text-white">
		<Header {changeActive} />
		{#if active === 'series'}
			<div class="grid flex-1 grid-cols-6 gap-2 overflow-auto">
				{#each series as s}
					<SeriesCard series={s} />
				{/each}
			</div>
		{/if}

		{#if active === 'agents'}
			<Agents />
		{/if}
	</main>
</div>
