import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import { useNews } from "../context/NewsContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useNews();

  const getItemLayout = (data, index) => ({
    length: 70,
    offset: 70 * index,
    index,
  });

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detail", { article: item })}
      >
        <View>
          <Text>{item.title}</Text>
          <Text>{item.summary}</Text>
        </View>
      </TouchableOpacity>
      <Button title="Eliminar" onPress={() => removeFavorite(item.id)} />
    </View>
  );

  return (
    <View>
      {favorites.length === 0 ? (
        <Text>No hay noticias guardadas en favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
        />
      )}
    </View>
  );
}
