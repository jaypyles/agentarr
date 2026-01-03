<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import { onMount } from 'svelte';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (prefersDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (e.matches) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		};

		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});
</script>

<svelte:head><title>Agentarr</title><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
