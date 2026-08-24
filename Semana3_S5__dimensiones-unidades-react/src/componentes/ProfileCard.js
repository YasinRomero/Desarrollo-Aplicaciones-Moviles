import { View, Text, Image, StyleSheet, useWindowDimensions, PixelRatio } from "react-native";
import PropTypes from "prop-types";

const scale = (size, width) => PixelRatio.roundToNearestPixel((width / 375) * size);

const ProfileCard = ({ name, age, photo }) => {
	const { width } = useWindowDimensions();
	const nameSize = scale(18, width);
	const ageSize = scale(14, width);

	return (
		<View style={styles.card}>
			<View style={styles.left}>
				<Image
					source={photo}
					style={styles.avatar}
					resizeMode="cover"
					accessible
					accessibilityLabel={`Foto de ${name}`}
				/>
			</View>
			<View style={styles.right}>
				<Text style={[styles.name, { fontSize: nameSize }]} numberOfLines={1}>
					{name}
				</Text>
				<Text style={[styles.age, { fontSize: ageSize }]}>{`Edad: ${age}`}</Text>
			</View>
		</View>
	);
};

ProfileCard.propTypes = {
	name: PropTypes.string.isRequired,
	age: PropTypes.number.isRequired,
	photo: PropTypes.oneOfType([
		PropTypes.shape({ uri: PropTypes.string.isRequired }),
		PropTypes.number,
	]).isRequired,
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		padding: 16,
		backgroundColor: "#fff",
		borderRadius: 14,
		alignItems: "center",
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
	},
	left: { flex: 3, paddingRight: 12 },
	right: { flex: 7 },
	avatar: {
		width: "100%",
		aspectRatio: 1,
		borderRadius: 12,
		backgroundColor: "#eee",
	},
	name: { fontWeight: "700", marginBottom: 4 },
	age: { color: "#555" },
});

export default ProfileCard;
