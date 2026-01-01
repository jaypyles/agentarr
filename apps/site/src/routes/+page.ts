import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/');
	const { series, movies, mounts } = await res.json();
	return { series, movies, mounts };
};
