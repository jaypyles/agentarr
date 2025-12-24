import { api } from '$lib/api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const series = await api.get('/sonarr/get-series').then((res) => res.data);
		return new Response(JSON.stringify(series), {
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
