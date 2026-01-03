<script lang="ts">
	import Home from '$components/pages/Home/Home.svelte';
	import { apps } from '$stores/apps';
	let { data } = $props();
	let { series, movies, mounts, apps: appsData } = data;

	if (appsData) {
		apps.initialize(appsData);
	}
</script>

<Home {series} {movies} {mounts} />
