<script lang="ts">
	import Home from '$components/pages/Home/Home.svelte';
    let { data } = $props();
    let { series, movies } = data;
</script>

<Home {series} {movies} />
