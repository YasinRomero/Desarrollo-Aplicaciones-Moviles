import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  container: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#737373",
  },

  summary: {
    backgroundColor: "#F0F0F0",
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#525252",
    marginBottom: 6,
  },

  summaryValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#171717",
  },

  summaryNote: {
    fontSize: 12,
    color: "#737373",
    marginTop: 4,
  },

  cards: {
    gap: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 18,
  },

  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#171717",
  },

  status: {
    backgroundColor: "#F5F5F5",
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusGranted: {
    backgroundColor: "#E5E5E5",
    borderColor: "#737373",
  },

  statusDenied: {
    backgroundColor: "#FAFAFA",
    borderColor: "#525252",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#404040",
  },

  cardDescription: {
    fontSize: 13,
    color: "#737373",
    lineHeight: 19,
    marginBottom: 8,
  },

  message: {
    fontSize: 12,
    color: "#525252",
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#171717",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#A3A3A3",
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  actions: {
    marginTop: 20,
    alignItems: "center",
  },

  verifyButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    textDecorationLine: "underline",
    padding: 10,
  },

  lastCheck: {
    fontSize: 12,
    color: "#737373",
    marginTop: 8,
    textAlign: "center",
  },

  note: {
    fontSize: 12,
    color: "#737373",
    lineHeight: 18,
    marginTop: 24,
    textAlign: "center",
  },
});

export default styles;
