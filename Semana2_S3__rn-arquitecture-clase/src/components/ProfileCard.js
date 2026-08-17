import { Image, StyleSheet, Text, View } from "react-native";

export default function ProfileCard() {
  return (
    <View style={styles.card}>
      <Image
        source={require("../../assets/splash-icon.png")}
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>Ada Lovelace</Text>
        <Text style={styles.role}>Pionera de la programación</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "#111" },
  role: { fontSize: 14, color: "#444", marginTop: 2 },
});
