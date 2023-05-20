import { Image, View } from "react-native";
import Styles from "../../constants/Styles";
import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";
import { removeUrlQueries } from "../../utils/utils";
import Routes from "../../constants/Routes";

export default function HeaderRight(props) {
	return (
		<View style={[Styles.headerSection, { gap: 15, marginRight: 10 }]}>
			<StyledPressable onPress={() => props.navigation.navigate(Routes.ACCOUNT)}>
				{
					props.userData?.icon_img
					?	<Image
							resizeMode="contain"
							source={{ uri: removeUrlQueries(props.userData.icon_img) }}
							style={{
								width: 32,
								height: 32,
								borderRadius: 16
							}}
						/>
					: <FontAwesomeIcon icon="user" color={Colors.text.primary} size={24}/>
				}
			</StyledPressable>
		</View>
	);
}