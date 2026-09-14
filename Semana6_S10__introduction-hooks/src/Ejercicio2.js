import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Button } from "react-native";
import { TextInput } from "react-native";
import Label from "./Label";
import { StyleSheet } from "react-native";

export default function Ejercicio2() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (submitted) {
			setUsername("");
			setPassword("");
			setSubmitted(false);
		}
	}, [submitted]);

	const handleLogin = () => {
		// Esto es un adicional mio
		if (username.trim() === "" || password.trim() === "")
			return window.alert("Por favor, rellena todos los campos");

		window.alert("Bienvenido " + username);
		setSubmitted(true);
	};

	return (
		<View>
			<Label>Ejercicio 2 - Iniciar sesión</Label>

			<View style={styles.content}>
				<TextInput
					style={styles.cardinput}
					placeholder="Usuario"
					value={username}
					onChangeText={setUsername}
				/>

				<TextInput
					style={styles.cardinput}
					placeholder="Contraseña"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>

				<Pressable style={styles.button} onPress={handleLogin}>
					Iniciar sesión
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 8,
	},

	cardinput: {
		borderColor: "#cccccc",
		borderWidth: 1,
		padding: 8,
		borderRadius: 8,
		marginBottom: 8,
	},

	button: {
		backgroundColor: "#917ff9",
		color: "#ffffff",
		padding: 8,
		borderRadius: 8,
		textAlign: "center",
		fontFamily: "system-ui, sans-serif",
	},
});
