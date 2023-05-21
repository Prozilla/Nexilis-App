import { Image, View } from "react-native";
import Styles from "../../constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";
import { removeUrlQueries } from "../../features/utils/utils";
import { useContext } from "react";
import { UserDataContext } from "../../hooks/contexts";

export default function HeaderRight(props) {
	const [userData] = useContext(UserDataContext);

	return (
		<View style={[Styles.headerSection, { gap: 15, marginRight: 10 }]}>
			<StyledPressable onPress={() => props.navigation.navigate(Routes.ACCOUNT)}>
				{
					userData?.icon_img
					?	<Image
							resizeMode="contain"
							source={{ uri: removeUrlQueries(userData.icon_img) }}
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