import Styles from "../constants/Styles";
import Feed from "../components/feed/Feed";
import FooterView from "../components/footer/FooterView";

export default function HomeScreen(props) {
	return (
		<FooterView style={Styles.screen} navigation={props.navigation}>
			<Feed style={Styles.container} navigation={props.navigation}/>
		</FooterView>
	);
}