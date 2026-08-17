import { StyleSheet, Text, View } from "react-native";

export default function GridDemo() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.box}>
          <Text style={styles.boxText}>#{i + 1}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    justifyContent: "space-between",
  },
  box: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#22C55E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: { color: "#fff", fontWeight: "700" },
});
