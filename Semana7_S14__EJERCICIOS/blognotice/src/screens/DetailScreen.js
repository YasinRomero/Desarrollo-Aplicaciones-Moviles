import { View, Text, Button } from "react-native";
import { useNews } from "../context/NewsContext";

export default function DetailScreen({ route }) {
  const { article } = route.params;
  const { favorites, toggleFavorite } = useNews();

  const isFav = favorites.some((fav) => fav.id === article.id);

  return (
    <View>
      <Text>{article.title}</Text>
      <Text>{article.date}</Text>
      <Text>{article.content}</Text>
      <Button
        title={isFav ? "Quitar de Favoritos" : "Guardar en Favoritos"}
        onPress={() => toggleFavorite(article)}
      />
    </View>
  );
}
