import { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

const NewsContext = createContext();

const INITIAL_NEWS = [
  {
    id: "1",
    title: "Nueva tecnología AI lanzada",
    summary: "Resumen de la noticia 1",
    content: "Contenido completo de la noticia 1",
    date: new Date().toLocaleTimeString(),
  },
  {
    id: "2",
    title: "Avances en React Native",
    summary: "Resumen de la noticia 2",
    content: "Contenido completo de la noticia 2",
    date: new Date().toLocaleTimeString(),
  },
  {
    id: "3",
    title: "Expo SDK última versión",
    summary: "Resumen de la noticia 3",
    content: "Contenido completo de la noticia 3",
    date: new Date().toLocaleTimeString(),
  },
  {
    id: "4",
    title: "Tendencias de Software 2026",
    summary: "Resumen de la noticia 4",
    content: "Contenido completo de la noticia 4",
    date: new Date().toLocaleTimeString(),
  },
  {
    id: "5",
    title: "Nuevos frameworks web",
    summary: "Resumen de la noticia 5",
    content: "Contenido completo de la noticia 5",
    date: new Date().toLocaleTimeString(),
  },
];

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState(INITIAL_NEWS);
  const [favorites, setFavorites] = useState([]);
  const [intervalTime, setIntervalTime] = useState(5000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
    loadInterval();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      fetchNewArticles();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [intervalTime]);

  const loadFavorites = async () => {
    try {
      const storedFavs = await SecureStore.getItemAsync("FAVORITES");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch (e) {}
  };

  const saveFavorites = async (updatedFavs) => {
    try {
      setFavorites(updatedFavs);
      await SecureStore.setItemAsync("FAVORITES", JSON.stringify(updatedFavs));
    } catch (e) {}
  };

  const loadInterval = async () => {
    try {
      const storedInterval = await SecureStore.getItemAsync("UPDATE_INTERVAL");
      if (storedInterval) {
        setIntervalTime(Number(storedInterval));
      }
    } catch (e) {}
  };

  const changeInterval = async (newTime) => {
    try {
      setIntervalTime(newTime);
      await SecureStore.setItemAsync("UPDATE_INTERVAL", String(newTime));
    } catch (e) {}
  };

  const fetchNewArticles = () => {
    const newArticle = {
      id: Date.now().toString(),
      title: `Noticia en vivo (${new Date().toLocaleTimeString()})`,
      summary:
        "Esta noticia fue generada automáticamente por la simulación de API.",
      content: "Contenido extenso de la noticia generada en tiempo real.",
      date: new Date().toLocaleTimeString(),
    };
    setNews((prev) => [newArticle, ...prev]);
  };

  const refreshNews = () => {
    setIsRefreshing(true);
    fetchNewArticles();
    setIsRefreshing(false);
  };

  const toggleFavorite = (item) => {
    const exists = favorites.some((fav) => fav.id === item.id);
    let updated;
    if (exists) {
      updated = favorites.filter((fav) => fav.id !== item.id);
    } else {
      updated = [...favorites, item];
    }
    saveFavorites(updated);
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    saveFavorites(updated);
  };

  const clearAllNews = () => {
    setNews([]);
  };

  const resetAppStorage = async () => {
    try {
      await SecureStore.deleteItemAsync("FAVORITES");
      await SecureStore.deleteItemAsync("UPDATE_INTERVAL");
      setFavorites([]);
      setIntervalTime(5000);
      setNews(INITIAL_NEWS);
    } catch (e) {}
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        favorites,
        intervalTime,
        isRefreshing,
        toggleFavorite,
        removeFavorite,
        clearAllNews,
        changeInterval,
        resetAppStorage,
        refreshNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
