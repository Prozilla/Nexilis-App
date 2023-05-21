import { TouchableOpacity } from "react-native";

export default function StyledTouchableOpacity(props) {
	return (
		<TouchableOpacity
			{...props}
			activeOpacity={0.65}
			style={[
				{
					borderColor: null,
					borderStyle: null,
					backgroundColor: null,
					outline: "none"
				},
				props.style
			]}
		>
			{props?.children}
		</TouchableOpacity>
	);
}