<script lang="ts">
	import Cube from '$components/icons/Cube.svelte';
	import DashedCube from '$components/icons/DashedCube.svelte';
	import { api } from '$lib/api';
	import { apps } from '$stores/apps';
	import type { Torrent, TransferInfo } from '@repo/global-types';
	import ConnectedTo from '../common/ConnectedTo.svelte';

	let torrents = $state<Torrent[]>([]);
	let transferInfo = $state<TransferInfo | null>(null);
	let loading = $state(false);
	let clearing = $state(false);
	let error = $state<string | null>(null);
	let refreshInterval: ReturnType<typeof setInterval> | null = null;

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
	};

	const formatSpeed = (bytesPerSecond: number): string => {
		return `${formatBytes(bytesPerSecond)}/s`;
	};

	const formatTime = (seconds: number): string => {
		if (seconds < 0 || !isFinite(seconds)) return '∞';
		if (seconds === 0) return '0s';
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${secs}s`;
		}
		return `${secs}s`;
	};

	const getStateColor = (state: string): string => {
		switch (state.toLowerCase()) {
			case 'downloading':
				return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
			case 'uploading':
			case 'seeding':
				return 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400';
			case 'paused':
				return 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
			case 'error':
				return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400';
			case 'completed':
			case 'queued':
				return 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
			default:
				return 'bg-muted text-muted-foreground';
		}
	};

	const fetchData = async () => {
		try {
			loading = true;
			error = null;
			const [torrentsRes, transferInfoRes] = await Promise.all([
				api.get('/download/list'),
				api.get('/download/torrents')
			]);
			torrents = torrentsRes.data;
			transferInfo = transferInfoRes.data;
		} catch (err: any) {
			console.error('Failed to fetch download data:', err);
			error = err.response?.data?.message || err.message || 'Failed to fetch download data';
		} finally {
			loading = false;
		}
	};

	const clearTorrents = async () => {
		if (clearing) return;
		try {
			clearing = true;
			error = null;
			await api.delete('/download/torrents');
			await fetchData();
		} catch (err: any) {
			console.error('Failed to clear torrents:', err);
			error = err.response?.data?.message || err.message || 'Failed to clear torrents';
		} finally {
			clearing = false;
		}
	};

	$effect(() => {
		fetchData();
		refreshInterval = setInterval(fetchData, 5000);
		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval);
			}
		};
	});
</script>

<div
	class="flex h-full w-full flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm dark:bg-card/50 dark:shadow-lg"
>
	<!-- Header with Transfer Info -->
	<div class="flex items-center justify-between border-b border-border pb-4 dark:border-border/50">
		<div class="flex w-full flex-col gap-2">
			<div class="flex w-full justify-between">
				<h2 class="text-xl font-semibold text-card-foreground">Download Client</h2>
				<button
					type="button"
					class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-solid bg-muted px-3 py-1 hover:bg-muted-foreground/20 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={clearing}
					onclick={clearTorrents}
				>
					{#if clearing}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="animate-spin"
						>
							<path
								d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 8.8-10.8M22 12.5a10 10 0 0 1-8.8 10.8"
							/>
						</svg>
						Clearing...
					{:else}
						Clear
					{/if}
				</button>
			</div>
			<div class="flex items-center gap-2">
				<ConnectedTo app={$apps.qbittorrent} />
			</div>
		</div>
	</div>

	{#if error}
		<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
			<p class="font-medium">Error</p>
			<p class="text-sm">{error}</p>
		</div>
	{:else if loading && torrents.length === 0}
		<div class="flex flex-1 items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted dark:bg-muted/50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="animate-spin text-muted-foreground"
					>
						<path
							d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 1 1 8.8-10.8M22 12.5a10 10 0 1 1-8.8 10.8"
						/>
					</svg>
				</div>
				<p class="text-sm font-medium text-card-foreground">Loading...</p>
			</div>
		</div>
	{:else}
		<!-- Transfer Stats -->
		{#if transferInfo}
			<div
				class="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/30 p-4 dark:border-border/50 dark:bg-muted/20"
			>
				<div class="flex flex-col gap-1">
					<div class="flex items-center gap-2">
						<Cube className="text-blue-500" />
						<span class="text-xs font-medium text-muted-foreground">Download</span>
					</div>
					<p class="text-lg font-semibold text-card-foreground">
						{formatSpeed(transferInfo.dl_info_speed)}
					</p>
					<p class="text-xs text-muted-foreground">
						Total: {formatBytes(transferInfo.dl_info_data)}
					</p>
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex items-center gap-2">
						<DashedCube className="text-green-500" />
						<span class="text-xs font-medium text-muted-foreground">Upload</span>
					</div>
					<p class="text-lg font-semibold text-card-foreground">
						{formatSpeed(transferInfo.up_info_speed)}
					</p>
					<p class="text-xs text-muted-foreground">
						Total: {formatBytes(transferInfo.up_info_data)}
					</p>
				</div>
			</div>
		{/if}

		<!-- Torrent List -->
		<div class="flex-1 overflow-hidden">
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-semibold text-card-foreground">
					Torrents ({torrents.length})
				</h3>
			</div>
			<div class="h-full overflow-y-auto">
				{#if torrents.length === 0}
					<div class="flex h-full items-center justify-center">
						<div class="text-center">
							<div
								class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted dark:bg-muted/50"
							>
								<Cube className="text-muted-foreground dark:text-muted-foreground/70 size-8" />
							</div>
							<p class="text-sm font-medium text-card-foreground">No torrents</p>
							<p class="mt-1 text-xs text-muted-foreground">No active downloads</p>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-2">
						{#each torrents as torrent}
							<div
								class="group rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50 dark:border-border/50 dark:bg-muted/20 dark:hover:bg-muted/30"
							>
								<!-- Torrent Header -->
								<div class="mb-3 flex items-start justify-between gap-4">
									<div class="min-w-0 flex-1">
										<h4 class="truncate font-medium text-card-foreground">{torrent.name}</h4>
										<div class="mt-1 flex items-center gap-2">
											<span
												class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getStateColor(
													torrent.state
												)}"
											>
												{torrent.state}
											</span>
											<span class="text-xs text-muted-foreground">
												{formatBytes(torrent.size)}
											</span>
										</div>
									</div>
								</div>

								<!-- Progress Bar -->
								<div class="mb-3">
									<div class="mb-1 flex items-center justify-between text-xs">
										<span class="text-muted-foreground">Progress</span>
										<span class="font-medium text-card-foreground">
											{(torrent.progress * 100).toFixed(1)}%
										</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/50">
										<div
											class="h-full bg-primary transition-all duration-300"
											style="width: {torrent.progress * 100}%"
										></div>
									</div>
								</div>

								<!-- Stats Grid -->
								<div class="grid grid-cols-2 gap-4 text-xs">
									<div>
										<span class="text-muted-foreground">Download Speed:</span>
										<p class="font-medium text-card-foreground">
											{formatSpeed(torrent.dlspeed)}
										</p>
									</div>
									<div>
										<span class="text-muted-foreground">Upload Speed:</span>
										<p class="font-medium text-card-foreground">
											{formatSpeed(torrent.upspeed)}
										</p>
									</div>
									<div>
										<span class="text-muted-foreground">ETA:</span>
										<p class="font-medium text-card-foreground">{formatTime(torrent.eta)}</p>
									</div>
									<div>
										<span class="text-muted-foreground">Ratio:</span>
										<p class="font-medium text-card-foreground">
											{torrent.ratio.toFixed(2)}
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
