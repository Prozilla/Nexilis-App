import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Component } from "react";
import HomeScreen from "./src/screens/Home.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./src/constants/Colors.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faBars, faComment, faHeart, faMagnifyingGlass, faShuffle } from "@fortawesome/free-solid-svg-icons";
import HeaderTitle from "./src/components/header/HeaderTitle.js";
import HeaderRight from "./src/components/header/HeaderRight.js";
import * as Font from 'expo-font';
import PostScreen from "./src/screens/Post.js";
import HeaderLeft from "./src/components/header/HeaderLeft.js";
import MenuScreen from "./src/screens/Menu.js";

const Stack = createNativeStackNavigator();
library.add(faMagnifyingGlass, faBars, faHeart, faComment, faShuffle, faArrowLeft);

let fonts = {
	"Roboto-Regular": require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
	"Roboto-Bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
}

export default class App extends Component {
	state = {
		fontsLoaded: false,
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

	componentDidMount() {
		this.loadFontsAsync();
		this.checkServer();
	}
	
	render() {
		if (!this.state.fontsLoaded)
			return null;

		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName="Home"
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
							headerRight: (props) => <HeaderRight {...props} navigation={navigation}/>,
							fullScreenGestureEnabled: true,
							animationDuration: 250
						})}
					>
						<Stack.Screen name="Home" component={HomeScreen}/>
						<Stack.Screen name="Post" component={PostScreen}/>
						<Stack.Screen name="Menu" component={MenuScreen}/>
					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar/>
			</SafeAreaProvider>
		);
	}
}