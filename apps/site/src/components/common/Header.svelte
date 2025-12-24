<script lang="ts">
    let { changeActive }: { changeActive: (type: string) => void } = $props();
</script>

<div class="bg-zinc-700 p-2 flex gap-2 align-center items-center">
    <button class="px-2 py-1 rounded-md bg-zinc-500 hover:bg-zinc-600 transition-all duration-300 hover:cursor-pointer" onclick={() => changeActive('series')}>
        <p>Series</p>
    </button>

    <button class="px-2 py-1 rounded-md bg-zinc-500 hover:bg-zinc-600 transition-all duration-300 hover:cursor-pointer" onclick={() => changeActive('agents')}>
        <p>Agents</p>
    </button>
</div>