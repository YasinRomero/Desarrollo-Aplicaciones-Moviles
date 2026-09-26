import { View, Text, Button } from "react-native";
import { useNews } from "../context/NewsContext";

export default function SettingsScreen() {
  const { intervalTime, changeInterval, resetAppStorage } = useNews();

  return (
    <View>
      <Text>Intervalo actual: {intervalTime / 1000}s</Text>
      <Button
        title="Cambiar a 3 segundos"
        onPress={() => changeInterval(3000)}
      />
      <Button
        title="Cambiar a 5 segundos"
        onPress={() => changeInterval(5000)}
      />
      <Button
        title="Cambiar a 10 segundos"
        onPress={() => changeInterval(10000)}
      />
      <Button title="Resetear App (Borrar Storage)" onPress={resetAppStorage} />
    </View>
  );
}
