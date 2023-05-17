import { View } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";

export default class HeaderLeft extends Component {
	render() {
		if (!this.props.canGoBack)
			return null;

		return (
			<View style={[Styles.headerSection, { gap: 15, marginLeft: 10 }]}>
				<StyledPressable onPress={this.props.navigation.goBack}>
					<FontAwesomeIcon icon="arrow-left" color={Colors.text.primary} size={24}/>
				</StyledPressable>
			</View>
		);
	}
}