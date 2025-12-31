import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/');
	const { series, movies } = await res.json();
	return { series, movies };
};
