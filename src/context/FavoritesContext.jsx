import { createContext, useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "podcast-app-favorites";

export const FavoritesContext = createContext();

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (episode) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === episode.id);
      if (exists) {
        return prev.filter((f) => f.id !== episode.id);
      }
      return [...prev, { ...episode, addedAt: new Date().toISOString() }];
    });
  };

  const isFavorite = (episodeId) => favorites.some((f) => f.id === episodeId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
