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
import PostScreen from "./src/screens/Post.js";
import HeaderLeft from "./src/components/header/HeaderLeft.js";
import AccountScreen from "./src/screens/Account.js";
import Routes from "./src/constants/Routes.js";
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from "react-native";
import { user } from "./src/features/reddit/index.js";
import { devMode } from "./config.js";
import useLoadedAssets from "./src/hooks/loadedAssets.js";
import { UserDataContext } from "./src/hooks/contexts.js";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
library.add(faMagnifyingGlass, faHeart, faComment, faShuffle, faArrowLeft, faUser, faHouse, faGear);

export default function App() {
	const isReady = useLoadedAssets();

	const [userData, setUserData] = useState(null);
	useEffect(() => {
		setUserData(user.identity);
	}, [user.identity]);

	const onLayoutRootView = useCallback(async () => {
		if (isReady)
			await SplashScreen.hideAsync();
	}, [isReady]);

	if (!isReady)
		return null;

	const safeAreaStyle = {};
	if (Platform.OS == "ios")
		safeAreaStyle.paddingBottom = 25;

	const initialRoute = (__DEV__ && devMode.initialRouteOverride) ? devMode.initialRouteOverride : Routes.HOME;

	return (
		<UserDataContext.Provider value={[userData, setUserData]}>
			<SafeAreaProvider onLayout={onLayoutRootView} style={safeAreaStyle}>
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName={initialRoute}
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
		</UserDataContext.Provider>
	);
}