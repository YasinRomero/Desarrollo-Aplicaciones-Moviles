import { View } from "react-native";
import ProfileCard from "./ProfileCard";

export default function DemoProfile() {
	return (
		<View style={{ padding: 16, gap: 12 }}>
			<ProfileCard name="Juan Pérez" age={28} photo={{ uri: "https://picsum.photos" }} />
			<ProfileCard name="Luis García" age={28} photo={{ uri: "https://picsum.photos" }} />
		</View>
	);
}
