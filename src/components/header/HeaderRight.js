import { View } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";

export default class HeaderRight extends Component {
	openSearchBar() {
		console.log("Opened search bar");
	}

	openMenu() {
		console.log("Opened menu");
	}

	render() {
		return (
			<View style={[Styles.headerSection, { gap: 15, marginRight: 10 }]}>
				<StyledPressable onPress={this.openSearchBar}>
					<FontAwesomeIcon icon="magnifying-glass" color={Colors.text.primary} size={24}/>
				</StyledPressable>

				<StyledPressable onPress={this.openMenu}>
					<FontAwesomeIcon icon="bars" color={Colors.text.primary} size={24}/>
				</StyledPressable>
			</View>
		);
	}
}