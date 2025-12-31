import { api } from '$lib/api';
import type { Apps } from '@repo/global-types';
import { writable } from 'svelte/store';

function createAppsStore() {
	const { subscribe, set } = writable<Apps>({
		sonarr: '',
		radarr: '',
		prowlarr: '',
		jellyfin: ''
	});

	let loaded = false;

	async function load() {
		if (loaded) return;
		loaded = true;

		const res = await api.get('/apps');
		set(res.data);
	}

	return {
		subscribe,
		load
	};
}

export const apps = createAppsStore();
