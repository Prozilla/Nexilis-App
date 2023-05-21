import { user } from ".";
import fetchProxied from "../utils/proxy";
import { encodeBase64 } from "../utils/utils";

/**
 * Reddit authorization process:
 * 1. Fetch authorization code with given scopes and client ID
 * 2. Use code to fetch access token and refresh token
 * 3. When access token expires, use refresh token to get a new one
 */

export const SCOPES = ["identity", "edit", "subscribe", "save", "submit", "read", "account", "vote", "mysubreddits"];

export const DISCOVERY = {
	authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
	tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};

export async function fetchAccessToken(code, clientId, redirectUri) {
	await fetchProxied(DISCOVERY.tokenEndpoint + "?duration=permanent", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Basic ${encodeBase64(clientId + ":")}`
		},
		body: {
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
		},
		type: "form"
	}).then(response => response?.json()).then((response) => {
		if (response?.access_token) {
			user.setAccessToken(response.access_token);
			user.setRefreshToken(response.refresh_token);
		}
	}).catch(console.error);
}