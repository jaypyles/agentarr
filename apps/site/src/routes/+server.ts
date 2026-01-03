import { apiServer } from '$lib/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const promises = [
		apiServer.get('/sonarr/get-series').then((res) => res.data),
		apiServer.get('/radarr/get-movies').then((res) => res.data),
		apiServer.get('/management/mounts').then((res) => res.data)
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
