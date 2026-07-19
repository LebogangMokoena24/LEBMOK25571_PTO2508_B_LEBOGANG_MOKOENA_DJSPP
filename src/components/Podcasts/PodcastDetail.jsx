import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import { getEpisodeId, PLACEHOLDER_AUDIO_URL } from "../../utils/episode";
import GenreTags from "../UI/GenreTags";
import FavoriteButton from "../Favorites/FavoriteButton";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import { ListeningProgressContext } from "../../context/ListeningProgressContext";

export default function PodcastDetail({ podcast, genres }) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();

  const { playEpisode, episode: nowPlaying } = useContext(AudioPlayerContext);
  const { getProgress } = useContext(ListeningProgressContext);

  const handlePlay = (ep, index) => {
    const buildEpisodeMeta = (rawEp, epIndex) => ({
      id: getEpisodeId(podcast.id, selectedSeasonIndex, epIndex),
      title: rawEp.title,
      showTitle: podcast.title,
      showId: podcast.id,
      seasonTitle: season.title,
      image: season.image || podcast.image,
      audioUrl: rawEp.file || PLACEHOLDER_AUDIO_URL,
    });

    const queue = season.episodes.map((rawEp, epIndex) => buildEpisodeMeta(rawEp, epIndex));
    playEpisode(buildEpisodeMeta(ep, index), queue);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>

      <div className={styles.header}>
        <img src={podcast.image} alt="Podcast Cover" className={styles.cover} />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <p className={styles.description}>{podcast.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.seasonInfo}>
              <div><p>Genres</p><GenreTags genres={genres} /></div>
              <div><p>Last Updated:</p><strong>{formatDate(podcast.updated)}</strong></div>
              <div><p>Total Seasons:</p><strong>{podcast.seasons.length} Seasons</strong></div>
              <div>
                <p>Total Episodes:</p>
                <strong>{podcast.seasons.reduce((acc, s) => acc + s.episodes.length, 0)} Episodes</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.seasonDetails}>
        <div className={styles.seasonIntro}>
          <div className={styles.left}>
            <img className={styles.seasonCover} src={season.image} />
            <div>
              <h3>Season {selectedSeasonIndex + 1}: {season.title}</h3>
              <p>{season.description}</p>
              <p className={styles.releaseInfo}>{season.episodes.length} Episodes</p>
            </div>
          </div>
          <select value={selectedSeasonIndex} onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))} className={styles.dropdown}>
            {podcast.seasons.map((s, i) => (
              <option key={i} value={i}>Season {i + 1}</option>
            ))}
          </select>
        </div>

        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => {
            const episodeId = getEpisodeId(podcast.id, selectedSeasonIndex, index);
            const epProgress = getProgress(episodeId);
            const isCurrentlyPlaying = nowPlaying?.id === episodeId;

            return (
              <div key={index} className={styles.episodeCard}>
                <div className={styles.episodeMain}>
                  <img className={styles.episodeCover} src={season.image} alt="" />
                  <div className={styles.episodeInfo}>
                    <p className={styles.episodeTitle}>
                      Episode {index + 1}: {ep.title}{isCurrentlyPlaying ? " 🔊" : ""}
                    </p>
                    <p className={styles.episodeDesc}>{ep.description}</p>
                    {epProgress?.finished && <p className={styles.finishedBadge}>✓ Finished</p>}
                    {epProgress && !epProgress.finished && (
                      <p className={styles.progressBadge}>
                        {Math.round((epProgress.position / epProgress.duration) * 100)}% listened
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.episodeActions}>
                  <button type="button" className={styles.playButton} onClick={() => handlePlay(ep, index)} aria-label={`Play episode ${ep.title}`}>▶</button>
                  <FavoriteButton episode={{
                    id: episodeId, episodeTitle: ep.title, seasonTitle: season.title,
                    showTitle: podcast.title, showId: podcast.id,
                    image: season.image || podcast.image, audioUrl: ep.file || PLACEHOLDER_AUDIO_URL,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
