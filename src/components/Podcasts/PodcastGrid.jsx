import PodcastCard from "./PodcastCard";
import { PodcastContext } from "../../context/PodcastContext";
import styles from "./PodcastGrid.module.css";
import { useContext } from "react";

export default function PodcastGrid() {
  const { podcasts } = useContext(PodcastContext);
  if (!podcasts.length) {
    return (
      <p className={styles.noResults}>
        No podcasts match your search or filters.
      </p>
    );
  }
  return (
    <div className={styles.grid}>
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
}
