import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ArticleCard({ article, isFavorite, onToggleFavorite }) {
  return (
    <View style={[styles.card, isFavorite && styles.favoriteCard]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{article.body}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.button, isFavorite ? styles.buttonActive : styles.buttonInactive]} 
        onPress={() => onToggleFavorite(article)}
      >
        <Text style={[styles.buttonText, isFavorite && styles.buttonTextActive]}>
          {isFavorite ? '★ Favorito' : '☆ Marcar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  favoriteCard: {
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#000000',
  },
  
  contentContainer: {
    marginBottom: 12,
  },
  
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  
  body: {
    fontSize: 14,
    color: '#333333',
  },
  
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  buttonActive: {
    backgroundColor: '#000000',
  },
  
  buttonInactive: {
    backgroundColor: '#FFFFFF',
  },
  
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  
  buttonTextActive: {
    color: '#FFFFFF',
  },
  
});