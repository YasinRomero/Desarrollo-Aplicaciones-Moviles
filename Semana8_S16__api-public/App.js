import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const LIMIT = 20;

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (currentOffset = 0, isRefresh = false) => {
    try {
      if (currentOffset === 0 && !isRefresh) setLoading(true);

      setError(null);

      const response = await axios.get(
        `${API_URL}?offset=${currentOffset}&limit=${LIMIT}`,
      );
      const results = response.data.results;

      if (results.length === 0) {
        setHasMore(false);
        return;
      }

      const detailedPokemons = await Promise.all(
        results.map(async (info) => {
          const res = await axios.get(info.url);
          return res.data;
        }),
      );

      if (isRefresh) {
        setPokemons(detailedPokemons);
      } else {
        setPokemons((prev) => [...prev, ...detailedPokemons]);
      }
    } catch (err) {
      setError("Ocurrió un error al cargar los Pokémon. Verifica tu conexión.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchPokemons(0, true);
  };

  const handleLoadMore = () => {
    if (loading || refreshing || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchPokemons(nextOffset);
  };

  const CardPokemon = ({ data }) => {
    const imageUrl =
      data.sprites?.other?.home?.front_default || data.sprites?.front_default;

    return (
      <TouchableOpacity style={styles.pokeCard}>
        <View style={styles.pokeCardImageContent}>
          <Image
            resizeMode="contain"
            style={styles.pokeCardImage}
            source={{ uri: imageUrl }}
          />
        </View>
        <View style={styles.pokeCardInfo}>
          <Text style={styles.pokeCardName}>
            {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
          </Text>
          <Text style={styles.pokeCardId}>
            #{String(data.id).padStart(3, "0")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PokéDex Lite</Text>
      </View>

      {/* Manejo de Error con botón Reintentar */}
      {error && pokemons.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPokemons(0)}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CardPokemon data={item} />}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && !refreshing ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#ff5350" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>
                  No hay Pokémon disponibles.
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#ff5350",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  pokeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  pokeCardImageContent: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  pokeCardImage: {
    width: "100%",
    height: "100%",
  },
  pokeCardInfo: {
    justifyContent: "center",
  },
  pokeCardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  pokeCardId: {
    fontSize: 14,
    color: "#888",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff5350",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#ff5350",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
