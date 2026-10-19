import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#08090A",
  },

  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  container: {
    width: "100%",
    maxWidth: 650,
  },

  brand: {
    color: "#8A8F98",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },

  title: {
    color: "#F7F8F8",
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#8A8F98",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#0F1011",
    borderWidth: 1,
    borderColor: "#252629",
    borderRadius: 12,
    padding: 16,
  },

  statNumber: {
    color: "#F7F8F8",
    fontSize: 24,
    fontWeight: "600",
  },

  statLabel: {
    color: "#8A8F98",
    fontSize: 12,
    marginTop: 6,
  },

  cameraCard: {
    backgroundColor: "#0F1011",
    borderWidth: 1,
    borderColor: "#303136",
    borderRadius: 16,
    padding: 12,
  },

  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 12,
  },

  cameraTitle: {
    color: "#F7F8F8",
    fontSize: 14,
    fontWeight: "600",
  },

  status: {
    color: "#ffffff",
    fontSize: 12,
  },

  cameraFrame: {
    width: "100%",
    height: 350,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#000000",
  },

  camera: {
    flex: 1,
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  placeholderTitle: {
    color: "#F7F8F8",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  placeholderText: {
    color: "#8A8F98",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  photoDate: {
    color: "#8A8F98",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },

  controls: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },

  captureButton: {
    backgroundColor: "#5E6AD2",
    borderRadius: 999,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 16,
  },

  captureText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  confirmation: {
    color: "#00BA7C",
    fontSize: 13,
    textAlign: "center",
    marginTop: 14,
  },

  qrCard: {
    backgroundColor: "#18191A",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },

  qrLabel: {
    color: "#8A8F98",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },

  qrValue: {
    color: "#F7F8F8",
    fontSize: 13,
    lineHeight: 20,
  },

  sectionLine: {
    height: 1,
    backgroundColor: "#252629",
    marginTop: 28,
  },

  footer: {
    color: "#62666D",
    fontSize: 12,
    textAlign: "center",
    marginTop: 28,
  },
});
