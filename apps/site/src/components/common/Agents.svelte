<script lang="ts">
    const log = $state<any[]>([]);
    let query = $state("");

    let source: EventSource | null = null;

    const handleAgentInput = () => {
        // Clear previous logs
        log.length = 0;

        // Close old connection if any
        source?.close();

        source = new EventSource(
            `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/agent/add-series?query=` + encodeURIComponent(query)
             
        );

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            log.push(data);

            // Auto-close when workflow ends
            if (data.status === "end") {
                source?.close();
            }
        };

        source.onerror = (err) => {
            console.error("SSE error", err);
            source?.close();
        };
    };
</script>

<div class="flex h-full overflow-auto gap-4">
    <div class="flex gap-2 h-fit w-1/2">   
        <input class="border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" type="text" bind:value={query} />
        <button class="px-2 py-1 rounded-md bg-zinc-500 hover:bg-zinc-600 transition-all duration-300 hover:cursor-pointer" onclick={handleAgentInput}>Send</button>
    </div>
    <div>
        Agent log
        {#each log as l}
            <p>{l.message}</p>
        {/each}
    </div>
</div>