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

	const contentType = backendResponse.headers.get('content-type') || 'text/event-stream';
	const responseHeaders = new Headers();

	backendResponse.headers.forEach((value, key) => {
		responseHeaders.set(key, value);
	});

	responseHeaders.set('Content-Type', contentType);
	responseHeaders.set('Cache-Control', 'no-cache, no-transform');
	responseHeaders.set('Connection', 'keep-alive');
	responseHeaders.set('X-Accel-Buffering', 'no');
	responseHeaders.set('X-Content-Type-Options', 'nosniff');

	return new Response(backendResponse.body, {
		status: backendResponse.status,
		statusText: backendResponse.statusText,
		headers: responseHeaders
	});
};
