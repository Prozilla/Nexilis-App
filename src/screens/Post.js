import { Component } from "react";
import { View } from "react-native";
import Styles from "../constants/Styles";
import Post from "../components/feed/Post";

export default class PostScreen extends Component {
	render() {
		return (
			<View style={Styles.screen}>
				<Post data={this.props.route.params.data}/>
			</View>
		);
	}
}