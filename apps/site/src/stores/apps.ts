import { browser } from '$app/environment';
import type { Apps } from '@repo/global-types';
import { writable } from 'svelte/store';

function createAppsStore() {
	const { subscribe, set } = writable<Apps>({
		sonarr: '',
		radarr: '',
		prowlarr: '',
		jellyfin: '',
		qbittorrent: ''
	});

	let loaded = false;

	async function load() {
		if (loaded) return;
		loaded = true;

		if (browser) {
			console.warn(
				'apps.load() should not be called in the browser. Apps data should be loaded server-side.'
			);
			return;
		}
	}

	function initialize(data: Apps) {
		set(data);
		loaded = true;
	}

	return {
		subscribe,
		load,
		initialize
	};
}

export const apps = createAppsStore();
