import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

export default function SettingsScreen() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [intervalSec, setIntervalSec] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [intervalSec]);

  return (
    <View>
      <Text>Hora actual: {time}</Text>
      <Text>Intervalo actual: {intervalSec} segundo(s)</Text>
      <Button title="Cambiar a 1 segundo" onPress={() => setIntervalSec(1)} />
      <Button title="Cambiar a 2 segundos" onPress={() => setIntervalSec(2)} />
      <Button title="Cambiar a 5 segundos" onPress={() => setIntervalSec(5)} />
    </View>
  );
}
