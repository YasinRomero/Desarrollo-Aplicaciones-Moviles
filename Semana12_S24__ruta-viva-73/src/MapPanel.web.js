import { Text, View } from "react-native";

export default function MapPanel({ position }) {
  if (!position) {
    return (
      <View
        style={{
          height: 280,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18191A",
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#8A8F98" }}>
          Esperando ubicación del navegador...
        </Text>
      </View>
    );
  }

  const lat = position.latitude;
  const lon = position.longitude;

  const bbox = [lon - 0.01, lat - 0.008, lon + 0.01, lat + 0.008].join(",");

  const url =
    `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <View style={{ height: 280, overflow: "hidden", borderRadius: 12 }}>
      <iframe
        title="Mapa de ubicación"
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </View>
  );
}
