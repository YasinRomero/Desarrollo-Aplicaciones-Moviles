import { NavigationContainer } from "@react-navigation/native";
import { NewsProvider } from "./src/context/NewsContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <NewsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </NewsProvider>
  );
}
