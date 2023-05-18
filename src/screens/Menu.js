import * as React from "react";
import { Button, Platform, View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { AccessTokenRequest, exchangeCodeAsync, makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { user } from "..";
import fetchProxied from "../utils/proxy";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
	authorizationEndpoint: "https://www.reddit.com/api/v1/authorize.compact",
	tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};

const clientIds = {
	"exp://192.168.0.180:19000": "sPkxYwuR4dDRTVO9uB1jGw",
	"http://localhost:19006": "_RXhpFBgKb1kste3RGJTlg",
	"nexilis://redirect": "kXGu9uyC8hl9PIsff9Zqfg"
};

async function fetchAccessToken(code, clientId, redirectUri) {
	await fetchProxied(discovery.tokenEndpoint + "?duration=permanent", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Basic ${btoa(clientId + ":")}`
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

export default function MenuScreen() {
	const redirectUri = makeRedirectUri({
		scheme: "nexilis://redirect",
	});

	const clientId = clientIds[redirectUri] ?? clientIds["nexilis://redirect"];

	const [request, response, promptAsync] = useAuthRequest(
		{
			responseType: ResponseType.Code,
			clientId,
			redirectUri,
			scopes: ["identity", "edit", "subscribe", "save", "submit", "read", "account", "vote", "mysubreddits"],
			extraParams: {
				duration: "permanent"
			},
		},
		discovery
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