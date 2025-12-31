<script lang="ts">
	let { poster, children }: { poster: string, children: any } = $props();
</script>

<div
	class="relative h-96 w-64 rounded-md bg-zinc-800 p-4 transition-all duration-300 hover:shadow-2xl"
>
	<img src={poster} alt="Poster" class="h-full w-full object-contain" />
	<div class="absolute bottom-2 right-2 flex gap-2">
        {@render children()}
	</div>
</div>
