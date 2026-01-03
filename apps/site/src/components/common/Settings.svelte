<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { settings } from '$stores/settings';
</script>

<div class="flex flex-col gap-2 border-t border-border p-4">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<Label for="debug">Debug</Label>
			<Switch
				id="debug"
				checked={$settings.debug}
				onCheckedChange={() => settings.toggle('debug')}
			/>
		</div>
		<span class="text-sm text-muted-foreground">Enable debug mode</span>
	</div>
</div>
