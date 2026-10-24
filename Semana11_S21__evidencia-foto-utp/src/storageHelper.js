import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@utp_evidences_key";

export async function saveEvidenceToPersistentStorage(tempUri, description) {
  try {
    const fileName = tempUri.split("/").pop();
    const permanentUri = `${FileSystem.documentDirectory}${Date.now()}_${fileName}`;
    await FileSystem.copyAsync({
      from: tempUri,
      to: permanentUri,
    });

    const newEvidence = {
      id: Date.now().toString(),
      uri: permanentUri,
      date: new Date().toLocaleString(),
      description: description || "Sin descripción",
    };

    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const evidences = existingData ? JSON.parse(existingData) : [];
    const updatedEvidences = [newEvidence, ...evidences];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvidences));
    return updatedEvidences;
  } catch (error) {
    throw error;
  }
}

export async function getEvidences() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}