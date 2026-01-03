import type { RequestHandler } from './$types';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export const GET: RequestHandler = async ({ params, url, request }) => {
	return proxyRequest('GET', params.path, url, request);
};

export const POST: RequestHandler = async ({ params, url, request }) => {
	return proxyRequest('POST', params.path, url, request);
};

export const PUT: RequestHandler = async ({ params, url, request }) => {
	return proxyRequest('PUT', params.path, url, request);
};

export const PATCH: RequestHandler = async ({ params, url, request }) => {
	return proxyRequest('PATCH', params.path, url, request);
};

export const DELETE: RequestHandler = async ({ params, url, request }) => {
	return proxyRequest('DELETE', params.path, url, request);
};

async function proxyRequest(
	method: string,
	path: string,
	url: URL,
	request: Request
): Promise<Response> {
	try {
		// Build the target URL
		const queryString = url.searchParams.toString();
		const targetUrl = `${API_BASE_URL}/${path}${queryString ? `?${queryString}` : ''}`;

		// Get request body if present
		let body: BodyInit | undefined;
		if (method !== 'GET' && method !== 'HEAD') {
			body = await request.text();
		}

		// Forward headers (excluding host and connection)
		const headers = new Headers();
		request.headers.forEach((value, key) => {
			if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
				headers.set(key, value);
			}
		});

		// Make the proxied request
		const response = await fetch(targetUrl, {
			method,
			headers,
			body
		});

		// Get response body
		const responseBody = await response.text();

		// Forward response with status and headers
		return new Response(responseBody, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} catch (error) {
		console.error('Proxy error:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to proxy request',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
