import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ItemRow from "./ItemRow";

const STORAGE_KEY = "UTPList";

export default function HomeScreen({ defaultQuantity = "1", darkMode }) {
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(defaultQuantity);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const skipNextSave = useRef(false);

  useEffect(() => {
    const loadList = async () => {
      try {
        const storedList = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedList !== null) {
          const parsedList = JSON.parse(storedList);
          setList(Array.isArray(parsedList) ? parsedList : []);
        }
      } catch {
        setList([]);
      } finally {
        setLoaded(true);
      }
    };

    loadList();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }, 500);

    return () => clearTimeout(timeout);
  }, [list, loaded]);

  const addItem = () => {
    const title = item.trim();

    if (!title) {
      Alert.alert("Validación", "Ingresa el nombre de un producto.");
      return;
    }

    const quantity = qty.trim() || defaultQuantity.trim();
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      quantity,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setList((currentList) => [newItem, ...currentList]);
    setItem("");
    setQty(defaultQuantity);
  };

  const toggleItem = useCallback((id) => {
    setList((currentList) =>
      currentList.map((currentItem) =>
        currentItem.id === id
          ? { ...currentItem, done: !currentItem.done }
          : currentItem,
      ),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setList((currentList) =>
      currentList.filter((currentItem) => currentItem.id !== id),
    );
  }, []);

  const clearAll = () => {
    if (list.length === 0) {
      Alert.alert("Lista vacía", "No existen productos para eliminar.");
      return;
    }

    Alert.alert("Borrar todo", "¿Deseas eliminar todos los productos?", [
      {
        text: "Cancelar",
        style: "cancel",
      },

      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          skipNextSave.current = true;
          await AsyncStorage.removeItem(STORAGE_KEY);
          setList([]);
        },
      },
    ]);
  };

  const filteredList = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return list;
    }
    return list.filter((currentItem) =>
      currentItem.title.toLowerCase().includes(normalizedQuery),
    );
  }, [list, query]);

  const total = list.length;
  const purchased = useMemo(
    () => list.filter((currentItem) => currentItem.done).length,
    [list],
  );
  const pending = total - purchased;

  const renderItem = useCallback(
    ({ item: currentItem }) => (
      <ItemRow
        item={currentItem}
        onToggle={toggleItem}
        onRemove={removeItem}
        darkMode={darkMode}
      />
    ),
    [toggleItem, removeItem, darkMode],
  );

  const colors = darkMode
    ? {
        background: "#111111",
        border: "#3A3A3A",
        input: "#181818",
        secondary: "#A0A0A0",
        text: "#F5F5F5",
      }
    : {
        background: "#FFFFFF",
        border: "#D8D8D8",
        input: "#FFFFFF",
        secondary: "#666666",
        text: "#111111",
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Una tiendita de la UTP
      </Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Agregar producto
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Producto"
        placeholderTextColor={colors.secondary}
        value={item}
        onChangeText={setItem}
        onSubmitEditing={addItem}
        returnKeyType="done"
      />
      <View style={styles.addRow}>
        <TextInput
          style={[
            styles.input,
            styles.quantityInput,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Cantidad"
          placeholderTextColor={colors.secondary}
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
        />
        <Pressable
          style={[
            styles.button,
            styles.primaryButton,
            { backgroundColor: colors.text },
          ]}
          onPress={addItem}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Agregar
          </Text>
        </Pressable>
      </View>
      <Text
        style={[
          styles.sectionTitle,
          styles.searchTitle,
          { color: colors.text },
        ]}
      >
        Buscar
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Buscar producto"
        placeholderTextColor={colors.secondary}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={(currentItem) => currentItem.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            {query.trim()
              ? "No se encontraron productos."
              : "La lista está vacía."}
          </Text>
        }
      />
      <View style={[styles.summary, { borderColor: colors.border }]}>
        <Text style={[styles.summaryText, { color: colors.secondary }]}>
          Total: {total}
        </Text>
        <Text style={[styles.summaryText, { color: colors.secondary }]}>
          Pendientes: {pending}
        </Text>
        <Text style={[styles.summaryText, { color: colors.secondary }]}>
          Comprados: {purchased}
        </Text>
      </View>
      <Pressable
        style={[
          styles.button,
          styles.secondaryButton,
          {
            backgroundColor: colors.input,
            borderColor: darkMode ? "#555555" : "#111111",
          },
        ]}
        onPress={clearAll}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          Borrar toda la lista
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  title: {
    marginBottom: 22,
    fontSize: 24,
    fontWeight: "700",
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  searchTitle: {
    marginTop: 18,
  },

  input: {
    height: 44,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 15,
  },

  addRow: {
    flexDirection: "row",
    gap: 8,
  },

  quantityInput: {
    flex: 1,
  },

  button: {
    minHeight: 42,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },

  primaryButton: {
    minWidth: 110,
  },

  secondaryButton: {
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 4,
  },

  emptyText: {
    paddingVertical: 24,
    textAlign: "center",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  summaryText: {
    fontSize: 13,
  },
});
