import { Modal, View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function PhotoPreview({ photo, onSave, onDiscard, saving }) {
  return (
    <Modal
      visible={!!photo}
      transparent
      animationType="fade"
      onRequestClose={onDiscard}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.label}>VISTA PREVIA</Text>
          <Text style={styles.title}>¿Guardar fotografía?</Text>

          {photo && (
            <>
              <Image
                source={{ uri: photo.uri }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.date}>
                {new Date(photo.date).toLocaleString("es-PE")}
              </Text>
            </>
          )}

          <View style={styles.actions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={onDiscard}
              disabled={saving}
            >
              <Text style={styles.secondaryText}>Descartar</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={onSave}
              disabled={saving}
            >
              <Text style={styles.primaryText}>
                {saving ? "Guardando..." : "Guardar foto"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#0F1011",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#303136",
    padding: 20,
  },

  label: {
    color: "#8A8F98",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    color: "#F7F8F8",
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 18,
  },

  image: {
    width: "100%",
    height: 330,
    backgroundColor: "#000000",
    borderRadius: 12,
  },

  date: {
    color: "#8A8F98",
    fontSize: 12,
    textAlign: "center",
    marginTop: 14,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#252629",
    padding: 14,
    alignItems: "center",
  },

  primaryButton: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#5E6AD2",
    padding: 14,
    alignItems: "center",
  },

  secondaryText: {
    color: "#E5E5E6",
    fontSize: 13,
    fontWeight: "600",
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
