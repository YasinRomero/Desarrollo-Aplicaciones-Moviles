import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PostsScreen({ route }) {
  const { userId, userName } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts",
        { params: { userId } },
      );
      setPosts(response.data);
    } catch {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const request = setTimeout(loadPosts, 0);

    return () => clearTimeout(request);
  }, [loadPosts]);

  if (loading) {
    return <Text style={styles.message}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{userName}</Text>
      <TouchableOpacity style={styles.button} onPress={loadPosts}>
        <Text style={styles.buttonText}>Recargar datos</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.counter}>
            Mostrando {posts.length} publicaciones
          </Text>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.body}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
    marginVertical: 5,
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  counter: {
    marginBottom: 8,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 6,
    marginBottom: 12,
    padding: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  message: {
    padding: 16,
  },
  error: {
    color: "#dc2626",
    padding: 16,
  },
});
