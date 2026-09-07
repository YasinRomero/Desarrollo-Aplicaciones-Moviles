import { Text, Button } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeTabs from './HomeTabs';

function PerfilScreen() {
  return <Text>Pantalla de Perfil</Text>
}

function ConfiguracionScreen() {
  return <Text>Pantalla de Configuración</Text>
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Button
        title="Cerrar sesión"
        onPress={() => props.navigation.replace('Login')} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Inicio" component={HomeTabs} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Configuración" component={ConfiguracionScreen} />
    </Drawer.Navigator>
  );
}
