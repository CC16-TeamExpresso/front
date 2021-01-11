//created this simple fetch wrapper instead of axios

export const IS_DEVELOPMENT = window.location.hostname === 'localhost';
export const IS_PRODUCTION = !IS_DEVELOPMENT;

const API_URL = IS_PRODUCTION ? '' : 'http://localhost:8050'; // is there a better way to write this?

export async function apiCall(path: string, payload: { [key: string]: any }) {
	const res = await fetch(`${API_URL}${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': localStorage.getItem('token') || '', //check if we have jtw token which is created after each log-in
		},
		body: JSON.stringify(payload),
	}).then((t) => t.json());

	return res;
}
