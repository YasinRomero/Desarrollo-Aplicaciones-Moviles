import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  getMovements,
  saveMovements,
  getTheme,
} from "./FinanceStorage";
import MovementRow from "./MovementRow";

export default function MovementsScreen() {
  const [movements, setMovements] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("gasto");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const load = async () => {
      const data = await getMovements();
      const storedTheme = await getTheme();
      setMovements(data);
      setTheme(storedTheme);
    };
    load();
  }, []);

  const isDark = theme === "dark";
  const themeStyle = isDark ? darkStyles : lightStyles;

  const handleAdd = async () => {
    if (!description.trim() || isNaN(amount) || Number(amount) <= 0) {
      return;
    }

    const newMovement = {
      id: Date.now().toString(),
      type,
      description,
      amount: parseFloat(amount),
      category: category.trim() || "General",
      createdAt: new Date().toLocaleDateString(),
    };

    const updated = [newMovement, ...movements];
    setMovements(updated);
    await saveMovements(updated);
    setDescription("");
    setAmount("");
    setCategory("");
  };

  const handleDelete = async (id) => {
    const updated = movements.filter((m) => m.id !== id);
    setMovements(updated);
    await saveMovements(updated);
  };

  const filteredMovements = movements.filter((m) => {
    const matchesSearch = m.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "todos" || m.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <View style={[styles.container, themeStyle.container]}>
      <Text style={[styles.title, themeStyle.text]}>MOVIMIENTOS</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, themeStyle.input]}
          placeholder="DESCRIPCION"
          placeholderTextColor={isDark ? "#777777" : "#999999"}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, themeStyle.input]}
          placeholder="MONTO"
          placeholderTextColor={isDark ? "#777777" : "#999999"}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, themeStyle.input]}
          placeholder="CATEGORIA"
          placeholderTextColor={isDark ? "#777777" : "#999999"}
          value={category}
          onChangeText={setCategory}
        />

        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "gasto"
                ? themeStyle.activeType
                : themeStyle.inactiveType,
            ]}
            onPress={() => setType("gasto")}
          >
            <Text
              style={[
                styles.typeText,
                type === "gasto"
                  ? themeStyle.activeTypeText
                  : themeStyle.inactiveTypeText,
              ]}
            >
              GASTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              type === "ingreso"
                ? themeStyle.activeType
                : themeStyle.inactiveType,
            ]}
            onPress={() => setType("ingreso")}
          >
            <Text
              style={[
                styles.typeText,
                type === "ingreso"
                  ? themeStyle.activeTypeText
                  : themeStyle.inactiveTypeText,
              ]}
            >
              INGRESO
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, themeStyle.button]}
          onPress={handleAdd}
        >
          <Text style={[styles.buttonText, themeStyle.buttonText]}>
            REGISTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, themeStyle.input]}
        placeholder="BUSCAR..."
        placeholderTextColor={isDark ? "#777777" : "#999999"}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "todos"
              ? themeStyle.activeFilter
              : themeStyle.inactiveFilter,
          ]}
          onPress={() => setFilterType("todos")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "todos"
                ? themeStyle.activeFilterText
                : themeStyle.inactiveFilterText,
            ]}
          >
            TODOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "ingreso"
              ? themeStyle.activeFilter
              : themeStyle.inactiveFilter,
          ]}
          onPress={() => setFilterType("ingreso")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "ingreso"
                ? themeStyle.activeFilterText
                : themeStyle.inactiveFilterText,
            ]}
          >
            INGRESOS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filterType === "gasto"
              ? themeStyle.activeFilter
              : themeStyle.inactiveFilter,
          ]}
          onPress={() => setFilterType("gasto")}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "gasto"
                ? themeStyle.activeFilterText
                : themeStyle.inactiveFilterText,
            ]}
          >
            GASTOS
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovementRow item={item} onDelete={handleDelete} isDark={isDark} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 0,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 1,
  },

  form: {
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
    borderRadius: 0,
    fontSize: 14,
  },

  typeContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },

  typeBtn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 0,
  },

  typeText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  button: {
    padding: 12,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 0,
  },

  buttonText: {
    fontWeight: "bold",
    letterSpacing: 1,
  },

  filterContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },

  filterBtn: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 0,
  },

  filterText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },

  text: {
    color: "#000000",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    color: "#000000",
  },

  activeType: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  inactiveType: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
  },

  activeTypeText: {
    color: "#FFFFFF",
  },

  inactiveTypeText: {
    color: "#000000",
  },

  button: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  buttonText: {
    color: "#FFFFFF",
  },

  activeFilter: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },

  inactiveFilter: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  inactiveFilterText: {
    color: "#000000",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
  },

  text: {
    color: "#FFFFFF",
  },

  input: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
  },

  activeType: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  inactiveType: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
  },

  activeTypeText: {
    color: "#000000",
  },

  inactiveTypeText: {
    color: "#FFFFFF",
  },

  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  buttonText: {
    color: "#000000",
  },

  activeFilter: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  inactiveFilter: {
    backgroundColor: "#000000",
    borderColor: "#FFFFFF",
  },

  activeFilterText: {
    color: "#000000",
  },

  inactiveFilterText: {
    color: "#FFFFFF",
  },
});
