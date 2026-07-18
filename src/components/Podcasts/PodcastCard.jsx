import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastCard.module.css";
import GenreTags from "../UI/GenreTags";

export default function PodcastCard({ podcast }) {
  const navigate = useNavigate();

  const handleNavigate = (preview) => {
    navigate(`/show/${preview.id}`, { state: { genres: preview.genres } });
  };

  return (
    <div className={styles.card} onClick={() => handleNavigate(podcast)}>
      <img src={podcast.image} alt={podcast.title} />
      <h3>{podcast.title}</h3>
      <p className={styles.seasons}>{podcast.seasons} seasons</p>
      <GenreTags genres={podcast.genres} />
      <p className={styles.updatedText}>
        Updated {formatDate(podcast.updated)}
      </p>
    </div>
  );
}
