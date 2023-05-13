import { Text } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import Logo from "./Logo";
import StyledPressable from "../styled/StyledTouchableOpacity";

export default class HeaderLeft extends Component {
	logoPress() {
		console.log("Logo pressed");
	}

	render() {
		return (
			<StyledPressable onPress={this.logoPress} style={[Styles.headerSection, { marginLeft: 10 }]}>
				<Logo/>
				<Text style={[Styles.text, Styles.heading, {
					fontSize: 20
				}]}>Nexilis</Text>
			</StyledPressable>
		);
	}
}