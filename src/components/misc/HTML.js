import { Dimensions } from "react-native";
import Styles from "../../constants/Styles";
import RenderHTML from "react-native-render-html";

export default function HTML(props) {
	const { style, source, tagStyles } = props;

	if (props.numberOfLines) {
		style.maxHeight = props.numberOfLines * (style.fontSize ?? Styles.text.fontSize);
	}

	return (
		<RenderHTML
			{...props}
			contentWidth={Dimensions.get("window").width}
			style={[Styles.text, style]}
			source={{ html: source }}
			tagsStyles={tagStyles}
		/>
	);
}