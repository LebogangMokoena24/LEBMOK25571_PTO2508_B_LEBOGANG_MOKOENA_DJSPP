import { useContext, useState } from "react";
import { AudioPlayerContext } from "../../context/AudioPlayerContext";
import styles from "./GlobalAudioPlayer.module.css";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function GlobalAudioPlayer() {
  const {
    episode,
    queue,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    seek,
    playNext,
    playPrevious,
    playEpisode,
    setVolume,
    toggleMute,
  } = useContext(AudioPlayerContext);

  const [showQueue, setShowQueue] = useState(false);

  if (!episode) return null;

  const canSkip = queue.length > 1;

  return (
    <div className={styles.player}>
      <div className={styles.info}>
        <img src={episode.image} alt="" className={styles.cover} />
        <div className={styles.text}>
          <p className={styles.title}>{episode.title}</p>
          <p className={styles.subtitle}>
            {episode.showTitle} · {episode.seasonTitle}
          </p>
        </div>
      </div>

      <div className={styles.centerColumn}>
        <div className={styles.transport}>
          <button type="button" className={styles.skipButton} onClick={playPrevious} disabled={!canSkip} aria-label="Previous episode">⏮</button>
          <button type="button" className={styles.playButton} onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>{isPlaying ? "⏸" : "▶"}</button>
          <button type="button" className={styles.skipButton} onClick={playNext} disabled={!canSkip} aria-label="Next episode">⏭</button>
        </div>

        <div className={styles.seekRow}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input type="range" className={styles.seekBar} min={0} max={duration || 0} step={1} value={currentTime} onChange={(e) => seek(Number(e.target.value))} aria-label="Seek" />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.rightControls}>
        <button type="button" className={styles.iconButton} onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>
          {muted || volume === 0 ? "🔇" : "🔊"}
        </button>
        <input type="range" className={styles.volumeSlider} min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" />

        <div className={styles.queueWrapper}>
          <button type="button" className={styles.iconButton} onClick={() => setShowQueue((prev) => !prev)} aria-label="Show up next" title="Up next" disabled={!canSkip}>☰</button>
          {showQueue && canSkip && (
            <ul className={styles.queueList}>
              {queue.map((ep) => (
                <li key={ep.id} className={ep.id === episode.id ? `${styles.queueItem} ${styles.queueItemActive}` : styles.queueItem} onClick={() => { playEpisode(ep, queue); setShowQueue(false); }}>
                  {ep.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
