/**
 * NOTE: The proxy URL needs to be secure to work on iOS
 * See: https://reactnative.dev/docs/network
 */
const PROXY_URL = "http://localhost:3000/api/fetch";

export default async function fetchProxied(url, options) {
	options.url = url;

	return await fetch(PROXY_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(options)
	}).catch(console.error);
}