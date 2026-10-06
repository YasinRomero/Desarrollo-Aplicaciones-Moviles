import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./src/HomeScreen";
import SettingsScreen from "./src/SettingsScreen";

const THEME_KEY = "@prefs/theme";
const DEFAULT_QTY_KEY = "@prefs/defaultQty";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [defaultQuantity, setDefaultQuantity] = useState("1");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const savedQuantity = await AsyncStorage.getItem(DEFAULT_QTY_KEY);
        const isDark = savedTheme === "dark";

        setDarkMode(isDark);

        if (savedQuantity !== null) {
          setDefaultQuantity(savedQuantity);
        }
      } finally {
        setReady(true);
      }
    };

    loadPreferences();
  }, []);

  const handleThemeChange = (value) => {
    setDarkMode(value);
  };

  if (!ready) {
    return null;
  }

  const colors = darkMode
    ? { background: "#111111", border: "#3A3A3A", text: "#F5F5F5" }
    : { background: "#FFFFFF", border: "#D8D8D8", text: "#111111" };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View style={styles.container}>
        <View style={[styles.navigation, { borderColor: colors.border }]}>
          <Pressable
            style={[
              styles.navigationOption,
              {
                backgroundColor:
                  screen === "home" ? colors.text : colors.background,
              },

              screen === "home" && styles.navigationActive,
            ]}
            onPress={() => setScreen("home")}
          >
            <Text
              style={[
                styles.navigationText,
                { color: screen === "home" ? colors.background : colors.text },
              ]}
            >
              LISTA
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.navigationOption,
              {
                backgroundColor:
                  screen === "settings" ? colors.text : colors.background,
              },

              screen === "settings" && styles.navigationActive,
            ]}
            onPress={() => setScreen("settings")}
          >
            <Text
              style={[
                styles.navigationText,
                {
                  color:
                    screen === "settings" ? colors.background : colors.text,
                },
              ]}
            >
              CONFIGURACIÓN
            </Text>
          </Pressable>
        </View>
        {screen === "home" ? (
          <HomeScreen defaultQuantity={defaultQuantity} darkMode={darkMode} />
        ) : (
          <SettingsScreen
            darkMode={darkMode}
            defaultQuantity={defaultQuantity}
            onThemeChange={handleThemeChange}
            onDefaultQuantityChange={setDefaultQuantity}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  navigation: {
    flexDirection: "row",
    height: 44,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
  },

  navigationOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navigationActive: {
    borderWidth: 1,
  },

  navigationText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
