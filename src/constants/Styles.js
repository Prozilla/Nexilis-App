import { StyleSheet } from "react-native";
import Colors from "./Colors.js";

const BORDER_RADIUS = 10;

export default StyleSheet.create({
	screen: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: Colors.background.primary
	},
	text: {
		color: Colors.text.primary,
		fontFamily: "Roboto-Regular",
		textAlign: "left"
	},
	heading: {
		fontSize: 24,
		fontFamily: "Roboto-Bold",
		letterSpacing: 1
	},
	container: {
		flex: 1,
		color: Colors.text.primary,
		backgroundColor: Colors.background.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: 35,
		height: 35,
	},
	icon: {
		border: null,
		outline: null
	},
	input: {
		color: Colors.text.primary,
		placeholderTextColor: Colors.text.tertiary,
		backgroundColor: Colors.background.primary,
		height: 40,
		margin: 12,
		padding: 15,
		borderColor: null,
		borderRadius: BORDER_RADIUS
	},
	headerSection: {
		color: Colors.text.primary,
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
		borderStyle: null,
		justifyContent: "flex-start"
	},
});