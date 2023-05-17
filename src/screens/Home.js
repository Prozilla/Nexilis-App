import { Component } from "react";
import { View } from "react-native";
import Styles from "../constants/Styles";
import Feed from "../components/feed/Feed";

export default class HomeScreen extends Component {
	render() {
		return (
			<View style={Styles.screen}>
				<Feed style={Styles.container} navigation={this.props.navigation}/>
			</View>
		);
	}
}