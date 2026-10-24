import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable, StyleSheet } from "react-native";

export default function ConfirmationScreen({ photoUri, onSave, onDiscard }) {
  const [description, setDescription] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Evidencia</Text>
      <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción de la evidencia:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese detalles de la entrega o inspección..."
          placeholderTextColor="#666666"
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={() => onSave(description)}>
          <Text style={styles.saveButtonText}>Guardar Evidencia</Text>
        </Pressable>
        <Pressable style={styles.discardButton} onPress={onDiscard}>
          <Text style={styles.discardButtonText}>Descartar / Tomar otra</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 24,
    paddingTop: 50,
    justifyContent: "space-between",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  preview: {
    flex: 1,
    borderRadius: 4,
    marginVertical: 12,
    backgroundColor: "#111111",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#cccccc",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333333",
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 16,
  },
  discardButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444444",
  },
  discardButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});