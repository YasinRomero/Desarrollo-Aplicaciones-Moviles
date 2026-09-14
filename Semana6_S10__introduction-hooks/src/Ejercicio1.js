import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native";
import Label from "./Label";
import { StyleSheet } from "react-native";

// Es una function rapida para formatear el tiempo,
// codigo obtenido de estandares NO MIO.
function formatTime(time) {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time - hours * 3600) / 60);
	const seconds = time - hours * 3600 - minutes * 60;
	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
}

function Temporizador({ timeLeft }) {
	return (
		<View style={styles.cardTempo}>
			<Text style={styles.cardTitle}>{formatTime(timeLeft)}</Text>
		</View>
	);
}

export default function Ejercicio1() {
	// Se debe iniciar en 10
	const [timeLeft, setTimeLeft] = useState(10);

	// Se debe actualizar en 1 segundo
	useEffect(() => {
		if (timeLeft === 0) return;

		const interval = setInterval(() => setTimeLeft((currentTime) => currentTime - 1), 1000);
		return () => clearInterval(interval);
	}, [timeLeft]);

	return (
		<View style={styles.content}>
			<Label>Ejercicio 1 - Tiempo restante</Label>
			{timeLeft > 0 ? (
				<Temporizador timeLeft={timeLeft} />
			) : (
				<Text style={styles.cardFelicidades}>Tiempo Acabado</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		justifyContent: "center",
		alignItems: "center",
	},

	cardTempo: {
		alignSelf: "center",
		padding: 8,
		borderRadius: 8,
		backgroundColor: "#eeeeee",
		justifyContent: "center",
		alignItems: "center",
	},

	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "monospace",
	},

	cardFelicidades: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#ff0000",
	},
});
