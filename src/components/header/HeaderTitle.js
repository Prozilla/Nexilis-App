import { Text } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import Logo from "./Logo";
import StyledPressable from "../styled/StyledTouchableOpacity";

export default function HeaderTitle() {
	return (
		<StyledPressable
			onPress={() => console.log("Logo pressed")}
			style={[Styles.headerSection, { flex: 1 }]}
		>
			<Logo/>
			<Text
				style={[Styles.text, Styles.heading, { fontSize: 20 }]}
				selectable={false}
			>Nexilis</Text>
		</StyledPressable>
	);
}