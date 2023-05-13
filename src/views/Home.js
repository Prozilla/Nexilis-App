import { Component } from "react";
import { View } from "react-native";
import Styles from "../constants/Styles";
import Logo from "../components/header/Logo";

export default class Home extends Component {
	render() {
		return (
			<View style={[Styles.container, {
				flexDirection: "column"
			}]}>
				<Logo size={100}/>
			</View>
		);
	}
}