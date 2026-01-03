<script lang="ts">
	let { poster, children }: { poster: string; children: any } = $props();
</script>

<div
	class="!min-[1080px]:w-64 !min-[1440px]:w-72 relative aspect-2/3 rounded-md bg-zinc-800 p-2 transition-all duration-300 hover:shadow-2xl"
>
	<img src={poster} alt="Poster" class="h-full w-full object-contain" />
	<div class="absolute right-2 bottom-2 flex gap-2">
		{@render children()}
	</div>
</div>
