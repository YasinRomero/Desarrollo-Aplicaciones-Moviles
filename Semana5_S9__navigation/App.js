import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerMenu from "./DrawerMenu";

function LoginScreen({ navigation }) {
  return (
    <Button
      title="Ingresar"
      onPress={() => navigation.replace('Home')}
    />
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
