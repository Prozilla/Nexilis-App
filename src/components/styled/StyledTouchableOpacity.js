import { Component } from "react";
import { TouchableOpacity } from "react-native";

export default class StyledTouchableOpacity extends Component {
	render() {
		return (
			<TouchableOpacity {...this.props} activeOpacity={0.65} style={[{ borderColor: null, borderStyle: null, backgroundColor: null, outline: "none" }, this.props.style]}>
				{this.props?.children}
			</TouchableOpacity>
		);
	}
}