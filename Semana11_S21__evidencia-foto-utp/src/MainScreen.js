import React, { useRef, useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useCameraPermissions } from "expo-camera";
import PermissionView from "./PermissionView";
import CameraScreen from "./CameraScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import { saveEvidenceToPersistentStorage, getEvidences } from "./storageHelper";

export default function MainScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [recentEvidences, setRecentEvidences] = useState([]);

  useEffect(() => {
    loadStoredEvidences();
  }, []);

  const loadStoredEvidences = async () => {
    const list = await getEvidences();
    setRecentEvidences(list);
  };

  const takePhoto = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) setPhoto(result.uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la fotografía.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEvidence = async (description) => {
    try {
      const updated = await saveEvidenceToPersistentStorage(photo, description);
      setRecentEvidences(updated);
      setPhoto(null);
      Alert.alert("Éxito", "Evidencia guardada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la evidencia en almacenamiento.");
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Comprobando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return <PermissionView onRequestPermission={requestPermission} />;
  }

  if (photo) {
    return (
      <ConfirmationScreen
        photoUri={photo}
        onSave={handleSaveEvidence}
        onDiscard={() => setPhoto(null)}
      />
    );
  }

  return (
    <CameraScreen
      cameraRef={cameraRef}
      facing={facing}
      setFacing={setFacing}
      flash={flash}
      setFlash={setFlash}
      busy={busy}
      onTakePhotos={takePhoto}
      recentEvidences={recentEvidences}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 24,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
  },
});