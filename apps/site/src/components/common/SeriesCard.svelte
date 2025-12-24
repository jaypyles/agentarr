<script lang="ts">
    import type { SonarrSeries } from '@repo/global-types';
    let { series }: {series: SonarrSeries} = $props();
    const poster = $derived(series.images?.find((image) => image.coverType === 'poster'));
</script>

<div class="bg-zinc-800 p-4 rounded-md w-64 h-96 hover:shadow-2xl transition-all duration-300">
    <img src={poster?.remoteUrl} alt={series.title} class="w-full h-full object-contain" />
</div>