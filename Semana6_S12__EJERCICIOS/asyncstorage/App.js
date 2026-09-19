import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "@todo_tasks";
const FILTERS = ["Todas", "Pendientes", "Completadas"];

export default function App() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [message, setMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) setTasks(JSON.parse(storedTasks));
      } catch {
        Alert.alert(
          "No se pudieron cargar las tareas",
          "Intenta abrir la app nuevamente.",
        );
      } finally {
        setHydrated(true);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {
      Alert.alert(
        "No se pudo guardar la lista",
        "Revisa el almacenamiento del dispositivo.",
      );
    });
  }, [hydrated, tasks]);

  useEffect(() => {
    const pendingTasks = tasks.filter((task) => !task.completed).length;

    if (tasks.length === 0) setMessage("Agrega tu primera tarea");
    else if (pendingTasks > 5) setMessage("Demasiadas tareas pendientes");
    else
      setMessage(
        `${pendingTasks} ${pendingTasks === 1 ? "tarea pendiente" : "tareas pendientes"}`,
      );
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "Pendientes") return tasks.filter((task) => !task.completed);
    if (filter === "Completadas") return tasks.filter((task) => task.completed);
    return tasks;
  }, [filter, tasks]);

  const addTask = () => {
    const text = taskText.trim();
    if (!text) return;

    setTasks((currentTasks) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...currentTasks,
    ]);
    setTaskText("");
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedCard]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed }}
        onPress={() => toggleTask(item.id)}
        style={styles.taskContent}
      >
        <View style={[styles.check, item.completed && styles.checked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.taskDetails}>
          <Text
            style={[styles.taskText, item.completed && styles.completedText]}
          >
            {item.text}
          </Text>
          <Text style={styles.dateText}>
            Agregada: {new Date(item.createdAt).toLocaleString("es-PE")}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel={`Eliminar ${item.text}`}
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>NUEVA TAREA</Text>
          <TextInput
            onChangeText={setTaskText}
            onSubmitEditing={addTask}
            placeholder="Escribe una tarea..."
            placeholderTextColor="#8490a6"
            returnKeyType="done"
            style={styles.input}
            value={taskText}
          />
          <Pressable onPress={addTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>Agregar</Text>
          </Pressable>
        </View>

        <View style={styles.filters}>
          {FILTERS.map((option) => (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              style={[
                styles.filterButton,
                filter === option && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === option && styles.activeFilterText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {tasks.length === 0
                ? "Aun no tienes tareas."
                : "No hay tareas en este filtro."}
            </Text>
          }
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f8f5",
  },

  container: {
    flex: 1,
    backgroundColor: "#f3f8f5",
  },

  header: {
    backgroundColor: "#123b32",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 18,
  },

  title: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  subtitle: {
    color: "#c2e3d8",
    fontFamily: "monospace",
    fontSize: 15,
    marginTop: 16,
  },

  inputRow: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#d4e6df",
    borderBottomWidth: 1,
    padding: 20,
  },

  inputLabel: {
    color: "#287c68",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f3f8f5",
    borderColor: "#b9d8cd",
    borderRadius: 4,
    borderWidth: 1,
    color: "#173d34",
    fontFamily: "monospace",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  addButton: {
    alignItems: "center",
    backgroundColor: "#289e7e",
    borderRadius: 4,
    justifyContent: "center",
    marginTop: 10,
    minHeight: 43,
  },

  addButtonText: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
  },

  filters: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 12,
  },

  filterButton: {
    alignItems: "center",
    borderColor: "#b9d8cd",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    marginRight: 6,
    paddingVertical: 9,
  },

  activeFilter: {
    backgroundColor: "#d9f0e8",
    borderColor: "#289e7e",
  },

  filterText: {
    color: "#527267",
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#176e58",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    flexGrow: 1,
  },

  taskCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#cfe3db",
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    padding: 12,
  },

  completedCard: {
    backgroundColor: "#edf5f1",
  },

  taskContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },

  check: {
    alignItems: "center",
    borderColor: "#8eb9aa",
    borderRadius: 4,
    borderWidth: 2,
    height: 22,
    justifyContent: "center",
    marginRight: 12,
    width: 22,
  },

  checked: {
    backgroundColor: "#289e7e",
    borderColor: "#289e7e",
  },

  checkmark: {
    color: "#ffffff",
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "800",
  },

  taskDetails: {
    flex: 1,
  },

  taskText: {
    color: "#173d34",
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "600",
  },

  completedText: {
    color: "#78948a",
    textDecorationLine: "line-through",
  },

  dateText: {
    color: "#78948a",
    fontFamily: "monospace",
    fontSize: 11,
    marginTop: 5,
  },

  deleteButton: {
    paddingLeft: 12,
    paddingVertical: 7,
  },

  deleteText: {
    color: "#c05d5d",
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: {
    color: "#78948a",
    fontFamily: "monospace",
    fontSize: 15,
    paddingTop: 45,
    textAlign: "center",
  },
});
