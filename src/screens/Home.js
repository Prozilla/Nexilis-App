import Styles from "../constants/Styles";
import Feed from "../components/feed/Feed";
import FooterView from "../components/footer/FooterView";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { devMode } from "../../config";

export default function HomeScreen() {
	const navigation = useNavigation();

	// Redirect
	useEffect(() => {
		if (__DEV__ && devMode.initialRouteOverride)
			navigation.navigate(devMode.initialRouteOverride);
	});
	
	return (
		<FooterView style={Styles.screen}>
			<Feed style={Styles.container} navigation={navigation}/>
		</FooterView>
	);
}