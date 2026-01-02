<script lang="ts">
	import Agents from '$components/common/Agents.svelte';
	import DownloadClients from '$components/common/DownloadClients.svelte';
	import Management from '$components/common/Management.svelte';
	import MovieCard from '$components/common/MovieCard.svelte';
	import SeriesCard from '$components/common/SeriesCard.svelte';
	import Download from '$components/icons/Download.svelte';
	import Gear from '$components/icons/Gear.svelte';
	import Movies from '$components/icons/Movies.svelte';
	import Person from '$components/icons/Person.svelte';
	import Tv from '$components/icons/Tv.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { Mounts, Movie, SonarrSeries } from '@repo/global-types';
	let { series, movies, mounts }: { series: SonarrSeries[]; movies: Movie[]; mounts: Mounts } =
		$props();
	let active = $state('series');

	const changeActive = (type: string) => {
		active = type;
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('tab', type);
		urlParams.forEach((_, key) => {
			if (key !== 'tab') {
				urlParams.delete(key);
			}
		});
		// Preserve other params like option and fileName
		const newUrl = `/?${urlParams.toString()}`;
		window.history.pushState({}, '', newUrl);
	};

	const updateActiveFromUrl = () => {
		const urlParams = new URLSearchParams(window.location.search);
		const activeTab = urlParams.get('tab');
		if (activeTab) {
			active = activeTab;
		}
	};

	$effect(() => {
		updateActiveFromUrl();

		// Handle browser back/forward navigation
		window.addEventListener('popstate', updateActiveFromUrl);

		return () => {
			window.removeEventListener('popstate', updateActiveFromUrl);
		};
	});
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
						<Tv />
						<p>Series</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'movies' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('movies')}
					>
						<Movies />
						<p>Movies</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'agents' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('agents')}
					>
						<Person />
						<p>Agents</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'management' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('management')}
					>
						<Gear />
						<p>Media Management</p>
					</button>
					<button
						class={`mx-4 flex cursor-pointer items-center gap-2 rounded-md bg-none p-2 hover:bg-muted-foreground/10 ${active === 'download-client' ? 'bg-muted-foreground/10' : ''}`}
						onclick={() => changeActive('download-client')}
					>
						<Download />
						<p>Download Client</p>
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

		{#if active === 'management'}
			<Management {mounts} />
		{/if}

		{#if active === 'download-client'}
			<DownloadClients />
		{/if}
	</main>
</div>
