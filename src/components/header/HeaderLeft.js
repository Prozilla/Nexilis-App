import { View } from "react-native";
import Styles from "../../constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

export default function HeaderLeft() {
	const navigation = useNavigation();

	if (!navigation.canGoBack())
		return null;

	return (
		<View style={[Styles.headerSection, { gap: 15, marginLeft: 10 }]}>
			<StyledPressable onPress={navigation.goBack}>
				<FontAwesomeIcon icon="arrow-left" color={Colors.text.primary} size={24}/>
			</StyledPressable>
		</View>
	);
}