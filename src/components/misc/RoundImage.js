import { Image } from "react-native";

export default function RoundImage(props) {
	const { size, style, source } = props;

	return (
		<Image style={[style, { width: size, height: size, borderRadius: size / 2 }]} source={{ uri: source }}/>
	);
}