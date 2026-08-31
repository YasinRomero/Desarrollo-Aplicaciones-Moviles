import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import CampoTexto from "./componentes/CampoTexto.js";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    let nuevosErrores = {};

    if (nombre.trim() === "")
      nuevosErrores.nombre = "Ingrese su nombre completo";

    if (edad.trim() === "") nuevosErrores.edad = "Ingrese su edad";

    if (isNaN(edad) || parseInt(edad) <= 0)
      nuevosErrores.edad = "Ingrese una edad válida";

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarRegistro = () => {
    if (!validarFormulario()) {
      setMensaje("");
      return;
    }

    setMensaje(`Registro exitoso para ${nombre} (${edad} años).`);
    setNombre("");
    setEdad("");
    setErrores({});
  };

  return (
    <ScrollView contentContainerStyle={styles.pantalla}>
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>Registro de Usuario</Text>
        <Text style={styles.subtitulo}>
          Complete la información obligatoria para continuar
        </Text>

        <CampoTexto
          label="Nombre y Apellidos Completos"
          placeholder="ej. Petito Lepitode..."
          value={nombre}
          onChangeText={setNombre}
          error={errores.nombre}
        />

        <CampoTexto
          label="Edad"
          placeholder="ej. 25 Años..."
          value={edad}
          onChangeText={setEdad}
          error={errores.edad}
        />

        <TouchableOpacity
          onPress={manejarRegistro}
          style={styles.botonPrincipal}
          activeOpacity={0.85}
        >
          <Text style={styles.textoBotonPrincipal}>Enviar Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonSecundario}
          activeOpacity={0.7}
          onPress={() =>
            setMensaje(
              "Este es un mensaje que se muestra cuando se presiona con TouchableOpacity",
            )
          }
        >
          <Text style={styles.textoBotonSecundario}>
            Ejemplo de usar "TouchableOpacity"
          </Text>
        </TouchableOpacity>

        {mensaje !== "" && (
          <View style={styles.bannerExito}>
            <View style={styles.iconoExito}>
              <Text
                style={{ color: "#ffffff", fontSize: 12, fontWeight: "bold" }}
              >
                ✓
              </Text>
            </View>
            <Text style={styles.textoExito}>{mensaje}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flexGrow: 1,
    backgroundColor: "#fcfcfc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  tarjeta: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    elevation: 3,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  subtitulo: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 24,
  },

  botonPrincipal: {
    height: 46,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  textoBotonPrincipal: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  botonSecundario: {
    height: 44,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#ffffff",
  },

  textoBotonSecundario: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },

  bannerExito: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
    gap: 10,
  },

  iconoExito: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },

  textoExito: {
    flex: 1,
    fontSize: 12,
    color: "#000000",
    fontWeight: "500",
  },
});
