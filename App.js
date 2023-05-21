import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import HomeScreen from "./src/screens/Home.js";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./src/constants/Colors.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faComment, faGear, faHeart, faHouse, faMagnifyingGlass, faShuffle, faUser } from "@fortawesome/free-solid-svg-icons";
import HeaderTitle from "./src/components/header/HeaderTitle.js";
import HeaderRight from "./src/components/header/HeaderRight.js";
import * as Font from 'expo-font';
import PostScreen from "./src/screens/Post.js";
import HeaderLeft from "./src/components/header/HeaderLeft.js";
import AccountScreen from "./src/screens/Account.js";
import Routes from "./src/constants/Routes.js";
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from "react-native";
import { user } from "./src/features/reddit/index.js";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
library.add(faMagnifyingGlass, faHeart, faComment, faShuffle, faArrowLeft, faUser, faHouse, faGear);

let fonts = {
	"Roboto-Regular": require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
	"Roboto-Bold": require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
}

export default function App() {
	const [isReady, setIsReady] = useState(false);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		// Load fonts
		Font.loadAsync(fonts).then(() => {
			setIsReady(true);
		});

		// Load user data
		user.fetchIdentity().then((identity) => {
			setUserData(identity);
		});
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (isReady)
			await SplashScreen.hideAsync();
	}, [isReady]);

	if (!isReady)
		return null;

	const safeAreaStyle = {};

	if (Platform.OS == "ios")
		safeAreaStyle.paddingBottom = 25;

	return (
		<SafeAreaProvider onLayout={onLayoutRootView} style={safeAreaStyle}>
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
						headerRight: (props) => <HeaderRight {...props} navigation={navigation} userData={userData}/>,
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