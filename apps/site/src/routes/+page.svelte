<script lang="ts">
	import Home from '$components/pages/Home/Home.svelte';
    let { data } = $props();
    let { series, movies, mounts } = data;
</script>

<Home {series} {movies} {mounts} />
