import { Pressable, Text, View } from "react-native";
import styles from "./styles";

const statusLabels = {
  pending: "Comprobando",
  undetermined: "Pendiente",
  granted: "Permitido",
  denied: "Denegado",
  unavailable: "No disponible",
  selection: "Acceso por selección",
  error: "Error de consulta",
};

export default function PermissionCard({
  title,
  description,
  permission,
  details,
  buttonLabel,
  onPress,
  busy,
  disabled,
}) {
  const denied = permission.status === "denied";
  const detail = denied
    ? permission.canAskAgain === false
      ? "El permiso está bloqueado. Debes cambiarlo en Ajustes."
      : "Permiso denegado. Puedes solicitarlo nuevamente."
    : details;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeading}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.status}>
          {statusLabels[permission.status] || "Pendiente"}
        </Text>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${buttonLabel}: ${title}`}
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>
          {busy ? "Procesando..." : buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
}
