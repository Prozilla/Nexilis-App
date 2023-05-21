import { View } from "react-native";
import Styles from "../constants/Styles";
import Post from "../components/feed/Post";

export default function PostScreen({ route }) {
	return (
		<View style={Styles.screen}>
			<Post data={route.params.data}/>
		</View>
	);
}