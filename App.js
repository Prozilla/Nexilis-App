import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Component } from "react";
import HomeScreen from "./src/screens/Home.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./src/constants/Colors.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faBars, faComment, faGear, faHeart, faHouse, faMagnifyingGlass, faShuffle, faUser } from "@fortawesome/free-solid-svg-icons";
import HeaderTitle from "./src/components/header/HeaderTitle.js";
import HeaderRight from "./src/components/header/HeaderRight.js";
import * as Font from 'expo-font';
import PostScreen from "./src/screens/Post.js";
import HeaderLeft from "./src/components/header/HeaderLeft.js";
import { user } from "./src/index.js";
import AccountScreen from "./src/screens/Account.js";
import Routes from "./src/constants/Routes.js";

const Stack = createNativeStackNavigator();
library.add(faMagnifyingGlass, faHeart, faComment, faShuffle, faArrowLeft, faUser, faHouse, faGear);

let fonts = {
	"Roboto-Regular": require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
	"Roboto-Bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
}

export default class App extends Component {
	state = {
		fontsLoaded: false,
		userData: null
	};
		
	async loadFontsAsync() {
		await Font.loadAsync(fonts);
		this.setState({ fontsLoaded: true });
	}

	async checkServer() {
		console.log(await fetch("http://localhost:3000/api/fetch", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				url: "https://www.reddit.com/api/v1/access_token",
				method: "POST",
				body: {
					grant_type: "authorization_code",
					code: "code",
					redirectUri: "redirectUri",
				}
			})
		}).then((response) => response.text()))
	}

	async loadUserData() {
		this.setState({ userData: await user.fetchIdentity() });
	}

	componentDidMount() {
		this.loadFontsAsync();
		this.loadUserData();
		// this.checkServer();
	}
	
	render() {
		if (!this.state.fontsLoaded)
			return null;

		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName={Routes.HOME}
						screenOptions={({ navigation }) => ({
							headerTitleAlign: "left",
							headerStyle: {
								backgroundColor: Colors.background.primary,
								height: 50,
								borderBottomColor: Colors.background.tertiary,
								borderBottomWidth: 2
							},
							headerTintColor: Colors.text.primary,
							headerShadowVisible: true,
							headerLeft: (props) => <HeaderLeft {...props} navigation={navigation}/>,
							headerTitle: (props) => <HeaderTitle {...props} navigation={navigation}/>,
							headerRight: (props) => <HeaderRight {...props} navigation={navigation} userData={this.state.userData}/>,
							fullScreenGestureEnabled: true,
							animationDuration: 250,
						})}
					>
						<Stack.Screen name={Routes.HOME} component={HomeScreen}/>
						<Stack.Screen name={Routes.POST} component={PostScreen}/>
						<Stack.Screen name={Routes.ACCOUNT} component={AccountScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar/>
			</SafeAreaProvider>
		);
	}
}