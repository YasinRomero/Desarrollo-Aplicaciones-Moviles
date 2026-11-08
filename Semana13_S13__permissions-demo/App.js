import { useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
} from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Audio from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PermissionCard from "./src/PermissionCard";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "./src/notifications";
import styles from "./src/styles";

const STORAGE_KEY = "permission-demo-states";
const initialPermission = { status: "pending", canAskAgain: true };
const permissionNames = {
  camera: "cámara",
  location: "ubicación",
  microphone: "micrófono",
  notifications: "notificaciones",
};

export default function App() {
  const [permissions, setPermissions] = useState({
    camera: initialPermission,
    location: initialPermission,
    microphone: initialPermission,
    notifications: initialPermission,
  });
  const [coordinates, setCoordinates] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [storageMessage, setStorageMessage] = useState("");
  const initialized = useRef(false);

  function showMessage(title, message, alert = true, canAskAgain = true) {
    setNotice(`${title}: ${message}`);
    if (alert && Platform.OS !== "web") {
      const buttons = [{ text: "Entendido" }];
      if (!canAskAgain) {
        buttons.push({
          text: "Abrir ajustes",
          onPress: () => Linking.openSettings(),
        });
      }
      Alert.alert(title, message, buttons);
    }
  }

  async function readCoordinates() {
    setLocationError("Obteniendo coordenadas...");
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoordinates(position.coords);
      setLocationError("");
    } catch (error) {
      setCoordinates(null);
      setLocationError(
        "No se pudo obtener la posición. Comprueba que el GPS esté activo.",
      );
    }
  }

  async function refreshPermissions() {
    const types = ["camera", "location", "microphone", "notifications"];
    const results = await Promise.allSettled([
      Camera.getCameraPermissionsAsync(),
      Location.getForegroundPermissionsAsync(),
      Audio.getRecordingPermissionsAsync(),
      getNotificationPermission(),
    ]);
    const current = {};

    results.forEach((result, index) => {
      current[types[index]] =
        result.status === "fulfilled"
          ? result.value
          : { status: "error", canAskAgain: true };
    });

    setPermissions((previous) => ({ ...previous, ...current }));
    if (current.location.status === "granted") {
      await readCoordinates();
    } else {
      setCoordinates(null);
      setLocationError("");
    }
    return current;
  }

  async function requestPermission(type, showAlert = true) {
    const requestMethods = {
      camera: Camera.requestCameraPermissionsAsync,
      location: Location.requestForegroundPermissionsAsync,
      microphone: Audio.requestRecordingPermissionsAsync,
      notifications: requestNotificationPermission,
    };

    setBusy(type);
    try {
      const result = await requestMethods[type]();
      setPermissions((previous) => ({ ...previous, [type]: result }));
      if (type === "location") {
        if (result.status === "granted") {
          await readCoordinates();
        } else {
          setCoordinates(null);
          setLocationError("");
        }
      }
      if (result.status === "denied") {
        const message =
          result.canAskAgain === false
            ? `El acceso a ${permissionNames[type]} está bloqueado. Actívalo desde Ajustes.`
            : `No se concedió el acceso a ${permissionNames[type]}. Puedes volver a intentarlo.`;
        showMessage(
          "Permiso denegado",
          message,
          showAlert,
          result.canAskAgain !== false,
        );
      }
    } catch (error) {
      setPermissions((previous) => ({
        ...previous,
        [type]: { status: "error", canAskAgain: true },
      }));
      showMessage(
        "Error",
        `No fue posible solicitar el permiso de ${permissionNames[type]}.`,
        showAlert,
      );
    } finally {
      setBusy("");
    }
  }

  async function handlePermission(type) {
    const permission = permissions[type];
    if (permission.status === "unavailable") return;
    if (permission.status === "denied" && permission.canAskAgain === false) {
      if (Platform.OS === "web") {
        setNotice(
          "Cambia los permisos desde la configuración de este sitio en tu navegador.",
        );
      } else {
        await Linking.openSettings();
      }
      return;
    }
    if (permission.status === "granted") {
      if (type === "location") {
        setBusy("location");
        await readCoordinates();
        setBusy("");
      } else {
        await refreshPermissions();
      }
      return;
    }
    await requestPermission(type);
  }

  async function pickFile() {
    setBusy("files");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length) {
        setSelectedFile(result.assets[0].name);
      }
    } catch (error) {
      showMessage("Error", "No se pudo abrir el selector de archivos.");
    } finally {
      setBusy("");
    }
  }

  async function retryMainPermissions() {
    await requestPermission("camera");
    await requestPermission("location");
  }

  useEffect(() => {
    const states = Object.fromEntries(
      Object.entries(permissions)
        .filter(([, value]) =>
          ["granted", "denied", "undetermined"].includes(value.status),
        )
        .map(([key, value]) => [key, value.status]),
    );
    if (!Object.keys(states).length) return;

    AsyncStorage.mergeItem(STORAGE_KEY, JSON.stringify(states))
      .then(() => setStorageMessage("Estados guardados en este dispositivo."))
      .catch(() =>
        setStorageMessage("No fue posible guardar los estados localmente."),
      );
  }, [permissions]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refreshPermissions();
    });

    if (!initialized.current) {
      initialized.current = true;
      (async () => {
        const current = await refreshPermissions();
        if (current.camera.status === "undetermined") {
          await requestPermission("camera", false);
        }
        if (current.location.status === "undetermined") {
          await requestPermission("location", false);
        }
      })();
    }

    return () => subscription.remove();
  }, []);

  const labelFor = (type) => {
    const permission = permissions[type];
    if (permission.status === "unavailable") return "Solo en móvil";
    if (permission.status === "granted") return "Actualizar";
    if (permission.status === "denied" && permission.canAskAgain === false) {
      return Platform.OS === "web" ? "Revisar navegador" : "Abrir ajustes";
    }
    return permission.status === "denied" ? "Reintentar" : "Solicitar permiso";
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Permisos del dispositivo</Text>
        <Text style={styles.description}>
          Revisa qué accesos están permitidos y decide cuáles quieres habilitar.
        </Text>

        <PermissionCard
          title="Cámara"
          description="Permite utilizar la cámara del dispositivo."
          permission={permissions.camera}
          details={
            permissions.camera.status === "granted"
              ? "La cámara está lista para usarse."
              : ""
          }
          buttonLabel={labelFor("camera")}
          onPress={() => handlePermission("camera")}
          busy={busy === "camera"}
          disabled={Boolean(busy)}
        />

        <PermissionCard
          title="Ubicación"
          description="Obtiene tu posición actual mientras usas la aplicación."
          permission={permissions.location}
          details={
            coordinates
              ? `Latitud: ${coordinates.latitude.toFixed(4)} · Longitud: ${coordinates.longitude.toFixed(4)}`
              : locationError
          }
          buttonLabel={
            permissions.location.status === "granted"
              ? "Actualizar GPS"
              : labelFor("location")
          }
          onPress={() => handlePermission("location")}
          busy={busy === "location"}
          disabled={Boolean(busy)}
        />

        <PermissionCard
          title="Micrófono"
          description="Autoriza el uso del micrófono sin iniciar ninguna grabación."
          permission={permissions.microphone}
          buttonLabel={labelFor("microphone")}
          onPress={() => handlePermission("microphone")}
          busy={busy === "microphone"}
          disabled={Boolean(busy)}
        />

        <PermissionCard
          title="Archivos"
          description="Selecciona un documento sin dar acceso a todos tus archivos."
          permission={{ status: "selection" }}
          details={
            selectedFile
              ? `Archivo elegido: ${selectedFile}`
              : "Ningún archivo seleccionado."
          }
          buttonLabel="Elegir archivo"
          onPress={pickFile}
          busy={busy === "files"}
          disabled={Boolean(busy)}
        />

        <PermissionCard
          title="Notificaciones"
          description="Autoriza notificaciones del sistema en Android o iOS."
          permission={permissions.notifications}
          details={
            Platform.OS === "web" ? "Esta función requiere Android o iOS." : ""
          }
          buttonLabel={labelFor("notifications")}
          onPress={() => handlePermission("notifications")}
          busy={busy === "notifications"}
          disabled={
            Boolean(busy) || permissions.notifications.status === "unavailable"
          }
        />

        <Pressable
          accessibilityRole="button"
          onPress={retryMainPermissions}
          disabled={Boolean(busy)}
          style={styles.retryButton}
        >
          <Text style={styles.link}>
            Reintentar permisos de cámara y ubicación
          </Text>
        </Pressable>
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {storageMessage ? (
          <Text style={styles.small}>{storageMessage}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
