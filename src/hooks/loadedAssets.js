import { useEffect, useState } from "react";
import * as Font from 'expo-font';

let fonts = {
	"Roboto-Regular": require("../../assets/fonts/Roboto/Roboto-Regular.ttf"),
	"Roboto-Bold": require("../../assets/fonts/Roboto/Roboto-Bold.ttf"),
}

export default function useLoadedAssets() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Load fonts
		Font.loadAsync(fonts).then(() => {
			setIsReady(true);
		});
	}, []);

	return isReady;
}