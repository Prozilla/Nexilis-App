import * as React from "react";
import { Button, Platform, View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { user } from "..";

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

	const [request, response, promptAsync] = useAuthRequest(
		{
			responseType: ResponseType.Token, // This should be changed to ResponseType.Code
			clientId,
			redirectUri,
			scopes: ["identity", "edit", "subscribe", "save", "submit", "read", "account", "vote", "mysubreddits"],
			extraParams: {
				// duration: "permanent"
			}
		},
		discovery
	  );
	
	React.useEffect(() => {
		console.log(response);

		if (response?.type === "success") {
			const { code, access_token } = response.params;

			if (access_token) {
				user.setAccessToken(access_token);
				user.fetchIdentity();
			}

			// This needs to happen on the server
			// fetch(discovery.tokenEndpoint, {
			// 	method: "POST",
			// 	mode: "cors",
			// 	headers: {
			// 		"Accept": "application/json",
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		grant_type: "authorization_code",
			// 		code,
			// 		redirectUri,
			// 	})
			// }).then(response => response.json()).then((response) => {
			// 	console.log(response);
			// }).catch(console.error);
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