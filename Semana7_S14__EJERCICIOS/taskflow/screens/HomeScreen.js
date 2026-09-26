import { useState, useCallback } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);

  const loadData = async () => {
    const storedTasks = await SecureStore.getItemAsync("tasks");
    const storedCompleted = await SecureStore.getItemAsync("completedCount");
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    else setTasks([]);

    if (storedCompleted) setCompletedCount(parseInt(storedCompleted, 10));
    else setCompletedCount(0);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const completeTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const newCompletedCount = completedCount + 1;
    setTasks(updatedTasks);
    setCompletedCount(newCompletedCount);
    await SecureStore.setItemAsync("tasks", JSON.stringify(updatedTasks));
    await SecureStore.setItemAsync(
      "completedCount",
      newCompletedCount.toString(),
    );
  };

  const clearAllTasks = async () => {
    setTasks([]);
    await SecureStore.setItemAsync("tasks", JSON.stringify([]));
  };

  return (
    <View>
      <Text>¡Bienvenido a TaskFlow!</Text>
      <Text>Tareas completadas: {completedCount}</Text>
      <Button
        title="Agregar Nueva Tarea"
        onPress={() => navigation.navigate("AddTask")}
      />
      <Button title="Eliminar Todas las Tareas" onPress={clearAllTasks} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Completar" onPress={() => completeTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
