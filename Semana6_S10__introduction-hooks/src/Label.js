import { Text } from "react-native";

export default function Label({ children }) {
	return (
		<Text
			style={{
				fontSize: "24px",
				fontWeight: "bold",
				display: "block",
				marginBottom: "16px",
			}}
		>
			{children}
		</Text>
	);
}
