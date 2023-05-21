import { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";

export default function Comment(props) {
	const comment = props.data;
	const hasChildren = (comment.children != null && comment.children.length > 0);

	let children = null;
	if (hasChildren) {
		children = <View style={[styles.commentContainer, { marginLeft: 10 }]}>
			{comment.children.map((child) => <Comment data={child.data} key={child.data.id}/>)}
		</View>
	}

	// console.log(comment);

	return (
		<View style={styles.commentContainer}>
			<Text style={Styles.text}>{comment.body}</Text>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	commentContainer: {
		width: "100%",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		color: Colors.text.primary,
	}
});