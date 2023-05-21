import Styles from "../constants/Styles";
import Feed from "../components/feed/Feed";
import FooterView from "../components/footer/FooterView";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
	const navigation = useNavigation();
	
	return (
		<FooterView style={Styles.screen}>
			<Feed style={Styles.container} navigation={navigation}/>
		</FooterView>
	);
}