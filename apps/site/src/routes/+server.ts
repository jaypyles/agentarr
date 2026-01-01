import { api } from '$lib/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const promises = [
		api.get('/sonarr/get-series', { headers: { 'Cache-Control': '3600' } }).then((res) => res.data),
		api.get('/radarr/get-movies', { headers: { 'Cache-Control': '3600' } }).then((res) => res.data),
		api.get('/management/mounts', { headers: { 'Cache-Control': '3600' } }).then((res) => res.data)
	];

	try {
		const [series, movies, mounts] = await Promise.all(promises);
		return new Response(JSON.stringify({ series, movies, mounts }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch series' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
