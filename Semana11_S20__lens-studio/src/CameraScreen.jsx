import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ActionButton from "./ActionButton";
import PhotoPreview from "./PhotoPreview";
import PhotoHistory from "./PhotoHistory";
import { getPhotos, savePhoto } from "./storage";
import styles from "./styles";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const scanningRef = useRef(false);
  const takingRef = useRef(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [mode, setMode] = useState("photo");
  const [cameraReady, setCameraReady] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const [scannedCode, setScannedCode] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain)
      requestPermission();
  }, [permission?.granted, permission?.canAskAgain]);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const savedPhotos = await getPhotos();
        setPhotos(savedPhotos);
        if (savedPhotos.length > 0) setSelectedPhoto(savedPhotos[0]);
      } catch (error) {
        setMessage("No se pudo recuperar el historial.");
      }
    }

    loadPhotos();
  }, []);

  async function takePicture() {
    if (!cameraRef.current || !cameraReady || takingRef.current) return;
    takingRef.current = true;

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        base64: false,
      });

      if (result?.uri) {
        setPendingPhoto({ uri: result.uri, date: new Date().toISOString() });
        setPhotoCount((count) => count + 1);
        setMessage("");
      }
    } catch (error) {
      setMessage("No se pudo capturar la fotografía.");
    } finally {
      takingRef.current = false;
    }
  }

  async function confirmPhoto() {
    if (!pendingPhoto || saving) return;
    setSaving(true);

    try {
      const updatedPhotos = await savePhoto(pendingPhoto, photos);
      setPhotos(updatedPhotos);
      setSelectedPhoto(updatedPhotos[0]);
      setPendingPhoto(null);
      setMessage("Fotografía guardada correctamente.");
    } catch (error) {
      setMessage("No se pudo guardar la fotografía.");
    } finally {
      setSaving(false);
    }
  }

  function discardPhoto() {
    if (!saving) setPendingPhoto(null);
  }

  function openCamera() {
    setSelectedPhoto(null);
    setMode("photo");
    setScannedCode(null);
    setCameraReady(false);
    scanningRef.current = false;
    setMessage("");
  }

  function changeMode() {
    if (mode === "photo") setMode("qr");
    else setMode("photo");

    setCameraReady(false);
    setScannedCode(null);
    scanningRef.current = false;
    setMessage("");
  }

  function handleBarcode({ type, data }) {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScannedCode({ type, data });
  }

  function scanAgain() {
    setScannedCode(null);
    scanningRef.current = false;
  }

  const showCamera = !selectedPhoto && !pendingPhoto;
  const canCapture = cameraReady && !pendingPhoto;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.stats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{photoCount}</Text>
              <Text style={styles.statLabel}>Capturas de esta sesión</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{photos.length}</Text>
              <Text style={styles.statLabel}>Fotografías guardadas</Text>
            </View>
          </View>

          <View style={styles.cameraCard}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>
                {selectedPhoto
                  ? "Última fotografía"
                  : mode === "qr"
                    ? "Escáner de códigos"
                    : "Cámara en vivo"}
              </Text>
              <Text style={styles.status}>
                {selectedPhoto
                  ? "Guardada"
                  : cameraReady
                    ? "Camara Disponible"
                    : "En espera..."}
              </Text>
            </View>

            <View style={styles.cameraFrame}>
              {selectedPhoto ? (
                <Image
                  source={{ uri: selectedPhoto.uri }}
                  style={styles.photo}
                  resizeMode="contain"
                />
              ) : !permission ? (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderTitle}>
                    Solicitando permiso...
                  </Text>
                  <Text style={styles.placeholderText}>
                    Estamos comprobando el acceso a la cámara.
                  </Text>
                </View>
              ) : !permission.granted ? (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderTitle}>
                    Cámara sin autorización
                  </Text>
                  <Text style={styles.placeholderText}>
                    Permite el acceso a la cámara para utilizar esta aplicación.
                  </Text>

                  {permission.canAskAgain && (
                    <View style={{ marginTop: 20 }}>
                      <ActionButton
                        title="Solicitar permiso"
                        onPress={requestPermission}
                      />
                    </View>
                  )}
                </View>
              ) : showCamera ? (
                <CameraView
                  key={`${facing}-${mode}`}
                  ref={cameraRef}
                  style={styles.camera}
                  facing={facing}
                  flash={flash}
                  mode="picture"
                  onCameraReady={() => setCameraReady(true)}
                  onMountError={() => {
                    setCameraReady(false);
                    setMessage("No se pudo iniciar la cámara.");
                  }}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "code128", "pdf417"],
                  }}
                  onBarcodeScanned={
                    mode === "qr" && !scannedCode ? handleBarcode : undefined
                  }
                />
              ) : null}
            </View>

            {selectedPhoto && (
              <Text style={styles.photoDate}>
                Capturada el{" "}
                {new Date(selectedPhoto.date).toLocaleString("es-PE")}
              </Text>
            )}

            <View style={styles.controls}>
              <ActionButton
                title="Fotografía"
                active={mode === "photo"}
                onPress={() => {
                  setSelectedPhoto(null);
                  setMode("photo");
                  setCameraReady(false);
                  setScannedCode(null);
                  scanningRef.current = false;
                }}
              />

              <ActionButton
                title="Escanear QR"
                active={mode === "qr" && !selectedPhoto}
                onPress={() => {
                  setSelectedPhoto(null);

                  if (mode !== "qr") {
                    changeMode();
                  }
                }}
              />

              <ActionButton
                title="Girar cámara"
                onPress={() => {
                  setCameraReady(false);
                  setFacing((current) =>
                    current === "back" ? "front" : "back",
                  );
                }}
                disabled={!!selectedPhoto}
              />

              <ActionButton
                title={flash === "on" ? "Flash ON" : "Flash OFF"}
                active={flash === "on"}
                onPress={() =>
                  setFlash((current) => (current === "off" ? "on" : "off"))
                }
                disabled={!!selectedPhoto}
              />
            </View>

            {selectedPhoto ? (
              <Pressable style={styles.captureButton} onPress={openCamera}>
                <Text style={styles.captureText}>Volver a la cámara</Text>
              </Pressable>
            ) : mode === "photo" ? (
              <Pressable
                style={[styles.captureButton, !canCapture && { opacity: 0.5 }]}
                onPress={takePicture}
                disabled={!canCapture}
              >
                <Text style={styles.captureText}>Tomar fotografía</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.captureButton} onPress={scanAgain}>
                <Text style={styles.captureText}>Escanear nuevamente</Text>
              </Pressable>
            )}

            {!!message && <Text style={styles.confirmation}>{message}</Text>}
          </View>

          {scannedCode && !selectedPhoto && (
            <View style={styles.qrCard}>
              <Text style={styles.qrLabel}>
                CÓDIGO DETECTADO · {scannedCode.type}
              </Text>

              <Text style={styles.qrValue} selectable>
                {scannedCode.data}
              </Text>
            </View>
          )}

          <View style={styles.sectionLine} />

          <PhotoHistory
            photos={photos}
            onSelect={(photo) => {
              setSelectedPhoto(photo);
              setScannedCode(null);
              setMessage("");
            }}
          />
        </View>
      </ScrollView>

      <PhotoPreview
        photo={pendingPhoto}
        onSave={confirmPhoto}
        onDiscard={discardPhoto}
        saving={saving}
      />
    </SafeAreaView>
  );
}
