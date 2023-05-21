import { View } from "react-native";
import Styles from "../../constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledPressable from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";
import { getCurrentRoute } from "../../features/native/navigtion";
import { useNavigation } from "@react-navigation/native";

export default function FooterView({ children }) {
	const route = getCurrentRoute();
	const navigation = useNavigation();

	return (
		<View style={[Styles.container]}>
			{children}
			<View style={[{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-evenly",
				height: 50,
				width: "100%",
				borderTopColor: Colors.background.tertiary,
				borderTopWidth: 2
			}]}>
				<StyledPressable onPress={() => navigation.navigate(Routes.HOME)}>
					<FontAwesomeIcon
						icon="house"
						color={route == Routes.HOME ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledPressable>
				<StyledPressable onPress={() => null}>
					<FontAwesomeIcon
						icon="magnifying-glass"
						color={route == Routes.SEARCH ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledPressable>
				<StyledPressable onPress={() => null}>
					<FontAwesomeIcon
						icon="gear"
						color={route == Routes.SETTINGS ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledPressable>
			</View>
		</View>
	);
}