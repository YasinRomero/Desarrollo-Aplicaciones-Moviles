import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";

const STORAGE_KEY = "semana11_fotos";

export async function getPhotos() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export async function savePhoto(photo, previousPhotos) {
  let uri = photo.uri;

  // Temporal solo para su visualización en navegadores
  if (Platform.OS !== "web") {
    const file = new File(Paths.document, `foto-${Date.now()}.jpg`);
    await new File(photo.uri).copy(file);
    uri = file.uri;
  }

  const savedPhoto = { id: `${Date.now()}`, uri, date: photo.date };
  const photos = [savedPhoto, ...previousPhotos].slice(0, 3);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

  // Temporal solo para su visualización en navegadores
  if (Platform.OS !== "web") {
    for (const oldPhoto of previousPhotos.slice(2)) {
      const oldFile = new File(oldPhoto.uri);
      if (oldFile.exists) await oldFile.delete();
    }
  }

  return photos;
}
