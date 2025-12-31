import { writable, type Writable } from 'svelte/store';

interface Persisted<T> {
	value: T;
	expires: number;
}

export function ttlStore<T>(key: string, initialValue: T, ttlMs: number): Writable<T> {
	let startValue: T = initialValue;

	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(key);

		if (stored) {
			try {
				const parsed: Persisted<T> = JSON.parse(stored);
				if (parsed.expires > Date.now()) {
					startValue = parsed.value;
				} else {
					localStorage.removeItem(key);
				}
			} catch (e) {
				console.warn('Failed to parse persisted store', e);
			}
		}
	}

	const store = writable<T>(startValue);

	// Debounce localStorage writes to prevent blocking the UI
	let writeTimeout: ReturnType<typeof setTimeout> | null = null;
	let pendingValue: T | null = null;

	store.subscribe((value) => {
		if (typeof window !== 'undefined') {
			pendingValue = value;

			// Clear existing timeout
			if (writeTimeout) {
				clearTimeout(writeTimeout);
			}

			// Debounce writes by 100ms - batches rapid updates
			writeTimeout = setTimeout(() => {
				if (pendingValue !== null) {
					const data: Persisted<T> = {
						value: pendingValue,
						expires: Date.now() + ttlMs
					};
					localStorage.setItem(key, JSON.stringify(data));
					pendingValue = null;
				}
				writeTimeout = null;
			}, 100);
		}
	});

	return store;
}
