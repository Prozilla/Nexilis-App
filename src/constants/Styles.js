import { StyleSheet } from "react-native";
import Colors from "./Colors.js";

const BORDER_RADIUS = 10;

export default StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: Colors.background.primary
	},
	text: {
		color: Colors.text.primary,
		fontFamily: "Roboto-Regular",
		textAlign: "left",
		fontSize: 14,
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
		backgroundColor: Colors.background.primary,
		height: 40,
		margin: 12,
		padding: 15,
		borderColor: null,
		borderRadius: BORDER_RADIUS,
		fontSize: 16,
	},
	headerSection: {
		color: Colors.text.primary,
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
		borderStyle: null,
		justifyContent: "flex-start"
	},
	button: {
		color: Colors.background.primary,
		backgroundColor: Colors.accentColor.primary,
		borderRadius: 0,
		paddingHorizontal: 25,
		paddingVertical: 10
	},
	buttonText: {
		color: Colors.background.primary,
		fontFamily: "Roboto-Bold",
		textAlign: "center"
	},
});