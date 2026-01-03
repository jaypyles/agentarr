<script lang="ts">
	import Settings from '$components/common/Settings.svelte';
	import Download from '$components/icons/Download.svelte';
	import Gear from '$components/icons/Gear.svelte';
	import Movie from '$components/icons/Movie.svelte';
	import Person from '$components/icons/Person.svelte';
	import Tv from '$components/icons/Tv.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	let { active, changeActive }: { active: string; changeActive: (active: string) => void } =
		$props();
</script>

<Sidebar.Provider class="w-[unset]">
	<Sidebar.Root>
		<Sidebar.Header class="mb-4 text-2xl font-bold">
			<div class="mt-2 ml-2 flex items-center gap-2">
				<img src="/images/agentarr-logo.png" alt="Agentarr" class="h-8 w-8" />
				<p>AGENTARR</p>
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
					<Movie />
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
		<Sidebar.Footer>
			<Settings />
		</Sidebar.Footer>
	</Sidebar.Root>
</Sidebar.Provider>
