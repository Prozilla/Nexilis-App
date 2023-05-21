import * as React from "react";
import { Button, View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { user } from "../features/reddit";
import { reddit } from "../../config";
import { DISCOVERY, SCOPES, fetchAccessToken } from "../features/reddit/auth";

WebBrowser.maybeCompleteAuthSession();

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