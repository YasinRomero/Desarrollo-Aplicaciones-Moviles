import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

export default function PermissionCard({
  title,
  description,
  permission,
  loading,
  onRequest,
  onSettings,
}) {
  const status = permission?.status;

  const label = !permission
    ? "No consultado"
    : status === "granted"
      ? "Concedido"
      : status === "denied"
        ? "Denegado"
        : "No determinado";

  const blocked = status === "denied" && permission.canAskAgain === false;
  const granted = status === "granted";

  const message = granted
    ? "Acceso autorizado."
    : blocked
      ? "Acceso bloqueado. Modifícalo desde Ajustes."
      : status === "denied"
        ? "Acceso denegado. Puedes intentar nuevamente."
        : "El acceso todavía no está autorizado.";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View
          style={[
            styles.status,
            granted && styles.statusGranted,
            status === "denied" && styles.statusDenied,
          ]}
        >
          <Text style={styles.statusText}>{label}</Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={styles.message}>{message}</Text>

      {blocked ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onSettings}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Abrir ajustes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, (granted || loading) && styles.buttonDisabled]}
          onPress={onRequest}
          disabled={granted || loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: granted || loading }}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Solicitando..."
              : granted
                ? "Acceso concedido"
                : `Solicitar ${title.toLowerCase()}`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
