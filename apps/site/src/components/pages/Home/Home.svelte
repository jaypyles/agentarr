<script lang="ts">
	import Agents from '$components/common/Agents.svelte';
	import MovieCard from '$components/common/MovieCard.svelte';
	import SeriesCard from '$components/common/SeriesCard.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { Movie, SonarrSeries } from '@repo/global-types';
	let { series, movies }: { series: SonarrSeries[], movies: Movie[] } = $props();
	let active = $state('series');

	const changeActive = (type: string) => {
		active = type;
	};
</script>

<div class="flex h-screen bg-background">
	<Sidebar.Provider class="w-[unset]">
		<Sidebar.Root>
			<Sidebar.Header class="mb-4 text-2xl font-bold">
				<div class="mt-2 ml-2 flex items-center gap-2">
					<img src="/images/cockpit-logo.png" alt="Cockpit" class="h-8 w-8" />
					<p>COCKPIT</p>
				</div>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group class="flex flex-col gap-4">
					<p class="mx-2">MENU</p>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'series' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('series')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M4 21v-2q-.825 0-1.412-.587T2 17V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v11q0 .825-.587 1.413T20 19v2h-1l-.65-2H5.675L5 21zm0-4h16V6H4zm8-5.5"
							/></svg
						>
						<p>Series</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'movies' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('movies')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="m4 4l2 4h3L7 4h2l2 4h3l-2-4h2l2 4h3l-2-4h3q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20H4q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4"
							/></svg
						>
						<p>Movies</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'agents' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('agents')}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M8 15h8v-.55q0-1.125-1.1-1.787T12 12t-2.9.663T8 14.45zm4-4q.825 0 1.413-.587T14 9t-.587-1.412T12 7t-1.412.588T10 9t.588 1.413T12 11m-8 8q-.825 0-1.412-.587T2 17V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v12q0 .825-.587 1.413T20 19h-4v1q0 .425-.288.713T15 21H9q-.425 0-.712-.288T8 20v-1z"
							/></svg
						>
						<p>Agents</p>
					</button>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer />
		</Sidebar.Root>
	</Sidebar.Provider>

	<main class="flex h-full w-full flex-col gap-2 bg-zinc-900 p-4 text-white">
		{#if active === 'series'}
			<div
				class="h-full rounded-md border border-border bg-card dark:border-border/50 dark:bg-card/50"
			>
				<div class="grid grid-cols-6 gap-4 overflow-auto p-4">
					{#each series as s}
						<SeriesCard series={s} />
					{/each}
				</div>
			</div>
		{/if}

		{#if active === 'movies'}
			<div
				class="h-full rounded-md border border-border bg-card dark:border-border/50 dark:bg-card/50"
			>
				<div class="grid grid-cols-6 gap-4 overflow-auto p-4">
					{#each movies as m}
						<MovieCard movie={m} />
					{/each}
				</div>
			</div>
		{/if}

		{#if active === 'agents'}
			<Agents />
		{/if}
	</main>
</div>
