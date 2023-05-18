import * as React from "react";
import { Button, Platform, View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";

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

export default function MenuScreen() {
	const redirectUri = makeRedirectUri({
		scheme: "nexilis://redirect",
	});

	const clientId = clientIds[redirectUri] ?? clientIds["nexilis://redirect"];

	console.log(clientId, redirectUri);

	const [request, response, promptAsync] = useAuthRequest(
		{
			responseType: "code",
			clientId,
			redirectUri,
			clientSecret: "",
			scopes: ["identity", "edit", "subscribe", "save", "submit", "read", "account", "vote", "mysubreddits"],
			extraParams: {
				"duration": "permanent"
			}
		},
		discovery
	);
	
	React.useEffect(() => {
		console.log(response);

		if (response?.type === "success") {
			const { code } = response.params;
			fetch(discovery.tokenEndpoint, {
				method: "POST",
				mode: "cors",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					grant_type: "authorization_code",
					code,
					redirectUri,
				})
			}).then(response => response.json()).then((response) => {
				console.log(response);
			}).catch(console.error);


			// Do something with code
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