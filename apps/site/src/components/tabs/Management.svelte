<script lang="ts">
	import { api } from '$lib/api';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import FileIcon from '@lucide/svelte/icons/file';
	import FileSymlink from '@lucide/svelte/icons/file-symlink';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import HomeIcon from '@lucide/svelte/icons/home';
	import type { Mounts } from '@repo/global-types';

	type FileEntry = {
		name: string;
		path: string;
		isDirectory: boolean;
		isFile: boolean;
	};

	let { mounts }: { mounts: Mounts } = $props();
	let currentPath = $state<string>('');
	let currentFiles = $state<FileEntry[]>([]);
	let pathHistory = $state<string[]>([]);
	let loading = $state(false);

	const getFiles = async (path: string) => {
		loading = true;
		try {
			const response = await api.get(`/management/files?path=${encodeURIComponent(path)}`);
			currentFiles = response.data.sort((a: FileEntry, b: FileEntry) => {
				// Directories first, then files, both alphabetically
				if (a.isDirectory && !b.isDirectory) return -1;
				if (!a.isDirectory && b.isDirectory) return 1;
				return a.name.localeCompare(b.name);
			});
		} catch (error) {
			console.error('Failed to fetch files:', error);
			currentFiles = [];
		} finally {
			loading = false;
		}
	};

	const navigateToPath = (path: string) => {
		currentPath = path;
		pathHistory = [path];
		getFiles(path);
	};

	const navigateToDirectory = (path: string) => {
		currentPath = path;
		pathHistory.push(path);
		getFiles(path);
	};

	const navigateBack = () => {
		if (pathHistory.length > 1) {
			pathHistory.pop();
			const newPath = pathHistory[pathHistory.length - 1];
			currentPath = newPath;
			getFiles(newPath);
		}
	};

	const getPathParts = (fullPath: string) => {
		const parts = fullPath.split('/').filter(Boolean);
		return parts;
	};

	const getFileIcon = (file: FileEntry) => {
		if (file.isDirectory) return FolderIcon;
		return FileIcon;
	};

	const getFileExtension = (filename: string) => {
		const parts = filename.split('.');
		return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
	};

	const handleClickMoveIcon = (fileName: string, e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const params = new URLSearchParams({
			tab: 'agents',
			option: 'management',
			fileName: fileName
		});
		window.location.href = `/?${params.toString()}`;
	};

	$effect(() => {
		if (!currentPath && mounts.tv) {
			currentPath = mounts.tv;
			pathHistory = [mounts.tv];
		}
		if (currentPath) {
			getFiles(currentPath);
		}
	});
</script>

<div
	class="flex h-full min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm dark:bg-card/50 dark:shadow-lg"
>
	<!-- Mount Points -->
	<div class="flex flex-wrap gap-2 border-b border-border pb-4">
		<button
			onclick={() => navigateToPath(mounts.tv)}
			class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted-foreground/10 {currentPath ===
			mounts.tv
				? 'bg-muted-foreground/20'
				: ''}"
		>
			<HomeIcon class="h-4 w-4" />
			<span>TV</span>
		</button>
		<button
			onclick={() => navigateToPath(mounts.movies)}
			class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted-foreground/10 {currentPath ===
			mounts.movies
				? 'bg-muted-foreground/20'
				: ''}"
		>
			<HomeIcon class="h-4 w-4" />
			<span>Movies</span>
		</button>
		<button
			onclick={() => navigateToPath(mounts.downloads)}
			class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted-foreground/10 {currentPath ===
			mounts.downloads
				? 'bg-muted-foreground/20'
				: ''}"
		>
			<HomeIcon class="h-4 w-4" />
			<span>Downloads</span>
		</button>
	</div>

	<!-- Breadcrumb Navigation -->
	<div class="flex items-center gap-2 text-sm text-muted-foreground">
		<button
			onclick={navigateBack}
			disabled={pathHistory.length <= 1}
			class="flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-muted-foreground/10 disabled:cursor-not-allowed disabled:opacity-50"
		>
			← Back
		</button>
		<div class="flex items-center gap-1">
			{#each getPathParts(currentPath) as part, index}
				<ChevronRightIcon class="h-4 w-4" />
				<span class="font-medium">{part}</span>
			{/each}
		</div>
	</div>

	<!-- File List -->
	<div class="flex-1 overflow-y-auto">
		{#if loading}
			<div class="flex items-center justify-center py-8">
				<p class="text-muted-foreground">Loading...</p>
			</div>
		{:else if currentFiles.length === 0}
			<div class="flex items-center justify-center py-8">
				<p class="text-muted-foreground">No files found</p>
			</div>
		{:else}
			<div class="flex flex-col gap-1">
				{#each currentFiles as file}
					{@const Icon = getFileIcon(file)}
					<button
						onclick={() => file.isDirectory && navigateToDirectory(file.path)}
						disabled={!file.isDirectory}
						class="flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-muted-foreground/10 disabled:cursor-default disabled:hover:bg-transparent {file.isDirectory
							? 'cursor-pointer'
							: 'cursor-default'}"
					>
						<Icon
							class="h-5 w-5 shrink-0 {file.isDirectory
								? 'text-blue-400'
								: 'text-muted-foreground'}"
						/>
						<span class="flex-1 truncate font-medium">{file.name}</span>
						<FileSymlink
							class="h-5 w-5 shrink-0 text-muted-foreground"
							onclick={(e: MouseEvent) => handleClickMoveIcon(file.name, e)}
						/>
						{#if file.isFile}
							<span class="text-xs text-muted-foreground">{getFileExtension(file.name)}</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
