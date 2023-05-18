import { View } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";

export default class FooterView extends Component {
	navigate = (route) => {
		this.props.navigation.navigate(route);
	}

	openHome = () => {
		this.navigate("Home");
	}

	render() {
		return (
			<View style={[Styles.container]}>
				{this.props.children}
				<View style={[{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-evenly",
					height: 50,
					width: "100%",
					borderTopColor: Colors.background.tertiary,
					borderTopWidth: 2
				}]}>
					<StyledPressable onPress={this.openHome}>
						<FontAwesomeIcon icon="house" color={Colors.text.primary} size={24}/>
					</StyledPressable>
					<StyledPressable onPress={() => null}>
						<FontAwesomeIcon icon="magnifying-glass" color={Colors.text.primary} size={24}/>
					</StyledPressable>
					<StyledPressable onPress={() => null}>
						<FontAwesomeIcon icon="gear" color={Colors.text.primary} size={24}/>
					</StyledPressable>
				</View>
			</View>
		);
	}
}