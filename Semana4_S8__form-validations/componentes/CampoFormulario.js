import { StyleSheet, Text, TextInput, View } from "react-native";

export default function CampoFormulario({ etiqueta, error, valido, ...propiedadesInput }) {
	// Use rapidamente el Boolean porque se me hizo mas facil determinar un resultado falso o true
	// que verificar si tiene o no contenido :D
	const mostrarIndicador = valido || Boolean(error);

	return (
		<View style={styles.grupo}>
			<Text style={styles.etiqueta}>{etiqueta}</Text>

			<View
				style={[
					styles.contenedorInput,
					error ? styles.bordeError : null,
					valido ? styles.bordeValido : null,
				]}
			>
				<TextInput style={styles.input} placeholderTextColor="#999999" {...propiedadesInput} />

				{mostrarIndicador && (
					<Text style={[styles.icono, error ? styles.error : styles.valido]}>
						{error ? "No válido" : "Válido"}
					</Text>
				)}
			</View>

			{error ? <Text style={styles.mensajeError}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	grupo: { marginBottom: 16 },

	etiqueta: {
		color: "#222222",
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 7,
	},

	contenedorInput: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderWidth: 1,
		borderColor: "#cccccc",
		borderRadius: 14,
		paddingHorizontal: 14,
	},

	input: {
		flex: 1,
		color: "#111111",
		fontSize: 16,
		paddingVertical: 13,
		outlineStyle: "none",
	},

	bordeError: {
		borderColor: "#d93025",
	},

	bordeValido: {
		borderColor: "#222222",
	},

	icono: {
		fontSize: 17,
		fontWeight: "700",
		marginLeft: 8,
	},

	error: {
		color: "#d93025",
	},

	valido: {
		color: "#222222",
	},

	mensajeError: {
		color: "#d93025",
		fontSize: 12,
		marginTop: 5,
	},
});
