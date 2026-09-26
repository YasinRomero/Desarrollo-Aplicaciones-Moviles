import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import { useNews } from "../context/NewsContext";

export default function HomeScreen({ navigation }) {
  const { news, clearAllNews, isRefreshing, refreshNews } = useNews();

  const getItemLayout = (data, index) => ({
    length: 70,
    offset: 70 * index,
    index,
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Detail", { article: item })}
    >
      <View>
        <Text>{item.title}</Text>
        <Text>{item.summary}</Text>
        <Text>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Button title="Eliminar todas las noticias" onPress={clearAllNews} />
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshing={isRefreshing}
        onRefresh={refreshNews}
      />
    </View>
  );
}
