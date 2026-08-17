import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProfileCard from "./src/components/ProfileCard";
import ProfileCardURL from "./src/components/ProfileCardURL";
import GridDemo from "./src/screens/GridDemo";
import StyleDemo from "./src/screens/StyleDemo";

export default function App() {
  return (
    <>
      <SafeAreaProvider style={styles.safe}>
        <View style={styles.container}>
          <ProfileCard />
          <ProfileCardURL
            image="https://http.cat/images/102.jpg"
            name="Gatito HTTP Status 102 "
            description="Un gatito que nos dice el codigo de error http"
          />
        </View>
      </SafeAreaProvider>
      <GridDemo />
      <StyleDemo />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F1F5F9" },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
