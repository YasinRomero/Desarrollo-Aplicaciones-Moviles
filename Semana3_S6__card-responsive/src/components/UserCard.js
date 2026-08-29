import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Image, Text, View } from "react-native-web";

export default function UserCard({ name, age, photo, role, isOnline }) {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: photo }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titleCard}>
            {name.length > 100 ? `${name.substring(0, 100)}...` : name}
          </Text>
          {isOnline && (
            <svg
              xmlns="http://w3.org"
              height="16"
              viewBox="0 -960 960 960"
              width="16"
              fill="#17c92f"
            >
              <path d="m438-452-58-57q-11-11-27.5-11T324-508q-11 11-11 28t11 28l86 86q12 12 28 12t28-12l170-170q12-12 11.5-28T636-592q-12-12-28.5-12.5T579-593zM326-90l-58-98-110-24q-15-3-24-15.5t-7-27.5l11-113-75-86q-10-11-10-26t10-26l75-86-11-113q-2-15 7-27.5t24-15.5l110-24 58-98q8-13 22-17.5t28 1.5l104 44 104-44q14-6 28-1.5t22 17.5l58 98 110 24q15 3 24 15.5t7 27.5l-11 113 75 86q10 11 10 26t-10 26l-75 86 11 113q2 15-7 27.5T802-212l-110 24-58 98q-8 13-22 17.5T584-74l-104-44-104 44q-14 6-28 1.5T326-90" />
            </svg>
          )}
        </View>
        <View style={styles.ageContainer}>
          <View style={styles.ageRow}>
            <Text style={styles.ageText}>Edad: </Text>
            <Text style={styles.ageValue}>{age}</Text>
          </View>
          {role && <Text style={styles.roleText}>{role}</Text>}
        </View>
      </View>
    </View>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  photo: function (props, propName, componentName) {
    if (!/^https?:\/\//.test(props[propName])) {
      return new Error(
        `Invalid prop "${propName}" supplied to "${componentName}". Validation failed. Only HTTPS URLs are allowed.`,
      );
    }
  },
  role: PropTypes.exact({
    optionalProperty: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 4,
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 22,
    gap: 6,
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 10,
        spreadDistance: 2,
        color: "#00000016",
      },
    ],
  },

  cardImage: {
    aspectRatio: 1 / 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#45414116",
  },

  infoContainer: {
    gap: 4,
    paddingInline: 15,
    paddingBottom: 10,
  },

  titleContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleCard: {
    fontFamily: "Monospace",
    fontWeight: "bold",
    color: "#2e3031",
    flex: 1,
  },

  ageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ageRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ageText: {
    fontSize: 10,
    color: "#2e3031",
  },

  ageValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2e3031",
  },

  roleText: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 9,
    borderWidth: 1,
    borderColor: "#cca83b",
    backgroundColor: "#cca83b20",
    borderRadius: 4,
    color: "#cca83b",
  },
});
