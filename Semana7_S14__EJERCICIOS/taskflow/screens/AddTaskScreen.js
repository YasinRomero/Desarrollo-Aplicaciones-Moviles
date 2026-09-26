import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Por favor llena todos los campos");
      return;
    }

    const storedTasks = await SecureStore.getItemAsync("tasks");
    const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
    };

    const updatedTasks = [...currentTasks, newTask];
    await SecureStore.setItemAsync("tasks", JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  return (
    <View>
      <Text>Título de la tarea:</Text>
      <TextInput value={title} onChangeText={setTitle} />
      <Text>Descripción:</Text>
      <TextInput value={description} onChangeText={setDescription} />
      {error ? <Text>{error}</Text> : null}
      <Button title="Guardar Tarea" onPress={handleSave} />
    </View>
  );
}
