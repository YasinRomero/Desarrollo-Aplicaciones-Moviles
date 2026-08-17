import { StyleSheet, View } from "react-native";
import ProfileCard from "./src/components/ProfileCard";
import GridDemo from "./src/screens/GridDemo";
import StyleDemo from "./src/screens/StyleDemo";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <>
      <SafeAreaProvider style={styles.safe}>
        <View style={styles.container}>
          <ProfileCard />
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
