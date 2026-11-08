import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 12,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#171717",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#646464",
    marginBottom: 6,
  },

  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    gap: 9,
  },

  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },

  status: {
    fontSize: 12,
    fontWeight: "600",
    color: "#424242",
    backgroundColor: "#eeeeee",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
  },

  cardDescription: {
    fontSize: 13,
    color: "#505050",
    lineHeight: 18,
  },

  detail: {
    fontSize: 13,
    color: "#252525",
    lineHeight: 19,
  },

  button: {
    alignSelf: "flex-start",
    backgroundColor: "#171717",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 7,
    marginTop: 2,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },

  retryButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },

  link: {
    color: "#242424",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  notice: {
    borderLeftWidth: 3,
    borderLeftColor: "#737373",
    paddingLeft: 10,
    color: "#333333",
    fontSize: 13,
    lineHeight: 19,
  },

  small: {
    fontSize: 12,
    color: "#666666",
  },
});
