import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

export default function StylesDemo() {
  const [active, setActive] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.baseText, active && styles.activeText]}>
        {active ? "Activo" : "Inactivo"}
      </Text>

      <TouchableOpacity
        onPress={() => setActive((v) => !v)}
        style={[styles.button, active && styles.buttonActive]}
      >
        <Text style={styles.buttonLabel}>Alternar estado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  baseText: { fontSize: 28, color: "#334155" },
  activeText: { color: "#16A34A" },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0EA5E9",
    borderRadius: 10,
  },
  buttonActive: { backgroundColor: "#0369A1" },
  buttonLabel: { color: "#fff", fontWeight: "700" },
});
