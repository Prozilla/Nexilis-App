import { useNavigationState } from "@react-navigation/native";

export function getCurrentRoute() {
	return useNavigationState((state) => state.routes[state.index].name);
}