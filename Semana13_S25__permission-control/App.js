import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Linking, ScrollView, Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import PermissionCard from "./src/PermissionCard";
import styles from "./src/styles";

export default function App() {
  const [permissions, setPermissions] = useState({
    camera: null,
    location: null,
    microphone: null,
  });
  const [loading, setLoading] = useState({});
  const [lastCheck, setLastCheck] = useState(null);

  const verifyPermissions = useCallback(async () => {
    setLoading((previous) => ({ ...previous, verify: true }));

    try {
      const results = await Promise.allSettled([
        Camera.getCameraPermissionsAsync(),
        Location.getForegroundPermissionsAsync(),
        Camera.getMicrophonePermissionsAsync(),
      ]);

      const keys = ["camera", "location", "microphone"];
      const next = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          next[keys[index]] = result.value;
        }
      });

      setPermissions((previous) => ({ ...previous, ...next }));
      setLastCheck(new Date());

      if (results.some((result) => result.status === "rejected")) {
        Alert.alert("Aviso", "No se pudieron consultar todos los permisos.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron verificar los permisos.");
    } finally {
      setLoading((previous) => ({ ...previous, verify: false }));
    }
  }, []);

  useEffect(() => {
    verifyPermissions();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        verifyPermissions();
      }
    });

    return () => subscription.remove();
  }, [verifyPermissions]);

  const requestPermission = async (key) => {
    const requests = {
      camera: Camera.requestCameraPermissionsAsync,
      location: Location.requestForegroundPermissionsAsync,
      microphone: Camera.requestMicrophonePermissionsAsync,
    };

    if (loading[key] || !requests[key]) return;

    setLoading((previous) => ({ ...previous, [key]: true }));

    try {
      const result = await requests[key]();
      setPermissions((previous) => ({ ...previous, [key]: result }));
    } catch (error) {
      console.error(`Error en ${key}:`, error);
      Alert.alert(
        "Error de permiso",
        `${key}: ${error.message || "Error desconocido"}`,
      );
    } finally {
      setLoading((previous) => ({ ...previous, [key]: false }));
    }
  };

  const granted = ["camera", "location", "microphone"].filter(
    (key) => permissions[key]?.status === "granted",
  ).length;

  const items = [
    {
      key: "camera",
      title: "Cámara",
      description: "Permite utilizar la cámara para capturar imágenes.",
      permission: permissions.camera,
    },
    {
      key: "location",
      title: "Ubicación",
      description:
        "Permite conocer tu ubicación mientras utilizas la aplicación.",
      permission: permissions.location,
    },
    {
      key: "microphone",
      title: "Micrófono",
      description: "Permite utilizar el micrófono para capturar audio.",
      permission: permissions.microphone,
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Permisos concedidos</Text>
        <Text style={styles.summaryValue}>{granted} de 3</Text>
      </View>

      <View style={styles.cards}>
        {items.map((item) => (
          <PermissionCard
            key={item.key}
            title={item.title}
            description={item.description}
            permission={item.permission}
            loading={!!loading[item.key]}
            onRequest={() => requestPermission(item.key)}
            onSettings={() =>
              Linking.openSettings().catch(() => {
                Alert.alert("Error", "No se pudieron abrir los ajustes.");
              })
            }
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Text
          style={styles.verifyButton}
          onPress={verifyPermissions}
          accessibilityRole="button"
          accessibilityState={{ disabled: !!loading.verify }}
          disabled={!!loading.verify}
        >
          {loading.verify ? "Verificando..." : "Verificar nuevamente"}
        </Text>
        <Text style={styles.lastCheck}>
          Última consulta:{" "}
          {lastCheck ? lastCheck.toLocaleString("es-PE") : "Pendiente"}
        </Text>
      </View>
    </ScrollView>
  );
}
