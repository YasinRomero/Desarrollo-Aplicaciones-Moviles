import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ProductRow = React.memo(function ProductRow({ item }) {
	return (
		<View style={styles.row}>
			<View style={styles.index}>
				<Text style={styles.indexText}>#{item.id}</Text>
			</View>
			<View style={styles.details}>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.meta}>{item.category}</Text>
			</View>
			<Text style={styles.price}>S/ {item.price}</Text>
		</View>
	);
});

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		borderBottomColor: "#d9d9d9",
		borderBottomWidth: 1,
		flexDirection: "row",
		minHeight: 68,
		paddingHorizontal: 4,
	},
	index: { width: 54 },
	indexText: { color: "#777", fontFamily: "monospace", fontSize: 12 },
	details: { flex: 1 },
	name: { color: "#111", fontFamily: "monospace", fontSize: 14, fontWeight: "700" },
	meta: { color: "#666", fontFamily: "monospace", fontSize: 11, marginTop: 5 },
	price: { color: "#111", fontFamily: "monospace", fontSize: 14, fontWeight: "700" },
});
