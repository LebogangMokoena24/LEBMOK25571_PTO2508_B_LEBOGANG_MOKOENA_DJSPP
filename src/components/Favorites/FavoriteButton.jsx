import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ episode, className = "" }) {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const active = isFavorite(episode.id);

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(episode);
      }}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
      aria-pressed={active}
      title={active ? "Remove from favourites" : "Add to favourites"}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
