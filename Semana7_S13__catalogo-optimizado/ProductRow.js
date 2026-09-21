import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ProductRow = React.memo(function ProductRow({ item }) {
  return (
    <View style={styles.row}>
      <Text style={styles.index}>#{item.id}</Text>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <Text style={styles.price}>S/ {item.price}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { alignItems: "center", borderBottomColor: "#d6d6d6", borderBottomWidth: 1, flexDirection: "row", minHeight: 68, paddingHorizontal: 4 },
  index: { color: "#777", fontFamily: "monospace", fontSize: 11, width: 58 },
  details: { flex: 1 },
  name: { color: "#111", fontFamily: "monospace", fontSize: 14, fontWeight: "700" },
  category: { color: "#666", fontFamily: "monospace", fontSize: 11, marginTop: 5 },
  price: { color: "#111", fontFamily: "monospace", fontSize: 14, fontWeight: "700" },
});
