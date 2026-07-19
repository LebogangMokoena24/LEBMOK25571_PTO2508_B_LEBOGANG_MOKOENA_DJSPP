import { useContext, useMemo, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { ListeningProgressContext } from "../context/ListeningProgressContext";
import { AudioPlayerContext } from "../context/AudioPlayerContext";
import { FavoriteButton } from "../components/Favorites";
import styles from "./Favourites.module.css";

const SORT_OPTIONS = [
  { key: "date-desc", label: "Newest Added" },
  { key: "date-asc", label: "Oldest Added" },
  { key: "title-asc", label: "Title A → Z" },
  { key: "title-desc", label: "Title Z → A" },
];

function groupByShow(favorites) {
  return favorites.reduce((groups, fav) => {
    const key = fav.showTitle;
    if (!groups[key]) groups[key] = [];
    groups[key].push(fav);
    return groups;
  }, {});
}

function sortEpisodes(episodes, sortKey) {
  const sorted = [...episodes];
  switch (sortKey) {
    case "title-asc":
      return sorted.sort((a, b) => a.episodeTitle.localeCompare(b.episodeTitle));
    case "title-desc":
      return sorted.sort((a, b) => b.episodeTitle.localeCompare(a.episodeTitle));
    case "date-asc":
      return sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    case "date-desc":
    default:
      return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  }
}

export default function Favourites() {
  const { favorites } = useContext(FavoritesContext);
  const { progress, resetProgress } = useContext(ListeningProgressContext);
  const { playEpisode } = useContext(AudioPlayerContext);
  const [sortKey, setSortKey] = useState("date-desc");
  const [showFilter, setShowFilter] = useState("all");

  const grouped = useMemo(() => groupByShow(favorites), [favorites]);
  const allShowTitles = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
  const visibleShowTitles = showFilter === "all" ? allShowTitles : [showFilter];

  if (favorites.length === 0) {
    return (
      <main className={styles.main}>
        <h1>Favourite Episodes</h1>
        <p className={styles.empty}>
          You haven't favourited any episodes yet. Tap the heart icon on an episode to add it here.
        </p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Favourite Episodes</h1>
      <p className={styles.subheading}>Your saved episodes from all shows</p>

      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>Sort by:</span>
        <select className={styles.select} value={sortKey} onChange={(e) => setSortKey(e.target.value)} aria-label="Sort favourites">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        <select className={styles.select} value={showFilter} onChange={(e) => setShowFilter(e.target.value)} aria-label="Filter by show">
          <option value="all">All Shows</option>
          {allShowTitles.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>

        <button type="button" className={styles.resetButton} onClick={resetProgress} title="Clear all listening history">
          Reset listening history
        </button>
      </div>

      {visibleShowTitles.map((showTitle) => (
        <section key={showTitle} className={styles.group}>
          <h2 className={styles.groupTitle}>
            🎙️ {showTitle}{" "}
            <span className={styles.groupCount}>
              ({grouped[showTitle].length} episode{grouped[showTitle].length === 1 ? "" : "s"})
            </span>
          </h2>
          <ul className={styles.episodeList}>
            {sortEpisodes(grouped[showTitle], sortKey).map((fav) => {
              const epProgress = progress[fav.id];
              return (
                <li key={fav.id} className={styles.episodeCard}>
                  <FavoriteButton episode={fav} className={styles.cardHeart} />
                  <div className={styles.cardBody}>
                    <img src={fav.image} alt="" className={styles.episodeImage} />
                    <div className={styles.episodeInfo}>
                      <p className={styles.episodeTitle}>{fav.episodeTitle}</p>
                      <p className={styles.episodeMeta}>{fav.seasonTitle}</p>
                      <p className={styles.episodeDesc}>
                        {epProgress?.finished && <span className={styles.finished}>✓ Finished</span>}
                        {epProgress && !epProgress.finished && (
                          <span className={styles.inProgress}>
                            {Math.round((epProgress.position / epProgress.duration) * 100)}% listened
                          </span>
                        )}
                      </p>
                      <p className={styles.addedText}>
                        Added on {new Date(fav.addedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.playButton}
                    onClick={() => playEpisode({
                      id: fav.id, title: fav.episodeTitle, showTitle: fav.showTitle,
                      showId: fav.showId, seasonTitle: fav.seasonTitle, image: fav.image, audioUrl: fav.audioUrl,
                    })}
                    aria-label={`Play ${fav.episodeTitle}`}
                  >
                    ▶ Play
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
