import { Text } from "react-native";
import Styles from "../constants/Styles";
import FooterView from "../components/footer/FooterView";
import { search } from "../features/reddit";

export default function SearchScreen() {
	search.any("minecraft");

	return (
		<FooterView style={Styles.screen}>
			<Text style={Styles.text}>This page is a WIP.</Text>
		</FooterView>
	);
}