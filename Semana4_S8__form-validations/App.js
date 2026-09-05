import {
	Alert,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { useState } from "react";
import CampoFormulario from "./componentes/CampoFormulario";
import IndicadorFortaleza from "./componentes/IndicadorFortaleza";

import {
	validarNombre,
	validarCorreo,
	validarContrasena,
	validarConfirmacion,
	validarTelefono,
} from "./validators";

export default function App() {
	const [formulario, setFormulario] = useState({
		nombre: "",
		correo: "",
		contrasena: "",
		confirmarContrasena: "",
		telefono: "",
	});

	const [tocados, setTocados] = useState({});

	const errores = {
		nombre: validarNombre(formulario.nombre),
		correo: validarCorreo(formulario.correo),
		contrasena: validarContrasena(formulario.contrasena),
		confirmarContrasena: validarConfirmacion(formulario.confirmarContrasena, formulario.contrasena),
		telefono: validarTelefono(formulario.telefono),
	};

	const actualizarCampo = (campo, valor) => {
		setFormulario({
			...formulario,
			[campo]: valor,
		});

		setTocados({
			...tocados,
			[campo]: true,
		});
	};

	const registrar = () => {
		setTocados({
			nombre: true,
			correo: true,
			contrasena: true,
			confirmarContrasena: true,
			telefono: true,
		});

		const formularioValido = Object.values(errores).every((mensaje) => mensaje === "");

		if (formularioValido) {
			Alert.alert("Registro exitoso", "Tus datos fueron registrados correctamente.");
		}
	};

	return (
		<SafeAreaView style={styles.pantalla}>
			<ScrollView contentContainerStyle={styles.contenido}>
				<View style={styles.tarjeta}>
					<Text style={styles.titulo}>Crear cuenta</Text>

					<Text style={styles.subtitulo}>Completa tus datos para registrarte</Text>

					<CampoFormulario
						etiqueta="Nombre"
						placeholder="ej. Pepito Minecraftero..."
						value={formulario.nombre}
						onChangeText={(texto) => actualizarCampo("nombre", texto)}
						error={tocados.nombre ? errores.nombre : ""}
						valido={tocados.nombre && errores.nombre === ""}
						autoCapitalize="words"
					/>

					<CampoFormulario
						etiqueta="Correo"
						placeholder="ej. correo@pepito.com..."
						value={formulario.correo}
						onChangeText={(texto) => actualizarCampo("correo", texto)}
						error={tocados.correo ? errores.correo : ""}
						valido={tocados.correo && errores.correo === ""}
						keyboardType="email-address"
						autoCapitalize="none"
					/>

					<CampoFormulario
						etiqueta="Contraseña"
						placeholder="Mínimo 8 caracteres..."
						value={formulario.contrasena}
						onChangeText={(texto) => actualizarCampo("contrasena", texto)}
						error={tocados.contrasena ? errores.contrasena : ""}
						valido={tocados.contrasena && errores.contrasena === ""}
						secureTextEntry
						autoCapitalize="none"
					/>

					{formulario.contrasena.length > 0 && (
						<IndicadorFortaleza contrasena={formulario.contrasena} />
					)}

					<CampoFormulario
						etiqueta="Confirmar contraseña"
						placeholder="Repite tu contraseña..."
						value={formulario.confirmarContrasena}
						onChangeText={(texto) => actualizarCampo("confirmarContrasena", texto)}
						error={tocados.confirmarContrasena ? errores.confirmarContrasena : ""}
						valido={tocados.confirmarContrasena && errores.confirmarContrasena === ""}
						secureTextEntry
						autoCapitalize="none"
					/>

					<CampoFormulario
						etiqueta="Teléfono"
						placeholder="ej. 987654321"
						value={formulario.telefono}
						onChangeText={(texto) => actualizarCampo("telefono", texto.replace(/[^0-9]/g, ""))}
						error={tocados.telefono ? errores.telefono : ""}
						valido={tocados.telefono && errores.telefono === ""}
						keyboardType="phone-pad"
						maxLength={9}
					/>

					<TouchableOpacity style={styles.boton} onPress={registrar}>
						<Text style={styles.textoBoton}>Registrarme</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	pantalla: {
		flex: 1,
		backgroundColor: "#f4f4f4",
	},

	contenido: {
		flexGrow: 1,
		justifyContent: "center",
		padding: 20,
	},

	tarjeta: {
		width: "100%",
		maxWidth: 480,
		alignSelf: "center",
		backgroundColor: "#ffffff",
		borderRadius: 24,
		padding: 24,
		borderWidth: 1,
		borderColor: "#e5e5e5",
	},

	titulo: {
		color: "#111111",
		fontSize: 28,
		fontWeight: "700",
		textAlign: "center",
	},

	subtitulo: {
		color: "#666666",
		fontSize: 14,
		textAlign: "center",
		marginTop: 6,
		marginBottom: 24,
	},

	boton: {
		backgroundColor: "#111111",
		borderRadius: 14,
		paddingVertical: 15,
		marginTop: 10,
	},

	textoBoton: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
});
