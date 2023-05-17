import { Text } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import Logo from "./Logo";
import StyledPressable from "../styled/StyledTouchableOpacity";

export default class HeaderTitle extends Component {
	logoPress = () => {
		console.log("Logo pressed");
	}

	render() {
		return (
			<StyledPressable onPress={this.logoPress} style={[Styles.headerSection, { flex: 1 }]}>
				<Logo/>
				<Text
					style={[Styles.text, Styles.heading, { fontSize: 20 }]}
					selectable={false}
				>Nexilis</Text>
			</StyledPressable>
		);
	}
}