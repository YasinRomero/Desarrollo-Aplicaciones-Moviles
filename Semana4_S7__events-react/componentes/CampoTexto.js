import { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

export default function CampoTexto({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
}) {
  const [enFoco, setEnFoco] = useState(false);

  return (
    <View style={styles.grupoInput}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          enFoco && styles.inputEnFoco,
          error ? styles.inputError : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setEnFoco(true)}
        onBlur={() => setEnFoco(false)}
      />
      {error ? <Text style={styles.textoError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupoInput: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    fontSize: 14,
    color: "#000000",
  },

  inputEnFoco: {
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
  },

  inputError: {
    borderColor: "#fca5a5",
  },

  textoError: {
    color: "#f87171",
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
});
