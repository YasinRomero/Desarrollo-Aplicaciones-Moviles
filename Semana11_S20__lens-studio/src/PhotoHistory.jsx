import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";

export default function PhotoHistory({ photos, onSelect }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial reciente</Text>
        <Text style={styles.count}>{photos.length}/3</Text>
      </View>

      {photos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Todavía no hay fotografías</Text>
          <Text style={styles.emptyDescription}>
            Las últimas tres capturas aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          horizontal
          nestedScrollEnabled
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => onSelect(item)}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.date} numberOfLines={1}>
                {new Date(item.date).toLocaleDateString("es-PE")}
              </Text>
              <Text style={styles.time}>
                {new Date(item.date).toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#F7F8F8",
    fontSize: 17,
    fontWeight: "600",
  },

  count: {
    color: "#8A8F98",
    fontSize: 13,
  },

  list: {
    gap: 12,
    paddingBottom: 8,
  },

  item: {
    width: 120,
  },

  image: {
    width: 120,
    height: 128,
    borderRadius: 12,
    backgroundColor: "#18191A",
  },

  date: {
    color: "#E5E5E6",
    fontSize: 12,
    marginTop: 9,
  },

  time: {
    color: "#8A8F98",
    fontSize: 11,
    marginTop: 3,
  },

  empty: {
    borderWidth: 1,
    borderColor: "#303136",
    borderRadius: 12,
    padding: 22,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#F7F8F8",
    fontSize: 14,
    fontWeight: "500",
  },

  emptyDescription: {
    color: "#8A8F98",
    fontSize: 12,
    textAlign: "center",
    marginTop: 7,
  },
});
