import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PerfilUsuario from "./src/componentes/PerfilUsuario";
import DemoProfile from "./src/componentes/DemoProfile";

export default function App() {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<PerfilUsuario nombre="Juan Pérez" edad={28} />
				<PerfilUsuario nombre="Ana López" edad={34} />

				<DemoProfile />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
