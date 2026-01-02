<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	const log = $state<any[]>([]);
	let query = $state('');
	let source: EventSource | null = null;

	const urlParams = $derived(new URLSearchParams(window.location.search));
	const isManagement = $derived(urlParams.get('option') === 'management');
	const fileName = $derived(urlParams.get('fileName') || '');

	let activeAgent = $state<string>('series');
	const setActiveAgent = (agent: string) => {
		activeAgent = agent;
	};

	const getAgentUrl = (agent: string) => {
		const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

		switch (agent) {
			case 'series':
				return `${apiUrl}/agent/add-series?query=`;
			case 'movie':
				return `${apiUrl}/agent/add-movie?query=`;
			case 'management':
				return `${apiUrl}/agent/move-files?query=`;
		}
	};

	const handleAgentInput = () => {
		// Clear previous logs
		log.length = 0;

		// Close old connection if any
		source?.close();

		source = new EventSource(
			`${getAgentUrl(activeAgent)}` +
				encodeURIComponent(query)
		);

		source.onmessage = (event) => {
			const data = JSON.parse(event.data);
			log.push(data);

			// Auto-close when workflow ends
			if (data.status === 'end') {
				source?.close();
			}
		};

		source.onerror = (err) => {
			console.error('SSE error', err);
			source?.close();
		};
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'end':
				return 'text-green-400 dark:text-green-500';
			case 'error':
				return 'text-destructive';
			default:
				return 'text-white';
		}
	};

	const agents = [
		{
			name: 'Series Agent',
			example: 'Add Family Guy to my library or add my next missing season of The Office',
			key: 'series',
			description: 'Agent for adding tv series'
		},
		{
			name: 'Movie Agent',
			example: 'Add The Matrix to my library',
			key: 'movie',
			description: 'Agent for adding movies'
		},
		{
			name: 'Media Management Agent',
			example: 'Move The Flash S1 to the correct location',
			key: 'management',
			description: 'Agent for managing media'
		}
	];

	$effect(() => {
		if (isManagement) {
			activeAgent = 'management';
			if (fileName) {
				query = `Move ${fileName} to the correct location`;
			}
		} else {
			// Only reset to 'series' if not already set by URL params
			const urlAgent = urlParams.get('agent');
			if (urlAgent && ['series', 'movie', 'management'].includes(urlAgent)) {
				activeAgent = urlAgent;
			} else if (!activeAgent) {
				activeAgent = 'series';
			}
		}
	});
</script>

<div class="flex h-full flex-col gap-6 overflow-hidden">
	<!-- Input Section -->
	<div
		class="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm dark:bg-card/50 dark:shadow-lg"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex size-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					class="text-primary dark:text-primary-foreground"
				>
					<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
						<path
							d="m15.5 9l.172.172c1.333 1.333 2 2 2 2.828s-.667 1.495-2 2.828L15.5 15m-2.206-7.83L12 12l-1.294 4.83M8.5 9l-.172.172c-1.333 1.333-2 2-2 2.828s.667 1.495 2 2.828L8.5 15"
						/>
						<path
							d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
						/>
					</g>
				</svg>
			</div>
			<div class="flex-1">
				<h2 class="text-lg font-semibold text-card-foreground">Agent Command</h2>
				<p class="text-sm text-muted-foreground">Send instructions to the agent</p>
			</div>
		</div>
		<div class="flex gap-3">
			<textarea
				class="flex min-h-[100px] w-full min-w-0 rounded-md border border-input bg-background px-4 py-3 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/40 dark:text-foreground"
				bind:value={query}
				placeholder={agents.find((a) => a.key === activeAgent)?.example}
				onkeydown={(e) => {
					if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
						handleAgentInput();
					}
				}}
			></textarea>
			<Button onclick={handleAgentInput} disabled={!query.trim()} size="lg" class="self-end">
				Send
			</Button>
		</div>

		<div class="flex gap-2">
			{#each agents as agent}
				<Button
					class={`flex h-16 flex-col items-start ${agent.key === activeAgent ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
					variant="outline"
					size="sm"
					onclick={() => setActiveAgent(agent.key)}
				>
					<p>{agent.name}</p>
					<p class="text-xs text-muted-foreground">{agent.description}</p>
				</Button>
			{/each}
		</div>
	</div>

	<!-- Log Section -->
	<div
		class="flex flex-1 flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card shadow-sm dark:bg-card/50 dark:shadow-lg"
	>
		<div
			class="flex items-center justify-between border-b border-border px-6 py-4 dark:border-border/50"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex size-8 items-center justify-center rounded-full bg-secondary dark:bg-secondary/80"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						class="text-secondary-foreground dark:text-secondary-foreground"
					>
						<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
							<path
								d="m15.5 9l.172.172c1.333 1.333 2 2 2 2.828s-.667 1.495-2 2.828L15.5 15m-2.206-7.83L12 12l-1.294 4.83M8.5 9l-.172.172c-1.333 1.333-2 2-2 2.828s.667 1.495 2 2.828L8.5 15"
							/>
							<path
								d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
							/>
						</g>
					</svg>
				</div>
				<div>
					<h3 class="text-base font-semibold text-card-foreground">Agent Log</h3>
					<p class="text-xs text-muted-foreground">
						{log.length}
						{log.length === 1 ? 'entry' : 'entries'}
					</p>
				</div>
			</div>
			{#if log.length > 0}
				<Button
					variant="ghost"
					size="sm"
					onclick={() => {
						log.length = 0;
					}}
				>
					Clear
				</Button>
			{/if}
		</div>
		<div class="flex-1 overflow-y-auto px-6 pb-6">
			{#if log.length === 0}
				<div class="flex h-full items-center justify-center">
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted dark:bg-muted/50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								class="text-muted-foreground dark:text-muted-foreground/70"
							>
								<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
									<path
										d="m15.5 9l.172.172c1.333 1.333 2 2 2 2.828s-.667 1.495-2 2.828L15.5 15m-2.206-7.83L12 12l-1.294 4.83M8.5 9l-.172.172c-1.333 1.333-2 2-2 2.828s.667 1.495 2 2.828L8.5 15"
									/>
									<path
										d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
									/>
								</g>
							</svg>
						</div>
						<p class="text-sm font-medium text-card-foreground">No log entries yet</p>
						<p class="mt-1 text-xs text-muted-foreground">Send a command to see agent activity</p>
					</div>
				</div>
			{:else}
				<div class="flex flex-col gap-3">
					{#each log as l, index}
						<div
							class="group flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:border-border/50 dark:bg-muted/20 dark:hover:bg-muted/30"
						>
							<div class="mt-0.5 flex shrink-0">
								<div
									class="flex size-8 items-center justify-center rounded-full bg-background dark:bg-background/80"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										class={getStatusColor(l.status)}
									>
										<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
											<path
												d="m15.5 9l.172.172c1.333 1.333 2 2 2 2.828s-.667 1.495-2 2.828L15.5 15m-2.206-7.83L12 12l-1.294 4.83M8.5 9l-.172.172c-1.333 1.333-2 2-2 2.828s.667 1.495 2 2.828L8.5 15"
											/>
											<path
												d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
											/>
										</g>
									</svg>
								</div>
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm leading-relaxed text-card-foreground">{l.message}</p>
								{#if l.status}
									<div class="mt-2 flex items-center gap-2">
										<span
											class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {l.status ===
											'end'
												? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
												: l.status === 'error'
													? 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
													: l.status === 'info'
														? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
														: 'bg-primary/10 text-primary-foreground dark:bg-primary/20 dark:text-primary'}"
										>
											{l.status}
										</span>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
