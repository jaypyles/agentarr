<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';
	import Inspect from 'svelte-inspect-value';

	let { data, className }: { data: any; className?: string } = $props();
	console.log(data);
</script>

<Dialog.Root>
	<form>
		<Dialog.Trigger
			class={cn(
				buttonVariants({ variant: 'link' }),
				'bg-bg-accent/50 px-2 py-1 text-xs hover:bg-bg-accent/70',
				className
			)}>View Raw Data</Dialog.Trigger
		>

		<Dialog.Content class="!max-w-2xl">
			<Dialog.Header>
				<Dialog.Title>Raw Data</Dialog.Title>
			</Dialog.Header>
			<Inspect value={data} />
		</Dialog.Content>
	</form>
</Dialog.Root>
