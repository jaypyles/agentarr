import type { RequestHandler } from './$types';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export const GET: RequestHandler = async ({ params, url, request }) => {
	const query = url.searchParams.toString();
	const targetUrl = `${API_BASE_URL}/${params.path}${query ? `?${query}` : ''}`;

	const headers = new Headers();
	request.headers.forEach((value, key) => {
		if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
			headers.set(key, value);
		}
	});

	const backendResponse = await fetch(targetUrl, {
		method: 'GET',
		headers
	});

	return new Response(backendResponse.body, {
		status: backendResponse.status,
		headers: {
			...Object.fromEntries(backendResponse.headers),
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
