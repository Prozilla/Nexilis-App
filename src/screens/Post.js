import { Component } from "react";
import { View } from "react-native";
import Styles from "../constants/Styles";
import Post from "../components/feed/Post";

export default function PostScreen(props) {
	return (
		<View style={Styles.screen}>
			<Post data={props.route.params.data}/>
		</View>
	);
}