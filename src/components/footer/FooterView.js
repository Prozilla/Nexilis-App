import { SafeAreaView, View } from "react-native";
import Styles from "../../constants/Styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import StyledTouchableOpacity from "../styled/StyledTouchableOpacity";
import Colors from "../../constants/Colors";
import Routes from "../../constants/Routes";
import { getCurrentRoute } from "../../features/native/navigtion";
import { useNavigation } from "@react-navigation/native";

export default function FooterView({ children, style }) {
	const route = getCurrentRoute();
	const navigation = useNavigation();

	return (
		<SafeAreaView style={[Styles.container, style]}>
			{children}
			<View style={[{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-evenly",
				height: 50,
				width: "100%",
				marginTop: "auto",
				borderTopColor: Colors.background.tertiary,
				borderTopWidth: 2,
				backgroundColor: Colors.background.primary
			}]}>
				<StyledTouchableOpacity onPress={() => navigation.navigate(Routes.HOME)}>
					<FontAwesomeIcon
						icon="house"
						color={route == Routes.HOME ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledTouchableOpacity>
				<StyledTouchableOpacity onPress={() => navigation.navigate(Routes.SEARCH)}>
					<FontAwesomeIcon
						icon="magnifying-glass"
						color={route == Routes.SEARCH ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledTouchableOpacity>
				<StyledTouchableOpacity onPress={() => null}>
					<FontAwesomeIcon
						icon="gear"
						color={route == Routes.SETTINGS ? Colors.text.primary : Colors.text.secondary}
						size={24}
					/>
				</StyledTouchableOpacity>
			</View>
		</SafeAreaView>
	);
}