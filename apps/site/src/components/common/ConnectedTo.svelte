<script lang="ts">
	let { app }: { app: string } = $props();
</script>

<p class="w-fit rounded-md bg-muted/50 px-2 py-1 text-sm text-muted-foreground">
	Currently connected to: <a href={app} target="_blank" class="text-primary">{app}</a>
</p>
