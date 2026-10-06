import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@prefs/theme";
const DEFAULT_QTY_KEY = "@prefs/defaultQty";
const LIST_KEY = "UTPList";

export default function SettingsScreen({
  darkMode,
  defaultQuantity,
  onThemeChange,
  onDefaultQuantityChange,
}) {
  const [theme, setTheme] = useState(darkMode);
  const [defaultQty, setDefaultQty] = useState(defaultQuantity);
  const [jsonData, setJsonData] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const savedQuantity = await AsyncStorage.getItem(DEFAULT_QTY_KEY);
        const isDark = savedTheme === "dark";

        setTheme(isDark);
        onThemeChange(isDark);

        if (savedQuantity !== null) {
          setDefaultQty(savedQuantity);
          onDefaultQuantityChange(savedQuantity);
        }
      } catch {
        Alert.alert("Error", "No se pudieron cargar las preferencias.");
      }
    };

    loadPreferences();
  }, []);

  const changeTheme = async (value) => {
    setTheme(value);
    onThemeChange(value);
    await AsyncStorage.setItem(THEME_KEY, value ? "dark" : "light");
  };

  const saveDefaultQuantity = async () => {
    const value = defaultQty.trim();
    if (value && (!/^\d+$/.test(value) || Number(value) <= 0)) {
      Alert.alert(
        "Validación",
        "La cantidad predeterminada debe ser un número mayor que cero.",
      );
      return;
    }

    await AsyncStorage.setItem(DEFAULT_QTY_KEY, value);
    onDefaultQuantityChange(value);

    Alert.alert("Configuración", "Cantidad predeterminada guardada.");
  };

  const clearAll = () => {
    Alert.alert(
      "Borrar lista",
      "¿Deseas eliminar todos los productos guardados?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(LIST_KEY);
            Alert.alert(
              "Lista eliminada",
              "Todos los productos fueron borrados.",
            );
          },
        },
      ],
    );
  };

  const exportList = async () => {
    try {
      const storedList = await AsyncStorage.getItem(LIST_KEY);
      const parsedList = storedList ? JSON.parse(storedList) : [];
      setJsonData(JSON.stringify(parsedList, null, 2));
    } catch {
      Alert.alert("Error", "No se pudo exportar la lista.");
    }
  };

  const importList = async () => {
    try {
      if (!jsonData.trim()) {
        Alert.alert("Validación", "Ingresa un JSON para importar.");
        return;
      }

      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error();
      }

      const normalizedList = parsedData
        .map((currentItem, index) => {
          if (
            !currentItem ||
            typeof currentItem !== "object" ||
            typeof currentItem.title !== "string"
          ) {
            throw new Error();
          }

          return {
            id:
              currentItem.id !== undefined
                ? String(currentItem.id)
                : `${Date.now()}-${index}-${Math.random()
                    .toString(36)
                    .slice(2)}`,
            title: currentItem.title.trim(),
            quantity:
              currentItem.quantity !== undefined &&
              currentItem.quantity !== null
                ? String(currentItem.quantity)
                : "",
            done: Boolean(currentItem.done),
            createdAt: currentItem.createdAt || new Date().toISOString(),
          };
        })
        .filter((currentItem) => currentItem.title);

      await AsyncStorage.setItem(LIST_KEY, JSON.stringify(normalizedList));
      setJsonData(JSON.stringify(normalizedList, null, 2));

      Alert.alert(
        "Importación completa",
        `Se importaron ${normalizedList.length} productos.`,
      );
    } catch {
      Alert.alert(
        "JSON inválido",
        "El contenido debe ser un arreglo JSON válido de productos.",
      );
    }
  };

  const colors = theme
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
      <Text style={[styles.title, { color: colors.text }]}>Configuración</Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Preferencias
      </Text>
      <View style={styles.switchRow}>
        <Text style={[styles.label, { color: colors.text }]}>Modo oscuro</Text>
        <Switch value={theme} onValueChange={changeTheme} />
      </View>
      <Text style={[styles.label, { color: colors.text }]}>
        Cantidad predeterminada
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
        value={defaultQty}
        onChangeText={setDefaultQty}
        keyboardType="numeric"
        placeholder="Ejemplo: 1"
        placeholderTextColor={colors.secondary}
      />
      <Pressable
        style={[styles.button, { backgroundColor: colors.text }]}
        onPress={saveDefaultQuantity}
      >
        <Text style={[styles.buttonText, { color: colors.background }]}>
          Guardar cantidad
        </Text>
      </Pressable>
      <View style={[styles.separator, { borderColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Lista</Text>
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
      <View style={[styles.separator, { borderColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Importar / Exportar JSON
      </Text>
      <TextInput
        style={[
          styles.jsonInput,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={jsonData}
        onChangeText={setJsonData}
        multiline
        placeholder="Contenido JSON"
        placeholderTextColor={colors.secondary}
      />
      <View style={styles.jsonActions}>
        <Pressable
          style={[
            styles.button,
            styles.secondaryButton,
            styles.actionButton,
            {
              backgroundColor: colors.input,
              borderColor: darkMode ? "#555555" : "#111111",
            },
          ]}
          onPress={exportList}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Exportar JSON
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            styles.actionButton,
            { backgroundColor: colors.text },
          ]}
          onPress={importList}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Importar JSON
          </Text>
        </Pressable>
      </View>
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
    marginBottom: 14,
    fontSize: 16,
    fontWeight: "600",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    marginBottom: 8,
    fontSize: 15,
  },

  input: {
    height: 44,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 15,
  },

  jsonInput: {
    minHeight: 160,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 15,
    textAlignVertical: "top",
  },

  button: {
    minHeight: 42,
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

  separator: {
    marginVertical: 22,
    borderTopWidth: 1,
  },

  jsonActions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    flex: 1,
  },
});
