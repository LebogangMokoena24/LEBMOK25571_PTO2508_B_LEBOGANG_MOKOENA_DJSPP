import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import GenreTags from "../UI/GenreTags";
import styles from "./RecommendedCarousel.module.css";

export default function RecommendedCarousel({ shows }) {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  if (!shows || shows.length === 0) return null;

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 220;
    const atStart = track.scrollLeft <= 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

    if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      return;
    }
    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section className={styles.carousel} aria-label="Recommended shows">
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Recommended for you</h2>
        <div className={styles.arrows}>
          <button type="button" aria-label="Scroll left" className={styles.arrowButton} onClick={() => scrollBy(-1)}>‹</button>
          <button type="button" aria-label="Scroll right" className={styles.arrowButton} onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {shows.map((show) => (
          <div key={show.id} className={styles.card} onClick={() => navigate(`/show/${show.id}`, { state: { genres: show.genres } })}>
            <img src={show.image} alt={show.title} className={styles.image} />
            <p className={styles.title}>{show.title}</p>
            <GenreTags genres={show.genres} />
          </div>
        ))}
      </div>
    </section>
  );
}
