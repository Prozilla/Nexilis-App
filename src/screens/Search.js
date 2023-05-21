import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import Styles from "../constants/Styles";
import FooterView from "../components/footer/FooterView";
import { useEffect, useState } from "react";
import Divider from "../components/misc/Divider";
import { search } from "../features/reddit";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Colors from "../constants/Colors";
import { formatNumber } from "../features/utils/utils";
import RoundImage from "../components/misc/RoundImage";
import StyledTouchableOpacity from "../components/styled/StyledTouchableOpacity";

function renderSearchResult({ item }) {
	let component = null;
	const type = "subreddit"

	switch (type) {
		case "subreddit":
			component = (
				<StyledTouchableOpacity style={searchResultStyles.subreddit.container} onPress={() => null}>
					<RoundImage size={40} source={item.icon_img}/>
					<View style={{ gap: 5, flex: 1 }}>
						<Text style={Styles.text}>{item.display_name}<Text style={[Styles.text, { color: Colors.text.tertiary }]}> ・ {formatNumber(item.subscribers)} members</Text></Text>
						{ item.public_description ? <Text style={[Styles.text, { color: Colors.text.tertiary }]} numberOfLines={1}>{item.public_description}</Text> : null}
					</View>
				</StyledTouchableOpacity>
			);
			break;
	}

	return component;
}

export default function SearchScreen() {
	const [text, setText] = useState("minecraft"); // This string should be empty
	const [searchResults, setsearchResults] = useState([]);

	useEffect(() => {
		(async () => setsearchResults(await search.subreddit(text)))();
	}, [text]);

	return (
		<FooterView style={Styles.screen}>
			<View style={styles.inputContainer}>
				<FontAwesomeIcon icon="magnifying-glass" size={16} color={Colors.text.primary}/>
				<TextInput
					style={[Styles.input, styles.input]}
					onChangeText={setText}
					value={text}
					placeholder="Search Nexilis"
					placeholderTextColor={Colors.text.tertiary}
					enterKeyHint="search"
				/>
			</View>
			<Divider/>
			<FlatList
				style={{ width: Dimensions.get("window").width }}
				data={searchResults}
				renderItem={renderSearchResult}
			/>
		</FooterView>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		width: "100%",
		height: 50,
		alignItems: "center",
		justifyContent: "flex-start",
		paddingHorizontal: 20
	},
	input: {
		flex: 1,
		marginLeft: 0,
		fontSize: 16,
		height: "100%",
	},
});

const searchResultStyles = {
	subreddit: StyleSheet.create({
		container: {
			flexDirection: "row",
			gap: 10,
			padding: 10,
			maxWidth: "100%",
			overflow: "hidden",
			alignItems: "center"
		}
	})
}