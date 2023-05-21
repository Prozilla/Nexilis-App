import * as React from "react";
import { Button, View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import fetchProxied from "../features/utils/proxy";
import { encodeBase64 } from "../features/utils/utils";
import { user } from "../features/reddit";
import { reddit } from "../../config";

WebBrowser.maybeCompleteAuthSession();

const SCOPES = ["identity", "edit", "subscribe", "save", "submit", "read", "account", "vote", "mysubreddits"];

const DISCOVERY = {
	authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
	tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};

async function fetchAccessToken(code, clientId, redirectUri) {
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

export default function AccountScreen() {
	const redirectUri = makeRedirectUri({
		scheme: "nexilis://redirect",
	});

	const clientId = reddit.clientIds[redirectUri] ?? reddit.clientIds["nexilis://redirect"];

	const [request, response, promptAsync] = useAuthRequest(
		{
			responseType: ResponseType.Code,
			clientId,
			redirectUri,
			scopes: SCOPES,
			extraParams: {
				duration: "permanent"
			},
		},
		DISCOVERY
	);

	React.useEffect(() => {
		if (response?.type === "success") {
			const { code, access_token } = response.params;

			if (access_token) {
				user.setAccessToken(access_token);
			} else if (code) {
				fetchAccessToken(code, clientId, redirectUri);
			}
		}
	}, [response]);

	return (
		<View style={[Styles.screen, Styles.container]}>
			<Button
				disabled={!request}
				title="Connect to Reddit"
				onPress={() => {
					promptAsync();
				}}
			/>
		</View>
	);
}