import { Text, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

function DetalleChatScreen() {
  return <Text>Detalle de Conversación</Text>
}

function ChatsScreen({ navigation }) {
  return (
    <View>
      <Text>Lista de chat</Text>
      <Button
        title="Ir al Detalle"
        onPress={() => navigation.navigate('DetalleChat')}
      />
    </View>
  );
}

const ChatsStack = createNativeStackNavigator();
function ChatsStackScreen() {
  return (
    <ChatsStack.Navigator>
      <ChatsStack.Screen name="ListaChats" component={ChatsScreen} options={{ title: 'Chats' }} />
      <ChatsStack.Screen name="DetalleChat" component={DetalleChatScreen} options={{ title: 'Conversación' }} />
    </ChatsStack.Navigator>
  );
}

function EstadosScreen() {
  return <Text>Estados</Text>
}

function LlamadasScreen() {
  return <Text>Llamadas</Text>
}

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Chats')
            iconName = 'chatbubbles';
          else if (route.name === 'Estados')
            iconName = 'images';
          else if (route.name === 'Llamadas')
            iconName = 'call';


          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })
      }
    >
      <Tab.Screen name="Chats" component={ChatsStackScreen} />
      <Tab.Screen name="Estados" component={EstadosScreen} />
      <Tab.Screen name="Llamadas" component={LlamadasScreen} />
    </ Tab.Navigator>
  );
}
