import { Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function MapPanel({ position, route }) {
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
        <Text style={{ color: "#8A8F98" }}>Esperando ubicación GPS...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: 280,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        <Marker
          coordinate={position}
          title="Mi ubicación"
          description="Posición registrada por GPS"
        />

        {route.length > 1 && (
          <Polyline coordinates={route} strokeColor="#5E6AD2" strokeWidth={4} />
        )}
      </MapView>
    </View>
  );
}
