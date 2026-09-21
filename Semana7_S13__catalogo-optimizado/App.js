import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { products } from "./data/products";
import { ProductRow } from "./ProductRow";

export default function App() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const inputRef = useRef(null);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const onChangeQuery = useCallback((text) => setQuery(text), []);

  const onChangeMinPrice = useCallback(
    (text) => setMinPrice(text.replace(/[^0-9]/g, "")),
    [],
  );

  const clear = useCallback(() => {
    setQuery("");
    setMinPrice("");
    Keyboard.dismiss();
    requestAnimationFrame(focusInput);
  }, [focusInput]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minimum = Number(minPrice) || 0;
    return [...products]
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .filter(
        (product) =>
          (!normalizedQuery ||
            product.name.toLowerCase().includes(normalizedQuery)) &&
          product.price >= minimum,
      );
  }, [query, minPrice]);

  const stats = useMemo(
    () => ({
      total: filtered.length,
      categories: new Set(filtered.map((product) => product.category)).size,
    }),
    [filtered],
  );

  const renderItem = useCallback(({ item }) => <ProductRow item={item} />, []);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>CATALOGOS OPTIMIZADOS :D</Text>
          </View>
        </View>
        <View style={styles.rule} />

        <View style={styles.controls}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONSULTA</Text>
            <TextInput
              ref={inputRef}
              autoCapitalize="none"
              onChangeText={onChangeQuery}
              placeholder="buscar por nombre..."
              placeholderTextColor="#888"
              returnKeyType="search"
              style={styles.input}
              value={query}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRECIO MINIMO (S/)</Text>
            <TextInput
              keyboardType="numeric"
              onChangeText={onChangeMinPrice}
              placeholder="0"
              placeholderTextColor="#888"
              style={styles.input}
              value={minPrice}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={focusInput}
            style={styles.button}
          >
            <Text style={styles.buttonText}>[ FILTRAR ]</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={clear}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>RESET</Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsText}>
            RESULTADOS: {String(stats.total).padStart(4, "0")}
          </Text>
          <Text style={styles.statsText}>CATEGORIAS: {stats.categories}</Text>
        </View>
        <FlatList
          contentContainerStyle={styles.list}
          data={filtered}
          initialNumToRender={20}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <Text style={styles.empty}>NO SE ENCONTRARON RESULTADOS</Text>
          }
          removeClippedSubviews
          renderItem={renderItem}
          windowSize={10}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f7f7f5",
    flex: 1,
  },

  shell: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 920,
    paddingHorizontal: 20,
    width: "100%",
  },

  header: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 22,
  },

  kicker: {
    color: "#666",
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1,
  },

  title: {
    color: "#111",
    fontFamily: "monospace",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 6,
  },

  controls: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 20,
  },

  inputGroup: {
    flex: 1,
  },

  label: {
    color: "#555",
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderColor: "#111",
    borderWidth: 1,
    color: "#111",
    fontFamily: "monospace",
    fontSize: 14,
    height: 44,
    paddingHorizontal: 12,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 14,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#111",
    minWidth: 112,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  buttonText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
  },

  clearButton: {
    alignItems: "center",
    borderColor: "#111",
    borderWidth: 1,
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  clearText: {
    color: "#111",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
  },

  stats: {
    borderBottomColor: "#111",
    borderBottomWidth: 1,
    borderTopColor: "#d9d9d9",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  statsText: {
    color: "#555",
    fontFamily: "monospace",
    fontSize: 11,
  },

  list: {
    paddingBottom: 30,
  },

  empty: {
    color: "#666",
    fontFamily: "monospace",
    paddingVertical: 30,
  },
});
