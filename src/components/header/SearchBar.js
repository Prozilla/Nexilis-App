import * as React from "react";
import Styles from "../../constants/Styles";
import { TextInput } from "react-native";

export default function SearchBar() {
	const [text, onChangeText] = React.useState("");

	return (
		<TextInput
			style={[Styles.input, { outline: "none" }]}
			onChangeText={onChangeText}
			value={text}
			placeholder="Search Nexilis"
      	/>
	);
}