import { StyleSheet, Text, View } from "react-native";
import { obtenerFortaleza } from "../validators";

export default function IndicadorFortaleza({ contrasena }) {
	const fortaleza = obtenerFortaleza(contrasena);

	return (
		<View style={styles.contenedor}>
			<View style={styles.barras}>
				{[1, 2, 3].map((numero) => (
					<View
						key={numero}
						style={[styles.barra, numero <= fortaleza.nivel ? styles.barraActiva : null]}
					/>
				))}
			</View>

			<Text style={styles.texto}>Fortaleza: {fortaleza.texto}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedor: {
		marginTop: -8,
		marginBottom: 16,
	},

	barras: {
		flexDirection: "row",
		gap: 6,
	},

	barra: {
		flex: 1,
		height: 5,
		backgroundColor: "#dddddd",
		borderRadius: 10,
	},

	barraActiva: {
		backgroundColor: "#111111",
	},

	texto: {
		color: "#555555",
		fontSize: 12,
		marginTop: 6,
	},
});
