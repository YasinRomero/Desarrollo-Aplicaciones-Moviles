import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function PermissionView({ onRequestPermission }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Se necesita permiso para utilizar la cámara.</Text>
      <Pressable style={styles.button} onPress={onRequestPermission}>
        <Text style={styles.buttonText}>Solicitar permiso</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 24,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },
});