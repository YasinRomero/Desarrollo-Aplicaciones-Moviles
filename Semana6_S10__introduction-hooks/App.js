import { View } from "react-native";
import Ejercicio2 from "./src/Ejercicio2";
import Ejercicio1 from "./src/Ejercicio1";
import { StyleSheet } from "react-native";

export default function App() {
	return (
		<View style={styles.main}>
			<View style={styles.cardContainer}>
				<Ejercicio1 />
				<Ejercicio2 />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	cardContainer: {
		gap: 40,
	},
});
