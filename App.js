import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Component, useCallback } from "react";
import Home from "./src/views/Home.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./src/constants/Colors.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import HeaderLeft from "./src/components/header/HeaderLeft.js";
import HeaderRight from "./src/components/header/HeaderRight.js";
import * as Font from 'expo-font';
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();
library.add(faMagnifyingGlass, faBars);

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

	componentDidMount() {
		this.loadFontsAsync();
	}
	
	render() {
		if (!this.state.fontsLoaded)
			return null;

		return (
			<SafeAreaProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Home" screenOptions={{
						headerStyle: {
							backgroundColor: Colors.background.tertiary,
							height: 50
						},
						headerTintColor: Colors.text.primary,
						headerShadowVisible: false,
						headerLeft: (props) => <HeaderLeft {...props}/>,
						headerTitle: "",
						headerRight: (props) => <HeaderRight {...props}/>,
					}}>
						<Stack.Screen
							name="Home"
							component={Home}
						/>
					</Stack.Navigator>
				</NavigationContainer>
				<StatusBar/>
			</SafeAreaProvider>
		);
	}
}