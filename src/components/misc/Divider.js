import { View } from "react-native";
import Colors from "../../constants/Colors";

export default function Divider(props) {
	return (
		<View style={[{
			width: "100%",
			height: 2,
			backgroundColor: Colors.background.tertiary
		}, props?.style]}/>
	);
}