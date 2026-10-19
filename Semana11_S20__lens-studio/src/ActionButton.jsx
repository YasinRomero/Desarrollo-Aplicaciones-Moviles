import { Pressable, Text, StyleSheet } from "react-native";

export default function ActionButton({
  title,
  onPress,
  active = false,
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        active && styles.active,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#18191A",
    borderWidth: 1,
    borderColor: "#303136",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  active: {
    backgroundColor: "#353968",
    borderColor: "#5E6AD2",
  },

  disabled: {
    opacity: 0.4,
  },

  text: {
    color: "#F7F8F8",
    fontSize: 13,
    fontWeight: "600",
  },
});
