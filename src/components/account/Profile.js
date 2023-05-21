import { StyleSheet, Text, View } from "react-native";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Image } from "react-native";
import { formatNumber, formatRelativeTime, removeUrlQueries } from "../../features/utils/utils";
import Divider from "../misc/Divider";
import { useContext } from "react";
import { UserDataContext } from "../../hooks/contexts";

export default function Profile() {
	const [userData] = useContext(UserDataContext);
	const isLoggedIn = (userData != null);

	return (
		<View style={styles.profileContainer}>
			{
				isLoggedIn
				? <Image style={styles.bannerContainer} source={{ uri: removeUrlQueries(userData.subreddit.banner_img) }}></Image>
				: <View style={styles.bannerContainer}/>
			}
			<View style={styles.avatarContainer}>
				{
					isLoggedIn
					? <Image style={styles.avatar} source={{ uri: removeUrlQueries(userData.icon_img) }}></Image>
					: <FontAwesomeIcon icon="user" color={Colors.text.primary} size={75}/>
				}
			</View>
			{
				isLoggedIn
				? (
					<View style={[Styles.container, { marginVertical: 20}]}>
						<Text style={[Styles.text, styles.username]}>{userData.name}</Text>
						<Text style={[Styles.text, styles.stats]}>{formatNumber(userData.total_karma)} karma ・ {formatRelativeTime(userData.created, { suffix: false })}</Text>
						<Text style={[Styles.text, styles.description]}>{userData.subreddit.public_description}</Text>
						<Divider style={{ marginTop: 20 }}/>
					</View>
				)
				: <Text style={[Styles.text, styles.notLoggedInText]}>You are not logged in.</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	profileContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	bannerContainer: {
		width: "100%",
		height: 185,
		backgroundColor: Colors.accentColor.primary
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
		width: 150,
		height: 150,
		marginTop: -100,
		aspectRatio: 1,
		borderRadius: 150 / 2,
		backgroundColor: Colors.background.tertiary
	},
	avatar: {
		width: 150,
		height: 150,
		aspectRatio: 1,
		borderRadius: 150 / 2
	},
	notLoggedInText: {
		marginVertical: 30
	},
	username: {
		fontSize: 20,
		fontFamily: "Roboto-Bold",
	},
	stats: {
		color: Colors.text.tertiary,
		marginTop: 5
	},
	description: {
		marginTop: 15,
		marginHorizontal: 20
	}
});