import { View } from "react-native";
import Styles from "../constants/Styles";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { user } from "../features/reddit";
import { reddit } from "../../config";
import { DISCOVERY, SCOPES, fetchAccessToken, revokeAccessToken } from "../features/reddit/auth";
import Profile from "../components/account/Profile";
import StyledButton from "../components/styled/StyledButton";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../hooks/contexts";
import FooterView from "../components/footer/FooterView";

WebBrowser.maybeCompleteAuthSession();

export default function AccountScreen() {
	const [userData, setUserData] = useContext(UserDataContext);
	const isLoggedIn = (userData != null);

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

	useEffect(() => {
		if (response?.type === "success") {
			const { code, access_token } = response.params;

			if (access_token) {
				user.setAccessToken(access_token);
			} else if (code) {
				fetchAccessToken(code, clientId, redirectUri).then(() => {
					setUserData(user.identity);
				});
			}
		}
	}, [response]);

	const logIn = () => {
		promptAsync();
	};
	const logOut = () => {
		revokeAccessToken().then(() => {
			setUserData(null);
		});
	};

	return (
		<FooterView style={Styles.screen}>
			<View style={[Styles.container, { justifyContent: "flex-start", width: "100%" }]}>
				<Profile style={Styles.container}/>
				{
					isLoggedIn
					? <StyledButton title="Log out" onPress={logOut} style={{
						position: "absolute",
						bottom: 25
					}}/>
					: <StyledButton disabled={!request} title="Log in" onPress={logIn}/>
				}
			</View>
		</FooterView>
	);
}