import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useFavorites } from './hooks/useFavorites';
import ArticleCard from './src/ArticleCard';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { favorites, toggleFavorite, isLoaded } = useFavorites();

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setArticles(response.data);
      setLastUpdate(new Date().toLocaleString());
    } catch (err) {
      setError('Error de red al cargar las noticias. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  },
   []);

  const displayedArticles = showOnlyFavorites
    ? articles.filter((art) => favorites.some((fav) => fav.id === art.id))
    : articles;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Noticias UTP</Text>
        {lastUpdate ? <Text style={styles.subTitle}>Actualizado: {lastUpdate}</Text> : null}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, showOnlyFavorites && styles.controlButtonActive]} 
          onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
        >
          <Text style={[styles.controlButtonText, showOnlyFavorites && styles.controlButtonTextActive]}>
            {showOnlyFavorites ? 'Ver Todos' : 'Solo Favoritos'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={fetchArticles}>
          <Text style={styles.controlButtonText}>Refrescar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.infoText}>Cargando...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.controlButton} onPress={fetchArticles}>
            <Text style={styles.controlButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayedArticles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isFav = favorites.some((fav) => fav.id === item.id);
            return (
              <ArticleCard 
                article={item} 
                isFavorite={isFav} 
                onToggleFavorite={toggleFavorite} 
              />
            );
          }}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.infoText}>
                {showOnlyFavorites ? 'No tienes artículos favoritos guardados.' : 'No hay datos disponibles.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },

  subTitle: {
    fontSize: 12,
    color: '#555555',
    marginTop: 4,
  },

  controlsContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },

  controlButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  controlButtonActive: {
    backgroundColor: '#000000',
  },

  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },

  controlButtonTextActive: {
    color: '#FFFFFF',
  },

  listContainer: {
    padding: 16,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  infoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#000000',
  },

  errorText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },

});