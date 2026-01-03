<script lang="ts">
	import Sidebar from '$components/common/Sidebar.svelte';
	import Agents from '$components/tabs/Agents.svelte';
	import DownloadClients from '$components/tabs/DownloadClients.svelte';
	import Management from '$components/tabs/Management.svelte';
	import Movies from '$components/tabs/Movies.svelte';
	import Series from '$components/tabs/Series.svelte';
	import type { Mounts, Movie as MovieType, SonarrSeries } from '@repo/global-types';
	let { series, movies, mounts }: { series: SonarrSeries[]; movies: MovieType[]; mounts: Mounts } =
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
	<Sidebar {active} {changeActive} />

	<main class="flex h-full w-full flex-col gap-2 bg-zinc-900 p-4 text-white">
		{#if active === 'series'}
			<Series {series} />
		{/if}

		{#if active === 'movies'}
			<Movies {movies} />
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
