import type { Settings } from '$lib/types';
import { persisted } from 'svelte-persisted-store';

const defaultSettings: Settings = {
	debug: false
};

const base = persisted<Settings>('settings', defaultSettings);

function toggle(key: keyof Settings) {
	console.log('toggle', key);
	base.update((s) => ({
		...s,
		[key]: !s[key]
	}));
}

export const settings = {
	...base,
	toggle
};
