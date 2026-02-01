<script lang="ts">
	import Sidebar from '$components/common/Sidebar.svelte';
	import Agents from '$components/tabs/Agents.svelte';
	import DownloadClients from '$components/tabs/DownloadClients.svelte';
	import Management from '$components/tabs/Management.svelte';
	import Movies from '$components/tabs/Movies.svelte';
	import Series from '$components/tabs/Series.svelte';
	import * as SidebarUI from '$lib/components/ui/sidebar';
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

<SidebarUI.SidebarProvider>
	<div class="flex h-screen w-full bg-background">
		<Sidebar {active} {changeActive} />

		<div class="flex min-w-0 flex-1 flex-col">
			<header
				class="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-2 md:hidden"
				aria-label="Mobile navigation"
			>
				<SidebarUI.SidebarTrigger
					class="size-9 shrink-0 text-card-foreground"
					aria-label="Open menu"
				/>
				<div class="flex min-w-0 items-center gap-2">
					<img src="/images/agentarr-logo.png" alt="" class="h-7 w-7 shrink-0" />
					<span class="truncate text-lg font-semibold text-card-foreground">AGENTARR</span>
				</div>
			</header>

			<main
				class="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-auto bg-zinc-900 p-4 text-white"
			>
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
	</div>
</SidebarUI.SidebarProvider>
