import React, { useState } from "react";
import { View, Text, Pressable, Image, ScrollView, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";

export default function CameraScreen({
  cameraRef,
  facing,
  setFacing,
  flash,
  setFlash,
  busy,
  onTakePhotos,
  recentEvidences,
}) {
  const [showGallery, setShowGallery] = useState(false);

  const toggleFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  return (
    <View style={styles.container}>
      {/* Vista de cámara con tamaño explícito para evitar pantalla negra en Android */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {/* Capa superpuesta para los controles y elementos de la interfaz */}
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={toggleFacing}>
            <Text style={styles.iconText}>Girar</Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={toggleFlash}>
            <Text style={styles.iconText}>Flash: {flash.toUpperCase()}</Text>
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => setShowGallery(!showGallery)}
          >
            <Text style={styles.iconText}>
              Galería ({recentEvidences.length})
            </Text>
          </Pressable>
        </View>

        {showGallery && (
          <View style={styles.galleryContainer}>
            <Text style={styles.galleryTitle}>Últimas evidencias:</Text>
            <ScrollView horizontal contentContainerStyle={styles.galleryScroll}>
              {recentEvidences.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.galleryItem}>
                  <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                  <Text style={styles.thumbnailText} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              ))}
              {recentEvidences.length === 0 && (
                <Text style={styles.emptyText}>No hay fotos guardadas</Text>
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.controls}>
          <Pressable
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={onTakePhotos}
            disabled={busy}
          >
            <Text style={styles.buttonText}>
              {busy ? "Capturando..." : "Tomar foto"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#444444",
  },
  iconText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  galleryContainer: {
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333333",
  },
  galleryTitle: {
    color: "#ffffff",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  galleryScroll: {
    flexDirection: "row",
    gap: 8,
  },
  galleryItem: {
    width: 70,
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginBottom: 4,
  },
  thumbnailText: {
    color: "#aaaaaa",
    fontSize: 10,
  },
  emptyText: {
    color: "#888888",
    fontSize: 12,
  },
  controls: {
    padding: 24,
    paddingBottom: 60,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderTopWidth: 1,
    borderTopColor: "#222222",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 16,
  },
});