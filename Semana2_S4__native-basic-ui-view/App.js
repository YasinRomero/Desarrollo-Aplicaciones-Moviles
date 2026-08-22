import { StyleSheet, Text, View, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Bienvenido a NATIVE APP</Text>
          <Image
            source={{
              uri: "https://img.rtve.es/i/?w=1200&i=https://img.rtve.es/imagenes/this-is-fine-meme-forma-parte-webcomic-2013/1614352806474.png",
            }}
            style={styles.imagen}
          />
          <Text style={styles.descripcion}>
            Esta es una interfaz basica construida con View, Text e Image en
            React Native.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>ESTO ES UN PIE DE PANTALLA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#dcffad",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 2,
    borderColor: "#74cc00",
    borderRadius: "5px",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E46BFF",
    marginBottom: 20,
  },

  imagen: {
    width: 300,
    height: 169,
    resizeMode: "contain",
    marginBottom: 20,
  },

  descripcion: {
    fontSize: 16,
    color: "#E46BFF",
    textAlign: "center",
  },

  footer: {
    marginBottom: 30,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
});
