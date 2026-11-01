import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapPanel from "./MapPanel";
import { getDistance } from "./distance";

const LOCATION_KEY = "fitness_last_location";
const HISTORY_KEY = "fitness_history";

function Button({ label, onPress, primary = false }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && styles.buttonPrimary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, primary && styles.buttonTextPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Metric({ label, value, unit, large = false }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.metricLine}>
        <Text style={[styles.metricValue, large && styles.metricLarge]}>
          {value}
        </Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <View style={[styles.detailRow, !last && styles.borderBottom]}>
      <Text style={styles.secondary}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SectionToggle({ title, subtitle, open, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.sectionToggle}>
      <View style={styles.flex}>
        <Text style={styles.sectionName}>{title}</Text>
        <Text style={styles.secondary}>{subtitle}</Text>
      </View>
      <Text style={styles.toggleIcon}>{open ? "−" : "+"}</Text>
    </Pressable>
  );
}

export default function Tracker() {
  const { width } = useWindowDimensions();
  const isWide = width >= 800;

  const [page, setPage] = useState("activity");
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [acceleration, setAcceleration] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [recovered, setRecovered] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("Conectando GPS");
  const [sensorStatus, setSensorStatus] = useState("Comprobando");
  const [notice, setNotice] = useState("");
  const [showSensors, setShowSensors] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const previousPosition = useRef(null);
  const previousMagnitude = useRef(1);
  const lastStepTime = useRef(0);
  const speedSum = useRef(0);
  const speedCount = useRef(0);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const savedPosition = await AsyncStorage.getItem(LOCATION_KEY);
        const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);

        if (!active) return;

        if (savedPosition) {
          setPosition(JSON.parse(savedPosition));
          setRecovered(true);
        }

        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch {
        if (active) setNotice("No se pudieron recuperar los datos.");
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let subscription;

    function updateLocation(reading) {
      if (!active) return;

      const point = {
        latitude: reading.coords.latitude,
        longitude: reading.coords.longitude,
      };

      setPosition(point);
      setGpsStatus("GPS conectado");

      if (!previousPosition.current) {
        previousPosition.current = point;
        setRoute((current) => (current.length ? current : [point]));
      } else {
        const difference = getDistance(previousPosition.current, point);
        const accuracy = reading.coords.accuracy;

        if (
          difference >= 0.004 &&
          difference <= 0.2 &&
          (accuracy == null || accuracy <= 50)
        ) {
          setDistance((current) => current + difference);
          setRoute((current) => [...current, point]);
          previousPosition.current = point;
        } else if (difference > 0.2) {
          previousPosition.current = point;
        }
      }

      const speed = reading.coords.speed;

      if (typeof speed === "number" && speed >= 0) {
        speedSum.current += speed * 3.6;
        speedCount.current += 1;
        setAverageSpeed(speedSum.current / speedCount.current);
      }

      AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(point)).catch(() => {
        setNotice("No se pudo guardar la ubicación.");
      });
    }

    async function startLocation() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!active) return;

        if (permission.status !== "granted") {
          setGpsStatus("Permiso denegado");
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!active) return;

        updateLocation(current);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 3,
          },
          updateLocation,
          () => {
            if (active) setGpsStatus("Error de ubicación");
          },
        );

        if (!active) subscription.remove();
      } catch {
        if (active) setGpsStatus("GPS no disponible");
      }
    }

    startLocation();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    let active = true;
    let subscription;

    async function startAccelerometer() {
      if (Platform.OS === "web") {
        setSensorStatus("Disponible en Android");
        return;
      }

      try {
        const available = await Accelerometer.isAvailableAsync();

        if (!active) return;

        if (!available) {
          setSensorStatus("No disponible");
          return;
        }

        Accelerometer.setUpdateInterval(250);

        subscription = Accelerometer.addListener((data) => {
          if (!active) return;

          setAcceleration(data);

          const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

          const change = Math.abs(magnitude - previousMagnitude.current);

          const now = Date.now();

          if (change > 0.22 && now - lastStepTime.current > 450) {
            setSteps((current) => current + 1);
            lastStepTime.current = now;
          }

          previousMagnitude.current = magnitude;
        });

        setSensorStatus("Activo");
      } catch {
        if (active) setSensorStatus("Error de lectura");
      }
    }

    startAccelerometer();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  function resetSession() {
    setDistance(0);
    setSteps(0);
    setAverageSpeed(0);
    setRoute(position ? [position] : []);

    previousPosition.current = position;
    previousMagnitude.current = 1;
    lastStepTime.current = 0;
    speedSum.current = 0;
    speedCount.current = 0;

    setNotice("Recorrido reiniciado.");
  }

  async function saveSession() {
    if (route.length < 2 || distance === 0) {
      setNotice("Primero realiza un recorrido.");
      return;
    }

    const session = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("es-PE"),
      distance,
      steps,
      averageSpeed,
      route: [...route],
    };

    const updated = [session, ...history];

    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
      resetSession();
      setSelected(session);
      setPage("history");
      setNotice("");
    } catch {
      setNotice("No se pudo guardar el recorrido.");
    }
  }

  async function takePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setNotice("Permite el acceso a la cámara.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
        setNotice("Fotografía capturada.");
      }
    } catch {
      setNotice("No se pudo abrir la cámara.");
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <View style={styles.topbar}>
        <Text style={styles.brand}>FitnessTracker</Text>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => setPage("activity")}
            style={[styles.tab, page === "activity" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                page === "activity" && styles.activeTabText,
              ]}
            >
              Actividad
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPage("history")}
            style={[styles.tab, page === "history" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                page === "history" && styles.activeTabText,
              ]}
            >
              Historial
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          {page === "activity" ? (
            <>
              <View style={styles.mapArea}>
                <MapPanel position={position} route={route} />
              </View>

              <View style={styles.locationBar}>
                <View style={styles.locationStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.secondary}>{gpsStatus}</Text>
                </View>

                <Text style={styles.coordinate}>
                  {position
                    ? `${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`
                    : "Sin coordenadas"}
                </Text>
              </View>

              <View style={styles.mainMetric}>
                <Text style={styles.label}>Distancia recorrida</Text>

                <View style={styles.distanceLine}>
                  <Text style={styles.distanceValue}>
                    {distance.toFixed(3)}
                  </Text>
                  <Text style={styles.distanceUnit}>km</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <Metric label="Pasos estimados" value={steps.toString()} />
                <Metric
                  label="Velocidad promedio"
                  value={averageSpeed.toFixed(1)}
                  unit="km/h"
                />
                <Metric label="Puntos GPS" value={route.length.toString()} />
              </View>

              <View style={styles.actions}>
                <Button
                  label="Guardar recorrido"
                  onPress={saveSession}
                  primary
                />
                <Button label="Reiniciar" onPress={resetSession} />
              </View>

              <View style={styles.details}>
                <SectionToggle
                  title="Sensores"
                  subtitle="Acelerómetro y coordenadas"
                  open={showSensors}
                  onPress={() => setShowSensors(!showSensors)}
                />

                {showSensors && (
                  <View style={styles.expanded}>
                    <DetailRow label="Acelerómetro" value={sensorStatus} />
                    <DetailRow
                      label="Eje X"
                      value={acceleration.x.toFixed(3)}
                    />
                    <DetailRow
                      label="Eje Y"
                      value={acceleration.y.toFixed(3)}
                    />
                    <DetailRow
                      label="Eje Z"
                      value={acceleration.z.toFixed(3)}
                    />
                    <DetailRow
                      label="Latitud"
                      value={position ? position.latitude.toFixed(6) : "---"}
                    />
                    <DetailRow
                      label="Longitud"
                      value={position ? position.longitude.toFixed(6) : "---"}
                      last
                    />

                    {recovered && (
                      <Text style={styles.helper}>
                        Última posición cargada del almacenamiento local.
                      </Text>
                    )}
                  </View>
                )}

                <SectionToggle
                  title="Cámara"
                  subtitle="Capturar una fotografía"
                  open={showCamera}
                  onPress={() => setShowCamera(!showCamera)}
                />

                {showCamera && (
                  <View style={styles.expanded}>
                    {photo && (
                      <Image
                        source={{ uri: photo }}
                        resizeMode="cover"
                        style={styles.photo}
                      />
                    )}

                    <Button
                      label={photo ? "Tomar otra foto" : "Tomar fotografía"}
                      onPress={takePhoto}
                    />
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.historyLayout}>
              <View style={styles.historyColumn}>
                <View style={styles.historyHeading}>
                  <Text style={styles.sectionName}>Recorridos</Text>
                  <Text style={styles.secondary}>
                    {history.length} registrados
                  </Text>
                </View>

                {history.length === 0 && (
                  <Text style={styles.empty}>
                    Todavía no hay recorridos guardados.
                  </Text>
                )}

                {history.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelected(item)}
                    style={[
                      styles.historyRow,
                      selected?.id === item.id && styles.selectedRow,
                    ]}
                  >
                    <View>
                      <Text style={styles.historyDistance}>
                        {item.distance.toFixed(3)} km
                      </Text>
                      <Text style={styles.secondary}>{item.date}</Text>
                    </View>

                    <Text style={styles.historySteps}>{item.steps} pasos</Text>
                  </Pressable>
                ))}
              </View>

              {selected && (
                <View style={styles.historyDetail}>
                  <View style={styles.historyHeading}>
                    <Text style={styles.sectionName}>
                      Recorrido seleccionado
                    </Text>
                    <Text style={styles.secondary}>{selected.date}</Text>
                  </View>

                  <MapPanel
                    position={selected.route[selected.route.length - 1]}
                    route={selected.route}
                  />

                  <View style={styles.metricsRow}>
                    <Metric
                      label="Distancia"
                      value={selected.distance.toFixed(3)}
                      unit="km"
                    />
                    <Metric label="Pasos" value={selected.steps.toString()} />
                    <Metric
                      label="Velocidad"
                      value={selected.averageSpeed.toFixed(1)}
                      unit="km/h"
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {notice !== "" && (
            <Pressable onPress={() => setNotice("")} style={styles.notice}>
              <Text style={styles.noticeText}>{notice}</Text>
              <Text style={styles.noticeClose}>×</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  flex: {
    flex: 1,
  },
  topbar: {
    minHeight: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  brand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: "#F3F3F3",
  },
  tabText: {
    fontSize: 13,
    color: "#8F8F8F",
  },
  activeTabText: {
    color: "#171717",
    fontWeight: "500",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 48,
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 960,
  },
  mapArea: {
    overflow: "hidden",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  locationBar: {
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  locationStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#171717",
  },
  coordinate: {
    fontSize: 12,
    color: "#8F8F8F",
    fontVariant: ["tabular-nums"],
  },
  secondary: {
    color: "#8F8F8F",
    fontSize: 12,
    lineHeight: 19,
  },
  label: {
    color: "#4D4D4D",
    fontSize: 13,
    lineHeight: 20,
  },
  mainMetric: {
    paddingTop: 18,
    paddingBottom: 24,
  },
  distanceLine: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
  },
  distanceValue: {
    color: "#171717",
    fontSize: 52,
    fontWeight: "500",
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
  },
  distanceUnit: {
    color: "#8F8F8F",
    fontSize: 16,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EBEBEB",
    paddingVertical: 20,
    gap: 16,
  },
  metric: {
    flex: 1,
    minWidth: 90,
    gap: 6,
  },
  metricLine: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  metricValue: {
    color: "#171717",
    fontSize: 23,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  metricLarge: {
    fontSize: 36,
  },
  metricUnit: {
    color: "#8F8F8F",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    marginBottom: 36,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#171717",
    borderColor: "#171717",
  },
  buttonText: {
    color: "#171717",
    fontSize: 13,
    fontWeight: "500",
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.7,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
  },
  sectionToggle: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    gap: 16,
  },
  sectionName: {
    color: "#171717",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 3,
  },
  toggleIcon: {
    fontSize: 24,
    fontWeight: "300",
    color: "#4D4D4D",
  },
  expanded: {
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },
  detailRow: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#171717",
    fontVariant: ["tabular-nums"],
  },
  helper: {
    color: "#8F8F8F",
    fontSize: 12,
    lineHeight: 19,
    marginVertical: 8,
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 6,
  },
  historyLayout: {
    gap: 32,
  },
  historyColumn: {
    gap: 0,
  },
  historyHeading: {
    paddingVertical: 16,
    gap: 4,
  },
  historyRow: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  selectedRow: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  historyDistance: {
    fontSize: 17,
    fontWeight: "500",
    color: "#171717",
    marginBottom: 4,
  },
  historySteps: {
    fontSize: 12,
    color: "#4D4D4D",
  },
  historyDetail: {
    gap: 18,
  },
  empty: {
    color: "#8F8F8F",
    fontSize: 14,
    paddingVertical: 32,
  },
  notice: {
    marginTop: 24,
    backgroundColor: "#F1F1F1",
    borderRadius: 4,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  noticeText: {
    color: "#4D4D4D",
    fontSize: 13,
    flex: 1,
  },
  noticeClose: {
    color: "#8F8F8F",
    fontSize: 20,
  },
});
