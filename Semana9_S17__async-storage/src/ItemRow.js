import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function ItemRow({ item, onToggle, onRemove, darkMode }) {
  const createdAt = item.createdAt
    ? new Date(item.createdAt).toLocaleString()
    : "Sin fecha";

  const colors = darkMode
    ? {
        background: "#181818",
        border: "#3A3A3A",
        secondary: "#A0A0A0",
        text: "#F5F5F5",
      }
    : {
        background: "#F7F7F7",
        border: "#D8D8D8",
        secondary: "#666666",
        text: "#111111",
      };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: item.done ? colors.secondary : colors.text },
          item.done && styles.doneText,
        ]}
      >
        {item.title}
      </Text>
      <Text style={[styles.detail, { color: colors.secondary }]}>
        Cantidad: {item.quantity || "-"}
      </Text>
      <Text style={[styles.detail, { color: colors.secondary }]}>
        Creado: {createdAt}
      </Text>
      <Text style={[styles.detail, { color: colors.secondary }]}>
        Estado: {item.done ? "COMPRADO" : "PENDIENTE"}
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={[
            styles.button,
            styles.secondaryButton,
            {
              backgroundColor: colors.background,
              borderColor: darkMode ? "#555555" : "#111111",
            },
          ]}
          onPress={() => onToggle(item.id)}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {item.done ? "Marcar pendiente" : "Marcar comprado"}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.secondaryButton,
            {
              backgroundColor: colors.background,
              borderColor: darkMode ? "#555555" : "#111111",
            },
          ]}
          onPress={() => onRemove(item.id)}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Eliminar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(ItemRow);

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 6,
  },

  title: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },

  detail: {
    marginBottom: 3,
    fontSize: 13,
  },

  doneText: {
    textDecorationLine: "line-through",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  button: {
    minHeight: 42,
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  secondaryButton: {
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
