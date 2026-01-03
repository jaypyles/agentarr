import axios from 'axios';

export const api = axios.create({
	baseURL: '/api'
});

export const apiServer = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
});
