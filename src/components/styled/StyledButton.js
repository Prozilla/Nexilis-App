import { Text, TouchableOpacity } from "react-native";
import Styles from "../../constants/Styles.js";

export default function StyledButton(props) {
	return (
		<TouchableOpacity {...props} activeOpacity={props?.opacity ?? 0.65} style={[Styles.button, props?.style]}>
			{props?.title ? <Text style={[Styles.buttonText, { color: props?.style?.color }]}>{props.title}</Text> : null}
			{props?.children}
		</TouchableOpacity>
	);
}