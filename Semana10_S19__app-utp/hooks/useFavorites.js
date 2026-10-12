import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedFavorites !== null) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error al guardar favoritos:', error);
      }
    };
    saveFavorites();
  }, [favorites, isLoaded]);

  const toggleFavorite = (article) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((item) => item.id === article.id);
      if (exists) {
        return prevFavorites.filter((item) => item.id !== article.id);
      } else {
        return [...prevFavorites, article];
      }
    });
  };

  return { favorites, toggleFavorite, isLoaded };
}