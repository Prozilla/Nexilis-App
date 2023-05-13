import { StyleSheet } from "react-native";
import Colors from "./Colors.js";

const BORDER_RADIUS = 10;

export default StyleSheet.create({
	text: {
		color: Colors.text.primary
	},
	heading: {
		fontSize: 24
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