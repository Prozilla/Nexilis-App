import { Component } from "react";
import { View } from "react-native";
import Styles from "../constants/Styles";
import Logo from "../components/header/Logo";
import { renderFeed } from "..";
import Feed from "../components/feed/Feed";

export default class Home extends Component {
	render() {
		return (
			<View style={[Styles.container, {
				flexDirection: "column"
			}]}>
				<Feed style={Styles.container}/>
			</View>
		);
	}
}