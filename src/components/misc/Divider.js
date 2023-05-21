import { View } from "react-native";
import Colors from "../../constants/Colors";

export default function Divider({ style }) {
	return (
		<View style={[{
			width: "100%",
			height: 2,
			backgroundColor: Colors.background.tertiary
		}, style]}/>
	);
}